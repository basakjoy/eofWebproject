'use client';

import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { 
  TrendingUp, 
  Award, 
  Zap, 
  CheckCircle2, 
  Activity, 
  BarChart3, 
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

// --- Data Constants ---
const pipsHistoryData = [
  { month: 'Jan', pips: 850, winRate: 85, trades: 42 },
  { month: 'Feb', pips: 1420, winRate: 88, trades: 50 },
  { month: 'Mar', pips: 2100, winRate: 86, trades: 48 },
  { month: 'Apr', pips: 2950, winRate: 91, trades: 55 },
  { month: 'May', pips: 3800, winRate: 89, trades: 45 },
  { month: 'Jun', pips: 4650, winRate: 92, trades: 52 },
  { month: 'Jul', pips: 5480, winRate: 87, trades: 60 },
];

const pairPerformanceData = [
  { pair: 'EUR/USD', wins: 48, losses: 6, winRate: 88.8 },
  { pair: 'GBP/USD', wins: 42, losses: 7, winRate: 85.7 },
  { pair: 'XAU/USD', wins: 56, losses: 4, winRate: 93.3 },
  { pair: 'USD/JPY', wins: 38, losses: 5, winRate: 88.3 },
  { pair: 'BTC/USD', wins: 35, losses: 8, winRate: 81.3 },
];

const assetDistribution = [
  { name: 'Forex Pairs', value: 55, color: '#ff6b00' },
  { name: 'Gold & Metals', value: 25, color: '#edc157' },
  { name: 'Crypto Assets', value: 20, color: '#343539' },
];

// --- Framer Motion Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 300, damping: 24 } 
  },
};

export default function SignalAnalyticsOverview() {
  const [timeRange, setTimeRange] = useState<'1W' | '1M' | '3M' | 'ALL'>('3M');

  return (
    <motion.div 
      className="space-y-6 max-w-7xl mx-auto font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Performance Analytics</h2>
        <p className="text-sm text-zinc-400 mt-1">Comprehensive overview of trading signal metrics and asset distribution.</p>
      </motion.div>

      {/* Top Key Metrics Banner */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Pips Captured', value: '+5,480', suffix: 'pips', trend: '+18.4% vs last mo', icon: TrendingUp, color: 'text-fiery-orange', bg: 'bg-fiery-orange/10' },
          { label: 'Historical Win Rate', value: '87.4', suffix: '%', trend: 'Verified 800+ signals', icon: CheckCircle2, color: 'text-fiery-orange', bg: 'bg-fiery-orange/10' },
          { label: 'Average R:R Ratio', value: '1:3.2', suffix: '', trend: 'High expectancy', icon: Zap, color: 'text-amber-300', bg: 'bg-amber-300/10' },
          { label: 'Active Win Streak', value: '14', suffix: 'trades', trend: 'Current momentum', icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div 
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="border border-white/10 rounded-lg p-5 shadow-sm cursor-pointer hover:border-fiery-orange/30 hover:shadow-lg hover:shadow-black/20 liquid-panel glass-card"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-zinc-400 font-medium">{item.label}</span>
                <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <p className="text-2xl font-bold text-white tracking-tight">{item.value}</p>
                {item.suffix && <span className="text-sm font-medium text-zinc-500">{item.suffix}</span>}
              </div>
              <span className="text-xs font-medium text-zinc-500">{item.trend}</span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cumulative Pips Growth Area Chart (2 Cols) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 border border-white/10 rounded-lg p-6 shadow-sm flex flex-col relative overflow-hidden group liquid-panel glass-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-fiery-orange" />
                Cumulative Pips Growth
              </h3>
              <p className="text-xs text-zinc-400 mt-1">Net profit accumulation over time</p>
            </div>
            
            {/* Interactive Sliding Tab Menu using Framer Motion layoutId */}
            <div className="flex items-center gap-1 bg-[#0a0a0a] p-1 rounded-sm border border-white/10 self-start sm:self-auto relative">
              {(['1W', '1M', '3M', 'ALL'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-colors z-10 ${
                    timeRange === range ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {timeRange === range && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white/10 rounded-sm shadow-sm"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-20">{range}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-72 mt-auto relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pipsHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="pipsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff6b00" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis stroke="#71717a" dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                <YAxis stroke="#71717a" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                <Tooltip 
                  cursor={{ stroke: '#52525b', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#e4e4e7', fontSize: '14px' }}
                  labelStyle={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '4px' }}
                  formatter={(value: any) => [`+${value} pips`, 'Cumulative Pips']}
                />
                  <Area 
                  type="monotone" 
                  dataKey="pips" 
                  stroke="#ff6b00" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#pipsGradient)" 
                  activeDot={{ r: 6, fill: '#ff6b00', stroke: '#18181b', strokeWidth: 2 }}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Asset Class Distribution Pie Chart (1 Col) */}
        <motion.div variants={itemVariants} className="border border-white/10 rounded-lg p-6 shadow-sm flex flex-col hover:border-amber-300/30 transition-colors liquid-panel glass-card">
          <div className="mb-2">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-fiery-amber" />
              Asset Allocation
            </h3>
            <p className="text-xs text-zinc-400 mt-1">Signal distribution by market</p>
          </div>

          <div className="w-full flex-1 min-h-[200px] relative flex items-center justify-center my-4 group">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetDistribution}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  animationDuration={1000}
                >
                  {assetDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  cursor={false}
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#e4e4e7', fontSize: '14px', fontWeight: 500 }}
                  formatter={(value: any) => [`${value}%`, 'Allocation']}
                />
              </PieChart>
            </ResponsiveContainer>

            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="absolute flex flex-col items-center justify-center pointer-events-none"
            >
              <span className="text-2xl font-bold text-white leading-none mb-1">800+</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Signals</span>
            </motion.div>
          </div>

          <div className="space-y-3 pt-4 border-t border-zinc-800/50 mt-auto">
            {assetDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm group/item cursor-pointer">
                <div className="flex items-center gap-3">
                  <motion.span 
                    whileHover={{ scale: 1.5 }}
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: item.color }} 
                  />
                  <span className="text-zinc-400 group-hover/item:text-zinc-200 transition-colors">{item.name}</span>
                </div>
                <span className="font-semibold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Pair-by-Pair Success Breakdown Bar Chart */}
      <motion.div variants={itemVariants} className="border border-white/10 rounded-lg p-6 shadow-sm liquid-panel glass-card">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-fiery-orange" />
            Performance by Instrument
          </h3>
          <p className="text-xs text-zinc-400 mt-1">Win/Loss ratio for the top traded symbols</p>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pairPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis stroke="#71717a" dataKey="pair" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
              <YAxis stroke="#71717a" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
              <Tooltip 
                cursor={{ fill: '#27272a', opacity: 0.4 }}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                itemStyle={{ fontSize: '14px' }}
                labelStyle={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '4px' }}
              />
              <Bar dataKey="wins" name="Wins" fill="#ff6b00" radius={[2, 2, 0, 0]} maxBarSize={40} animationDuration={1200} />
              <Bar dataKey="losses" name="Losses" fill="#ffb3b5" radius={[2, 2, 0, 0]} maxBarSize={40} animationDuration={1200} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </motion.div>
  );
}