'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  Users,
  Target,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Globe,
  Zap,
  ArrowRight,
  BarChart3,
  Star,
  CheckCircle,
  Play,
  ArrowUpRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

/* ── Team Data ── */
const TEAM = [
  {
    name: 'John Smith',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=500',
    bio: '15+ years in institutional forex trading and financial markets strategy.',
    accent: 'from-fiery-orange to-fiery-amber',
  },
  {
    name: 'Sarah Johnson',
    role: 'Chief Trader',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=500',
    bio: 'Expert in technical analysis with a proven institutional track record.',
    accent: 'from-emerald-500 to-cyan-400',
  },
  {
    name: 'Mike Chen',
    role: 'Risk Manager',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=500',
    bio: 'Specialized in portfolio risk architecture and drawdown protection.',
    accent: 'from-rose-500 to-pink-400',
  },
  {
    name: 'Emma Davis',
    role: 'Head of Education',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=500',
    bio: 'Trading educator with 10+ years empowering retail traders globally.',
    accent: 'from-violet-500 to-indigo-400',
  },
];

const STATS = [
  { label: 'Active Traders', value: '12K+', icon: Users },
  { label: 'Win Rate', value: '87%', icon: Target },
  { label: 'AUM Managed', value: '$250M', icon: TrendingUp },
  { label: 'Founded', value: '2020', icon: Star },
];

const TRACK = [
  { year: '2020', aum: '$10M', returns: '+8.5%' },
  { year: '2021', aum: '$35M', returns: '+11.2%' },
  { year: '2022', aum: '$80M', returns: '+9.8%' },
  { year: '2023', aum: '$150M', returns: '+13.5%' },
  { year: '2024', aum: '$250M', returns: '+12.8%' },
];

const VALUES = [
  { icon: ShieldCheck, title: 'Transparency First', desc: 'All signals are logged, audited, and publicly accessible. No hidden results.' },
  { icon: Zap, title: 'Precision Execution', desc: 'Nano-second latency delivery across Telegram, email, and our private portal.' },
  { icon: Globe, title: 'Global Reach', desc: 'Available across 40+ countries with 24/7 multilingual support.' },
  { icon: BarChart3, title: 'Data-Driven', desc: 'Every trade decision is backed by multi-timeframe analysis and AI confluence.' },
];

export default function AboutPage() {
  return (
    <div className="w-full  min-h-screen bg-[#030305] text-white font-poppins overflow-x-hidden">

      {/* ── Ambient Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 right-[-15%] w-[800px] h-[800px] bg-[#FF6B00]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#FF3D00]/6 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 ">

        {/* ══ HERO ══ */}
        <section className="relative min-h-screen flex items-center pt-40 pb-20 px-4 sm:px-6 overflow-hidden">
          {/* Cinematic BG image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://res.cloudinary.com/bg6urken/image/upload/v1788524620/pexels-pavel-danilyuk-7658388.jpg"
              className="w-full h-full object-cover opacity-20"
              alt="Trading Desk"
            />
            
           
          </div>
          {/* Diagonal fiery beam */}
          <div
            className="absolute inset-0 opacity-20 z-0"
            style={{ backgroundImage: 'linear-gradient(115deg, transparent 30%, rgba(255,107,0,0.2) 50%, transparent 65%)' }}
          />

          <div className="max-w-7xl mx-auto w-full relative z-10">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fiery-orange/10 border border-fiery-orange/20 text-xs font-bold text-fiery-orange mb-8"
              >
                <Star className="w-3.5 h-3.5 fill-fiery-orange" />
                EST. 2020 · EMPIRE OF FOREX
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-6xl sm:text-7xl lg:text-[5.5rem]  text-white leading-[1.05] tracking-tight mb-6"
              >
                Built by Traders,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8C00] to-[#FFB800]">
                  For Traders
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg  leading-relaxed max-w-xl font-light mb-10"
              >
                We've redefined the trading experience by bridging the gap between
                institutional expertise and retail traders. Founded in 2020, powered by precision.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/register"
                  className="inline-flex items-center gap-3 px-12 py-5 rounded-full bg-white/[0.2] hover:bg-white/[0.08] border border-white/[0.07] hover:border-fiery-orange/30 text-white font-semibold text-sm transition-all"
                >
                   <ArrowUpRight size={10} className=" fill-black translate-x-[1px]" />
                  Join the Empire
                </Link>
                <Link
                  href="/trading-signals"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/[0.2] hover:bg-white/[0.08] border border-white/[0.07] hover:border-fiery-orange/30 text-white font-semibold text-sm transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-fiery-orange to-fiery-amber flex items-center justify-center shadow-fiery">
                    <Play size={10} className="fill-black translate-x-[1px]" />
                  </div>
                  See Live Signals
                </Link>
              </motion.div>
            </div>

            {/* Floating stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-20">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center p-6 rounded-2xl  border border-white/[0.07] backdrop-blur-xl"
                >
                  <stat.icon className="w-5 h-5 text-fiery-orange mx-auto mb-2" />
                  <p className="text-2xl  text-white">{stat.value}</p>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ OUR STORY ══ */}
        <section className="py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative rounded-[2rem] overflow-hidden border border-white/10 aspect-square shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
                  <img
                    src="https://res.cloudinary.com/bg6urken/image/upload/v1788523321/pexels-cottonbro-5483188.jpg"
                    className="w-full h-full object-cover"
                    alt="Market Analysis"
                  />
                  
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-6 -right-6 hidden md:block p-5 rounded-2xl  border border-white/[0.07] backdrop-blur-xl shadow-fiery">
                  <div className="flex items-center text-black gap-3 text- mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-bold text-sm">Growth Trajectory</span>
                  </div>
                  <p className="text-xs text-black italic max-w-[160px]">
                    "Scaling wealth through data-driven precision since day one."
                  </p>
                </div>
                {/* Ambient glow */}
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-fiery-orange/15 blur-[100px] -z-10 rounded-full" />
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div>
                  <p className="text-xs font-bold text-fiery-orange uppercase tracking-widest mb-4">Our Legacy</p>
                  <h2 className="text-4xl sm:text-5xl text-white mb-6 leading-tight">
                    Democratizing Professional Markets
                  </h2>
                  <p className="text-lg leading-relaxed">
                    Founded in 2020, Empire of Forex emerged from a vision to provide retail
                    traders with the same technical arsenal used by institutional hedge funds.
                    We believe every serious trader deserves professional-grade tools.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    { icon: Zap, title: 'Instant Execution', desc: 'Nano-second latency on all trade signal delivery systems.' },
                    { icon: Globe, title: 'Global Access', desc: 'Available across 40+ countries and timezones, 24/7.' },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="p-2.5 rounded-xl bg-fiery-orange/10 border border-fiery-orange/20 h-fit">
                        <item.icon className="w-5 h-5 text-fiery-orange" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                        <p className="text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-zinc-400 italic border-l-2 border-fiery-orange pl-4">
                  "What started as a small team of 3 traders has grown into a powerhouse
                  managing over $250M in assets for 12,000+ active members."
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ CORE VALUES ══ */}
        <section className="py-24 px-4 sm:px-6 bg-[#0A0A0E]/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-bold text-fiery-orange uppercase tracking-widest mb-4">What We Stand For</p>
              <h2 className="text-4xl sm:text-5xl  text-white mb-4">Our Core Values</h2>
              <p className="text-zinc-300 max-w-xl mx-auto">
                Everything we build is grounded in these four principles.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative p-7 rounded-3xl border border-white/[0.07] hover:border-fiery-orange/30 hover:shadow-[0_8px_32px_rgba(255,107,0,0.1)] transition-all group backdrop-blur-2xl"
                >
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="p-3 rounded-2xl bg-fiery-orange/10 border border-fiery-orange/20 inline-flex mb-5 group-hover:bg-fiery-orange/20 transition-colors">
                    <v.icon className="w-6 h-6 text-fiery-orange" />
                  </div>
                  <h3 className="text-base font-extrabold text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ TEAM ══ */}
        <section className="py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <p className="text-xs font-bold text-fiery-orange uppercase tracking-widest mb-4">The Minds</p>
                <h2 className="text-4xl sm:text-5xl text-white leading-tight">Guided by Experts</h2>
              </div>
              <p className=" max-w-sm text-sm">
                Our leadership brings decades of collective experience from top-tier financial institutions.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group relative"
                >
                  <div className="relative h-[420px] rounded-3xl overflow-hidden border border-white/10 mb-5">
                    <img
                      src={member.image}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt={member.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/30 to-transparent" />
                    {/* Bottom accent line */}
                    <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${member.accent}`} />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h4 className="text-lg text-white">{member.name}</h4>
                      <p className="text-fiery-orange text-xs font-semibold mt-0.5">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ MISSION / VISION ══ */}
        <section className="py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-white/[0.07]">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="p-12 md:p-16 bg-[#0C0C10] border-r border-white/[0.05] hover:bg-[#111116] transition-colors duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 rounded-2xl bg-fiery-orange/10 border border-fiery-orange/20 inline-flex mb-8">
                    <Target className="w-8 h-8 text-fiery-orange" />
                  </div>
                  <h3 className="text-3xl mb-6">Our Mission</h3>
                  <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                    To empower retail traders with professional-grade tools, education, and signals,
                    enabling them to build consistent wealth through forex trading. We're committed
                    to transparency, fairness, and continuous innovation.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-fiery-orange cursor-pointer group/link">
                  Read our manifesto <ChevronRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="p-12 md:p-16 bg-[#0C0C10] hover:bg-[#111116] transition-colors duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 rounded-2xl bg-fiery-amber/10 border border-fiery-amber/20 inline-flex mb-8">
                    <Award className="w-8 h-8 text-fiery-amber" />
                  </div>
                  <h3 className="text-3xl mb-6">Our Vision</h3>
                  <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                    To become the world's most trusted forex trading platform, where every trader
                    has access to institutional-quality research, signals, and risk management
                    tools regardless of their capital size.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-fiery-amber cursor-pointer group/link">
                  Future roadmap <ChevronRight className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ TRACK RECORD ══ */}
        <section className="py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-bold text-fiery-orange uppercase tracking-widest mb-4">Performance</p>
              <h2 className="text-4xl sm:text-5xl text-white mb-4">Historical Excellence</h2>
              <p className="text-zinc-400 max-w-xl mx-auto italic text-sm">
                Independently audited results. Past performance is not indicative of future results.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {TRACK.map((record, i) => (
                <motion.div
                  key={record.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group relative p-6 rounded-3xl bg-[#0C0C10]/80 border border-white/[0.07] hover:border-fiery-orange/30 transition-all overflow-hidden text-center"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-fiery-orange to-fiery-amber transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">{record.year}</p>
                  <p className="text-lg font-black text-white mb-1">{record.aum}</p>
                  <p className="text-[10px] text-zinc-600 uppercase font-bold mb-4">AUM</p>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 py-2 rounded-xl">
                    <p className="text-emerald-400 font-black text-xl">{record.returns}</p>
                    <p className="text-emerald-600/70 text-[10px] uppercase font-bold">Net Return</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#0C0C10] to-[#111116] border border-fiery-orange/20 p-14 sm:p-20 text-center">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-fiery-orange/10 rounded-full blur-[100px]" />
              </div>
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-fiery-orange/50 to-transparent" />

              <div className="relative z-10">
                <h2 className="text-5xl sm:text-6xl  text-white mb-6 leading-tight">
                  BUILD YOUR EMPIRE TODAY
                </h2>
                <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                  Join 12,000+ traders already profiting from our institutional-grade signals
                  and risk management software.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-5">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white hover:bg-zinc-100 text-black font-semibold text-sm shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-105 transition-all"
                  >
                    Create Free Account <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 hover:border-fiery-orange/40 text-white font-semibold text-sm transition-all hover:bg-white/[0.04]"
                  >
                    Explore Services
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