'use client';

import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

interface MarketAnalysisCardProps {
  title: string;
  content: string;
  pair: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  technicalLevel: number;
  createdAt: string;
}

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

export default function MarketAnalysisCard({
  title,
  content,
  pair,
  sentiment,
  technicalLevel,
  createdAt,
}: MarketAnalysisCardProps) {
  const sentimentBadge = {
    bullish: { variant: 'gradient-buy' as const, icon: <TrendingUp className="w-4 h-4" /> },
    bearish: { variant: 'gradient-sell' as const, icon: <TrendingDown className="w-4 h-4" /> },
    neutral: { variant: 'primary' as const, icon: <Target className="w-4 h-4" /> },
  };

  const flags = PAIR_FLAGS[pair] || '💱';

  return (
    <Card hover animate>
      {/* Header with pair flags */}
      <div className="flex items-center gap-3 mb-4">
        <div className="text-4xl">{flags}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 font-medium">{pair}</p>
        </div>
        <Badge
          label={sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
          variant={sentimentBadge[sentiment].variant}
          size="md"
          icon={sentimentBadge[sentiment].icon}
        />
      </div>

      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">{content}</p>

      {/* Technical Level Visualization */}
      <div className="space-y-3 mb-4 pb-4 border-b">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Technical Strength</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">{technicalLevel.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              sentiment === 'bullish'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                : sentiment === 'bearish'
                ? 'bg-gradient-to-r from-rose-400 to-red-500'
                : 'bg-gradient-to-r from-blue-400 to-cyan-500'
            }`}
            style={{ width: `${technicalLevel}%` }}
          ></div>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {new Date(createdAt).toLocaleDateString()} • {new Date(createdAt).toLocaleTimeString()}
      </p>
    </Card>
  );
}
