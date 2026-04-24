'use client';
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, Lock, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LiveSignalsSection() {
  const [signals] = useState([
    {
      id: 1,
      pair: 'EUR/USD',
      icon: 'up',
      timeAgo: '10 mins ago',
      status: 'Active',
      entry: '1.0924',
      takeProfit: '1.0980',
      stopLoss: '1.0880',
      confidence: 88,
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
      premiumSubtext: 'Upgrade to view target zones',
    },
    {
      id: 3,
      pair: 'XAU/USD',
      icon: 'up',
      timeAgo: '1 hour ago',
      status: 'Pending',
      isPremium: true,
      premiumText: 'Elite Signal',
    },
  ]);

  const features = [
    { title: 'AI-Powered Analysis', desc: 'Neural networks scanning 50+ pairs 24/7' },
    { title: 'Institutional Flow', desc: 'Track where the big banks are moving' },
    { title: 'Verified Accuracy', desc: '84.2% historical win rate across all pairs' },
  ];

  return (
    <section className="py-24 bg-[#020817] overflow-hidden relative border-t border-white/5">
      {/* Background Decorative Rings */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] border-[2px] border-blue-500/5 rounded-full pointer-events-none" />
      <div className="absolute top-[-25%] left-[-15%] w-[80%] h-[80%] border-[2px] border-blue-500/5 rounded-full pointer-events-none" />

      {/* Currency Ticker */}
      <div className="bg-white/5 backdrop-blur-md border-y border-white/5 mb-10 sm:mb-20 overflow-hidden py-3">
        <div className="animate-marquee hover:pause whitespace-nowrap">
          <div className="flex gap-12 px-6">
            {[
              { pair: 'EUR/USD', rate: '1.0924', change: '+0.15%', isPositive: true },
              { pair: 'GBP/USD', rate: '1.2750', change: '-0.08%', isPositive: false },
              { pair: 'USD/JPY', rate: '148.35', change: '+0.22%', isPositive: true },
              { pair: 'XAU/USD', rate: '2024.50', change: '+1.10%', isPositive: true },
              { pair: 'BTC/USD', rate: '64,250', change: '+2.45%', isPositive: true },
              { pair: 'AUD/USD', rate: '0.6580', change: '+0.10%', isPositive: true },
            ].map((ticker, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <span className="text-gray-400">{ticker.pair}</span>
                <span className="text-white">{ticker.rate}</span>
                <span className={ticker.isPositive ? 'text-green-400' : 'text-red-400'}>
                 {ticker.change}
                </span>
              </div>
            ))}
          </div>
          {/* Duplicated for loop */}
          <div className="flex gap-12 px-6">
            {[
              { pair: 'EUR/USD', rate: '1.0924', change: '+0.15%', isPositive: true },
              { pair: 'GBP/USD', rate: '1.2750', change: '-0.08%', isPositive: false },
              { pair: 'USD/JPY', rate: '148.35', change: '+0.22%', isPositive: true },
              { pair: 'XAU/USD', rate: '2024.50', change: '+1.10%', isPositive: true },
              { pair: 'BTC/USD', rate: '64,250', change: '+2.45%', isPositive: true },
              { pair: 'AUD/USD', rate: '0.6580', change: '+0.10%', isPositive: true },
            ].map((ticker, i) => (
              <div key={`dup-${i}`} className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <span className="text-gray-400">{ticker.pair}</span>
                <span className="text-white">{ticker.rate}</span>
                <span className={ticker.isPositive ? 'text-green-400' : 'text-red-400'}>
                 {ticker.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Header Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 mb-6 justify-center lg:justify-start">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Global Intelligence Live</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight mb-8">
              Real-Time Signals <br />
              <span className="text-gray-500">for Modern Traders.</span>
            </h2>
            
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl mb-12 mx-auto lg:mx-0">
              Our advanced proprietary algorithms analyze over 50 currency pairs concurrently to identify high-probability trading opportunities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {features.map((feature, i) => (
                <div key={i} className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">{feature.title}</h4>
                  </div>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              ))}
            </div>

            <Link 
              href="/trading-signals"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95"
            >
              View All Live Signals
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Practical Live Signals Component */}
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="relative pt-10"
          >
            <div className="absolute inset-0 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative bg-[#0a0a1a] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.1)]">
              {/* Card Header */}
              <div className="p-6 sm:p-8 border-b border-white/5 bg-white/5 backdrop-blur-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                 <div className="text-center sm:text-left">
                   <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-1">Live Feed</span>
                   <h3 className="text-lg sm:text-xl font-bold text-white">Active Market Signals</h3>
                 </div>
                 <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#0a0a1a] bg-gray-800 flex items-center justify-center text-[10px] font-bold text-white`}>
                        <img className="rounded-full" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="Avatar" />
                     </div>
                   ))}
                   <div className="w-8 h-8 rounded-full border-2 border-[#0a0a1a] bg-blue-600 flex items-center justify-center text-[8px] font-black text-white">+1k</div>
                 </div>
              </div>

              {/* Signals Content */}
              <div className="p-4 space-y-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto scrollbar-hide md:custom-scrollbar">
                {signals.map((signal) => (
                  <motion.div 
                    key={signal.id} 
                    whileHover={{ x: 5 }}
                    className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${signal.icon === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {signal.icon === 'up' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                        </div>
                        <div>
                          <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">{signal.pair}</h4>
                          <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1 mt-0.5">
                            <Clock size={10} /> {signal.timeAgo}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${
                        signal.status === 'Active' ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-800 text-gray-500'
                      }`}>
                        {signal.status}
                      </span>
                    </div>

                    {!signal.isPremium ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                        <div className="bg-[#020817] p-2 sm:p-3 rounded-xl border border-white/5">
                           <span className="text-[8px] font-black text-gray-500 uppercase block mb-1">Entry</span>
                           <span className="text-xs sm:text-sm font-bold text-white">{signal.entry}</span>
                        </div>
                        <div className="bg-[#020817] p-2 sm:p-3 rounded-xl border border-white/5">
                           <span className="text-[8px] font-black text-gray-500 uppercase block mb-1">TP</span>
                           <span className="text-xs sm:text-sm font-bold text-green-400">{signal.takeProfit}</span>
                        </div>
                        <div className="bg-[#020817] p-2 sm:p-3 rounded-xl border border-white/5 col-span-2 sm:col-span-1">
                           <span className="text-[8px] font-black text-gray-500 uppercase block mb-1">Confidence</span>
                           <span className="text-xs sm:text-sm font-bold text-blue-400">{signal.confidence}%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 sm:py-6 flex flex-col items-center justify-center bg-gray-900/40 rounded-xl border border-dashed border-white/10 text-center px-4">
                        <Lock size={16} className="text-gray-600 mb-2" />
                        <span className="text-[10px] sm:text-xs font-bold text-gray-400">{signal.premiumSubtext || 'View Entry & TP'}</span>
                        <Link href="/register" className="mt-2 text-[9px] sm:text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors">Upgrade Now &rarr;</Link>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Bottom Decoration */}
              <div className="p-4 bg-blue-600/10 flex justify-center">
                 <div className="flex gap-1">
                   {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />)}
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}