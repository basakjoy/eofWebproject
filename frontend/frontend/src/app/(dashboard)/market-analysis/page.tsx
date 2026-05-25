'use client';

import Card from '@/components/common/Card';
import MarketAnalysisCard from '@/components/forex/MarketAnalysisCard';

export default function MarketAnalysisPage() {
 const analyses = [
  {
    id: 1,
    title: 'Strong Support Level Identified',
    content: 'The pair is currently testing a major psychological support level at 1.0500. Indicators show oversold conditions on the RSI, suggesting a potential short-term reversal.',
    pair: 'EURUSD' as const,
    sentiment: 'bullish' as const,
    technicalLevel: 85,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Bearish Momentum Building',
    content: 'Resistance at 1.2750 remains firm. Price action indicates a lower-high formation on the H4 timeframe, pointing towards a continuation of the downtrend.',
    pair: 'GBPUSD' as const,
    sentiment: 'bearish' as const,
    technicalLevel: 72,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 3,
    title: 'Consolidation Phase',
    content: 'The pair is trading within a narrow range between 149.50 and 150.80. Volume is decreasing, suggesting a big move is coming post-NFP data release.',
    pair: 'USDJPY' as const,
    sentiment: 'neutral' as const,
    technicalLevel: 45,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 4,
    title: 'Breakout Above 200 SMA',
    content: 'AUDUSD has successfully closed above the 200-day Simple Moving Average. Bulls are targeting 0.6800 as the next significant liquidity zone.',
    pair: 'AUDUSD' as const,
    sentiment: 'bullish' as const,
    technicalLevel: 92,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold dark:text-white  text-gray-900">Market Analysis</h1>
        <p className="text-gray-600 mt-1">Professional forex market analysis and insights</p>
      </div>

      <div className="grid gap-6">
        {analyses.map((analysis) => (
          <MarketAnalysisCard key={analysis.id} {...analysis} />
        ))}
      </div>
    </div>
  );
}
