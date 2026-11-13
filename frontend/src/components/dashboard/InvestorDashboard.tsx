'use client';

import StatCard from '@/components/common/StatCard';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { AlertCircle, ArrowUpRight, CheckCircle2, DollarSign, LoaderCircle, RefreshCw, TrendingUp, Wallet, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { investmentApi } from '@/lib/investmentApi';
import { UserWithdrawalAccount, WithdrawalMethodOption, withdrawalsApi } from '@/lib/withdrawalsApi';
import { useAuthStore } from '@/store/authStore';
import { useLanguage } from '@/context/LanguageContext';
import axios from 'axios';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type InvestmentStatus = 'active' | 'completed' | 'pending' | string;

interface Investment {
  id: string;
  amount: number;
  plan: string;
  status: InvestmentStatus;
  roi: number | string;
  createdAt: string;
}

interface MonthlyPerformancePoint {
  month: string;
  invested: number;
  profit: number;
}

interface PortfolioData {
  totalInvested: number;
  totalReturns: number;
  roi: string;
  activeInvestments: number;
  completedInvestments: number;
  investments: Investment[];
  monthlyPerformance?: MonthlyPerformancePoint[];
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
  completed: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100',
  pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
};
const DEFAULT_STATUS_STYLE = 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';

function formatDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
}

function currency(value?: number): string {
  return `$${(value ?? 0).toLocaleString()}`;
}

export default function InvestorDashboard() {
  const { user } = useAuthStore();
  const { t } = useLanguage();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalMethods, setWithdrawalMethods] = useState<WithdrawalMethodOption[]>([]);
  const [withdrawalAccounts, setWithdrawalAccounts] = useState<UserWithdrawalAccount[]>([]);
  const [withdrawalOptionsLoading, setWithdrawalOptionsLoading] = useState(false);
  const [withdrawalOptionsError, setWithdrawalOptionsError] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalMethodCode, setWithdrawalMethodCode] = useState('');
  const [withdrawalAccountId, setWithdrawalAccountId] = useState('');
  const [withdrawalReason, setWithdrawalReason] = useState('');
  const [withdrawalSubmitting, setWithdrawalSubmitting] = useState(false);
  const [withdrawalSubmitError, setWithdrawalSubmitError] = useState('');
  const [withdrawalSubmitted, setWithdrawalSubmitted] = useState(false);

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchPortfolioData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await investmentApi.getPortfolioOverview(user.id);
      if (!isMountedRef.current) return;
      setPortfolio(res?.data ?? null);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      if (!isMountedRef.current) return;
      setError(t('investorDashboard.failedToLoadPortfolio', 'Failed to load your portfolio. Please try again.'));
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [t, user?.id]);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  const investments = portfolio?.investments ?? [];
  const roiValue = parseFloat(portfolio?.roi ?? '0') || 0;
  const chartData = portfolio?.monthlyPerformance ?? [];

  const formatStatus = (status?: InvestmentStatus): string => {
    const normalized = String(status ?? '').toLowerCase();
    if (!normalized) return t('investorDashboard.unknown', 'Unknown');

    const statusMap: Record<string, string> = {
      active: t('common.active', 'Active'),
      completed: t('common.completed', 'Completed'),
      pending: t('common.pending', 'Pending'),
    };

    return statusMap[normalized] ?? normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const handleNewInvestment = () => router.push('/dashboard/investments');

  const loadWithdrawalOptions = useCallback(async () => {
    setWithdrawalOptionsLoading(true);
    setWithdrawalOptionsError('');
    try {
      const [methodsResult, accountsResult] = await Promise.all([
        withdrawalsApi.getWithdrawalMethods(),
        withdrawalsApi.getUserWithdrawalAccounts(),
      ]);
      if (!methodsResult.success || !Array.isArray(methodsResult.data)) {
        throw new Error(methodsResult.message || t('investorDashboard.withdrawalOptionsError', 'Unable to load withdrawal methods.'));
      }
      if (!accountsResult.success || !Array.isArray(accountsResult.data)) {
        throw new Error(accountsResult.message || t('investorDashboard.withdrawalAccountsError', 'Unable to load saved payout accounts.'));
      }

      const methods = methodsResult.data;
      const accounts = accountsResult.data;
      setWithdrawalMethods(methods);
      setWithdrawalAccounts(accounts);
      setWithdrawalMethodCode((current) =>
        methods.some((method) => method.code === current) ? current : methods[0]?.code || ''
      );
      setWithdrawalAccountId((current) =>
        accounts.some((account) => account.id === current) ? current : ''
      );
    } catch (loadError) {
      const responseMessage = axios.isAxiosError(loadError) ? loadError.response?.data?.message : undefined;
      setWithdrawalOptionsError(
        typeof responseMessage === 'string'
          ? responseMessage
          : loadError instanceof Error
            ? loadError.message
            : t('investorDashboard.withdrawalOptionsError', 'Unable to load withdrawal options.')
      );
    } finally {
      setWithdrawalOptionsLoading(false);
    }
  }, [t]);

  const openWithdrawalModal = () => {
    setShowWithdrawalModal(true);
    setWithdrawalSubmitError('');
    setWithdrawalSubmitted(false);
    void loadWithdrawalOptions();
  };

  useEffect(() => {
    if (!showWithdrawalModal) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !withdrawalSubmitting) setShowWithdrawalModal(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [showWithdrawalModal, withdrawalSubmitting]);

  const selectedWithdrawalMethod = withdrawalMethods.find((method) => method.code === withdrawalMethodCode);
  const matchingWithdrawalAccounts = withdrawalAccounts.filter(
    (account) => account.method.code === withdrawalMethodCode
  );

  const handleWithdrawalMethodChange = (code: string) => {
    setWithdrawalMethodCode(code);
    const matchingAccounts = withdrawalAccounts.filter((account) => account.method.code === code);
    setWithdrawalAccountId(matchingAccounts.find((account) => account.isDefault)?.id || '');
    setWithdrawalSubmitError('');
  };

  const handleWithdrawalSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(withdrawalAmount);
    const minimum = Number(selectedWithdrawalMethod?.minAmount);
    const maximum = Number(selectedWithdrawalMethod?.maxAmount);
    if (!selectedWithdrawalMethod || !Number.isFinite(amount) || amount <= 0) {
      setWithdrawalSubmitError(t('investorDashboard.validWithdrawalAmount', 'Enter a valid withdrawal amount.'));
      return;
    }
    if (selectedWithdrawalMethod.minAmount !== null && amount < minimum) {
      setWithdrawalSubmitError(
        t('investorDashboard.withdrawalMinimum', 'The minimum for this method is ${{amount}}.')
          .replace('{{amount}}', currency(minimum))
      );
      return;
    }
    if (selectedWithdrawalMethod.maxAmount !== null && amount > maximum) {
      setWithdrawalSubmitError(
        t('investorDashboard.withdrawalMaximum', 'The maximum for this method is ${{amount}}.')
          .replace('{{amount}}', currency(maximum))
      );
      return;
    }

    setWithdrawalSubmitting(true);
    setWithdrawalSubmitError('');
    try {
      const result = await withdrawalsApi.requestWithdrawal({
        amount,
        method: selectedWithdrawalMethod.code,
        ...(withdrawalAccountId ? { accountId: withdrawalAccountId } : {}),
        ...(withdrawalReason.trim() ? { reason: withdrawalReason.trim() } : {}),
      });
      if (!result.success) {
        throw new Error(result.message || t('investorDashboard.withdrawalRequestError', 'Unable to submit your withdrawal request.'));
      }
      setWithdrawalSubmitted(true);
      setWithdrawalAmount('');
      setWithdrawalReason('');
    } catch (submitError) {
      const responseMessage = axios.isAxiosError(submitError) ? submitError.response?.data?.message : undefined;
      setWithdrawalSubmitError(
        typeof responseMessage === 'string'
          ? responseMessage
          : submitError instanceof Error
            ? submitError.message
            : t('investorDashboard.withdrawalRequestError', 'Unable to submit your withdrawal request.')
      );
    } finally {
      setWithdrawalSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('investorDashboard.title', 'Investor Dashboard')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('investorDashboard.subtitle', 'Manage your investments and track returns.')}</p>
        </div>
        <button
          type="button"
          onClick={openWithdrawalModal}
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:self-auto"
        >
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          {t('dashboard.withdraw', 'Withdraw')}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
        >
          <span>{error}</span>
          <button
            onClick={fetchPortfolioData}
            className="inline-flex items-center gap-1.5 text-sm font-semibold underline hover:no-underline shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t('common.retry', 'Retry')}
          </button>
        </div>
      )}

      {/* Stats */}
      {loading && !portfolio ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
              aria-hidden="true"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label={t('investorDashboard.totalInvested', 'Total Invested')}
            value={currency(portfolio?.totalInvested)}
            icon={<Wallet className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            label={t('investorDashboard.totalProfit', 'Total Profit')}
            value={currency(portfolio?.totalReturns)}
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
            trend={{ value: roiValue, isPositive: roiValue >= 0 }}
          />
          <StatCard
            label={t('investorDashboard.averageRoi', 'Average ROI')}
            value={`${portfolio?.roi ?? '0'}%`}
            icon={<ArrowUpRight className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            label={t('investorDashboard.activeInvestments', 'Active Investments')}
            value={`${portfolio?.activeInvestments ?? 0}`}
            icon={<DollarSign className="w-6 h-6" />}
            color="blue"
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('investorDashboard.growthChart', 'Investment Growth')}</h2>
          </div>
          {loading && !portfolio ? (
            <div className="h-[300px] rounded bg-gray-100 dark:bg-gray-800 animate-pulse" role="status" aria-label={t('investorDashboard.loadingGrowth', 'Loading investment growth')} />
          ) : chartData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">{t('investorDashboard.noMonthlyPerformance', 'No monthly performance data available.')}</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number | undefined) => (value !== undefined ? currency(value) : '')} />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('investorDashboard.investedVsProfit', 'Invested vs Profit')}</h2>
          </div>
          {loading && !portfolio ? (
            <div className="h-[300px] rounded bg-gray-100 dark:bg-gray-800 animate-pulse" role="status" aria-label={t('investorDashboard.loadingComparison', 'Loading invested versus profit chart')} />
          ) : chartData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">{t('investorDashboard.noMonthlyPerformance', 'No monthly performance data available.')}</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number | undefined) => (value !== undefined ? currency(value) : '')} />
                <Legend />
                <Line type="monotone" dataKey="invested" name={t('investorDashboard.invested', 'Invested')} stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" name={t('investorDashboard.profit', 'Profit')} stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Active Investments */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('investorDashboard.myInvestments', 'My Investments')}</h2>
          <Button size="sm" onClick={handleNewInvestment}>{t('investorDashboard.newInvestment', 'New Investment')}</Button>
        </div>
        {loading && investments.length === 0 ? (
          <div className="space-y-2" aria-hidden="true">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : investments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">{t('investorDashboard.amount', 'Amount')}</th>
                  <th className="px-4 py-3 text-left font-semibold">{t('investorDashboard.plan', 'Plan')}</th>
                  <th className="px-4 py-3 text-left font-semibold">{t('investorDashboard.status', 'Status')}</th>
                  <th className="px-4 py-3 text-left font-semibold">{t('investorDashboard.returns', 'Returns')}</th>
                  <th className="px-4 py-3 text-left font-semibold">{t('investorDashboard.created', 'Created')}</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr key={inv.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 font-medium">{currency(inv.amount)}</td>
                    <td className="px-4 py-3">{inv.plan}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          STATUS_STYLES[inv.status] ?? DEFAULT_STATUS_STYLE
                        }`}
                      >
                        {formatStatus(inv.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400 font-medium">
                      {currency(Number(inv.roi))}
                    </td>
                    <td className="px-4 py-3">{formatDate(inv.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>{t('investorDashboard.noInvestments', 'No investments yet. Create one to get started!')}</p>
            <Button className="mt-4" onClick={handleNewInvestment}>{t('investorDashboard.createInvestment', 'Create Investment')}</Button>
          </div>
        )}
      </Card>

      {showWithdrawalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !withdrawalSubmitting) setShowWithdrawalModal(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="investor-withdrawal-title"
            className="my-auto w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-800 sm:p-6">
              <div>
                <h2 id="investor-withdrawal-title" className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('investorDashboard.requestWithdrawal', 'Request a withdrawal')}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {t('investorDashboard.withdrawalReviewNotice', 'Your request will be reviewed before funds are sent.')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowWithdrawalModal(false)}
                disabled={withdrawalSubmitting}
                aria-label={t('common.close', 'Close')}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {withdrawalOptionsLoading ? (
                <div className="flex min-h-40 items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-300" role="status">
                  <LoaderCircle className="h-5 w-5 animate-spin text-blue-600" aria-hidden="true" />
                  {t('investorDashboard.loadingWithdrawalOptions', 'Loading withdrawal options...')}
                </div>
              ) : withdrawalOptionsError ? (
                <div className="space-y-4" role="alert">
                  <p className="text-sm text-red-600 dark:text-red-400">{withdrawalOptionsError}</p>
                  <button
                    type="button"
                    onClick={() => void loadWithdrawalOptions()}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
                  >
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    {t('common.retry', 'Retry')}
                  </button>
                </div>
              ) : withdrawalSubmitted ? (
                <div className="space-y-5 text-center" role="status">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {t('investorDashboard.withdrawalSubmitted', 'Withdrawal request submitted')}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {t('investorDashboard.withdrawalSubmittedDetails', 'You can track its status in your transaction history.')}
                    </p>
                  </div>
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                    <button
                      type="button"
                      onClick={() => setShowWithdrawalModal(false)}
                      className="min-h-11 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
                    >
                      {t('common.close', 'Close')}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push('/dashboard/transactions')}
                      className="min-h-11 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    >
                      {t('investorDashboard.viewWithdrawalHistory', 'View transaction history')}
                    </button>
                  </div>
                </div>
              ) : withdrawalMethods.length === 0 ? (
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p>{t('investorDashboard.noWithdrawalMethods', 'Withdrawals are currently unavailable. Please try again later or contact support.')}</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleWithdrawalSubmit}>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                    {t('transactions.amount', 'Amount (USD)')}
                    <div className="relative mt-1.5">
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-500">$</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        min={selectedWithdrawalMethod?.minAmount ?? 0.01}
                        max={selectedWithdrawalMethod?.maxAmount ?? undefined}
                        step="0.01"
                        required
                        value={withdrawalAmount}
                        onChange={(event) => {
                          setWithdrawalAmount(event.target.value);
                          setWithdrawalSubmitError('');
                        }}
                        className="min-h-11 w-full rounded-lg border border-gray-300 bg-white py-2 pl-8 pr-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    {(selectedWithdrawalMethod?.minAmount != null || selectedWithdrawalMethod?.maxAmount != null) && (
                      <span className="mt-1 block text-xs font-normal text-gray-600 dark:text-gray-400">
                        {selectedWithdrawalMethod.minAmount != null && `${t('investorDashboard.minimum', 'Min')}: ${currency(Number(selectedWithdrawalMethod.minAmount))}`}
                        {selectedWithdrawalMethod.minAmount != null && selectedWithdrawalMethod.maxAmount != null && ' · '}
                        {selectedWithdrawalMethod.maxAmount != null && `${t('investorDashboard.maximum', 'Max')}: ${currency(Number(selectedWithdrawalMethod.maxAmount))}`}
                      </span>
                    )}
                  </label>

                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                    {t('transactions.paymentMethod', 'Withdrawal method')}
                    <select
                      required
                      value={withdrawalMethodCode}
                      onChange={(event) => handleWithdrawalMethodChange(event.target.value)}
                      className="mt-1.5 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      {withdrawalMethods.map((method) => (
                        <option key={method.id} value={method.code}>{method.name}</option>
                      ))}
                    </select>
                    {selectedWithdrawalMethod?.processingTime && (
                      <span className="mt-1 block text-xs font-normal text-gray-600 dark:text-gray-400">
                        {t('investorDashboard.processingTime', 'Processing time')}: {selectedWithdrawalMethod.processingTime}
                      </span>
                    )}
                  </label>

                  {matchingWithdrawalAccounts.length > 0 ? (
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                      {t('investorDashboard.payoutAccount', 'Payout account')}
                      <select
                        value={withdrawalAccountId}
                        onChange={(event) => setWithdrawalAccountId(event.target.value)}
                        className="mt-1.5 min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="">{t('investorDashboard.noSavedAccount', 'No saved account')}</option>
                        {matchingWithdrawalAccounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.accountName}{account.isDefault ? ` (${t('investorDashboard.defaultAccount', 'default')})` : ''}{!account.verified ? ` (${t('investorDashboard.unverifiedAccount', 'unverified')})` : ''}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <p className="rounded-lg border border-amber-300/50 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                      {t('investorDashboard.noSavedAccountNotice', 'No saved payout account is available for this method. Your request may need payout details confirmed before it can be processed.')}
                    </p>
                  )}

                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                    {t('investorDashboard.withdrawalReason', 'Note (optional)')}
                    <textarea
                      rows={3}
                      maxLength={500}
                      value={withdrawalReason}
                      onChange={(event) => setWithdrawalReason(event.target.value)}
                      className="mt-1.5 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </label>

                  {withdrawalSubmitError && (
                    <p className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400" role="alert">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      {withdrawalSubmitError}
                    </p>
                  )}

                  <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      disabled={withdrawalSubmitting}
                      onClick={() => setShowWithdrawalModal(false)}
                      className="min-h-11 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
                    >
                      {t('common.cancel', 'Cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={withdrawalSubmitting}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {withdrawalSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
                      {withdrawalSubmitting
                        ? t('investorDashboard.submittingWithdrawal', 'Submitting...')
                        : t('investorDashboard.submitWithdrawal', 'Submit withdrawal')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}