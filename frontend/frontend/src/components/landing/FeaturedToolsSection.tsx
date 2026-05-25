'use client';

import { Box, Layers, MousePointer2, PieChart, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeaturedToolsSection() {
  const tools = [
    { icon: Zap, title: 'Hyper-Trade MT5', desc: 'Customized MetaTrader build with proprietary high-speed bridges.' },
    { icon: Layers, title: 'Multi-Asset Core', desc: 'Unified infrastructure for Forex, Indices, and Digital Commodities.' },
    { icon: ShieldCheck, title: 'Order Shield', desc: 'Advanced slippage protection and negative balance safeguards.' },
  ];

  return (
    <section className="py-24 bg-[#020817] relative border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6">
        
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Right Preview (Visual First on Large, Bottom on Small) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="relative group p-1 rounded-[40px] bg-gradient-to-br from-blue-600/20 to-transparent">
              <div className="bg-[#0a0a1a] rounded-[38px] p-8 sm:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
                 {/* Decorative Grid */}
                 <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                 
                 <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-center">
                       <Box className="text-blue-500" size={40} />
                       <div className="px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-[8px] font-black text-blue-400 uppercase tracking-widest">v5.8.2.0 Build</div>
                    </div>
                    
                    <div className="space-y-4">
                       <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Deployment Terminal.</h3>
                       <p className="text-sm text-gray-500 leading-relaxed">The pinnacle of execution technology. Designed for traders who demand sub-millisecond precision and institutional grade order flow.</p>
                    </div>

                    <div className="pt-4 grid grid-cols-2 gap-4">
                       <div className="h-2 rounded-full bg-white/5 overflow-hidden"><div className="h-full bg-blue-600 w-3/4" /></div>
                       <div className="h-2 rounded-full bg-white/5 overflow-hidden"><div className="h-full bg-indigo-600 w-1/2" /></div>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10 order-2 lg:order-1 text-center lg:text-left"
          >
            <div>
              <span className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] block mb-4">Precision Engineering</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
                Sovereign <br />
                <span className="text-gray-500">Execution.</span>
              </h2>
            </div>

            <div className="space-y-8 max-w-lg mx-auto lg:mx-0">
               {tools.map((tool, i) => {
                 const Icon = tool.icon;
                 return (
                    <div key={i} className="flex flex-col sm:flex-row items-center lg:items-start gap-4 sm:gap-6 group">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <Icon size={20} />
                       </div>
                       <div className="flex-1">
                          <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">{tool.title}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed">{tool.desc}</p>
                       </div>
                    </div>
                 );
               })}
            </div>

            <div className="pt-6">
               <button className="px-10 py-5 bg-white hover:bg-gray-100 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl active:scale-95 flex items-center gap-3 mx-auto lg:mx-0">
                  Secure MetaTrader 5 <MousePointer2 size={14} />
               </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
