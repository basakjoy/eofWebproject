'use client';

import { TrendingUp, BarChart3, Zap, LineChart } from 'lucide-react';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TradingToolsSection() {
  const tools = [
    {
      icon: TrendingUp,
      title: 'Live Trading',
      description: 'Trade with real money or practice with a demo account',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time market data and professional-grade charts',
    },
    {
      icon: Zap,
      title: 'Fast Execution',
      description: 'Ultra-fast order execution with minimal latency',
    },
  ];

  useEffect(() => {
    gsap.from('.trading-header', {
      scrollTrigger: {
        trigger: '.trading-header',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 30,
    });

    gsap.from('.trading-card', {
      scrollTrigger: {
        trigger: '.trading-cards',
        start: 'top 80%',
        once: true,
      },
      duration: 0.6,
      opacity: 0,
      y: 30,
      stagger: 0.15,
    });
  }, []);

  return (
    <section className="py-32 px-6 bg-gradient-to-b from-gray-950 to-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 trading-header text-center">
          <p className="text-blue-400 font-medium text-sm tracking-widest uppercase mb-6">Complete Toolkit</p>
          <h2 className="text-5xl md:text-6xl font-black text-white leading-tight max-w-3xl mx-auto">
            Everything you need to trade smarter
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 trading-cards">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <div
                key={index}
                className="trading-card bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 hover:border-blue-600 p-8 rounded-xl transition-all duration-300 group hover:shadow-lg hover:shadow-blue-600/20"
              >
                <Icon className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-white text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{tool.title}</h3>
                <p className="text-gray-400 leading-relaxed">{tool.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
