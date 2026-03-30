'use client';

import Card from '@/components/common/Card';
import ForexSignalCard from '@/components/forex/ForexSignalCard';

export default function SignalsPage() {
  const signals = [
    {
      id: 1,
      pair: 'EURUSD',
      type: 'BUY' as const,
      entry: 1.085,
      target: 1.092,
      stopLoss: 1.080,
      analysis: 'Strong uptrend with support at 1.080. Market sentiment is bullish.',
      timeframe: '4H',
      createdAt: '2024-06-10T10:30:00Z',
    },
    {
      id: 2,
      pair: 'GBPUSD',
      type: 'SELL' as const,
      entry: 1.265,
      target: 1.250,
      stopLoss: 1.275,
      analysis: 'Bearish reversal pattern observed. Resistance at 1.275 is strong.',
      timeframe: '1H',
      createdAt: '2024-06-10T08:15:00Z',
    },
    {
      id: 3,
      pair: 'USDJPY',
      type: 'BUY' as const,
      entry: 110.50,
      target: 111.50,
      stopLoss: 110.00,
      analysis: 'Support zone holding well. Bullish divergence on RSI.',
      timeframe: 'Daily',
      createdAt: '2024-06-09T14:45:00Z',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Forex Signals</h1>
        <p className="text-gray-600 mt-1">Latest trading signals and recommendations</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {signals.map((signal) => (
          <ForexSignalCard key={signal.id} {...signal} />
        ))}
      </div>
    </div>
  );
}
