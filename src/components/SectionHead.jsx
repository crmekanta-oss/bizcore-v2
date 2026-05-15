export default function SectionHead({ icon, label, color }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, margin:'28px 0 16px', paddingBottom:10, borderBottom:'1px solid var(--border)' }}>
      <span style={{ fontSize:18 }}>{icon}</span>
      <span style={{ fontFamily:'Syne,sans-serif', fontSize:16, fontWeight:700, color }}>{label}</span>
    </div>
  )
}
