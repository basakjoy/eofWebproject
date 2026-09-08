'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
  ChevronRight,
  Crown,
  Target,
  Wallet,
  RefreshCw,
  BookOpen,
  Newspaper,
  GraduationCap,
  Eye,
  ArrowRight,
  Loader2,
} from 'lucide-react';
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

import { usePortfolio } from '@/hooks/usePortfolio';
import { useSignals } from '@/hooks/useSignals';
import { useTransactions } from '@/hooks/useTransactions';
import { useForex } from '@/hooks/use-forex';
import { useAuthStore } from '@/store/authStore';
import blogApi, { BlogArticle } from '@/lib/blogApi';

// ─── Constants ───────────────────────────────────────────────────────────────

const TICKER_PAIRS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'XAU/USD', 'BTC/USD'];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Education: GraduationCap,
  Analysis: BarChart3,
  Blog: Newspaper,
  News: TrendingUp,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h > 23) return `${Math.floor(h / 24)}d ago`;
  if (h > 0) return `${h}h ago`;
  return `${m}m ago`;
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function DarkTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0C0C10] border border-white/10 rounded-xl p-3 shadow-2xl min-w-[140px]">
      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="text-[11px] text-white/50 capitalize">{entry.dataKey}</span>
          <span className="text-sm font-bold text-white tabular-nums">${entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accentClass: string;
  trend?: { value: string; positive: boolean } | null;
  loading?: boolean;
}

function DashStatCard({ label, value, icon, accentClass, trend, loading }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0C0C10] border border-white/[0.06] p-5 group hover:border-white/[0.12] transition-all duration-300">
      {/* Accent glow top-right */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${accentClass}`} />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.18em] mb-2">{label}</p>
          {loading ? (
            <div className="h-8 w-28 bg-white/[0.06] rounded-lg animate-pulse" />
          ) : (
            <p className="text-2xl font-extrabold text-white tabular-nums tracking-tight truncate">{value}</p>
          )}
          {trend && !loading && (
            <span className={`inline-flex items-center gap-1 mt-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              trend.positive
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-rose-500/10 text-rose-400'
            }`}>
              {trend.positive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
              {trend.value}
            </span>
          )}
        </div>
        <div className={`p-3 rounded-xl flex-shrink-0 ${accentClass} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ─── Signal Direction Chip ────────────────────────────────────────────────────

function DirectionChip({ type }: { type: string }) {
  const isBuy = type.toUpperCase() === 'BUY';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
      isBuy
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
    }`}>
      {isBuy ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
      {type}
    </span>
  );
}

// ─── Status Chip ─────────────────────────────────────────────────────────────

function StatusChip({ status }: { status: string }) {
  const s = status?.toLowerCase();
  const config =
    s === 'active'
      ? 'bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/20'
      : s === 'closed'
      ? 'bg-white/5 text-white/30 border-white/10'
      : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${config}`}>
      {s === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />}
      {status}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UserDashboard() {
  const { user } = useAuthStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // ── API Data ─────────────────────────────────────────────────────────────
  const { portfolio, loading: portfolioLoading } = usePortfolio();
  const { signals, loading: signalsLoading } = useSignals({ limit: 5 });
  const { transactions, loading: txLoading } = useTransactions({ limit: 5 });
  const { data: forexData } = useForex(TICKER_PAIRS);

  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  useEffect(() => {
    blogApi.getArticles({ limit: 3 }).then(r => setArticles(r.data)).catch(() => setArticles([])).finally(() => setArticlesLoading(false));
  }, []);

  // ── Derived Metrics ───────────────────────────────────────────────────────
  const totalInvested = Number(portfolio?.totalInvested ?? 0);
  const totalReturns  = Number(portfolio?.totalReturns ?? 0);
  const roi           = portfolio ? investmentApi_calculateROI(totalInvested, totalReturns) : '—';
  const activeSignals = signals.filter(s => s.status?.toLowerCase() === 'active').length;

  const currentMonth = new Date();
  const monthlyProfit = (portfolio?.recentTransactions ?? [])
    .filter((t: any) => String(t.type).toLowerCase() === 'profit')
    .filter((t: any) => {
      const d = new Date(t.createdAt);
      return d.getFullYear() === currentMonth.getFullYear() && d.getMonth() === currentMonth.getMonth();
    })
    .reduce((sum: number, t: any) => sum + Number(t.amount ?? 0), 0);

  // ── Chart Data ────────────────────────────────────────────────────────────
  const portfolioChartData = [
    { month: 'Jan', value: 2000 },
    { month: 'Feb', value: 2170 },
    { month: 'Mar', value: 2500 },
    { month: 'Apr', value: 2780 },
    { month: 'May', value: 3100 },
    { month: 'Jun', value: 4000 },
    { month: 'Jul', value: 4350 },
    { month: 'Aug', value: 4800 },
  ];

  const weeklyPnL = [
    { day: 'Mon', pnl: 120 },
    { day: 'Tue', pnl: -45 },
    { day: 'Wed', pnl: 200 },
    { day: 'Thu', pnl: 85 },
    { day: 'Fri', pnl: -30 },
    { day: 'Sat', pnl: 150 },
    { day: 'Sun', pnl: 60 },
  ];

  // ── Animations ────────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.dash-section', {
        y: 32,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'expo.out',
        clearProps: 'all',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div ref={containerRef} className="space-y-6 pb-12 px-6 py-6">

      {/* ── LIVE TICKER ──────────────────────────────────────────────────── */}
      <div className="dash-section relative -mx-6 px-6 overflow-hidden">
        <div className="flex gap-3 animate-marquee whitespace-nowrap py-1">
          {TICKER_PAIRS.concat(TICKER_PAIRS).map((pairKey, i) => {
            const rate = forexData[pairKey];
            if (!rate) return null;
            return (
              <div
                key={`${pairKey}-${i}`}
                className="inline-flex items-center gap-2 bg-[#0C0C10] border border-white/[0.06] rounded-full px-4 py-1.5 shrink-0"
              >
                <span className="text-[10px] font-black text-white/70 tracking-wider">{rate.pair}</span>
                <span className="text-xs font-mono font-bold text-white tabular-nums">{rate.rate}</span>
                <span className={`text-[10px] font-bold ${rate.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {rate.change}
                </span>
              </div>
            );
          })}
        </div>
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#050508] to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#050508] to-transparent pointer-events-none z-10" />
      </div>

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="dash-section flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-xs font-semibold text-white/25 uppercase tracking-[0.2em] mt-1.5">{currentDate}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Market Phase</span>
            <span className="text-xs font-bold text-white">Active Accumulation</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#0C0C10] border border-white/[0.06]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">Live Market</span>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ───────────────────────────────────────────────────── */}
      <div className="dash-section grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashStatCard
          label="Account Balance"
          value={`$${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<DollarSign className="w-5 h-5 text-[#FF6B00]" />}
          accentClass="bg-[#FF6B00]"
          trend={null}
          loading={portfolioLoading}
        />
        <DashStatCard
          label="Monthly Profit"
          value={`$${monthlyProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          accentClass="bg-emerald-500"
          trend={monthlyProfit > 0 ? { value: `+$${monthlyProfit.toFixed(0)}`, positive: true } : null}
          loading={portfolioLoading}
        />
        <DashStatCard
          label="Active Signals"
          value={signalsLoading ? '—' : String(activeSignals)}
          icon={<Activity className="w-5 h-5 text-amber-400" />}
          accentClass="bg-amber-500"
          trend={activeSignals > 0 ? { value: `${activeSignals} live`, positive: true } : null}
          loading={signalsLoading}
        />
        <DashStatCard
          label="Total ROI"
          value={portfolioLoading ? '—' : `${roi}%`}
          icon={<BarChart3 className="w-5 h-5 text-indigo-400" />}
          accentClass="bg-indigo-500"
          trend={Number(roi) > 0 ? { value: 'Profitable', positive: true } : null}
          loading={portfolioLoading}
        />
      </div>

      {/* ── QUICK ACTIONS ────────────────────────────────────────────────── */}
      <div className="dash-section grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Deposit', icon: <ArrowDownRight className="w-5 h-5" />, href: '/dashboard/investments', color: 'text-emerald-400', bg: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20' },
          { label: 'Withdraw', icon: <ArrowUpRight className="w-5 h-5" />, href: '/dashboard/transactions', color: 'text-rose-400', bg: 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20' },
          { label: 'Signals', icon: <Zap className="w-5 h-5" />, href: '/signals', color: 'text-[#FF6B00]', bg: 'bg-[#FF6B00]/10 hover:bg-[#FF6B00]/20 border-[#FF6B00]/20' },
          { label: 'Portfolio', icon: <Wallet className="w-5 h-5" />, href: '/dashboard/investments', color: 'text-indigo-400', bg: 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20' },
        ].map(action => (
          <Link
            key={action.label}
            href={action.href}
            className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border transition-all duration-200 group ${action.bg}`}
          >
            <span className={`${action.color} group-hover:scale-110 transition-transform duration-200`}>{action.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-white/80 transition-colors">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* ── VIP STATUS + CHARTS ──────────────────────────────────────────── */}
      <div className="dash-section grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Portfolio Area Chart — 2/3 */}
        <div className="lg:col-span-2 bg-[#0C0C10] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-black text-white tracking-tight">Portfolio Growth</h2>
              <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mt-0.5">Performance analytics</p>
            </div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black">
              <TrendingUp className="w-3 h-3" /> +140.2%
            </span>
          </div>
          <div className="h-56 sm:h-72">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioChartData} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pgGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B00" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#FF6B00" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)', fontWeight: 700 }} dy={12} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)', fontWeight: 700 }} tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} />
                  <Tooltip content={<DarkTooltip />} cursor={{ stroke: 'rgba(255,107,0,0.15)', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="value" stroke="#FF6B00" strokeWidth={2.5} fill="url(#pgGrad)" dot={false} activeDot={{ r: 5, fill: '#FF6B00', stroke: '#0C0C10', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Weekly P&L + VIP — 1/3 */}
        <div className="flex flex-col gap-5">
          {/* Weekly P&L Bar */}
          <div className="bg-[#0C0C10] border border-white/[0.06] rounded-2xl p-6 flex-1">
            <div className="mb-5">
              <h2 className="text-base font-black text-white tracking-tight">Weekly P&L</h2>
              <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mt-0.5">Day by day</p>
            </div>
            <div className="h-44">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyPnL} barSize={18} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)', fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)', fontWeight: 700 }} tickFormatter={v => `$${v}`} />
                    <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                    <Bar dataKey="pnl" radius={[4, 4, 4, 4]}>
                      {weeklyPnL.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#10B981' : '#F43F5E'} fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* VIP Status */}
          <div className="bg-gradient-to-br from-[#FF6B00]/10 via-[#0C0C10] to-[#0C0C10] border border-[#FF6B00]/20 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center flex-shrink-0">
              <Crown className="w-5 h-5 text-[#FF6B00]" />
            </div>
            <div>
              <p className="text-sm font-black text-white">VIP Signal Access</p>
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mt-0.5">Lifetime Access Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── SIGNALS TABLE + ACTIVITY ─────────────────────────────────────── */}
      <div className="dash-section grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Signals — 2/3 */}
        <div className="lg:col-span-2 bg-[#0C0C10] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-base font-black text-white">Recent Signals</h2>
              <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mt-0.5">Live trading intelligence</p>
            </div>
            <Link href="/signals" className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF6B00] hover:text-[#FF8C33] transition-colors">
              All Signals <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="px-6 py-3 text-left text-[10px] font-black text-white/20 uppercase tracking-[0.18em]">Pair</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black text-white/20 uppercase tracking-[0.18em]">Direction</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black text-white/20 uppercase tracking-[0.18em] hidden sm:table-cell">Entry / TP</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black text-white/20 uppercase tracking-[0.18em] hidden md:table-cell">Timeframe</th>
                  <th className="px-6 py-3 text-right text-[10px] font-black text-white/20 uppercase tracking-[0.18em]">Status</th>
                </tr>
              </thead>
              <tbody>
                {signalsLoading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="border-b border-white/[0.03]">
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-white/[0.04] rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : signals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-xs text-white/30 font-semibold">
                      No signals found
                    </td>
                  </tr>
                ) : (
                  signals.map(signal => {
                    const tpArr = (signal as any).takeProfits ?? [];
                    const tp = tpArr[0] ?? (signal as any).takeProfit ?? null;
                    return (
                      <tr
                        key={signal.id}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-3.5">
                          <div>
                            <span className="font-black text-white text-sm tracking-tight">{signal.pair}</span>
                            <span className="block text-[10px] text-white/25 font-medium mt-0.5">{timeAgo(signal.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <DirectionChip type={signal.type} />
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <span className="font-mono text-xs font-bold text-white/70">
                            {signal.entryPrice}
                          </span>
                          {tp && (
                            <span className="font-mono text-[10px] text-emerald-400 block mt-0.5">
                              TP: {tp}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <span className="text-xs font-semibold text-white/40">
                            {(signal as any).timeframe ?? '—'}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <StatusChip status={signal.status} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed — 1/3 */}
        <div className="bg-[#0C0C10] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-base font-black text-white">Activity</h2>
              <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mt-0.5">Recent log</p>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.04]">
              <Clock className="w-3.5 h-3.5 text-white/30" />
            </div>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {txLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="px-5 py-4 flex items-start gap-3 animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/[0.04] rounded w-3/4" />
                    <div className="h-2.5 bg-white/[0.04] rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : transactions.length === 0 ? (
              <div className="px-5 py-10 text-center text-xs text-white/25 font-semibold">No recent activity</div>
            ) : (
              transactions.map(tx => {
                const isCredit = ['profit', 'deposit', 'return'].includes(tx.type?.toLowerCase());
                return (
                  <div key={tx.id} className="flex items-start gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isCredit ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                    }`}>
                      {isCredit
                        ? <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                        : <ArrowUpRight className="w-4 h-4 text-rose-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white capitalize truncate">{tx.type}</p>
                      <p className="text-[10px] text-white/30 font-medium mt-0.5 truncate">{tx.description || '—'}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] font-semibold text-white/20">{timeAgo(tx.createdAt)}</span>
                        <span className={`text-xs font-black tabular-nums ${isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isCredit ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {!txLoading && transactions.length > 0 && (
            <div className="px-5 py-3 border-t border-white/[0.04]">
              <Link href="/dashboard/transactions" className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#FF6B00] hover:text-[#FF8C33] transition-colors">
                View all transactions <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── FOREX RATES GRID ─────────────────────────────────────────────── */}
      <div className="dash-section">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-black text-white">Live Forex Rates</h2>
            <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mt-0.5">Real-time feed · updates every 15s</p>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
            <RefreshCw className="w-3 h-3 animate-spin" /> Live
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {TICKER_PAIRS.map(pairKey => {
            const rate = forexData[pairKey];
            if (!rate) return null;
            return (
              <div key={pairKey} className="bg-[#0C0C10] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] transition-all duration-200 group">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">{rate.pair}</p>
                <p className="text-lg font-extrabold text-white tabular-nums tracking-tight">{rate.rate}</p>
                <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold mt-1.5 ${
                  rate.isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {rate.isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {rate.change}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── LATEST ARTICLES ──────────────────────────────────────────────── */}
      <div className="dash-section">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-black text-white">Latest Insights</h2>
            <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest mt-0.5">Market analysis & education</p>
          </div>
          <Link href="/blog" className="flex items-center gap-1 text-[11px] font-bold text-[#FF6B00] hover:text-[#FF8C33] transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {articlesLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#0C0C10] border border-white/[0.06] rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-white/[0.04] rounded mb-3 w-1/3" />
                <div className="h-3 bg-white/[0.04] rounded mb-2 w-full" />
                <div className="h-3 bg-white/[0.04] rounded w-2/3" />
              </div>
            ))
          ) : articles.length === 0 ? (
            <div className="col-span-3 py-10 text-center">
              <BookOpen className="w-8 h-8 mx-auto text-white/10 mb-2" />
              <p className="text-xs text-white/20 font-semibold">No articles published yet</p>
            </div>
          ) : (
            articles.map(article => {
              const Icon = CATEGORY_ICONS[article.category] ?? Newspaper;
              const readTime = Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200));
              return (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="bg-[#0C0C10] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-200 group block"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-[#FF6B00]/10 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-[#FF6B00]" />
                    </div>
                    <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest">{article.category}</span>
                  </div>
                  <p className="text-sm font-bold text-white/80 group-hover:text-white transition-colors leading-snug line-clamp-2 mb-3">
                    {article.title}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-white/25 font-semibold">
                    <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {readTime}m read</span>
                    <span className="flex items-center gap-1"><Eye className="w-2.5 h-2.5" /> {article.viewCount.toLocaleString()}</span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}

// tiny inline ROI helper (avoids importing investmentApi just for one calc)
function investmentApi_calculateROI(totalInvested: number, totalReturns: number): string {
  if (totalInvested === 0) return '0.00';
  return ((totalReturns / totalInvested) * 100).toFixed(2);
}
