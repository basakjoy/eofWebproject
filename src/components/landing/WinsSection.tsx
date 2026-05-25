'use client';

import { Award, Trophy, Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WinsSection() {
  const wins = [
    { year: '2024', title: 'Best Trading Platform', provider: 'Forex Awards' },
    { year: '2023', title: 'Top Signals Provider', provider: 'Global Finance' },
    { year: '2023', title: 'Most Secure Broker', provider: 'Security Intl' },
  ];

  return (
    <section className="py-24 bg-[#020817] border-t border-white/5 relative overflow-hidden">
      {/* Background Decorative Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-white/[0.02] pointer-events-none select-none uppercase">
        Excellence
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-black text-blue-500 uppercase tracking-[0.4em]">Proven Success</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-4">World Class Recognition.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {wins.map((win, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-blue-600/30 transition-all text-center"
            >
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <Trophy size={32} />
                </div>
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">{win.year} — {win.provider}</span>
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{win.title}</h3>
              
              {/* Decorative Stars */}
              <div className="flex justify-center gap-1 mt-4 opacity-30">
                {[1,2,3,4,5].map(i => <Star key={i} size={8} fill="currentColor" className="text-blue-400" />)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Counter Mockup */}
        <div className="mt-20 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
             { label: 'Active Users', value: '150k+' },
             { label: 'Total Volume', value: '$2.5B' },
             { label: 'Signal Accuracy', value: '84.2%' },
             { label: 'Support Rate', value: '99.9%' }
           ].map((stat, i) => (
             <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-white mb-1 tracking-tighter">{stat.value}</div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
