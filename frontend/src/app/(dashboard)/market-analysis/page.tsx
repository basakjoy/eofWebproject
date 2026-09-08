'use client';

import { useEffect, useState, useCallback } from 'react';
import { analysisApi } from '@/lib/analysisApi';
import {
  TrendingUp, TrendingDown, Minus, LineChart, RefreshCw,
  Clock, Filter, ChevronDown, ChevronUp,
  Activity, BarChart2, AlertCircle, BookOpen, Zap,
  Target, Eye, Tag
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Analysis {
  id: string;
  title: string;
  description?: string;
  content?: string;
  pair?: string;
  timeframe?: string;
  sentiment?: 'bullish' | 'bearish' | 'neutral';
  tags?: string[];
  technicalLevel?: number;
  createdAt: string;
  updatedAt?: string;
}

// ─── Fallback static data ─────────────────────────────────────────────────────

const STATIC_ANALYSES: Analysis[] = [
  {
    id: '1', title: 'Strong Support Level Identified at 1.0500',
    description: 'Major psychological support with RSI showing oversold conditions.',
    content: 'The EURUSD pair is currently testing a major psychological support level at 1.0500. Technical indicators show oversold conditions on the RSI (below 30), suggesting a potential short-term reversal. The 200-day SMA is providing additional confluence at this level. Volume analysis shows declining selling pressure, further supporting a bullish bounce scenario. Traders should watch for a daily close above 1.0520 to confirm the setup.',
    pair: 'EURUSD', sentiment: 'bullish', technicalLevel: 85, timeframe: 'H4', tags: ['RSI', 'Support', 'Reversal'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2', title: 'Bearish Momentum Building on GBPUSD',
    description: 'Resistance at 1.2750 remains firm. Lower-high formation confirmed.',
    content: 'Resistance at 1.2750 remains firm after three failed breakout attempts this week. Price action indicates a lower-high formation on the H4 timeframe, pointing towards a continuation of the prevailing downtrend. The MACD has crossed bearish on both H4 and Daily timeframes. Our target is 1.2600 support zone.',
    pair: 'GBPUSD', sentiment: 'bearish', technicalLevel: 72, timeframe: 'Daily', tags: ['MACD', 'Resistance', 'Downtrend'],
    createdAt: new Date(Date.now() - 3_600_000).toISOString(),
  },
  {
    id: '3', title: 'USDJPY Consolidation Before NFP Release',
    description: 'Narrow range between 149.50-150.80 ahead of key US jobs data.',
    content: 'USDJPY is trading within a narrow range between 149.50 and 150.80. Volume is decreasing significantly, suggesting a big directional move is expected post-NFP data release on Friday. The Bollinger Bands have contracted to their tightest level in 60 days. Wait for the data before committing to a direction.',
    pair: 'USDJPY', sentiment: 'neutral', technicalLevel: 45, timeframe: 'H1', tags: ['NFP', 'Consolidation', 'Breakout'],
    createdAt: new Date(Date.now() - 7_200_000).toISOString(),
  },
  {
    id: '4', title: 'AUDUSD Breaks Above 200 SMA - Bulls in Control',
    description: 'Clean breakout above 200-day SMA targeting 0.6800 liquidity zone.',
    content: 'AUDUSD has successfully closed above the 200-day Simple Moving Average on strong volume. Bulls are targeting 0.6800 as the next significant liquidity zone. Pullbacks toward the 200 SMA (now support at 0.6650) can be used as entry opportunities.',
    pair: 'AUDUSD', sentiment: 'bullish', technicalLevel: 92, timeframe: 'Weekly', tags: ['200 SMA', 'Breakout', 'Momentum'],
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
  },
  {
    id: '5', title: 'XAUUSD Gold Tests All-Time High Resistance',
    description: 'Gold faces strong supply zone near ATH. Watch for rejection or breakout.',
    content: 'Gold is approaching the critical all-time high resistance zone near $2,780/oz. A decisive daily close above $2,780 would open the path to $2,850 and beyond. Conversely, a rejection here could see a retracement to $2,700.',
    pair: 'XAUUSD', sentiment: 'bullish', technicalLevel: 78, timeframe: 'Daily', tags: ['Gold', 'ATH', 'Breakout'],
    createdAt: new Date(Date.now() - 172_800_000).toISOString(),
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SENTIMENT_CONFIG = {
  bullish: {
    label: 'Bullish',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/25',
    barColor: 'bg-emerald-500',
    shadowHover: 'hover:shadow-emerald-500/10',
    topBar: 'bg-emerald-400',
    icon: TrendingUp,
  },
  bearish: {
    label: 'Bearish',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/25',
    barColor: 'bg-rose-500',
    shadowHover: 'hover:shadow-rose-500/10',
    topBar: 'bg-rose-400',
    icon: TrendingDown,
  },
  neutral: {
    label: 'Neutral',
    color: 'text-fiery-amber',
    bg: 'bg-fiery-amber/10 border-fiery-amber/25',
    barColor: 'bg-fiery-amber',
    shadowHover: 'hover:shadow-fiery-amber/10',
    topBar: 'bg-fiery-amber',
    icon: Minus,
  },
};

const PAIR_STYLES: Record<string, { pill: string }> = {
  EURUSD:  { pill: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
  GBPUSD:  { pill: 'bg-violet-500/15 text-violet-300 border-violet-500/30' },
  USDJPY:  { pill: 'bg-orange-500/15 text-orange-300 border-orange-500/30' },
  AUDUSD:  { pill: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  XAUUSD:  { pill: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30' },
  DEFAULT: { pill: 'bg-white/10 text-zinc-300 border-white/20' },
};

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Analysis Card ────────────────────────────────────────────────────────────

function AnalysisCard({ analysis }: { analysis: Analysis }) {
  const [expanded, setExpanded] = useState(false);
  const s = SENTIMENT_CONFIG[analysis.sentiment ?? 'neutral'];
  const SentIcon = s.icon;
  const pairStyle = PAIR_STYLES[analysis.pair ?? 'DEFAULT'] ?? PAIR_STYLES.DEFAULT;

  return (
    <div className={`group relative bg-card-dark/70 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl ${s.shadowHover}`}>
      {/* Sentiment accent top bar */}
      <div className={`absolute top-0 left-8 right-8 h-[2px] rounded-b-full opacity-80 ${s.topBar}`} />

      <div className="p-5 pt-6">
        {/* Header: Pair + Timeframe + Sentiment */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            {analysis.pair && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black border ${pairStyle.pill}`}>
                <Activity className="w-3 h-3" />
                {analysis.pair}
              </span>
            )}
            {analysis.timeframe && (
              <span className="text-[10px] font-bold text-zinc-400 bg-panel-dark border border-white/10 px-2.5 py-1 rounded-xl">
                {analysis.timeframe}
              </span>
            )}
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${s.bg} ${s.color}`}>
            <SentIcon className="w-3.5 h-3.5" />
            {s.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-white text-base leading-snug mb-2 group-hover:text-fiery-amber transition-colors duration-200">
          {analysis.title}
        </h3>

        {/* Description */}
        {analysis.description && (
          <p className="text-sm text-zinc-400 leading-relaxed mb-4">{analysis.description}</p>
        )}

        {/* Technical Strength Meter */}
        {analysis.technicalLevel != null && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-zinc-500 font-semibold flex items-center gap-1">
                <Target className="w-3 h-3" /> Technical Strength
              </span>
              <span className={`font-black ${s.color}`}>{analysis.technicalLevel}%</span>
            </div>
            <div className="h-1.5 w-full bg-panel-dark rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${s.barColor}`}
                style={{ width: `${analysis.technicalLevel}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        {analysis.tags && analysis.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 items-center">
            <Tag className="w-3 h-3 text-zinc-500" />
            {analysis.tags.map(tag => (
              <span key={tag} className="text-[10px] font-bold text-zinc-400 bg-panel-dark border border-white/10 px-2 py-0.5 rounded-lg">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Expandable Full Content */}
        {analysis.content && (
          <>
            {expanded && (
              <div className="mb-4 p-4 rounded-2xl bg-panel-dark border border-white/10">
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{analysis.content}</p>
              </div>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-xs font-bold text-fiery-orange hover:text-fiery-amber transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              {expanded ? 'Show less' : 'Read full analysis'}
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{timeAgo(analysis.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-600 hover:text-fiery-orange transition-colors cursor-pointer">
            <Eye className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">View Details</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MarketAnalysisPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterSentiment, setFilterSentiment] = useState<string>('all');
  const [filterPair, setFilterPair] = useState<string>('all');
  const [usingFallback, setUsingFallback] = useState(false);

  const loadAnalyses = useCallback(async () => {
    try {
      const res = await analysisApi.getAllAnalyses({ limit: 20 });
      const data: Analysis[] = res?.data ?? [];
      if (data.length > 0) {
        setAnalyses(data);
        setUsingFallback(false);
      } else {
        setAnalyses(STATIC_ANALYSES);
        setUsingFallback(true);
      }
    } catch {
      setAnalyses(STATIC_ANALYSES);
      setUsingFallback(true);
    }
  }, []);

  useEffect(() => {
    loadAnalyses().finally(() => setLoading(false));
  }, [loadAnalyses]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyses();
    setRefreshing(false);
  };

  const availablePairs = Array.from(new Set(analyses.map(a => a.pair).filter(Boolean))) as string[];

  const filtered = analyses.filter(a => {
    const sentimentMatch = filterSentiment === 'all' || a.sentiment === filterSentiment;
    const pairMatch = filterPair === 'all' || a.pair === filterPair;
    return sentimentMatch && pairMatch;
  });

  const bullCount = analyses.filter(a => a.sentiment === 'bullish').length;
  const bearCount = analyses.filter(a => a.sentiment === 'bearish').length;
  const neutCount = analyses.filter(a => a.sentiment === 'neutral').length;

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full border-4 border-fiery-orange border-t-transparent animate-spin mx-auto" />
          <p className="text-zinc-400 text-sm">Loading market analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 sm:p-4 text-white font-poppins">

      {/* ══ PAGE HEADER ══ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-fiery-orange/10 border border-fiery-orange/20 text-xs font-bold text-fiery-amber mb-2">
            <LineChart className="w-3.5 h-3.5 text-fiery-orange" />
            MARKET INTELLIGENCE
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Market{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fiery-orange to-fiery-amber">Analysis</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">Professional forex insights and technical analysis from our analyst team.</p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-fiery-orange text-black font-extrabold text-xs hover:scale-105 transition-all disabled:opacity-50 self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Feed'}
        </button>
      </div>

      {/* ══ DEMO DATA NOTICE ══ */}
      {usingFallback && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-fiery-amber/5 border border-fiery-amber/20">
          <AlertCircle className="w-5 h-5 text-fiery-amber shrink-0 mt-0.5" />
          <p className="text-sm text-fiery-amber/80">
            Showing <strong>sample analysis</strong>. Live analyst reports will appear here once published.
          </p>
        </div>
      )}

      {/* ══ SENTIMENT STAT CARDS ══ */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Bullish', count: bullCount, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Bearish', count: bearCount, icon: TrendingDown, color: 'text-rose-400',   bg: 'bg-rose-500/10 border-rose-500/20' },
          { label: 'Neutral', count: neutCount, icon: Minus,        color: 'text-fiery-amber',bg: 'bg-fiery-amber/10 border-fiery-amber/20' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-2xl border p-4 flex items-center gap-3 ${stat.bg}`}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 shrink-0">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="min-w-0">
              <p className={`text-xl font-black ${stat.color}`}>{stat.count}</p>
              <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ══ FILTER CONTROLS ══ */}
      <div className="bg-card-dark/60 rounded-2xl border border-white/10 p-3 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            {[
              { val: 'all',     label: 'All',     emoji: '📊' },
              { val: 'bullish', label: 'Bullish', emoji: '📈' },
              { val: 'bearish', label: 'Bearish', emoji: '📉' },
              { val: 'neutral', label: 'Neutral', emoji: '➖' },
            ].map(f => (
              <button
                key={f.val}
                onClick={() => setFilterSentiment(f.val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  filterSentiment === f.val
                    ? 'bg-fiery-orange text-black shadow-sm'
                    : 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {f.emoji} {f.label}
              </button>
            ))}
          </div>

          {availablePairs.length > 0 && (
            <select
              value={filterPair}
              onChange={e => setFilterPair(e.target.value)}
              className="sm:ml-auto px-3 py-1.5 bg-panel-dark border border-white/10 rounded-xl text-xs font-bold text-zinc-300 focus:outline-none focus:border-fiery-orange/60 transition-colors"
            >
              <option value="all">All Pairs</option>
              {availablePairs.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500 pt-2 border-t border-white/5">
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Showing <span className="text-white font-bold">{filtered.length}</span> {filtered.length === 1 ? 'report' : 'reports'}</span>
        </div>
      </div>

      {/* ══ ANALYSIS GRID ══ */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(a => <AnalysisCard key={a.id} analysis={a} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-card-dark/40 rounded-3xl border border-white/10 text-center space-y-3">
          <Zap className="w-12 h-12 text-zinc-600" />
          <h3 className="text-lg font-bold text-white">No reports found</h3>
          <p className="text-sm text-zinc-500">Try adjusting your filters to see more analysis.</p>
        </div>
      )}
    </div>
  );
}
