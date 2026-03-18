'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/dashboard/ui/card';
import { Button } from '@/components/dashboard/ui/button';
import { Input } from '@/components/dashboard/ui/input';
import { 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  DollarSign,
  PieChart,
  Activity
} from 'lucide-react';
import investmentApi from '@/lib/investmentApi';
import { useThemeStore } from '@/store/themeStore';
import { useThemeColors } from '@/lib/themeColors';

export default function UserDashboard() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const colors = useThemeColors();
  
  const [userId, setUserId] = useState<string>('');
  const [portfolio, setPortfolio] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'settings'>('overview');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get user from localStorage or auth
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          setUserId(userData.id);

          // Fetch portfolio data
          const portfolioData = await investmentApi.getPortfolioOverview(userData.id);
          setPortfolio(portfolioData.data);

          // Fetch stats
          const statsData = await investmentApi.getInvestmentStats(userData.id);
          setStats(statsData.data);

          // Fetch transactions
          const txData = await investmentApi.getUserTransactions(userData.id, { limit: 10 });
          setTransactions(txData.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen transition-all duration-300" style={{ backgroundColor: colors.bg.primary }}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 transition-colors duration-300" style={{ color: colors.text.secondary }}>
              Loading your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-all duration-300" style={{ backgroundColor: colors.bg.primary }}>
      {/* Header */}
      <header className="border-b transition-colors duration-300" style={{ borderColor: colors.border, backgroundColor: colors.bg.primary }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold transition-colors duration-300" style={{ color: colors.text.primary }}>
                  Investment Dashboard
                </h1>
                <p className="text-sm transition-colors duration-300" style={{ color: colors.text.secondary }}>
                  Welcome back! Manage your investments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 transition-colors duration-300" style={{ color: colors.text.secondary }} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Portfolio Balance Card */}
        <Card className="mb-8 transition-all duration-300" style={{ backgroundColor: colors.bg.card, borderColor: colors.border }}>
          <div className="p-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-sm transition-colors duration-300 mb-2" style={{ color: colors.text.secondary }}>
                  Total Balance
                </p>
                <div className="flex items-center gap-4">
                  <h2 className="text-4xl font-bold transition-colors duration-300" style={{ color: colors.text.primary }}>
                    ${showBalance ? (portfolio?.totalInvested + portfolio?.totalReturns).toFixed(2) : '••••••'}
                  </h2>
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-2 rounded-lg transition-colors duration-300"
                    style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgb(243,244,246)' }}
                  >
                    {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm transition-colors duration-300 mb-2 text-green-600" style={{ color: '#16a34a' }}>
                  +{portfolio?.totalReturns?.toFixed(2)} (ROI: {portfolio?.roi}%)
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                  Withdraw Profits
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg transition-colors duration-300" style={{ backgroundColor: colors.bg.secondary }}>
                <p className="text-xs transition-colors duration-300 mb-2" style={{ color: colors.text.secondary }}>
                  Active Investments
                </p>
                <p className="text-2xl font-bold transition-colors duration-300" style={{ color: colors.text.primary }}>
                  {portfolio?.activeInvestments || 0}
                </p>
              </div>

              <div className="p-4 rounded-lg transition-colors duration-300" style={{ backgroundColor: colors.bg.secondary }}>
                <p className="text-xs transition-colors duration-300 mb-2" style={{ color: colors.text.secondary }}>
                  Total Invested
                </p>
                <p className="text-2xl font-bold transition-colors duration-300" style={{ color: colors.text.primary }}>
                  ${portfolio?.totalInvested?.toFixed(2) || '0.00'}
                </p>
              </div>

              <div className="p-4 rounded-lg transition-colors duration-300" style={{ backgroundColor: colors.bg.secondary }}>
                <p className="text-xs transition-colors duration-300 mb-2" style={{ color: colors.text.secondary }}>
                  Total Returns
                </p>
                <p className="text-2xl font-bold text-green-600" style={{ color: '#16a34a' }}>
                  ${portfolio?.totalReturns?.toFixed(2) || '0.00'}
                </p>
              </div>

              <div className="p-4 rounded-lg transition-colors duration-300" style={{ backgroundColor: colors.bg.secondary }}>
                <p className="text-xs transition-colors duration-300 mb-2" style={{ color: colors.text.secondary }}>
                  ROI
                </p>
                <p className="text-2xl font-bold text-green-600" style={{ color: '#16a34a' }}>
                  {portfolio?.roi || '0'}%
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs Navigation */}
        <div className="flex gap-4 mb-6 border-b transition-colors duration-300" style={{ borderColor: colors.border }}>
          {[
            { id: 'overview', label: 'Overview', icon: PieChart },
            { id: 'transactions', label: 'Transactions', icon: History },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors duration-300 font-medium ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent'
              }`}
              style={{ 
                color: activeTab === tab.id ? '#2563eb' : colors.text.secondary,
                borderBottomColor: activeTab === tab.id ? '#2563eb' : 'transparent'
              }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card style={{ backgroundColor: colors.bg.card, borderColor: colors.border }}>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-6 transition-colors duration-300" style={{ color: colors.text.primary }}>
                    Recent Investments
                  </h3>
                  <div className="space-y-4">
                    {portfolio?.investments?.slice(0, 5).map((inv: any) => (
                      <div 
                        key={inv.id} 
                        className="flex items-center justify-between p-4 rounded-lg transition-colors duration-300"
                        style={{ backgroundColor: colors.bg.secondary }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium transition-colors duration-300" style={{ color: colors.text.primary }}>
                              {inv.plan} Plan
                            </p>
                            <p className="text-sm transition-colors duration-300" style={{ color: colors.text.secondary }}>
                              {inv.duration} months • {inv.status}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold transition-colors duration-300" style={{ color: colors.text.primary }}>
                            ${inv.amount?.toFixed(2) || '0.00'}
                          </p>
                          <p className="text-sm text-green-600" style={{ color: '#16a34a' }}>
                            +${inv.returns?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card style={{ backgroundColor: colors.bg.card, borderColor: colors.border }}>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-6 transition-colors duration-300" style={{ color: colors.text.primary }}>
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                      <DollarSign className="w-4 h-4 mr-2" />
                      New Investment
                    </Button>
                    <Button variant="outline" className="w-full">
                      <ArrowDownLeft className="w-4 h-4 mr-2" />
                      Withdraw
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Activity className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <Card style={{ backgroundColor: colors.bg.card, borderColor: colors.border }}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6 transition-colors duration-300" style={{ color: colors.text.primary }}>
                Transaction History
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                      <th className="text-left py-3 px-4 font-medium transition-colors duration-300" style={{ color: colors.text.secondary }}>
                        Type
                      </th>
                      <th className="text-left py-3 px-4 font-medium transition-colors duration-300" style={{ color: colors.text.secondary }}>
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-medium transition-colors duration-300" style={{ color: colors.text.secondary }}>
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium transition-colors duration-300" style={{ color: colors.text.secondary }}>
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx: any) => (
                      <tr key={tx.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {tx.type === 'deposit' ? <ArrowDownLeft className="w-4 h-4 text-green-600" /> : <ArrowUpRight className="w-4 h-4 text-red-600" />}
                            <span className="capitalize transition-colors duration-300" style={{ color: colors.text.primary }}>
                              {tx.type}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-semibold transition-colors duration-300 " style={{ color: colors.text.primary }}>
                          ${tx.amount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            tx.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 transition-colors duration-300" style={{ color: colors.text.secondary }}>
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <Card style={{ backgroundColor: colors.bg.card, borderColor: colors.border }}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6 transition-colors duration-300" style={{ color: colors.text.primary }}>
                Account Settings
              </h3>
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium mb-2 transition-colors duration-300" style={{ color: colors.text.primary }}>
                    Email Address
                  </label>
                  <Input 
                    type="email" 
                    defaultValue={`user@example.com`}
                    disabled
                    className="transition-colors duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 transition-colors duration-300" style={{ color: colors.text.primary }}>
                    Portfolio Visibility
                  </label>
                  <select 
                    className="w-full px-4 py-2 border rounded-lg transition-colors duration-300"
                    style={{ 
                      borderColor: colors.border, 
                      backgroundColor: colors.bg.primary,
                      color: colors.text.primary
                    }}
                  >
                    <option>Private (Only you can see)</option>
                    <option>Public (Everyone can see)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-4 transition-colors duration-300" style={{ color: colors.text.primary }}>
                    Notifications
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="transition-colors duration-300" style={{ color: colors.text.secondary }}>
                        Email on new returns
                      </span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="transition-colors duration-300" style={{ color: colors.text.secondary }}>
                        Investment status updates
                      </span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="transition-colors duration-300" style={{ color: colors.text.secondary }}>
                        Weekly summary
                      </span>
                    </label>
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
