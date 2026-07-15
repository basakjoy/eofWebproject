"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Target, Activity, RefreshCw, Filter, BarChart3,
  CheckCircle2, XCircle, AlertCircle, Loader2, ArrowUpRight,
  ArrowDownLeft, Clock3, Zap
} from 'lucide-react';
import { signalsApi, type SignalRecord } from '@/lib/signalsApi';

// --- Utility Functions ---
const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

function fmt(n: number | string | null | undefined) {
  if (n == null || Number.isNaN(Number(n))) return '—';
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 5 });
}

function timeAgo(date: string | Date | null | undefined) {
  if (!date) return 'Just now';
  const diff = Date.now() - new Date(date).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 23) return `${Math.floor(h / 24)}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m === 0) return 'Just now';
  return `${m}m ago`;
}

// --- Constants & Config ---
const FILTER_TABS = ['All', 'BUY', 'SELL', 'active', 'closed', 'pending'];

const STATUS_CONFIG = {
  active:  { label: 'Active',  bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', icon: CheckCircle2 },
  closed:  { label: 'Closed',  bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400', icon: XCircle },
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', icon: AlertCircle },
};

const TIMEFRAME_COLORS = {
  '15M': 'bg-cyan-50 text-cyan-700 border-cyan-100',
  '1H': 'bg-blue-50 text-blue-700 border-blue-100',
  '4H': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  '1D': 'bg-purple-50 text-purple-700 border-purple-100',
};

// --- Components ---

function SignalCard({ signal }: { signal: SignalRecord }) {
  const isBuy = signal.type?.toUpperCase() === 'BUY';
  const normalizedStatus = String(signal.status ?? 'active').toLowerCase() as keyof typeof STATUS_CONFIG;
  const statusCfg = STATUS_CONFIG[normalizedStatus] ?? STATUS_CONFIG.active;
  const normalizedTimeframe = String(signal.timeframe ?? '4H') as keyof typeof TIMEFRAME_COLORS;
  const tfColor = TIMEFRAME_COLORS[normalizedTimeframe] ?? 'bg-slate-100 text-slate-600 border-slate-200';
  const accuracy = Number.isNaN(Number(signal.accuracy)) ? 85 : Number(signal.accuracy ?? 85);
  const tps = (signal.takeProfits?.filter((tp): tp is number => tp != null) ?? [signal.takeProfit].filter((tp): tp is number => tp != null));

  return (
    <div className={cn(
      "group relative bg-white rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 border",
      isBuy ? "border-emerald-100/50 hover:border-emerald-200" : "border-rose-100/50 hover:border-rose-200"
    )}>
      {/* Decorative top accent line */}
      <div className={cn(
        "absolute top-0 left-6 right-6 h-[3px] rounded-b-full opacity-50",
        isBuy ? "bg-emerald-400" : "bg-rose-400"
      )} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 pt-1">
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm border",
            statusCfg.label === 'Closed' ? "bg-slate-50 border-slate-200 text-slate-400" :
            isBuy ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
          )}>
            {isBuy ? <ArrowUpRight className="h-6 w-6 stroke-[2.5]" /> : <ArrowDownLeft className="h-6 w-6 stroke-[2.5]" />}
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">{signal.pair}</h3>
              <span className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                statusCfg.label === 'Closed' ? "bg-slate-100 text-slate-500" :
                isBuy ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
              )}>
                {signal.type}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border", tfColor)}>
                {signal.timeframe}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                <Clock3 className="w-3 h-3" />
                {timeAgo(signal.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <span className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border",
          statusCfg.bg, statusCfg.text, statusCfg.border
        )}>
          <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)}></span>
          {statusCfg.label}
        </span>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Entry Target</p>
          <p className="text-sm font-semibold text-slate-900">{fmt(signal.entryPrice)}</p>
        </div>
        <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-100/50">
          <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-0.5">Stop Loss</p>
          <p className="text-sm font-semibold text-rose-700">{fmt(signal.stopLoss)}</p>
        </div>
      </div>

      {/* Take Profits */}
      <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/50 mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
            <Target className="w-3 h-3" /> Take Profit Targets
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tps.length > 0 ? tps.map((tp, i) => (
            <div key={i} className="flex-1 min-w-[80px] bg-white border border-emerald-100/80 rounded-lg px-2.5 py-1.5 flex items-center justify-between shadow-sm">
              <span className="text-[10px] font-bold text-emerald-600/60">T{i + 1}</span>
              <span className="text-xs font-bold text-emerald-700">{fmt(tp)}</span>
            </div>
          )) : (
            <span className="text-sm font-medium text-slate-400">—</span>
          )}
        </div>
      </div>

      {/* Confidence Footer */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-slate-500">Setup Confidence</span>
          <span className="text-[11px] font-bold text-slate-900">{accuracy}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              isBuy ? "bg-emerald-500" : "bg-rose-500"
            )}
            style={{ width: `${Math.min(accuracy, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 animate-pulse shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
          <div className="space-y-2 py-1">
            <div className="h-4 bg-slate-100 rounded w-24" />
            <div className="h-3 bg-slate-100 rounded w-32" />
          </div>
        </div>
        <div className="w-16 h-6 bg-slate-100 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="h-14 bg-slate-50 rounded-xl border border-slate-100" />
        <div className="h-14 bg-slate-50 rounded-xl border border-slate-100" />
      </div>
      <div className="h-20 bg-slate-50 rounded-xl border border-slate-100 mb-5" />
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <div className="flex justify-between">
          <div className="w-20 h-3 bg-slate-100 rounded" />
          <div className="w-8 h-3 bg-slate-100 rounded" />
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full" />
      </div>
    </div>
  );
}

export default function SignalsPage() {
  const [signals, setSignals] = useState<SignalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [stats, setStats] = useState({ total: 0, active: 0, closed: 0, buy: 0, sell: 0 });

  const fetchSignals = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params: Record<string, unknown> = { limit: 100 };
      if (activeFilter === 'BUY' || activeFilter === 'SELL') params.type = activeFilter;
      else if (activeFilter !== 'All') params.status = activeFilter;

      const res = await signalsApi.getAllSignals(params);
      const data = Array.isArray(res.data) ? res.data : [];
      setSignals(data);

      if (activeFilter === 'All') {
        setStats({
          total: res.total ?? data.length,
          active: data.filter((s) => String(s.status ?? '').toLowerCase() === 'active').length,
          closed: data.filter((s) => String(s.status ?? '').toLowerCase() === 'closed').length,
          buy: data.filter((s) => String(s.type ?? '').toUpperCase() === 'BUY').length,
          sell: data.filter((s) => String(s.type ?? '').toUpperCase() === 'SELL').length,
        });
      }
    } catch {
      setSignals([]);
      setStats({ total: 0, active: 0, closed: 0, buy: 0, sell: 0 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeFilter]);

  useEffect(() => { fetchSignals(); }, [fetchSignals]);

  const winRate = stats.total > 0
    ? ((stats.active / stats.total) * 100).toFixed(0)
    : '0';

  return (
    <div className="min-h-screen bg-slate-50/80 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm shadow-slate-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <button
            onClick={() => fetchSignals(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-bold text-slate-600 transition-all disabled:opacity-50 active:scale-95"
          >
            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin text-indigo-600")} />
            <span className="hidden sm:inline">Sync Feed</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Page Title & Stats */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Live Opportunities</h2>
            <p className="text-slate-500 text-sm">Real-time professional trade setups from your subscribed analysts.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Total Alerts', value: stats.total, icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
              { label: 'Active',  value: stats.active,  icon: Activity,    color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
              { label: 'Avg Win Rate', value: `${winRate}%`, icon: Target,     color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-4 flex items-center gap-4 flex-1 min-w-[160px]">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border", bg)}>
                  <Icon className={cn("w-5 h-5", color)} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                  <p className="text-xl font-bold text-slate-900">{loading && !signals.length ? '—' : value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-2 shadow-sm shadow-slate-200/50 flex flex-wrap items-center gap-2 sticky top-20 z-20">
          <div className="pl-3 pr-2 border-r border-slate-200 flex items-center">
            <Filter className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex flex-wrap gap-1 p-1">
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all",
                  activeFilter === tab
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                    : "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                {tab === 'All' ? 'All Pairs' : tab}
              </button>
            ))}
          </div>
          {!loading && (
            <span className="ml-auto pr-4 text-xs font-medium text-slate-400">
              Showing {signals.length} result{signals.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Signals Grid */}
        {loading && !refreshing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : signals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white rounded-3xl border border-slate-200/60 border-dashed">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-5">
              <Zap className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No signals currently found</h3>
            <p className="text-slate-500 text-sm max-w-sm mb-6">
              {activeFilter === 'All'
                ? "Your feed is quiet right now. Check back later when new market opportunities are published."
                : `We couldn't find any ${activeFilter.toLowerCase()} signals matching your criteria.`}
            </p>
            {activeFilter !== 'All' && (
              <button
                onClick={() => setActiveFilter('All')}
                className="px-5 py-2.5 bg-indigo-50 text-indigo-600 font-semibold rounded-xl text-sm hover:bg-indigo-100 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {signals.map(signal => (
              <SignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}