// ── ADMIN DATA ──────────────────────────────────────────────────────────
export const initSales = [
  { id:1, date:'2026-05-01', client:'Fashionista Ltd',  product:'Cotton Kurta', qty:120, amount:84000,  status:'Completed' },
  { id:2, date:'2026-05-02', client:'Urban Wear',       product:'Denim Jacket', qty:60,  amount:132000, status:'Completed' },
  { id:3, date:'2026-05-03', client:'Style Hub',        product:'Silk Saree',   qty:30,  amount:90000,  status:'Pending'   },
  { id:4, date:'2026-05-04', client:'Trend Factory',    product:'Polyester Shirt',qty:200,amount:60000, status:'Completed' },
  { id:5, date:'2026-05-05', client:'Fabric World',     product:'Linen Pants',  qty:80,  amount:48000,  status:'Pending'   },
]

export const initInventory = [
  { id:1, name:'Cotton Twill',    category:'Fabric', units:2400, unit:'metres', reorder:500, cost:180, status:'In Stock'    },
  { id:2, name:'Polyester Satin', category:'Fabric', units:980,  unit:'metres', reorder:300, cost:120, status:'Low Stock'   },
  { id:3, name:'Silk Organza',    category:'Fabric', units:460,  unit:'metres', reorder:200, cost:650, status:'Low Stock'   },
  { id:4, name:'Denim Heavy',     category:'Fabric', units:1600, unit:'metres', reorder:400, cost:210, status:'In Stock'    },
  { id:5, name:'Linen Natural',   category:'Fabric', units:120,  unit:'metres', reorder:300, cost:290, status:'Critical'    },
]

export const initPayments = [
  { id:1, supplier:'Raghav Textiles', invoice:'INV-001', amount:120000, due:'2026-05-10', paid_on:'2026-05-08', status:'Paid'    },
  { id:2, supplier:'Mitra Fabrics',   invoice:'INV-002', amount:84500,  due:'2026-05-12', paid_on:null,         status:'Pending' },
  { id:3, supplier:'SK Yarns',        invoice:'INV-003', amount:230000, due:'2026-04-30', paid_on:null,         status:'Overdue' },
  { id:4, supplier:'Loom & Co',       invoice:'INV-004', amount:67000,  due:'2026-05-15', paid_on:'2026-05-14', status:'Paid'    },
  { id:5, supplier:'Weave Masters',   invoice:'INV-005', amount:95000,  due:'2026-05-20', paid_on:null,         status:'Pending' },
]

export const initReceivables = [
  { id:1, client:'Fashionista Ltd', invoice:'REC-001', amount:340000, due:'2026-05-08', status:'Pending'  },
  { id:2, client:'Urban Wear',      invoice:'REC-002', amount:180000, due:'2026-05-05', status:'Received' },
  { id:3, client:'Style Hub',       invoice:'REC-003', amount:90500,  due:'2026-04-28', status:'Overdue'  },
  { id:4, client:'Trend Factory',   invoice:'REC-004', amount:125000, due:'2026-05-18', status:'Pending'  },
  { id:5, client:'Fabric World',    invoice:'REC-005', amount:67500,  due:'2026-05-25', status:'Pending'  },
]

export const initFabric = [
  { id:1, fabric:'Cotton Twill 240gsm', qty:'800 m',  supplier:'Raghav Textiles', order_date:'2026-05-01', delivery:'2026-05-12', amount:144000, status:'In Transit' },
  { id:2, fabric:'Polyester Satin',      qty:'500 m',  supplier:'SK Yarns',        order_date:'2026-05-03', delivery:'2026-05-18', amount:60000,  status:'Ordered'    },
  { id:3, fabric:'Silk Organza',         qty:'200 m',  supplier:'Mitra Fabrics',   order_date:'2026-05-04', delivery:'2026-05-22', amount:130000, status:'Ordered'    },
  { id:4, fabric:'Denim 12oz',           qty:'600 m',  supplier:'Loom & Co',       order_date:'2026-04-28', delivery:'2026-05-09', amount:126000, status:'Delivered'  },
]

export const initTeam = [
  { id:1, name:'John Doe',   email:'john@ekanta.com', role:'admin',     status:'Active' },
  { id:2, name:'Jane Smith', email:'jane@ekanta.com', role:'marketing', status:'Active' },
]

// ── MARKETING DATA ──────────────────────────────────────────────────────
export const initGoogleAds = [
  { id:1, campaign:'Brand Search',       budget:35000, spend:35000, clicks:8200,  impressions:100000, ctr:'8.2%', conversions:120, revenue:456000, status:'Active' },
  { id:2, campaign:'Product Keywords',   budget:50000, spend:45000, clicks:12400, impressions:203000, ctr:'6.1%', conversions:140, revenue:560000, status:'Active' },
  { id:3, campaign:'Display Retarget',   budget:30000, spend:25000, clicks:5800,  impressions:118000, ctr:'4.9%', conversions:54,  revenue:162000, status:'Paused' },
  { id:4, campaign:'Shopping Ads',       budget:20000, spend:15000, clicks:1600,  impressions:29000,  ctr:'5.5%', conversions:26,  revenue:78000,  status:'Active' },
]

export const initMetaAds = [
  { id:1, campaign:'Facebook Feed',       budget:35000, spend:30000, reach:120000, impressions:180000, ctr:'5.8%', conversions:110, revenue:330000, status:'Active' },
  { id:2, campaign:'Instagram Stories',   budget:30000, spend:25000, reach:98000,  impressions:140000, ctr:'4.9%', conversions:85,  revenue:255000, status:'Active' },
  { id:3, campaign:'Reels Boost',         budget:20000, spend:18000, reach:92000,  impressions:128000, ctr:'4.2%', conversions:62,  revenue:186000, status:'Active' },
  { id:4, campaign:'Lookalike Audience',  budget:15000, spend:12000, reach:50000,  impressions:72000,  ctr:'5.4%', conversions:33,  revenue:99000,  status:'Paused' },
]

// ── CEO SUMMARY STATS ───────────────────────────────────────────────────
export const ceoStats = [
  { icon:'📊', label:'Net Revenue',      value:'₹38.4L', change:'15.2% YoY',    up:true,  color:'#22c55e' },
  { icon:'🏦', label:'Bank Balance',     value:'₹19.1L', change:'Healthy',       up:true,  color:'#3b82f6' },
  { icon:'📈', label:'Ads ROAS',         value:'4.2×',   change:'Improving',     up:true,  color:'#f97316' },
  { icon:'💼', label:'Investment',       value:'₹52L',   change:'9.4% returns',  up:true,  color:'#8b5cf6' },
]

export const investments = [
  { id:1, name:'Equity Holdings',  value:'₹28L', change:'+11.2%', up:true  },
  { id:2, name:'Fixed Deposits',   value:'₹16L', change:'+7.0%',  up:true  },
  { id:3, name:'Working Capital',  value:'₹8L',  change:'−2.1%',  up:false },
]

export const decisions = [
  { dot:'#22c55e', title:'Increase fabric orders 20%',  body:'Silk Blend & Polyester below threshold. Reorder recommended.' },
  { dot:'#f97316', title:'Clear overdue receivables',   body:'₹4.3L overdue from 3 clients. Escalate Style Hub follow-up.' },
  { dot:'#3b82f6', title:'Scale Meta Ads spend',        body:'Meta ROAS 4.9× is highest. Increase budget by ₹40,000.' },
  { dot:'#8b5cf6', title:'Review investment returns',   body:'Portfolio at 9.4% YTD. Rebalance allocation for Q3.' },
]

export const salesChartData = [
  { day:'Mon', sales:42000 }, { day:'Tue', sales:68000 }, { day:'Wed', sales:51000 },
  { day:'Thu', sales:83000 }, { day:'Fri', sales:74000 }, { day:'Sat', sales:92000 }, { day:'Sun', sales:57000 },
]

// ── FORM SCHEMAS ────────────────────────────────────────────────────────
export const FORM_SCHEMAS = {
  sales: [
    { key:'date',    label:'Date',     type:'date',   required:true },
    { key:'client',  label:'Client',   type:'text',   required:true, placeholder:'Client name' },
    { key:'product', label:'Product',  type:'text',   required:true, placeholder:'Product name' },
    { key:'qty',     label:'Quantity', type:'number', required:true, placeholder:'0' },
    { key:'amount',  label:'Amount ₹', type:'number', required:true, placeholder:'0' },
    { key:'status',  label:'Status',   type:'select', options:['Pending','Completed','Cancelled'] },
  ],
  inventory: [
    { key:'name',     label:'Item Name',  type:'text',   required:true, placeholder:'Item name' },
    { key:'category', label:'Category',   type:'text',   required:true, placeholder:'Category' },
    { key:'units',    label:'Units',      type:'number', required:true, placeholder:'0' },
    { key:'unit',     label:'Unit Type',  type:'text',   placeholder:'metres / pcs' },
    { key:'reorder',  label:'Reorder Qty',type:'number', placeholder:'0' },
    { key:'cost',     label:'Cost ₹/unit',type:'number', placeholder:'0' },
    { key:'status',   label:'Status',     type:'select', options:['In Stock','Low Stock','Critical','Out of Stock'] },
  ],
  payments: [
    { key:'supplier', label:'Supplier',   type:'text',   required:true, placeholder:'Supplier name' },
    { key:'invoice',  label:'Invoice #',  type:'text',   required:true, placeholder:'INV-000' },
    { key:'amount',   label:'Amount ₹',   type:'number', required:true, placeholder:'0' },
    { key:'due',      label:'Due Date',   type:'date',   required:true },
    { key:'status',   label:'Status',     type:'select', options:['Pending','Paid','Overdue'] },
  ],
  receivables: [
    { key:'client',  label:'Client',     type:'text',   required:true, placeholder:'Client name' },
    { key:'invoice', label:'Invoice #',  type:'text',   required:true, placeholder:'REC-000' },
    { key:'amount',  label:'Amount ₹',   type:'number', required:true, placeholder:'0' },
    { key:'due',     label:'Due Date',   type:'date',   required:true },
    { key:'status',  label:'Status',     type:'select', options:['Pending','Received','Overdue'] },
  ],
  fabric: [
    { key:'fabric',      label:'Fabric Name',  type:'text',   required:true, placeholder:'Fabric name' },
    { key:'qty',         label:'Quantity',     type:'text',   required:true, placeholder:'500 m' },
    { key:'supplier',    label:'Supplier',     type:'text',   required:true, placeholder:'Supplier name' },
    { key:'order_date',  label:'Order Date',   type:'date',   required:true },
    { key:'delivery',    label:'Delivery Date',type:'date',   required:true },
    { key:'amount',      label:'Amount ₹',     type:'number', required:true, placeholder:'0' },
    { key:'status',      label:'Status',       type:'select', options:['Ordered','In Transit','Delivered','Cancelled'] },
  ],
  google_ads: [
    { key:'campaign',    label:'Campaign Name', type:'text',   required:true, placeholder:'Campaign name' },
    { key:'type',        label:'Campaign Type', type:'select', options:['Search','Display','Shopping','Video','Discovery'] },
    { key:'budget',      label:'Budget ₹',      type:'number', required:true, placeholder:'0' },
    { key:'spend',       label:'Spend ₹',       type:'number', required:true, placeholder:'0' },
    { key:'clicks',      label:'Clicks',        type:'number', placeholder:'0' },
    { key:'impressions', label:'Impressions',   type:'number', placeholder:'0' },
    { key:'conversions', label:'Conversions',   type:'number', placeholder:'0' },
    { key:'revenue',     label:'Revenue ₹',     type:'number', placeholder:'0' },
    { key:'status',      label:'Status',        type:'select', options:['Active','Paused','Ended'] },
  ],
  meta_ads: [
    { key:'campaign',    label:'Campaign Name', type:'text',   required:true, placeholder:'Campaign name' },
    { key:'type',        label:'Campaign Type', type:'select', options:['Feed','Stories','Reels','Messenger','Marketplace'] },
    { key:'budget',      label:'Budget ₹',      type:'number', required:true, placeholder:'0' },
    { key:'spend',       label:'Spend ₹',       type:'number', required:true, placeholder:'0' },
    { key:'reach',       label:'Reach',         type:'number', placeholder:'0' },
    { key:'impressions', label:'Impressions',   type:'number', placeholder:'0' },
    { key:'conversions', label:'Conversions',   type:'number', placeholder:'0' },
    { key:'revenue',     label:'Revenue ₹',     type:'number', placeholder:'0' },
    { key:'status',      label:'Status',        type:'select', options:['Active','Paused','Ended'] },
  ],
  communication_ads: [
    { key:'campaign',    label:'Campaign Name', type:'text',   required:true, placeholder:'Campaign name' },
    { key:'type',        label:'Communication Type', type:'select', options:['📧 Mail Ads', '💬 WhatsApp Ads'] },
    { key:'budget',      label:'Budget ₹',      type:'number', required:true, placeholder:'0' },
    { key:'spend',       label:'Spend ₹',       type:'number', required:true, placeholder:'0' },
    { key:'clicks',      label:'Clicks',        type:'number', placeholder:'0' },
    { key:'impressions', label:'Impressions',   type:'number', placeholder:'0' },
    { key:'conversions', label:'Conversions',   type:'number', placeholder:'0' },
    { key:'revenue',     label:'Revenue ₹',     type:'number', placeholder:'0' },
    { key:'status',      label:'Status',        type:'select', options:['Active','Paused','Ended'] },
  ],
  team: [
    { key:'name',     label:'Full Name',  type:'text',   required:true, placeholder:'Enter name' },
    { key:'username', label:'Username',   type:'text',   required:true, placeholder:'Enter username' },
    { key:'password', label:'Password',   type:'text',   required:true, placeholder:'Min 6 characters' },
    { key:'role',     label:'Role',       type:'select', options:['admin', 'marketing', 'ceo'], required:true },
    { key:'status',   label:'Status',     type:'select', options:['active', 'inactive'], defaultValue: 'active' },
  ],
}
