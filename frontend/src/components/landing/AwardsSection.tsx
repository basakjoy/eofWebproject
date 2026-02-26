'use client';

import { Award, Trophy } from 'lucide-react';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AwardsSection() {
  const awards = [
    {
      title: 'Best Forex Broker',
      year: '2023',
      badge: '🥇',
    },
    {
      title: 'Most Innovative Platform',
      year: '2023',
      badge: '🏆',
    },
    {
      title: 'Best Customer Service',
      year: '2022',
      badge: '⭐',
    },
  ];

  useEffect(() => {
    gsap.from('.awards-header', {
      scrollTrigger: {
        trigger: '.awards-header',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 30,
    });

    gsap.from('.award-item', {
      scrollTrigger: {
        trigger: '.awards-content',
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
    <section className="py-32 px-6 bg-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 awards-header text-center">
          <p className="text-blue-400 font-medium text-sm tracking-widest uppercase mb-6">Recognition</p>
          <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
            An award-winning broker
          </h2>
          <p className="text-gray-400 text-lg mt-6 max-w-2xl mx-auto">
            Recognized globally for our commitment to excellence, innovation, and customer satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 awards-content">
          {/* Awards Display */}
          <div className="flex items-center justify-center">
            <div className="space-y-6">
              {awards.map((award, index) => (
                <div key={index} className="award-item flex items-center gap-4">
                  <span className="text-5xl">{award.badge}</span>
                  <div>
                    <p className="text-white font-bold text-lg">{award.title}</p>
                    <p className="text-gray-500 text-sm">{award.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Award Display */}
          <div className="md:col-span-2 bg-gradient-to-br from-blue-900/20 to-blue-950/40 border border-blue-800/50 rounded-2xl p-12 flex items-center justify-center min-h-96">
            <div className="text-center space-y-6">
              <Trophy className="w-32 h-32 text-yellow-400 mx-auto" />
              <div>
                <p className="text-gray-400 text-sm mb-2">Industry Recognition</p>
                <h3 className="text-white text-2xl font-bold">Best Forex Trading Platform 2023-2024</h3>
              </div>
              <p className="text-gray-400 max-w-xl">
                Awarded by leading financial publications for innovation, reliability, and customer-centric approach
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
