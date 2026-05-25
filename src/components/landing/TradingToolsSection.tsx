'use client';

import { TrendingUp, BarChart3, Zap, Shield, Cpu, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TradingToolsSection() {
  const tools = [
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Professional-grade charting with 50+ technical indicators and drawing tools.',
      size: 'col-span-1 md:col-span-2',
      color: 'blue'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Insights',
      description: 'Institutional-grade data feeds for instant edge.',
      size: 'col-span-1',
      color: 'indigo'
    },
    {
      icon: Cpu,
      title: 'AI Signal Core',
      description: 'Neural networks optimized for pattern recognition.',
      size: 'col-span-1',
      color: 'blue'
    },
    {
      icon: Zap,
      title: 'Fast Execution',
      description: 'Ultra-low latency infrastructure with sub-ms execution.',
      size: 'col-span-1 md:col-span-2',
      color: 'indigo'
    }
  ];

  return (
    <section className="py-24 bg-[#020817] relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-black text-blue-500 uppercase tracking-[0.3em]">Institutional Grade</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-4">Precision Trading Toolkit.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${tool.size} group relative bg-white/5 border border-white/5 rounded-3xl p-8 hover:bg-white/[0.07] transition-all overflow-hidden`}
              >
                {/* Decorative Gradient Inner */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{tool.description}</p>
                </div>

                {/* Bottom Corner Decoration */}
                <div className="absolute bottom-4 right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Icon size={80} className="text-white" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
