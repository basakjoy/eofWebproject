'use client';

import { Trophy, Star, ShieldCheck, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AwardsSection() {
  const accolades = [
    { title: 'Best Trading Platform', year: '2024', provider: 'Financial Times' },
    { title: 'Innovation in Forex', year: '2023', provider: 'Global Banking' },
    { title: 'Safest Brokerage', year: '2023', provider: 'Security Intl' },
  ];

  return (
    <section className="py-24 bg-[#020817] relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Main Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-12 xl:col-span-7"
          >
            <div className="relative group p-10 sm:p-20 rounded-[50px] bg-gradient-to-br from-blue-600/10 to-indigo-600/5 border border-white/5 overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/10 blur-[100px] pointer-events-none" />
              
              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="mb-8 flex justify-center"
                >
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white/5 flex items-center justify-center text-yellow-500 shadow-2xl">
                     <Trophy size={64} />
                  </div>
                </motion.div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                  Voted #1 Platform <br />
                  <span className="text-gray-500">Three Years Running.</span>
                </h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
                  Empire of Forex has been recognized by industry leaders for our commitment to transparency, technical excellence, and user-centric growth.
                </p>
                
                <div className="flex flex-wrap justify-center gap-8">
                   <div className="flex items-center gap-2">
                      <Star className="text-blue-500" size={16} fill="currentColor" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Global 500 List</span>
                   </div>
                   <div className="flex items-center gap-2">
                       <ShieldCheck className="text-blue-500" size={16} />
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">ISO 27001 Certified</span>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* List Visual */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-8">
             <div className="text-center lg:text-left">
               <span className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] block mb-4">Official Recognition</span>
               <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Gold Standard of Excellence.</h3>
             </div>

             <div className="space-y-4">
               {accolades.map((acc, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: 20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                   className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors flex items-center gap-6"
                 >
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-400">
                       <Award size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white tracking-tight">{acc.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{acc.year}</span>
                        <div className="w-1 h-1 rounded-full bg-gray-700" />
                        <span className="text-[10px] font-black text-blue-500/60 uppercase tracking-widest">{acc.provider}</span>
                      </div>
                    </div>
                 </motion.div>
               ))}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
