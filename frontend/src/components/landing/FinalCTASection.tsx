'use client';

import { ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTASection() {
  useEffect(() => {
    gsap.from('.final-cta-header', {
      scrollTrigger: {
        trigger: '.final-cta-header',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 30,
    });

    gsap.from('.final-cta-buttons', {
      scrollTrigger: {
        trigger: '.final-cta-buttons',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 40,
    });
  }, []);

  return (
    <section className="py-12 sm:py-20 md:py-32 px-4 sm:px-6 bg-gradient-to-b from-black to-gray-950 border-t border-gray-900">
      <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-12">
        <div className="final-cta-header space-y-4 sm:space-y-6">
          <p className="text-blue-400 font-medium text-xs sm:text-sm tracking-widest uppercase">Ready to Start Trading?</p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
            Join thousands of successful traders
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            Start your trading journey with tight spreads, fast execution, and comprehensive platform tools. Create your account in minutes.
          </p>
        </div>

        <div className="final-cta-buttons flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/50"
          >
            Open Live Account
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-blue-600 hover:border-blue-400 text-blue-400 hover:text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
          >
            <Download className="w-5 h-5" />
            Download Demo
          </Link>
        </div>

        <div className="pt-12 border-t border-gray-800">
          <p className="text-gray-500 text-sm">
            Risk Warning: Forex and CFD trading carries substantial risk. 71% of retail accounts lose money trading CFDs.
          </p>
        </div>
      </div>
    </section>
  );
}
