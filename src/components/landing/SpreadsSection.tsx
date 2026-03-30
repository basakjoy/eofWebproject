'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SpreadsSection() {
  const spreads = [
    {
      pair: 'EUR/USD',
      spread: '0.3',
      commission: 'No',
      leverage: '1:500',
      margin: '0.2%',
    },
    {
      pair: 'GBP/USD',
      spread: '0.5',
      commission: 'No',
      leverage: '1:500',
      margin: '0.2%',
    },
    {
      pair: 'USD/JPY',
      spread: '0.8',
      commission: 'No',
      leverage: '1:500',
      margin: '0.2%',
    },
    {
      pair: 'AUD/USD',
      spread: '0.8',
      commission: 'No',
      leverage: '1:500',
      margin: '0.2%',
    },
    {
      pair: 'GOLD',
      spread: '0.30',
      commission: 'No',
      leverage: '1:200',
      margin: '0.5%',
    },
    {
      pair: 'Crude Oil',
      spread: '0.05',
      commission: 'No',
      leverage: '1:100',
      margin: '1%',
    },
  ];

  useEffect(() => {
    gsap.from('.spreads-header', {
      scrollTrigger: {
        trigger: '.spreads-header',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 30,
    });

    gsap.from('.spreads-table', {
      scrollTrigger: {
        trigger: '.spreads-table',
        start: 'top 80%',
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      y: 40,
    });
  }, []);

  return (
    <section className="py-12 sm:py-20 md:py-32 px-4 sm:px-6 bg-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 sm:mb-20 md:mb-24 spreads-header text-center">
          <p className="text-blue-400 font-medium text-xs sm:text-sm tracking-widest uppercase mb-4 sm:mb-6">Competitive Pricing</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
            Take advantage of tight spreads
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg mt-4 sm:mt-6 max-w-2xl mx-auto">
            Trade with the tightest spreads in the industry. No hidden fees, no commission.
          </p>
        </div>

        <div className="spreads-table overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-4 px-6 text-gray-400 font-semibold">Instrument</th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold">Spread</th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold">Commission</th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold">Leverage</th>
                <th className="text-left py-4 px-6 text-gray-400 font-semibold">Min Margin</th>
              </tr>
            </thead>
            <tbody>
              {spreads.map((item, index) => (
                <tr key={index} className="border-b border-gray-900 hover:bg-gray-900/50 transition-colors">
                  <td className="py-4 px-6 text-white font-medium">{item.pair}</td>
                  <td className="py-4 px-6 text-green-400 font-semibold">{item.spread}</td>
                  <td className="py-4 px-6 text-blue-400">{item.commission}</td>
                  <td className="py-4 px-6 text-gray-300">{item.leverage}</td>
                  <td className="py-4 px-6 text-gray-300">{item.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105">
            Open Live Account
          </button>
          <button className="px-8 py-3 border-2 border-gray-600 hover:border-blue-400 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105">
            View All Instruments
          </button>
        </div>
      </div>
    </section>
  );
}
