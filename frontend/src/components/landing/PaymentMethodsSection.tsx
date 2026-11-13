'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Globe2, MessageSquare, CheckCircle2, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface LanguageItem {
  country: string;
  native: string;
  code: string;
  region: 'europe' | 'americas' | 'asia';
  officersOnline: number;
}

export default function PaymentMethodsSection() {
  const { t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'europe' | 'americas' | 'asia'>('all');
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);

  const languages: LanguageItem[] = [
    { country: 'United Kingdom', native: 'English', code: 'gb', region: 'europe', officersOnline: 12 },
    { country: 'Germany', native: 'Deutsch', code: 'de', region: 'europe', officersOnline: 8 },
    { country: 'Sweden', native: 'Svenska', code: 'se', region: 'europe', officersOnline: 5 },
    { country: 'Italy', native: 'Italiano', code: 'it', region: 'europe', officersOnline: 6 },
    { country: 'United States', native: 'English (US)', code: 'us', region: 'americas', officersOnline: 16 },
    { country: 'Indonesia', native: 'Bahasa Indonesia', code: 'id', region: 'asia', officersOnline: 9 },
    { country: 'Japan', native: '日本語', code: 'jp', region: 'asia', officersOnline: 7 },
    { country: 'Czech Republic', native: 'Čeština', code: 'cz', region: 'europe', officersOnline: 4 },
    { country: 'South Korea', native: '한국어', code: 'kr', region: 'asia', officersOnline: 8 },
    { country: 'France', native: 'Français', code: 'fr', region: 'europe', officersOnline: 7 },
    { country: 'Spain', native: 'Español', code: 'es', region: 'europe', officersOnline: 9 },
    { country: 'Brazil', native: 'Português', code: 'br', region: 'americas', officersOnline: 6 },
  ];

  const filtered = selectedRegion === 'all' 
    ? languages 
    : languages.filter((l) => l.region === selectedRegion);

  return (
    <section className="py-24 sm:py-32 bg-[#050508] relative z-10 border-t border-white/[0.06] overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-[#FF6B00]/[0.03] to-[#FFb800]/[0.02] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-site mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Top Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-zinc-300">
            <Globe2 size={14} className="text-[#FF6B00]" />
            <span>{t('paymentMethods.badge', 'Global Multilingual Operations')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            {t('paymentMethods.title', 'Institutional Support in 18 Languages')}
          </h2>

          <p className="text-sm text-zinc-400 leading-relaxed font-light">
            Trading is 24/7, and so is our multilingual trading desk. Connect directly with localized native support specialists in under 60 seconds.
          </p>

          {/* Quick Real-Time Metrics Strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Clock size={13} /> Average Response: &lt; 45s
            </span>
            <span className="flex items-center gap-1.5 text-[#FF8C00]">
              <Headphones size={13} /> 24/7/365 Concierge
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 size={13} className="text-emerald-400" /> 99.4% Resolution Rate
            </span>
          </div>
        </motion.div>

        {/* Region Filter Buttons */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
            {[
              { id: 'all', label: 'All Regions (18+)' },
              { id: 'europe', label: 'Europe' },
              { id: 'americas', label: 'Americas' },
              { id: 'asia', label: 'Asia-Pacific' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedRegion(tab.id as typeof selectedRegion)}
                className={`px-4 sm:px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRegion === tab.id
                    ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-black shadow-[0_0_15px_rgba(255,107,0,0.3)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Flag Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-2"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                layout
                key={item.country}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -4, scale: 1.02 }}
                onMouseEnter={() => setHoveredLang(item.country)}
                onMouseLeave={() => setHoveredLang(null)}
                className="group p-4 rounded-2xl bg-[#0D0D14]/80 hover:bg-[#12121C] border border-white/[0.06] hover:border-[#FF6B00]/40 transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.4)] cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-6 overflow-hidden rounded shadow-sm border border-white/10 group-hover:scale-105 transition-transform">
                    <img 
                      src={`https://flagcdn.com/w80/${item.code}.png`} 
                      alt={`${item.country} flag`}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#FF8C00] transition-colors truncate">
                    {item.country}
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-medium">
                    {item.native}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
