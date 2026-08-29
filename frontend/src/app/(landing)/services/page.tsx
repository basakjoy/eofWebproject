'use client';

import React from 'react';
import {
  TrendingUp,
  Briefcase,
  BarChart3,
  BookOpen,
  Shield,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Zap,
  Target,
  Activity,
  LineChart,
  Globe,
  Lock,
  Star,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

/* ── Service Data ── */
const SERVICES = [
  {
    icon: TrendingUp,
    title: 'Trading Signals',
    subtitle: 'Real-Time Institutional Alerts',
    description:
      'Institutional-grade forex signals delivered in real-time. We combine algorithmic precision with human expertise to identify high-probability entry points across Forex, Crypto, and Commodities.',
    accent: 'from-fiery-orange to-fiery-amber',
    iconBg: 'bg-fiery-orange/10',
    iconBorder: 'border-fiery-orange/20',
    iconColor: 'text-fiery-orange',
    benefits: [
      'Real-time delivery via Private Portal & Telegram',
      'Precise entry, stop-loss, and TP targets',
      'Proprietary multi-timeframe confluence framework',
      'Cross-asset correlation analysis',
      'Historical accuracy tracking & audit logs',
    ],
    highlight: 'from-fiery-orange/5 to-fiery-amber/5',
    highlightBorder: 'border-fiery-orange/20',
  },
  {
    icon: Briefcase,
    title: 'Fund Management',
    subtitle: 'Passive Institutional Exposure',
    description:
      'For high-net-worth individuals seeking passive exposure to currency markets. Our professional desk handles execution while you retain full oversight, transparency, and withdrawal access at all times.',
    accent: 'from-emerald-500 to-cyan-400',
    iconBg: 'bg-emerald-500/10',
    iconBorder: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
    benefits: [
      'Institutional execution strategies',
      'Bi-weekly performance audit reports',
      'Direct account management access',
      'Zero hidden fee structures',
      'Risk-adjusted, drawdown-protected growth',
    ],
    highlight: 'from-emerald-500/5 to-cyan-400/5',
    highlightBorder: 'border-emerald-500/20',
  },
  {
    icon: BarChart3,
    title: 'Portfolio Optimization',
    subtitle: 'Advanced Capital Allocation',
    description:
      'Advanced analytics tools designed to stress-test your holdings. We help you identify hidden risks, optimize capital allocation, and rebalance dynamically using institutional-grade quantitative models.',
    accent: 'from-violet-500 to-indigo-400',
    iconBg: 'bg-violet-500/10',
    iconBorder: 'border-violet-500/20',
    iconColor: 'text-violet-400',
    benefits: [
      'Multi-broker portfolio synchronization',
      'Volatility surface modeling & stress testing',
      'Automated rebalancing alerts',
      'Custom risk-limit dashboards',
      'Correlation heatmaps & drawdown analysis',
    ],
    highlight: 'from-violet-500/5 to-indigo-400/5',
    highlightBorder: 'border-violet-500/20',
  },
  {
    icon: BookOpen,
    title: 'Trading Education',
    subtitle: 'From Beginner to Institutional',
    description:
      'Structured learning pathways that take you from basics to advanced institutional strategies. Our educators have combined decades of live market experience across Forex, Crypto, and Indices.',
    accent: 'from-fiery-amber to-yellow-400',
    iconBg: 'bg-fiery-amber/10',
    iconBorder: 'border-fiery-amber/20',
    iconColor: 'text-fiery-amber',
    benefits: [
      'Beginner-to-advanced structured curriculum',
      'Live weekly market analysis sessions',
      'Private mentorship programs',
      'Pattern recognition & psychology training',
      'Backtesting workshops with real data',
    ],
    highlight: 'from-fiery-amber/5 to-yellow-400/5',
    highlightBorder: 'border-fiery-amber/20',
  },
];

/* ── Tier Data ── */
const TIERS = [
  {
    name: 'Standard',
    price: 'Free',
    period: '',
    desc: 'Essential tools for the retail trader starting their journey.',
    services: ['Basic Signals (Limited)', 'Daily Market Briefing', 'Educational Hub Access', 'Community Forum'],
    cta: 'Get Started Free',
    href: '/register',
    featured: false,
  },
  {
    name: 'Professional',
    price: '$99',
    period: '/mo',
    desc: 'Full institutional desk access for serious retail traders.',
    services: ['Unlimited Premium Signals', 'Portfolio Tracker & Analytics', 'Risk Calculator & Manager', 'Priority Real-Time Alerts', 'Telegram Signal Channel', '1-on-1 Onboarding Call'],
    cta: 'Start Professional',
    href: '/register',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Bespoke solutions for large capital and institutional clients.',
    services: ['Full Fund Management', 'Dedicated Account Manager', 'API Execution Access', 'White-label Solutions', 'Custom Risk Profiles', '24/7 Priority Support'],
    cta: 'Contact Our Desk',
    href: '/contact',
    featured: false,
  },
];

const WHY_US = [
  { icon: ShieldCheck, title: 'Audited & Transparent', desc: 'All signals publicly tracked. No cherry-picked results, ever.' },
  { icon: Zap, title: 'Real-Time Delivery', desc: 'Instant push notifications via portal, Telegram, and email.' },
  { icon: Target, title: '87% Win Rate', desc: 'Consistently above industry average with full historical logs.' },
  { icon: Globe, title: 'Global Coverage', desc: '40+ countries. 24/7 operations. Multi-language support.' },
  { icon: LineChart, title: 'Multi-Asset', desc: 'Forex, Crypto, Metals, Indices — all in one platform.' },
  { icon: Lock, title: 'Bank-Grade Security', desc: 'End-to-end encryption. Your capital, always protected.' },
];

export default function ServicesPage() {
  return (
    <div className="w-full min-h-screen bg-[#030305] text-white font-poppins overflow-x-hidden">

      {/* ── Ambient Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 right-[-15%] w-[700px] h-[700px] bg-[#FF6B00]/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#FF3D00]/6 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10">

        {/* ══ HERO ══ */}
        <section className="pt-32 pb-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fiery-orange/10 border border-fiery-orange/20 text-xs font-bold text-fiery-orange mb-8"
            >
              <Activity className="w-3.5 h-3.5" />
              COMPLETE SUITE · INSTITUTIONAL INFRASTRUCTURE
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.05] tracking-tight mb-6"
            >
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8C00] to-[#FFB800]">
                Services
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto font-light"
            >
              From algorithmic signals to fully managed capital solutions—we provide the
              institutional infrastructure required to dominate the global markets.
            </motion.p>
          </div>
        </section>

        {/* ══ SERVICES (Alternating) ══ */}
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-20 md:space-y-32">
            {SERVICES.map((service, idx) => (
              <div
                key={service.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center`}
              >
                {/* Info Column */}
                <motion.div
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className={`space-y-6 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}
                >
                  <div className={`inline-flex p-4 rounded-2xl ${service.iconBg} border ${service.iconBorder}`}>
                    <service.icon className={`w-8 h-8 ${service.iconColor}`} />
                  </div>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${service.iconColor}`}>
                      {service.subtitle}
                    </p>
                    <h2 className="text-4xl sm:text-5xl font-black mb-5 leading-tight">{service.title}</h2>
                    <p className="text-zinc-400 text-base leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <Link
                      href="/register"
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-fiery-orange/30 text-white font-semibold text-sm transition-all`}
                    >
                      Inquire for Details <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>

                {/* Benefits Card */}
                <motion.div
                  initial={{ opacity: 0, x: idx % 2 === 0 ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className={`${idx % 2 === 1 ? 'lg:order-1' : ''}`}
                >
                  <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${service.highlight} border ${service.highlightBorder} backdrop-blur-xl overflow-hidden`}>
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    {/* Glow accent */}
                    <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${service.accent} opacity-10 blur-[60px] rounded-full`} />

                    <h3 className="text-base font-extrabold text-white mb-6 flex items-center gap-3">
                      <span className={`w-1.5 h-5 bg-gradient-to-b ${service.accent} rounded-full`} />
                      Key Capabilities
                    </h3>
                    <ul className="space-y-4">
                      {service.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-3 group">
                          <div className={`mt-0.5 p-0.5 rounded-full ${service.iconBg} border ${service.iconBorder} flex-shrink-0`}>
                            <CheckCircle2 className={`w-4 h-4 ${service.iconColor}`} />
                          </div>
                          <span className="text-sm text-zinc-300 font-medium group-hover:text-white transition-colors">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ WHY CHOOSE US ══ */}
        <section className="py-24 px-4 sm:px-6 bg-[#0A0A0E]/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-bold text-fiery-orange uppercase tracking-widest mb-4">Why Empire of Forex</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                The Edge That Separates Us
              </h2>
              <p className="text-zinc-500 max-w-xl mx-auto">
                We don't just deliver signals — we deliver a complete trading infrastructure.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {WHY_US.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative p-7 rounded-3xl bg-[#0C0C10]/80 border border-white/[0.07] hover:border-fiery-orange/30 hover:shadow-[0_8px_32px_rgba(255,107,0,0.1)] transition-all group"
                >
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="p-3 rounded-2xl bg-fiery-orange/10 border border-fiery-orange/20 inline-flex mb-5 group-hover:bg-fiery-orange/20 transition-colors">
                    <item.icon className="w-5 h-5 text-fiery-orange" />
                  </div>
                  <h3 className="text-base font-extrabold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PRICING TIERS ══ */}
        <section className="py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-bold text-fiery-orange uppercase tracking-widest mb-4">Access Levels</p>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-zinc-500 max-w-xl mx-auto">
                Scalable solutions for every stage of your trading journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {TIERS.map((tier, i) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative flex flex-col rounded-3xl overflow-hidden border transition-all ${
                    tier.featured
                      ? 'border-fiery-orange/40 bg-gradient-to-b from-fiery-orange/5 to-[#0C0C10] shadow-fiery-lg md:scale-105 md:-translate-y-2 z-10'
                      : 'border-white/[0.07] bg-[#0C0C10]/80'
                  }`}
                >
                  {/* Top accent */}
                  {tier.featured && (
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-fiery-orange to-fiery-amber" />
                  )}

                  {/* Most Popular badge */}
                  {tier.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-fiery-orange to-fiery-amber text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-fiery">
                        <Star className="w-3 h-3 fill-black" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="p-8 flex flex-col flex-grow">
                    {/* Plan header */}
                    <div className="mb-6 pt-2">
                      <h3 className="text-xl font-black mb-1">{tier.name}</h3>
                      <p className="text-zinc-500 text-xs leading-snug">{tier.desc}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-8 flex items-baseline gap-1">
                      <span className={`text-4xl font-black ${tier.featured ? 'text-transparent bg-clip-text bg-gradient-to-r from-fiery-orange to-fiery-amber' : 'text-white'}`}>
                        {tier.price}
                      </span>
                      {tier.period && (
                        <span className="text-zinc-500 font-bold text-sm">{tier.period}</span>
                      )}
                    </div>

                    {/* Features */}
                    <div className="flex-grow space-y-3.5 mb-8">
                      {tier.services.map((svc) => (
                        <div key={svc} className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                            tier.featured ? 'bg-fiery-orange/20 border border-fiery-orange/30' : 'bg-white/[0.06] border border-white/10'
                          }`}>
                            <CheckCircle2 className={`w-3 h-3 ${tier.featured ? 'text-fiery-orange' : 'text-zinc-400'}`} />
                          </div>
                          <span className="text-sm text-zinc-300 font-medium">{svc}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link
                      href={tier.href}
                      className={`w-full py-3.5 rounded-2xl text-sm font-extrabold text-center transition-all hover:scale-[1.02] active:scale-[0.98] ${
                        tier.featured
                          ? 'bg-gradient-to-r from-fiery-orange to-fiery-amber text-black shadow-fiery'
                          : 'bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-fiery-orange/30 text-white'
                      }`}
                    >
                      {tier.cta}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#0C0C10] to-[#111116] border border-fiery-orange/20 p-12 sm:p-16 text-center">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-fiery-orange/10 rounded-full blur-[100px]" />
              </div>
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-fiery-orange/50 to-transparent" />
              <div className="relative z-10">
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                  Ready to Trade Like an Institution?
                </h2>
                <p className="text-zinc-400 max-w-lg mx-auto mb-8 font-light leading-relaxed">
                  Start with a free account and unlock the tools that 12,000+ traders
                  use to dominate the markets every day.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-fiery-orange to-fiery-amber text-black font-extrabold text-sm shadow-fiery hover:scale-105 transition-transform"
                  >
                    Start Free Today <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 hover:border-fiery-orange/40 text-white font-semibold text-sm transition-all"
                  >
                    About Us <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}