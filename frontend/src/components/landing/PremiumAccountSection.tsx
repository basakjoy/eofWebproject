'use client';

import { Crown, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PremiumAccountSection() {
  const benefits = [
    'Priority customer support',
    'Lower spreads and commissions',
    'Higher leverage up to 1:500',
    'Exclusive trading signals',
    'Personal account manager',
    'Access to VIP webinars',
  ];

  useEffect(() => {
    gsap.from('.premium-header', {
      scrollTrigger: {
        trigger: '.premium-header',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 30,
    });

    gsap.from('.premium-content', {
      scrollTrigger: {
        trigger: '.premium-content',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 40,
    });

    gsap.from('.benefit-item', {
      scrollTrigger: {
        trigger: '.benefits-list',
        start: 'top 80%',
        once: true,
      },
      duration: 0.6,
      opacity: 0,
      x: -20,
      stagger: 0.08,
    });
  }, []);

  return (
    <section className="py-32 px-6 bg-gradient-to-b from-gray-950 to-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image placeholder */}
          <div className="premium-content">
            <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-950/30 border border-yellow-800/50 rounded-2xl p-12 flex items-center justify-center h-96">
              <div className="text-center">
                <Crown className="w-24 h-24 text-yellow-400 mx-auto mb-4" />
                <p className="text-yellow-400 text-lg font-semibold">Premium Features</p>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="premium-content space-y-8">
            <div className="premium-header">
              <p className="text-blue-400 font-medium text-sm tracking-widest uppercase mb-6">Exclusive Access</p>
              <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
                A premium account for premium traders
              </h2>
              <p className="text-gray-400 text-lg mt-6">
                Unlock exclusive benefits and trade with an edge. Our premium membership offers enhanced tools and personalized support.
              </p>
            </div>

            <div className="space-y-3 benefits-list">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-item flex items-center gap-3">
                  <div className="w-5 h-5 bg-yellow-400/20 border border-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-3 h-3 text-yellow-400" />
                  </div>
                  <p className="text-gray-300">{benefit}</p>
                </div>
              ))}
            </div>

            <button className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-all duration-300 hover:scale-105 w-full">
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
