'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/dashboard/ui/card';
import { Button } from '@/components/dashboard/ui/button';
import { 
  TrendingUp,
  DollarSign,
  PieChart,
  Activity,
  ArrowUpRight,
  Target
} from 'lucide-react';
import investmentApi from '@/lib/investmentApi';
import { useThemeColors } from '@/lib/themeColors';

export default function InvestmentDashboard() {
  const colors = useThemeColors();
  const [userId, setUserId] = useState<string>('');
  const [portfolio, setPortfolio] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          setUserId(userData.id);

          const [portfolioData, statsData] = await Promise.all([
            investmentApi.getPortfolioOverview(userData.id),
            investmentApi.getInvestmentStats(userData.id)
          ]);

          setPortfolio(portfolioData.data);
          setStats(statsData.data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Loading investment dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.bg.primary }} className="p-8 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Invested',
            value: `$${portfolio?.totalInvested?.toFixed(2) || '0.00'}`,
            icon: DollarSign,
            color: 'from-blue-600 to-blue-400'
          },
          {
            label: 'Total Returns',
            value: `$${portfolio?.totalReturns?.toFixed(2) || '0.00'}`,
            icon: TrendingUp,
            color: 'from-green-600 to-green-400'
          },
          {
            label: 'ROI',
            value: `${portfolio?.roi || '0'}%`,
            icon: ArrowUpRight,
            color: 'from-purple-600 to-purple-400'
          },
          {
            label: 'Active Investments',
            value: portfolio?.activeInvestments || 0,
            icon: Activity,
            color: 'from-orange-600 to-orange-400'
          }
        ].map((item, idx) => (
          <Card key={idx} style={{ backgroundColor: colors.bg.card, borderColor: colors.border }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: colors.text.secondary }} className="text-sm mb-1">
                    {item.label}
                  </p>
                  <p style={{ color: colors.text.primary }} className="text-2xl font-bold">
                    {item.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${item.color}`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ backgroundColor: colors.bg.card, borderColor: colors.border }}>
        <div className="p-6">
          <h3 style={{ color: colors.text.primary }} className="text-lg font-semibold mb-6">
            Your Investments
          </h3>
          <div className="space-y-4">
            {portfolio?.investments?.map((inv: any) => (
              <div 
                key={inv.id}
                style={{ backgroundColor: colors.bg.secondary }}
                className="p-4 rounded-lg flex items-center justify-between"
              >
                <div>
                  <h4 style={{ color: colors.text.primary }} className="font-semibold">
                    {inv.plan} Plan
                  </h4>
                  <p style={{ color: colors.text.secondary }} className="text-sm">
                    {inv.duration} months • Status: {inv.status}
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ color: colors.text.primary }} className="font-semibold">
                    ${inv.amount?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-green-600 text-sm">
                    +${inv.returns?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
