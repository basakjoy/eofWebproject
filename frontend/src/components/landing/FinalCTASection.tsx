'use client';

import { ArrowRight, Sparkles, Target, Shield, Zap, Lock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getLocalizedPath, useLanguage } from '@/context/LanguageContext';

export default function FinalCTASection() {
  const { locale, t } = useLanguage();

  return (
    <section className="py-24 sm:py-36 bg-[#030305] relative border-t border-white/[0.06] overflow-hidden">
      {/* Dramatic fiery ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-br from-[#FF6B00]/[0.08] via-[#FFb800]/[0.04] to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute -top-32 right-[-15%] w-[700px] h-[700px] bg-[#FF3D00]/[0.05] rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      <div className="max-w-site mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-12">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            {/* Top Interactive Feature Icons */}
            <div className="flex justify-center gap-3 sm:gap-4 mb-6">
              {[
                { icon: Target, label: 'Precision' },
                { icon: Shield, label: 'Security' },
                { icon: Zap, label: 'Velocity' },
                { icon: Sparkles, label: 'Yield' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.15, y: -4 }}
                    className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] text-[#FF8C00] border border-white/[0.08] hover:border-[#FF6B00]/40 transition-colors shadow-lg cursor-default group"
                  >
                    <Icon size={20} className="group-hover:text-white transition-colors" />
                  </motion.div>
                );
              })}
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-xs font-semibold text-[#FF8C00]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="uppercase tracking-widest">{t('finalCta.badge', 'Instant Onboarding')}</span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.05]">
              {t('finalCta.title', 'Your Trading Empire')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8C00] to-[#FFb800]">
                {t('finalCta.titleHighlight', 'Starts Today.')}
              </span>
            </h2>

            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed font-light">
              {t('finalCta.description', 'Join an elite global community of capital allocators and professional traders. Connect your accounts to institutional intelligence today.')}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
          >
            <Link
              href="/register"
              className="group relative w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-white hover:bg-zinc-100 text-black font-extrabold text-sm rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_30px_rgba(255,255,255,0.2)] overflow-hidden flex items-center justify-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t('finalCta.beginDeployment', 'Begin Deployment Free')} 
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              href={getLocalizedPath('/trading-signals', locale)}
              className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#FF6B00]/40 text-white font-bold text-sm rounded-full transition-all active:scale-[0.98] backdrop-blur-sm"
            >
              {t('finalCta.exploreVentures', 'Explore Live Terminal')}
            </Link>
          </motion.div>

          {/* System Telemetry Metrics */}
          <div className="pt-12 sm:pt-16 border-t border-white/[0.06]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: t('finalCta.uptime', 'Platform Uptime'), value: '99.98%' },
                { label: t('finalCta.latency', 'Average Execution'), value: '< 12ms' },
                { label: t('finalCta.security', 'Custody Standard'), value: 'Cold Multi-Sig' },
                { label: t('finalCta.accuracy', 'Verified Signals'), value: '88.4% Win' }
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-xl sm:text-2xl text-white font-bold font-mono tracking-tight">{stat.value}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
