const tabs = [
  { key:'admin', label:'🛠 Admin Dashboard',     activeStyle:{ background:'rgba(59,130,246,.15)',  border:'1px solid #3b82f6', color:'#93c5fd'  } },
  { key:'mkt',   label:'📣 Marketing & Ads', activeStyle:{ background:'rgba(249,115,22,.15)', border:'1px solid #f97316', color:'#fdba74'  } },
  { key:'ceo',   label:'👔 CEO Dashboard',        activeStyle:{ background:'rgba(34,197,94,.15)',  border:'1px solid #22c55e', color:'#86efac'  } },
]

export default function RoleTabs({ role, setRole }) {
  return (
    <div style={{ display:'flex', gap:6, marginBottom:20 }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => setRole(t.key)}
          style={{
            padding:'7px 16px', borderRadius:8, fontSize:13, fontWeight:500,
            cursor:'pointer', transition:'all .2s',
            ...(role === t.key ? t.activeStyle : { background:'transparent', border:'1px solid var(--border)', color:'var(--muted)' })
          }}>
          {t.label}
        </button>
      ))}
    </div>
  )
}
