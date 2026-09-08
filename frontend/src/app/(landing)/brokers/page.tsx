'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Star,
  Globe,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  Award,
  Zap,
  ChevronRight,
  ArrowRight,
  Loader2,
  Mail,
  Phone,
  BarChart2,
  Layers,
  BadgeCheck,
  Clock,
  Users,
  Search,
  Filter,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { brokersApi } from '@/lib/brokersApi';

/* ── Stat counters ── */
const LIVE_STATS = [
  { label: 'Partner Brokers', value: '40+', icon: Layers },
  { label: 'Avg. Spread', value: '0.1 pips', icon: BarChart2 },
  { label: 'Active Traders', value: '12,000+', icon: Users },
  { label: 'Avg. Execution', value: '< 10ms', icon: Clock },
];

/* ── Trust advantages ── */
const TRUST_FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Strict Regulation',
    desc: 'Only brokers regulated by top-tier financial authorities like FCA, ASIC, and CySEC — guaranteeing full fund safety at every step.',
  },
  {
    icon: TrendingUp,
    title: 'Exceptional Conditions',
    desc: 'Lowest spreads, zero-commission accounts, and ultra-fast institutional-grade execution speeds across all market conditions.',
  },
  {
    icon: Star,
    title: 'Verified Reviews',
    desc: 'Real feedback from real traders. Our transparent review system helps you make an informed, unbiased decision.',
  },
  {
    icon: Zap,
    title: 'Instant Onboarding',
    desc: 'All partner brokers offer streamlined KYC, same-day deposit funding, and sub-minute live account activation.',
  },
];

/* ── Comparison table columns ── */
const COMPARISON_KEYS = [
  { key: 'minimumDeposit', label: 'Min Deposit', prefix: '$' },
  { key: 'leverage', label: 'Leverage', prefix: '' },
  { key: 'spreads', label: 'Spreads', prefix: '' },
  { key: 'rating', label: 'Rating', prefix: '' },
];

export default function BrokersPromotionalPage() {
  const [brokers, setBrokers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const result = await brokersApi.getAllBrokers({ limit: 20 });
        if (result.success && result.data) {
          setBrokers(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch brokers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrokers();
  }, []);

  const filtered = brokers.filter((b) =>
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.country?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-[#030305] text-white overflow-x-hidden">

      {/* ── Ambient Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="https://res.cloudinary.com/xxx8fpey/image/upload/v1788764499/pexels-joaojesusdesign-925711.jpg"
          alt="Markets Background"
          className="w-full h-full object-cover opacity-50 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030305]/70 via-[#030305]/85 to-[#030305]" />
        <div className="absolute -top-40 right-[-15%] w-[800px] h-[800px] bg-[#FF6B00]/10 rounded-full blur-[150px]" />
        <div className="absolute top-[35%] left-[-10%] w-[600px] h-[600px] bg-[#FF3D00]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-[#FF6B00]/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10">

        {/* ══ HERO ══ */}
        <section className="pt-36 pb-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-xs font-bold text-[#FF6B00] mb-8 backdrop-blur-md"
            >
              <Award className="w-3.5 h-3.5" />
              TRUSTED &amp; VERIFIED PARTNERS · EMPIRE OF FOREX
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-7xl lg:text-[5.5rem] text-white leading-[1.05] tracking-tight mb-6"
            >
              Top Forex{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8C00] to-[#FFB800]">
                Brokers 2026
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg leading-relaxed max-w-2xl mx-auto font-light mb-10 text-zinc-300"
            >
              Trade with confidence using our carefully curated list of industry-leading forex brokers.
              Enjoy tight spreads, high leverage, and unmatched institutional reliability.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 mb-14"
            >
              <a
                href="#brokers-list"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full border border-white/20 hover:border-[#FF6B00]/40 text-white text-sm transition-all"
              >
                Compare Brokers <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#why-trust"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 hover:border-[#FF6B00]/40 text-white text-sm transition-all"
              >
                Our Methodology <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Live Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {LIVE_STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.07] backdrop-blur"
                >
                  <stat.icon className="w-5 h-5 text-[#FF6B00]" />
                  <span className="text-xl font-black text-white">{stat.value}</span>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ BROKERS GRID ══ */}
        <section id="brokers-list" className="py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">

            {/* Section header + search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
              <div>
                <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest mb-2">Curated Picks</p>
                <h2 className="text-3xl sm:text-4xl text-white">Featured Broker Partners</h2>
                <p className="text-sm text-zinc-400 mt-1 max-w-md">
                  Every broker has passed our multi-tier regulatory, execution, and transparency audit.
                </p>
              </div>
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search by name or country…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B00]/50 transition-colors"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-10 h-10 text-[#FF6B00] animate-spin mb-4" />
                <p className="text-zinc-400 text-sm animate-pulse font-medium">Loading top brokers…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-24 text-center rounded-3xl border border-white/10 bg-[#0C0C10]/40 backdrop-blur-2xl">
                <ShieldCheck className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {search ? 'No brokers matched your search' : 'No Brokers Available'}
                </h3>
                <p className="text-xs text-zinc-400">
                  {search ? 'Try a different name or country.' : 'We are currently updating our list of recommended brokers.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {filtered.map((broker, index) => {
                  let parsedFeatures: string[] = [];
                  try {
                    if (typeof broker.features === 'string') {
                      parsedFeatures = JSON.parse(broker.features);
                    } else if (Array.isArray(broker.features)) {
                      parsedFeatures = broker.features;
                    }
                  } catch { /* ignore */ }

                  const isTop = index === 0 && !search;
                  const isRegulated = broker.status === 'active' || broker.status === 'regulated';

                  return (
                    <motion.div
                      key={broker.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (index % 6) * 0.07 }}
                      className={`relative flex flex-col rounded-3xl overflow-hidden border backdrop-blur-xl transition-all duration-300 group ${
                        isTop
                          ? 'border-[#FF6B00]/50 bg-gradient-to-b from-[#FF6B00]/15 via-[#0C0C10]/80 to-[#0C0C10]/95 shadow-[0_0_50px_rgba(255,107,0,0.2)] md:scale-[1.03] z-10'
                          : 'border-white/[0.05] bg-[#0C0C10]/40 hover:border-white/20 hover:bg-[#0C0C10]/60 shadow-xl'
                      }`}
                    >
                      {/* Top accent stripe for #1 */}
                      {isTop && (
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF6B00] to-[#FFB800]" />
                      )}

                      {/* #1 floating badge */}
                      {isTop && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                          <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#FF6B00] to-[#FFB800] text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                            <Award className="w-3 h-3" />
                            #1 Rated
                          </div>
                        </div>
                      )}

                      <div className="p-7 flex flex-col flex-grow">

                        {/* ─ Header: Logo · Name · Rating ─ */}
                        <div className="flex items-start justify-between mb-5 pt-2">
                          <div className="flex items-center gap-3.5">
                            {broker.logo ? (
                              <div className="w-14 h-14 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow border border-white/10 flex-shrink-0">
                                <img src={broker.logo} alt={broker.name} className="max-w-full max-h-full object-contain" />
                              </div>
                            ) : (
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B00] to-[#FFB800] flex items-center justify-center text-white font-black text-xl shadow-lg flex-shrink-0">
                                {broker.name?.charAt(0)}
                              </div>
                            )}
                            <div>
                              <h3 className="text-base font-bold text-white leading-tight">{broker.name}</h3>
                              {broker.country && (
                                <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                                  <Globe className="w-3 h-3 text-[#FF6B00]" /> {broker.country}
                                </p>
                              )}
                              {/* Status badge */}
                              <div className="flex items-center gap-1.5 mt-1">
                                {isRegulated ? (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                                    <BadgeCheck className="w-2.5 h-2.5" /> Regulated
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-400/10 border border-zinc-400/20 px-2 py-0.5 rounded-full">
                                    Unverified
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* Rating */}
                          <div className="flex flex-col items-end flex-shrink-0">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-[#FF6B00] text-[#FF6B00]" />
                              <span className="font-black text-lg text-white">{broker.rating ?? '—'}</span>
                            </div>
                            <span className="text-[10px] text-zinc-500">{broker.reviewCount ?? 0} reviews</span>
                          </div>
                        </div>

                        {/* ─ Key Stats Grid ─ */}
                        <div className="mb-5 grid grid-cols-3 gap-2">
                          {[
                            { label: 'Min Deposit', value: broker.minimumDeposit ? `$${broker.minimumDeposit}` : '—', color: 'text-[#FF6B00]' },
                            { label: 'Leverage', value: broker.leverage || '—', color: 'text-emerald-400' },
                            { label: 'Spreads', value: broker.spreads || '—', color: 'text-sky-400' },
                          ].map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center py-3 px-1 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
                              <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                              <span className="text-[9px] uppercase tracking-wider text-zinc-500 mt-0.5 font-semibold">{stat.label}</span>
                            </div>
                          ))}
                        </div>

                        {/* ─ Contact Info ─ */}
                        {(broker.email || broker.phone) && (
                          <div className="mb-5 space-y-1.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                            {broker.email && (
                              <div className="flex items-center gap-2 text-xs text-zinc-400">
                                <Mail className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                                <span className="truncate">{broker.email}</span>
                              </div>
                            )}
                            {broker.phone && (
                              <div className="flex items-center gap-2 text-xs text-zinc-400">
                                <Phone className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                                <span>{broker.phone}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* ─ Features ─ */}
                        {parsedFeatures.length > 0 && (
                          <div className="flex-grow space-y-2.5 mb-6">
                            {parsedFeatures.slice(0, 5).map((feature: string, i: number) => (
                              <div key={i} className="flex items-start gap-2.5">
                                <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isTop ? 'text-[#FF6B00]' : 'text-emerald-400'}`} />
                                <span className="text-xs text-zinc-300 leading-snug">{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* ─ Footer: CTAs ─ */}
                        <div className="flex flex-col gap-2 mt-auto">
                          <a
                            href={broker.website || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full py-3 rounded-xl text-sm text-center flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                              isTop
                                ? 'bg-gradient-to-r from-[#FF6B00] to-[#FFB800] text-white shadow-[0_0_20px_rgba(255,107,0,0.35)]'
                                : 'bg-white/[0.05] hover:bg-white/[0.1] border border-white/20 hover:border-[#FF6B00]/30 text-white'
                            }`}
                          >
                            Open Account <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <Link
                            href={`/brokers/${broker.id}`}
                            className="w-full py-2.5 rounded-xl text-xs text-center text-zinc-400 hover:text-white border border-white/[0.06] hover:border-white/20 transition-all flex items-center justify-center gap-1.5"
                          >
                            Full Review &amp; Details <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ══ COMPARISON TABLE ══ */}
        {!loading && brokers.length > 0 && (
          <section className="py-16 px-4 sm:px-6 bg-[#0A0A0E]/60">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-10">
                <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest mb-2">Side by Side</p>
                <h2 className="text-3xl sm:text-4xl text-white">Quick Comparison</h2>
                <p className="text-sm text-zinc-400 mt-1">Compare key metrics across all our featured brokers at a glance.</p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/[0.07] bg-[#0C0C10]/40 backdrop-blur-xl">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Broker</th>
                      <th className="text-center px-4 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Min Deposit</th>
                      <th className="text-center px-4 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Leverage</th>
                      <th className="text-center px-4 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Spreads</th>
                      <th className="text-center px-4 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Rating</th>
                      <th className="text-center px-4 py-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brokers.slice(0, 8).map((broker, i) => (
                      <tr
                        key={broker.id}
                        className={`border-b border-white/[0.04] last:border-0 transition-colors ${
                          i === 0 ? 'bg-[#FF6B00]/[0.04]' : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {i === 0 && (
                              <span className="text-[9px] font-black text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">#1</span>
                            )}
                            {broker.logo ? (
                              <img src={broker.logo} alt={broker.name} className="w-7 h-7 object-contain bg-white rounded-lg p-0.5" />
                            ) : (
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FFB800] flex items-center justify-center text-white font-bold text-xs">
                                {broker.name?.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-white text-xs">{broker.name}</p>
                              {broker.country && <p className="text-[10px] text-zinc-500">{broker.country}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-[#FF6B00] text-xs">
                          {broker.minimumDeposit ? `$${broker.minimumDeposit}` : '—'}
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-emerald-400 text-xs">{broker.leverage || '—'}</td>
                        <td className="px-4 py-4 text-center font-bold text-sky-400 text-xs">{broker.spreads || '—'}</td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-white">
                            <Star className="w-3 h-3 fill-[#FF6B00] text-[#FF6B00]" />
                            {broker.rating ?? '—'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <a
                            href={broker.website || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                              i === 0
                                ? 'bg-gradient-to-r from-[#FF6B00] to-[#FFB800] text-white'
                                : 'border border-white/20 text-zinc-300 hover:border-[#FF6B00]/40 hover:text-white'
                            }`}
                          >
                            Open <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ══ WHY TRUST US ══ */}
        <section id="why-trust" className="py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest mb-3">Our Standards</p>
              <h2 className="text-4xl sm:text-5xl text-white mb-4">Why Trust Our Recommendations?</h2>
              <p className="text-zinc-400 max-w-xl mx-auto text-sm">
                Our rigorous multi-tier selection process ensures you only trade with the very best.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TRUST_FEATURES.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative p-7 rounded-3xl border border-white/10 bg-[#0C0C10]/40 hover:border-[#FF6B00]/40 hover:bg-[#0C0C10]/60 backdrop-blur transition-all duration-300 group"
                >
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="p-3 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 inline-flex mb-5 group-hover:bg-[#FF6B00]/20 transition-colors">
                    <item.icon className="w-6 h-6 text-[#FF6B00]" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA BANNER ══ */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#0C0C10]/80 via-[#0C0C10]/50 to-[#111116]/80 border border-[#FF6B00]/30 backdrop-blur p-12 sm:p-16 text-center shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF6B00]/10 rounded-full blur-[100px]" />
              </div>
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF6B00]/50 to-transparent" />
              <div className="relative z-10">
                <h2 className="text-4xl sm:text-5xl text-white mb-4 leading-tight font-bold">
                  Start Trading With The Best
                </h2>
                <p className="text-zinc-400 max-w-lg mx-auto mb-8 leading-relaxed text-sm">
                  Join 12,000+ Empire of Forex traders already using our recommended brokers for
                  institutional-grade execution and fully transparent conditions.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="#brokers-list"
                    className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FFB800] text-white font-extrabold text-sm shadow-[0_0_30px_rgba(255,107,0,0.35)] hover:scale-105 transition-transform"
                  >
                    View All Brokers <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 hover:border-[#FF6B00]/40 text-white font-semibold text-sm transition-all"
                  >
                    Explore Our Services <ArrowRight className="w-4 h-4" />
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