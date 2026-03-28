'use client';

import { ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function IntroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {

    if(videoRef.current){
      videoRef.current.playbackRate = 0.8;
    }
    const tl = gsap.timeline();

    

    tl.from('.intro-badge', {
      duration: 0.6,
      opacity: 0,
      y: 20,
    });

    tl.from('.intro-title', {
      duration: 1,
      opacity: 0,
      y: 40,
      stagger: 0.2,
    }, '-=0.4');

    tl.from('.intro-description', {
      duration: 0.8,
      opacity: 0,
      y: 20,
    }, '-=0.6');

    tl.from('.intro-cta', {
      duration: 0.8,
      opacity: 0,
      y: 20,
    }, '-=0.5');
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 sm:pt-32 pb-12 sm:pb-24 relative overflow-hidden">
      <video ref={videoRef} autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover opacity-70 pointer-events-none"> 
        <source src="/videos/introvid1.mp4" type="video/mp4"/>
      </video>
      <div className="absolute inset-0 "></div>


      <div className="max-w-5xl mx-auto w-full text-center relative z-10">
        <div className="space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-3 intro-badge px-3 sm:px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
            <span className="text-blue-400 font-medium text-xs sm:text-sm">Go for Premium</span>
          </div>

          <h1 className="intro-title text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white leading-tight">
            Built for
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Traders
            </span>
            {' '}and 
            <br />
            Trusted by  <span className="text-green-400">Investors</span>
          </h1>

          <p className="intro-description text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed px-2">
                We combine expert forex trading strategies, real-time market analysis, and proven risk control to deliver consistent performance giving investors clarity, security, and confidence at every step. </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center intro-cta pt-6 sm:pt-8">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm sm:text-base rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-600/50"
            >
              Start Trading
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-600 hover:border-blue-400 text-white font-semibold text-sm sm:text-base rounded-lg transition-all duration-300 hover:scale-105"
            >
              Invest Your Funds
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
