'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedToolsSection() {
  useEffect(() => {
    gsap.from('.tools-header', {
      scrollTrigger: {
        trigger: '.tools-header',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 30,
    });

    gsap.from('.tools-content', {
      scrollTrigger: {
        trigger: '.tools-content',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 40,
    });
  }, []);

  return (
    <section className="py-32 px-6 bg-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 tools-header text-center">
          <p className="text-blue-400 font-medium text-sm tracking-widest uppercase mb-6">Professional Platform</p>
          <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
            Powerful platform tools
          </h2>
        </div>

        <div className="tools-content grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Features */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-600/20 border border-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 font-bold">🤖</span>
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold mb-2">Auto-Trading</h3>
                  <p className="text-gray-400">Automate your trading strategies with our advanced algorithmic trading tools</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-600/20 border border-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 font-bold">📊</span>
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold mb-2">Advanced Charts</h3>
                  <p className="text-gray-400">Professional-grade charts with 100+ technical indicators and drawing tools</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-600/20 border border-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-400 font-bold">⚙️</span>
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold mb-2">Expert Advisors</h3>
                  <p className="text-gray-400">Deploy expert advisors and custom strategies on MetaTrader</p>
                </div>
              </div>
            </div>

            <Link
              href="/download-terminal"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 mt-4"
            >
              Download MetaTrader 5
            </Link>
          </div>

          {/* Right - Image placeholder */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8 h-96 flex items-center justify-center">
            <div className="text-center">
              <p className="text-6xl mb-4">📈</p>
              <p className="text-gray-400">MetaTrader 5 Trading Platform</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
