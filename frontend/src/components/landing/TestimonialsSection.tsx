'use client';

import { useState } from 'react';
import { Star, Quote, ShieldCheck, TrendingUp, HandCoins, Award, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  category: 'fund-management' | 'signals' | 'funded' | 'institutional';
  categoryLabel: string;
  verifiedProfit: string;
  splitMetric: string;
  quote: string;
  image: string;
  isFeatured?: boolean;
}

export default function TestimonialsSection() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'all' | 'fund-management' | 'signals' | 'funded'>('all');

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Alexander Wright',
      role: 'Private Wealth Investor',
      category: 'fund-management',
      categoryLabel: 'Fund Management',
      verifiedProfit: '+$218,400 Payout',
      splitMetric: '50% Profit Share',
      quote: 'The Empire of Forex fund management system has been hands-down the most profitable passive income vehicle for my capital. Their 50% profit share model ensures 100% alignment of interest—they only make money when I make money. Bi-weekly profits land straight into my USDT wallet with zero headache.',
      image: 'https://randomuser.me/api/portraits/men/75.jpg',
      isFeatured: true,
    },
    {
      id: 2,
      name: 'Marcus Sterling',
      role: 'Private Equity Capital Partner',
      category: 'fund-management',
      categoryLabel: 'Fund Management',
      verifiedProfit: '+$340,000 Payout',
      splitMetric: '50/50 Profit Split',
      quote: 'We allocated $100K into the Empire of Forex fund management program six months ago. The strict drawdown protection and 50% profit sharing structure delivered consistent, compounding gains without a single missed payout date. Truly institutional-grade capital management.',
      image: 'https://randomuser.me/api/portraits/men/52.jpg',
      isFeatured: true,
    },
    {
      id: 3,
      name: 'Elena Rostova',
      role: 'Corporate Executive & Investor',
      category: 'fund-management',
      categoryLabel: 'Fund Management',
      verifiedProfit: '+$89,600 Payout',
      splitMetric: '50% Net Share',
      quote: 'I do not have time to monitor candlestick charts all day. With Empire of Forex fund management, the expert desk trades on my behalf and we split profits 50/50. Complete transparency, real-time balance tracking, and zero management fees.',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      isFeatured: true,
    },
    {
      id: 4,
      name: 'Sarah Chen',
      role: 'Portfolio Director',
      category: 'institutional',
      categoryLabel: 'Institutional',
      verifiedProfit: '+$142,500 PnL',
      splitMetric: '89.4% Win Rate',
      quote: 'Empire of Forex transformed our algorithmic desk. The signal accuracy, tight spreads, and ultra-low latency execution allow us to deploy high-volume positions with complete peace of mind.',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: 5,
      name: 'Michael Rodriguez',
      role: 'Funded Prop Account Trader',
      category: 'funded',
      categoryLabel: 'Prop Trading',
      verifiedProfit: '+$68,200 Passed',
      splitMetric: '92.1% Accuracy',
      quote: 'Passed two $200k prop evaluations within three weeks using their 4H breakout alerts and institutional flow feeds. The risk-to-reward ratio on gold setups is unmatched anywhere.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 6,
      name: 'David Vance',
      role: 'VIP Syndicate Member',
      category: 'signals',
      categoryLabel: 'Live Signals',
      verifiedProfit: '+$94,800 PnL',
      splitMetric: '87.6% Win Rate',
      quote: 'The real-time webhook feeds connected directly to our MT5 terminals. Payouts arrive in under 10 minutes via crypto rails. Absolute top-tier service.',
      image: 'https://randomuser.me/api/portraits/men/65.jpg',
    },
  ];

  const filtered = activeCategory === 'all'
    ? testimonials
    : testimonials.filter((item) => item.category === activeCategory);

  return (
    <section className="py-24 sm:py-36 bg-[#050508] relative border-t border-white/[0.06] overflow-hidden">
      {/* Ambient background glow accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[450px] bg-gradient-to-r from-transparent via-[#FF6B00]/[0.035] to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-32 right-[-10%] w-[600px] h-[600px] bg-[#FFb800]/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-site mx-auto px-4 sm:px-6 relative z-10 space-y-14">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-zinc-300">
            <ShieldCheck size={14} className="text-[#FF6B00]" />
            <span>Audited Investor Reviews &amp; Track Record</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Proven Results from Real <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8C00] to-[#FFb800]">
              Fund Clients &amp; Traders
            </span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light max-w-2xl mx-auto">
            Read verified performance reviews from clients enrolled in the <strong className="text-white font-semibold">Empire of Forex Fund Management System</strong> with our transparent <strong className="text-[#FF8C00] font-semibold">50% Profit Share model</strong>, as well as institutional signal desk partners.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2.5 pt-4">
            {[
              { id: 'all', label: 'All Reviews (6)' },
              { id: 'fund-management', label: '★ Fund Management (50% Profit Share)' },
              { id: 'signals', label: 'Live Signals Desk' },
              { id: 'funded', label: 'Prop Traders' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as typeof activeCategory)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  activeCategory === tab.id
                    ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-black shadow-[0_0_20px_rgba(255,107,0,0.35)]'
                    : 'bg-white/[0.03] text-zinc-400 hover:text-white border border-white/5 hover:border-white/15'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`relative p-7 sm:p-9 rounded-[32px] bg-[#0A0A10]/95 backdrop-blur-xl border transition-all duration-300 group overflow-hidden flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] cursor-default ${
                  item.isFeatured
                    ? 'border-[#FF6B00]/40 hover:border-[#FF6B00]/80 shadow-[0_0_30px_rgba(255,107,0,0.1)]'
                    : 'border-white/[0.08] hover:border-[#FF6B00]/40'
                }`}
              >
                {/* Top Glass Edge Glow */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <Quote className="absolute top-8 right-8 text-white/[0.03] group-hover:text-[#FF6B00]/15 transition-colors duration-500 pointer-events-none" size={70} />

                <div className="relative z-10 space-y-5">
                  {/* Rating Stars & Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-1 text-[#FF8C00]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} className="fill-[#FF8C00]" />
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {item.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF6B00]/15 text-[#FF8C00] border border-[#FF6B00]/30 flex items-center gap-1">
                          <HandCoins size={11} /> 50% Split
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <TrendingUp size={11} /> {item.verifiedProfit}
                      </span>
                    </div>
                  </div>

                  {/* Category Pill Tag */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-[11px] font-mono font-bold text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                    <span>{item.categoryLabel}</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-emerald-400">{item.splitMetric}</span>
                  </div>

                  <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-light">
                    "{item.quote}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="relative z-10 flex items-center gap-3.5 pt-6 mt-6 border-t border-white/[0.06]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/10 group-hover:border-[#FF6B00] transition-colors shadow-md"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#FF8C00] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-zinc-400 font-medium mt-0.5">
                      {item.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Highlights Strip on Fund Management */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-white/[0.02] via-[#FF6B00]/[0.05] to-white/[0.02] border border-[#FF6B00]/20 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles size={16} className="text-[#FF8C00]" />
              Interested in Hands-Free Fund Management?
            </h4>
            <p className="text-xs text-zinc-400 max-w-lg">
              Our 50% profit share system requires zero upfront management fees. You retain 50% of net profits generated directly on your managed account.
            </p>
          </div>

          <a
            href="/register"
            className="px-6 py-3 rounded-full bg-white hover:bg-zinc-100 text-black text-xs font-bold transition-all shadow-md shrink-0 hover:scale-105"
          >
            Join Fund Program
          </a>
        </div>

      </div>
    </section>
  );
}
