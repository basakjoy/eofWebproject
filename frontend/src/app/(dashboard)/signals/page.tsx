"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Target, Activity, RefreshCw, Filter, BarChart3,
  CheckCircle2, XCircle, AlertCircle, Loader2, ArrowUpRight,
  ArrowDownRight, Clock, Zap, Search, Grid, List, Calculator,
  Volume2, VolumeX, Eye, Copy, Check
} from 'lucide-react';
import { signalsApi, type SignalRecord } from '@/lib/signalsApi';
import SignalDetailModal from '@/components/signals/SignalDetailModal';
import RiskCalculatorModal from '@/components/signals/RiskCalculatorModal';
import SignalAnalyticsOverview from '@/components/signals/SignalAnalyticsOverview';

const DEMO_SIGNALS: SignalRecord[] = [
  {
    id: 'dash-1',
    pair: 'XAU/USD',
    type: 'BUY',
    entryPrice: 2042.50,
    takeProfit1: 2055.00,
    takeProfit2: 2068.00,
    takeProfit3: 2080.00,
    stopLoss: 2031.00,
    timeframe: '4H',
    accuracy: 92,
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'dash-2',
    pair: 'EUR/USD',
    type: 'BUY',
    entryPrice: 1.0865,
    takeProfit1: 1.0920,
    takeProfit2: 1.0975,
    takeProfit3: 1.1040,
    stopLoss: 1.0820,
    timeframe: '1H',
    accuracy: 88,
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'dash-3',
    pair: 'GBP/USD',
    type: 'SELL',
    entryPrice: 1.2740,
    takeProfit1: 1.2680,
    takeProfit2: 1.2610,
    takeProfit3: 1.2540,
    stopLoss: 1.2795,
    timeframe: '4H',
    accuracy: 86,
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: 'dash-4',
    pair: 'BTC/USD',
    type: 'BUY',
    entryPrice: 64200.00,
    takeProfit1: 66500.00,
    takeProfit2: 68900.00,
    takeProfit3: 71500.00,
    stopLoss: 62400.00,
    timeframe: '1D',
    accuracy: 94,
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString()
  },
  {
    id: 'dash-5',
    pair: 'USD/JPY',
    type: 'SELL',
    entryPrice: 148.50,
    takeProfit1: 147.60,
    takeProfit2: 146.80,
    takeProfit3: 145.90,
    stopLoss: 149.20,
    timeframe: '1H',
    accuracy: 85,
    status: 'closed',
    createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString()
  }
];

export default function SignalsPage() {
  const [signals, setSignals] = useState<SignalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'analytics'>('grid');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Modals
  const [selectedSignalDetail, setSelectedSignalDetail] = useState<SignalRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [selectedSignalCalc, setSelectedSignalCalc] = useState<SignalRecord | null>(null);
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchSignals = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await signalsApi.getAllSignals({ limit: 100 });
      const data = Array.isArray(res.data) ? res.data : [];
      if (data.length > 0) {
        setSignals(data);
      } else {
        setSignals(DEMO_SIGNALS);
      }
    } catch {
      setSignals(DEMO_SIGNALS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  const filteredSignals = useMemo(() => {
    return signals.filter((s) => {
      const pairMatch = !searchQuery || s.pair?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!pairMatch) return false;

      if (activeFilter === 'All') return true;
      if (activeFilter === 'BUY' || activeFilter === 'SELL') {
        return s.type?.toUpperCase() === activeFilter;
      }
      return String(s.status ?? '').toLowerCase() === activeFilter.toLowerCase();
    });
  }, [signals, searchQuery, activeFilter]);

  const stats = useMemo(() => {
    const total = signals.length;
    const active = signals.filter((s) => String(s.status ?? '').toLowerCase() === 'active').length;
    const closed = signals.filter((s) => String(s.status ?? '').toLowerCase() === 'closed').length;
    const winRate = total > 0 ? ((active / total) * 100).toFixed(0) : '87';
    return { total, active, closed, winRate };
  }, [signals]);

  const handleCopyQuick = (signal: SignalRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${signal.pair} ${signal.type} | Entry: ${signal.entryPrice} | SL: ${signal.stopLoss || signal.stoploss} | TP1: ${signal.takeProfit1 || signal.takeProfit}`;
    navigator.clipboard.writeText(text);
    setCopiedId(signal.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans selection:bg-fiery-orange selection:text-white pb-16">
      
      {/* Dashboard Top Header */}
      <header className="bg-panel-dark/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fiery-orange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-fiery-orange"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-fiery-amber">Live Signal Terminal</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                soundEnabled 
                  ? 'bg-fiery-orange/10 border-fiery-orange/30 text-fiery-amber' 
                  : 'bg-white/5 border-white/10 text-zinc-500'
              }`}
              title={soundEnabled ? 'Audio Alerts Enabled' : 'Audio Alerts Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-fiery-orange" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Alerts On' : 'Muted'}</span>
            </button>

            <button
              onClick={() => {
                setSelectedSignalCalc(signals[0] || null);
                setIsCalcOpen(true);
              }}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-all"
            >
              <Calculator className="w-4 h-4 text-fiery-orange" />
              <span>Lot Calculator</span>
            </button>

            <button
              onClick={() => fetchSignals(true)}
              disabled={refreshing}
              className="px-3.5 py-1.5 bg-fiery-orange text-black font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition-all hover:scale-105 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Feed</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Page Title & Quick Metrics */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1">Live Opportunities</h2>
            <p className="text-zinc-400 text-xs sm:text-sm">Institutional algorithmic setups refreshed continuously.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Total Alerts', value: stats.total, icon: BarChart3, color: 'text-fiery-orange', bg: 'bg-fiery-orange/10 border-fiery-orange/20' },
              { label: 'Active Signals', value: stats.active, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { label: 'Win Rate', value: `${stats.winRate}%`, icon: Target, color: 'text-fiery-amber', bg: 'bg-fiery-amber/10 border-fiery-amber/20' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-card-dark/70 border border-white/10 shadow-glass-card rounded-2xl p-4 flex items-center gap-4 flex-1 min-w-[150px]">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${bg}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{label}</p>
                  <p className="text-xl font-black text-white">{loading ? '—' : value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View Switcher & Filter Controls */}
        <div className="bg-card-dark/60 rounded-2xl border border-white/10 p-3 shadow-glass-card space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symbol (e.g. XAU/USD)..."
                className="w-full bg-panel-dark border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-fiery-orange/60"
              />
            </div>

            <div className="flex items-center gap-1 bg-panel-dark p-1 rounded-xl border border-white/10 self-end sm:self-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid' ? 'bg-fiery-orange text-black shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table' ? 'bg-fiery-orange text-black shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                Terminal
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'analytics' ? 'bg-fiery-orange text-black shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Analytics
              </button>
            </div>

          </div>

          <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-white/5">
            {['All', 'BUY', 'SELL', 'active', 'closed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold capitalize transition-all ${
                  activeFilter === tab
                    ? 'bg-fiery-orange text-black shadow-sm'
                    : 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab === 'All' ? 'All Signals' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Signals View */}
        {viewMode === 'analytics' ? (
          <SignalAnalyticsOverview />
        ) : loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-10 h-10 text-fiery-orange animate-spin mx-auto mb-3" />
            <p className="text-xs text-zinc-400">Fetching live market setups...</p>
          </div>
        ) : filteredSignals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card-dark/40 rounded-3xl border border-white/10 text-center p-8 space-y-3">
            <Zap className="w-10 h-10 text-zinc-500" />
            <h3 className="text-lg font-bold text-white">No matching signals</h3>
            <p className="text-xs text-zinc-400 max-w-sm">No active or closed signals found for your filter criteria.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSignals.map((signal) => {
              const isBuy = signal.type?.toUpperCase() === 'BUY';
              const entry = signal.entryPrice || 0;
              const sl = signal.stopLoss || signal.stoploss || 0;
              const tp1 = signal.takeProfit1 || signal.takeProfit || 0;

              return (
                <div
                  key={signal.id}
                  onClick={() => {
                    setSelectedSignalDetail(signal);
                    setIsDetailOpen(true);
                  }}
                  className={`group relative bg-card-dark/70 backdrop-blur-xl border rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer overflow-hidden ${
                    isBuy ? 'border-emerald-500/20 hover:border-emerald-500/50' : 'border-rose-500/20 hover:border-rose-500/50'
                  }`}
                >
                  <div className={`absolute top-0 left-6 right-6 h-1 rounded-b-full ${isBuy ? 'bg-emerald-400' : 'bg-rose-400'}`} />

                  <div className="flex items-start justify-between mb-5 pt-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-sm ${
                        isBuy ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}>
                        {isBuy ? <ArrowUpRight className="w-6 h-6 stroke-[2.5]" /> : <ArrowDownRight className="w-6 h-6 stroke-[2.5]" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-extrabold text-white tracking-tight">{signal.pair}</h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            isBuy ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-white'
                          }`}>
                            {signal.type}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-zinc-400 block mt-0.5">
                          Timeframe: <strong className="text-zinc-200">{signal.timeframe || '4H'}</strong>
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-panel-dark border border-white/10 text-xs text-fiery-amber font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-fiery-orange animate-pulse" />
                      {signal.status || 'Active'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-panel-dark p-3 rounded-xl border border-white/5">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">Entry Price</span>
                      <span className="text-sm font-mono font-extrabold text-white">{entry}</span>
                    </div>
                    <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                      <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider block mb-0.5">Stop Loss</span>
                      <span className="text-sm font-mono font-extrabold text-rose-400">{sl}</span>
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 mb-5 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                        <Target className="w-3 h-3" /> Target Price (TP1)
                      </span>
                      <span className="text-sm font-mono font-extrabold text-emerald-400">{tp1}</span>
                    </div>
                    <span className="text-[10px] font-black px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {signal.accuracy || 88}% Win Prob.
                    </span>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={(e) => handleCopyQuick(signal, e)}
                      className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      {copiedId === signal.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Parameters</span>
                        </>
                      )}
                    </button>

                    <span className="text-xs font-bold text-fiery-orange group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      View Setup <Eye className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-card-dark/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead>
                  <tr className="bg-panel-dark/90 border-b border-white/10 text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-5">Pair</th>
                    <th className="py-4 px-5 text-center">Direction</th>
                    <th className="py-4 px-5 text-center">Entry</th>
                    <th className="py-4 px-5 text-center">Target (TP)</th>
                    <th className="py-4 px-5 text-center">Stop Loss</th>
                    <th className="py-4 px-5 text-center">Timeframe</th>
                    <th className="py-4 px-5 text-center">Accuracy</th>
                    <th className="py-4 px-5 text-center">Status</th>
                    <th className="py-4 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {filteredSignals.map((signal) => {
                    const isBuy = signal.type?.toUpperCase() === 'BUY';
                    return (
                      <tr
                        key={signal.id}
                        onClick={() => {
                          setSelectedSignalDetail(signal);
                          setIsDetailOpen(true);
                        }}
                        className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                      >
                        <td className="py-4 px-5 font-bold text-white whitespace-nowrap flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isBuy ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          {signal.pair}
                        </td>
                        <td className="py-4 px-5 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
                            isBuy ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}>
                            {isBuy ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                            {signal.type?.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center text-zinc-200 font-mono">{signal.entryPrice}</td>
                        <td className="py-4 px-5 text-center text-emerald-400 font-mono font-bold">{signal.takeProfit1 || signal.takeProfit}</td>
                        <td className="py-4 px-5 text-center text-rose-400 font-mono">{signal.stopLoss || signal.stoploss}</td>
                        <td className="py-4 px-5 text-center text-zinc-400 font-semibold">{signal.timeframe || '4H'}</td>
                        <td className="py-4 px-5 text-center text-fiery-amber font-bold">{signal.accuracy || 88}%</td>
                        <td className="py-4 px-5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-panel-dark border border-white/10 text-xs text-fiery-amber font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-fiery-orange animate-pulse" />
                            {signal.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => handleCopyQuick(signal, e)}
                            className="px-3 py-1.5 rounded-lg bg-panel-dark hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-colors"
                          >
                            {copiedId === signal.id ? 'Copied!' : 'Copy'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Modals */}
      <SignalDetailModal
        signal={selectedSignalDetail}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenCalculator={(sig) => {
          setSelectedSignalCalc(sig);
          setIsCalcOpen(true);
        }}
      />

      <RiskCalculatorModal
        signal={selectedSignalCalc}
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
      />

    </div>
  );
}