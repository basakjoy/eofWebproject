'use client';

import StatCard from '@/components/common/StatCard';
import Card from '@/components/common/Card';
import { useLanguage } from '@/context/LanguageContext';
import { DollarSign, TrendingUp, Users, Activity } from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function PremiumDashboard() {
  const { t } = useLanguage();
  const portfolioData = [
    { month: 'Jan', value: 3500 },
    { month: 'Feb', value: 3000 },
    { month: 'Mar', value: 2700 },
    { month: 'Apr', value: 2680 },
    { month: 'May', value: 3000 },
    { month: 'Jun', value: 4000 },
  ];

  const signalDistribution = [
    { name: 'Buy', value: 45, color: '#10B981' },
    { name: 'Sell', value: 35, color: '#EF4444' },
    { name: 'TP', value: 15, color: '#3B82F6' },
    { name: 'SL', value: 5, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('userDashboard.premium.title', 'Premium Dashboard')}</h1>
        <p className="text-gray-600 mt-1">{t('userDashboard.premium.subtitle', 'Advanced trading signals and market analysis.')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label={t('userDashboard.premium.activeSignals', 'Active Signals')}
          value="12"
          icon={<Activity className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          label={t('userDashboard.premium.winRate', 'Win Rate')}
          value="72%"
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          label={t('userDashboard.premium.monthlyProfit', 'Monthly Profit')}
          value="$4,520"
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          label={t('userDashboard.premium.signalsThisMonth', 'Signals This Month')}
          value="28"
          icon={<Users className="w-6 h-6" />}
          color="yellow"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">{t('userDashboard.premium.tradingPerformance', 'Trading Performance')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={portfolioData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">{t('userDashboard.premium.signalDistribution', 'Signal Distribution')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={signalDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {signalDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Premium Features */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">{t('userDashboard.premium.features', 'Premium Features')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Real-Time Signals</h3>
            <p className="text-gray-600 text-sm">Get forex signals as they happen</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Market Analysis</h3>
            <p className="text-gray-600 text-sm">Deep technical and fundamental analysis</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Economic Calendar</h3>
            <p className="text-gray-600 text-sm">Stay updated with economic events</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Notifications</h3>
            <p className="text-gray-600 text-sm">Custom alerts for signals and news</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
