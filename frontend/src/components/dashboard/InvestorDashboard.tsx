'use client';

import StatCard from '@/components/common/StatCard';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { DollarSign, TrendingUp, Wallet, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { investmentApi } from '@/lib/investmentApi';
import { useAuthStore } from '@/store/authStore';
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

interface PortfolioData {
  totalInvested: number;
  totalReturns: number;
  roi: string;
  activeInvestments: number;
  completedInvestments: number;
  investments: any[];
}

export default function InvestorDashboard() {
  const { user } = useAuthStore();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback data for charts if API data is not available
  const fallbackInvestmentData = [
    { month: 'Jan', invested: 5000, profit: 250 },
    { month: 'Feb', invested: 5000, profit: 380 },
    { month: 'Mar', invested: 7000, profit: 650 },
    { month: 'Apr', invested: 7000, profit: 920 },
    { month: 'May', invested: 10000, profit: 1450 },
    { month: 'Jun', invested: 10000, profit: 1850 },
  ];

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const data = await investmentApi.getPortfolioOverview(user.id);
          setPortfolio(data.data);
          setError(null);
        }
      } catch (err: any) {
        console.error('Error fetching portfolio:', err);
        setError('Failed to load portfolio data');
        // Keep existing data if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [user?.id]);

  const investmentData = fallbackInvestmentData;
  const investments = portfolio?.investments || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Investor Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your investments and track returns.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Invested"
          value={`$${(portfolio?.totalInvested || 0).toLocaleString()}`}
          icon={<Wallet className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          label="Total Profit"
          value={`$${(portfolio?.totalReturns || 0).toLocaleString()}`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          trend={{ 
            value: parseFloat(portfolio?.roi || '0'), 
            isPositive: parseFloat(portfolio?.roi || '0') >= 0 
          }}
        />
        <StatCard
          label="Average ROI"
          value={`${portfolio?.roi || '0'}%`}
          icon={<ArrowUpRight className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          label="Active Investments"
          value={`${portfolio?.activeInvestments || 0}`}
          icon={<DollarSign className="w-6 h-6" />}
          color="blue"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Investment Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={investmentData}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#10B981"
                fillOpacity={1}
                fill="url(#colorProfit)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Invested vs Profit</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={investmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="invested" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Active Investments */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Investments</h2>
          <Button size="sm">New Investment</Button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading investments...</div>
        ) : investments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Duration</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Returns</th>
                  <th className="px-4 py-3 text-left font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr key={inv.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 font-medium">${inv.amount?.toLocaleString() || 0}</td>
                    <td className="px-4 py-3">{inv.duration} months</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          inv.status === 'active'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                            : inv.status === 'completed'
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100'
                            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100'
                        }`}
                      >
                        {inv.status?.charAt(0).toUpperCase() + inv.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-green-600 dark:text-green-400 font-medium">
                      ${inv.estimatedReturns?.toLocaleString() || 0}
                    </td>
                    <td className="px-4 py-3">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No investments yet. Create one to get started!</p>
            <Button className="mt-4">Create Investment</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
