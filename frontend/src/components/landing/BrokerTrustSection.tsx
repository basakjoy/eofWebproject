'use client';

import { useState } from 'react';
import { Zap, ShieldCheck, ArrowRight, Gauge, Lock, Award, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function BrokerTrustSection() {
  const { t } = useLanguage();
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const items = [
    {
      num: '01',
      title: t('whyChooseUs.feature1Title', 'Sub-Millisecond Execution Engine'),
      desc: t(
        'whyChooseUs.feature1Desc',
        'Direct fiber interconnects to London and New York Tier-1 financial data centers ensure zero-slippage market execution.'
      ),
      icon: Gauge,
      metric: '< 12ms Latency',
      tag: 'Ultra Low Ping',
    },
    {
      num: '02',
      title: t('whyChooseUs.feature2Title', 'Up to 90% Performance Split'),
      desc: t(
        'whyChooseUs.feature2Desc',
        'Retain the vast majority of your hard-earned trading gains with an automated, tier-leading profit distribution framework.'
      ),
      icon: Award,
      metric: '90/10 Allocation',
      tag: 'Tier-1 Sharing',
    },
    {
      num: '03',
      title: t('whyChooseUs.feature3Title', 'Instant Payout Clearing Rails'),
      desc: t(
        'whyChooseUs.feature3Desc',
        'No waiting games. Automated crypto and institutional SEPA/Wire channels disburse rewards within minutes of request.'
      ),
      icon: Zap,
      metric: 'Instant Settlement',
      tag: '24/7 Automated',
    },
    {
      num: '04',
      title: t('whyChooseUs.feature4Title', 'Segregated Vault-Grade Custody'),
      desc: t(
        'whyChooseUs.feature4Desc',
        'Military-grade multi-signature cold storage and strictly segregated tier-1 banking institutions safeguard all balances.'
      ),
      icon: Lock,
      metric: '100% Segregated',
      tag: 'SOC-2 Audited',
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#050508] relative z-10 overflow-hidden">
      {/* Ambient background glow accents */}
      <div className="absolute top-1/3 left-[-15%] w-[600px] h-[600px] bg-[#FF6B00]/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-15%] w-[600px] h-[600px] bg-[#FFb800]/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-site mx-auto px-4 sm:px-6">
        
        {/* Top Header Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20 border-b border-white/[0.06] pb-8"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-xs font-semibold text-[#FF8C00]">
              <ShieldCheck size={14} className="text-[#FF6B00]" />
              <span>Institutional Grade Trust</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              {t('whyChooseUs.title', 'Engineered for Performance.')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8C00] to-[#FFb800]">
                Built for Elite Traders.
              </span>
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md font-normal leading-relaxed">
            {t('whyChooseUs.subtitle', 'Backed by an enterprise-grade ecosystem designed to give proprietary traders the fastest, most reliable edge in modern markets.')}
          </p>
        </motion.div>

        {/* 4 Interactive Feature Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const isHovered = activeCard === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onMouseEnter={() => setActiveCard(idx)}
                onMouseLeave={() => setActiveCard(null)}
                className={`relative p-8 sm:p-10 rounded-3xl bg-[#0C0C12]/80 backdrop-blur-xl border transition-all duration-300 group overflow-hidden cursor-default ${
                  isHovered 
                    ? 'border-[#FF6B00]/50 shadow-[0_20px_50px_rgba(255,107,0,0.15)] -translate-y-1.5' 
                    : 'border-white/[0.08] hover:border-white/20'
                }`}
              >
                {/* Top Glass Edge Light */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                {/* Background Hover Radial Glow */}
                <div className={`absolute -right-20 -bottom-20 w-64 h-64 bg-gradient-to-br from-[#FF6B00]/20 to-transparent rounded-full blur-3xl transition-opacity duration-500 pointer-events-none ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`} />

                <div className="relative z-10 space-y-6">
                  {/* Top Bar: Number, Tag & Metric */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-zinc-400 bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/5">
                        {item.num}
                      </span>
                      <span className="text-[11px] font-semibold text-[#FF8C00] tracking-wide uppercase">
                        {item.tag}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full shadow-sm">
                      {item.metric}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0 ${
                      isHovered
                        ? 'bg-gradient-to-tr from-[#FF6B00] to-[#FF8C00] text-black shadow-[0_0_20px_rgba(255,107,0,0.4)] scale-110'
                        : 'bg-white/[0.04] text-[#FF8C00] border border-white/10'
                    }`}>
                      <Icon size={22} />
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-zinc-100 group-hover:to-[#FFb800] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Explore Link */}
                  <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors">
                    <span>Learn more</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 text-[#FF6B00] transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
