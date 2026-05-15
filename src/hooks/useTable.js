import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase, fetchAll, insertRow, updateRow, deleteRow, signUpTeamMember } from '../lib/supabase'

/**
 * Generic CRUD hook with live Supabase CRUD + realtime sync.
 * Provides: rows, loading, error, add, edit, remove, refresh + realtime subscription
 */
export function useTable(tableName, initialData = []) {
  const [rows, setRows]       = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const isConfigured = useMemo(() => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return !!url && !!key && !url.includes('your-project') && key !== 'your-anon-key';
  }, [])

  const refresh = useCallback(async () => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error(`Error fetching ${tableName}:`, error);
    else setRows(data || []);
    setLoading(false);
  }, [tableName, isConfigured]);

  useEffect(() => {
    refresh();

    if (isConfigured) {
      const channel = supabase
        .channel(`${tableName}_realtime_${Math.random().toString(36).substring(7)}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: tableName },
          () => {
            refresh();
          }
        );

      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[Supabase] Subscribed to ${tableName} realtime`);
        }
      });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [refresh, tableName, isConfigured]);

  const add = useCallback(async (row) => {
    // Custom logic for users/team_members to handle simple auth
    if (tableName === 'users') {
      const cleanUsername = (row.username || '').trim()
      const cleanName = (row.name || '').trim()
      
      if (!cleanUsername || !row.password) {
        const msg = 'Username and Password are required';
        setError(msg);
        alert(msg);
        return null;
      }

      setLoading(true);
      try {
        // 1. Check if user already exists
        const { data: existing } = await supabase
          .from(tableName)
          .select('id')
          .eq('username', cleanUsername)
          .maybeSingle();
        
        if (existing) throw new Error('Username already taken.');

        // 2. Save to DB table (including password as requested for simple system)
        const record = {
          name: cleanName,
          username: cleanUsername,
          password: row.password,
          role: row.role || 'Viewer'
        };

        const { data: saved, error: dbErr } = await supabase
          .from(tableName)
          .upsert(record, { onConflict: 'username' })
          .select()
          .single();

        if (dbErr) throw dbErr;

        if (saved) {
          setRows(prev => [saved, ...prev.filter(r => r.username !== cleanUsername)]);
          return saved;
        }
      } catch (e) {
        setError(e.message);
        alert(`Error: ${e.message}`);
        return null;
      } finally {
        setLoading(false);
      }
      return null;
    }

    if (!isConfigured) {
      const newRow = { ...row, id: Date.now(), created_at: new Date().toISOString() }
      setRows(prev => [newRow, ...prev])
      return newRow
    }
    try {
      const saved = await insertRow(tableName, row)
      if (saved) {
        setRows(prev => [saved, ...prev])
        return saved
      }
    } catch (e) { 
      setError(e.message)
      alert(`Error saving to database: ${e.message}`)
      console.error(`[Supabase] Add error (${tableName}):`, e.message)
    }
    return null
  }, [tableName, isConfigured])

  const edit = useCallback(async (id, updates) => {
    if (!isConfigured) {
      setRows(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))
      return
    }
    try { 
      const updated = await updateRow(tableName, id, updates)
      if (updated) setRows(prev => prev.map(r => r.id === id ? updated : r))
    } catch (e) { 
      setError(e.message)
      console.error(`[Supabase] Edit error (${tableName}):`, e.message)
      refresh() 
    }
  }, [tableName, isConfigured, refresh])

  const remove = useCallback(async (id) => {
    if (!isConfigured) {
      setRows(prev => prev.filter(r => r.id !== id))
      return
    }
    try { 
      await deleteRow(tableName, id)
      setRows(prev => prev.filter(r => r.id !== id))
    } catch (e) { 
      setError(e.message)
      console.error(`[Supabase] Delete error (${tableName}):`, e.message)
      refresh() 
    }
  }, [tableName, isConfigured, refresh])

  return useMemo(() => ({ 
    rows, setRows, loading, error, add, edit, remove, refresh 
  }), [rows, loading, error, add, edit, remove, refresh])
}
