export default function Panel({ title, tag, tagColor, tagBg, children, style }) {
  return (
    <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, padding:18, transition:'background .3s', ...style }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <span style={{ fontFamily:'Syne,sans-serif', fontSize:14, fontWeight:600, color:'var(--text)' }}>{title}</span>
        {tag && <span style={{ fontSize:11, padding:'3px 9px', borderRadius:6, fontWeight:500, background:tagBg||'rgba(59,130,246,.18)', color:tagColor||'#93c5fd' }}>{tag}</span>}
      </div>
      {children}
    </div>
  )
}
