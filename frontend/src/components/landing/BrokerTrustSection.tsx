'use client';

import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BrokerTrustSection() {
  const features = [
    'Risk-managed approach to protect capital.',
    'Discipline over guarantees.',
    'Advanced risk management tools for investors.',
    '24/7 professional customer support.',
    'Clear, easy-to-understand signals and insights.',
    'Our platform supports trade and investment needs.',
  ];

  useEffect(() => {
    gsap.from('.broker-header', {
      scrollTrigger: {
        trigger: '.broker-header',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 30,
    });

    gsap.from('.broker-content', {
      scrollTrigger: {
        trigger: '.broker-content',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 40,
    });

    gsap.from('.feature-item', {
      scrollTrigger: {
        trigger: '.feature-items',
        start: 'top 80%',
        once: true,
      },
      duration: 0.6,
      opacity: 0,
      x: -20,
      stagger: 0.1,
    });
  }, []);

  return (
    <section className="py-12 sm:py-20 md:py-32 px-4 sm:px-6 bg-gradient-to-b from-black to-gray-950 border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 md:gap-16 items-center">
          {/* Left - Content */}
          <div className="space-y-8 broker-content">
            <div className="broker-header">
              <p className="text-blue-400 font-medium text-xs sm:text-sm tracking-widest uppercase mb-4 sm:mb-6">Why Choose Us</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                A platform you can trust
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4 feature-items">
              {features.map((feature, index) => (
                <div key={index} className="feature-item flex items-start gap-3 sm:gap-4">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0 mt-1" />
                  <p className="text-gray-300 text-sm sm:text-base md:text-lg">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Image/Card */}
          <div className="broker-content">
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <p className="text-gray-400 text-sm mb-2">Portfolio Value</p>
                  <p className="text-white text-3xl font-bold">$124,580</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Daily Profit</p>
                    <p className="text-green-400 text-2xl font-bold">+$560</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">R:R</p>
                    <p className="text-blue-400 text-2xl font-bold">1:2+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
