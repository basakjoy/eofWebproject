"use client";

import React, { useState, useEffect, useRef, memo } from 'react';
import { 
  TrendingUp, 
  Briefcase, 
  BarChart3, 
  BookOpen, 
  Shield, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';

// Memoized UI Components
const Card = memo(({ children, className = "", hover = false }: { children: React.ReactNode; className?: string; hover?: boolean }) => (
  <div className={`bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 transition-all duration-500 will-change-transform ${hover ? 'hover:border-indigo-500/40 hover:bg-zinc-900/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10' : ''} ${className}`}>
    {children}
  </div>
));

const Button = memo(({ children, variant = "primary", size = "md", className = "" }: { children: React.ReactNode; variant?: "primary" | "gradient" | "outline"; size?: "sm" | "md" | "lg"; className?: string }) => {
  const variants: Record<"primary" | "gradient" | "outline", string> = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    gradient: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20",
    outline: "border border-white/20 hover:bg-white/10 text-white backdrop-blur-sm"
  };
  const sizes: Record<"sm" | "md" | "lg", string> = {
    sm: "px-4 py-2 text-sm min-h-[44px]",
    md: "px-6 py-3 min-h-[44px]",
    lg: "px-8 py-4 text-lg font-bold min-h-[48px]"
  };
  
  return (
    <button className={`rounded-full transition-all duration-300 active:scale-95 will-change-transform flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
});

const SERVICE_DETAILS = [
  {
    icon: TrendingUp,
    title: 'Trading Signals',
    description: 'Institutional-grade forex signals delivered in real-time. We combine algorithmic precision with human expertise to identify high-probability entry points.',
    color: 'from-blue-500/20 to-indigo-500/20',
    iconColor: 'text-indigo-400',
    benefits: [
      'Real-time delivery via Private Portal',
      'Precise entry, SL, and TP targets',
      'Proprietary risk/reward framework',
      'Cross-asset correlation analysis',
      'Historical accuracy tracking',
    ],
  },
  {
    icon: Briefcase,
    title: 'Fund Management',
    description: 'For high-net-worth individuals seeking passive exposure to currency markets. Our professional desk handles execution while you retain full oversight.',
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-400',
    benefits: [
      'Institutional execution strategies',
      'Bi-weekly performance audits',
      'Direct account management access',
      'Zero management fee options',
      'Risk-adjusted growth focus',
    ],
  },
  {
    icon: BarChart3,
    title: 'Portfolio Optimization',
    description: 'Advanced analytics tools designed to stress-test your holdings. We help you identify hidden risks and optimize your capital allocation.',
    color: 'from-pink-500/20 to-rose-500/20',
    iconColor: 'text-pink-400',
    benefits: [
      'Multi-broker synchronization',
      'Volatility surface modeling',
      'Automated rebalancing alerts',
      'Custom risk-limit dashboards',
      'Correlation heat maps',
    ],
  },
];

const TIERS = [
  { name: 'Standard', price: 'Free', desc: 'Essential tools for the retail trader.', services: ['Basic Signals', 'Daily Market Briefing', 'Educational Hub'] },
  { name: 'Professional', price: '$99', desc: 'Full access to our institutional desk.', services: ['Premium Signals', 'Portfolio Tracker', 'Risk Management Tools', 'Priority Alerts'], featured: true },
  { name: 'Enterprise', price: 'Custom', desc: 'Bespoke solutions for large capital.', services: ['Fund Management', 'Dedicated Account Manager', 'API Execution Access'] },
];

export default function ServicesPage() {
  const containerRef = useRef(null);
  const [gsapLoaded, setGsapLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    const scripts = [
      'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'
    ];

    const loadScripts = async () => {
      for (const src of scripts) {
        if (!document.querySelector(`script[src="${src}"]`)) {
          await new Promise((res) => {
            const s = document.createElement('script');
            s.src = src; s.async = true; s.onload = res;
            document.head.appendChild(s);
          });
        }
      }
      if (mounted) setGsapLoaded(true);
    };

    loadScripts();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!gsapLoaded || !window.gsap) return;
    const gsap = window.gsap as any;
    const ScrollTrigger = gsap.ScrollTrigger as any;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from(".hero-content > *", {
        y: 40, opacity: 0, stagger: 0.15, duration: 1, ease: "power4.out"
      });

      // Service Section Animations
      gsap.utils.toArray(".service-row").forEach((row: any) => {
        gsap.from(row.querySelectorAll(".animate-item"), {
          x: (i: number) => i === 0 ? -40 : 40,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: row,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        });
      });

      // Pricing Cards
      gsap.from(".pricing-card", {
        y: 60, opacity: 0, stagger: 0.1, duration: 0.8,
        scrollTrigger: {
          trigger: ".pricing-grid",
          start: "top 85%"
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [gsapLoaded]);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden antialiased">
      
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-32 pb-12 md:pb-20 px-4">
        <div className="max-w-7xl mx-auto hero-content text-center">
          <div className="inline-flex items-center justify-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-bold uppercase tracking-widest mb-6 md:mb-8">
            <Sparkles size={14} className="text-indigo-400" />
            <span>Premium Trading Solutions</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 md:mb-8 leading-[0.9]">
            OUR <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              ECOSYSTEM
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed px-2">
            From algorithmic signals to fully managed capital solutions—we provide the institutional infrastructure required to dominate the global markets.
          </p>
        </div>
      </section>

      {/* Dynamic Services Section */}
      <section className="py-16 md:py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto space-y-16 md:space-y-32">
          {SERVICE_DETAILS.map((service, idx) => (
            <div 
              key={service.title} 
              className={`service-row grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Info Column */}
              <div className={`animate-item space-y-6 md:space-y-8 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} border border-white/10 flex items-center justify-center shadow-2xl`}>
                  <service.icon className={`w-8 h-8 ${service.iconColor}`} />
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 md:mb-6 tracking-tight leading-tight">{service.title}</h2>
                  <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                    {service.description}
                  </p>
                  <Button variant="outline" size="md">
                    Inquire for Details <ChevronRight size={18} />
                  </Button>
                </div>
              </div>

              {/* Benefits Card */}
              <div className={`animate-item ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <Card className="relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.color} blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity`} />
                  <h3 className="text-lg md:text-xl font-bold text-white mb-6 md:mb-8 flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                    Key Capabilities
                  </h3>
                  <ul className="grid sm:grid-cols-1 gap-4 md:gap-6">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-4 group/item">
                        <div className="mt-1 p-0.5 rounded-full bg-indigo-500/20 group-hover/item:bg-indigo-500/40 transition-colors flex-shrink-0">
                          <CheckCircle2 size={18} className="text-indigo-400" />
                        </div>
                        <span className="text-sm md:text-base text-zinc-300 font-medium group-hover/item:text-white transition-colors">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing / Tiers Section */}
      <section className="py-24 md:py-32 px-4 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">ACCESS LEVELS</h2>
            <p className="text-zinc-500 text-base md:text-lg">Scalable solutions for every stage of your trading journey.</p>
          </div>

          <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {TIERS.map((tier) => (
              <Card 
                key={tier.name} 
                className={`pricing-card relative flex flex-col p-8 md:p-10 ${tier.featured ? 'border-indigo-500/50 bg-indigo-500/[0.03] transform md:scale-105 z-20 shadow-2xl shadow-indigo-500/5' : ''}`}
              >
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 md:px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-6 md:mb-8">
                  <h3 className="text-xl md:text-2xl font-black mb-2">{tier.name}</h3>
                  <p className="text-zinc-500 text-xs md:text-sm leading-snug">{tier.desc}</p>
                </div>

                <div className="mb-8 md:mb-10 flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-black">{tier.price}</span>
                  {tier.price !== 'Custom' && <span className="text-zinc-500 font-bold text-xs md:text-sm">/mo</span>}
                </div>

                <div className="flex-grow space-y-3 md:space-y-4 mb-8 md:mb-10">
                  {tier.services.map((svc) => (
                    <div key={svc} className="flex items-center gap-3 text-xs md:text-sm text-zinc-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                      {svc}
                    </div>
                  ))}
                </div>

                <Button 
                  variant={tier.featured ? 'gradient' : 'outline'} 
                  className="w-full h-12 md:h-auto"
                >
                  {tier.price === 'Custom' ? 'Contact Desk' : 'Get Started'}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Final CTA */}
      

      
    </div>
  );
}