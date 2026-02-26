'use client';

import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { TrendingUp, TrendingDown, Heart, HeartOff, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { useEffect, useMemo, useState } from 'react';

interface ForexSignalCardProps {
  pair: string;
  type: 'BUY' | 'SELL' | 'TP' | 'SL';
  entry: number;
  target: number;
  stopLoss: number;
  analysis: string;
  timeframe: string;
  createdAt: string;
}

// Map currency pairs to flag emojis
const PAIR_FLAGS: Record<string, string> = {
  'EURUSD': '🇪🇺🇺🇸',
  'GBPUSD': '🇬🇧🇺🇸',
  'USDJPY': '🇺🇸🇯🇵',
  'AUDUSD': '🇦🇺🇺🇸',
  'USDCAD': '🇺🇸🇨🇦',
  'NZDUSD': '🇳🇿🇺🇸',
  'USDCHF': '🇺🇸🇨🇭',
  'EURGBP': '🇪🇺🇬🇧',
  'EURJPY': '🇪🇺🇯🇵',
  'GBPJPY': '🇬🇧🇯🇵',
};

export default function ForexSignalCard({
  pair,
  type,
  entry,
  target,
  stopLoss,
  analysis,
  timeframe,
  createdAt,
}: ForexSignalCardProps) {
  const isLong = type === 'BUY';
  const potentialProfit = Math.abs(target - entry);
  const riskRewardRatio = potentialProfit / Math.abs(entry - stopLoss);
  const flags = PAIR_FLAGS[pair] || '💱';

  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // generate a small sparkline dataset
  const sparkData = useMemo(() => {
    const mid = (entry + target) / 2;
    return [
      { v: entry },
      { v: (entry + mid) / 2 },
      { v: mid },
      { v: (mid + target) / 2 },
      { v: target },
    ];
  }, [entry, target]);

  const shortAnalysis = analysis.length > 120 ? analysis.slice(0, 120) + '...' : analysis;

  return (
    <Card
      hover
      animate
      className={`border-l-4 overflow-hidden ${
        isLong ? 'border-emerald-500 hover:border-emerald-400' : 'border-red-500 hover:border-red-400'
      }`}
    >
      {/* Header with pair flags and signal badge */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3">
          <div className="text-5xl">{flags}</div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{pair}</h3>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{timeframe}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <Badge
            label={type}
            variant={isLong ? 'gradient-buy' : 'gradient-sell'}
            size="md"
            icon={isLong ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
          />
          <button
            aria-pressed={saved}
            onClick={() => setSaved((s) => !s)}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-300 to-pink-300 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-full transition duration-300 group-hover:bg-rose-100 dark:group-hover:bg-rose-900">
              {saved ? <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> : <HeartOff className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
            </div>
          </button>
        </div>
      </div>

      {/* Sparkline chart */}
      <div className="mb-4 -mx-6 px-6 pb-4">
        <div className="h-12 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-700 dark:to-transparent rounded-lg p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Tooltip />
              <Line type="monotone" dataKey="v" stroke={isLong ? '#10b981' : '#ef4444'} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Price levels - visual cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {/* Entry Level */}
        <div className={`p-3 rounded-lg border-2 transition-all ${
          isLong
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
        }`}>
          <p className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400 mb-1">Entry</p>
          <p className={`text-lg font-bold ${
            isLong ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'
          }`}>
            {entry.toFixed(4)}
          </p>
        </div>

        {/* Target Level */}
        <div className="p-3 rounded-lg border-2 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <p className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400 mb-1">Target</p>
          <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{target.toFixed(4)}</p>
        </div>

        {/* Stop Loss */}
        <div className="p-3 rounded-lg border-2 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
          <p className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400 mb-1">Stop Loss</p>
          <p className="text-lg font-bold text-yellow-700 dark:text-yellow-300">{stopLoss.toFixed(4)}</p>
        </div>
      </div>

      {/* Metrics row with icons */}
      <div className="grid grid-cols-2 gap-3 mb-5 pb-5 border-b">
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Profit</p>
            <p className="text-sm font-bold text-green-700 dark:text-green-300">{potentialProfit.toFixed(4)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="w-5 h-5 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">R</div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Risk/Reward</p>
            <p className="text-sm font-bold text-blue-700 dark:text-blue-300">1:{riskRewardRatio.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Analysis section */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {expanded ? analysis : shortAnalysis}
        </p>
        {analysis.length > 120 && (
          <button
            onClick={() => setExpanded((s) => !s)}
            className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" /> Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" /> Show more
              </>
            )}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t">
        <span>{new Date(createdAt).toLocaleDateString()}</span>
        <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 rounded-full font-medium">
          {timeframe}
        </span>
      </div>
    </Card>
  );
}
