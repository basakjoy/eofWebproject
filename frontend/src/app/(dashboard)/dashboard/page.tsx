'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import investmentApi from '@/lib/investmentApi';
import { withdrawalsApi } from '@/lib/withdrawalsApi';
import {
  Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, History,
  DollarSign, PieChart, Activity, BarChart3, Eye, EyeOff,
  X, ChevronRight, RefreshCw, CheckCircle, AlertCircle,
  Clock, Zap, Crown, ArrowRight, Plus
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Portfolio {
  totalInvested: number;
  totalReturns: number;
  roi: string;
  activeInvestments: number;
  completedInvestments: number;
  investments: Investment[];
  recentTransactions: Transaction[];
}

interface Investment {
  id: string;
  plan: string;
  amount: number;
  roi: number;
  status: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description?: string;
  createdAt: string;
}

interface WithdrawForm {
  amount: string;
  method: string;
  reason: string;
}

interface InvestForm {
  amount: string;
  plan: string;
  duration: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const statusStyle: Record<string, string> = {
  completed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  active: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  failed: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
  cancelled: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, accent }: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm p-5 group hover:border-slate-700 transition-all duration-300">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${accent} pointer-events-none`} />
      <div className="relative z-10">
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 bg-gradient-to-br ${accent} opacity-80`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-white">{value}</p>
        {sub && <p className="text-xs text-emerald-400 font-medium mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }: {
  title: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-4 duration-300 ${type === 'success' ? 'bg-emerald-950 border-emerald-800 text-emerald-300' : 'bg-rose-950 border-rose-800 text-rose-300'
      }`}>
      {type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function UserDashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('User');
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  // Modals
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);

  // Forms
  const [withdrawForm, setWithdrawForm] = useState<WithdrawForm>({ amount: '', method: 'bank', reason: '' });
  const [investForm, setInvestForm] = useState<InvestForm>({ amount: '', plan: 'Standard', duration: '6' });
  const [submitting, setSubmitting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  const loadData = useCallback(async (uid: string) => {
    try {
      const [portfolioRes, txRes] = await Promise.allSettled([
        investmentApi.getPortfolioOverview(uid),
        investmentApi.getUserTransactions(uid, { limit: 20 }),
      ]);
      if (portfolioRes.status === 'fulfilled') setPortfolio(portfolioRes.value?.data ?? null);
      if (txRes.status === 'fulfilled') setTransactions(txRes.value?.data ?? []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const raw = localStorage.getItem('user');
      if (!raw) { router.push('/login'); return; }
      const u = JSON.parse(raw);
      const uid = u.id || u.userId;
      setUserId(uid);
      setUserName(u.name || 'User');
      await loadData(uid);
      setLoading(false);
    };
    init();
  }, [loadData, router]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData(userId);
    setRefreshing(false);
  };

  const handleWithdraw = async () => {
    if (!withdrawForm.amount || Number(withdrawForm.amount) <= 0) {
      showToast('Please enter a valid amount.', 'error'); return;
    }
    setSubmitting(true);
    try {
      await withdrawalsApi.requestWithdrawal({
        amount: Number(withdrawForm.amount),
        method: withdrawForm.method,
        notes: withdrawForm.reason,
      });
      showToast('Withdrawal request submitted successfully!', 'success');
      setShowWithdrawModal(false);
      setWithdrawForm({ amount: '', method: 'bank', reason: '' });
      await loadData(userId);
    } catch {
      showToast('Failed to submit withdrawal. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInvest = async () => {
    if (!investForm.amount || Number(investForm.amount) < 100) {
      showToast('Minimum investment amount is $100.', 'error'); return;
    }
    setSubmitting(true);
    try {
      await investmentApi.createInvestment({
        userId,
        amount: Number(investForm.amount),
        plan: investForm.plan,
        duration: Number(investForm.duration),
      });
      showToast('Investment created successfully!', 'success');
      setShowInvestModal(false);
      setInvestForm({ amount: '', plan: 'Standard', duration: '6' });
      await loadData(userId);
    } catch {
      showToast('Failed to create investment. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Derived values ────────────────────────────────────────────────────────

  const totalBalance = (portfolio?.totalInvested ?? 0) + (portfolio?.totalReturns ?? 0);
  const txDeposits = transactions.filter(t => t.type === 'deposit').reduce((s, t) => s + Number(t.amount), 0);
  const txWithdrawals = transactions.filter(t => t.type === 'withdrawal').reduce((s, t) => s + Number(t.amount), 0);

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-slate-400 text-sm font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-full p-6 space-y-6 bg-slate-950 text-white">

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{userName}</span> 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">Here's your portfolio overview for today.</p>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-medium text-slate-300 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Hero Balance Card ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 sm:p-8 shadow-2xl">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-8 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-2">Total Portfolio Value</p>
            <div className="flex items-center gap-3">
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {showBalance ? `$${fmt(totalBalance)}` : '$••••••'}
              </h2>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                {showBalance ? <EyeOff className="w-5 h-5 text-blue-200" /> : <Eye className="w-5 h-5 text-blue-200" />}
              </button>
            </div>
            {portfolio?.totalReturns != null && (
              <p className="text-emerald-300 text-sm font-bold mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +${fmt(portfolio.totalReturns)} returns · ROI: {portfolio.roi}%
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowInvestModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/50"
            >
              <Plus className="w-4 h-4" /> New Investment
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all backdrop-blur-sm"
            >
              <ArrowUpRight className="w-4 h-4" /> Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Investments"
          value={String(portfolio?.activeInvestments ?? 0)}
          icon={Zap}
          accent="from-blue-600/20 to-blue-700/5"
        />
        <StatCard
          label="Total Invested"
          value={`$${fmt(portfolio?.totalInvested ?? 0)}`}
          icon={DollarSign}
          accent="from-indigo-600/20 to-indigo-700/5"
        />
        <StatCard
          label="Total Returns"
          value={`$${fmt(portfolio?.totalReturns ?? 0)}`}
          sub={portfolio?.roi ? `+${portfolio.roi}% ROI` : undefined}
          icon={TrendingUp}
          accent="from-emerald-600/20 to-emerald-700/5"
        />
        <StatCard
          label="Completed Plans"
          value={String(portfolio?.completedInvestments ?? 0)}
          icon={CheckCircle}
          accent="from-violet-600/20 to-violet-700/5"
        />
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Investments List */}
        <div className="xl:col-span-2 rounded-2xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-white">Active Investments</h3>
            </div>
            <button
              onClick={() => router.push('/dashboard/investments')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              View all <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/60">
            {portfolio?.investments && portfolio.investments.length > 0 ? (
              portfolio.investments.slice(0, 6).map((inv) => (
                <div key={inv.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-800/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/30 to-indigo-600/20 flex items-center justify-center border border-blue-500/20">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{inv.plan} Plan</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(inv.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-white text-sm">${fmt(inv.amount)}</p>
                      <p className="text-xs text-emerald-400">+${fmt(inv.roi ?? 0)}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusStyle[inv.status] ?? statusStyle.pending}`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <PieChart className="w-12 h-12 text-slate-700 mb-3" />
                <p className="text-slate-400 font-medium">No investments yet</p>
                <p className="text-slate-600 text-sm mt-1">Start your first investment today</p>
                <button
                  onClick={() => setShowInvestModal(true)}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Summary */}
        <div className="space-y-4">
          {/* Cashflow summary */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm p-5">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" /> Cash Flow
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-2">
                  <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-slate-300">Deposits</span>
                </div>
                <span className="text-emerald-400 font-bold text-sm">${fmt(txDeposits)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-rose-400" />
                  <span className="text-sm text-slate-300">Withdrawals</span>
                </div>
                <span className="text-rose-400 font-bold text-sm">${fmt(txWithdrawals)}</span>
              </div>
            </div>
          </div>

          {/* Premium CTA */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 p-5">
            <Crown className="absolute -top-3 -right-3 w-16 h-16 text-amber-500/10" />
            <Crown className="w-7 h-7 text-amber-400 mb-3" />
            <h4 className="font-bold text-white text-sm mb-1">Go Premium</h4>
            <p className="text-slate-400 text-xs mb-4 leading-relaxed">
              Unlock exclusive signals, advanced analytics, and priority support.
            </p>
            <button
              onClick={() => router.push('/dashboard/premium')}
              className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              Upgrade now <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Transactions ── */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white">Recent Transactions</h3>
          </div>
          <button
            onClick={() => router.push('/dashboard/transactions')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          {transactions.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/60">
                  {['Type', 'Amount', 'Status', 'Description', 'Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {transactions.slice(0, 10).map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${tx.type === 'deposit' || tx.type === 'profit' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                          {tx.type === 'deposit' || tx.type === 'profit'
                            ? <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                            : <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
                          }
                        </div>
                        <span className="capitalize text-sm font-semibold text-white">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-bold ${tx.type === 'deposit' || tx.type === 'profit' ? 'text-emerald-400' : 'text-white'}`}>
                        {tx.type === 'deposit' || tx.type === 'profit' ? '+' : '-'}${fmt(Number(tx.amount))}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyle[tx.status] ?? statusStyle.pending}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-500 truncate max-w-[160px] block">{tx.description || '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs">{new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Wallet className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-slate-400 font-medium">No transactions yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Withdraw Modal ── */}
      {showWithdrawModal && (
        <Modal title="Request Withdrawal" onClose={() => setShowWithdrawModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number" min="1" placeholder="0.00"
                  value={withdrawForm.amount}
                  onChange={e => setWithdrawForm(p => ({ ...p, amount: e.target.value }))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Method</label>
              <select
                value={withdrawForm.method}
                onChange={e => setWithdrawForm(p => ({ ...p, method: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="bank">Bank Transfer</option>
                <option value="crypto">Crypto Wallet</option>
                <option value="wallet">Digital Wallet</option>
                <option value="card">Card</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reason (optional)</label>
              <textarea
                rows={3} placeholder="Reason for withdrawal..."
                value={withdrawForm.reason}
                onChange={e => setWithdrawForm(p => ({ ...p, reason: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowWithdrawModal(false)} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors">
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
                Submit Request
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Invest Modal ── */}
      {showInvestModal && (
        <Modal title="New Investment" onClose={() => setShowInvestModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Amount (Min $100)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number" min="100" placeholder="100.00"
                  value={investForm.amount}
                  onChange={e => setInvestForm(p => ({ ...p, amount: e.target.value }))}
                  className="w-full pl-8 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Investment Plan</label>
              <div className="grid grid-cols-3 gap-2">
                {['Standard', 'Growth', 'Premium'].map(p => (
                  <button
                    key={p}
                    onClick={() => setInvestForm(f => ({ ...f, plan: p }))}
                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${investForm.plan === p
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Duration</label>
              <div className="grid grid-cols-4 gap-2">
                {['3', '6', '12', '24'].map(d => (
                  <button
                    key={d}
                    onClick={() => setInvestForm(f => ({ ...f, duration: d }))}
                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${investForm.duration === d
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                  >
                    {d}mo
                  </button>
                ))}
              </div>
            </div>

            {investForm.amount && Number(investForm.amount) >= 100 && (
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <p className="text-xs text-slate-400 mb-1">Estimated Returns (6% monthly)</p>
                <p className="text-lg font-black text-emerald-400">
                  +${investmentApi.calculateEstimatedReturns(Number(investForm.amount), Number(investForm.duration))}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowInvestModal(false)} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors">
                Cancel
              </button>
              <button
                onClick={handleInvest}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
                Invest Now
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
