'use client';

import Card from '@/components/common/Card';
import MarketAnalysisCard from '@/components/forex/MarketAnalysisCard';

export default function MarketAnalysisPage() {
  const analyses = [
    {
      id: 1,
      title: 'EUR/USD Technical Breakdown',
      content: 'The EUR/USD pair is showing strong momentum above the 1.08 level. Key support levels at 1.080 and 1.075...',
      pair: 'EURUSD',
      sentiment: 'bullish' as const,
      technicalLevel: 75,
      createdAt: '2024-06-10T10:30:00Z',
    },
    {
      id: 2,
      title: 'GBP/USD Consolidation Pattern',
      content: 'GBP/USD is consolidating within a tight range. Traders should wait for a breakout above 1.270 or below 1.260...',
      pair: 'GBPUSD',
      sentiment: 'neutral' as const,
      technicalLevel: 50,
      createdAt: '2024-06-09T14:20:00Z',
    },
    {
      id: 3,
      title: 'USD/JPY Downtrend Formation',
      content: 'A clear downtrend is forming in USD/JPY after the rejection at 111.50. Next support level at 110.00...',
      pair: 'USDJPY',
      sentiment: 'bearish' as const,
      technicalLevel: 25,
      createdAt: '2024-06-08T09:45:00Z',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Market Analysis</h1>
        <p className="text-gray-600 mt-1">Professional forex market analysis and insights</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {analyses.map((analysis) => (
          <MarketAnalysisCard key={analysis.id} {...analysis} />
        ))}
      </div>
    </div>
  );
}
