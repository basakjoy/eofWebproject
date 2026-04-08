'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import { 
  Award, 
  Users, 
  Target, 
  TrendingUp, 
  ChevronRight, 
  ShieldCheck, 
  Globe, 
  Zap,
  ArrowRight
} from 'lucide-react';

// Reusable Components defined locally for the artifact
const Card = memo(({ children, className = "", hover = false }: { children: React.ReactNode; className?: string; hover?: boolean }) => (
  <div className={`bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between h-full ${hover ? 'hover:border-indigo-500/50 hover:bg-zinc-900/80 hover:-translate-y-1' : ''} ${className}`}>
    {children}
  </div>
));
Card.displayName = 'Card';

const Button = memo(({ children, variant = "primary", size = "md", className = "" }: { children: React.ReactNode; variant?: "primary" | "gradient" | "outline"; size?: "sm" | "md" | "lg"; className?: string }) => {
  const variants: Record<"primary" | "gradient" | "outline", string> = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    gradient: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20",
    outline: "border border-white/20 hover:bg-white/10 text-white"
  };
  const sizes: Record<"sm" | "md" | "lg", string> = {
    sm: "px-4 py-2 text-sm min-h-[44px]",
    md: "px-6 py-3 min-h-[44px]",
    lg: "px-8 py-4 text-lg font-semibold min-h-[48px]"
  };
  
  return (
    <button className={`rounded-full transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
});
Button.displayName = 'Button';

const teamMembers = [
  {
    name: 'John Smith',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=500',
    bio: '15+ years in forex trading and financial markets',
  },
  {
    name: 'Sarah Johnson',
    role: 'Chief Trader',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=500',
    bio: 'Expert in technical analysis with proven track record',
  },
  {
    name: 'Mike Chen',
    role: 'Risk Manager',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=500',
    bio: 'Specialized in portfolio risk management',
  },
  {
    name: 'Emma Davis',
    role: 'Head of Education',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=500',
    bio: 'Trading educator with 10+ years experience',
  },
];

const trackRecord = [
  { year: '2020', aum: '$10M', returns: '+8.5%' },
  { year: '2021', aum: '$35M', returns: '+11.2%' },
  { year: '2022', aum: '$80M', returns: '+9.8%' },
  { year: '2023', aum: '$150M', returns: '+13.5%' },
  { year: '2024', aum: '$250M', returns: '+12.8%' },
];

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [gsapLoaded, setGsapLoaded] = useState(false);

  // Load GSAP libraries
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
            s.src = src;
            s.async = true;
            s.onload = res;
            document.head.appendChild(s);
          });
        }
      }
      if (mounted) setGsapLoaded(true);
    };

    loadScripts();
    return () => { mounted = false; };
  }, []);

  // Handle scroll state
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply GSAP animations
  useEffect(() => {
    if (!gsapLoaded || !window.gsap) return;
    const gsap = window.gsap as any;
    const ScrollTrigger = gsap.ScrollTrigger as any;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Respect prefers-reduced-motion
      if (prefersReducedMotion) {
        gsap.set('[data-animate]', { opacity: 1, y: 0, x: 0 });
        return;
      }

      // Hero Content - Staggered fade in
      gsap.from('.hero-content > *', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Floating Stats - Fade in with subtle movement
      gsap.from('.floating-stat', {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        delay: 0.3,
        ease: 'power2.out',
      });

      // Story section - Image and text from sides
      gsap.from('.story-image', {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.story-section',
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      gsap.from('.story-content', {
        x: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.story-section',
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // Feature items - Slide up
      gsap.from('.feature-item', {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.feature-items',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      // Team members - Fade in with scale
      gsap.from('.team-member', {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.team-section',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      // Mission/Vision cards - Slide up
      gsap.from('.mission-vision-card', {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.mission-vision',
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      // Performance cards - Staggered slide up
      gsap.from('.performance-card', {
        y: 45,
        opacity: 0,
        stagger: 0.06,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.performance-grid',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      // CTA Section - Fade and scale
      gsap.from('.cta-content', {
        y: 50,
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      // Smooth parallax on background
      gsap.to('.cta-section', {
        backgroundPosition: '50% 100%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.cta-section',
          scrub: 1,
          start: 'top bottom',
          end: 'bottom top',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [gsapLoaded]);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30">
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1611974717482-98ea25251749?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-40"
            alt="Trading Desk Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/20 to-black"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center hero-content">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6 animate-fade-in">
            <ShieldCheck size={16} />
            <span>Regulated & Trusted Worldwide</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-tight">
            THE EMPIRE OF <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              MODERN FOREX
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            We've redefined the trading experience by bridging the gap between institutional expertise and retail traders. Founded in 2020, powered by precision.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-6 w-full sm:w-auto">
            <Button variant="gradient" size="lg" className="w-full sm:w-auto h-12 sm:h-auto flex items-center justify-center">
              Start Trading Now
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 sm:h-auto flex items-center justify-center gap-2">
              View Performance <ArrowRight size={20} />
            </Button>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-1 left-0 right-0 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-4 gap-8">
            {[
              { label: 'Active Traders', value: '12K+' },
              { label: 'Success Rate', value: '87%' },
              { label: 'Assets Managed', value: '$250M' },
              { label: 'Support', value: '24/7' },
            ].map((stat, i) => (
              <div key={i} className="text-center flex flex-col items-center justify-center floating-stat">
                <p className="text-zinc-500 text-sm uppercase tracking-widest mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-32 bg-zinc-950 relative overflow-hidden story-section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-stretch">
            <div className="relative story-image">
              <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                  className="w-full h-full object-cover"
                  alt="Market Analysis"
                />
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-indigo-600/20 blur-[100px] -z-10 rounded-full"></div>
              <Card className="absolute -bottom-8 -right-8 w-64 hidden md:block shadow-2xl shadow-black/30">
                <div className="flex items-center gap-3 text-indigo-400 mb-3">
                  <TrendingUp size={24} />
                  <span className="font-bold">Growth</span>
                </div>
                <p className="text-sm text-zinc-400 italic">"Scaling wealth through data-driven precision since day one."</p>
              </Card>
            </div>

            <div className="space-y-8 story-content">
              <div>
                <h2 className="text-indigo-400 font-bold tracking-widest uppercase text-sm mb-4">Our Legacy</h2>
                <h3 className="text-4xl md:text-5xl font-bold mb-6">Democratizing Professional Markets</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  Founded in 2020, Empire of Forex emerged from a vision to provide retail traders with the same technical arsenal used by institutional hedge funds. 
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-8 feature-items">
                {[
                  { icon: <Zap className="text-yellow-400" />, title: "Instant Execution", desc: "Nano-second latency on all trade signals." },
                  { icon: <Globe className="text-blue-400" />, title: "Global Access", desc: "Available across 40+ countries and timezones." }
                ].map((item, i) => (
                  <div key={i} className="space-y-3 flex flex-col feature-item">
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-2">
                      {item.icon}
                    </div>
                    <h4 className="font-bold text-white text-lg">{item.title}</h4>
                    <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <p className="text-zinc-400 mb-6 italic border-l-2 border-indigo-500 pl-4">
                  "What started as a small team of 3 traders has grown into a powerhouse managing over $250M in assets."
                </p>
                <Button variant="outline">Learn Our Philosophy</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 bg-black team-section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-indigo-400 font-bold tracking-widest uppercase text-sm mb-4">The Minds</h2>
              <h3 className="text-4xl md:text-5xl font-bold leading-tight">Guided by Experts</h3>
            </div>
            <p className="text-zinc-400 max-w-sm flex-shrink-0">
              Our leadership brings decades of collective experience from top-tier financial institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {teamMembers.map((member, i) => (
              <div key={i} className="group relative team-member">
                <div className="relative h-[450px] w-full rounded-2xl overflow-hidden mb-6">
                  <img 
                    src={member.image} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    alt={member.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h4 className="text-xl font-bold text-white">{member.name}</h4>
                    <p className="text-indigo-400 text-sm font-medium">{member.role}</p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <p className="text-zinc-400 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision (Interlocking Cards) */}
      <section className="py-32 bg-zinc-950 mission-vision">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-0 bg-white/5 rounded-3xl overflow-hidden border border-white/5">
            <div className="p-12 md:p-20 bg-zinc-950 hover:bg-zinc-900 transition-colors duration-500 border-r border-white/5 flex flex-col justify-between h-full mission-vision-card">
              <div>
                <Target className="w-12 h-12 text-indigo-500 mb-8" />
                <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                  To empower retail traders with professional-grade tools, education, and signals, enabling them to build consistent wealth through forex trading. We're committed to transparency, fairness, and continuous innovation.
                </p>
              </div>
              <div className="flex items-center gap-2 text-indigo-400 font-bold cursor-pointer group">
                Read our manifesto <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/>
              </div>
            </div>
            <div className="p-12 md:p-20 bg-zinc-950 hover:bg-zinc-900 transition-colors duration-500 flex flex-col justify-between h-full mission-vision-card">
              <div>
                <Award className="w-12 h-12 text-purple-500 mb-8" />
                <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                  To become the world's most trusted forex trading platform, where every trader has access to institutional-quality research, signals, and risk management tools regardless of their capital size.
                </p>
              </div>
              <div className="flex items-center gap-2 text-purple-400 font-bold cursor-pointer group">
                Future roadmap <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Track Record (Performance Grid) */}
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-indigo-400 font-bold tracking-widest uppercase text-sm mb-4">Performance</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Historical Excellence</h3>
            <p className="text-zinc-500 max-w-xl mx-auto italic text-base">Standard audited results. Past performance is not indicative of future results.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full performance-grid">
            {trackRecord.map((record, i) => (
              <Card key={i} hover className="text-center group overflow-hidden relative performance-card">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <p className="text-sm font-bold text-zinc-500 uppercase tracking-tighter mb-4">{record.year}</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">AUM</p>
                    <p className="text-xl font-black text-white">{record.aum}</p>
                  </div>
                  <div className="bg-emerald-500/10 py-2 rounded-xl">
                    <p className="text-emerald-400 font-black text-2xl">{record.returns}</p>
                    <p className="text-emerald-500/60 text-[10px] uppercase font-bold">Net Return</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-40 relative overflow-hidden cta-section">
        <div className="absolute inset-0 bg-indigo-600">
           <img 
            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover mix-blend-overlay opacity-30"
            alt="Skyline"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center flex flex-col items-center justify-center cta-content">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">BUILD YOUR EMPIRE TODAY</h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join 12,000+ traders already profiting from our institutional-grade signals and risk management software.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-8 w-full sm:w-auto">
            <button className="bg-white text-indigo-600 px-10 py-3 sm:py-4 rounded-full font-black text-lg hover:bg-zinc-100 transition-all shadow-2xl shadow-black/20 uppercase tracking-wider h-12 sm:h-auto ">
              Create Free Account
            </button>
            <button className="text-white font-bold border-b-2 border-white/30 hover:border-white transition-all py-2 sm:pb-1 uppercase tracking-wider">
              Contact Treasury
            </button>
          </div>
        </div>
      </section>

      
    </div>
  );
}