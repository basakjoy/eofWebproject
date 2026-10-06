'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Star,
  Globe,
  ShieldCheck,
  ExternalLink,
  Award,
  ChevronLeft,
  CheckCircle2,
  Mail,
  Phone,
  BarChart2,
  Loader2,
  BadgeCheck,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  TrendingUp,
  Layers,
  Clock,
  DollarSign,
  Zap,
  Lock,
  AlertTriangle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { brokersApi } from '@/lib/brokersApi';
import { useLanguage, getLocalizedPath } from '@/context/LanguageContext';

/* ── Star rating display ── */
function StarRow({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < Math.round(rating) ? 'fill-[#FF6B00] text-[#FF6B00]' : 'text-zinc-700'}`}
        />
      ))}
    </div>
  );
}

/* ── Stat pill ── */
function StatPill({
  icon: Icon,
  label,
  value,
  color = 'text-white',
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
      <Icon className={`w-5 h-5 ${color}`} />
      <span className={`text-xl font-black ${color}`}>{value}</span>
      <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">{label}</span>
    </div>
  );
}

export default function BrokerDetailPage() {
  const params = useParams();
  const brokerId = params?.id as string;
  const { t, locale } = useLanguage();

  const [broker, setBroker] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'conditions'>('overview');

  useEffect(() => {
    if (!brokerId) return;
    const fetchData = async () => {
      try {
        const [brokerRes, reviewsRes] = await Promise.all([
          brokersApi.getBrokerById(brokerId),
          brokersApi.getBrokerReviews(brokerId, { limit: 10 }),
        ]);
        if (brokerRes?.success && brokerRes.data) setBroker(brokerRes.data);
        if (reviewsRes?.success && reviewsRes.data) setReviews(reviewsRes.data);
      } catch (err) {
        console.error('Failed to load broker:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [brokerId]);

  let parsedFeatures: string[] = [];
  if (broker?.features) {
    try {
      parsedFeatures = typeof broker.features === 'string'
        ? JSON.parse(broker.features)
        : broker.features;
    } catch { /* ignore */ }
  }

  const isRegulated = broker?.status === 'active' || broker?.status === 'regulated';

  const TABS = [
    { id: 'overview', label: t('brokerDetail.overviewTab', 'Overview') },
    { id: 'conditions', label: t('brokerDetail.conditionsTab', 'Trading Conditions') },
    { id: 'reviews', label: `${t('brokerDetail.reviewsTab', 'Reviews')} (${reviews.length})` },
  ];

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#030305] flex items-center justify-center">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute -top-40 right-[-15%] w-[800px] h-[800px] bg-[#FF6B00]/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] bg-[#FF6B00]/10 rounded-full blur-[150px]" />
        </div>
        <div className="relative z-10 text-center">
          <Loader2 className="w-10 h-10 text-[#FF6B00] animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm animate-pulse">{t('common.loading', 'Loading broker profile…')}</p>
        </div>
      </div>
    );
  }

  if (!broker) {
    return (
      <div className="w-full min-h-screen bg-[#030305] flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertTriangle className="w-12 h-12 text-zinc-600" />
        <h1 className="text-2xl font-bold text-white">Broker Not Found</h1>
        <p className="text-zinc-400 text-sm">This broker profile doesn&apos;t exist or was removed.</p>
        <Link
          href={getLocalizedPath('/brokers', locale)}
          className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full border border-white/20 text-sm text-white hover:border-[#FF6B00]/40 transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> {t('brokerDetail.backToBrokers', 'Back to Brokers')}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#030305] text-white overflow-x-hidden font-poppins">

      {/* ── Ambient Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="https://res.cloudinary.com/xxx8fpey/image/upload/v1788764499/pexels-joaojesusdesign-925711.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-30 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030305]/80 via-[#030305]/90 to-[#030305]" />
        <div className="absolute -top-40 right-[-15%] w-[800px] h-[800px] bg-[#FF6B00]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] bg-[#FF6B00]/8 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 pt-24 pb-20">

        {/* Back nav */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
          <Link
            href={getLocalizedPath('/brokers', locale)}
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> {t('brokerDetail.backToBrokers', 'Back to All Brokers')}
          </Link>
        </div>

        {/* ══ HERO CARD ══ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0C0C10]/60 backdrop-blur-2xl shadow-2xl"
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF6B00] to-[#FFB800]" />

            <div className="p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">

                {/* Logo */}
                {broker.logo ? (
                  <div className="w-20 h-20 rounded-2xl bg-white p-2 flex items-center justify-center shadow-xl border border-white/10 flex-shrink-0">
                    <img src={broker.logo} alt={broker.name} className="max-w-full max-h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6B00] to-[#FFB800] flex items-center justify-center text-white font-black text-3xl shadow-xl flex-shrink-0">
                    {broker.name?.charAt(0)}
                  </div>
                )}

                {/* Meta */}
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-3xl sm:text-4xl font-black text-white">{broker.name}</h1>
                    {isRegulated && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
                        <BadgeCheck className="w-3 h-3" /> {t('brokerDetail.regulated', 'Regulated')}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 mb-4">
                    {broker.country && (
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-[#FF6B00]" /> {broker.country}
                      </span>
                    )}
                    {broker.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-zinc-500" /> {broker.email}
                      </span>
                    )}
                    {broker.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-zinc-500" /> {broker.phone}
                      </span>
                    )}
                  </div>

                  {/* Rating row */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <StarRow rating={broker.rating ?? 0} />
                      <span className="text-2xl font-black text-white">{broker.rating ?? '—'}</span>
                      <span className="text-xs text-zinc-500">/ 5 · {broker.reviewCount ?? 0} {t('brokerDetail.reviewsTab', 'reviews')}</span>
                    </div>
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="flex flex-col gap-3 flex-shrink-0">
                  <a
                    href={broker.website || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#FFB800] text-white font-extrabold text-sm shadow-[0_0_25px_rgba(255,107,0,0.35)] hover:scale-105 transition-transform"
                  >
                    {t('brokerDetail.openAccount', 'Open Account')} <ExternalLink className="w-4 h-4" />
                  </a>
                  {broker.website && (
                    <a
                      href={broker.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-500 hover:text-zinc-300 text-center transition-colors truncate max-w-[200px]"
                    >
                      {broker.website}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ══ KEY STATS ROW ══ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatPill icon={DollarSign} label={t('brokerDetail.minDeposit', 'Min Deposit')} value={broker.minimumDeposit ? `$${broker.minimumDeposit}` : '—'} color="text-[#FF6B00]" />
            <StatPill icon={TrendingUp} label={t('brokerDetail.maxLeverage', 'Max Leverage')} value={broker.leverage || '—'} color="text-emerald-400" />
            <StatPill icon={BarChart2} label={t('brokerDetail.spreadsFrom', 'Spreads From')} value={broker.spreads || '—'} color="text-sky-400" />
            <StatPill icon={Star} label={t('brokerDetail.overallRating', 'Overall Rating')} value={broker.rating ? `${broker.rating}/5` : '—'} color="text-[#FFB800]" />
          </div>
        </div>

        {/* ══ TABS ══ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Tab nav */}
          <div className="flex items-center gap-1 mb-8 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#FF6B00] text-white shadow-[0_0_15px_rgba(255,107,0,0.3)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ─ Overview Tab ─ */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Features */}
              <div className="lg:col-span-2 space-y-6">
                {parsedFeatures.length > 0 && (
                  <div className="rounded-3xl border border-white/[0.07] bg-[#0C0C10]/40 backdrop-blur-xl p-8">
                    <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#FF6B00]" /> {t('brokerDetail.keyFeatures', 'Key Features')}
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {parsedFeatures.map((feature: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-zinc-300 leading-snug">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* About */}
                <div className="rounded-3xl border border-white/[0.07] bg-[#0C0C10]/40 backdrop-blur-xl p-8">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#FF6B00]" /> {t('brokerDetail.aboutBroker', 'About')} {broker.name}
                  </h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {broker.description ||
                      `${broker.name} is one of our verified partner brokers offering competitive trading conditions
                      for forex and CFD markets. With operations based in ${broker.country || 'multiple jurisdictions'},
                      they provide access to major currency pairs, indices, commodities, and crypto assets
                      with institutional-grade execution and dedicated 24/5 support.`}
                  </p>
                  {broker.website && (
                    <a
                      href={broker.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-4 text-xs text-[#FF6B00] hover:underline"
                    >
                      {t('brokerDetail.visitWebsite', 'Visit official website')} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Regulation Card */}
                <div className="rounded-3xl border border-white/[0.07] bg-[#0C0C10]/40 backdrop-blur-xl p-6">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> {t('brokerDetail.regulationSafety', 'Regulation & Safety')}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">{t('brokerDetail.status', 'Status')}</span>
                      <span className={`font-bold ${isRegulated ? 'text-emerald-400' : 'text-yellow-400'}`}>
                        {isRegulated ? t('brokerDetail.regulated', 'Regulated') : broker.status || 'Unverified'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-t border-white/[0.05] pt-3">
                      <span className="text-zinc-400">{t('brokerDetail.country', 'Country')}</span>
                      <span className="text-white font-medium">{broker.country || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-t border-white/[0.05] pt-3">
                      <span className="text-zinc-400">{t('brokerDetail.brokerCode', 'Broker Code')}</span>
                      <span className="text-zinc-300 font-mono text-[10px]">{broker.code || '—'}</span>
                    </div>
                    {broker.email && (
                      <div className="flex items-center justify-between text-xs border-t border-white/[0.05] pt-3">
                        <span className="text-zinc-400">{t('brokerDetail.supportEmail', 'Support Email')}</span>
                        <a href={`mailto:${broker.email}`} className="text-[#FF6B00] hover:underline text-[10px]">
                          {broker.email}
                        </a>
                      </div>
                    )}
                    {broker.phone && (
                      <div className="flex items-center justify-between text-xs border-t border-white/[0.05] pt-3">
                        <span className="text-zinc-400">{t('brokerDetail.supportPhone', 'Support Phone')}</span>
                        <span className="text-zinc-300 text-[10px]">{broker.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick CTA */}
                <div className="rounded-3xl border border-[#FF6B00]/30 bg-[#FF6B00]/5 backdrop-blur-xl p-6 text-center">
                  <Award className="w-8 h-8 text-[#FF6B00] mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-white mb-1">{t('brokerDetail.readyToTrade', 'Ready to Trade?')}</h3>
                  <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                    Open a live account with {broker.name} in minutes with as little as ${broker.minimumDeposit || 0}.
                  </p>
                  <a
                    href={broker.website || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FFB800] text-white text-sm font-bold shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:scale-[1.02] transition-transform"
                  >
                    {t('brokerDetail.startNow', 'Start Now')} <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─ Trading Conditions Tab ─ */}
          {activeTab === 'conditions' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl border border-white/[0.07] bg-[#0C0C10]/40 backdrop-blur-xl p-8"
            >
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#FF6B00]" /> {t('brokerDetail.conditionsTab', 'Trading Conditions')}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: DollarSign, label: t('brokerDetail.minDeposit', 'Minimum Deposit'), value: broker.minimumDeposit ? `$${broker.minimumDeposit}` : '—', color: 'text-[#FF6B00]' },
                  { icon: TrendingUp, label: t('brokerDetail.maxLeverage', 'Maximum Leverage'), value: broker.leverage || '—', color: 'text-emerald-400' },
                  { icon: BarChart2, label: t('brokerDetail.spreadsFrom', 'Spreads From'), value: broker.spreads || '—', color: 'text-sky-400' },
                  { icon: Globe, label: t('brokerDetail.country', 'Operating Country'), value: broker.country || '—', color: 'text-purple-400' },
                  { icon: Clock, label: t('brokerDetail.executionSpeed', 'Execution Speed'), value: '< 10ms', color: 'text-amber-400' },
                  { icon: Lock, label: t('brokerDetail.fundProtection', 'Fund Protection'), value: isRegulated ? 'Segregated' : 'Standard', color: isRegulated ? 'text-emerald-400' : 'text-zinc-400' },
                  { icon: Layers, label: t('brokerDetail.accountTypes', 'Account Types'), value: 'Standard, Pro, ECN', color: 'text-zinc-300' },
                  { icon: Zap, label: t('brokerDetail.tradingPlatforms', 'Trading Platforms'), value: 'MT4, MT5, WebTrader', color: 'text-zinc-300' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="flex items-center gap-3">
                      <row.icon className={`w-4 h-4 ${row.color} flex-shrink-0`} />
                      <span className="text-sm text-zinc-400">{row.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ─ Reviews Tab ─ */}
          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Rating summary */}
              <div className="rounded-3xl border border-white/[0.07] bg-[#0C0C10]/40 backdrop-blur-xl p-8 flex flex-col sm:flex-row items-center gap-8">
                <div className="text-center flex-shrink-0">
                  <div className="text-7xl font-black text-white">{broker.rating ?? '—'}</div>
                  <StarRow rating={broker.rating ?? 0} />
                  <p className="text-xs text-zinc-500 mt-1">{broker.reviewCount ?? 0} total reviews</p>
                </div>
                <div className="flex-grow w-full space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
                    const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-xs text-zinc-400 w-4">{star}</span>
                        <Star className="w-3 h-3 fill-[#FF6B00] text-[#FF6B00]" />
                        <div className="flex-grow h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FFB800] transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500 w-8 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review cards */}
              {reviews.length === 0 ? (
                <div className="rounded-3xl border border-white/[0.07] bg-[#0C0C10]/40 backdrop-blur-xl p-12 text-center">
                  <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">{t('brokerDetail.noReviewsYet', 'No Reviews Yet')}</h3>
                  <p className="text-sm text-zinc-400">{t('brokerDetail.beFirstReview', 'Be the first to share your trading experience with this broker.')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review: any, i: number) => {
                    let pros: string[] = [];
                    let cons: string[] = [];
                    try {
                      if (typeof review.pros === 'string') pros = JSON.parse(review.pros);
                      else if (Array.isArray(review.pros)) pros = review.pros;
                      if (typeof review.cons === 'string') cons = JSON.parse(review.cons);
                      else if (Array.isArray(review.cons)) cons = review.cons;
                    } catch { /* ignore */ }

                    return (
                      <motion.div
                        key={review.id || i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className="rounded-2xl border border-white/[0.07] bg-[#0C0C10]/40 backdrop-blur-xl p-6"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-sm font-bold text-white">
                              {review.user?.name || review.author || t('brokerDetail.anonymousTrader', 'Anonymous Trader')}
                            </p>
                            {review.createdAt && (
                              <p className="text-[10px] text-zinc-500 mt-0.5">
                                {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </p>
                            )}
                          </div>
                          <StarRow rating={review.rating ?? 0} />
                        </div>

                        {review.comment && (
                          <p className="text-sm text-zinc-300 leading-relaxed mb-4">{review.comment}</p>
                        )}

                        {(pros.length > 0 || cons.length > 0) && (
                          <div className="grid sm:grid-cols-2 gap-4">
                            {pros.length > 0 && (
                              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                  <ThumbsUp className="w-3 h-3" /> {t('brokerDetail.pros', 'Pros')}
                                </p>
                                <ul className="space-y-1">
                                  {pros.map((p: string, j: number) => (
                                    <li key={j} className="text-xs text-zinc-300 flex items-start gap-1.5">
                                      <span className="text-emerald-400 mt-0.5">+</span> {p}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {cons.length > 0 && (
                              <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                                <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                  <ThumbsDown className="w-3 h-3" /> {t('brokerDetail.cons', 'Cons')}
                                </p>
                                <ul className="space-y-1">
                                  {cons.map((c: string, j: number) => (
                                    <li key={j} className="text-xs text-zinc-300 flex items-start gap-1.5">
                                      <span className="text-red-400 mt-0.5">−</span> {c}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
