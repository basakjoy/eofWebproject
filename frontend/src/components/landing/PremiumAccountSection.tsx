'use client';

import { useState } from 'react';
import { Crown, Zap, Shield, UserCheck, BarChart, Gem, Check, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function PremiumAccountSection() {
  const { t } = useLanguage();
  const [selectedTier, setSelectedTier] = useState<'gold' | 'obsidian'>('gold');

  const tierData = {
    gold: {
      name: 'Gold Sovereign',
      tagline: 'High-Volume Institutional Trader',
      split: '85% Profit Retention',
      gemColor: 'text-[#FF8C00]',
      cardBorder: 'border-[#FF6B00]/30 hover:border-[#FF6B00]/60',
      badgeGradient: 'from-[#FF6B00] to-[#FFb800]',
      glowColor: 'bg-[#FF6B00]/20',
      slots: '9 Slots Left This Month',
      perks: [
        'Zero-latency private VPS direct connection',
        'Direct Telegram/WhatsApp VIP Desk',
        '85% Bi-Weekly Profit Split',
        'Concierge risk management review',
      ],
    },
    obsidian: {
      name: 'Black Obsidian VIP',
      tagline: 'Family Office & Elite Syndicate',
      split: '90% Profit Retention',
      gemColor: 'text-cyan-400',
      cardBorder: 'border-cyan-500/30 hover:border-cyan-500/60',
      badgeGradient: 'from-cyan-500 via-blue-500 to-indigo-500',
      glowColor: 'bg-cyan-500/20',
      slots: 'Strictly 3 Slots Remaining',
      perks: [
        'Dedicated Institutional Portfolio Director',
        'Full 90% Weekly Profit Retention',
        'Institutional API & FIX Protocol gateway',
        'Custom algorithmic strategy tailoring',
      ],
    },
  };

  const current = tierData[selectedTier];

  const eliteMemberAvatars = [
    'https://randomuser.me/api/portraits/men/22.jpg',
    'https://randomuser.me/api/portraits/women/28.jpg',
    'https://randomuser.me/api/portraits/men/54.jpg',
    'https://randomuser.me/api/portraits/women/61.jpg',
  ];

  return (
    <section className="py-24 sm:py-36 bg-[#030305] relative border-y border-white/[0.06] overflow-hidden">
      {/* Dynamic ambient lights */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] ${current.glowColor} blur-[160px] rounded-full transition-colors duration-700 pointer-events-none`} />

      <div className="max-w-site mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Tier Switcher Pills */}
        <div className="flex justify-center mb-12 sm:mb-16">
          <div className="inline-flex p-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl">
            <button
              onClick={() => setSelectedTier('gold')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
                selectedTier === 'gold'
                  ? 'bg-gradient-to-r from-[#FF6B00] to-[#FFb800] text-black shadow-[0_0_20px_rgba(255,107,0,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Gem size={14} />
              <span>Gold Sovereign Tier</span>
            </button>
            <button
              onClick={() => setSelectedTier('obsidian')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
                selectedTier === 'obsidian'
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Crown size={14} />
              <span>Black Obsidian VIP</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center">
          
          {/* Left: Interactive 3D Luxury Holographic Card (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex justify-center order-2 lg:order-1"
          >
            <div className="relative group max-w-sm w-full">
              {/* Continuous subtle floating animation */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="relative"
              >
                {/* Holographic Card Container */}
                <div className={`relative aspect-[3/4.2] rounded-[40px] bg-[#0A0A10]/90 backdrop-blur-2xl border ${current.cardBorder} p-8 sm:p-10 flex flex-col justify-between overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-500`}>
                  
                  {/* Glass Top Edge Light */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  
                  {/* Subtle Grid Texture */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                  {/* Card Top: Gem & Title */}
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center ${current.gemColor} shadow-inner`}>
                        <Gem size={32} />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">
                        {current.split}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-3xl font-extrabold text-white tracking-tight">
                        {current.name}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        {current.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom: Member count & Ecosystem */}
                  <div className="relative z-10 space-y-4 pt-6 border-t border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
                        Elite Syndicate
                      </p>
                      <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3">
                        {eliteMemberAvatars.map((src, i) => (
                          <div key={i} className="w-9 h-9 rounded-full border-2 border-[#0A0A10] overflow-hidden shadow-md">
                            <img className="w-full h-full object-cover" src={src} alt="Elite member" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-400">
                        +2,400 Institutional Seats
                      </span>
                    </div>
                  </div>

                </div>

                {/* Floating Slots Remaining Badge */}
                <motion.div 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className={`absolute -top-4 -right-4 px-4 py-2 rounded-2xl bg-gradient-to-r ${current.badgeGradient} text-black font-extrabold text-[11px] tracking-wider uppercase shadow-[0_0_20px_rgba(255,107,0,0.4)] flex items-center gap-1.5`}
                >
                  <Sparkles size={12} />
                  <span>{current.slots}</span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Pitch & Benefits List (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-8 order-1 lg:order-2 text-center lg:text-left"
          >
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-[#FF8C00] uppercase tracking-[0.3em] block">
                {t('premiumAccount.tierBadge', 'Dedicated Private Capital Desks')}
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
                {t('premiumAccount.title', 'Sovereign')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8C00] to-[#FFb800]">
                  {t('premiumAccount.titleHighlight', 'Financial Edge.')}
                </span>
              </h2>
              <p className="text-base sm:text-lg text-zinc-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                {t('premiumAccount.description', 'Unlock the ultimate high-frequency trading infrastructure with personalized risk limits, zero latency feeds, and dedicated account syndicates.')}
              </p>
            </div>

            {/* Dynamic Perks Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <AnimatePresence mode="wait">
                {current.perks.map((perk, i) => (
                  <motion.div
                    key={`${selectedTier}-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-left"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Check size={14} />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-zinc-200">
                      {perk}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                href="/register"
                className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 bg-white hover:bg-zinc-100 text-black font-extrabold text-sm rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_25px_rgba(255,255,255,0.2)]"
              >
                <span>Apply for {current.name}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/trading-signals"
                className="px-6 py-4 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
              >
                Compare Tiers Breakdown →
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
