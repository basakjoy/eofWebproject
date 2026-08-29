'use client';

import { BarChart3, PieChart, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeaturedToolsSection() {
  const cards = [
    {
      title: 'Real-time Market Insight',
      desc: 'At Empire of Forex, we ensure fast, reliable payouts with robust model and verified proof on blockchain and social media.',
      tag: 'Market Feed',
      previewType: 'market',
    },
    {
      title: 'Advanced Account Analytics',
      desc: 'Customize your trading business journey effortlessly with our high-precision suite of account analytics.',
      tag: 'Analytics',
      previewType: 'analytics',
    },
    {
      title: 'Portfolio Management',
      desc: 'Easily tweak your trading journey with Empire of Forex’s intuitive portfolio breakdown dashboard.',
      tag: 'Portfolio',
      previewType: 'portfolio',
    },
    {
      title: 'Advanced Charting Tools',
      desc: 'High-speed candlestick streams with real-time indicators and customizable technical technical analysis overlays.',
      tag: 'Charting',
      previewType: 'chart',
    },
  ];

  return (
    <section className="py-24 bg-[#050508] relative z-10">
      <div className="max-w-site mx-auto px-6 space-y-16">
        
        {/* Top Header */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
            <span>Our Features</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-tight">
            Our Powerful Dashboard Empowers over 234,000 Analytics Everyday
          </h2>
        </div>

        {/* 2x2 Grid of Fiery Dark Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-3xl bg-[#111116]/70 border border-white/10 p-7 space-y-6 hover:border-[#FF6B00]/40 transition-all group overflow-hidden shadow-2xl relative"
            >
              {/* Fiery ambient card top glow on hover */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FF6B00]/10 rounded-full blur-3xl group-hover:bg-[#FF6B00]/25 transition-all" />

              <div className="space-y-2 relative z-10">
                <h3 className="text-xl font-semibold text-white group-hover:text-[#FF6B00] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-[#8E8E93] leading-relaxed font-normal">
                  {card.desc}
                </p>
              </div>

              {/* Preview UI Box */}
              <div className="h-48 rounded-2xl bg-[#08080C] border border-white/5 p-4 flex flex-col justify-between relative overflow-hidden">
                
                {card.previewType === 'market' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] text-gray-400 font-mono">United States</span>
                      <span className="text-[10px] text-emerald-400 font-bold">NASDAQ +1.4%</span>
                    </div>
                    {/* Simulated mini line chart */}
                    <div className="flex items-end gap-1 h-24 pt-4">
                      {[30, 45, 35, 60, 50, 75, 65, 90, 80, 100].map((v, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-gradient-to-t from-[#FF3D00] to-[#FF6B00] rounded-t-sm"
                          style={{ height: `${v}%` }} 
                        />
                      ))}
                    </div>
                  </div>
                )}

                {card.previewType === 'analytics' && (
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
                      <span className="text-xs text-white">Carriage Purchaser</span>
                      <span className="text-xs font-bold text-emerald-400">7.87%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
                      <span className="text-xs text-white">Level 3 Financing</span>
                      <span className="text-xs font-bold text-amber-400">10.0%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
                      <span className="text-xs text-white">Rain Carbon</span>
                      <span className="text-xs font-bold text-emerald-400">12.25%</span>
                    </div>
                  </div>
                )}

                {card.previewType === 'portfolio' && (
                  <div className="grid grid-cols-2 gap-2 my-auto">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 text-[10px] flex items-center justify-center font-bold">A</div>
                        <span className="text-[10px] text-white truncate">Aspire Biopharm...</span>
                      </div>
                      <p className="text-sm font-bold text-white">2.56 USD</p>
                      <span className="text-[9px] text-rose-400 font-semibold">-58.44%</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] flex items-center justify-center font-bold">U</div>
                        <span className="text-[10px] text-white truncate">Universe...</span>
                      </div>
                      <p className="text-sm font-bold text-white">155.44 USD</p>
                      <span className="text-[9px] text-emerald-400 font-semibold">+41.33%</span>
                    </div>
                  </div>
                )}

                {card.previewType === 'chart' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-gray-400">
                      <span>Meta Platforms, Inc.</span>
                      <span className="text-cyan-400 font-mono">1D 5D 1M 1Y ALL</span>
                    </div>
                    {/* Candlestick chart mock */}
                    <div className="flex items-end gap-2 h-28 pt-2">
                      {[
                        { h: '60%', c: 'bg-emerald-500' },
                        { h: '40%', c: 'bg-rose-500' },
                        { h: '75%', c: 'bg-emerald-500' },
                        { h: '90%', c: 'bg-emerald-500' },
                        { h: '55%', c: 'bg-rose-500' },
                        { h: '85%', c: 'bg-emerald-500' },
                        { h: '100%', c: 'bg-emerald-500' },
                      ].map((item, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                          <div className={`w-2 rounded-sm ${item.c}`} style={{ height: item.h }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

