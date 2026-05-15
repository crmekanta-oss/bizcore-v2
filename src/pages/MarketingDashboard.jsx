import React, { useState, useEffect, useCallback } from 'react'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import StatCard from '../components/StatCard'
import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import LiveBanner from '../components/LiveBanner'
import SectionHead from '../components/SectionHead'
import { useTable } from '../hooks/useTable'
import { initGoogleAds, initMetaAds, FORM_SCHEMAS } from '../data/seedData'
import MarketingAdsSection from '../components/MarketingAdsSection'

const G_COLS = [{key:'campaign',label:'Campaign'},{key:'type',label:'Type'},{key:'budget',label:'Budget'},{key:'spend',label:'Spend'},{key:'clicks',label:'Clicks'},{key:'impressions',label:'Impressions'},{key:'conversions',label:'Conv.'},{key:'revenue',label:'Revenue'},{key:'status',label:'Status'}]
const M_COLS = [{key:'campaign',label:'Campaign'},{key:'type',label:'Type'},{key:'budget',label:'Budget'},{key:'spend',label:'Spend'},{key:'reach',label:'Reach'},{key:'impressions',label:'Impressions'},{key:'conversions',label:'Conv.'},{key:'revenue',label:'Revenue'},{key:'status',label:'Status'}]
const COMM_COLS = [{key:'campaign',label:'Campaign'},{key:'type',label:'Communication Type'},{key:'budget',label:'Budget'},{key:'spend',label:'Spend'},{key:'clicks',label:'Clicks'},{key:'impressions',label:'Impressions'},{key:'conversions',label:'Conv.'},{key:'revenue',label:'Revenue'},{key:'status',label:'Status'}]

export default function MarketingDashboard({ activeModule = 'dashboard', embedded = false, onRoleChange, loggedInRole, activeView, setActiveView, hideTables = false, selectedRange: rangeProp = '7d' }) {
  const [selectedRange, setSelectedRange] = useState(rangeProp)
  const [dateRange, setDateRange] = useState({ 
    startDate: '', 
    endDate: '', 
  });

  const google = useTable('google_ads', initGoogleAds)
  const meta   = useTable('meta_ads',   initMetaAds)
  const comm   = useTable('communication_ads', [])

  useEffect(() => {
    setSelectedRange(rangeProp)
  }, [rangeProp])

  const filterByDate = useCallback((rows, range, customRange) => {
    if (!rows) return [];
    
    const getLocalDate = (dateStr) => {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    };

    const isMatch = (r, targetDate) => {
      const val = r.created_at || r.date;
      if (!val) return false;
      return getLocalDate(val) === targetDate;
    };

    const isAfter = (r, targetDate) => {
      const val = r.created_at || r.date;
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
        const val = r.created_at || r.date;
        if (!val) return false;
        const d = new Date(getLocalDate(val));
        return d >= start && d <= end;
      });
    }
    return rows;
  }, []);

  const formatCurrency = (val) => {
    if (val >= 100000) return `₹${(val/100000).toFixed(2)}L`;
    return `₹${(val/1000).toFixed(1)}k`;
  };

  const filteredGoogle = filterByDate(google.rows, selectedRange, dateRange);
  const filteredMeta   = filterByDate(meta.rows,   selectedRange, dateRange);
  const filteredComm   = filterByDate(comm.rows,   selectedRange, dateRange);

  const gSpend   = filteredGoogle.reduce((s,r) => s + Number(r.spend||0), 0)
  const gRev     = filteredGoogle.reduce((s,r) => s + Number(r.revenue||0), 0)
  const mSpend   = filteredMeta.reduce((s,r) => s + Number(r.spend||0), 0)
  const mRev     = filteredMeta.reduce((s,r) => s + Number(r.revenue||0), 0)
  const cSpend   = filteredComm.reduce((s,r) => s + Number(r.spend||0), 0)
  const cRev     = filteredComm.reduce((s,r) => s + Number(r.revenue||0), 0)

  const totSpend = gSpend + mSpend + cSpend
  const totRev   = gRev + mRev + cRev
  const roas     = totSpend > 0 ? (totRev / totSpend).toFixed(2) : '0.00'
  const totConv  = [...filteredGoogle, ...filteredMeta, ...filteredComm].reduce((s,r) => s + Number(r.conversions||0), 0)

  const chartData = [
    { platform:'Google Ads', spend:gSpend, revenue:gRev },
    { platform:'Meta Ads',   spend:mSpend, revenue:mRev },
    { platform:'Comm Ads',   spend:cSpend, revenue:cRev },
  ]
  const donutData = [
    { name:'Google Ads', value:gRev, color:'#4285f4' },
    { name:'Meta Ads',   value:mRev, color:'#1877f2'  },
    { name:'Comm Ads',   value:cRev, color:'#f97316'  },
  ].filter(d => d.value > 0)

  // Single module views
  if (activeModule === 'google') {
    return (
      <div>
        {!embedded && (
          <MarketingAdsSection 
            currentRole="mkt" 
            onRoleChange={onRoleChange} 
            loggedInRole={loggedInRole} 
            activeView={activeView} 
            setActiveView={setActiveView}
            selectedRange={selectedRange}
            onDateFilterChange={setSelectedRange}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        )}
        <div className={!embedded ? "mt-8" : ""}>
          {!embedded && <LiveBanner />}
          <DataTable title="Google Ads Campaigns" icon="🔍" rows={google.rows} schema={FORM_SCHEMAS.google_ads} columns={G_COLS}
            onAdd={google.add} onEdit={google.edit} onDelete={google.remove} accentColor="#4285f4" canWrite={true} />
        </div>
      </div>
    )
  }
  if (activeModule === 'meta') {
    return (
      <div>
        {!embedded && (
          <MarketingAdsSection 
            currentRole="mkt" 
            onRoleChange={onRoleChange} 
            loggedInRole={loggedInRole} 
            activeView={activeView} 
            setActiveView={setActiveView}
            selectedRange={selectedRange}
            onDateFilterChange={setSelectedRange}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        )}
        <div className={!embedded ? "mt-8" : ""}>
          {!embedded && <LiveBanner />}
          <DataTable title="Meta Ads Campaigns" icon="🔵" rows={meta.rows} schema={FORM_SCHEMAS.meta_ads} columns={M_COLS}
            onAdd={meta.add} onEdit={meta.edit} onDelete={meta.remove} accentColor="#1877f2" canWrite={true} />
        </div>
      </div>
    )
  }
  if (activeModule === 'roi') {
    return (
      <div>
        {!embedded && (
          <MarketingAdsSection 
            currentRole="mkt" 
            onRoleChange={onRoleChange} 
            loggedInRole={loggedInRole} 
            activeView={activeView} 
            setActiveView={setActiveView}
            selectedRange={selectedRange}
            onDateFilterChange={setSelectedRange}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        )}
        <div className={!embedded ? "mt-8" : ""}>
          {!embedded && <LiveBanner />}
          <SectionHead icon="📈" label="ROI Analytics" color="#f97316" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
            {[
              { icon:'💰', label:'Total Spend',   value:formatCurrency(totSpend), change:'Both platforms', up:false, color:'#f97316' },
              { icon:'💵', label:'Total Revenue',  value:formatCurrency(totRev),  change:'Combined ROI',   up:true,  color:'#22c55e' },
              { icon:'📈', label:'Blended ROAS',   value:`${roas}×`,                          change:'All campaigns',  up:true,  color:'#3b82f6' },
              { icon:'🎯', label:'Total Conv.',    value:totConv.toString(),                  change:'All platforms',  up:true,  color:'#8b5cf6' },
            ].map(s => <StatCard key={s.label} {...s} accentColor={s.color} />)}
          </div>
          <Panel title="📈 Spend vs Revenue — Platform Comparison" tag="ROI" tagBg="rgba(249,115,22,.18)" tagColor="#fdba74" style={{ marginBottom:16 }}>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} barGap={8}>
                <XAxis dataKey="platform" tick={{ fill:'var(--muted)', fontSize:12 }} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, fontSize:12 }} formatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
                <Bar dataKey="spend"   fill="#f97316" radius={[5,5,0,0]} name="Spend"/>
                <Bar dataKey="revenue" fill="#22c55e" radius={[5,5,0,0]} name="Revenue"/>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display:'flex', gap:16, marginTop:8 }}>
              {[['Spend','#f97316'],['Revenue','#22c55e']].map(([l,c]) => (
                <div key={l} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12 }}>
                  <div style={{ width:10, height:10, borderRadius:3, background:c }}/>
                  <span style={{ color:'var(--muted)' }}>{l}</span>
                </div>
              ))}
            </div>
          </Panel>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <DataTable title="Google Ads" icon="🔍" rows={google.rows} schema={FORM_SCHEMAS.google_ads} columns={G_COLS}
              onAdd={google.add} onEdit={google.edit} onDelete={google.remove} accentColor="#4285f4" canWrite={true} />
            <DataTable title="Meta Ads" icon="🔵" rows={meta.rows} schema={FORM_SCHEMAS.meta_ads} columns={M_COLS}
              onAdd={meta.add} onEdit={meta.edit} onDelete={meta.remove} accentColor="#1877f2" canWrite={true} />
          </div>
        </div>
      </div>
    )
  }

  // Dashboard overview
  return (
    <div>
      {!embedded && (
        <MarketingAdsSection 
          currentRole="mkt" 
          onRoleChange={onRoleChange} 
          loggedInRole={loggedInRole} 
          activeView={activeView} 
          setActiveView={setActiveView}
          selectedRange={selectedRange}
          onDateFilterChange={setSelectedRange}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      )}
      
      
      <div className={!embedded ? "mt-12 space-y-8" : "space-y-8"}>
        {!hideTables && <SectionHead icon="🎯" label="Marketing Analytics & Performance" color="#f97316" />}
        
        {!embedded && <LiveBanner />}
        {embedded && !hideTables && <SectionHead icon="📣" label="Marketing & Ads Data" color="#f97316" />}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20, marginTop: 24 }}>
        {[
          { icon:'📢', label:'Total Ads Spend',  value:`₹${(totSpend/100000).toFixed(2)}L`, change:'Both platforms', up:false, color:'#f97316' },
          { icon:'💵', label:'Revenue from Ads', value:`₹${(totRev/100000).toFixed(2)}L`,  change:'Combined',       up:true,  color:'#22c55e' },
          { icon:'📈', label:'Blended ROAS',     value:`${roas}×`,                          change:'Overall',        up:true,  color:'#3b82f6' },
          { icon:'🎯', label:'Conversions',      value:totConv.toString(),                  change:'All campaigns',  up:true,  color:'#8b5cf6' },
        ].map(s => <StatCard key={s.label} {...s} accentColor={s.color} />)}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16, marginBottom:16 }}>
        <Panel title="📈 Spend vs Revenue" tag="Both Platforms" tagBg="rgba(249,115,22,.18)" tagColor="#fdba74">
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={chartData} barGap={8}>
              <XAxis dataKey="platform" tick={{ fill:'var(--muted)', fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, fontSize:12 }} formatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
              <Bar dataKey="spend"   fill="#f97316" radius={[5,5,0,0]} name="Spend"/>
              <Bar dataKey="revenue" fill="#22c55e" radius={[5,5,0,0]} name="Revenue"/>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="💵 Revenue split" tagBg="rgba(249,115,22,.18)" tagColor="#fdba74">
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={donutData} innerRadius={38} outerRadius={55} dataKey="value" paddingAngle={4}>
                {donutData.map((e,i) => <Cell key={i} fill={e.color}/>)}
              </Pie>
              <Tooltip contentStyle={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, fontSize:12 }} formatter={v=>`₹${(v/100000).toFixed(2)}L`}/>
            </PieChart>
          </ResponsiveContainer>
          {donutData.map(c => (
            <div key={c.name} style={{ display:'flex', alignItems:'center', gap:7, fontSize:12, marginBottom:5 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:c.color, flexShrink:0 }}/>
              <span style={{ flex:1 }}>{c.name}</span>
              <span style={{ fontWeight:600 }}>₹{(c.value/100000).toFixed(2)}L</span>
            </div>
          ))}
          <div style={{ marginTop:10, paddingTop:10, borderTop:'1px solid var(--border)' }}>
            <div style={{ fontSize:11.5, color:'var(--muted)' }}>Performance Score</div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:24, fontWeight:700, color:'#22c55e', marginTop:2 }}>87 / 100</div>
          </div>
        </Panel>
      </div>

      {!hideTables && (
        <>
          {activeModule === 'dashboard' || activeModule === 'google' ? (
            <DataTable title="Google Ads Campaigns" icon="🔍" rows={google.rows} schema={FORM_SCHEMAS.google_ads} columns={G_COLS}
              onAdd={google.add} onEdit={google.edit} onDelete={google.remove} accentColor="#4285f4" canWrite={true} />
          ) : null}

          {activeModule === 'dashboard' || activeModule === 'meta' ? (
            <DataTable title="Meta Ads Campaigns" icon="🔵" rows={meta.rows} schema={FORM_SCHEMAS.meta_ads} columns={M_COLS}
              onAdd={meta.add} onEdit={meta.edit} onDelete={meta.remove} accentColor="#1877f2" canWrite={true} />
          ) : null}

          {activeModule === 'dashboard' || activeModule === 'comm' ? (
            <DataTable title="Communication Ads Campaigns" icon="📩" rows={comm.rows} schema={FORM_SCHEMAS.communication_ads} columns={COMM_COLS}
              onAdd={comm.add} onEdit={comm.edit} onDelete={comm.remove} accentColor="#f97316" canWrite={true} />
          ) : null}
        </>
      )}
    </div>
  )
}
