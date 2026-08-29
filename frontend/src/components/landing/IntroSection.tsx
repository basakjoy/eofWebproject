'use client';

import { ArrowUpRight, Play, ArrowRight, Activity } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Candlestick3DUptrend from './Candlestick3DUptrend';

const ASSETS = [
  {
    symbol: 'XAU',
    name: 'Gold',
    icon: '◈',
    color: 'yellow',
    allocation: '18.20%',
    change: '↑ 4.2%',
  },
  {
    symbol: 'EUR',
    name: 'Euro',
    icon: '€',
    color: 'blue',
    allocation: '9.80%',
    change: '↓ 1.1%',
    negative: true,
  },
  {
    symbol: 'USD',
    name: 'US Dollar',
    icon: '$',
    color: 'emerald',
    allocation: '12.35%',
    change: '↑ 0.6%',
  },
  {
    symbol: 'GBP',
    name: 'British Pound',
    icon: '£',
    color: 'rose',
    allocation: '6.75%',
    change: '↑ 1.8%',
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    icon: '₿',
    color: 'orange',
    allocation: '23.10%',
    change: '↑ 12.6%',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'Ξ',
    color: 'indigo',
    allocation: '13.65%',
    change: '↑ 37.8%',
  },
] as const;

const COLOR_MAP = {
  yellow: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    hoverBorder: 'hover:border-yellow-500/30',
    hoverBg: 'group-hover/card:bg-yellow-500/20',
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    hoverBorder: 'hover:border-blue-500/30',
    hoverBg: 'group-hover/card:bg-blue-500/20',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    hoverBorder: 'hover:border-emerald-500/30',
    hoverBg: 'group-hover/card:bg-emerald-500/20',
  },
  rose: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    hoverBorder: 'hover:border-rose-500/30',
    hoverBg: 'group-hover/card:bg-rose-500/20',
  },
  orange: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    hoverBorder: 'hover:border-orange-500/30',
    hoverBg: 'group-hover/card:bg-orange-500/20',
  },
  indigo: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    hoverBorder: 'hover:border-indigo-500/30',
    hoverBg: 'group-hover/card:bg-indigo-500/20',
  },
};

export default function IntroSection() {
  return (
    <section className="relative min-h-[720px] lg:min-h-screen flex items-center pt-28 sm:pt-32 pb-20 sm:pb-24 overflow-hidden bg-[#030305]">

      {/* ── 3D Three.js Fiery Candlestick Background Canvas & Ambient FX ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Full-width 3D Three.js Candlestick Uptrend Wave Canvas */}
        <div className="absolute inset-0 opacity-80 mix-blend-lighten">
          <Candlestick3DUptrend />
        </div>

        {/* Top-right fiery ambient radial glow */}
        <div className="absolute -top-32 right-[-15%] w-[800px] h-[800px] bg-gradient-to-br from-[#FF6B00]/20 via-[#FFb800]/10 to-transparent rounded-full blur-[120px] mix-blend-screen" />
        
        {/* Bottom-left subtle glow */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#FF3D00]/10 rounded-full blur-[150px] mix-blend-screen" />
        
        {/* Cinematic diagonal light beam overlay */}
        <div 
          className="absolute inset-0 opacity-30 mix-blend-overlay" 
          style={{
            backgroundImage: 'linear-gradient(115deg, transparent 30%, rgba(255, 150, 50, 0.15) 45%, rgba(255, 107, 0, 0.3) 50%, transparent 55%)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & CTA (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 space-y-7 sm:space-y-10 min-w-0"
          >
            <div className="space-y-6">
              {/* Top Pill Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-[0_0_15px_rgba(255,107,0,0.15)]"
              >
               
                
                
              </motion.div>

              {/* Main Headline */}
              <h1 className="text-4xl xs:text-5xl sm:text-7xl lg:text-[5.5rem] font-bold text-white leading-[1.05] tracking-tight">
                Conquering Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8C00] to-[#FFb800] pb-2 inline-block">
                  Trading Goals
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg max-w-lg leading-relaxed font-light">
              Customize your business journey effortlessly with Empire of Forex&apos;s dashboard, backed by a suite of powerful analytical tools at your fingertips.
            </p>

            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-5 pt-2 sm:pt-4">
              <Link
                href="/register"
                className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-zinc-100 text-black font-semibold text-sm rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.15)] overflow-hidden"
              >
                <span className="relative z-10">Get Started</span>
                <ArrowUpRight size={16} className="relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              
              <Link
                href="/about"
                className="group inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] hover:border-[#FF6B00]/30 text-white font-medium text-sm rounded-full transition-all duration-300 backdrop-blur-sm"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF6B00] to-[#FFb800] flex items-center justify-center shadow-[0_0_10px_rgba(255,107,0,0.4)]">
                  <Play size={10} className="fill-white translate-x-[1px]" />
                </div>
                <span>How it works</span>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Reference Glassmorphic Token Card (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
            className="lg:col-span-5 relative z-20 min-w-0 w-full max-w-xl mx-auto lg:max-w-none"
          >
            {/* Continuous floating animation wrapper */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative"
            >
              {/* Glassmorphic Card */}
              <div className="relative rounded-[2rem] bg-[#0A0A0F]/60 backdrop-blur-1 border border-white/[0.08] shadow-[0_30px_80px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] p-4 sm:p-6 lg:p-8 overflow-hidden group">
                
                {/* Subtle top-light gradient for glass edge reflection */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-7">
                  {/* Card Top Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                        <span className="text-sm">◎</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">Multi-Asset</h4>
                        <p className="text-[11px] text-zinc-500">Crypto &amp; Forex Portfolio</p>
                      </div>
                    </div>

                    <button className="px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-medium text-white hover:bg-white/[0.1] transition-colors">
                      Trade
                    </button>
                  </div>

                  {/* Main Balance Readout */}
                  <div className="space-y-1.5 pt-2">
                    <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Total Balance</p>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight font-mono min-w-0">
                        $893,475<span className="text-zinc-500">.20</span>
                      </h2>
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1">
                        <ArrowUpRight size={12} />
                        5.74%
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 font-mono pt-1">≈ 0.2498488 BTC</p>
                  </div>

                  {/* Asset Grid: Gold, EUR, USD, GBP, BTC, ETH */}
                  <div className="grid grid-cols-2 gap-3.5 pt-4">
                    {ASSETS.map((asset) => {
                      const c = COLOR_MAP[asset.color];
                      return (
                        <div
                          key={asset.symbol}
                          className={`min-w-0 p-3 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] ${c.hoverBorder} hover:bg-white/[0.04] transition-all group/card cursor-pointer`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-6 h-6 rounded-full ${c.bg} ${c.text} flex items-center justify-center text-[11px] font-bold ${c.hoverBg} transition-colors`}
                            >
                              {asset.icon}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-white truncate">{asset.name}</p>
                              <p className="text-[10px] text-zinc-500">{asset.symbol}</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-baseline pt-3">
                            <span className="text-sm font-bold text-white">{asset.allocation}</span>
                            <span
                              className={`text-[11px] font-medium ${
                                asset.change.startsWith('↓') ? 'text-rose-400' : 'text-emerald-400'
                              }`}
                            >
                              {asset.change}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}