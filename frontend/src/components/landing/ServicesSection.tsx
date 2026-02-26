'use client';

import { BarChart3, TrendingUp, Shield, Zap } from 'lucide-react';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
  const services = [
    {
      number: '01',
      title: 'Trading Signals',
      description: 'AI-powered market signals with real-time notifications and accuracy metrics for strategic entries.',
      icon: TrendingUp,
    },
    {
      number: '02',
      title: 'Portfolio Management',
      description: 'Complete portfolio tracking with analytics, risk assessment, and automated rebalancing tools.',
      icon: BarChart3,
    },
    {
      number: '03',
      title: 'Risk Protection',
      description: 'Advanced risk management with stop-loss strategies and portfolio insurance solutions.',
      icon: Shield,
    },
    {
      number: '04',
      title: 'Lightning Fast',
      description: 'Millisecond execution speeds with advanced infrastructure for optimal trading performance.',
      icon: Zap,
    },
  ];

  useEffect(() => {
    // Animate section header
    gsap.from('.services-header', {
      scrollTrigger: {
        trigger: '.services-header',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 30,
    });

    // Animate service cards with stagger
    gsap.from('.service-card', {
      scrollTrigger: {
        trigger: '.services-container',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 40,
      stagger: 0.15,
    });
  }, []);

  return (
    <section className="py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 services-header">
          <p className="text-blue-400 font-medium text-sm tracking-widest uppercase mb-6">Our Services</p>
          <h2 className="text-7xl md:text-8xl font-black text-white leading-tight max-w-3xl">
            We Create What Others Can't
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 services-container">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.number}
                className="service-card group border-l-4 border-blue-600 pl-8 py-8 hover:border-blue-400 transition-all duration-300 hover:translate-x-2"
              >
                <p className="text-6xl font-black text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
                  {service.number}
                </p>
                <Icon className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
