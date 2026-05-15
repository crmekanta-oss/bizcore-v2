import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function RevenueChart({ data }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#161923] p-6 h-[320px]">
      <h3 className="text-white font-semibold mb-6">Revenue Overview</h3>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `₹${value / 1000}k`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#11141d', border: '1px solid #252a38', borderRadius: '12px', fontSize: '12px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#00f2ff" 
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
            strokeWidth={3}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AdsSpendChart({ data }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#161923] p-6 h-[320px]">
      <h3 className="text-white font-semibold mb-6">Ads Spend</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `₹${value / 1000}k`}
          />
          <Tooltip 
            cursor={{fill: 'rgba(255,255,255,0.03)'}}
            contentStyle={{ backgroundColor: '#11141d', border: '1px solid #252a38', borderRadius: '12px', fontSize: '12px' }}
          />
          <Bar dataKey="spend" fill="#ff9d00" radius={[4, 4, 0, 0]} barSize={35} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ConversionChart({ data }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#161923] p-6 h-[320px]">
      <h3 className="text-white font-semibold mb-6">Conversions</h3>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#39ff14" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#39ff14" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#11141d', border: '1px solid #252a38', borderRadius: '12px', fontSize: '12px' }}
          />
          <Area 
            type="stepAfter" 
            dataKey="conversions" 
            stroke="#39ff14" 
            fillOpacity={1} 
            fill="url(#colorConv)" 
            strokeWidth={3}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
