const styles = {
  Paid:       { bg:'rgba(34,197,94,.15)',  color:'#86efac' },
  Received:   { bg:'rgba(34,197,94,.15)',  color:'#86efac' },
  Active:     { bg:'rgba(34,197,94,.15)',  color:'#86efac' },
  Delivered:  { bg:'rgba(34,197,94,.15)',  color:'#86efac' },
  Completed:  { bg:'rgba(34,197,94,.15)',  color:'#86efac' },
  'In Stock': { bg:'rgba(34,197,94,.15)',  color:'#86efac' },
  'In Transit':{ bg:'rgba(59,130,246,.15)',color:'#93c5fd' },
  Ordered:    { bg:'rgba(59,130,246,.15)', color:'#93c5fd' },
  Pending:    { bg:'rgba(249,115,22,.15)', color:'#fdba74' },
  'Low Stock':{ bg:'rgba(249,115,22,.15)', color:'#fdba74' },
  Paused:     { bg:'rgba(249,115,22,.15)', color:'#fdba74' },
  Overdue:    { bg:'rgba(239,68,68,.15)',  color:'#fca5a5' },
  Critical:   { bg:'rgba(239,68,68,.15)',  color:'#fca5a5' },
  Cancelled:  { bg:'rgba(239,68,68,.15)',  color:'#fca5a5' },
  Ended:      { bg:'rgba(107,114,128,.15)',color:'#9ca3af' },
  'Out of Stock':{ bg:'rgba(239,68,68,.15)',color:'#fca5a5' },
}
export default function StatusBadge({ status }) {
  const s = styles[status] || { bg:'rgba(107,114,128,.15)', color:'#9ca3af' }
  return <span style={{ display:'inline-block', padding:'2px 8px', borderRadius:5, fontSize:11, fontWeight:500, background:s.bg, color:s.color, whiteSpace:'nowrap' }}>{status}</span>
}
