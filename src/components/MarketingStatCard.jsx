import React from 'react';

export default function MarketingStatCard({ label, value, change, trend, icon, accentColor = 'blue' }) {
  const accentColors = {
    blue: 'border-neon-blue/50 shadow-neon-blue',
    orange: 'border-neon-orange/50 shadow-neon-orange',
    green: 'border-neon-green/50 shadow-neon-green',
    purple: 'border-neon-purple/50 shadow-neon-purple',
  };

  const trendColor = trend === 'up' ? 'text-neon-green' : 'text-red-500';

  return (
    <div className={`relative group overflow-hidden rounded-2xl border-2 bg-[#161923]/80 backdrop-blur-md p-6 transition-all duration-500 hover:scale-[1.02] ${accentColors[accentColor] || accentColors.blue}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
          {icon}
        </div>
        <div className={`text-[10px] font-bold px-2 py-1 rounded-lg bg-black/40 border border-white/5 ${trendColor}`}>
          {change}
        </div>
      </div>
      <div>
        <p className="text-gray-400 text-[13px] font-medium mb-1 uppercase tracking-wider">{label}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      </div>
      {/* Decorative background glow */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 blur-[80px] opacity-20 rounded-full bg-current ${accentColors[accentColor]?.split(' ')[0]}`} />
    </div>
  );
}
