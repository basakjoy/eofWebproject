'use client';

import {
  TrendingUp,
  DollarSign,
  Activity,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Target,
  Zap,
  ChevronRight,
  Crown,
} from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


import StatCard from '@/components/common/StatCard';
import Card from '@/components/common/Card';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useForex } from '@/hooks/use-forex';



// --- Custom Tooltip Component ---
interface TooltipPayloadItem {
  value: number;
  dataKey: string;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white/95 dark:bg-[#0d111b]/95 backdrop-blur-md border border-gray-200/50 dark:border-white/[0.08] rounded-2xl shadow-2xl p-4 min-w-[160px] animate-in fade-in zoom-in duration-200">
      <p className="text-[10px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-[0.15em] mb-2">{label}</p>
      {payload.map((entry: TooltipPayloadItem, index: number) => (
        <div key={index} className="flex items-center justify-between gap-6">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">{entry.dataKey}</span>
          <span className="text-sm font-extrabold text-gray-900 dark:text-white tabular-nums">
            ${entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

const TICKER_PAIRS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'BTC/USD', 'ETH/USD'];



export default function UserDashboard() {
  // --- Data ---
  const portfolioData = [
    { month: 'Jan', value: 2000, profit: 0 },
    { month: 'Feb', value: 2170, profit: 170 },
    { month: 'Mar', value: 2500, profit: 330 },
    { month: 'Apr', value: 2780, profit: 280 },
    { month: 'May', value: 3000, profit: 220 },
    { month: 'Jun', value: 4000, profit: 1000 },
    { month: 'Jul', value: 4350, profit: 350 },
    { month: 'Aug', value: 4800, profit: 450 },
  ];

  const weeklyPerformance = [
    { day: 'Mon', pnl: 120 },
    { day: 'Tue', pnl: -45 },
    { day: 'Wed', pnl: 200 },
    { day: 'Thu', pnl: 85 },
    { day: 'Fri', pnl: -30 },
    { day: 'Sat', pnl: 150 },
    { day: 'Sun', pnl: 60 },
  ];

  const signals = [
    {
      id: 1,
      pair: 'EUR/USD',
      type: 'BUY',
      entry: 1.085,
      target: 1.092,
      stopLoss: 1.081,
      status: 'Active',
      profit: '+$120',
      time: '2h ago',
    },
    {
      id: 2,
      pair: 'GBP/USD',
      type: 'SELL',
      entry: 1.265,
      target: 1.25,
      stopLoss: 1.272,
      status: 'Active',
      profit: '+$85',
      time: '4h ago',
    },
    {
      id: 3,
      pair: 'USD/JPY',
      type: 'BUY',
      entry: 149.5,
      target: 150.2,
      stopLoss: 149.1,
      status: 'Closed',
      profit: '+$240',
      time: '1d ago',
    },
    {
      id: 4,
      pair: 'AUD/USD',
      type: 'SELL',
      entry: 0.653,
      target: 0.645,
      stopLoss: 0.658,
      status: 'Pending',
      profit: '--',
      time: '30m ago',
    },
  ];

  const recentActivity = [
    { id: 1, action: 'Signal Executed', detail: 'EUR/USD Buy at 1.0850', time: '2h ago', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 2, action: 'Profit Taken', detail: 'USD/JPY closed at +$240', time: '1d ago', icon: <Target className="w-3.5 h-3.5" /> },
    { id: 3, action: 'New Signal', detail: 'GBP/USD Sell alert triggered', time: '4h ago', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 4, action: 'Deposit', detail: '$500 added to account', time: '2d ago', icon: <DollarSign className="w-3.5 h-3.5" /> },
  ];

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);
  const { data: forexData } = useForex(TICKER_PAIRS);

  useEffect(() => {
    setMounted(true);

    if (containerRef.current) {
      const ctx = gsap.context(() => {
        // Staggered entrance for all major sections
        gsap.from(".animate-section", {
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 1,
          ease: "expo.out",
          clearProps: "all"
        });

        // Entrance for stats cards specifically
        gsap.from(".stat-card-stagger", {
          scale: 0.9,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.2
        });

        // Mouse parallax for background glows
        const handleMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e;
          const xPos = (clientX / window.innerWidth - 0.5) * 40;
          const yPos = (clientY / window.innerHeight - 0.5) * 40;

          gsap.to(".bg-glow-1", {
            x: xPos,
            y: yPos,
            duration: 2,
            ease: "power2.out"
          });
          gsap.to(".bg-glow-2", {
            x: -xPos,
            y: -yPos,
            duration: 2,
            ease: "power2.out"
          });
        };

        const actions = document.querySelectorAll('.interactive-action');
        actions.forEach(btn => {
          btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
              scale: 1.05,
              y: -5,
              duration: 0.4,
              ease: "elastic.out(1.2, 0.5)"
            });
          });
          btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
              scale: 1,
              y: 0,
              duration: 0.4,
              ease: "power2.out"
            });
          });
        });

        // Floating VIP Crown
        gsap.to(".vip-crown", {
          y: -10,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });

        window.addEventListener("mousemove", handleMouseMove);

        return () => window.removeEventListener("mousemove", handleMouseMove);

      }, containerRef);


      return () => ctx.revert();
    }
  }, []);




  return (
    <div ref={containerRef} className="space-y-6 sm:space-y-8 pb-10">

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="bg-glow-1 absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="bg-glow-2 absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Live Rates Marquee */}

      <div className="relative -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-hidden">
        <div className="flex gap-4 sm:gap-6 animate-marquee whitespace-nowrap py-2">
          {TICKER_PAIRS.concat(TICKER_PAIRS).map((pairKey, i) => {
            const rate = forexData[pairKey];
            if (!rate) return null;
            return (
              <div key={`${i}-${rate.rate}`} className="inline-flex items-center gap-2 sm:gap-3 bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05] rounded-full px-4 py-1.5 sm:px-5 sm:py-2 shadow-sm animate-price-flash">

                <span className="text-[10px] sm:text-xs font-black tracking-tight dark:text-white/80">{rate.pair}</span>
                <span className="text-[10px] sm:text-xs font-mono font-bold dark:text-white">{rate.rate}</span>
                <span className={`text-[9px] sm:text-[10px] font-black ${rate.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {rate.change}
                </span>
              </div>
            );
          })}
        </div>

        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10 hidden sm:block" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10 hidden sm:block" />
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tightest">
            Overview
          </h1>
          <p className="text-xs font-bold text-gray-400 dark:text-white/20 mt-2 flex items-center gap-2 uppercase tracking-[0.2em]">
            <Calendar className="w-4 h-4 text-primary/40" />
            {currentDate}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Market Phase</span>
            <span className="text-xs font-black text-gray-900 dark:text-white">Active Accumulation</span>
          </div>
          <div className="inline-flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-5 sm:py-3 rounded-2xl bg-white dark:bg-[#070b14] border border-gray-200/50 dark:border-white/[0.08] shadow-2xl shadow-black/5 ring-1 ring-black/[0.02] dark:ring-white/[0.02]">
            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              Live Market
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-section">
        <div className="stat-card-stagger">
          <StatCard
            label="Account Balance"
            value="$10,500"
            icon={<DollarSign className="w-5 h-5" />}
            color="blue"
            trend={{ value: 12.5, isPositive: true }}
            subtitle="vs last month"
          />
        </div>
        <div className="stat-card-stagger">
          <StatCard
            label="Monthly Profit"
            value="$2,450"
            icon={<TrendingUp className="w-5 h-5" />}
            color="green"
            trend={{ value: 8.3, isPositive: true }}
            subtitle="vs last month"
          />
        </div>
        <div className="stat-card-stagger">
          <StatCard
            label="Active Signals"
            value="5"
            icon={<Activity className="w-5 h-5" />}
            color="yellow"
            trend={{ value: 2, isPositive: true }}
            subtitle="new today"
          />
        </div>
        <div className="stat-card-stagger">
          <StatCard
            label="Win Rate"
            value="68%"
            icon={<BarChart3 className="w-5 h-5" />}
            color="indigo"
            trend={{ value: 3.2, isPositive: true }}
            subtitle="this week"
          />
        </div>
      </div>


      {/* Quick Actions & Market Status */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-section">

        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { name: 'Deposit', icon: <ArrowDownRight className="w-4 h-4" />, color: 'bg-emerald-500', text: 'text-emerald-500' },
            { name: 'Withdraw', icon: <ArrowUpRight className="w-4 h-4" />, color: 'bg-rose-500', text: 'text-rose-500' },
            { name: 'Transfer', icon: <Zap className="w-4 h-4" />, color: 'bg-blue-500', text: 'text-blue-500' },
            { name: 'Exchange', icon: <BarChart3 className="w-4 h-4" />, color: 'bg-amber-500', text: 'text-amber-500' },
          ].map((action) => (
            <button
              key={action.name}
              className="group interactive-action flex flex-col items-center justify-center p-4 rounded-3xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.05] hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
            >

              <div className={`${action.color} p-3 rounded-2xl text-white mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest dark:text-white/60 group-hover:text-primary transition-colors">
                {action.name}
              </span>
            </button>
          ))}
        </div>
        <Card className="flex flex-col justify-center items-center text-center p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/10">
          <div className="vip-crown w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <Crown className="w-6 h-6 text-primary animate-pulse" />
          </div>

          <h4 className="text-sm font-black dark:text-white mb-1 uppercase tracking-tighter">VIP Signal Status</h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lifetime Access Active</p>
        </Card>
      </div>


      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 animate-section">

        {/* Portfolio Growth - Takes 2/3 width on large screens */}
        <Card className="lg:col-span-2 relative group overflow-hidden" padding="lg">
          <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className="w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
                Portfolio Growth
              </h2>
              <p className="text-xs font-bold text-gray-400 dark:text-white/20 uppercase tracking-widest mt-1">
                Real-time performance analytics
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +140.2%
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest ml-2">Total Yield</span>
            </div>
          </div>
          <div className="w-full h-64 sm:h-80 md:h-96">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="0"
                    vertical={false}
                    stroke="rgba(156, 163, 175, 0.05)"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 800, textAnchor: 'middle' }}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 800 }}
                    tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: 'rgba(59, 130, 246, 0.1)', strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={4}
                    fill="url(#portfolioGradient)"
                    dot={false}
                    activeDot={{ r: 6, fill: '#3B82F6', stroke: '#fff', strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

        </Card>

        {/* Weekly P&L - Takes 1/3 width */}
        <Card padding="lg">
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
              Weekly P&L
            </h2>
            <p className="text-xs font-bold text-gray-400 dark:text-white/20 uppercase tracking-widest mt-1">
              Performance by day
            </p>
          </div>
          <div className="w-full h-64 sm:h-80 md:h-96">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyPerformance} barSize={24} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="0"
                    vertical={false}
                    stroke="rgba(156, 163, 175, 0.05)"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 800 }}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 800 }}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(156, 163, 175, 0.02)' }} />
                  <Bar dataKey="pnl" radius={[8, 8, 8, 8]}>
                    {weeklyPerformance.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.pnl >= 0 ? '#10B981' : '#EF4444'}
                        fillOpacity={0.9}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </Card>
      </div>

      {/* Bottom Row: Signals Table + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 animate-section">

        {/* Recent Signals Table - 2/3 */}
        <Card className="lg:col-span-2 overflow-hidden" padding="none">
          <div className="px-8 pt-8 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
                  Recent Signals
                </h2>
                <p className="text-xs font-bold text-gray-400 dark:text-white/20 uppercase tracking-widest mt-1">
                  Active trading intelligence
                </p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 hover:bg-primary/10 text-xs font-black text-primary uppercase tracking-widest transition-all">
                All Sessions <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto mt-4 px-2">
            <table className="w-full text-sm border-separate border-spacing-y-2 px-6">
              <thead>
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-left text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] whitespace-nowrap">
                    Asset Pair
                  </th>
                  <th className="px-3 sm:px-4 py-4 text-left text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] whitespace-nowrap">
                    Direction
                  </th>
                  <th className="px-3 sm:px-4 py-4 text-left text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] whitespace-nowrap">
                    Price Level
                  </th>
                  <th className="px-3 sm:px-4 py-4 text-left text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] whitespace-nowrap hidden sm:table-cell">
                    Current P&L
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-right text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {signals.map((signal) => (
                  <tr
                    key={signal.id}
                    className="group"
                  >
                    <td className="px-4 sm:px-6 py-4 bg-gray-50/30 dark:bg-white/[0.01] rounded-l-2xl border-y border-l border-gray-100 dark:border-white/[0.04] transition-all group-hover:bg-gray-100/50 dark:group-hover:bg-white/[0.03]">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900 dark:text-white tracking-tight">
                          {signal.pair}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 dark:text-white/20 uppercase tracking-widest mt-0.5">
                          {signal.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 bg-gray-50/30 dark:bg-white/[0.01] border-y border-gray-100 dark:border-white/[0.04] transition-all group-hover:bg-gray-100/50 dark:group-hover:bg-white/[0.03]">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase ${signal.type === 'BUY'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                      >
                        {signal.type === 'BUY' ? (
                          <ArrowUpRight className="w-3 h-3 stroke-[3]" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 stroke-[3]" />
                        )}
                        {signal.type}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-4 bg-gray-50/30 dark:bg-white/[0.01] border-y border-gray-100 dark:border-white/[0.04] transition-all group-hover:bg-gray-100/50 dark:group-hover:bg-white/[0.03]">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-bold text-gray-700 dark:text-white/80">ENT {signal.entry}</span>
                        <span className="font-mono text-[10px] text-gray-400 whitespace-nowrap">TGT {signal.target}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-4 bg-gray-50/30 dark:bg-white/[0.01] border-y border-gray-100 dark:border-white/[0.04] transition-all group-hover:bg-gray-100/50 dark:group-hover:bg-white/[0.03] hidden sm:table-cell">
                      <span
                        className={`font-black text-xs tracking-tight ${signal.profit.startsWith('+')
                          ? 'text-emerald-500'
                          : 'text-gray-400'
                          }`}
                      >
                        {signal.profit}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 bg-gray-50/30 dark:bg-white/[0.01] rounded-r-2xl border-y border-r border-gray-100 dark:border-white/[0.04] text-right transition-all group-hover:bg-gray-100/50 dark:group-hover:bg-white/[0.03]">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${signal.status === 'Active'
                          ? 'bg-primary/10 text-primary'
                          : signal.status === 'Closed'
                            ? 'bg-gray-100 dark:bg-white/5 text-gray-400'
                            : 'bg-amber-500/10 text-amber-600'
                          }`}
                      >
                        {signal.status === 'Active' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        )}
                        {signal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Activity Feed - 1/3 */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
                Activity
              </h2>
              <p className="text-xs font-bold text-gray-400 dark:text-white/20 uppercase tracking-widest mt-1">
                Real-time log
              </p>
            </div>
            <div className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-4">
            {recentActivity.map((item, index) => (
              <div
                key={item.id}
                className="group relative flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-white/[0.01] border border-gray-100/50 dark:border-white/[0.03] transition-all hover:bg-white dark:hover:bg-white/[0.04] hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white dark:bg-[#0d111b] border border-gray-100 dark:border-white/[0.08] text-primary flex items-center justify-center shadow-lg shadow-black/5 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900 dark:text-white leading-tight">{item.action}</p>
                  <p className="text-[11px] font-medium text-gray-500 dark:text-white/40 mt-1 line-clamp-1">
                    {item.detail}
                  </p>
                  <span className="inline-block text-[10px] font-black uppercase tracking-widest text-primary/40 mt-2">
                    {item.time}
                  </span>
                </div>

              </div>
            ))}
          </div>
        </Card>
      </div>


    </div>
  );
}


