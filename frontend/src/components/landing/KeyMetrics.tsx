'use client';

import { useRef, useState, useEffect } from 'react';
import { Star, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface StatItem {
  prefix?: string;
  target: number;
  suffix: string;
  label: string;
  sublabel: string;
}

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!isInView) return;
    let current = 0;
    const steps = 35;
    const stepTime = 1400 / steps;
    const inc = stat.target / steps;

    const timer = setInterval(() => {
      current += inc;
      if (current >= stat.target) {
        setCount(stat.target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, stat.target]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-[#FF6B00]/40 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.5)] overflow-hidden cursor-default"
    >
      {/* Subtle top edge glow reflection */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF6B00]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#FF6B00]/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div className="relative z-10 space-y-2 text-center">
        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-mono flex items-baseline justify-center">
          {stat.prefix && <span className="text-[#FF8C00]">{stat.prefix}</span>}
          <span>{count}</span>
          <span className="text-[#FF6B00] text-2xl sm:text-3xl ml-0.5">{stat.suffix}</span>
        </h3>
        
        <p className="text-xs sm:text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
          {stat.label}
        </p>

        <p className="text-[11px] text-zinc-400 font-mono">
          {stat.sublabel}
        </p>
      </div>
    </motion.div>
  );
}

export default function KeyMetrics() {
  const { t } = useLanguage();

  const stats: StatItem[] = [
    { 
      target: 130, 
      suffix: '+', 
      label: t('metrics.countries', 'Countries Served'),
      sublabel: 'Global Node Reach' 
    },
    { 
      target: 34, 
      suffix: 'K+', 
      label: t('metrics.analysis', 'Qualified Analyses'),
      sublabel: 'Daily Machine Inferences' 
    },
    { 
      target: 320, 
      suffix: '+', 
      label: t('metrics.traders', 'Institutional Desks'),
      sublabel: 'Connected Traders' 
    },
    { 
      target: 17, 
      suffix: 'K+', 
      label: t('metrics.strategies', 'Active Strategies'),
      sublabel: 'Algorithmic Models' 
    },
    { 
      prefix: '$', 
      target: 320, 
      suffix: 'M+', 
      label: t('metrics.performanceFee', 'Executed Volume'),
      sublabel: 'Processed Payouts' 
    },
  ];

  const logos = [
    { name: 'AlphaCorp Prime', symbol: '★', tier: 'Tier-1 Liquidity' },
    { name: 'Aurora Asset Management', symbol: '❖', tier: 'Hedge Partner' },
    { name: 'Beta Horizon Capital', symbol: '◈', tier: 'Prime Broker' },
    { name: 'Gamma Quant Desk', symbol: '⚡', tier: 'Execution Gateway' },
    { name: 'Delta Liquidity Partners', symbol: '⬡', tier: 'Market Maker' },
  ];

  const logoTrack = [...logos, ...logos];

  return (
    <section className="bg-[#050508] py-20 border-t border-b border-white/[0.06] relative z-10 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-r from-transparent via-[#FF6B00]/[0.03] to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-site mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">

        {/* Top Trust & Rating Row */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 text-center"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 hover:border-[#FF6B00]/30 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.6)] transition-all">
            <span className="font-bold text-white text-xs tracking-wide">{t('metrics.excellent', 'Rated Excellent')}</span>
            <span className="text-emerald-400 font-mono text-xs font-bold">4.9 / 5.0</span>
            <div className="flex items-center gap-0.5 text-emerald-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="fill-emerald-400 text-emerald-400" />
              ))}
            </div>
            <span className="text-zinc-500 text-[11px] border-l border-white/10 pl-2.5 flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-400" />
              {t('metrics.trustpilot', 'TrustPilot Verified')}
            </span>
          </div>
        </motion.div>

        {/* 5 Dynamic Animated Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <StatCard key={idx} stat={stat} index={idx} />
          ))}
        </div>

        {/* Partner Institutional Marquee */}
        <div className="pt-6 sm:pt-10 space-y-6">
          <div className="flex items-center justify-center gap-2">
            <Sparkles size={13} className="text-[#FF6B00]" />
            <p className="text-center text-xs text-zinc-400 font-semibold tracking-widest uppercase">
              {t('metrics.trustedCompanies', 'Trusted by 240+ Institutional Partners Worldwide')}
            </p>
          </div>

          <div
            className="group relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0,black_96px,black_calc(100%-96px),transparent_100%)]"
          >
            <div className="flex items-center gap-6 w-max animate-marquee group-hover:[animation-play-state:paused]">
              {logoTrack.map((partner, index) => (
                <div
                  key={index}
                  className="px-6 py-3 shrink-0 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-[#FF6B00]/40 transition-all duration-300 flex items-center gap-3 cursor-pointer group/partner"
                >
                  <span className="text-lg text-[#FF8C00] group-hover/partner:scale-125 transition-transform">
                    {partner.symbol}
                  </span>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-zinc-300 group-hover/partner:text-white transition-colors">
                      {partner.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 block font-mono">
                      {partner.tier}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
