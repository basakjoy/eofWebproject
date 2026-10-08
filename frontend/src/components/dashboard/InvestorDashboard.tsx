'use client';

import StatCard from '@/components/common/StatCard';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { DollarSign, TrendingUp, Wallet, ArrowUpRight, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { investmentApi } from '@/lib/investmentApi';
import { useAuthStore } from '@/store/authStore';
import { useLanguage } from '@/context/LanguageContext';
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
  duration: number;
  status: InvestmentStatus;
  estimatedReturns: number;
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('investorDashboard.title', 'Investor Dashboard')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{t('investorDashboard.subtitle', 'Manage your investments and track returns.')}</p>
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
                  <th className="px-4 py-3 text-left font-semibold">{t('investorDashboard.duration', 'Duration')}</th>
                  <th className="px-4 py-3 text-left font-semibold">{t('investorDashboard.status', 'Status')}</th>
                  <th className="px-4 py-3 text-left font-semibold">{t('investorDashboard.returns', 'Returns')}</th>
                  <th className="px-4 py-3 text-left font-semibold">{t('investorDashboard.created', 'Created')}</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr key={inv.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 font-medium">{currency(inv.amount)}</td>
                    <td className="px-4 py-3">
                      {inv.duration} {inv.duration === 1 ? t('investorDashboard.month', 'month') : t('investorDashboard.months', 'months')}
                    </td>
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
                      {currency(inv.estimatedReturns)}
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
    </div>
  );
}