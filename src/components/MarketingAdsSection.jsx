import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DollarSign, TrendingUp, Target, BarChart2 } from 'lucide-react';
import MarketingAdsHeader from './MarketingAdsHeader';
import MarketingStatCard from './MarketingStatCard';
import { RevenueChart, AdsSpendChart, ConversionChart } from './MarketingCharts';
import MarketingDataTable from './MarketingDataTable';
import { marketingMetrics, chartData } from '../data/marketingAdsData';
import { useTable } from '../hooks/useTable';
import { dateFilters } from '../data/marketingAdsData';

export default function MarketingAdsSection({ 
  currentRole, 
  onRoleChange, 
  loggedInRole, 
  activeView, 
  setActiveView,
  hideHeader = false,
  hideStats = false,
  hideTable = false,
  selectedRange: rangeProp = '7d',
  onDateFilterChange,
  dateRange: dateRangeProp,
  onDateRangeChange
}) {
  const [internalDateFilter, setInternalDateFilter] = useState(rangeProp);
  const [internalDateRange, setInternalDateRange] = useState({ 
    startDate: '', 
    endDate: '', 
  });

  const dateFilter = onDateFilterChange ? rangeProp : internalDateFilter;
  const setDateFilter = onDateFilterChange || setInternalDateFilter;
  const dateRange = onDateRangeChange ? dateRangeProp : internalDateRange;
  const setDateRange = onDateRangeChange || setInternalDateRange;

  useEffect(() => {
    if (!onDateFilterChange) setInternalDateFilter(rangeProp);
  }, [rangeProp, onDateFilterChange]);

  const google = useTable('google_ads', []);
  const meta = useTable('meta_ads', []);
  const comms = useTable('communication_ads', []);

  const filterByDate = useCallback((rows, range, customRange) => {
    if (range === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return rows.filter(r => r.created_at?.startsWith(today));
    }
    if (range === '7d') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return rows.filter(r => new Date(r.created_at) >= sevenDaysAgo);
    }
    if (range === '30d') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return rows.filter(r => new Date(r.created_at) >= thirtyDaysAgo);
    }
    if (range === 'custom' && customRange.startDate && customRange.endDate) {
      const start = new Date(customRange.startDate);
      const end = new Date(customRange.endDate);
      end.setHours(23, 59, 59, 999);
      return rows.filter(r => {
        const d = new Date(r.created_at);
        return d >= start && d <= end;
      });
    }
    return rows;
  }, []);

  const filteredGoogle = filterByDate(google.rows, dateFilter, dateRange);
  const filteredMeta = filterByDate(meta.rows, dateFilter, dateRange);
  const filteredComms = filterByDate(comms.rows, dateFilter, dateRange);

  // Dynamic metrics based on live data
  const metrics = useMemo(() => {
    const gSpend = filteredGoogle.reduce((s, r) => s + Number(r.spend || 0), 0);
    const mSpend = filteredMeta.reduce((s, r) => s + Number(r.spend || 0), 0);
    const cSpend = filteredComms.reduce((s, r) => s + Number(r.spend || 0), 0);
    const totalSpend = gSpend + mSpend + cSpend;

    const gRev = filteredGoogle.reduce((s, r) => s + Number(r.revenue || 0), 0);
    const mRev = filteredMeta.reduce((s, r) => s + Number(r.revenue || 0), 0);
    const cRev = filteredComms.reduce((s, r) => s + Number(r.revenue || 0), 0);
    const totalRev = gRev + mRev + cRev;

    const gConv = filteredGoogle.reduce((s, r) => s + Number(r.conversions || 0), 0);
    const mConv = filteredMeta.reduce((s, r) => s + Number(r.conversions || 0), 0);
    const cConv = filteredComms.reduce((s, r) => s + Number(r.conversions || 0), 0);
    const totalConv = gConv + mConv + cConv;

    const roas = totalSpend > 0 ? (totalRev / totalSpend).toFixed(2) : '0.00';

    return {
      adsSpend: { ...marketingMetrics.adsSpend, value: `₹${(totalSpend / 1000).toFixed(1)}k` },
      revenue: { ...marketingMetrics.revenue, value: `₹${(totalRev / 1000).toFixed(1)}k` },
      roas: { ...marketingMetrics.roas, value: `${roas}x` },
      conversions: { ...marketingMetrics.conversions, value: totalConv.toLocaleString() }
    };
  }, [filteredGoogle, filteredMeta, filteredComms]);

  // Dynamic chart data
  const dynamicChartData = useMemo(() => {
    // Generate data based on filtered rows
    const days = dateFilter === 'today' ? 1 : dateFilter === '7d' ? 7 : 30;
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayGoogle = filteredGoogle.filter(r => r.created_at?.startsWith(dateStr));
      const dayMeta = filteredMeta.filter(r => r.created_at?.startsWith(dateStr));
      const dayComms = filteredComms.filter(r => r.created_at?.startsWith(dateStr));
      
      const dayRev = [...dayGoogle, ...dayMeta, ...dayComms].reduce((s, r) => s + Number(r.revenue || 0), 0);
      const daySpend = [...dayGoogle, ...dayMeta, ...dayComms].reduce((s, r) => s + Number(r.spend || 0), 0);
      const dayConv = [...dayGoogle, ...dayMeta, ...dayComms].reduce((s, r) => s + Number(r.conversions || 0), 0);

      data.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dayRev,
        spend: daySpend,
        conversions: dayConv
      });
    }
    return data;
  }, [dateFilter, filteredGoogle, filteredMeta, filteredComms]);

  const columns = [
    { key: 'name', label: 'Campaign' },
    { key: 'platform', label: 'Platform' },
    { 
      key: 'spend', 
      label: 'Spend', 
      render: (val) => `₹${val.toLocaleString()}` 
    },
    { 
      key: 'revenue', 
      label: 'Revenue', 
      render: (val) => `₹${val.toLocaleString()}` 
    },
    { 
      key: 'roas', 
      label: 'ROAS', 
      render: (val) => `${val}x` 
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          val === 'Active' ? 'bg-neon-green/10 text-neon-green' : 
          val === 'Paused' ? 'bg-neon-orange/10 text-neon-orange' : 'bg-gray-500/10 text-gray-400'
        }`}>
          {val}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-8 fade-up">
      {!hideHeader && (
        <MarketingAdsHeader 
          currentRole={currentRole} 
          onRoleChange={onRoleChange}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          loggedInRole={loggedInRole}
          activeView={activeView}
          setActiveView={setActiveView}
        />
      )}

      {/* Metrics Cards */}
      {!hideStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MarketingStatCard 
            label="Ads Spend" 
            value={metrics.adsSpend.value}
            change={metrics.adsSpend.change}
            trend={metrics.adsSpend.trend}
            icon={<DollarSign className="w-5 h-5 text-neon-blue" />}
            accentColor="blue"
          />
          <MarketingStatCard 
            label="Revenue" 
            value={metrics.revenue.value}
            change={metrics.revenue.change}
            trend={metrics.revenue.trend}
            icon={<TrendingUp className="w-5 h-5 text-neon-green" />}
            accentColor="green"
          />
          <MarketingStatCard 
            label="ROAS" 
            value={metrics.roas.value}
            change={metrics.roas.change}
            trend={metrics.roas.trend}
            icon={<Target className="w-5 h-5 text-neon-orange" />}
            accentColor="orange"
          />
          <MarketingStatCard 
            label="Conversions" 
            value={metrics.conversions.value}
            change={metrics.conversions.change}
            trend={metrics.conversions.trend}
            icon={<BarChart2 className="w-5 h-5 text-neon-purple" />}
            accentColor="purple"
          />
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart data={dynamicChartData} />
        <AdsSpendChart data={dynamicChartData} />
        <ConversionChart data={dynamicChartData} />
      </div>

      {/* Data Table Section - REMOVED CAMPAIGN PERFORMANCE */}
    </div>
  );
}
