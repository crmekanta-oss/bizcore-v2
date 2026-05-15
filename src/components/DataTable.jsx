import { useState } from 'react'
import { Search, Edit2, Trash2, Plus, FileText, FileSpreadsheet } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import StatusBadge from './StatusBadge'
import DataModal from './DataModal'
import { exportToPDF, exportToExcel } from '../utils/exportUtils'

export default function DataTable({ title, icon, rows, schema, onAdd, onEdit, onDelete, canWrite = true, accentColor = '#3b82f6', columns }) {
  const { dark } = useTheme()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const bg     = dark ? '#161923' : '#ffffff'
  const border = dark ? '#252a38' : '#e2e6ef'
  const text   = dark ? '#dde3f0' : '#1a2035'
  const muted  = dark ? '#6b7280' : '#8892aa'
  const hover  = dark ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.025)'
  const inputBg= dark ? '#0c0e14' : '#f3f5fb'

  const filtered = rows.filter(r =>
    Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  )

  const cols = columns || schema.map(f => ({ key:f.key, label:f.label }))

  const fmt = (val, key) => {
    if (key === 'status') return <StatusBadge status={val} />
    if (key === 'username') return String(val)
    if (key === 'email') return String(val).split('@')[0]
    if (typeof val === 'number' && (key==='amount'||key==='budget'||key==='spend'||key==='revenue')) return `₹${val.toLocaleString('en-IN')}`
    if (val === null || val === undefined) return '—'
    return String(val)
  }

  return (
    <div style={{ background:bg, border:`1px solid ${border}`, borderRadius:14, overflow:'hidden', marginBottom:16 }}>
      {/* Table header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderBottom:`1px solid ${border}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:16 }}>{icon}</span>
          <span style={{ fontFamily:'Syne,sans-serif', fontSize:14, fontWeight:700, color:text }}>{title}</span>
          <span style={{ fontSize:11.5, padding:'2px 8px', borderRadius:999, background:`${accentColor}18`, color:accentColor, fontWeight:600 }}>{filtered.length}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {/* Search */}
          <div style={{ position:'relative' }}>
            <Search size={13} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:muted }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…"
              style={{ padding:'7px 10px 7px 30px', background:inputBg, border:`1px solid ${border}`, borderRadius:8, fontSize:12.5, color:text, outline:'none', width:160, fontFamily:'inherit' }}/>
          </div>

          {/* Export Buttons */}
          <button onClick={() => exportToPDF(title, cols, filtered)}
            title="Export to PDF"
            style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 12px', background:hover, border:`1px solid ${border}`, borderRadius:8, color:text, fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:'inherit', transition:'all .2s' }}>
            <FileText size={14}/> <span className="hidden sm:inline">PDF</span>
          </button>
          <button onClick={() => exportToExcel(title, cols, filtered)}
            title="Export to Excel"
            style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 12px', background:hover, border:`1px solid ${border}`, borderRadius:8, color:text, fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:'inherit', transition:'all .2s' }}>
            <FileSpreadsheet size={14}/> <span className="hidden sm:inline">Excel</span>
          </button>

          {/* Add button */}
          {canWrite && (
            <button onClick={() => { setEditing(null); setModalOpen(true) }}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', background:accentColor, border:'none', borderRadius:8, color:'#fff', fontSize:12.5, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
              <Plus size={14}/> Add
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background: dark?'rgba(255,255,255,.02)':'rgba(0,0,0,.025)' }}>
              {cols.map(c => (
                <th key={c.key} style={{ textAlign:'left', padding:'9px 14px', color:muted, fontWeight:500, fontSize:11.5, borderBottom:`1px solid ${border}`, whiteSpace:'nowrap' }}>{c.label}</th>
              ))}
              {canWrite && <th style={{ padding:'9px 14px', color:muted, fontWeight:500, fontSize:11.5, borderBottom:`1px solid ${border}`, textAlign:'right' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={cols.length + (canWrite?1:0)} style={{ padding:'32px', textAlign:'center', color:muted, fontSize:13 }}>No records found</td></tr>
            ) : filtered.map(row => (
              <tr key={row.id}
                style={{ borderBottom:`1px solid ${border}`, transition:'background .12s' }}
                onMouseEnter={e=>e.currentTarget.style.background=hover}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                {cols.map(c => (
                  <td key={c.key} style={{ padding:'10px 14px', color:text, whiteSpace:c.key==='campaign'||c.key==='client'||c.key==='supplier'?'nowrap':'normal' }}>
                    {fmt(row[c.key], c.key)}
                  </td>
                ))}
                {canWrite && (
                  <td style={{ padding:'10px 14px', textAlign:'right', whiteSpace:'nowrap' }}>
                    <button onClick={()=>{ setEditing(row); setModalOpen(true) }}
                      style={{ background:'none', border:`1px solid ${border}`, borderRadius:6, color:muted, cursor:'pointer', padding:'4px 8px', marginRight:6, display:'inline-flex', alignItems:'center', gap:4, fontSize:12 }}>
                      <Edit2 size={12}/> Edit
                    </button>
                    <button onClick={()=>setDeleting(row.id)}
                      style={{ background:'none', border:'1px solid rgba(239,68,68,.3)', borderRadius:6, color:'#ef4444', cursor:'pointer', padding:'4px 8px', display:'inline-flex', alignItems:'center', gap:4, fontSize:12 }}>
                      <Trash2 size={12}/> Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <DataModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSave={data => editing ? onEdit(editing.id, data) : onAdd(data)}
        schema={schema}
        initialData={editing}
        title={editing ? `Edit ${title}` : `Add ${title}`}
      />

      {/* Delete confirm */}
      {deleting && (
        <div style={{ position:'fixed', inset:0, zIndex:1001, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }}>
          <div style={{ background:bg, border:`1px solid ${border}`, borderRadius:14, padding:'28px 32px', maxWidth:360, textAlign:'center', boxShadow:'0 24px 60px rgba(0,0,0,.5)' }}>
            <div style={{ fontSize:32, marginBottom:12 }}>🗑</div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:16, fontWeight:700, color:text, marginBottom:8 }}>Delete Record?</div>
            <div style={{ fontSize:13.5, color:muted, marginBottom:22 }}>This action cannot be undone.</div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setDeleting(null)} style={{ flex:1, padding:'10px', borderRadius:9, background:'transparent', border:`1px solid ${border}`, color:muted, fontSize:13.5, cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
              <button onClick={()=>{ onDelete(deleting); setDeleting(null) }} style={{ flex:1, padding:'10px', borderRadius:9, background:'#ef4444', border:'none', color:'#fff', fontSize:13.5, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
