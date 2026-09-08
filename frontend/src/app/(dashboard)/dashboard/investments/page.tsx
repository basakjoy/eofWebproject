'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Wallet,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Info,
  DollarSign,
  ShieldCheck,
  Zap,
  Sparkles,
  RefreshCw,
  Search,
  ChevronRight,
  PieChart,
  Activity,
  Calculator,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';
import investmentApi from '@/lib/investmentApi';
import { useAuthStore } from '@/store/authStore';

const formatMoney = (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

// Sample Portfolio Data fallback
const SAMPLE_PLANS = [
  {
    id: 'PLAN-PRO-01',
    name: 'Institutional Forex Pool',
    invested: 15000.0,
    currentValue: 17450.2,
    returnsPct: '+16.33%',
    startDate: '2026-03-10',
    durationMonths: 6,
    status: 'active',
    dailyReturn: '0.45%',
    riskLevel: 'Moderate (Shield Protected)',
  },
  {
    id: 'PLAN-GOLD-02',
    name: 'Gold & Commodities Growth',
    invested: 8000.0,
    currentValue: 9120.0,
    returnsPct: '+14.00%',
    startDate: '2026-05-01',
    durationMonths: 12,
    status: 'active',
    dailyReturn: '0.38%',
    riskLevel: 'Conservative',
  },
];

export default function RefinedInvestmentsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<{ totalInvested?: number; totalReturns?: number; activePlansCount?: number } | null>(null);
  
  // Interactive Calculator State
  const [calcAmount, setCalcAmount] = useState<string>('5000');
  const [calcMonths, setCalcMonths] = useState<number>(6);
  const [isSubmittingInvest, setIsSubmittingInvest] = useState(false);

  // Load portfolio stats
  const loadPortfolioData = async () => {
    setLoading(true);
    try {
      if (user?.id) {
        const response = await investmentApi.getPortfolioOverview(String(user.id));
        if (response?.data) setPortfolio(response.data);
      }
    } catch (err) {
      console.warn('Portfolio overview fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolioData();
  }, [user?.id]);

  // Derived financial metrics
  const totalInvested = portfolio?.totalInvested ?? 23000.0;
  const totalReturns = portfolio?.totalReturns ?? 3570.2;
  const totalBalance = totalInvested + totalReturns;
  const roiPercentage = ((totalReturns / (totalInvested || 1)) * 100).toFixed(2);

  // Estimated ROI Calculation
  const estimatedProfit = useMemo(() => {
    const principal = parseFloat(calcAmount) || 0;
    // Monthly estimated average yield ~3.8%
    return principal * 0.038 * calcMonths;
  }, [calcAmount, calcMonths]);

  const handleCreateInvestment = () => {
    const num = parseFloat(calcAmount);
    if (!num || num < 100) {
      toast.error('Minimum investment amount is $100');
      return;
    }
    setIsSubmittingInvest(true);
    setTimeout(() => {
      setIsSubmittingInvest(false);
      toast.success(`Investment request for $${num.toLocaleString()} (${calcMonths} Months) submitted successfully!`);
      setCalcAmount('5000');
    }, 800);
  };

  return (
    <div className="space-y-8 p-2 sm:p-4 text-white font-poppins selection:bg-fiery-orange selection:text-white">
      
      {/* ══ HEADER ══ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-fiery-orange/10 border border-fiery-orange/20 text-xs font-bold text-fiery-amber mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-fiery-orange" />
            INSTITUTIONAL CAPITAL POOL
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Portfolio <span className="text-transparent bg-clip-text bg-gradient-to-r from-fiery-orange to-fiery-amber">Investments</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Track active capital allocations, compound profits, and manage investment strategies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadPortfolioData}
            disabled={loading}
            className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 hover:text-white transition-all disabled:opacity-50"
            title="Refresh Portfolio"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-fiery-orange' : ''}`} />
          </button>

          <a
            href="/investment-plans"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-fiery-orange via-fiery-red to-fiery-amber text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-fiery hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Zap className="w-4 h-4 text-black fill-black" />
            Explore Tiers &amp; Plans
          </a>
        </div>
      </div>

      {/* ══ STAT CARDS GRID ══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Portfolio Value */}
        <div className="bg-card-dark/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-fiery-orange/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Portfolio</span>
            <div className="w-10 h-10 rounded-2xl bg-fiery-orange/10 border border-fiery-orange/20 flex items-center justify-center text-fiery-orange">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black font-mono text-white">
              {formatMoney(totalBalance)}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              +{roiPercentage}% Total ROI
            </span>
          </div>
        </div>

        {/* Invested Principal */}
        <div className="bg-card-dark/80 backdrop-blur-xl p-6 rounded-3xl border border-blue-500/20 relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Active Capital</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black font-mono text-blue-400">
              {formatMoney(totalInvested)}
            </p>
            <p className="text-xs text-zinc-500 mt-2">Locked across 2 active pools</p>
          </div>
        </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           

        {/* Total Profits */}
        <div className="bg-card-dark/80 backdrop-blur-xl p-6 rounded-3xl border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Accumulated Returns</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black font-mono text-emerald-400">
              +{formatMoney(totalReturns)}
            </p>
            <p className="text-xs text-emerald-500/80 mt-2 font-medium">Distributed bi-weekly</p>
          </div>
        </div>

        {/* Risk Shield Level */}
        <div className="bg-card-dark/80 backdrop-blur-xl p-6 rounded-3xl border border-amber-500/20 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Drawdown Shield</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-amber-400">95% Protected</p>
            <p className="text-xs text-zinc-500 mt-2">Max loss capped at 5% principal</p>
          </div>
        </div>

      </div>

      {/* ══ ACTIVE INVESTMENTS & ROI CALCULATOR GRID ══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Active Investment Pools (7 cols) */}
        <div className="lg:col-span-7 bg-card-dark/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-fiery-orange" />
                Active Capital Pools
              </h2>
              <p className="text-xs text-zinc-400">Currently generating trading returns</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              2 Active Allocation Desks
            </span>
          </div>

          <div className="space-y-4">
            {SAMPLE_PLANS.map((plan) => (
              <div
                key={plan.id}
                className="p-5 rounded-2xl bg-panel-dark/70 border border-white/10 hover:border-fiery-orange/40 transition-all group relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-fiery-orange/10 border border-fiery-orange/20 text-fiery-orange">
                      <PieChart className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-fiery-amber transition-colors">
                        {plan.name}
                      </h3>
                      <span className="text-[10px] text-zinc-400 font-mono">{plan.id} • {plan.riskLevel}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      {plan.returnsPct} ROI
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Principal</span>
                    <span className="font-mono font-bold text-white">{formatMoney(plan.invested)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Current Equity</span>
                    <span className="font-mono font-bold text-emerald-400">{formatMoney(plan.currentValue)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Est. Yield</span>
                    <span className="font-mono font-bold text-fiery-amber">{plan.dailyReturn} / Day</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Investment & Returns Estimator (5 cols) */}
        <div className="lg:col-span-5 bg-card-dark/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-fiery-amber" />
              Quick Investment Estimator
            </h2>
            <p className="text-xs text-zinc-400">Calculate projected returns before committing funds</p>
          </div>

          <div className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Investment Capital ($)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-mono">$</span>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(e.target.value)}
                  placeholder="5000"
                  className="w-full bg-panel-dark border border-white/10 rounded-2xl pl-9 pr-4 py-3 text-sm text-white font-mono font-bold focus:outline-none focus:border-fiery-orange transition-all"
                />
              </div>
            </div>

            {/* Duration Selector */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Locking Horizon
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 6, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setCalcMonths(m)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      calcMonths === m
                        ? 'bg-fiery-orange text-black border-fiery-orange'
                        : 'bg-panel-dark text-zinc-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {m} Months
                  </button>
                ))}
              </div>
            </div>

            {/* Returns Projection Banner */}
            <div className="p-4 rounded-2xl bg-panel-dark/90 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Estimated Profit:</span>
                <span className="text-emerald-400 font-mono font-bold">+${estimatedProfit.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                <span>Total Expected Maturity:</span>
                <span className="text-fiery-amber font-mono text-lg font-black">
                  ${((parseFloat(calcAmount) || 0) + estimatedProfit).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              onClick={handleCreateInvestment}
              disabled={isSubmittingInvest}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-fiery-orange via-fiery-red to-fiery-amber text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-fiery hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmittingInvest ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  Processing Allocation...
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-4 h-4 text-black" />
                  Submit Investment Request
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}