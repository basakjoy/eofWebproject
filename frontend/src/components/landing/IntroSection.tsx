'use client';

import { useRef, useState, useEffect } from 'react';
import { ArrowUpRight, Play, Activity, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { getLocalizedPath, useLanguage } from '@/context/LanguageContext';

const INTRO_BG_IMAGE = '/images/intro-background.jpg';

const CHART_DATA = {
  '1H': {
    line: 'M 0,70 C 40,72 70,58 110,54 C 150,50 180,60 220,40 C 260,24 300,34 340,18 C 365,10 380,12 392,6',
    area: 'M 0,70 C 40,72 70,58 110,54 C 150,50 180,60 220,40 C 260,24 300,34 340,18 C 365,10 380,12 392,6 L 392,90 L 0,90 Z',
    peakX: 392,
    peakY: 6,
    pct: '+2.41%',
    high: '893.5K',
  },
  '24H': {
    line: 'M 0,76 C 35,78 65,66 100,60 C 135,54 165,64 200,46 C 235,30 270,38 305,22 C 340,11 370,16 392,7',
    area: 'M 0,76 C 35,78 65,66 100,60 C 135,54 165,64 200,46 C 235,30 270,38 305,22 C 340,11 370,16 392,7 L 392,90 L 0,90 Z',
    peakX: 392,
    peakY: 7,
    pct: '+5.74%',
    high: '893.9K',
  },
  '7D': {
    line: 'M 0,80 C 30,84 60,68 95,70 C 130,74 160,52 195,44 C 230,36 260,50 295,26 C 330,10 365,18 392,5',
    area: 'M 0,80 C 30,84 60,68 95,70 C 130,74 160,52 195,44 C 230,36 260,50 295,26 C 330,10 365,18 392,5 L 392,90 L 0,90 Z',
    peakX: 392,
    peakY: 5,
    pct: '+18.9%',
    high: '894.2K',
  },
  '1M': {
    line: 'M 0,84 C 45,86 85,80 125,72 C 165,64 205,54 245,38 C 285,22 325,20 365,10 C 378,6 386,7 392,4',
    area: 'M 0,84 C 45,86 85,80 125,72 C 165,64 205,54 245,38 C 285,22 325,20 365,10 C 378,6 386,7 392,4 L 392,90 L 0,90 Z',
    peakX: 392,
    peakY: 4,
    pct: '+42.6%',
    high: '894.8K',
  },
} as const;

type TimeframeOption = keyof typeof CHART_DATA;

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
} as const;

type AssetColor = keyof typeof COLOR_MAP;

interface AssetItem {
  symbol: string;
  name: string;
  icon: string;
  color: AssetColor;
  allocation: string;
  change: string;
  negative?: boolean;
}

const INITIAL_ASSETS: AssetItem[] = [
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
];

export default function IntroSection() {
  const { locale, t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  // Live increasing balance & portfolio ticker state to drive client engagement
  const [balance, setBalance] = useState(893475.20);
  const [todayProfit, setTodayProfit] = useState(4892.40);
  const [recentGain, setRecentGain] = useState<number | null>(null);
  const [gainKey, setGainKey] = useState(0);
  const [isTick, setIsTick] = useState(false);
  const [activeAssetSymbol, setActiveAssetSymbol] = useState<string | null>(null);
  const [assets, setAssets] = useState<AssetItem[]>(INITIAL_ASSETS);
  const [timeframe, setTimeframe] = useState<TimeframeOption>('24H');

  useEffect(() => {
    const interval = setInterval(() => {
      // Dynamic realistic profit increment between $3.20 and $24.80
      const gain = +(Math.random() * 21.6 + 3.2).toFixed(2);

      setBalance((prev) => +(prev + gain).toFixed(2));
      setTodayProfit((prev) => +(prev + gain).toFixed(2));
      setRecentGain(gain);
      setGainKey((k) => k + 1);
      setIsTick(true);

      // Periodically tick an asset's percentage with a micro-pulse
      if (Math.random() > 0.35) {
        setAssets((prev) => {
          const targetIdx = Math.floor(Math.random() * prev.length);
          const chosen = prev[targetIdx];
          setActiveAssetSymbol(chosen.symbol);

          return prev.map((asset, i) => {
            if (i !== targetIdx) return asset;
            const delta = +(Math.random() * 0.3 + 0.1).toFixed(1);
            const isNegative = asset.change.startsWith('↓');
            const numericVal = parseFloat(asset.change.replace(/[^0-9.]/g, ''));
            const updatedVal = isNegative 
              ? Math.max(0.1, +(numericVal - delta)).toFixed(1)
              : +(numericVal + delta).toFixed(1);

            return {
              ...asset,
              change: isNegative ? `↓ ${updatedVal}%` : `↑ ${updatedVal}%`,
            };
          });
        });
      }

      const timeoutId = setTimeout(() => {
        setIsTick(false);
        setActiveAssetSymbol(null);
      }, 750);

      return () => clearTimeout(timeoutId);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  const intPart = Math.floor(balance).toLocaleString('en-US');
  const decPart = (balance % 1).toFixed(2).slice(1);
  const btcValue = (balance / 68450).toFixed(6);

  // 1. Scroll-driven parallax progress across the hero section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Ambient glows move at contrasting rates for layered atmospheric depth
  const glow1ScrollY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const glow2ScrollY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);

  // Foreground content scroll offset & subtle fade
  const contentScrollY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);

  // 2. Interactive mouse parallax for desktop cursor depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Ambient glows drift smoothly
  const glowMouseX = useTransform(smoothMouseX, [-0.5, 0.5], ['-25px', '25px']);
  const glowMouseY = useTransform(smoothMouseY, [-0.5, 0.5], ['-25px', '25px']);

  // 3D perspective tilt for the showcase card
  const cardRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [6, -6]);
  const cardRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[720px] lg:min-h-screen flex items-center pt-28 sm:pt-32 pb-20 sm:pb-24 overflow-hidden "
    >

      {/* ── Intro Section Background Image & Parallax FX ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={INTRO_BG_IMAGE}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Subtle atmospheric glows to complement the cosmic background image */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(167,139,250,0.24),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(139,92,246,0.12),_transparent_30%)]" />

        <motion.div
          style={{
            y: glow1ScrollY,
            x: glowMouseX,
          }}
          className="absolute -top-32 right-[-15%] w-[800px] h-[800px] bg-gradient-to-br from-[#C4B5FD]/20 via-[#8B5CF6]/10 to-transparent rounded-full blur-[120px] mix-blend-screen will-change-transform"
        />
        
        <motion.div
          style={{
            y: glow2ScrollY,
            x: glowMouseY,
          }}
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#A78BFA]/10 rounded-full blur-[150px] mix-blend-screen will-change-transform"
        />
      </div>

      <motion.div 
        style={{
          y: contentScrollY,
          opacity: contentOpacity,
        }}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
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
                className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-[40.798px] bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-[0_0_15px_rgba(255,107,0,0.15)]"
              >
                <Activity className="w-4 h-4 text-[#FF6B00] animate-pulse" />
                <span
                  className="text-[10px] uppercase tracking-[0.16em] text-zinc-300"
                  style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
                >
                  {t('hero.badge', 'Institutional Trading Signals & Market Intelligence')}
                </span>
              </motion.div>

              {/* Main Headline */}
              <h1
                className="text-[3.25rem] sm:text-[4.5rem] lg:text-[6rem] font-normal text-white leading-[1] tracking-[-0.03em]"
                style={{ fontFamily: 'Inter, Satoshi, "General Sans", sans-serif', fontWeight: 400 }}
              >
                {t('hero.title', 'Conquering Your')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8C00] to-[#FFb800] inline-block">
                  {t('hero.titleHighlight', 'Trading Goals')}
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg max-w-lg leading-relaxed font-light text-zinc-100" style={{ fontFamily: 'Inter, Satoshi, sans-serif', letterSpacing: '-0.01em' }}>
              {t(
                'hero.description',
                "Customize your business journey effortlessly with Empire of Forex's dashboard, backed by a suite of powerful analytical tools at your fingertips."
              )}
            </p>

            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Link
                href="/register"
                className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-zinc-100 text-black font-medium text-sm rounded-[40.798px] transition-all duration-300 hover:translate-y-[-1px] active:translate-y-[0] shadow-[0_0_20px_rgba(255,255,255,0.15)] overflow-hidden"
                style={{ fontFamily: 'Inter, Satoshi, sans-serif', letterSpacing: '-0.01em' }}
              >
                <span className="relative z-10">{t('hero.getStarted', 'Get Started Free')}</span>
                <ArrowUpRight size={16} className="relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              
              <Link
                href={getLocalizedPath('/trading-signals', locale)}
                className="group inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] hover:border-[#FF6B00]/30 text-white font-medium text-sm rounded-[40.798px] transition-all duration-300 backdrop-blur-sm"
                style={{ fontFamily: 'Inter, Satoshi, sans-serif', letterSpacing: '-0.01em' }}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF6B00] to-[#FFb800] flex items-center justify-center shadow-[0_0_10px_rgba(255,107,0,0.4)]">
                  <Play size={10} className="fill-white translate-x-[1px]" />
                </div>
                <span>{t('hero.exploreSignals', 'Explore Signals')}</span>
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
            {/* Continuous floating animation wrapper with 3D tilt */}
            <motion.div
              style={{
                rotateX: cardRotateX,
                rotateY: cardRotateY,
                transformPerspective: 1000,
              }}
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
                      <div className="relative w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                        <span className="text-sm">◎</span>
                        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-white" style={{ fontFamily: 'Inter, Satoshi, sans-serif', letterSpacing: '-0.01em' }}>Multi-Asset</h4>
                          <span
                            className="px-1.5 py-0.5 rounded-[8px] text-[9px] font-medium uppercase tracking-[0.16em] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1"
                            style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing: '0.06em' }}>Institutional Yield Desk</p>
                      </div>
                    </div>

                    <Link
                      href="/register"
                      className="group/btn relative px-4 py-1.5 rounded-[40.798px] bg-gradient-to-r from-[#FF6B00] to-[#FFb800] text-black text-[10px] font-medium uppercase tracking-[0.06em] shadow-[0_0_15px_rgba(255,107,0,0.3)] hover:scale-105 active:scale-95 transition-all overflow-hidden flex items-center gap-1"
                      style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
                    >
                      <span className="relative z-10">Trade</span>
                      <ArrowUpRight size={13} className="relative z-10 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>

                  {/* Main Balance Readout with Live Increasing Ticker */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <p
                        className="text-[10px] text-zinc-400 font-medium uppercase tracking-[0.16em] flex items-center gap-1.5"
                        style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
                      >
                        <Activity size={13} className="text-[#FF6B00] animate-pulse" />
                        Total Balance
                      </p>

                      {/* Floating Micro-Gain Pill */}
                      <div className="h-5 flex items-center">
                        <AnimatePresence mode="wait">
                          {recentGain && (
                            <motion.span
                              key={gainKey}
                              initial={{ opacity: 0, y: 5, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.3 }}
                              className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold shadow-[0_0_10px_rgba(16,185,129,0.25)] flex items-center gap-1"
                            >
                              <Sparkles size={10} className="animate-spin text-emerald-300" />
                              +${recentGain.toFixed(2)}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h2 
                        className={`text-[2rem] sm:text-[2.5rem] font-normal min-w-0 transition-all duration-300 ${
                          isTick ? 'text-emerald-300 scale-[1.01] drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]' : 'text-white'
                        }`}
                        style={{ fontFamily: 'Inter, Satoshi, "General Sans", sans-serif', letterSpacing: '-0.03em', lineHeight: 1 }}
                      >
                        ${intPart}<span className="text-zinc-500">{decPart}</span>
                      </h2>
                      <span
                        className="px-2.5 py-1 rounded-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium uppercase tracking-[0.12em] flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                        style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
                      >
                        <ArrowUpRight size={12} className="animate-bounce" />
                        +5.74%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-0.5" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                      <p className="text-zinc-400">≈ {btcValue} BTC</p>
                      <p className="text-[11px] text-emerald-400/90 font-medium">
                        Today: +${todayProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Growing Uptrend Area Chart */}
                  <div className="pt-1 pb-1 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 font-medium text-zinc-300" style={{ fontFamily: 'Inter, Satoshi, sans-serif', letterSpacing: '-0.01em' }}>
                        <TrendingUp size={13} className="text-emerald-400" />
                        <span>Growth Trajectory</span>
                        <span
                          className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-[8px] border border-emerald-500/20"
                          style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing: '0.06em' }}
                        >
                          {CHART_DATA[timeframe].pct}
                        </span>
                      </div>

                      {/* Interactive Timeframe Pill Filter */}
                      <div className="flex items-center gap-1 p-0.5 rounded-[8px] bg-white/[0.04] border border-white/[0.06]">
                        {(['1H', '24H', '7D', '1M'] as const).map((tf) => (
                          <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-2 py-0.5 rounded-[8px] text-[10px] font-medium transition-all ${
                              timeframe === tf
                                ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                                : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                            }`}
                            style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing: '0.08em' }}
                          >
                            {tf}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* SVG Upward Growing Area Chart */}
                    <div className="relative w-full h-20 sm:h-24 rounded-xl bg-gradient-to-b from-emerald-500/[0.04] via-transparent to-transparent border border-emerald-500/10 p-1.5 overflow-hidden group/chart">
                      {/* Grid background lines */}
                      <div className="absolute inset-x-0 top-1/3 border-b border-white/[0.04] border-dashed pointer-events-none" />
                      <div className="absolute inset-x-0 top-2/3 border-b border-white/[0.04] border-dashed pointer-events-none" />

                      <svg
                        viewBox="0 0 400 90"
                        className="w-full h-full overflow-visible"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                            <stop offset="60%" stopColor="#10B981" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="chartLineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#FF6B00" />
                            <stop offset="45%" stopColor="#FFb800" />
                            <stop offset="100%" stopColor="#34D399" />
                          </linearGradient>
                          <filter id="chartGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#10B981" floodOpacity="0.7"/>
                          </filter>
                        </defs>

                        {/* Area gradient fill under the line */}
                        <motion.path
                          key={`area-${timeframe}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.6 }}
                          d={CHART_DATA[timeframe].area}
                          fill="url(#chartAreaGradient)"
                        />

                        {/* Animated Growing Uptrend Stroke Line */}
                        <motion.path
                          key={`line-${timeframe}`}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          d={CHART_DATA[timeframe].line}
                          fill="none"
                          stroke="url(#chartLineGradient)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          filter="url(#chartGlowFilter)"
                        />

                        {/* Live Peak Pulsing Beacon at the tip */}
                        <g transform={`translate(${CHART_DATA[timeframe].peakX}, ${CHART_DATA[timeframe].peakY})`}>
                          <circle r="9" fill="none" stroke="#34D399" strokeWidth="1.5" className="animate-ping opacity-75" />
                          <circle r="5" fill="#10B981" opacity="0.4" />
                          <circle r="3.5" fill="#34D399" stroke="#ffffff" strokeWidth="1.5" />
                        </g>
                      </svg>

                      {/* Floating Peak Callout */}
                      <div className="absolute top-2 right-3 pointer-events-none flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md border border-emerald-500/30 text-[9px] font-mono font-bold text-emerald-400 shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>ATH ${CHART_DATA[timeframe].high}</span>
                      </div>
                    </div>
                  </div>

                  {/* Asset Grid: Gold, EUR, USD, GBP, BTC, ETH */}
                  <div className="grid grid-cols-2 gap-3.5 pt-4">
                    {assets.map((asset) => {
                      const c = COLOR_MAP[asset.color as keyof typeof COLOR_MAP];
                      const isTargeted = activeAssetSymbol === asset.symbol;
                      return (
                        <div
                          key={asset.symbol}
                          className={`min-w-0 p-3 sm:p-4 rounded-2xl bg-white/[0.02] border transition-all duration-300 group/card cursor-pointer ${
                            isTargeted
                              ? 'border-emerald-500/60 bg-emerald-500/10 scale-[1.03] shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                              : `border-white/[0.05] ${c.hoverBorder} hover:bg-white/[0.04] hover:scale-[1.02]`
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-6 h-6 rounded-full ${c.bg} ${c.text} flex items-center justify-center text-[11px] font-bold ${c.hoverBg} transition-colors ${
                                isTargeted ? 'ring-2 ring-emerald-400/60' : ''
                              }`}
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
                              className={`text-[11px] font-medium font-mono transition-all duration-300 ${
                                isTargeted
                                  ? 'text-emerald-300 font-bold scale-105'
                                  : asset.change.startsWith('↓')
                                  ? 'text-rose-400'
                                  : 'text-emerald-400'
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
      </motion.div>
    </section>
  );
}
