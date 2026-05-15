import { useTheme } from '../context/ThemeContext'

export default function StatCard({ icon, label, value, change, up, accentColor, onClick }) {
  const { dark } = useTheme()
  return (
    <div className="fade-up"
      onClick={onClick}
      style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, padding:16, position:'relative', overflow:'hidden', cursor:onClick?'pointer':'default', transition:'all .2s' }}
      onMouseEnter={e=>{ if(onClick) e.currentTarget.style.borderColor=accentColor+'66' }}
      onMouseLeave={e=>{ if(onClick) e.currentTarget.style.borderColor='var(--border)' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:accentColor }}/>
      <div style={{ fontSize:20, marginBottom:8 }}>{icon}</div>
      <div style={{ fontSize:11.5, color:'var(--muted)', marginBottom:4 }}>{label}</div>
      <div style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:700, color:'var(--text)' }}>{value}</div>
      {change && <div style={{ fontSize:11.5, marginTop:4, color:up?'#22c55e':'#ef4444' }}>{up?'↑':'↓'} {change}</div>}
    </div>
  )
}
