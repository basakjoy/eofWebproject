'use client';

import { Crown, Zap, Shield, UserCheck, BarChart, Gem } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PremiumAccountSection() {
  const benefits = [
    { icon: Shield, title: 'Priority Access', desc: 'Concierge-level support 24/7.' },
    { icon: BarChart, title: 'Zero Spreads', desc: 'Trade with institutional liquidity.' },
    { icon: UserCheck, title: 'VIP Manager', desc: 'Personal guide for your portfolio.' },
    { icon: Gem, title: 'Exclusive Alpha', desc: 'Access to private signal channels.' },
  ];

  return (
    <section className="py-24 bg-[#020817] relative border-y border-white/5 overflow-hidden">
      {/* Golden Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-yellow-600/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Luxury Card Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            className="flex justify-center order-2 lg:order-1"
          >
            <div className="relative group max-w-md w-full">
               <div className="absolute inset-0 bg-yellow-500/20 blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
               
               <div className="relative aspect-[3/4] rounded-[50px] bg-black border border-yellow-500/20 p-10 flex flex-col justify-between overflow-hidden shadow-2xl">
                 {/* Card Texture */}
                 <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fbbf24 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                 
                 <div className="relative z-10">
                   <Gem className="text-yellow-500 mb-6" size={48} />
                   <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Gold<br />Membership</h3>
                 </div>

                 <div className="relative z-10 space-y-4">
                    <div className="h-0.5 w-12 bg-yellow-500/50" />
                    <p className="text-xs font-black text-yellow-500/60 uppercase tracking-[0.4em]">Elite Ecosystem</p>
                    <div className="flex -space-x-2">
                       {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-900" />)}
                    </div>
                 </div>
               </div>

               {/* Absolute Floating Badge */}
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="absolute -top-6 -right-6 px-6 py-3 rounded-2xl bg-yellow-500 text-black font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-yellow-500/20"
               >
                 Limited Slots
               </motion.div>
            </div>
          </motion.div>

          {/* Right: Pitch */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10 order-1 lg:order-2 text-center lg:text-left"
          >
            <div>
              <span className="text-xs font-black text-yellow-500 uppercase tracking-[0.4em] block mb-4">Elite Tier</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
                Sovereign <br />
                <span className="text-gray-500">Financial Edge.</span>
              </h2>
              <p className="text-lg text-gray-400 mt-6 max-w-lg mx-auto lg:mx-0">
                Unlock the ultimate trading environment with personalized infrastructure, zero latency, and dedicated institutional insights.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-2 justify-center lg:justify-start text-yellow-500">
                       <Icon size={18} />
                       <h4 className="text-sm font-black uppercase tracking-widest text-white">{b.title}</h4>
                    </div>
                    <p className="text-xs text-gray-500">{b.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-6">
               <button className="group relative w-full sm:w-auto px-10 py-5 bg-yellow-500 hover:bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all active:scale-95 shadow-xl shadow-yellow-500/10 overflow-hidden">
                 <span className="relative z-10">Application for Tier 1 Access</span>
                 <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               </button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
