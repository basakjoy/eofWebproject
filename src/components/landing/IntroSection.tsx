'use client';

import { ArrowRight, Play, TrendingUp, Globe, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function IntroSection() {
  return (
    <section className="relative min-h-[95vh] flex items-center pt-24 overflow-hidden bg-[#020817]">
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2563eb]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#1e293b]/20 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center lg:text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">Premium Signal Excellence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
              Master the Markets <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600">
                with Precision.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 max-w-xl leading-relaxed mx-auto lg:mx-0">
              We combine elite forex trading strategies, institutional-grade market analysis, and advanced risk control to give you the ultimate edge in global markets.
            </p>

            <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
              <Link
                href="/register"
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                   Start Trading Now
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <Link
                href="/investment-plans"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/10 hover:border-white/30 text-white font-bold rounded-full transition-all hover:bg-white/5 active:scale-95"
              >
                Invest with Us
              </Link>
            </div>

            {/* Trust Markers */}
            <div className="flex items-center gap-8 pt-8 border-t border-white/5 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-500" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Reach</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gray-500" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Verified Trust</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="hidden lg:block relative"
          >
            {/* Floating Widgets Mockup */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <img 
                src="/images/trading-hero.png" 
                alt="Empire Trading Dashboard" 
                className="w-full h-auto transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent" />
            </div>

            {/* Real-time stats floating bits */}
            <motion.div 
               animate={{ y: [0, -15, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-10 -left-10 p-5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Win Rate</div>
                  <div className="text-xl font-black text-white">84.2%</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
               animate={{ y: [0, 15, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute bottom-20 -right-5 p-4 bg-blue-600/20 backdrop-blur-md border border-blue-500/30 rounded-2xl shadow-blue-600/10 max-w-[180px]"
            >
              <p className="text-xs font-bold text-white leading-relaxed">
                "Best signals in 2025" <br />
                <span className="text-[10px] opacity-60">- Trading View Awards</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block">
        <motion.div 
           animate={{ y: [0, 10, 0] }}
           transition={{ duration: 2, repeat: Infinity }}
           className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1"
        >
          <div className="w-1 h-2 bg-blue-500 rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
