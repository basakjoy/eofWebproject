'use client';

import { Download, Apple, Smartphone, Globe, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileTradingSection() {
  return (
    <section className="py-24 bg-[#020817] relative border-y border-white/5 overflow-hidden">
      {/* Decorative Blur Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Content Architecture */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10 order-2 lg:order-1 text-center lg:text-left"
          >
            <div>
              <span className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] block mb-4">Mobile Hub</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                Trading in the <br />
                <span className="text-gray-500">palm of your hand.</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-400 mt-6 max-w-lg mx-auto lg:mx-0">
                The full Empire of Forex experience, optimized for state-of-the-art mobile performance. Monitor signals and execute trades from anywhere.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="space-y-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center mx-auto lg:mx-0">
                    <Globe size={20} className="text-blue-500" />
                 </div>
                 <h4 className="text-sm font-black text-white uppercase tracking-widest">Global Sync</h4>
                 <p className="text-xs text-gray-500">Instant cross-device synchronization with sub-second latency.</p>
               </div>
               <div className="space-y-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center mx-auto lg:mx-0">
                    <Shield size={20} className="text-blue-500" />
                 </div>
                 <h4 className="text-sm font-black text-white uppercase tracking-widest">Biometric Security</h4>
                 <p className="text-xs text-gray-500">Multi-layer encryption with FaceID and TouchID integration.</p>
               </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
              <button className="flex items-center gap-3 px-6 py-3 bg-white hover:bg-gray-100 text-black font-bold rounded-2xl transition-all shadow-xl shadow-white/5 active:scale-95">
                <Apple size={20} />
                <span className="text-sm">App Store</span>
              </button>
              <button className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all active:scale-95">
                <Smartphone size={20} />
                <span className="text-sm">Play Store</span>
              </button>
            </div>
          </motion.div>

          {/* Right: Asset Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex justify-center order-1 lg:order-2"
          >
            <div className="relative group">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-blue-600/20 blur-[80px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
              
              <div className="relative rounded-[40px] border border-white/10 overflow-hidden shadow-2xl p-4 bg-[#0a0a1a] max-w-[340px]">
                <img 
                  src="/images/mobile-app.png" 
                  alt="Empire Mobile App" 
                  className="rounded-[32px] w-full h-auto ring-1 ring-white/10"
                />
              </div>

              {/* Floating Badge */}
              <motion.div 
                 animate={{ scale: [1, 1.1, 1] }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="absolute -top-10 -right-10 px-4 py-4 rounded-3xl bg-blue-600 border border-blue-400 shadow-2xl shadow-blue-600/40"
              >
                <div className="text-center">
                  <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">App Rating</div>
                  <div className="text-2xl font-black text-white">4.9/5</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
