'use client';

import { Star } from 'lucide-react';

export default function KeyMetrics() {
  const stats = [
    { value: '130+', label: 'Countries' },
    { value: '34K+', label: 'Qualified Analysis' },
    { value: '320+', label: 'Traders' },
    { value: '17K', label: 'Virtual Strategies' },
    { value: '$320M+', label: 'Performance Fee' },
  ];

  // Text-based marks, matching your original placeholder style —
  // swap these strings for real client/partner names whenever you have them.
  const logos = [
    '★ AlphaCorp',
    '❖ Aurora Funds',
    '░▒ Beta Investments',
    '⚡ Gamma Capital',
    '⬡ Delta Partners',
  ];

  // Duplicated so the track can loop seamlessly at -50%.
  const logoTrack = [...logos, ...logos];

  return (
    <section className="bg-[#050508] py-16 border-t border-b border-white/5 relative z-10 overflow-hidden">
      <div className="max-w-site mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">

        {/* Rating Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.04] border border-white/10 text-xs">
            <span className="font-semibold text-white">Excellent</span>
            <div className="flex items-center gap-0.5 text-emerald-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-emerald-400 text-emerald-400" />
              ))}
            </div>
            <span className="text-[#8E8E93] text-[11px]">TurstPilot</span>
          </div>
        </div>

        {/* 5 Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-7 sm:gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1.5">
              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                {stat.value}
              </h3>
              <p className="text-xs sm:text-sm text-[#8E8E93] font-normal">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Marquee */}
        <div className="pt-8 space-y-6">
          <p className="text-center text-xs text-[#8E8E93] font-medium tracking-wider uppercase">
            Trusted by 240+ Companies
          </p>

          <div
            className="group relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0,black_96px,black_calc(100%-96px),transparent_100%)]"
          >
            <div className="flex items-center w-max animate-marquee group-hover:[animation-play-state:paused]">
              {logoTrack.map((logo, index) => (
                <span
                  key={index}
                  className="px-6 sm:px-10 shrink-0 text-base sm:text-lg font-bold tracking-widest text-white/70 uppercase grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}