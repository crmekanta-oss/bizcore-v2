import React from 'react';
import { Calendar, UserCircle } from 'lucide-react';
import { dateFilters } from '../data/marketingAdsData';

export default function MarketingAdsHeader({ 
  currentRole, 
  onRoleChange, 
  dateFilter, 
  onDateFilterChange, 
  dateRange,
  onDateRangeChange,
  loggedInRole, 
  activeView, 
  setActiveView 
}) {
  const roles = [
    { id: 'admin', label: 'Admin', view: 'admin' },
    { id: 'ceo', label: 'CEO', view: 'overview' },
    { id: 'mkt', label: 'Marketing & Ads', view: 'marketing' }
  ];

  return (
    <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Marketing & Ads</h1>
        <p className="text-gray-400">Track your performance, revenue, and campaign efficiency in real-time.</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Date Filter */}
        <div className="flex items-center bg-glass backdrop-blur-md border border-white/10 rounded-2xl p-1 relative">
          {dateFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onDateFilterChange(filter.value)}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${
                dateFilter === filter.value 
                  ? 'bg-neon-blue text-black shadow-neon-blue scale-105' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {filter.label}
            </button>
          ))}
          
          <div className="relative flex items-center">
            <button 
              onClick={() => onDateFilterChange('custom')}
              className={`p-2 transition-all duration-300 ml-1 rounded-xl ${
                dateFilter === 'custom' ? 'bg-neon-blue text-black shadow-neon-blue scale-105' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4" />
            </button>
            <input 
              type="date" 
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              style={{ zIndex: 10 }}
              onChange={(e) => {
                onDateFilterChange('custom');
                onDateRangeChange(prev => ({ ...prev, startDate: e.target.value }));
              }}
            />
          </div>

          {dateFilter === 'custom' && (
            <div className="absolute top-full right-0 mt-2 bg-glass backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-50 flex flex-col gap-3 min-w-[200px]">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">Start Date</label>
                <input 
                  type="date" 
                  value={dateRange.startDate}
                  onChange={(e) => onDateRangeChange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold ml-1">End Date</label>
                <input 
                  type="date" 
                  value={dateRange.endDate}
                  onChange={(e) => onDateRangeChange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
                />
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Simulation - Only for CEO */}
        {loggedInRole === 'ceo' && (
          <div className="flex items-center bg-glass backdrop-blur-md border border-white/10 rounded-2xl p-1">
            <div className="px-3 text-gray-500 border-r border-white/10 mr-1">
              <UserCircle className="w-5 h-5" />
            </div>
            {roles.map((role) => {
              const isActive = (role.id === 'ceo' && activeView === 'overview') || 
                              (role.id === 'admin' && activeView === 'admin') || 
                              (role.id === 'mkt' && activeView === 'marketing');
              
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    onRoleChange(role.id);
                    setActiveView(role.view);
                  }}
                  className={`px-6 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-white text-black shadow-xl scale-105' 
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {role.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
