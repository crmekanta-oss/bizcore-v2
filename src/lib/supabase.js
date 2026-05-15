import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('[Supabase] Init:', SUPABASE_URL)

export const isConfigured = SUPABASE_URL && 
                    SUPABASE_ANON_KEY && 
                    SUPABASE_URL !== 'your-project-url.supabase.co' && 
                    SUPABASE_ANON_KEY !== 'your-anon-key';

if (!isConfigured) {
  console.warn('Supabase is not correctly configured. Please check your .env file.');
}

export const supabase = createClient(
  isConfigured ? SUPABASE_URL : 'https://placeholder-url.supabase.co',
  isConfigured ? SUPABASE_ANON_KEY : 'placeholder-key',
  {
    auth: { persistSession: true },
    global: { fetch: (...args) => fetch(...args).catch(err => {
      console.error('[Supabase Fetch Error]', err);
      throw err;
    })}
  }
)

// ── AUTH HELPERS ─────────────────────────────────────────
export async function signUpTeamMember(email, password, metadata) {
  try {
    console.log('[Supabase Auth] Attempting sign up for:', email)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    if (error) {
      console.error('[Supabase Auth] Sign up error details:', error)
      throw error
    }
    console.log('[Supabase Auth] Sign up success for:', data.user?.id)
    return data
  } catch (err) {
    console.error('Sign up error:', err.message)
    throw err
  }
}

export async function signIn(email, password) {
  try {
    console.log('[Supabase Auth] Attempting sign in for:', email)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      console.error('[Supabase Auth] Sign in error details:', error)
      throw error
    }
    console.log('[Supabase Auth] Sign in success for:', data.user?.id)
    return data
  } catch (err) {
    console.error('Sign in error:', err.message)
    throw err
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (err) {
    console.error('Sign out error:', err.message)
    throw err
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      if (error.message.includes('Auth session missing')) {
        console.log('[Auth] No active session found.');
        return null;
      }
      throw error;
    }
    return user
  } catch (err) {
    // Silently return null for expected "no session" states
    return null
  }
}

export async function getUserProfile(userId) {
  try {
    // Try users table first
    let { data, error } = await supabase
      .from('users')
      .select('role, status, username')
      .eq('auth_user_id', userId)
      .maybeSingle()

    // Fallback to team_members
    if (!data && !error) {
      const { data: teamData } = await supabase
        .from('team_members')
        .select('role, status')
        .eq('auth_user_id', userId)
        .maybeSingle()
      data = teamData
    }
    
    if (error) throw error
    return data
  } catch (err) {
    console.error('Error fetching user profile:', err.message)
    return null
  }
}

// ── GENERIC CRUD HELPERS ─────────────────────────────────
export async function fetchAll(table) {
  try {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  } catch (err) {
    console.error(`Error fetching ${table}:`, err.message)
    throw err
  }
}

export async function insertRow(table, row) {
  try {
    const { data, error } = await supabase.from(table).insert([row]).select()
    if (error) throw error
    return data[0]
  } catch (err) {
    console.error(`Error inserting into ${table}:`, err.message)
    throw err
  }
}

export async function updateRow(table, id, updates) {
  try {
    const { data, error } = await supabase.from(table).update(updates).eq('id', id).select()
    if (error) throw error
    return data[0]
  } catch (err) {
    console.error(`Error updating ${table} (id:${id}):`, err.message)
    throw err
  }
}

export async function deleteRow(table, id) {
  try {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) throw error
  } catch (err) {
    console.error(`Error deleting from ${table} (id:${id}):`, err.message)
    throw err
  }
}
