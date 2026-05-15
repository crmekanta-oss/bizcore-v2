export const mktStats = [
  { icon:'📢', label:'Total Ads Spend',   value:'₹2.05L', change:'5.8% this month', up:true,  color:'#f97316' },
  { icon:'💵', label:'Revenue from Ads',  value:'₹8.6L',  change:'ROAS 4.2×',       up:true,  color:'#22c55e' },
  { icon:'📈', label:'Conversion Rate',   value:'4.6%',   change:'0.8% vs prior',   up:true,  color:'#3b82f6' },
  { icon:'👁',  label:'Total Impressions', value:'780K',   change:'18% reach',       up:true,  color:'#8b5cf6' },
]

export const adsCampaigns = [
  {
    key:'google', icon:'🔍', name:'Google Ads',
    sub:'Search & Display · 28k clicks', spend:'₹1,20,000', roas:'3.8×',
    impressions:'4,20,000', clicks:'28,000', ctr:'6.7%', conversions:340, revenue:'₹4,56,000',
    iconBg:'rgba(66,133,244,0.15)', color:'#4285f4',
  },
  {
    key:'meta', icon:'🔵', name:'Meta Ads',
    sub:'Facebook & Instagram · 360k reach', spend:'₹85,000', roas:'4.9×',
    impressions:'3,60,000', clicks:'18,400', ctr:'5.1%', conversions:290, revenue:'₹4,16,500',
    iconBg:'rgba(24,119,242,0.15)', color:'#1877f2',
  },
]

export const revenueByChannel = [
  { name:'Google Ads', value:456000, color:'#4285f4' },
  { name:'Meta Ads',   value:416500, color:'#1877f2' },
]

export const adsPerformance = [
  { channel:'Google Ads', spend:120000, revenue:456000 },
  { channel:'Meta Ads',   spend:85000,  revenue:416500 },
]

export const googleAdsDetail = [
  { campaign:'Brand Search',      spend:'₹35,000', clicks:'8,200',  ctr:'8.2%', conv:120, status:'Active' },
  { campaign:'Product Keywords',  spend:'₹45,000', clicks:'12,400', ctr:'6.1%', conv:140, status:'Active' },
  { campaign:'Display Retarget',  spend:'₹25,000', clicks:'5,800',  ctr:'4.9%', conv:54,  status:'Paused' },
  { campaign:'Shopping Ads',      spend:'₹15,000', clicks:'1,600',  ctr:'5.5%', conv:26,  status:'Active' },
]

export const metaAdsDetail = [
  { campaign:'Facebook Feed',      spend:'₹30,000', reach:'1,20,000', ctr:'5.8%', conv:110, status:'Active' },
  { campaign:'Instagram Stories',  spend:'₹25,000', reach:'98,000',   ctr:'4.9%', conv:85,  status:'Active' },
  { campaign:'Reels Boost',        spend:'₹18,000', reach:'92,000',   ctr:'4.2%', conv:62,  status:'Active' },
  { campaign:'Lookalike Audience', spend:'₹12,000', reach:'50,000',   ctr:'5.4%', conv:33,  status:'Paused' },
]
