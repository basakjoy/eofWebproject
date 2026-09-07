'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  ChevronDown,
  Star,
  Activity,
  TrendingUp,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/* ── Plans Data ── */
const PLANS = [
  {
    name: 'Standard Plan',
    price: 'Free',
    period: '',
    minInvestment: 'No Deposit Required',
    expectedROI: 'Retail Signals Only',
    desc: 'Essential entry-level access for retail traders looking to test market signals.',
    features: [
      { name: 'Access to Basic Signals', included: true },
      { name: 'Daily Market Briefing', included: true },
      { name: 'Educational Hub Access', included: true },
      { name: 'Fund Management Desk', included: false },
      { name: 'Portfolio Tracking Dashboard', included: false },
      { name: 'Monthly Profit Share Payouts', included: false },
      { name: 'Dedicated Risk Manager', included: false },
    ],
    accent: 'from-blue-500 to-cyan-400',
    popular: false,
    cta: 'Get Started Free',
    href: '/register',
  },
  {
    name: 'Professional Plan',
    price: '$99',
    period: '/mo',
    minInvestment: 'No Deposit Required',
    expectedROI: '8% - 10% Target',
    desc: 'Full institutional desk access for active retail and prop firm traders.',
    features: [
      { name: 'Unlimited Premium Signals', included: true },
      { name: 'Real-Time Multi-Asset Alerts', included: true },
      { name: 'Trading Education & Workshops', included: true },
      { name: 'Fund Management Desk', included: false },
      { name: 'Portfolio Tracking & Analytics', included: true },
      { name: 'Priority Telegram Channel', included: true },
      { name: 'Dedicated Risk Manager', included: false },
    ],
    accent: 'from-[#FF6B00] to-[#FFB800]',
    popular: true,
    cta: 'Start Professional',
    href: '/register',
  },
  {
    name: 'Investor Plan',
    price: 'Custom',
    period: '',
    minInvestment: 'Min $100 Deposit',
    expectedROI: '8% - 15% Monthly',
    desc: 'Bespoke passive management for high-net-worth capital growth.',
    features: [
      { name: 'Full Managed Account Desk', included: true },
      { name: 'Bi-Weekly Audited Reports', included: true },
      { name: 'Institutional Drawdown Shield', included: true },
      { name: 'Direct Portfolio Synchronization', included: true },
      { name: 'Monthly Profit Share Payouts', included: true },
      { name: 'Dedicated Risk & Account Manager', included: true },
      { name: '24/7 Priority Desk Support', included: true },
    ],
    accent: 'from-emerald-500 to-teal-400',
    popular: false,
    cta: 'Contact Investment Desk',
    href: '/contact',
  },
];

/* ── Detailed Comparison Rows ── */
const COMPARISON_ROWS = [
  { name: 'Real-Time Trading Signals', standard: true, professional: true, investor: true },
  { name: 'Daily Market Confluence Reports', standard: true, professional: true, investor: true },
  { name: 'Educational Hub & Backtesting', standard: true, professional: true, investor: true },
  { name: 'Portfolio Analytics Dashboard', standard: false, professional: true, investor: true },
  { name: 'Risk Management & Stop-Loss Calculator', standard: false, professional: true, investor: true },
  { name: 'Hands-Off Fund Management', standard: false, professional: false, investor: true },
  { name: 'Monthly Profit Distributions', standard: false, professional: false, investor: true },
  { name: 'Dedicated Account Manager', standard: false, professional: false, investor: true },
  { name: 'Priority Telegram & Push Notifications', standard: false, professional: true, investor: true },
  { name: '24/7 VIP Phone & Desk Support', standard: false, professional: false, investor: true },
];

/* ── Advantages ── */
const ADVANTAGES = [
  { icon: ShieldCheck, title: 'Drawdown Protection', desc: 'Strict risk parameters capping total exposure to protect your principal capital.' },
  { icon: BarChart3, title: 'Audited Track Record', desc: 'Independently verified performance logs updated bi-weekly with total transparency.' },
  { icon: Zap, title: 'Instant Liquidity', desc: 'No locked periods for managed accounts. Deposit or withdraw capital at any time.' },
  { icon: Lock, title: 'Segregated Accounts', desc: 'Funds stored in tier-1 regulated prime brokerages with bank-grade encryption.' },
];

/* ── FAQs ── */
const FAQS = [
  { q: 'Can I upgrade or downgrade my investment plan?', a: 'Yes, you can upgrade or adjust your plan tier anytime from your member portal. Capital allocation changes update immediately.' },
  { q: 'What happens if I withdraw funds before the month ends?', a: 'Withdrawals are processed within 24 hours. Early withdrawals calculate pro-rated profit share up to the withdrawal timestamp.' },
  { q: 'Is there a mandatory lock-in period for the Investor Plan?', a: 'No. We believe in total financial control. You retain complete withdrawal access to your capital at all times.' },
  { q: 'How are monthly profit returns calculated and distributed?', a: 'Profit returns are calculated daily on equity balances and distributed automatically on the 1st of every month to your designated wallet or bank account.' },
];

export default function InvestmentPlansPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="w-full min-h-screen bg-[#030305] text-white font-poppins overflow-x-hidden">

      {/* ── Ambient Background & Image Overlay ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="https://res.cloudinary.com/xxx8fpey/image/upload/v1788764499/pexels-joaojesusdesign-925711.jpg"
          alt="Markets Background"
          className="w-full h-full object-cover opacity-70 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030305]/70 via-[#030305]/85 to-[#030305]" />
        <div className="absolute -top-40 right-[-15%] w-[800px] h-[800px] bg-[#FF6B00]/10 rounded-full blur-[150px]" />
        <div className="absolute top-[35%] left-[-10%] w-[600px] h-[600px] bg-[#FF3D00]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-[#FF6B00]/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10">

        {/* ══ HERO ══ */}
        <section className="pt-36 pb-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fiery-orange/10 border border-fiery-orange/20 text-xs font-bold text-fiery-orange mb-8 backdrop-blur-md"
            >
              <Star className="w-3.5 h-3.5 fill-fiery-orange" />
              CAPITAL ALLOCATION · EMPIRE OF FOREX
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-7xl lg:text-[5.5rem] text-white leading-[1.05] tracking-tight mb-6"
            >
              Investment{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8C00] to-[#FFB800]">
                Plans
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg leading-relaxed max-w-2xl mx-auto font-light "
            >
              Choose the perfect capital deployment strategy tailored for your financial goals,
              drawdown protection, and institutional execution.
            </motion.p>
          </div>
        </section>

        {/* ══ PLANS CARDS ══ */}
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {PLANS.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative flex flex-col rounded-3xl overflow-hidden border backdrop-blur transition-all duration-300 ${
                    plan.popular
                      ? 'border-fiery-orange/50 bg-gradient-to-b from-fiery-orange/15 via-[#0C0C10]/80 to-[#0C0C10]/95 shadow-[0_0_50px_rgba(255,107,0,0.2)] md:scale-105 md:-translate-y-2 z-10'
                      : 'border-white/10 bg-[#0C0C10]/40 hover:border-white/20 hover:bg-[#0C0C10]/60 shadow-xl'
                  }`}
                >
                  {/* Featured Accent bar */}
                  

                 {/* Most Popular badge */}
                 

                  <div className="p-8 flex flex-col flex-grow">
                    {/* Header */}
                    <div className="mb-6 pt-2">
                      <h3 className="text-2xl font-medium mb-1 text-white">{plan.name}</h3>
                      <p className="text-zinc-400 text-xs leading-relaxed">{plan.desc}</p>   
                    </div>

                    {/* Price & ROI stats */}
                    <div className="mb-6 space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.04]">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-4xl  ${plan.popular ? ' bg-clip-text bg-gradient-to-r from-fiery-orange to-fiery-amber' : 'text-white'}`}>
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className="text-zinc-400 font-bold text-sm">{plan.period}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.06]">
                        <span className="text-zinc-400 font-medium">Min Deposit:</span>
                        <span className="text-fiery-orange font-bold">{plan.minInvestment}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 font-medium">Target ROI:</span>
                        <span className="text-emerald-400 font-bold">{plan.expectedROI}</span>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="flex-grow space-y-3.5 mb-8">
                      {plan.features.map((svc) => (
                        <div key={svc.name} className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                            svc.included
                              ? plan.popular
                                ? 'bg-fiery-orange/20 border border-fiery-orange/40'
                                : 'bg-emerald-500/20 border border-emerald-500/40'
                              : 'bg-white/[0.04] border border-white/20'
                          }`}>
                            {svc.included ? (
                              <CheckCircle2 className={`w-3 h-3 ${plan.popular ? 'text-fiery-orange' : 'text-emerald-400'}`} />
                            ) : (
                              <X className="w-3 h-3 text-zinc-600" />
                            )}
                          </div>
                          <span className={`text-xs font-medium ${svc.included ? 'text-zinc-300' : 'text-zinc-600 line-through'}`}>
                            {svc.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={plan.href}
                      className={`w-full py-3.5 rounded-2xl text-sm font-extrabold text-center transition-all hover:scale-[1.02] active:scale-[0.98] ${
                        plan.popular
                          ? 'bg-gradient-to-r from-fiery-orange to-fiery-amber text-white shadow-fiery'
                          : 'bg-white/[0.05] hover:bg-white/[0.1] border border-white/20 hover:border-fiery-orange/30 text-white'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ DETAILED COMPARISON TABLE ══ */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-fiery-orange uppercase tracking-widest mb-3">Side-By-Side</p>
              <h2 className="text-4xl sm:text-5xl text-white mb-4">Detailed Plan Comparison</h2>
              <p className="text-zinc-400 text-sm max-w-xl mx-auto">
                Compare institutional features across all tier levels.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative p-6 sm:p-8 rounded-3xl bg-[#0C0C10]/40 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-4 px-4 font-bold text-fiery-orange text-xs uppercase tracking-widest">Capabilities</th>
                      <th className="py-4 px-4 text-center font-bold text-white text-xs uppercase tracking-widest">Standard</th>
                      <th className="py-4 px-4 text-center font-bold text-fiery-orange text-xs uppercase tracking-widest">Professional</th>
                      <th className="py-4 px-4 text-center font-bold text-emerald-400 text-xs uppercase tracking-widest">Investor Desk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map((row, i) => (
                      <tr
                        key={row.name}
                        className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-4 px-4 text-sm font-medium text-zinc-300">{row.name}</td>
                        <td className="py-4 px-4 text-center">
                          {row.standard ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-zinc-600 mx-auto" />
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {row.professional ? (
                            <CheckCircle2 className="w-5 h-5 text-fiery-orange mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-zinc-600 mx-auto" />
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          {row.investor ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-zinc-600 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ ADVANTAGES SECTION ══ */}
        <section className="py-20 px-4 sm:px-6 bg-[#0A0A0E]/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-bold text-fiery-orange uppercase tracking-widest mb-3">Institutional Standards</p>
              <h2 className="text-4xl sm:text-5xl text-white mb-4">Why Invest With Us</h2>
              <p className="text-zinc-400 max-w-xl mx-auto text-sm">
                Built on institutional safety, transparency, and high probability execution.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ADVANTAGES.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative p-7 rounded-3xl border border-white/10 bg-[#0C0C10]/40 hover:border-fiery-orange/40 hover:bg-[#0C0C10]/60 backdrop-blur transition-all duration-300 group"
                >
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="p-3 rounded-2xl bg-fiery-orange/10 border border-fiery-orange/20 inline-flex mb-5 group-hover:bg-fiery-orange/20 transition-colors">
                    <item.icon className="w-6 h-6 text-fiery-orange" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ SECTION ══ */}
        <section className="py-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-bold text-fiery-orange uppercase tracking-widest mb-3">Got Questions?</p>
              <h2 className="text-4xl sm:text-5xl text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-zinc-400 text-sm max-w-lg mx-auto">
                Everything you need to know about our managed plans and subscription model.
              </p>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className={`rounded-2xl border transition-all duration-300 backdrop-blur overflow-hidden ${
                      isOpen
                        ? 'border-fiery-orange/40 bg-[#0C0C10]/30 shadow-[0_4px_20px_rgba(255,107,0,0.1)]'
                        : 'border-white/10 bg-[#0C0C10]/40 hover:border-white/50 hover:bg-[#0C0C10]/30'
                    }`}
                  >
                    <button
                      type="button"
                      className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                    >
                      <h3 className="text-base font-semibold text-white">{faq.q}</h3>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="p-1 rounded-full bg-white/[0.05] border border-white/10 flex-shrink-0"
                      >
                        <ChevronDown className="w-4 h-4 text-fiery-orange" />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden px-6 pb-6"
                        >
                          <div className="pt-2 border-t border-white/[0.06] text-xs text-zinc-400 leading-relaxed">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ CTA BANNER ══ */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#0C0C10]/80 via-[#0C0C10]/50 to-[#111116]/80 border border-fiery-orange/30 backdrop-blur-2xl p-12 sm:p-16 text-center shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-fiery-orange/10 rounded-full blur-[100px]" />
              </div>
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-fiery-orange/50 to-transparent" />
              <div className="relative z-10">
                <h2 className="text-4xl sm:text-5xl text-white mb-4 leading-tight">
                  START GROWING YOUR PORTFOLIO TODAY
                </h2>
                <p className="text-zinc-400 max-w-lg mx-auto mb-8 font-light leading-relaxed">
                  Join 12,000+ traders scaling capital with institutional infrastructure
                  and verified signals.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 hover:border-fiery-orange/40 text-white font-semibold text-sm transition-all"
                  >
                    Get Started Free <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 hover:border-fiery-orange/40 text-white font-semibold text-sm transition-all"
                  >
                    Speak with an Advisor <ArrowRight className="w-4 h-4" />
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