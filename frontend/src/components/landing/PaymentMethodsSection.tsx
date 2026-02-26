'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function PaymentMethodsSection() {
  const methods = [
    { name: 'Debit Card', icon: '💳' },
    { name: 'Credit Card', icon: '🎫' },
    { name: 'Bank Transfer', icon: '🏦' },
    { name: 'E-Wallet', icon: '📱' },
    { name: 'Crypto', icon: '₿' },
    { name: 'Skrill', icon: '💰' },
  ];

  useEffect(() => {
    gsap.from('.payment-header', {
      scrollTrigger: {
        trigger: '.payment-header',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 30,
    });

    gsap.from('.payment-method', {
      scrollTrigger: {
        trigger: '.payment-methods',
        start: 'top 80%',
        once: true,
      },
      duration: 0.6,
      opacity: 0,
      scale: 0.9,
      stagger: 0.1,
    });
  }, []);

  return (
    <section className="py-32 px-6 bg-gradient-to-b from-black to-gray-950 border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 payment-header text-center">
          <h2 className="text-5xl md:text-6xl font-black text-white leading-tight mb-8">
            Multiple deposit & withdrawal methods
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-8 payment-methods">
          {methods.map((method, index) => (
            <div
              key={index}
              className="payment-method bg-gray-900/50 border border-gray-800 hover:border-blue-600 px-8 py-6 rounded-lg transition-all duration-300 group hover:shadow-lg hover:shadow-blue-600/20 flex flex-col items-center gap-3"
            >
              <span className="text-4xl">{method.icon}</span>
              <p className="text-white font-semibold group-hover:text-blue-400 transition-colors">{method.name}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105">
            View All Payment Methods
          </button>
        </div>
      </div>
    </section>
  );
}
