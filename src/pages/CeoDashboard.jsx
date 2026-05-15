import React, { useState } from 'react'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { Calendar } from 'lucide-react'
import StatCard from '../components/StatCard'
import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import LiveBanner from '../components/LiveBanner'
import SectionHead from '../components/SectionHead'
import { useTable } from '../hooks/useTable'
import { initSales, initInventory, initPayments, initReceivables, initFabric, initGoogleAds, initMetaAds, initTeam, ceoStats, investments, decisions, salesChartData, FORM_SCHEMAS } from '../data/seedData'
import MarketingAdsSection from '../components/MarketingAdsSection'
import MarketingDashboard from './MarketingDashboard'
import AdminDashboard from './AdminDashboard'
import { dateFilters } from '../data/marketingAdsData'

const G_COLS = [{key:'campaign',label:'Campaign'},{key:'spend',label:'Spend'},{key:'revenue',label:'Revenue'},{key:'conversions',label:'Conv.'},{key:'status',label:'Status'}]
const M_COLS = [{key:'campaign',label:'Campaign'},{key:'spend',label:'Spend'},{key:'revenue',label:'Revenue'},{key:'conversions',label:'Conv.'},{key:'status',label:'Status'}]
const TEAM_COLS = [{key:'name',label:'Name'},{key:'username',label:'Username'},{key:'role',label:'Role'},{key:'status',label:'Status'}]

const roiTrend = [
  {month:'Jan',roi:2.8},{month:'Feb',roi:3.1},{month:'Mar',roi:2.9},{month:'Apr',roi:3.5},{month:'May',roi:4.2},
]

export default function CeoDashboard({ activeModule = 'dashboard', onRoleChange, loggedInRole, activeView, setActiveView }) {
  const [selectedRange, setSelectedRange] = useState('7d')
  const [dateRange, setDateRange] = useState({ 
    startDate: '', 
    endDate: '', 
  });

  const sales  = useTable('sales_entries',    initSales)
  const inv    = useTable('inventory',         initInventory)
  const pay    = useTable('supplier_payments', initPayments)
  const recv   = useTable('receivables',       initReceivables)
  const fabric = useTable('fabric_orders',     initFabric)
  const google = useTable('google_ads',        initGoogleAds)
  const meta   = useTable('meta_ads',          initMetaAds)
  const comms  = useTable('communication_ads', [])
  const team   = useTable('users',              initTeam)

  const filterByDate = (rows, range, customRange) => {
    const getLocalDate = (dateStr) => {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    };

    const isMatch = (r, targetDate) => {
      const val = r.created_at || r.date || r.due || r.order_date;
      if (!val) return false;
      return getLocalDate(val) === targetDate;
    };

    const isAfter = (r, targetDate) => {
      const val = r.created_at || r.date || r.due || r.order_date;
      if (!val) return false;
      return new Date(getLocalDate(val)) >= targetDate;
    };

    if (range === 'today') {
      const today = new Date();
      const todayStr = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      return rows.filter(r => isMatch(r, todayStr));
    }
    if (range === '7d') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      return rows.filter(r => isAfter(r, sevenDaysAgo));
    }
    if (range === '30d') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);
      return rows.filter(r => isAfter(r, thirtyDaysAgo));
    }
    if (range === 'custom' && customRange.startDate) {
      const start = new Date(customRange.startDate);
      const end = customRange.endDate ? new Date(customRange.endDate) : new Date();
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return rows.filter(r => {
        const val = r.created_at || r.date || r.due || r.order_date;
        if (!val) return false;
        const d = new Date(getLocalDate(val));
        return d >= start && d <= end;
      });
    }
    return rows;
  };

  const filteredSales = filterByDate(sales.rows, selectedRange, dateRange);
  const filteredPay = filterByDate(pay.rows, selectedRange, dateRange);
  const filteredGoogle = filterByDate(google.rows, selectedRange, dateRange);
  const filteredMeta = filterByDate(meta.rows, selectedRange, dateRange);
  const filteredComms = filterByDate(comms.rows, selectedRange, dateRange);

  const totalSales = filteredSales.reduce((s,r)=>s+Number(r.amount||0),0)
  // Receivables/Bank balance usually based on total outstanding, not just date-filtered
  const totalOutstandingRecv = recv.rows.filter(r => r.status !== 'Received').reduce((s,r) => s + Number(r.amount||0), 0)
  const totalOutstandingPay = pay.rows.filter(r => r.status !== 'Paid').reduce((s,r) => s + Number(r.amount||0), 0)
  
  const netRevenue = totalSales - filteredPay.reduce((s,r)=>s+Number(r.amount||0),0)

  const gRev  = filteredGoogle.reduce((s,r)=>s+Number(r.revenue||0),0)
  const mRev  = filteredMeta.reduce((s,r)=>s+Number(r.revenue||0),0)
  const cRev  = filteredComms.reduce((s,r)=>s+Number(r.revenue||0),0)
  const gSpend= filteredGoogle.reduce((s,r)=>s+Number(r.spend||0),0)
  const mSpend= filteredMeta.reduce((s,r)=>s+Number(r.spend||0),0)
  const cSpend= filteredComms.reduce((s,r)=>s+Number(r.spend||0),0)
  
  const totSpend = gSpend + mSpend + cSpend
  const totRev   = gRev + mRev + cRev
  const roas = totSpend > 0 ? (totRev / totSpend).toFixed(2) : '0.00'

  // Investment dynamic value
  const totalInvestment = investments.reduce((s,r)=>s+Number(r.value.replace(/[^0-9.]/g, '') || 0), 0)

  const formatCurrency = (val) => {
    if (val >= 100000) return `₹${(val/100000).toFixed(2)}L`;
    return `₹${(val/1000).toFixed(1)}k`;
  };

  if (activeModule === 'bank') {
    return (
      <div>
        <MarketingAdsSection 
          currentRole="ceo" 
          onRoleChange={onRoleChange} 
          loggedInRole={loggedInRole} 
          activeView={activeView} 
          setActiveView={setActiveView}
          selectedRange={selectedRange}
          onDateFilterChange={setSelectedRange}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <div className="mt-8">
          <LiveBanner />
          <SectionHead icon="🏧" label="Bank Balance" color="#22c55e" />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <Panel title="🏧 Current Bank Balance" tag="HDFC" tagBg="rgba(34,197,94,.18)" tagColor="#86efac">
              <div style={{ fontFamily:'Syne,sans-serif', fontSize:36, fontWeight:800, color:'#22c55e', marginBottom:6 }}>₹19,10,000</div>
              <div style={{ fontSize:12.5, color:'var(--muted)', marginBottom:16 }}>HDFC Business Current A/c · Updated just now</div>
              <div style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12.5, marginBottom:5 }}>
                  <span>Monthly utilization</span><span>62%</span>
                </div>
                <div style={{ background:'var(--surface2)', borderRadius:4, height:7, overflow:'hidden' }}>
                  <div style={{ width:'62%', height:'100%', borderRadius:4, background:'#22c55e' }}/>
                </div>
              </div>
              {[['Opening Balance','₹15,40,000'],['Receipts','₹8,20,000'],['Payments','₹4,50,000'],['Closing Balance','₹19,10,000']].map(([l,v])=>(
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid var(--border)', fontSize:13 }}>
                  <span style={{ color:'var(--muted)' }}>{l}</span>
                  <span style={{ fontFamily:'Syne,sans-serif', fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </Panel>
            <Panel title="📊 Investment Portfolio" tag="Live" tagBg="rgba(34,197,94,.18)" tagColor="#86efac">
              {investments.map(inv => (
                <div key={inv.id} style={{ background:'var(--surface2)', borderRadius:10, padding:14, marginBottom:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                    <span style={{ fontSize:13, fontWeight:500 }}>{inv.name}</span>
                    <span style={{ fontSize:12, color:inv.up?'#22c55e':'#ef4444', fontWeight:600 }}>{inv.change}</span>
                  </div>
                  <div style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700 }}>{inv.value}</div>
                </div>
              ))}
            </Panel>
          </div>
        </div>
      </div>
    )
  }
  if (activeModule === 'ads') {
    return (
      <div>
        <MarketingAdsSection 
          currentRole="ceo" 
          onRoleChange={onRoleChange} 
          loggedInRole={loggedInRole} 
          activeView={activeView} 
          setActiveView={setActiveView}
          selectedRange={selectedRange}
          onDateFilterChange={setSelectedRange}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <div className="mt-8">
          <LiveBanner />
          <SectionHead icon="📢" label="Ads Spend Overview" color="#f97316" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
            {[
              { icon:'📢', label:'Google Spend', value:formatCurrency(gSpend), change:'This month', up:false, color:'#4285f4' },
              { icon:'🔵', label:'Meta Spend',   value:formatCurrency(mSpend), change:'This month', up:false, color:'#1877f2' },
              { icon:'💵', label:'Total Revenue',value:formatCurrency(totRev), change:'Combined',   up:true,  color:'#22c55e' },
              { icon:'📈', label:'Blended ROAS', value:`${roas}×`,                         change:'All ads',    up:true,  color:'#f97316' },
            ].map(s=><StatCard key={s.label} {...s} accentColor={s.color}/>)}
          </div>
          <DataTable title="Google Ads" icon="🔍" rows={google.rows} schema={FORM_SCHEMAS.google_ads} columns={G_COLS}
            onAdd={google.add} onEdit={google.edit} onDelete={google.remove} accentColor="#4285f4" canWrite={false}/>
          <DataTable title="Meta Ads" icon="🔵" rows={meta.rows} schema={FORM_SCHEMAS.meta_ads} columns={M_COLS}
            onAdd={meta.add} onEdit={meta.edit} onDelete={meta.remove} accentColor="#1877f2" canWrite={false}/>
        </div>
      </div>
    )
  }

  if (activeModule === 'team') {
    return (
      <div className="space-y-8">
        <div className="mt-8">
          <LiveBanner />
          <SectionHead icon="👥" label="Team Management" color="#8b5cf6" />
          <DataTable 
            title="Team Members" 
            icon="👥" 
            rows={team.rows} 
            schema={FORM_SCHEMAS.team} 
            columns={TEAM_COLS}
            onAdd={team.add} 
            onEdit={team.edit} 
            onDelete={team.remove} 
            accentColor="#8b5cf6" 
            canWrite={true}
          />
        </div>
      </div>
    )
  }

  // ── CEO FULL DASHBOARD ──
  return (
    <div className="space-y-12">
      {/* CEO Overview */}
      <div className="fade-up">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">CEO Dashboard</h1>
            <p className="text-gray-400">Executive overview of business performance and operational health.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-glass backdrop-blur-md border border-white/10 rounded-2xl p-1 relative">
              {dateFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedRange(filter.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    selectedRange === filter.value 
                      ? 'bg-neon-blue text-black shadow-neon-blue' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
              
              <div className="relative flex items-center">
                <button 
                  onClick={() => setSelectedRange('custom')}
                  className={`p-2 transition-colors ml-1 rounded-xl ${
                    selectedRange === 'custom' ? 'text-neon-blue' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                </button>
                <input 
                  type="date" 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  onChange={(e) => {
                    setSelectedRange('custom');
                    setDateRange(prev => ({ ...prev, startDate: e.target.value }));
                  }}
                />
              </div>

              {selectedRange === 'custom' && (
                <div className="absolute top-full right-0 mt-2 bg-glass backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-50 flex flex-col gap-3 min-w-[200px]">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Start Date</label>
                    <input 
                      type="date" 
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">End Date</label>
                    <input 
                      type="date" 
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <LiveBanner />

        {/* CEO top stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
          {[
            { icon:'📊', label:'Net Revenue',    value:formatCurrency(netRevenue), change:'This month', up:true,  color:'#22c55e' },
            { icon:'🏦', label:'Bank Balance',   value:formatCurrency(netRevenue - totSpend), change:'Healthy',    up:true,  color:'#3b82f6' },
            { icon:'📈', label:'Ads ROAS',       value:`${roas}×`,                             change:'Improving',  up:true,  color:'#f97316' },
            { icon:'💼', label:'Investment',     value:formatCurrency(totalInvestment), change:'9.4% returns',up:true, color:'#8b5cf6' },
          ].map(s=><StatCard key={s.label} {...s} accentColor={s.color}/>)}
        </div>

        {/* ROI Trend */}
        <Panel title="📈 ROAS Trend — Last 5 Months" tag="CEO Analytics" tagBg="rgba(34,197,94,.18)" tagColor="#86efac" style={{ marginBottom:16 }}>
          <ResponsiveContainer width="100%" height={110}>
            <LineChart data={roiTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
              <XAxis dataKey="month" tick={{ fill:'var(--muted)', fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, fontSize:12 }}/>
              <Line type="monotone" dataKey="roi" stroke="#22c55e" strokeWidth={2} dot={{ fill:'#22c55e', r:4 }} name="ROAS"/>
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        {/* New Marketing Charts Section (from image) */}
        <div className="mt-8">
          <MarketingAdsSection 
            hideHeader={true} 
            hideStats={true} 
            hideTable={true} 
            currentRole="ceo"
            selectedRange={selectedRange}
          />
        </div>
      </div>

      {/* Admin Dashboard - TABLES ENABLED */}
      <div className="fade-up">
        <AdminDashboard embedded={true} hideTables={false} rangeProp={selectedRange} />
      </div>
    </div>
  )
}
