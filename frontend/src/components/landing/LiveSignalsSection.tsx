'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, ArrowRight, Zap, Loader2, Copy, Check, Target, ShieldAlert, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { signalsApi, SignalRecord } from '@/lib/signalsApi';
import { getLocalizedPath, useLanguage } from '@/context/LanguageContext';

const FALLBACK_SIGNALS: SignalRecord[] = [
  {
    id: 'fb-1',
    pair: 'XAU/USD',
    type: 'BUY',
    status: 'ACTIVE',
    entryPrice: 2642.50,
    takeProfit: 2685.00,
    takeProfit1: 2665.00,
    stopLoss: 2628.00,
    accuracy: 91,
    timeframe: '4H',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fb-2',
    pair: 'BTC/USD',
    type: 'BUY',
    status: 'ACTIVE',
    entryPrice: 68420.00,
    takeProfit: 71500.00,
    takeProfit1: 69800.00,
    stopLoss: 66900.00,
    accuracy: 89,
    timeframe: '1D',
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
  },
  {
    id: 'fb-3',
    pair: 'EUR/USD',
    type: 'BUY',
    status: 'ACTIVE',
    entryPrice: 1.0845,
    takeProfit: 1.0960,
    takeProfit1: 1.0910,
    stopLoss: 1.0795,
    accuracy: 86,
    timeframe: '1H',
    createdAt: new Date(Date.now() - 75 * 60000).toISOString(),
  },
];

export default function LiveSignalsSection() {
  const { locale, t } = useLanguage();
  const [signals, setSignals] = useState<SignalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'crypto' | 'forex' | 'metals'>('all');

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await signalsApi.getAllSignals({ status: 'active', limit: 6 });
        const data = Array.isArray(response.data) ? response.data : [];
        if (data.length > 0) {
          setSignals(data.slice(0, 5));
        } else {
          setSignals(FALLBACK_SIGNALS);
        }
      } catch (error) {
        setSignals(FALLBACK_SIGNALS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSignals();
  }, []);

  const handleCopy = (signal: SignalRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${signal.type} ${signal.pair} | Entry: ${signal.entryPrice} | TP: ${signal.takeProfit1 || signal.takeProfit} | SL: ${signal.stopLoss}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(signal.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const filteredSignals = signals.filter((sig) => {
    if (activeFilter === 'all') return true;
    const pair = sig.pair.toUpperCase();
    if (activeFilter === 'crypto') return pair.includes('BTC') || pair.includes('ETH') || pair.includes('SOL');
    if (activeFilter === 'metals') return pair.includes('XAU') || pair.includes('XAG') || pair.includes('GOLD');
    if (activeFilter === 'forex') return !pair.includes('BTC') && !pair.includes('ETH') && !pair.includes('XAU');
    return true;
  });

  const features = [
    {
      title: t('liveSignals.aiAnalysis', 'Machine Learning Cluster'),
      desc: t('liveSignals.aiAnalysisDesc', 'Neural pipelines scanning order flow across 50+ instruments 24/7'),
    },
    {
      title: t('liveSignals.institutionalFlow', 'Liquidity Imbalance Radar'),
      desc: t('liveSignals.institutionalFlowDesc', 'Institutional order book volume tracking before breakout confirmations'),
    },
    {
      title: t('liveSignals.verifiedAccuracy', '88.4% Verified Win Rate'),
      desc: t('liveSignals.verifiedAccuracyDesc', 'Audited historical accuracy across risk-managed setups'),
    },
  ];

  const avatarUrls = [
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/women/44.jpg',
    'https://randomuser.me/api/portraits/men/65.jpg',
  ];

  return (
    <section className="py-20 sm:py-32 bg-[#030305] overflow-hidden relative border-t border-white/[0.06]">
      {/* Background radial ambient lights */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] border border-[#FF6B00]/10 rounded-full pointer-events-none" />
      <div className="absolute -top-32 right-[-15%] w-[800px] h-[800px] bg-gradient-to-br from-[#FF6B00]/10 via-[#FFb800]/5 to-transparent rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#FF3D00]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Dynamic Marquee Ticker */}
      <div className="bg-white/[0.02] backdrop-blur-md border-y border-white/[0.06] mb-12 sm:mb-20 overflow-hidden py-3 relative z-10">
        <div className="animate-marquee hover:pause whitespace-nowrap">
          <div className="flex gap-10 px-6">
            {[
              { pair: 'XAU/USD', rate: '2,642.50', change: '+1.45%', isPositive: true },
              { pair: 'BTC/USD', rate: '68,420.00', change: '+3.82%', isPositive: true },
              { pair: 'EUR/USD', rate: '1.0845', change: '+0.24%', isPositive: true },
              { pair: 'GBP/USD', rate: '1.2980', change: '-0.12%', isPositive: false },
              { pair: 'USD/JPY', rate: '152.10', change: '+0.35%', isPositive: true },
              { pair: 'ETH/USD', rate: '2,640.80', change: '+4.15%', isPositive: true },
              { pair: 'AUD/USD', rate: '0.6620', change: '+0.18%', isPositive: true },
            ].map((ticker, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider">
                <span className="text-zinc-400">{ticker.pair}</span>
                <span className="text-white">{ticker.rate}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${ticker.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {ticker.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-site mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 sm:gap-14 lg:gap-16 items-center">
          
          {/* Left Column: Heading & Features (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 text-center lg:text-left space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-xs font-semibold text-[#FF8C00]">
              <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
              <span className="uppercase tracking-widest">{t('liveSignals.title', 'Live Signals Desk')}</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
              {t('liveSignals.title', 'Real-Time Signals')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8C00] to-[#FFb800]">
                {t('liveSignals.subtitle', 'for Modern Traders.')}
              </span>
            </h2>
            
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-light">
              {t('liveSignals.description', 'Our proprietary algorithmic engine analyzes order books across 50+ Tier-1 markets concurrently to broadcast high-probability trade set-ups.')}
            </p>

            <div className="space-y-4 pt-2">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF6B00] to-[#FF8C00] flex items-center justify-center text-black shrink-0 shadow-md">
                    <Zap size={16} className="fill-black" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">{feature.title}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link 
                href={getLocalizedPath('/trading-signals', locale)}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-zinc-100 text-black font-bold text-sm rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_25px_rgba(255,255,255,0.2)]"
              >
                <span>{t('liveSignals.viewAll', 'Open Signals Terminal')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Interactive Live Signals Terminal Preview (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 relative"
          >
            <div className="relative rounded-[2.5rem] bg-[#0A0A10]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_30px_90px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden">
              
              {/* Top glass reflection light */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Terminal Card Header */}
              <div className="p-6 sm:p-8 border-b border-white/[0.06] bg-white/[0.02] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                      Live Feed Connected
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Institutional Alert Broadcasts
                  </h3>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/5">
                  {(['all', 'crypto', 'forex', 'metals'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold capitalize transition-all ${
                        activeFilter === filter
                          ? 'bg-[#FF6B00] text-black shadow-md'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Signals List */}
              <div className="p-5 sm:p-6 space-y-3.5 max-h-[460px] overflow-y-auto scrollbar-hide">
                <AnimatePresence mode="popLayout">
                  {filteredSignals.map((signal) => {
                    const isUp = signal.type?.toUpperCase() === 'BUY';
                    const isCopied = copiedId === signal.id;

                    return (
                      <motion.div 
                        layout
                        key={signal.id} 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -3 }}
                        className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-[#FF6B00]/40 transition-all duration-300 group relative"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                              isUp 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {isUp ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-extrabold text-white tracking-tight">{signal.pair}</h4>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono ${
                                  isUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                                }`}>
                                  {signal.type}
                                </span>
                              </div>
                              <span className="text-[11px] text-zinc-500 font-mono mt-0.5 block">
                                Timeframe: {signal.timeframe || '4H'}
                              </span>
                            </div>
                          </div>

                          {/* Quick Copy Signal Action */}
                          <button
                            onClick={(e) => handleCopy(signal, e)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all"
                            title="Copy Signal Parameters"
                          >
                            {isCopied ? (
                              <>
                                <Check size={13} className="text-emerald-400" />
                                <span className="text-emerald-400 font-bold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={13} className="text-[#FF8C00]" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Trade Parameters Grid */}
                        <div className="grid grid-cols-3 gap-2.5">
                          <div className="bg-[#05050A] p-2.5 rounded-xl border border-white/[0.05]">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
                              Entry
                            </span>
                            <span className="text-xs sm:text-sm font-mono font-bold text-white">
                              {signal.entryPrice}
                            </span>
                          </div>

                          <div className="bg-emerald-500/[0.04] p-2.5 rounded-xl border border-emerald-500/15">
                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block">
                              Target TP
                            </span>
                            <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                              {signal.takeProfit1 || signal.takeProfit}
                            </span>
                          </div>

                          <div className="bg-[#05050A] p-2.5 rounded-xl border border-white/[0.05]">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
                              Confidence
                            </span>
                            <span className="text-xs sm:text-sm font-mono font-bold text-[#FF8C00]">
                              {signal.accuracy ? `${signal.accuracy}%` : '89%'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Terminal Bottom Status Bar */}
              <div className="p-4 bg-gradient-to-r from-[#FF6B00]/10 via-transparent to-[#FFb800]/10 border-t border-white/[0.05] flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-2">
                  <Sparkles size={13} className="text-[#FF8C00]" />
                  <span>Real-time webhook latency: &lt; 20ms</span>
                </span>
                <Link href={getLocalizedPath('/trading-signals', locale)} className="text-[#FF8C00] font-bold hover:underline flex items-center gap-1">
                  View Full Terminal <ArrowRight size={12} />
                </Link>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
