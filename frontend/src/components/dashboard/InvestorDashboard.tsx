'use client';

import StatCard from '@/components/common/StatCard';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { DollarSign, TrendingUp, Wallet, ArrowUpRight } from 'lucide-react';
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

export default function InvestorDashboard() {
  const investmentData = [
    { month: 'Jan', invested: 5000, profit: 250 },
    { month: 'Feb', invested: 5000, profit: 380 },
    { month: 'Mar', invested: 7000, profit: 650 },
    { month: 'Apr', invested: 7000, profit: 920 },
    { month: 'May', invested: 10000, profit: 1450 },
    { month: 'Jun', invested: 10000, profit: 1850 },
  ];

  const investments = [
    {
      id: 1,
      amount: 10000,
      date: 'Jun 1, 2024',
      status: 'approved',
      profit: 1850,
      roi: 18.5,
    },
    {
      id: 2,
      amount: 5000,
      date: 'May 15, 2024',
      status: 'approved',
      profit: 650,
      roi: 13,
    },
    {
      id: 3,
      amount: 3000,
      date: 'Apr 20, 2024',
      status: 'pending',
      profit: 0,
      roi: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Investor Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your investments and track returns.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Invested"
          value="$28,000"
          icon={<Wallet className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          label="Total Profit"
          value="$4,930"
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          trend={{ value: 17.6, isPositive: true }}
        />
        <StatCard
          label="Average ROI"
          value="17.6%"
          icon={<ArrowUpRight className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          label="Active Investments"
          value="3"
          icon={<DollarSign className="w-6 h-6" />}
          color="blue"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Investment Growth</h2>
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
          <h2 className="text-lg font-semibold mb-4">Invested vs Profit</h2>
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
          <h2 className="text-lg font-semibold">My Investments</h2>
          <Button size="sm">New Investment</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Amount</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Profit</th>
                <th className="px-4 py-3 text-left font-semibold">ROI</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((inv) => (
                <tr key={inv.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">${inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">{inv.date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        inv.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-green-600 font-medium">${inv.profit}</td>
                  <td className="px-4 py-3 font-medium">{inv.roi}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
