export default function LiveBanner() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, background:'linear-gradient(135deg,rgba(59,130,246,.07),rgba(34,197,94,.07))', border:'1px solid rgba(59,130,246,.18)', borderRadius:10, padding:'11px 16px', fontSize:13, marginBottom:16 }}>
      <div className="pulse" style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e', flexShrink:0 }}/>
      <span><strong>Ekanta System</strong> — Real-time data active. All modules synced.</span>
    </div>
  )
}
