export const dateFilters = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Custom Range', value: 'custom' },
];

export const marketingMetrics = {
  adsSpend: { value: 125000, change: '+12%', trend: 'up' },
  revenue: { value: 520000, change: '+18%', trend: 'up' },
  roas: { value: 4.16, change: '+5%', trend: 'up' },
  conversions: { value: 1240, change: '+8%', trend: 'up' },
};

export const chartData = [
  { name: 'Mon', revenue: 45000, spend: 12000, conversions: 110 },
  { name: 'Tue', revenue: 52000, spend: 15000, conversions: 130 },
  { name: 'Wed', revenue: 48000, spend: 14000, conversions: 120 },
  { name: 'Thu', revenue: 61000, spend: 18000, conversions: 160 },
  { name: 'Fri', revenue: 55000, spend: 16000, conversions: 145 },
  { name: 'Sat', revenue: 67000, spend: 19000, conversions: 180 },
  { name: 'Sun', revenue: 59000, spend: 17000, conversions: 155 },
];

export const adCampaigns = [
  { id: 1, name: 'Summer Sale 2026', platform: 'Google Ads', spend: 45000, revenue: 180000, roas: 4.0, conversions: 450, status: 'Active', date: '2026-05-01' },
  { id: 2, name: 'Brand Awareness', platform: 'Meta Ads', spend: 25000, revenue: 85000, roas: 3.4, conversions: 210, status: 'Active', date: '2026-05-02' },
  { id: 3, name: 'Retargeting Q2', platform: 'Google Ads', spend: 15000, revenue: 75000, roas: 5.0, conversions: 180, status: 'Paused', date: '2026-05-03' },
  { id: 4, name: 'Product Launch', platform: 'Meta Ads', spend: 35000, revenue: 140000, roas: 4.0, conversions: 380, status: 'Active', date: '2026-05-04' },
  { id: 5, name: 'Search - Competitors', platform: 'Google Ads', spend: 5000, revenue: 12000, roas: 2.4, conversions: 45, status: 'Ended', date: '2026-05-05' },
];
