'use client';

import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Table from '@/components/common/Table';
import { TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const liveSignals = [
  { id: 1, pair: 'EURUSD', signal: 'BUY', entry: 1.0850, target: 1.0920, sl: 1.0800, timeframe: '4H', accuracy: '92%', status: 'Active' },
  { id: 2, pair: 'GBPUSD', signal: 'SELL', entry: 1.2750, target: 1.2680, sl: 1.2800, timeframe: '1H', accuracy: '88%', status: 'Active' },
  { id: 3, pair: 'USDJPY', signal: 'BUY', entry: 110.50, target: 111.50, sl: 110.00, timeframe: 'D', accuracy: '85%', status: 'Active' },
  { id: 4, pair: 'AUDUSD', signal: 'SELL', entry: 0.6900, target: 0.6850, sl: 0.6950, timeframe: '4H', accuracy: '86%', status: 'Closed' },
  { id: 5, pair: 'NZDUSD', signal: 'BUY', entry: 0.6050, target: 0.6150, sl: 0.6000, timeframe: '1D', accuracy: '90%', status: 'Active' },
];

const performanceHistory = [
  { date: 'Week 1', wins: 8, losses: 1, roi: '8.5%' },
  { date: 'Week 2', wins: 7, losses: 2, roi: '7.2%' },
  { date: 'Week 3', wins: 9, losses: 1, roi: '9.1%' },
  { date: 'Week 4', wins: 8, losses: 2, roi: '8.3%' },
  { date: 'Week 5', wins: 10, losses: 0, roi: '10.5%' },
];

const signalStats = [
  { metric: 'Total Signals', value: '1,240', trend: '+15%' },
  { metric: 'Win Rate', value: '87%', trend: '+2%' },
  { metric: 'Avg ROI', value: '8.7%', trend: '+0.5%' },
  { metric: 'Consecutive Wins', value: '12', trend: 'Current' },
];

export default function TradingSignalsPage() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold gradient-text mb-6">Trading Signals</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Real-time forex signals with high accuracy and consistent performance
        </p>
      </section>

      {/* Signal Stats */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {signalStats.map((stat) => (
            <Card key={stat.metric} hover>
              <p className="text-gray-400 text-sm mb-2">{stat.metric}</p>
              <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
              <p className={`text-sm font-semibold ${stat.trend.includes('+') ? 'text-green-400' : 'text-gray-400'}`}>
                {stat.trend}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Live Signals Feed */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">Live Signals Feed</h2>
          <p className="text-gray-400">Updated in real-time throughout trading sessions</p>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4 font-bold text-white">Pair</th>
                  <th className="text-center py-4 px-4 font-bold text-white">Signal</th>
                  <th className="text-center py-4 px-4 font-bold text-white">Entry</th>
                  <th className="text-center py-4 px-4 font-bold text-white">Target</th>
                  <th className="text-center py-4 px-4 font-bold text-white">Stop Loss</th>
                  <th className="text-center py-4 px-4 font-bold text-white">Timeframe</th>
                  <th className="text-center py-4 px-4 font-bold text-white">Accuracy</th>
                  <th className="text-center py-4 px-4 font-bold text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {liveSignals.map((signal) => (
                  <tr key={signal.id} className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 px-4 font-bold text-white">{signal.pair}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        signal.signal === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {signal.signal}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-300">{signal.entry}</td>
                    <td className="py-4 px-4 text-center text-indigo-400 font-semibold">{signal.target}</td>
                    <td className="py-4 px-4 text-center text-gray-300">{signal.sl}</td>
                    <td className="py-4 px-4 text-center text-gray-300">{signal.timeframe}</td>
                    <td className="py-4 px-4 text-center text-green-400 font-semibold">{signal.accuracy}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-sm font-semibold ${
                        signal.status === 'Active' ? 'text-blue-400' : 'text-gray-400'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${signal.status === 'Active' ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'}`}></span>
                        {signal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Performance History */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">Performance History</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h3 className="text-2xl font-bold text-white mb-6">Weekly Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
                <XAxis stroke="#999" dataKey="date" />
                <YAxis stroke="#999" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4f46e5' }}
                  labelStyle={{ color: '#e0e7ff' }}
                />
                <Bar dataKey="wins" stackId="a" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-2xl font-bold text-white mb-6">ROI Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
                <XAxis stroke="#999" dataKey="date" />
                <YAxis stroke="#999" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4f46e5' }}
                  labelStyle={{ color: '#e0e7ff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="roi" 
                  stroke="#ec4899" 
                  strokeWidth={3}
                  dot={{ fill: '#ec4899', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">How Our Signals Work</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Analysis', description: 'Our traders analyze multiple timeframes and indicators' },
            { step: '2', title: 'Generation', description: 'High-probability signals are generated automatically' },
            { step: '3', title: 'Delivery', description: 'Signals are sent to you in real-time via multiple channels' },
            { step: '4', title: 'Tracking', description: 'Performance is tracked and reported transparently' },
          ].map((item) => (
            <Card key={item.step} hover>
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <span className="text-white font-bold text-lg">{item.step}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Trading With Our Signals?</h2>
        <p className="text-xl text-gray-300 mb-8">Get real-time signals and start earning consistent profits</p>
        <Button variant="gradient" size="lg">
          Get Trading Signals Now
        </Button>
      </section>
    </div>
  );
}
