'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Loader2,
  Zap,
  BarChart3,
  ShieldCheck,
  Search,
  Grid,
  List,
  Calculator,
  Copy,
  Check,
  Target,
  RefreshCw,
  Eye,
  ArrowRight,
  TrendingUp,
  Activity,
  Clock,
  ChevronRight,
  Lock,
  Star,
  Bell,
  LineChart,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signalsApi, SignalRecord } from '@/lib/signalsApi';
import SignalDetailModal from '@/components/signals/SignalDetailModal';
import RiskCalculatorModal from '@/components/signals/RiskCalculatorModal';
import SignalAnalyticsOverview from '@/components/signals/SignalAnalyticsOverview';

const TRADING_SIGNALS_BACKGROUND_SRC = 'https://res.cloudinary.com/xxx8fpey/image/upload/v1787816931/brown-abstract-5120x2880-26733.jpg';

/* ── Currency Flag System ── */
const CURRENCY_FLAG: Record<string, string> = {
  EUR: 'eu', USD: 'us', GBP: 'gb', JPY: 'jp',
  AUD: 'au', CAD: 'ca', CHF: 'ch', NZD: 'nz',
  SGD: 'sg', HKD: 'hk', NOK: 'no', SEK: 'se',
};

const CRYPTO_META: Record<string, { bg: string; label: string }> = {
  BTC: { bg: 'from-orange-500 to-amber-400', label: '₿' },
  ETH: { bg: 'from-violet-500 to-indigo-400', label: 'Ξ' },
  XRP: { bg: 'from-blue-500 to-cyan-400', label: 'X' },
};

const METAL_META: Record<string, { bg: string; label: string }> = {
  XAU: { bg: 'from-yellow-400 to-amber-500', label: 'Au' },
  XAG: { bg: 'from-zinc-300 to-zinc-400', label: 'Ag' },
};

function parsePair(pair: string): [string, string] {
  const [base = '', quote = ''] = (pair || '').split('/');
  return [base.toUpperCase(), quote.toUpperCase()];
}

function PairIcon({ pair, size = 36 }: { pair: string; size?: number }) {
  const [base, quote] = parsePair(pair);
  const crypto = CRYPTO_META[base];
  const metal = METAL_META[base];
  const baseFlag = CURRENCY_FLAG[base];
  const quoteFlag = CURRENCY_FLAG[quote];

  if (crypto) {
    return (
      <div
        className={`rounded-full bg-gradient-to-br ${crypto.bg} flex items-center justify-center text-white font-black text-sm shadow-lg flex-shrink-0`}
        style={{ width: size, height: size }}
      >
        {crypto.label}
      </div>
    );
  }
  if (metal) {
    return (
      <div
        className={`rounded-full bg-gradient-to-br ${metal.bg} flex items-center justify-center text-black font-black text-xs shadow-lg flex-shrink-0`}
        style={{ width: size, height: size }}
      >
        {metal.label}
      </div>
    );
  }
  if (baseFlag && quoteFlag) {
    return (
      <div className="relative flex-shrink-0" style={{ width: size + 8, height: size }}>
        <img
          src={`https://flagcdn.com/w40/${baseFlag}.png`}
          className="absolute left-0 top-0 rounded-full border-2 border-[#111116] object-cover shadow"
          style={{ width: size, height: size }}
          alt={base}
        />
        <img
          src={`https://flagcdn.com/w40/${quoteFlag}.png`}
          className="absolute rounded-full border-2 border-[#111116] object-cover shadow"
          style={{ width: size, height: size, left: size * 0.4 }}
          alt={quote}
        />
      </div>
    );
  }
  return (
    <div
      className="rounded-full bg-gradient-to-br from-fiery-orange to-fiery-amber flex items-center justify-center text-black font-black text-xs shadow-lg flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {base.slice(0, 2)}
    </div>
  );
}

/* ── Signal Card ── */
function SignalCard({
  signal,
  onDetail,
  onCalc,
}: {
  signal: SignalRecord;
  onDetail: () => void;
  onCalc: () => void;
}) {
  const isBuy = signal.type?.toUpperCase() === 'BUY';
  const [copied, setCopied] = useState(false);

  const copyEntry = () => {
    navigator.clipboard.writeText(String(signal.entryPrice || ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative bg-[#0C0C10]/80 backdrop-blur-xl border rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer overflow-hidden glass-card ${
        isBuy
          ? 'border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-emerald-500/10'
          : 'border-rose-500/20 hover:border-rose-500/40 hover:shadow-rose-500/10'
      }`}
    >
      {/* Top accent bar */}
      <div className={`absolute top-0 left-6 right-6 h-[2px] rounded-b-full ${isBuy ? 'bg-emerald-400' : 'bg-rose-400'}`} />

      {/* Background glow */}
      <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-10 ${isBuy ? 'bg-emerald-400' : 'bg-rose-400'}`} />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 pt-1">
        <div className="flex items-center gap-3">
          <PairIcon pair={signal.pair} size={38} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-white">{signal.pair}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                isBuy ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-white'
              }`}>
                {signal.type}
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-medium">
              {signal.timeframe || '4H'} · {signal.category || 'Forex'}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-bold text-zinc-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
            {signal.status || 'ACTIVE'}
          </span>
          <span className="text-[9px] text-zinc-600 font-medium flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {signal.createdAt ? new Date(signal.createdAt).toLocaleDateString() : 'Today'}
          </span>
        </div>
      </div>

      {/* Price Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div
          className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 cursor-pointer hover:bg-white/[0.06] transition-colors group/copy"
          onClick={copyEntry}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Entry</span>
            {copied ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3 text-zinc-600 opacity-0 group-hover/copy:opacity-100 transition-opacity" />
            )}
          </div>
          <span className="text-sm font-mono font-bold text-white">{signal.entryPrice}</span>
        </div>
        <div className="bg-rose-500/[0.05] border border-rose-500/20 rounded-xl p-3">
          <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider block mb-1">Stop Loss</span>
          <span className="text-sm font-mono font-bold text-rose-400">{signal.stopLoss}</span>
        </div>
        <div className="bg-emerald-500/[0.05] border border-emerald-500/20 rounded-xl p-3">
          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">TP 1</span>
          <span className="text-sm font-mono font-bold text-emerald-400">{signal.takeProfit1 || signal.takeProfit}</span>
        </div>
        {signal.takeProfit2 && (
          <div className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-xl p-3">
            <span className="text-[9px] font-bold text-emerald-400/60 uppercase tracking-wider block mb-1">TP 2</span>
            <span className="text-sm font-mono font-bold text-emerald-300">{signal.takeProfit2}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-zinc-400 font-medium">
            <Target className="w-3.5 h-3.5 text-fiery-orange" />
            {signal.accuracy || 88}% acc
          </span>
          <span className="text-zinc-700">·</span>
          <span className="text-xs text-zinc-400 font-medium">
            R:R {signal.riskReward || '1:2'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onCalc(); }}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
            title="Risk Calculator"
          >
            <Calculator className="w-3.5 h-3.5 text-fiery-amber" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDetail(); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-sm bg-fiery-orange/10 hover:bg-fiery-orange/20 border border-fiery-orange/20 text-fiery-orange text-xs font-bold transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── STAT METRIC CARDS DATA ── */
const METRICS = [
  { label: 'Win Rate', value: '87%', icon: Target, color: 'text-fiery-orange', bg: 'bg-fiery-orange/10', border: 'border-fiery-orange/20' },
  { label: 'Total Signals', value: '2,400+', icon: Activity, color: 'text-zinc-100', bg: 'bg-white/5', border: 'border-white/10' },
  { label: 'Avg R:R Ratio', value: '1:2.8', icon: BarChart3, color: 'text-fiery-amber', bg: 'bg-fiery-amber/10', border: 'border-fiery-amber/20' },
  { label: 'Assets Covered', value: '30+', icon: TrendingUp, color: 'text-zinc-100', bg: 'bg-white/5', border: 'border-white/10' },
];

const FEATURES = [
  { icon: Zap, title: 'Real-Time Alerts', desc: 'Signals delivered instantly via our portal, Telegram, and email. Never miss a setup.' },
  { icon: ShieldCheck, title: 'Risk Management', desc: 'Every signal comes with defined entry, stop-loss, and multiple take-profit levels.' },
  { icon: LineChart, title: 'Technical Analysis', desc: 'Powered by institutional-grade charting, AI confluence, and multi-timeframe analysis.' },
  { icon: Bell, title: 'Smart Notifications', desc: 'Customizable alerts by pair, timeframe, or signal type. Full control in your hands.' },
];

/* ── MAIN PAGE ── */
export default function TradingSignalsPage() {
  const [signals, setSignals] = useState<SignalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const [selectedDetail, setSelectedDetail] = useState<SignalRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCalc, setSelectedCalc] = useState<SignalRecord | null>(null);
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await signalsApi.getAllSignals({ limit: 12 });
        setSignals(Array.isArray(res.data) ? res.data : []);
      } catch {
        setSignals([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return signals.filter((s) => {
      const matchType = filter === 'ALL' || s.type?.toUpperCase() === filter;
      const matchSearch = !search || s.pair?.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [signals, filter, search]);

  return (
    <div
      className="w-full min-h-screen text-white font-poppins overflow-x-hidden"
      style={{
        background:
          'radial-gradient(circle at 50% 0%, rgba(255, 107, 0, 0.08), transparent 32%), #030305',
      }}
    >

      {/* ── Page Background ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 scale-105 bg-cover bg-center bg-no-repeat blur-[2px]"
        style={{ backgroundImage: `url(${TRADING_SIGNALS_BACKGROUND_SRC})` }}
      />
      <div aria-hidden="true" className="fixed inset-0 z-0 bg-[#030305]/75" />

      {/* ── Ambient Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 right-[-10%] w-[700px] h-[700px] bg-fiery-orange/10 rounded-full blur-[140px] animate-liquid-blob-1" />
        <div className="absolute top-1/3 left-[-10%] w-[500px] h-[500px] bg-fiery-amber/5 rounded-full blur-[130px] animate-liquid-blob-2" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-fiery-orange/5 rounded-full blur-[150px] animate-liquid-blob-3" />
        <div className="absolute bottom-0 right-[10%] w-[450px] h-[450px] bg-fiery-amber/5 rounded-full blur-[140px] animate-liquid-blob-1" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[900px] h-[2px] bg-gradient-to-r from-transparent via-fiery-orange/15 to-transparent" />
      </div>

      <style jsx global>{`
        @keyframes liquidBlob1 {
          0%, 100% { border-radius: 42% 58% 65% 35% / 45% 40% 60% 55%; transform: translate(0, 0) scale(1); }
          33% { border-radius: 60% 40% 35% 65% / 55% 65% 35% 45%; transform: translate(30px, -20px) scale(1.08); }
          66% { border-radius: 35% 65% 55% 45% / 40% 55% 45% 60%; transform: translate(-20px, 25px) scale(0.95); }
        }
        @keyframes liquidBlob2 {
          0%, 100% { border-radius: 55% 45% 40% 60% / 50% 60% 40% 50%; transform: translate(0, 0) scale(1); }
          50% { border-radius: 40% 60% 60% 40% / 60% 40% 60% 40%; transform: translate(-30px, 20px) scale(1.12); }
        }
        @keyframes liquidBlob3 {
          0%, 100% { border-radius: 50% 50% 35% 65% / 55% 45% 55% 45%; transform: translate(0, 0) scale(1); }
          40% { border-radius: 65% 35% 55% 45% / 40% 60% 40% 60%; transform: translate(25px, 30px) scale(0.92); }
          75% { border-radius: 45% 55% 45% 55% / 60% 45% 55% 40%; transform: translate(-15px, -25px) scale(1.06); }
        }
        .animate-liquid-blob-1 { animation: liquidBlob1 14s ease-in-out infinite; }
        .animate-liquid-blob-2 { animation: liquidBlob2 18s ease-in-out infinite; }
        .animate-liquid-blob-3 { animation: liquidBlob3 16s ease-in-out infinite; }
        .glass-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.035)) !important;
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          border-color: rgba(255, 255, 255, 0.1) !important;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 18px 45px rgba(0, 0, 0, 0.16);
        }
        .liquid-panel {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.085), rgba(255, 255, 255, 0.025));
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 18px 45px rgba(0, 0, 0, 0.16);
        }
      `}</style>

      <div className="relative z-10">

        {/* ══ HERO ══ */}
        <section className="min-h-[100vh] flex flex-col justify-center pt-24 pb-16 px-4 sm:px-8 lg:px-14">
          <div className="max-w-[1600px] mx-auto">
            <div className="text-center max-w-5xl mx-auto rounded-lg border border-white/10 py-14 px-6 shadow-2xl liquid-panel">
              

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xs font-bold text-fiery-orange uppercase tracking-[0.2em] mb-5 font-mono"
              >
                Institutional-Grade Signal Desk
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]"
              >
                Institutional{' '}
                <span className="text-fiery-orange pb-2 inline-block">
                  Trading Signals
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 1 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-10 font-normal pt-4"
              >
                High-probability Forex, Crypto & Commodity setups — complete with entry,
                stop-loss, and take-profit levels. Backed by multi-timeframe confluence.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-4"
              >
                <Link
                  href="/register"
                 className="inline-flex items-center gap-2 px-8 py-3 rounded-sm bg-transparent hover:bg-white/5 border border-white/20  text-white font-bold text-sm tracking-wide transition-all"
                >
                  <Zap className="w-4 h-4 fill-black text-white" />
                  Access Full Signals
                </Link>
                <Link
                  href="/investment-plans"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-sm bg-transparent hover:bg-white/5 border border-white/20 text-white font-bold text-sm tracking-wide transition-all"
                >
                  View Plans <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
              {METRICS.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                  className={`relative p-5 rounded-lg border ${m.border} liquid-panel glass-card`}
                >
                  <div className={`inline-flex p-2 rounded-xl ${m.bg} border ${m.border} mb-3`}>
                    <m.icon className={`w-4 h-4 ${m.color}`} />
                  </div>
                  <p className={`text-2xl font-black tracking-tight ${m.color}`}>{m.value}</p>
                  <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wide mt-0.5">{m.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ ANALYTICS OVERVIEW ══ */}
        <section className="py-10 px-4 sm:px-8 lg:px-14">
          <div className="max-w-[1600px] mx-auto">
            <div className="text-center mb-14">
                <p className="text-xs font-bold text-fiery-orange uppercase tracking-[0.2em] mb-3 font-mono">Try our Forex Trading Signals</p>
                <h2 className="text-4xl sm:text-5xl text-white text-center tracking-tight">Signal Analytics</h2>
            </div>
            <SignalAnalyticsOverview />
          </div>
        </section>

        {/* ══ LIVE SIGNALS FEED ══ */}
        <section className="py-12 px-4 sm:px-8 lg:px-14">
          <div className="max-w-[1600px] mx-auto">

            {/* Section Header + Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-4xl sm:text-4xl text-white tracking-tight">Live Signals Feed</h2>
                <p className="text-sm text-zinc-400 mt-0.5">
                  {filtered.length} active setups · refreshed continuously
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
                  className="p-2.5 rounded-sm bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  {view === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
                </button>
                <button className="p-2.5 rounded-sm bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-400 hover:text-white transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search pair (EUR/USD, BTC...)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-sm text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-fiery-orange/60 transition-colors"
                />
              </div>
              <div className="flex gap-2">
                {(['ALL', 'BUY', 'SELL'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-5 py-3 rounded-xl text-xs font-bold transition-all ${
                      filter === f
                        ? f === 'BUY'
                          ? 'bg-emerald-500 text-black'
                          : f === 'SELL'
                          ? 'bg-rose-500 text-white'
                          : 'bg-fiery-orange text-black'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-400'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Signal Grid */}
            {isLoading ? (
              <div className="py-24 text-center">
                <Loader2 className="w-10 h-10 text-fiery-orange animate-spin mx-auto mb-3" />
                <p className="text-sm text-zinc-500">Loading live market setups...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-24 text-center rounded-lg border border-white/5 liquid-panel">
                <Zap className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                <p className="text-sm text-zinc-500">No active signals match your filters.</p>
              </div>
            ) : (
              <div className={`grid gap-5 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 max-w-2xl'}`}>
                {filtered.map((signal) => (
                  <SignalCard
                    key={signal.id}
                    signal={signal}
                    onDetail={() => { setSelectedDetail(signal); setIsDetailOpen(true); }}
                    onCalc={() => { setSelectedCalc(signal); setIsCalcOpen(true); }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section className="py-20 px-4 sm:px-8 lg:px-14">
          <div className="max-w-[1600px] mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-bold text-fiery-orange uppercase tracking-[0.2em] mb-3 font-mono">How It Works</p>
              <h2 className="text-3xl sm:text-5xl  text-white mb-4 tracking-tight">
                Every Signal, Perfectly Structured
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto text-base leading-relaxed">
                From market screening to alert delivery our system handles everything with zero noise.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative p-7 rounded-lg border border-white/[0.07] hover:border-fiery-orange/30 hover:shadow-[0_8px_32px_rgba(255,107,0,0.1)] transition-all group liquid-panel glass-card"
                >
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="p-3 rounded-sm bg-fiery-orange/10 border border-fiery-orange/20 inline-flex mb-5 group-hover:bg-fiery-orange/20 transition-colors">
                    <f.icon className="w-6 h-6 text-fiery-orange" />
                  </div>
                  <h3 className="text-base font-extrabold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed font-normal">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PREMIUM CTA ══ */}
        <section className="py-20 px-4 sm:px-8 lg:px-14">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-lg overflow-hidden border border-fiery-orange/20 p-12 sm:p-16 text-center liquid-panel glass-card">
              {/* Background glow */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-fiery-orange/10 rounded-full blur-[100px]" />
              </div>
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-fiery-orange/50 to-transparent" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-amber-300/10 border border-amber-300/20 text-xs font-bold text-amber-300 uppercase tracking-[0.2em] mb-6">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  Premium Membership
                </div>
                <h2 className="text-4xl sm:text-5xl  text-white mb-4 leading-tight tracking-tight">
                  Unlock the Full Signal Suite
                </h2>
                <p className="text-zinc-300 text-base max-w-lg mx-auto mb-8 font-normal leading-relaxed">
                  Get unlimited access to all signals, advanced analytics, risk calculator,
                  and priority alerts. Join 12,000+ empire traders.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-10 py-3 rounded-sm bg-fiery-orange text-white  text-sm shadow-[0_0_20px_rgba(255,107,0,0.2)] hover:brightness-110 transition-transform"
                  >
                    <Lock className="w-4 h-4" /> Get Premium Access
                  </Link>
                  <Link
                    href="/investment-plans"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-semibold text-sm transition-all"
                  >
                    Compare Plans <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Modals */}
      <SignalDetailModal
        signal={selectedDetail}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenCalculator={(s) => { setSelectedCalc(s); setIsCalcOpen(true); }}
      />
      <RiskCalculatorModal
        signal={selectedCalc}
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
      />
    </div>
  );
}