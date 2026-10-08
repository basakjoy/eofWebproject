'use client';

import Link from 'next/link';
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  LineChart as LineChartIcon,
  ShieldCheck,
  Signal,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useLanguage } from '@/context/LanguageContext';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useSignals } from '@/hooks/useSignals';

type InvestmentRow = {
  amount?: number | string;
  createdAt?: string;
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const signalColors = ['#10B981', '#F97316'];

function buildContributionHistory(investments: InvestmentRow[], locale: string) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) =>
    new Date(now.getFullYear(), now.getMonth() - 5 + index, 1)
  );

  return months.map((month) => {
    const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
    const amount = investments.reduce((total, investment) => {
      const createdAt = investment.createdAt ? new Date(investment.createdAt) : null;
      if (!createdAt || Number.isNaN(createdAt.getTime())) return total;
      return createdAt >= month && createdAt < nextMonth
        ? total + Number(investment.amount ?? 0)
        : total;
    }, 0);

    return {
      month: month.toLocaleDateString(locale, { month: 'short' }),
      amount,
    };
  });
}

function formatSignalDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function PremiumDashboard() {
  const { t, locale } = useLanguage();
  const { portfolio, loading: portfolioLoading, error: portfolioError } = usePortfolio();
  const {
    signals,
    loading: signalsLoading,
    error: signalsError,
    total: activeSignalCount,
  } = useSignals({ status: 'active', limit: 20 });

  const investments = (portfolio?.investments ?? []) as InvestmentRow[];
  const totalInvested = Number(portfolio?.totalInvested ?? 0);
  const projectedReturns = Number(portfolio?.totalReturns ?? 0);
  const projectedRoi = totalInvested > 0 ? (projectedReturns / totalInvested) * 100 : 0;
  const contributionHistory = buildContributionHistory(investments, locale);
  const monthlySignalMix = [
    { name: t('userDashboard.premium.buySignals', 'Buy signals'), value: signals.filter((signal) => signal.type === 'BUY').length },
    { name: t('userDashboard.premium.sellSignals', 'Sell signals'), value: signals.filter((signal) => signal.type === 'SELL').length },
  ].filter((item) => item.value > 0);

  const metrics = [
    {
      label: t('userDashboard.premium.activeSignals', 'Active Signals'),
      value: signalsLoading ? '—' : signalsError ? 'Unavailable' : activeSignalCount.toLocaleString(),
      detail: t('userDashboard.premium.activeSignalsDetail', 'Currently open setups'),
      icon: Signal,
      accent: 'text-[#FF8A32] bg-[#FF6B00]/10',
    },
    {
      label: t('userDashboard.premium.capitalDeployed', 'Capital Deployed'),
      value: portfolioLoading ? '—' : portfolioError ? 'Unavailable' : currencyFormatter.format(totalInvested),
      detail: t('userDashboard.premium.acrossInvestments', 'Across your investments'),
      icon: Wallet,
      accent: 'text-sky-400 bg-sky-400/10',
    },
    {
      label: t('userDashboard.premium.projectedReturns', 'Projected Returns'),
      value: portfolioLoading ? '—' : portfolioError ? 'Unavailable' : currencyFormatter.format(projectedReturns),
      detail: t('userDashboard.premium.estimatedFromInvestments', 'Estimated from active plans'),
      icon: TrendingUp,
      accent: 'text-emerald-400 bg-emerald-400/10',
    },
    {
      label: t('userDashboard.premium.projectedRoi', 'Projected ROI'),
      value: portfolioLoading ? '—' : portfolioError ? 'Unavailable' : `${projectedRoi.toFixed(2)}%`,
      detail: t('userDashboard.premium.returnAgainstCapital', 'Returns against capital deployed'),
      icon: BarChart3,
      accent: 'text-amber-300 bg-amber-300/10',
    },
  ];

  const quickLinks = [
    {
      href: '/signals',
      label: t('userDashboard.premium.browseSignals', 'Browse signals'),
      description: t('userDashboard.premium.browseSignalsDesc', 'Review active market setups'),
      icon: Activity,
      accent: 'text-[#FF8A32]',
    },
    {
      href: '/dashboard/investments',
      label: t('userDashboard.premium.manageInvestments', 'Manage investments'),
      description: t('userDashboard.premium.manageInvestmentsDesc', 'View plans and positions'),
      icon: CircleDollarSign,
      accent: 'text-emerald-400',
    },
    {
      href: '/market-analysis',
      label: t('userDashboard.premium.marketAnalysis', 'Market analysis'),
      description: t('userDashboard.premium.marketAnalysisDesc', 'Read analyst perspectives'),
      icon: LineChartIcon,
      accent: 'text-sky-400',
    },
  ];

  return (
    <div className="min-h-full space-y-6 px-4 py-6 text-white sm:px-6 xl:px-8">
      <header className="flex flex-col gap-5 border-b border-white/[0.07] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF8A32]">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t('userDashboard.premium.workspaceLabel', 'Premium workspace')}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {t('userDashboard.premium.title', 'Premium Dashboard')}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-white/45">
            {t('userDashboard.premium.subtitle', 'Your signals and investment performance, in one place.')}
          </p>
        </div>
        <Link
          href="/signals"
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#FF6B00] px-4 text-sm font-semibold text-[#160B03] transition-colors hover:bg-[#FF8A32] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A32] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508]"
        >
          {t('userDashboard.premium.openSignals', 'Open signals desk')}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </header>

      {(portfolioError || signalsError) && (
        <div role="status" className="flex flex-wrap items-center gap-x-2 gap-y-1 border-l-2 border-amber-400 px-3 py-2 text-xs text-amber-200/80">
          <span>{t('userDashboard.premium.partialData', 'Some dashboard data could not be loaded.')}</span>
          <span>{t('userDashboard.premium.retryByReloading', 'Refresh the page to try again.')}</span>
        </div>
      )}

      <section aria-label={t('userDashboard.premium.accountOverview', 'Account overview')} className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className="min-w-0 rounded-xl border border-white/[0.07] bg-[#0C0C10] p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">{metric.label}</p>
                  <p className="mt-2 truncate text-2xl font-semibold tabular-nums text-white" aria-live="polite">{metric.value}</p>
                </div>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${metric.accent}`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-3 text-xs text-white/35">{metric.detail}</p>
            </article>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
        <article className="min-w-0 rounded-xl border border-white/[0.07] bg-[#0C0C10] p-4 sm:p-5">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#FF8A32]" aria-hidden="true" />
                <h2 className="text-sm font-semibold text-white">{t('userDashboard.premium.contributionHistory', 'Contribution history')}</h2>
              </div>
              <p className="mt-1 text-xs text-white/40">{t('userDashboard.premium.contributionHistoryDetail', 'Investment capital added by month, over the last six months')}</p>
            </div>
            <span className="rounded-md border border-white/[0.08] px-2.5 py-1 text-[10px] font-medium text-white/45">
              {t('userDashboard.premium.lastSixMonths', 'Last 6 months')}
            </span>
          </div>

          <div className="h-56 min-w-0 sm:h-64">
            {portfolioLoading ? (
              <div className="h-full animate-pulse rounded-lg bg-white/[0.035]" role="status" aria-label={t('common.loading', 'Loading')} />
            ) : portfolioError ? (
              <div className="flex h-full items-center justify-center text-sm text-white/40">{t('userDashboard.premium.chartUnavailable', 'Contribution history is unavailable.')}</div>
            ) : investments.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                <Wallet className="h-5 w-5 text-white/25" aria-hidden="true" />
                <p className="text-sm text-white/50">{t('userDashboard.premium.noInvestments', 'No investments to chart yet.')}</p>
                <Link href="/dashboard/investments" className="text-xs font-medium text-[#FF8A32] hover:text-white">
                  {t('userDashboard.premium.explorePlans', 'Explore investment plans')} <ArrowRight className="inline h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 640, height: 256 }}>
                <AreaChart data={contributionHistory} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="premiumContributions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B00" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#FF6B00" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#FFFFFF" strokeOpacity={0.07} vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 11 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717A', fontSize: 10 }} tickFormatter={(value: number) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111116', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }}
                    formatter={(value: number | undefined) => [currencyFormatter.format(value ?? 0), t('userDashboard.premium.capitalAdded', 'Capital added')]}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#FF8A32" strokeWidth={2} fill="url(#premiumContributions)" activeDot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </article>

        <article className="min-w-0 rounded-xl border border-white/[0.07] bg-[#0C0C10] p-4 sm:p-5">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#FF8A32]" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-white">{t('userDashboard.premium.activeSignalMix', 'Active signal mix')}</h2>
            </div>
            <p className="mt-1 text-xs text-white/40">{t('userDashboard.premium.latestSignalsMix', 'Buy and sell setups in the latest active signals')}</p>
          </div>

          {signalsLoading ? (
            <div className="h-48 animate-pulse rounded-lg bg-white/[0.035]" role="status" aria-label={t('common.loading', 'Loading')} />
          ) : signalsError ? (
            <div className="flex h-48 items-center justify-center text-sm text-white/40">{t('userDashboard.premium.signalsUnavailable', 'Signal data is unavailable.')}</div>
          ) : monthlySignalMix.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-center">
              <Signal className="h-5 w-5 text-white/25" aria-hidden="true" />
              <p className="text-sm text-white/50">{t('userDashboard.premium.noActiveSignals', 'No active signals right now.')}</p>
            </div>
          ) : (
            <div className="relative h-48 min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 280, height: 192 }}>
                <PieChart>
                  <Pie data={monthlySignalMix} dataKey="value" nameKey="name" innerRadius={53} outerRadius={76} paddingAngle={4} stroke="none">
                    {monthlySignalMix.map((entry, index) => <Cell key={entry.name} fill={signalColors[index]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#111116', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold tabular-nums text-white">{signals.length}</span>
                <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/35">{t('userDashboard.premium.recentSetups', 'Recent setups')}</span>
              </div>
            </div>
          )}

          {!signalsLoading && !signalsError && monthlySignalMix.length > 0 && (
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-white/[0.06] pt-4">
              {monthlySignalMix.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 text-xs text-white/55">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: signalColors[index] }} />
                  {item.name}<span className="font-semibold tabular-nums text-white">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
        <article className="min-w-0 overflow-hidden rounded-xl border border-white/[0.07] bg-[#0C0C10]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-4 sm:px-5">
            <div>
              <h2 className="text-sm font-semibold text-white">{t('userDashboard.premium.recentSignals', 'Recent active signals')}</h2>
              <p className="mt-1 text-xs text-white/40">{t('userDashboard.premium.recentSignalsDetail', 'The latest market setups available to your account')}</p>
            </div>
            <Link href="/signals" className="inline-flex items-center gap-1 text-xs font-medium text-[#FF8A32] transition-colors hover:text-white">
              {t('userDashboard.premium.viewAll', 'View all')} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {signalsLoading ? (
            <div className="space-y-3 p-5" role="status" aria-label={t('common.loading', 'Loading')}>
              {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-12 animate-pulse rounded-lg bg-white/[0.035]" />)}
            </div>
          ) : signalsError ? (
            <p className="px-5 py-10 text-center text-sm text-white/40">{t('userDashboard.premium.signalsUnavailable', 'Signal data is unavailable.')}</p>
          ) : signals.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-white/40">{t('userDashboard.premium.noActiveSignals', 'No active signals right now.')}</p>
          ) : (
            <div className="divide-y divide-white/[0.05]">
              {signals.slice(0, 5).map((signal) => {
                const isBuy = signal.type === 'BUY';
                return (
                  <div key={signal.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-3.5 sm:grid-cols-[minmax(0,1.2fr)_minmax(90px,0.8fr)_minmax(90px,0.8fr)_auto] sm:px-5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${isBuy ? 'bg-emerald-400/10 text-emerald-300' : 'bg-rose-400/10 text-rose-300'}`}>{signal.type}</span>
                        <span className="truncate text-sm font-semibold text-white">{signal.pair}</span>
                      </div>
                      <p className="mt-1 text-[10px] text-white/35">{signal.status || t('common.active', 'Active')}</p>
                    </div>
                    <div className="hidden min-w-0 sm:block">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-white/30">{t('userDashboard.premium.entry', 'Entry')}</p>
                      <p className="mt-1 truncate font-mono text-xs text-white/75">{signal.entryPrice || '—'}</p>
                    </div>
                    <div className="hidden min-w-0 sm:block">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-white/30">{t('userDashboard.premium.target', 'Target')}</p>
                      <p className="mt-1 truncate font-mono text-xs text-white/75">{signal.takeProfit || '—'}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                      <Clock3 className="h-3 w-3" aria-hidden="true" />
                      {formatSignalDate(signal.createdAt)}
                    </div>
                    <div className="col-span-2 flex gap-4 text-[10px] text-white/40 sm:hidden">
                      <span>{t('userDashboard.premium.entry', 'Entry')}: <span className="font-mono text-white/70">{signal.entryPrice || '—'}</span></span>
                      <span>{t('userDashboard.premium.target', 'Target')}: <span className="font-mono text-white/70">{signal.takeProfit || '—'}</span></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </article>

        <aside className="rounded-xl border border-white/[0.07] bg-[#0C0C10] p-4 sm:p-5">
          <div className="mb-2 flex items-center gap-2">
            <ArrowDownRight className="h-4 w-4 text-[#FF8A32]" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-white">{t('userDashboard.premium.tradingTools', 'Trading tools')}</h2>
          </div>
          <p className="mb-4 text-xs text-white/40">{t('userDashboard.premium.tradingToolsDetail', 'Go directly to your key trading workflows.')}</p>
          <div className="divide-y divide-white/[0.06]">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="group flex items-center gap-3 py-3 first:pt-2 last:pb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A32]">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] ${item.accent}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-white/85">{item.label}</span>
                    <span className="mt-0.5 block text-[10px] text-white/35">{item.description}</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/25 transition-transform group-hover:translate-x-0.5 group-hover:text-white/70" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
          <div className="mt-4 flex items-start gap-2 border-t border-white/[0.06] pt-4 text-[10px] leading-relaxed text-white/35">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400/70" aria-hidden="true" />
            {t('userDashboard.premium.riskNotice', 'Trading signals are informational. Always apply your own risk management.')}
          </div>
        </aside>
      </section>
    </div>
  );
}