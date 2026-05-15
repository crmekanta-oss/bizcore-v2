export const adminStats = [
  { icon:'📊', label:'Total Sales',    value:'₹24.6L', change:'12.4% vs last month', up:true,  color:'#3b82f6' },
  { icon:'📦', label:'Stock in Hand',  value:'3,840',  change:'340 units low',       up:false, color:'#f97316' },
  { icon:'💳', label:'Supplier Due',   value:'₹8.2L',  change:'2 pending',           up:false, color:'#8b5cf6' },
  { icon:'💰', label:'Receivables',    value:'₹11.9L', change:'6 due this week',     up:true,  color:'#22c55e' },
]

export const salesData = [
  { day:'Mon', sales:42000 },
  { day:'Tue', sales:68000 },
  { day:'Wed', sales:51000 },
  { day:'Thu', sales:83000 },
  { day:'Fri', sales:74000 },
  { day:'Sat', sales:92000 },
  { day:'Sun', sales:57000 },
]

export const inventory = [
  { name:'Cotton fabric',  units:'2,400 units', pct:78, color:'#3b82f6' },
  { name:'Polyester',      units:'980 units',   pct:32, color:'#f97316' },
  { name:'Silk blend',     units:'460 units',   pct:15, color:'#ef4444' },
  { name:'Denim',          units:'1,600 units', pct:52, color:'#22c55e' },
]

export const suppliers = [
  { name:'Raghav Textiles', amount:'₹1,20,000', status:'Paid'    },
  { name:'Mitra Fabrics',   amount:'₹84,500',   status:'Pending' },
  { name:'SK Yarns',        amount:'₹2,30,000', status:'Overdue' },
  { name:'Loom & Co',       amount:'₹67,000',   status:'Paid'    },
]

export const receivables = [
  { client:'Fashionista Ltd', due:'₹3,40,000', status:'Pending'  },
  { client:'Urban Wear',      due:'₹1,80,000', status:'Received' },
  { client:'Style Hub',       due:'₹90,500',   status:'Overdue'  },
]

export const fabricOrders = [
  { fabric:'Cotton Twill',   qty:'800 m',   supplier:'Raghav Textiles', date:'12 May 2026' },
  { fabric:'Polyester Satin',qty:'500 m',   supplier:'SK Yarns',        date:'18 May 2026' },
  { fabric:'Silk Organza',   qty:'200 m',   supplier:'Mitra Fabrics',   date:'22 May 2026' },
]
