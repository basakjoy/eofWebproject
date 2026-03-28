'use client';

import { Award } from 'lucide-react';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WinsSection() {
  const wins = [
    { year: '2023', title: 'Best Trading Platform' },
    { year: '2023', title: 'Most Reliable Broker' },
    { year: '2022', title: 'Best Customer Service' },
    { year: '2022', title: 'Innovation Award' },
    { year: '2021', title: 'Best Signals Provider' },
    { year: '2021', title: 'Top Rated Broker' },
  ];

  useEffect(() => {
    gsap.from('.wins-header', {
      scrollTrigger: {
        trigger: '.wins-header',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 30,
    });

    gsap.from('.win-card', {
      scrollTrigger: {
        trigger: '.wins-container',
        start: 'top 80%',
        once: true,
      },
      duration: 0.6,
      opacity: 0,
      y: 30,
      stagger: 0.1,
    });
  }, []);

  return (
    <section className="py-12 sm:py-20 md:py-32 px-4 sm:px-6 bg-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 sm:mb-20 md:mb-24 wins-header text-center">
          <p className="text-blue-400 font-medium text-xs sm:text-sm tracking-widest uppercase mb-4 sm:mb-6">Our Achievements</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
            Our latest wins
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 wins-container">
          {wins.map((win, index) => (
            <div
              key={index}
              className="win-card bg-gradient-to-br from-blue-900/20 to-blue-950/40 border border-blue-800/50 hover:border-blue-600 p-8 rounded-xl transition-all duration-300 group hover:shadow-lg hover:shadow-blue-600/20 flex flex-col items-center justify-center text-center"
            >
              <Award className="w-12 h-12 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-blue-400 text-sm font-medium mb-2">{win.year}</p>
              <p className="text-white text-xl font-bold group-hover:text-blue-400 transition-colors">{win.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
