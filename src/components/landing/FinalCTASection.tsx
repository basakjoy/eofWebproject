'use client';

import { ArrowRight, Sparkles, Target, Shield } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FinalCTASection() {
  return (
    <section className="py-32 bg-[#020817] relative border-t border-white/5 overflow-hidden">
      {/* Dramatic Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-600/[0.04] blur-[100px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex justify-center gap-4 mb-8">
               <div className="p-3 rounded-2xl bg-white/5 text-blue-500 border border-white/5"><Target size={20} /></div>
               <div className="p-3 rounded-2xl bg-white/5 text-blue-500 border border-white/5"><Shield size={20} /></div>
               <div className="p-3 rounded-2xl bg-white/5 text-blue-500 border border-white/5"><Sparkles size={20} /></div>
            </div>
            
            <span className="text-xs font-black text-blue-500 uppercase tracking-[0.6em] block">Sovereign Potential</span>
            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight uppercase tracking-tighter">
              Your Empire <span className="text-gray-500">Starts Today.</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Join an elite global community of traders focused on precision, discipline, and sustained growth. Experience the Empire of Forex edge.
            </p>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              href="/register"
              className="group relative px-12 py-6 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/5 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Begin Deployment <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/investment-plans"
              className="px-12 py-6 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-full transition-all hover:bg-white/10 active:scale-95"
            >
              Explore Ventures
            </Link>
          </motion.div>

          <div className="pt-20 border-t border-white/5">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: 'Uptime', value: '99.9%' },
                  { label: 'Latency', value: '14ms' },
                  { label: 'Security', value: 'Military' },
                  { label: 'Accuracy', value: '84.2%' }
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-xl font-black text-white">{stat.value}</p>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">{stat.label}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
