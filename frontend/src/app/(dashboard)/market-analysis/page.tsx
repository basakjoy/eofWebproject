'use client';

import { useEffect, useState, useCallback } from 'react';
import { analysisApi } from '@/lib/analysisApi';
import {
  TrendingUp, TrendingDown, Minus, LineChart, RefreshCw,
  Clock, Filter, MessageSquare, ChevronDown, ChevronUp,
  Activity, BarChart2, AlertCircle, BookOpen, Zap
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
    content: 'Resistance at 1.2750 remains firm after three failed breakout attempts this week. Price action indicates a lower-high formation on the H4 timeframe, pointing towards a continuation of the prevailing downtrend. The MACD has crossed bearish on both H4 and Daily timeframes. Our target is 1.2600 support zone. Stop loss should be placed above 1.2780 for risk management.',
    pair: 'GBPUSD', sentiment: 'bearish', technicalLevel: 72, timeframe: 'Daily', tags: ['MACD', 'Resistance', 'Downtrend'],
    createdAt: new Date(Date.now() - 3_600_000).toISOString(),
  },
  {
    id: '3', title: 'USDJPY Consolidation Before NFP Release',
    description: 'Narrow range between 149.50–150.80 ahead of key US jobs data.',
    content: 'USDJPY is trading within a narrow range between 149.50 and 150.80. Volume is decreasing significantly, suggesting a big directional move is expected post-NFP data release on Friday. The Bollinger Bands have contracted to their tightest level in 60 days, indicating an explosive move is coming. Both bulls and bears are positioned, creating a classic pre-news coil. Wait for the data before committing to a direction.',
    pair: 'USDJPY', sentiment: 'neutral', technicalLevel: 45, timeframe: 'H1', tags: ['NFP', 'Consolidation', 'Breakout'],
    createdAt: new Date(Date.now() - 7_200_000).toISOString(),
  },
  {
    id: '4', title: 'AUDUSD Breaks Above 200 SMA — Bulls in Control',
    description: 'Clean breakout above 200-day SMA targeting 0.6800 liquidity zone.',
    content: 'AUDUSD has successfully closed above the 200-day Simple Moving Average on strong volume. This is a significant technical development that shifts the medium-term bias to bullish. Bulls are targeting 0.6800 as the next significant liquidity zone, which served as resistance multiple times in 2023. The breakout is further supported by improving Australian economic data and a weaker USD environment. Pullbacks toward the 200 SMA (now support at 0.6650) can be used as entry opportunities.',
    pair: 'AUDUSD', sentiment: 'bullish', technicalLevel: 92, timeframe: 'Weekly', tags: ['200 SMA', 'Breakout', 'Momentum'],
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
  },
  {
    id: '5', title: 'XAUUSD Gold Tests All-Time High Resistance',
    description: 'Gold faces strong supply zone near ATH. Watch for rejection or breakout.',
    content: 'Gold is approaching the critical all-time high resistance zone near $2,780/oz. This level has been tested twice before and both times resulted in sharp selloffs. However, global geopolitical tensions and Fed dovish pivot expectations are providing significant upside fuel. A decisive daily close above $2,780 would open the path to $2,850 and beyond. Conversely, a rejection here could see a retracement to $2,700.',
    pair: 'XAUUSD', sentiment: 'bullish', technicalLevel: 78, timeframe: 'Daily', tags: ['Gold', 'ATH', 'Breakout'],
    createdAt: new Date(Date.now() - 172_800_000).toISOString(),
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SENTIMENT_CONFIG = {
  bullish: {
    label: 'Bullish',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    bar: 'bg-emerald-500',
    icon: TrendingUp,
  },
  bearish: {
    label: 'Bearish',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    bar: 'bg-rose-500',
    icon: TrendingDown,
  },
  neutral: {
    label: 'Neutral',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    bar: 'bg-amber-500',
    icon: Minus,
  },
};

const PAIR_COLORS: Record<string, string> = {
  EURUSD: 'from-blue-500 to-cyan-500',
  GBPUSD: 'from-violet-500 to-purple-500',
  USDJPY: 'from-orange-500 to-amber-500',
  AUDUSD: 'from-emerald-500 to-teal-500',
  XAUUSD: 'from-yellow-500 to-amber-400',
  DEFAULT: 'from-slate-500 to-slate-600',
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
  const pairGradient = PAIR_COLORS[analysis.pair ?? 'DEFAULT'] ?? PAIR_COLORS.DEFAULT;

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm overflow-hidden hover:border-slate-700 transition-all duration-300 group">
      {/* Top accent bar */}
      <div className={`h-0.5 w-full bg-gradient-to-r ${pairGradient}`} />

      <div className="p-5">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Pair badge */}
            {analysis.pair && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r ${pairGradient} text-white text-xs font-black tracking-wider shrink-0`}>
                <Activity className="w-3 h-3" />
                {analysis.pair}
              </div>
            )}
            {/* Timeframe */}
            {analysis.timeframe && (
              <span className="text-xs font-semibold text-slate-500 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                {analysis.timeframe}
              </span>
            )}
          </div>

          {/* Sentiment Badge */}
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${s.bg} ${s.color} shrink-0`}>
            <SentIcon className="w-3.5 h-3.5" />
            {s.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-white text-base leading-snug mb-2 group-hover:text-blue-300 transition-colors">
          {analysis.title}
        </h3>

        {/* Description */}
        {analysis.description && (
          <p className="text-sm text-slate-400 leading-relaxed mb-4">{analysis.description}</p>
        )}

        {/* Technical Strength Meter */}
        {analysis.technicalLevel != null && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500 font-semibold">Technical Strength</span>
              <span className={`font-black ${s.color}`}>{analysis.technicalLevel}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${s.bar} transition-all duration-700`}
                style={{ width: `${analysis.technicalLevel}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        {analysis.tags && analysis.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {analysis.tags.map(tag => (
              <span key={tag} className="text-[10px] font-bold text-slate-500 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Expand/Collapse full content */}
        {analysis.content && (
          <>
            {expanded && (
              <div className="mb-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{analysis.content}</p>
              </div>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              {expanded ? 'Show less' : 'Read full analysis'}
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{timeAgo(analysis.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="text-xs">Analysis</span>
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

  // Distinct pairs for filter
  const availablePairs = Array.from(new Set(analyses.map(a => a.pair).filter(Boolean))) as string[];

  // Filtered analyses
  const filtered = analyses.filter(a => {
    const sentimentMatch = filterSentiment === 'all' || a.sentiment === filterSentiment;
    const pairMatch = filterPair === 'all' || a.pair === filterPair;
    return sentimentMatch && pairMatch;
  });

  // Counts for summary
  const bullCount = analyses.filter(a => a.sentiment === 'bullish').length;
  const bearCount = analyses.filter(a => a.sentiment === 'bearish').length;
  const neutCount = analyses.filter(a => a.sentiment === 'neutral').length;

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-slate-950 p-8">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading market analysis…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-6 space-y-6 bg-slate-950 text-white">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <LineChart className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">Market Analysis</h1>
          </div>
          <p className="text-slate-400 text-sm">Professional forex market insights & technical analysis</p>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-medium text-slate-300 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Fallback notice */}
      {usingFallback && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-300">Showing sample analysis. Live data will appear once your analysts publish their first reports.</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Bullish', count: bullCount, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Bearish', count: bearCount, icon: TrendingDown, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
          { label: 'Neutral', count: neutCount, icon: Minus, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-4 flex items-center gap-3 ${s.bg}`}>
            <s.icon className={`w-5 h-5 ${s.color}`} />
            <div>
              <p className={`text-xl font-black ${s.color}`}>{s.count}</p>
              <p className="text-xs text-slate-500">{s.label} signals</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
        <Filter className="w-4 h-4 text-slate-500 shrink-0" />
        <span className="text-sm font-bold text-slate-400 mr-1">Filter:</span>

        {/* Sentiment filter */}
        <div className="flex gap-2 flex-wrap">
          {[
            { val: 'all', label: 'All Sentiments' },
            { val: 'bullish', label: '📈 Bullish' },
            { val: 'bearish', label: '📉 Bearish' },
            { val: 'neutral', label: '➖ Neutral' },
          ].map(f => (
            <button
              key={f.val}
              onClick={() => setFilterSentiment(f.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterSentiment === f.val
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Pair filter */}
        {availablePairs.length > 0 && (
          <select
            value={filterPair}
            onChange={e => setFilterPair(e.target.value)}
            className="ml-auto px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="all">All Pairs</option>
            {availablePairs.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <BarChart2 className="w-4 h-4" />
        <span>Showing <span className="text-white font-bold">{filtered.length}</span> analyses</span>
      </div>

      {/* Analysis Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map(a => <AnalysisCard key={a.id} analysis={a} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Zap className="w-16 h-16 text-slate-800 mb-4" />
          <h3 className="text-xl font-bold text-slate-400 mb-2">No analyses found</h3>
          <p className="text-slate-600 text-sm">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}
