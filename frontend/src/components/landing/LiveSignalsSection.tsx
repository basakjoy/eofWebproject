'use client';
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, Lock } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TradingPage() {
  const [signals] = useState([
    {
      id: 1,
      pair: 'EUR/USD',
      icon: 'up',
      timeAgo: '10 mins ago',
      status: 'Active',
      entry: '1.091',
      takeProfit: '1.098',
      stopLoss: '1.088',
      confidence: 85,
      isPremium: false,
    },
    {
      id: 2,
      pair: 'GBP/JPY',
      icon: 'down',
      timeAgo: '45 mins ago',
      status: 'Active',
      isPremium: true,
      premiumText: 'Premium Signal',
      premiumSubtext: 'Upgrade to view entry & targets',
    },
    {
      id: 3,
      pair: 'XAU/USD',
      icon: 'up',
      timeAgo: '1 hour ago',
      status: 'Pending',
      isPremium: true,
      premiumText: 'Premium Signal',
    },
  ]);

  const features = [
    'AI-Powered Trend Analysis',
    'Real-Time Signal Updates',
    'Institutional Order Flow Tracking',
    'Risk-Reward Calculator',
  ];

  useEffect(() => {
    gsap.from('.live-signals-header', {
      scrollTrigger: {
        trigger: '.live-signals-header',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 30,
    });

    gsap.from('.live-signals-content', {
      scrollTrigger: {
        trigger: '.live-signals-content',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 40,
    });

    gsap.from('.feature-items', {
      scrollTrigger: {
        trigger: '.feature-items',
        start: 'top 80%',
        once: true,
      },
      duration: 0.6,
      opacity: 0,
      x: -20,
      stagger: 0.1,
    });
  }, []);

  const getStatusColor = (status: string ) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/30 text-green-300 border border-green-500/50';
      case 'Pending':
        return 'bg-blue-500/30 text-blue-300 border border-blue-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      

      {/* Currency Ticker */}
      <div className="bg-slate-900/80 border-b border-slate-800/50">
        <div className="overflow-hidden py-1 sm:py-2">
          <div className="ticker-scroll flex gap-6 sm:gap-8 px-4 sm:px-6 animate-scroll whitespace-nowrap text-xs sm:text-sm">
            {[
              { pair: 'USD/CAD', rate: '1.3490', change: '+0.05%', isPositive: true },
              { pair: 'USD/CHF', rate: '0.8650', change: '-0.02%', isPositive: false },
              { pair: 'NZD/USD', rate: '0.6120', change: '+0.18%', isPositive: true },
              { pair: 'EUR/GBP', rate: '0.8560', change: '+0.04%', isPositive: true },
              { pair: 'EUR/USD', rate: '1.0924', change: '+0.15%', isPositive: true },
              { pair: 'GBP/USD', rate: '1.2750', change: '-0.08%', isPositive: false },
              { pair: 'USD/JPY', rate: '148.3500', change: '+0.22%', isPositive: true },
              { pair: 'AUD/USD', rate: '0.6580', change: '+0.10%', isPositive: true },
            ].map((ticker, i) => (
              <div key={i} className="text-sm font-medium flex items-center gap-3">
                <span className="text-gray-200 font-bold">{ticker.pair}</span>
                <span className="text-gray-400">{ticker.rate}</span>
                <span className={ticker.isPositive ? 'text-green-400' : 'text-red-400'}>
                  {ticker.isPositive ? '↑' : '↓'} {ticker.change}
                </span>
              </div>
            ))}
            {[
              { pair: 'USD/CAD', rate: '1.3490', change: '+0.05%', isPositive: true },
              { pair: 'USD/CHF', rate: '0.8650', change: '-0.02%', isPositive: false },
              { pair: 'NZD/USD', rate: '0.6120', change: '+0.18%', isPositive: true },
              { pair: 'EUR/GBP', rate: '0.8560', change: '+0.04%', isPositive: true },
              { pair: 'EUR/USD', rate: '1.0924', change: '+0.15%', isPositive: true },
              { pair: 'GBP/USD', rate: '1.2750', change: '-0.08%', isPositive: false },
              { pair: 'USD/JPY', rate: '148.3500', change: '+0.22%', isPositive: true },
              { pair: 'AUD/USD', rate: '0.6580', change: '+0.10%', isPositive: true },
            ].map((ticker, i) => (
              <div key={`dup-${i}`} className="text-sm font-medium flex items-center gap-3">
                <span className="text-gray-200 font-bold">{ticker.pair}</span>
                <span className="text-gray-400">{ticker.rate}</span>
                <span className={ticker.isPositive ? 'text-green-400' : 'text-red-400'}>
                  {ticker.isPositive ? '↑' : '↓'} {ticker.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          {/* LEFT COLUMN - Description Content */}
          <div className="live-signals-header">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Real-Time <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Intelligence</span> For Modern Traders
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-8 sm:mb-10 leading-relaxed">
              Our advanced algorithms scan 50+ currency pairs 24/7 to identify high-probability trading opportunities. Stop guessing and start trading with precision.
            </p>

            {/* Features List */}
            <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12 feature-items">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                  <span className="text-gray-200 font-medium text-sm sm:text-base">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded font-bold text-sm sm:text-base hover:shadow-lg hover:shadow-green-500/50 transition-all">
                Start Free Trial
              </button>
              <button className="px-6 sm:px-8 py-2 sm:py-3 border border-cyan-500/50 text-cyan-400 rounded font-bold text-sm sm:text-base hover:bg-cyan-500/10 transition-all">
                Watch Demo
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN - Live Signals Card */}
          <div className="lg:sticky lg:top-28 live-signals-content">
            <div 
              className="w-full bg-gradient-to-br from-blue-950/40 to-slate-900/60 rounded-2xl border-2 border-transparent shadow-2xl overflow-hidden"
              style={{
                backgroundImage: 'linear-gradient(to right bottom, rgba(34, 197, 94, 0.2), rgba(34, 211, 238, 0.15))',
                borderImage: 'linear-gradient(135deg, #22c55e 0%, #06b6d4 100%) 1'
              }}
            >
              
              {/* Header */}
              <div className="p-4 sm:p-6 md:p-8 border-b border-slate-700/50">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 sm:mb-2">
                  Latest Signal
                </p>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Live Signals</h2>
                  <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-green-500/30 rounded-full border border-green-500/50">
                    <span className="text-xs font-bold text-green-300 whitespace-nowrap">Live Feed Active</span>
                  </div>
                </div>
              </div>

              {/* Signals List */}
              <div className="p-8 space-y-6">
                {signals.map((signal) => (
                  <div key={signal.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:border-cyan-500/30 transition-colors">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-700/60 rounded-lg">
                          {signal.icon === 'up' ? (
                            <TrendingUp className="w-6 h-6 text-green-400" />
                          ) : (
                            <TrendingDown className="w-6 h-6 text-red-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{signal.pair}</h3>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {signal.timeAgo}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${getStatusColor(signal.status)}`}>
                        {signal.status}
                      </span>
                    </div>

                    {/* Content */}
                    {!signal.isPremium && signal.entry ? (
                      <div>
                        {/* Entry, Take Profit, Stop Loss */}
                        <div className="grid grid-cols-3 gap-3 mb-5">
                          <div className="bg-slate-700/20 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1.5 font-semibold">Entry</p>
                            <p className="text-lg font-bold text-white">{signal.entry}</p>
                          </div>
                          <div className="bg-slate-700/20 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1.5 font-semibold">Take Profit</p>
                            <p className="text-lg font-bold text-green-400">{signal.takeProfit}</p>
                          </div>
                          <div className="bg-slate-700/20 rounded-lg p-3">
                            <p className="text-xs text-gray-400 mb-1.5 font-semibold">Stop Loss</p>
                            <p className="text-lg font-bold text-red-400">{signal.stopLoss}</p>
                          </div>
                        </div>

                        {/* Confidence Score */}
                        <div>
                          <div className="flex justify-between items-center mb-2.5">
                            <p className="text-xs font-semibold text-gray-300">Confidence Score</p>
                            <p className="text-xs font-bold text-cyan-400">{signal.confidence}%</p>
                          </div>
                          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                              style={{ width: `${signal.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ) : signal.isPremium ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Lock className="w-8 h-8 text-gray-500 mb-2" />
                        <p className="text-sm font-semibold text-gray-300 mb-1">
                          {signal.premiumText}
                        </p>
                        {signal.premiumSubtext && (
                          <p className="text-xs text-gray-400 mb-4">{signal.premiumSubtext}</p>
                        )}
                        <button className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded transition-all">
                          Unlock
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}