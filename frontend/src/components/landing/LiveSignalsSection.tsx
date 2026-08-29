'use client';
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, Lock, ArrowRight, Zap, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { signalsApi, SignalRecord }  from '@/lib/signalsApi';

export default function LiveSignalsSection() {
  const [signals, setSignals] = useState<SignalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await signalsApi.getAllSignals({ status: 'active', limit: 3 });
        const data = Array.isArray(response.data) ? response.data : [];
        setSignals(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch live signals:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSignals();
  }, []);

  const features = [
    { title: 'AI-Powered Analysis', desc: 'Neural networks scanning 50+ pairs 24/7' },
    { title: 'Institutional Flow', desc: 'Track where the big banks are moving' },
    { title: 'Verified Accuracy', desc: '84.2% historical win rate across all pairs' },
  ];

  // Real photo avatars for the "Live Feed" header cluster
  const avatarUrls = [
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://randomuser.me/api/portraits/men/65.jpg',
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#030305] overflow-hidden relative border-t border-white/[0.05]">
      {/* Background Decorative Rings */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] border-[2px] border-[#FF6B00]/5 rounded-full pointer-events-none" />
      <div className="absolute top-[-25%] left-[-15%] w-[80%] h-[80%] border-[2px] border-[#FF6B00]/5 rounded-full pointer-events-none" />

      {/* Ambient fiery glow accents, matching IntroSection */}
      <div className="absolute -top-32 right-[-15%] w-[800px] h-[800px] bg-gradient-to-br from-[#FF6B00]/10 via-[#FFb800]/5 to-transparent rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#FF3D00]/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      {/* Currency Ticker */}
      <div className="bg-white/[0.03] backdrop-blur-md border-y border-white/[0.05] mb-10 sm:mb-20 overflow-hidden py-3 relative z-10">
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
                <span className="text-zinc-400">{ticker.pair}</span>
                <span className="text-white">{ticker.rate}</span>
                <span className={ticker.isPositive ? 'text-emerald-400' : 'text-red-400'}>
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
                <span className="text-zinc-400">{ticker.pair}</span>
                <span className="text-white">{ticker.rate}</span>
                <span className={ticker.isPositive ? 'text-emerald-400' : 'text-red-400'}>
                 {ticker.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center">
          {/* Header Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            {/* <div className="inline-flex items-center gap-2 mb-6 justify-center lg:justify-start">
              <div className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
              <span className="text-xs font-black text-[#FF8C00] uppercase tracking-widest">Global Intelligence Live</span>
            </div> */}
            
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight mb-6 sm:mb-8">
              Real-Time Signals <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8C00] to-[#FFb800]">for Modern Traders.</span>
            </h2>
            
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl mb-8 sm:mb-12 mx-auto lg:mx-0 font-light">
              Our advanced proprietary algorithms analyze over 50 currency pairs concurrently to identify high-probability trading opportunities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-8 sm:mb-12">
              {features.map((feature, i) => (
                <div key={i} className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Zap className="w-4 h-4 text-base" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">{feature.title}</h4>
                  </div>
                  <p className="text-xs text-zinc-500">{feature.desc}</p>
                </div>
              ))}
            </div>

            <Link 
              href="/trading-signals"
              className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-zinc-100 text-black font-semibold text-sm rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              View All Live Signals
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>

          {/* Practical Live Signals Component */}
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="relative pt-4 sm:pt-10 min-w-0"
          >
            <div className="absolute inset-0 bg-[#FF6B00]/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative rounded-[2rem] backdrop-blur-2xl border border-white/[0.08] shadow-[0_30px_80px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden group">

              {/* Subtle top-light gradient for glass edge reflection, matching IntroSection card */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

              {/* Card Header */}
              <div className="relative z-10 p-6 sm:p-8 border-b border-white/[0.05] bg-white/[0.03] backdrop-blur-xl flex flex-col sm:flex-row justify-between items-center gap-4">
                 <div className="text-center sm:text-left">
                   <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-1">Live Feed</span>
                   <h3 className="text-lg sm:text-xl font-bold text-white">Active Market Signals</h3>
                 </div>
                 <div className="flex -space-x-2">
                   {avatarUrls.map((src, i) => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A0A0F] overflow-hidden">
                        <img className="w-full h-full object-cover" src={src} alt="Trader avatar" />
                     </div>
                   ))}
                   <div className="w-8 h-8 rounded-full border-2 border-[#0A0A0F] bg-gradient-to-tr from-[#FF6B00] to-[#FFb800] flex items-center justify-center text-[8px] font-black text-white shadow-[0_0_10px_rgba(255,107,0,0.4)]">+1k</div>
                 </div>
              </div>

              {/* Signals Content */}
              <div className="relative z-10 p-4 space-y-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto scrollbar-hide md:custom-scrollbar">
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-8 h-8 text-[#FF8C00] animate-spin" />
                  </div>
                ) : signals.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500 text-sm font-medium">
                    No active signals right now.
                  </div>
                ) : signals.map((signal) => {
                  const date = new Date(signal.createdAt || Date.now());
                  const now = new Date();
                  const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
                  let timeAgo = `${diffMins} mins ago`;
                  if (diffMins > 60) timeAgo = `${Math.floor(diffMins / 60)} hours ago`;
                  if (diffMins > 1440) timeAgo = `${Math.floor(diffMins / 1440)} days ago`;

                  const isUp = signal.type?.toUpperCase() === 'BUY';

                  return (
                  <motion.div 
                    key={signal.id} 
                    whileHover={{ x: 5 }}
                    className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-[#FF6B00]/30 hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {isUp ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                        </div>
                        <div>
                          <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">{signal.pair}</h4>
                          <span className="text-[10px] text-zinc-500 font-bold flex items-center gap-1 mt-0.5">
                            <Clock size={10} /> {timeAgo}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${
                        signal.status?.toLowerCase() === 'active' ? 'bg-[#FF6B00]/15 text-[#FF8C00]' : 'bg-white/5 text-zinc-500'
                      }`}>
                        {signal.status || 'Active'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      <div className="bg-[#030305] p-2 sm:p-3 rounded-xl border border-white/[0.05]">
                         <span className="text-[8px] font-black text-zinc-500 uppercase block mb-1">Entry</span>
                         <span className="text-xs sm:text-sm font-bold text-white">{signal.entryPrice}</span>
                      </div>
                      <div className="bg-[#030305] p-2 sm:p-3 rounded-xl border border-white/[0.05]">
                         <span className="text-[8px] font-black text-zinc-500 uppercase block mb-1">TP</span>
                         <span className="text-xs sm:text-sm font-bold text-emerald-400">{signal.takeProfit || signal.takeProfit1}</span>
                      </div>
                      <div className="bg-[#030305] p-2 sm:p-3 rounded-xl border border-white/[0.05] col-span-2 sm:col-span-1">
                         <span className="text-[8px] font-black text-zinc-500 uppercase block mb-1">Confidence</span>
                         <span className="text-xs sm:text-sm font-bold text-[#FF8C00]">{signal.accuracy?.toString().includes('%') ? signal.accuracy : `${(parseFloat(String(signal.accuracy ?? '85')) * (signal.accuracy?.toString().includes('.') ? 100 : 1)).toFixed(0)}%`}</span>
                      </div>
                    </div>
                  </motion.div>
                )})}
              </div>

              {/* Bottom Decoration */}
              <div className="relative z-10 p-4 bg-gradient-to-r from-[#FF6B00]/10 via-[#FF8C00]/10 to-[#FFb800]/10 flex justify-center">
                 <div className="flex gap-1">
                   {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#FF8C00]/40" />)}
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}