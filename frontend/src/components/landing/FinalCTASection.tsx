'use client';

import { ArrowRight, Sparkles, Target, Shield } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FinalCTASection() {
  return (
    <section className="py-20 sm:py-32 bg-[#030305] relative border-t border-white/[0.05] overflow-hidden">
      {/* Dramatic Center Glow, matching the fiery ambient FX elsewhere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-[#FF6B00]/[0.05] via-[#FFb800]/[0.03] to-transparent blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute -top-32 right-[-15%] w-[700px] h-[700px] bg-[#FF3D00]/[0.05] rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8 sm:space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex justify-center gap-4 mb-8">
               <div className="p-3 rounded-2xl bg-white/[0.03] text-[#FF8C00] border border-white/[0.05]"><Target size={20} /></div>
               <div className="p-3 rounded-2xl bg-white/[0.03] text-[#FF8C00] border border-white/[0.05]"><Shield size={20} /></div>
               <div className="p-3 rounded-2xl bg-white/[0.03] text-[#FF8C00] border border-white/[0.05]"><Sparkles size={20} /></div>
            </div>
            
            <span className="text-[10px] sm:text-xs font-black text-[#FF8C00] uppercase tracking-[0.35em] sm:tracking-[0.6em] block">Sovereign Potential</span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight uppercase tracking-tighter">
              Your Empire <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8C00] to-[#FFb800]">Starts Today.</span>
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
              Join an elite global community of traders focused on precision, discipline, and sustained growth. Experience the Empire of Forex edge.
            </p>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center"
          >
            <Link
              href="/register"
              className="group relative px-6 sm:px-12 py-4 sm:py-6 bg-white text-black font-black uppercase tracking-widest text-[10px] sm:text-xs rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Begin Deployment <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/investment-plans"
              className="px-6 sm:px-12 py-4 sm:py-6 bg-white/[0.03] border border-white/[0.08] text-white font-black uppercase tracking-widest text-[10px] sm:text-xs rounded-full transition-all hover:bg-white/[0.08] hover:border-[#FF6B00]/30 active:scale-95"
            >
              Explore Ventures
            </Link>
          </motion.div>

           <div className="pt-12 sm:pt-20 border-t border-white/[0.05]">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-8">
                {[
                  { label: 'Uptime', value: '99.9%' },
                  { label: 'Latency', value: '14ms' },
                  { label: 'Security', value: 'Military' },
                  { label: 'Accuracy', value: '84.2%' }
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-xl font-black text-white">{stat.value}</p>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">{stat.label}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}