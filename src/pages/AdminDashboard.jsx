import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Calendar } from 'lucide-react'
import StatCard from '../components/StatCard'
import Panel from '../components/Panel'
import DataTable from '../components/DataTable'
import LiveBanner from '../components/LiveBanner'
import SectionHead from '../components/SectionHead'
import { useTable } from '../hooks/useTable'
import { initSales, initInventory, initPayments, initReceivables, initFabric, salesChartData, FORM_SCHEMAS } from '../data/seedData'
import { dateFilters } from '../data/marketingAdsData'

const COLS = {
  sales:       [{key:'date',label:'Date'},{key:'client',label:'Client'},{key:'product',label:'Product'},{key:'qty',label:'Qty'},{key:'amount',label:'Amount'},{key:'status',label:'Status'}],
  inventory:   [{key:'name',label:'Item'},{key:'category',label:'Category'},{key:'units',label:'Units'},{key:'unit',label:'Type'},{key:'reorder',label:'Reorder'},{key:'cost',label:'₹/Unit'},{key:'status',label:'Status'}],
  payments:    [{key:'supplier',label:'Supplier'},{key:'invoice',label:'Invoice'},{key:'amount',label:'Amount'},{key:'due',label:'Due Date'},{key:'status',label:'Status'}],
  receivables: [{key:'client',label:'Client'},{key:'invoice',label:'Invoice'},{key:'amount',label:'Amount'},{key:'due',label:'Due Date'},{key:'status',label:'Status'}],
  fabric:      [{key:'fabric',label:'Fabric'},{key:'qty',label:'Qty'},{key:'supplier',label:'Supplier'},{key:'order_date',label:'Ordered'},{key:'delivery',label:'Delivery'},{key:'amount',label:'Amount'},{key:'status',label:'Status'}],
}

export default function AdminDashboard({ 
  activeModule = 'dashboard', 
  embedded = false, 
  onRoleChange, 
  loggedInRole, 
  activeView, 
  setActiveView,
  hideTables = false,
  rangeProp = null
}) {
  const [selectedRange, setSelectedRange] = useState('7d')
  const [dateRange, setDateRange] = useState({ 
    startDate: '', 
    endDate: '', 
  });

  useEffect(() => {
    if (rangeProp) setSelectedRange(rangeProp)
  }, [rangeProp])
  const [dashboardData, setDashboardData] = useState([])
  const [chartData, setChartData] = useState(salesChartData)

  const sales  = useTable('sales_entries',    initSales)
  const inv    = useTable('inventory',         initInventory)
  const pay    = useTable('supplier_payments', initPayments)
  const recv   = useTable('receivables',       initReceivables)
  const fabric = useTable('fabric_orders',     initFabric)

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
  const filteredRecv = filterByDate(recv.rows, selectedRange, dateRange);

  const totalSales = filteredSales.reduce((s,r) => s + Number(r.amount||0), 0)
  // Balance sheet items (Due/Receivables) should show GLOBAL total, not date-filtered
  const totalDue   = pay.rows.filter(r => r.status !== 'Paid').reduce((s,r) => s + Number(r.amount||0), 0)
  const totalRecv  = recv.rows.filter(r => r.status !== 'Received').reduce((s,r) => s + Number(r.amount||0), 0)
  const totalStock = inv.rows.reduce((s,r) => s + Number(r.units||0), 0)

  const formatCurrency = (val) => {
    if (val >= 100000) return `₹${(val/100000).toFixed(2)}L`;
    return `₹${(val/1000).toFixed(1)}k`;
  };

  // Dynamic Chart Data based on filtered sales
  const dynamicChartData = useMemo(() => {
    const days = selectedRange === 'today' ? 1 : selectedRange === '7d' ? 7 : 30;
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const daySales = filteredSales.filter(r => (r.created_at || r.date)?.startsWith(dateStr));
      data.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        sales: daySales.reduce((s, r) => s + Number(r.amount || 0), 0)
      });
    }
    return data;
  }, [selectedRange, filteredSales]);

  const tables = {
    sales:       { title:'Sales Entry',       icon:'📊', data:sales,  rows: filteredSales, schema:FORM_SCHEMAS.sales,       cols:COLS.sales,       color:'#3b82f6' },
    inventory:   { title:'Inventory',         icon:'📦', data:inv,    rows: inv.rows,      schema:FORM_SCHEMAS.inventory,   cols:COLS.inventory,   color:'#f97316' },
    payments:    { title:'Supplier Payments', icon:'💳', data:pay,    rows: filteredPay,   schema:FORM_SCHEMAS.payments,    cols:COLS.payments,    color:'#8b5cf6' },
    receivables: { title:'Receivables',       icon:'💰', data:recv,   rows: filteredRecv,  schema:FORM_SCHEMAS.receivables, cols:COLS.receivables, color:'#22c55e' },
    fabric:      { title:'Fabric Orders',     icon:'🧵', data:fabric, rows: fabric.rows,   schema:FORM_SCHEMAS.fabric,      cols:COLS.fabric,      color:'#06b6d4' },
  }

  return (
    <div className="fade-up">
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage operations, track inventory, and monitor financial performance.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Date Filter - Added for Admin */}
          {!embedded && (
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
          )}

          {!embedded && (
            <div className="flex items-center bg-glass backdrop-blur-md border border-white/10 rounded-2xl p-1 px-4 py-2">
               <div className="flex items-center gap-2">
                  <div className="pulse" style={{ width:8, height:8, borderRadius:'50%', background:'#3b82f6' }}/>
                  <span className="text-sm font-medium text-white">System Live</span>
               </div>
            </div>
          )}
        </div>
      </div>
      
      <div className={!embedded ? "space-y-8" : "space-y-8"}>
        {!embedded && <LiveBanner />}
        {embedded && <SectionHead icon="📊" label="Sales & Operations Data" color="#3b82f6" />}
      </div>

      {/* Main Content Area */}
      {activeModule === 'dashboard' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-8">
            {[
              { icon:'📊', label:'Total Sales',   value:formatCurrency(totalSales), change:'This month', up:true,  color:'#3b82f6' },
              { icon:'📦', label:'Stock in Hand', value:totalStock.toLocaleString(),            change:'all items',  up:true,  color:'#f97316' },
              { icon:'💳', label:'Supplier Due',  value:formatCurrency(totalDue),   change:'Pending',    up:false, color:'#8b5cf6' },
              { icon:'💰', label:'Receivables',   value:formatCurrency(totalRecv),  change:'Outstanding',up:true,  color:'#22c55e' },
            ].map(s => (
              <div key={s.label} className="relative group overflow-hidden rounded-2xl border border-white/10 bg-glass backdrop-blur-md p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-white/5 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors" style={{ color: s.color }}>
                    <span className="text-xl">{s.icon}</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full bg-black/20 ${s.up ? 'text-neon-green' : 'text-red-400'}`}>
                    {s.up ? '↑' : '↓'} {s.change}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">{s.label}</p>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{s.value}</h3>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 blur-3xl opacity-10 rounded-full" style={{ background: s.color }} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-glass backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  <h3 className="text-lg font-bold text-white">Sales — Weekly</h3>
                </div>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Live</span>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={dynamicChartData}>
                  <XAxis dataKey="day" tick={{ fill:'var(--muted)', fontSize:11 }} axisLine={false} tickLine={false}/>
                  <Tooltip 
                    contentStyle={{ background:'rgba(17,24,39,0.8)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, backdropFilter:'blur(8px)' }}
                    formatter={(v) => `₹${(v/1000).toFixed(1)}k`}
                  />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-glass backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📦</span>
                  <h3 className="text-lg font-bold text-white">Inventory Levels</h3>
                </div>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">Stock</span>
              </div>
              <div className="space-y-4">
                {inv.rows.slice(0,5).map(item => {
                  const pct = Math.min(100, Math.round((item.units / Math.max(item.reorder*6,1)) * 100))
                  const c = item.status==='In Stock'?'#22c55e':item.status==='Low Stock'?'#f97316':'#ef4444'
                  return (
                    <div key={item.id}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300 font-medium">{item.name}</span>
                        <span className="text-gray-500">{item.units} {item.unit}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width:`${pct}%`, background:c }}/>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {!hideTables && Object.entries(tables).map(([key, t]) => (
              <div key={key} className="fade-up">
                 <DataTable title={t.title} icon={t.icon} rows={t.rows} schema={t.schema} columns={t.cols}
                  onAdd={t.data.add} onEdit={t.data.edit} onDelete={t.data.remove} accentColor={t.color} canWrite={true} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-8">
          {tables[activeModule] && (
            <DataTable 
              title={tables[activeModule].title} 
              icon={tables[activeModule].icon} 
              rows={tables[activeModule].rows} 
              schema={tables[activeModule].schema} 
              columns={tables[activeModule].cols}
              onAdd={tables[activeModule].data.add} 
              onEdit={tables[activeModule].data.edit} 
              onDelete={tables[activeModule].data.remove} 
              accentColor={tables[activeModule].color} 
              canWrite={true} 
            />
          )}
        </div>
      )}
    </div>
  )
}
