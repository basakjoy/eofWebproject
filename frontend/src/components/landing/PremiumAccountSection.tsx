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

  // Real photo avatars for the "Elite Ecosystem" member cluster
  const eliteMemberAvatars = [
    'https://randomuser.me/api/portraits/men/22.jpg',
    'https://randomuser.me/api/portraits/women/28.jpg',
    'https://randomuser.me/api/portraits/men/54.jpg',
    'https://randomuser.me/api/portraits/women/61.jpg',
  ];

  return (
    <section className="py-24 bg-[#030305] relative border-y border-white/[0.05] overflow-hidden">
      {/* Fiery Radial Glow, matching IntroSection / LiveSignalsSection */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-br from-[#FF6B00]/[0.06] via-[#FFb800]/[0.03] to-transparent blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute -top-32 right-[-15%] w-[700px] h-[700px] bg-[#FF3D00]/[0.06] rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

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
               <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/20 via-[#FF8C00]/10 to-transparent blur-[100px] group-hover:scale-125 transition-transform duration-1000" />

               {/* Continuous floating animation wrapper, matching IntroSection's token card */}
               <motion.div
                 animate={{ y: [-8, 8, -8] }}
                 transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                 className="relative"
               >
                 <div className="relative aspect-[3/4] rounded-[50px] bg-[#0A0A0F] border border-[#FF6B00]/20 p-10 flex flex-col justify-between overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)]">
                   {/* Subtle top-light gradient for glass edge reflection */}
                   <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                   {/* Card Texture */}
                   <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #FF8C00 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                   <div className="relative z-10">
                     <Gem className="text-[#FF8C00] mb-6" size={48} />
                     <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Gold<br />Membership</h3>
                   </div>

                   <div className="relative z-10 space-y-4">
                      <div className="h-0.5 w-12 bg-gradient-to-r from-[#FF6B00] to-[#FFb800]" />
                      <p className="text-xs font-black text-[#FF8C00]/70 uppercase tracking-[0.4em]">Elite Ecosystem</p>
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                           {eliteMemberAvatars.map((src, i) => (
                             <motion.div
                               key={i}
                               initial={{ opacity: 0, scale: 0.6, y: 10 }}
                               whileInView={{ opacity: 1, scale: 1, y: 0 }}
                               viewport={{ once: true }}
                               transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
                               animate={{ y: [0, -4, 0] }}
                               whileHover={{ scale: 1.15, zIndex: 20 }}
                               style={{ animationDelay: `${i * 0.3}s` }}
                               className="relative w-10 h-10 rounded-full border-2 border-[#0A0A0F] overflow-hidden shadow-[0_0_10px_rgba(255,107,0,0.25)] cursor-pointer"
                             >
                               <img className="w-full h-full object-cover" src={src} alt="Elite member" />
                             </motion.div>
                           ))}
                        </div>
                        <span className="text-[10px] font-bold text-zinc-500 tracking-wide">+2,400 members</span>
                      </div>
                   </div>
                 </div>

                 {/* Absolute Floating Badge */}
                 <motion.div 
                   animate={{ y: [0, -10, 0] }}
                   transition={{ duration: 3, repeat: Infinity }}
                   className="absolute -top-6 -right-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#FFb800] text-black font-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(255,107,0,0.4)]"
                 >
                   Limited Slots
                 </motion.div>
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
              <span className="text-xs font-black text-[#FF8C00] uppercase tracking-[0.4em] block mb-4">Elite Tier</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
                Sovereign <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8C00] to-[#FFb800]">Financial Edge.</span>
              </h2>
              <p className="text-lg text-zinc-400 mt-6 max-w-lg mx-auto lg:mx-0 font-light">
                Unlock the ultimate trading environment with personalized infrastructure, zero latency, and dedicated institutional insights.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-2 justify-center lg:justify-start text-[#FF8C00]">
                       <Icon size={18} />
                       <h4 className="text-sm font-black uppercase tracking-widest text-white">{b.title}</h4>
                    </div>
                    <p className="text-xs text-zinc-500">{b.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-6">
               <button className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#FF6B00] to-[#FFb800] hover:opacity-90 text-black font-black uppercase tracking-widest text-xs rounded-2xl transition-all active:scale-95 shadow-[0_0_20px_rgba(255,107,0,0.2)] overflow-hidden">
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