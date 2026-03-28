'use client';

import { Download, Apple, Smartphone } from 'lucide-react';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function MobileTradingSection() {
  useEffect(() => {
    gsap.from('.mobile-header', {
      scrollTrigger: {
        trigger: '.mobile-header',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 30,
    });

    gsap.from('.mobile-content', {
      scrollTrigger: {
        trigger: '.mobile-content',
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
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          {/* Left - Image placeholder */}
          <div className="mobile-content order-2 lg:order-1">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6 sm:p-8 h-64 sm:h-80 md:h-96 flex items-center justify-center">
              <div className="text-center">
                <Smartphone className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-blue-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-400 text-sm sm:text-base">Mobile Trading App</p>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="mobile-content order-1 lg:order-2 space-y-6 sm:space-y-8">
            <div className="mobile-header">
              <p className="text-blue-400 font-medium text-xs sm:text-sm tracking-widest uppercase mb-4 sm:mb-6">Trade on the Go</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                Trade on the go with our mobile app
              </h2>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg mt-4 sm:mt-6">
                Full access to your account and all trading features directly from your smartphone or tablet.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600/20 border border-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Apple className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm sm:text-base">iOS App</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Available on Apple App Store</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600/20 border border-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm sm:text-base">Android App</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Available on Google Play Store</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105">
                <Download className="w-5 h-5" />
                Download App
              </button>
              <button className="px-6 py-3 border-2 border-gray-600 hover:border-blue-400 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
