'use client';

import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Table from '@/components/common/Table';
import { TrendingUp, CheckCircle2, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useState, useEffect } from 'react';

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
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth < 1024 && window.innerWidth >= 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chartHeight = isMobile ? 250 : isTablet ? 280 : 300;

  return (
    <div className="w-full pt-16">
      {/* Hero */}
      <section className="w-full px-4 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-9xl font-bold text-white/80 tracking-tight mb-8 leading-tight">Trading Signals</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-2">
            Real-time forex signals with high accuracy and consistent performance
          </p>
        </div>
      </section>

      {/* Signal Stats */}
      <section className="w-full px-4 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {signalStats.map((stat) => (
            <Card key={stat.metric} hover>
              <p className="text-gray-400 text-xs sm:text-sm mb-2">{stat.metric}</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</p>
              <p className={`text-xs sm:text-sm font-semibold ${stat.trend.includes('+') ? 'text-green-400' : 'text-gray-400'}`}>
                {stat.trend}
              </p>
            </Card>
          ))}
          </div>
        </div>
      </section>  

      {/* Live Signals Feed */}
      <section className="w-full px-4 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-3 sm:mb-4">Live Signals Feed</h2>
            <p className="text-sm sm:text-base text-gray-400">Updated in real-time throughout trading sessions</p>
          </div>

          <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-bold text-white whitespace-nowrap">Pair</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 font-bold text-white whitespace-nowrap">Signal</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 font-bold text-white whitespace-nowrap">Entry</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 font-bold text-white whitespace-nowrap">Target</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 font-bold text-white whitespace-nowrap">Stop Loss</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 font-bold text-white whitespace-nowrap">Timeframe</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 font-bold text-white whitespace-nowrap">Accuracy</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 font-bold text-white whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {liveSignals.map((signal) => (
                  <tr key={signal.id} className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 sm:py-4 px-2 sm:px-4 font-bold text-white">{signal.pair}</td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                      <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${
                        signal.signal === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {signal.signal}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-center text-gray-300">{signal.entry}</td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-center text-indigo-400 font-semibold">{signal.target}</td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-center text-gray-300">{signal.sl}</td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-center text-gray-300">{signal.timeframe}</td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-center text-green-400 font-semibold">{signal.accuracy}</td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs sm:text-sm font-semibold ${
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
        </div>
      </section>

      {/* Performance History */}
      <section className="w-full px-4 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-3 sm:mb-4">Performance History</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <Card>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Weekly Performance</h3>
              <div className="w-full h-64 sm:h-80">
                <ResponsiveContainer width="100%" height={chartHeight}>
                  <BarChart data={performanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
                  <XAxis stroke="#ffffff" dataKey="date" tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <YAxis stroke="#999" tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#281f1f', border: '1px solid #4f46e5', borderRadius: '8px' }}
                    labelStyle={{ color: '#e0e7ff' }}
                  />
                  <Bar dataKey="wins" stackId="a" fill="#1e81e4" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="losses" stackId="a" fill="#7d2f2f" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">ROI Trend</h3>
            <div className="w-full h-64 sm:h-80">
              <ResponsiveContainer width="100%" height={chartHeight}>
                <LineChart data={performanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
                  <XAxis stroke="#999" dataKey="date" tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <YAxis stroke="#999" tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#d2d9e2', border: '1px solid #4f46e5', borderRadius: '8px' }}
                    labelStyle={{ color: '#111213' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="roi" 
                    stroke="#000000ae" 
                    strokeWidth={isMobile ? 2 : 3}
                    dot={{ fill: '#f5d0e2', r: isMobile ? 3 : 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full px-4 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-3 sm:mb-4">How Our Signals Work</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { step: '1', title: 'Analysis', description: 'Our traders analyze multiple timeframes and indicators' },
              { step: '2', title: 'Generation', description: 'High-probability signals are generated automatically' },
              { step: '3', title: 'Delivery', description: 'Signals are sent to you in real-time via multiple channels' },
              { step: '4', title: 'Tracking', description: 'Performance is tracked and reported transparently' },
            ].map((item) => (
              <Card key={item.step} hover>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <span className="text-white font-bold text-base sm:text-lg">{item.step}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full px-4 py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">Ready to Start Trading With Our Signals?</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">Get real-time signals and start earning consistent profits</p>
          <Button variant="gradient" size="lg">
            Get Trading Signals Now
          </Button>
        </div>
      </section>
    </div>
  );
}
