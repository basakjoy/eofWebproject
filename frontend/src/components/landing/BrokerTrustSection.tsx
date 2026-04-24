'use client';

import { CheckCircle, Shield, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BrokerTrustSection() {
  const features = [
    { title: 'Institutional Discipline', desc: 'Elite risk-managed strategies prioritize capital preservation.' },
    { title: 'Sophisticated Analysis', desc: 'Discipline over guarantees with deep market intelligence.' },
    { title: 'Advanced Safeguards', desc: 'Proprietary risk management tools for high-net-worth investors.' },
    { title: 'Elite Support', desc: '24/7 priority concierge for our premium global community.' },
  ];

  return (
    <section className="py-24 bg-[#020817] relative border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left - Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10 text-center lg:text-left"
          >
            <div>
              <span className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] block mb-4">Core Philosophy</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                An Elite Ecosystem <br />
                <span className="text-gray-500">Built on Sovereign Trust.</span>
              </h2>
            </div>

            <div className="grid gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Proof Widget */}
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="relative pt-10"
          >
            <div className="absolute inset-0 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative bg-white/5 border border-white/10 rounded-[40px] p-8 sm:p-12 backdrop-blur-3xl overflow-hidden group">
               {/* Animated Gradient Corner */}
               <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />

               <div className="relative z-10 space-y-8">
                  <div className="flex justify-between items-center bg-black/40 p-6 rounded-3xl border border-white/5">
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Managed Portfolio</p>
                      <p className="text-3xl font-black text-white tracking-tighter">$1,245,800.00</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                      <Shield className="text-white" size={24} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Growth YTD</p>
                      <p className="text-2xl font-black text-green-400">+22.4%</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Risk Profile</p>
                      <div className="flex items-center gap-2">
                        <Target size={14} className="text-blue-400" />
                        <p className="text-xl font-black text-white">LOW</p>
                      </div>
                    </div>
                  </div>
               </div>

               {/* Interaction Indicator */}
               <div className="mt-8 pt-8 border-t border-white/5 text-center">
                  <span className="text-[10px] font-black text-blue-500/60 uppercase tracking-[0.3em]">Institutional Grade Execution</span>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
