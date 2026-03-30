'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import gsap from 'gsap';

export default function HeroSection() {
  useEffect(() => {
    const tl = gsap.timeline();

    tl.from('.hero-subtitle', {
      duration: 0.6,
      opacity: 0,
      y: 20,
    });

    tl.from('.hero-title', {
      duration: 1,
      opacity: 0,
      y: 40,
      stagger: 0.2,
    }, '-=0.4');

    tl.from('.hero-description', {
      duration: 0.8,
      opacity: 0,
      y: 20,
    }, '-=0.6');

    tl.from('.hero-buttons', {
      duration: 0.8,
      opacity: 0,
      y: 20,
      stagger: 0.1,
    }, '-=0.5');

    tl.from('.hero-stats', {
      duration: 0.8,
      opacity: 0,
      y: 20,
      stagger: 0.1,
    }, '-=0.5');
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center w-full px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 sm:pb-24 bg-black">
      <div className="max-w-7xl mx-auto w-full">

        {/* Main Headline */}
        <div className="space-y-8 sm:space-y-12 mb-16 sm:mb-24">
          <div className="space-y-4 sm:space-y-6">

            <p className="hero-subtitle text-blue-400 font-medium text-xs sm:text-sm tracking-widest uppercase">
              Welcome to Empire of Forex
            </p>

            {/*Fixed: text scales from mobile → desktop, no overflow */}
            <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white leading-[1.05] max-w-5xl">
              Financial Mastery
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Redefined
              </span>
            </h1>
          </div>

          <p className="hero-description text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed font-light">
            Join thousands of professional traders and investors accessing world-class trading signals,
            real-time market analysis, and comprehensive portfolio management in one unified platform.
          </p>

          {/* Fixed: buttons stack on mobile, side-by-side on sm+, full-width on mobile */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 sm:pt-8 hero-buttons">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/50 w-full sm:w-auto"
            >
              Start Trading
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-600 hover:border-blue-400 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Explore Platform
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        {/* ✅ Fixed: 1 col on mobile → 3 col on md, smaller text on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 border-t border-gray-800 pt-12 sm:pt-20">
          <div className="space-y-2 hero-stats text-center sm:text-left">
            <p className="text-3xl sm:text-4xl font-black text-white">$500M+</p>
            <p className="text-gray-400 text-sm font-light">Assets Under Management</p>
          </div>
          <div className="space-y-2 hero-stats text-center sm:text-left">
            <p className="text-3xl sm:text-4xl font-black text-white">50K+</p>
            <p className="text-gray-400 text-sm font-light">Active Traders</p>
          </div>
          <div className="space-y-2 hero-stats text-center sm:text-left">
            <p className="text-3xl sm:text-4xl font-black text-white">99.9%</p>
            <p className="text-gray-400 text-sm font-light">Uptime Guarantee</p>
          </div>
        </div>

      </div>
    </section>
  );
}