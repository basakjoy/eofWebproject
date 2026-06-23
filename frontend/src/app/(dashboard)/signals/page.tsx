'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Signal, TrendingUp, TrendingDown, Target, ShieldAlert,
  Clock, Zap, RefreshCw, Filter, BarChart3, CheckCircle2,
  XCircle, AlertCircle, Loader2, ArrowUpRight, ArrowDownLeft,
  Activity, ChevronDown
} from 'lucide-react';
import { signalsApi } from '@/lib/signalsApi';

/* ─── Types ───────────────────────────────────────────────────── */
interface TradingSignal {
  id: string;
  pair: string;
  type: string;
  direction?: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number | null;
  takeProfits: number[];
  accuracy: number;
  reliability: number;
  timeframe: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/* ─── Constants ─────────────────────────────────────────────────── */
const FILTER_TABS = ['All', 'BUY', 'SELL', 'active', 'closed', 'pending'] as const;
type FilterTab = typeof FILTER_TABS[number];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  active:  { label: 'Active',  color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 },
  closed:  { label: 'Closed',  color: 'bg-slate-500/20 text-slate-400 border-slate-500/30',   icon: XCircle },
  pending: { label: 'Pending', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',   icon: AlertCircle },
};

const TIMEFRAME_COLORS: Record<string, string> = {
  '1H': 'bg-blue-500/10 text-blue-400',
  '4H': 'bg-indigo-500/10 text-indigo-400',
  'Daily': 'bg-purple-500/10 text-purple-400',
  '1D': 'bg-purple-500/10 text-purple-400',
  '1W': 'bg-pink-500/10 text-pink-400',
  '15M': 'bg-cyan-500/10 text-cyan-400',
};

/* ─── Helpers ───────────────────────────────────────────────────── */
function fmt(n: number | null | undefined) {
  if (n == null || isNaN(n)) return '—';
  return n.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 5 });
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 23) return `${Math.floor(h / 24)}d ago`;
  if (h > 0) return `${h}h ago`;
  return `${m}m ago`;
}

/* ─── Signal Card ───────────────────────────────────────────────── */
function SignalCard({ signal }: { signal: TradingSignal }) {
  const isBuy = signal.type?.toUpperCase() === 'BUY';
  const statusCfg = STATUS_CONFIG[signal.status] ?? STATUS_CONFIG.active;
  const StatusIcon = statusCfg.icon;
  const tfColor = TIMEFRAME_COLORS[signal.timeframe] ?? 'bg-slate-500/10 text-slate-400';
  const accuracy = isNaN(signal.accuracy) ? 85 : signal.accuracy;
  const tps = signal.takeProfits?.filter(Boolean) ?? [];

  return (
    <div className={`relative group bg-[#0d1929] border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 ${
      isBuy
        ? 'border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-emerald-900/20'
        : 'border-rose-500/20 hover:border-rose-500/40 hover:shadow-rose-900/20'
    }`}>
      {/* Top accent bar */}
      <div className={`h-0.5 w-full ${isBuy ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-rose-500 to-red-400'}`} />

      {/* Glow bg */}
      <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-5 pointer-events-none ${isBuy ? 'bg-emerald-500' : 'bg-rose-500'}`} />

      <div className="p-5 relative">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Type icon */}
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-lg ${
              isBuy ? 'bg-emerald-500/15 shadow-emerald-900/30' : 'bg-rose-500/15 shadow-rose-900/30'
            }`}>
              {isBuy
                ? <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                : <ArrowDownLeft className="w-5 h-5 text-rose-400" />
              }
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-black text-lg tracking-tight">{signal.pair}</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${
                  isBuy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {signal.type}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${tfColor}`}>
                  {signal.timeframe}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">{timeAgo(signal.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Status badge */}
          <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg border ${statusCfg.color}`}>
            <StatusIcon className="w-3 h-3" />
            {statusCfg.label}
          </span>
        </div>

        {/* Price grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/[0.04] rounded-xl p-3">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Entry</p>
            <p className="text-sm font-black text-white">{fmt(signal.entryPrice)}</p>
          </div>
          <div className="bg-rose-500/8 rounded-xl p-3">
            <p className="text-[9px] font-bold text-rose-400/70 uppercase tracking-widest mb-1">Stop Loss</p>
            <p className="text-sm font-black text-rose-400">{fmt(signal.stopLoss)}</p>
          </div>
          <div className="bg-emerald-500/8 rounded-xl p-3">
            <p className="text-[9px] font-bold text-emerald-400/70 uppercase tracking-widest mb-1">TP 1</p>
            <p className="text-sm font-black text-emerald-400">{fmt(tps[0] ?? signal.takeProfit)}</p>
          </div>
        </div>

        {/* Extra TPs */}
        {tps.length > 1 && (
          <div className={`flex gap-2 mb-4 ${tps.length < 2 ? 'hidden' : ''}`}>
            {tps.slice(1).map((tp, i) => (
              <div key={i} className="flex-1 bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-3 py-2 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-400/60">TP {i + 2}</span>
                <span className="text-xs font-bold text-emerald-400">{fmt(tp)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Accuracy bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Accuracy</span>
            <span className={`text-xs font-black ${isBuy ? 'text-emerald-400' : 'text-rose-400'}`}>{accuracy.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-1000 ${isBuy ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-rose-600 to-rose-400'}`}
              style={{ width: `${Math.min(accuracy, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Skeleton Card ─────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-[#0d1929] border border-white/5 rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 bg-white/5 rounded-xl" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-white/5 rounded w-24" />
          <div className="h-3 bg-white/5 rounded w-16" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[0,1,2].map(i => <div key={i} className="h-14 bg-white/5 rounded-xl" />)}
      </div>
      <div className="h-3 bg-white/5 rounded w-full" />
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function SignalsPage() {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [stats, setStats] = useState({ total: 0, active: 0, closed: 0, buy: 0, sell: 0 });

  const fetchSignals = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params: Record<string, any> = { limit: 100 };
      if (activeFilter === 'BUY' || activeFilter === 'SELL') params.type = activeFilter;
      else if (activeFilter !== 'All') params.status = activeFilter;

      const res = await signalsApi.getAllSignals(params);
      const data: TradingSignal[] = Array.isArray(res.data) ? res.data : [];
      setSignals(data);

      // compute stats from full list if on "All" tab
      if (activeFilter === 'All') {
        setStats({
          total: res.total ?? data.length,
          active: data.filter(s => s.status === 'active').length,
          closed: data.filter(s => s.status === 'closed').length,
          buy:    data.filter(s => s.type?.toUpperCase() === 'BUY').length,
          sell:   data.filter(s => s.type?.toUpperCase() === 'SELL').length,
        });
      }
    } catch {
      setSignals([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeFilter]);

  useEffect(() => { fetchSignals(); }, [fetchSignals]);

  const winRate = stats.total > 0
    ? ((stats.active / stats.total) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="p-6 lg:p-8 space-y-6 min-h-full bg-[#020617]">

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Trading Signals</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium">Live professional forex signals, updated in real-time</p>
        </div>
        <button
          onClick={() => fetchSignals(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-slate-300 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Stats Row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Signals', value: stats.total, icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Active',  value: stats.active,  icon: Activity,    color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Closed',  value: stats.closed,  icon: XCircle,     color: 'text-slate-400',   bg: 'bg-slate-500/10' },
          { label: 'Win Rate', value: `${winRate}%`, icon: Target,     color: 'text-amber-400',  bg: 'bg-amber-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[#0d1929] border border-white/[0.07] rounded-2xl p-4 flex items-center gap-4">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
              <p className={`text-xl font-black ${color}`}>{loading ? '—' : value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Tabs ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="w-4 h-4 text-slate-500 shrink-0" />
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              activeFilter === tab
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                : 'bg-white/[0.04] border border-white/[0.07] text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {tab === 'All' ? 'All Signals' : tab}
          </button>
        ))}
        {!loading && (
          <span className="ml-auto text-xs text-slate-500 font-medium">
            {signals.length} signal{signals.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Signals Grid ─────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : signals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
            <Signal className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-300 mb-2">No signals found</h3>
          <p className="text-slate-500 text-sm max-w-xs">
            {activeFilter === 'All'
              ? 'No trading signals have been published yet.'
              : `No ${activeFilter} signals match your filter.`}
          </p>
          <button
            onClick={() => setActiveFilter('All')}
            className="mt-4 px-4 py-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Clear filter →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {signals.map(signal => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      )}
    </div>
  );
}
