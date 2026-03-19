'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/common/Sidebar';
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
  Activity,
  BarChart3,
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Save
} from 'lucide-react';
import investmentApi from '@/lib/investmentApi';
import { useThemeStore } from '@/store/themeStore';
import { useThemeColors } from '@/lib/themeColors';
import { LogoIcon } from '@/components/common/LogoIcon';

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
  const [activeTab, setActiveTab] = useState<'investments' | 'transactions' | 'analytics' | 'profile' | 'settings'>('investments');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('user@example.com');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          setUserId(userData.id);
          setUserName(userData.firstName || 'User');
          setUserEmail(userData.email || 'user@example.com');

          const portfolioData = await investmentApi.getPortfolioOverview(userData.id);
          setPortfolio(portfolioData.data);

          const statsData = await investmentApi.getInvestmentStats(userData.id);
          setStats(statsData.data);

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
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen transition-all duration-300" style={{ backgroundColor: colors.bg.primary }}>
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main Content */}
      <div className={`flex-1 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} ml-16 transition-all duration-300`}>
        {/* Top Header */}
        <header className="border-b transition-colors duration-300 sticky top-0 z-40" style={{ borderColor: colors.border, backgroundColor: colors.bg.primary }}>
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LogoIcon size={44} rounded className="flex-shrink-0" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold transition-colors duration-300" style={{ color: colors.text.primary }}>
                    Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm transition-colors duration-300" style={{ color: colors.text.secondary }}>
                    Welcome back, {userName}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                className="hover:bg-red-100"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Portfolio Overview Section */}
          <Card className="mb-6 sm:mb-8 transition-all duration-300" style={{ backgroundColor: colors.bg.card, borderColor: colors.border }}>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {/* Main Balance */}
                <div className="lg:col-span-1">
                  <p className="text-xs sm:text-sm transition-colors duration-300 mb-2" style={{ color: colors.text.secondary }}>
                    Total Balance
                  </p>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold transition-colors duration-300" style={{ color: colors.text.primary }}>
                      ${showBalance ? ((portfolio?.totalInvested || 0) + (portfolio?.totalReturns || 0)).toFixed(2) : '••••••'}
                    </h2>
                    <button 
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-1.5 sm:p-2 rounded-lg transition-colors duration-300"
                      style={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgb(243,244,246)' }}
                    >
                      {showBalance ? <Eye className="w-4 h-4 sm:w-5 sm:h-5" /> : <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm mt-2 text-green-600">
                    +${portfolio?.totalReturns?.toFixed(2) || '0.00'} (ROI: {portfolio?.roi || '0'}%)
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                  <div className="p-3 sm:p-4 rounded-lg transition-colors duration-300" style={{ backgroundColor: colors.bg.secondary }}>
                    <p className="text-xs transition-colors duration-300 mb-1" style={{ color: colors.text.secondary }}>
                      Active Inv.
                    </p>
                    <p className="text-lg sm:text-2xl font-bold transition-colors duration-300" style={{ color: colors.text.primary }}>
                      {portfolio?.activeInvestments || 0}
                    </p>
                  </div>

                  <div className="p-3 sm:p-4 rounded-lg transition-colors duration-300" style={{ backgroundColor: colors.bg.secondary }}>
                    <p className="text-xs transition-colors duration-300 mb-1" style={{ color: colors.text.secondary }}>
                      Invested
                    </p>
                    <p className="text-lg sm:text-2xl font-bold transition-colors duration-300" style={{ color: colors.text.primary }}>
                      ${portfolio?.totalInvested?.toFixed(0) || '0'}
                    </p>
                  </div>

                  <div className="p-3 sm:p-4 rounded-lg transition-colors duration-300" style={{ backgroundColor: colors.bg.secondary }}>
                    <p className="text-xs transition-colors duration-300 mb-1" style={{ color: colors.text.secondary }}>
                      Returns
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-green-600">
                      ${portfolio?.totalReturns?.toFixed(0) || '0'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs sm:text-sm flex-1 sm:flex-none">
                  <DollarSign className="w-4 h-4 mr-1 sm:mr-2" />
                  New Investment
                </Button>
                <Button variant="outline" className="text-xs sm:text-sm flex-1 sm:flex-none">
                  <ArrowUpRight className="w-4 h-4 mr-1 sm:mr-2" />
                  Withdraw
                </Button>
                <Button variant="outline" className="text-xs sm:text-sm flex-1 sm:flex-none">
                  <BarChart3 className="w-4 h-4 mr-1 sm:mr-2" />
                  Analytics
                </Button>
              </div>
            </div>
          </Card>

          {/* Tabs Navigation */}
          <div className="flex gap-2 sm:gap-4 mb-6 border-b overflow-x-auto transition-colors duration-300" style={{ borderColor: colors.border }}>
            {[
              { id: 'investments', label: 'Investments', icon: TrendingUp },
              { id: 'transactions', label: 'Transactions', icon: History },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b-2 transition-colors duration-300 font-medium text-xs sm:text-sm whitespace-nowrap ${
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
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          
          {/* Investments Tab */}
          {activeTab === 'investments' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2">
                <Card style={{ backgroundColor: colors.bg.card, borderColor: colors.border }}>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 transition-colors duration-300" style={{ color: colors.text.primary }}>
                      Your Investments
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {portfolio?.investments?.slice(0, 5).map((inv: any) => (
                        <div 
                          key={inv.id} 
                          className="flex items-center justify-between p-3 sm:p-4 rounded-lg transition-colors duration-300"
                          style={{ backgroundColor: colors.bg.secondary }}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-xs sm:text-sm transition-colors duration-300" style={{ color: colors.text.primary }}>
                                {inv.plan} Plan
                              </p>
                              <p className="text-xs transition-colors duration-300" style={{ color: colors.text.secondary }}>
                                {inv.duration}mo • {inv.status}
                              </p>
                            </div>
                          </div>
                          <div className="text-right ml-2">
                            <p className="font-semibold text-xs sm:text-sm transition-colors duration-300" style={{ color: colors.text.primary }}>
                              ${inv.amount?.toFixed(0) || '0'}
                            </p>
                            <p className="text-xs text-green-600">
                              +${inv.returns?.toFixed(0) || '0'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card style={{ backgroundColor: colors.bg.card, borderColor: colors.border }}>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-4 transition-colors duration-300" style={{ color: colors.text.primary }}>
                      Summary
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs transition-colors duration-300 mb-1" style={{ color: colors.text.secondary }}>Total Invested</p>
                        <p className="text-lg sm:text-xl font-bold transition-colors duration-300" style={{ color: colors.text.primary }}>
                          ${portfolio?.totalInvested?.toFixed(0) || '0'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs transition-colors duration-300 mb-1" style={{ color: colors.text.secondary }}>Total Profit</p>
                        <p className="text-lg sm:text-xl font-bold text-green-600">
                          ${portfolio?.totalReturns?.toFixed(0) || '0'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs transition-colors duration-300 mb-1" style={{ color: colors.text.secondary }}>ROI</p>
                        <p className="text-lg sm:text-xl font-bold text-green-600">
                          {portfolio?.roi || '0'}%
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <Card style={{ backgroundColor: colors.bg.card, borderColor: colors.border }}>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 transition-colors duration-300" style={{ color: colors.text.primary }}>
                  Transaction History
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium transition-colors duration-300" style={{ color: colors.text.secondary }}>
                          Type
                        </th>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium transition-colors duration-300" style={{ color: colors.text.secondary }}>
                          Amount
                        </th>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium transition-colors duration-300" style={{ color: colors.text.secondary }}>
                          Status
                        </th>
                        <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium transition-colors duration-300" style={{ color: colors.text.secondary }}>
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx: any) => (
                        <tr key={tx.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                          <td className="py-2 sm:py-4 px-2 sm:px-4">
                            <div className="flex items-center gap-1 sm:gap-2">
                              {tx.type === 'deposit' ? <ArrowDownLeft className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" /> : <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />}
                              <span className="capitalize transition-colors duration-300" style={{ color: colors.text.primary }}>
                                {tx.type}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 sm:py-4 px-2 sm:px-4 font-semibold transition-colors duration-300" style={{ color: colors.text.primary }}>
                            ${tx.amount?.toFixed(0) || '0'}
                          </td>
                          <td className="py-2 sm:py-4 px-2 sm:px-4">
                            <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded text-xs font-medium ${
                              tx.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-2 sm:py-4 px-2 sm:px-4 transition-colors duration-300" style={{ color: colors.text.secondary }}>
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

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Card style={{ backgroundColor: colors.bg.card, borderColor: colors.border }}>
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-4 transition-colors duration-300" style={{ color: colors.text.primary }}>
                    Performance
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="transition-colors duration-300" style={{ color: colors.text.secondary }}>Total Return</span>
                      <span className="font-bold text-green-600">${portfolio?.totalReturns?.toFixed(0) || '0'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="transition-colors duration-300" style={{ color: colors.text.secondary }}>ROI %</span>
                      <span className="font-bold text-green-600">{portfolio?.roi || '0'}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="transition-colors duration-300" style={{ color: colors.text.secondary }}>Completed</span>
                      <span className="font-bold transition-colors duration-300" style={{ color: colors.text.primary }}>{portfolio?.completedInvestments || 0}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card style={{ backgroundColor: colors.bg.card, borderColor: colors.border }}>
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-4 transition-colors duration-300" style={{ color: colors.text.primary }}>
                    Distribution
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="transition-colors duration-300" style={{ color: colors.text.secondary }}>Active Plans</span>
                      <span className="font-bold transition-colors duration-300" style={{ color: colors.text.primary }}>{portfolio?.activeInvestments || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="transition-colors duration-300" style={{ color: colors.text.secondary }}>Avg per Investment</span>
                      <span className="font-bold transition-colors duration-300" style={{ color: colors.text.primary }}>
                        ${portfolio?.activeInvestments > 0 ? (portfolio?.totalInvested / portfolio?.activeInvestments).toFixed(0) : '0'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="transition-colors duration-300" style={{ color: colors.text.secondary }}>Total Transactions</span>
                      <span className="font-bold transition-colors duration-300" style={{ color: colors.text.primary }}>{transactions.length}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card style={{ backgroundColor: colors.bg.card, borderColor: colors.border }}>
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b" style={{ borderColor: colors.border }}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold transition-colors duration-300" style={{ color: colors.text.primary }}>
                      {userName}
                    </h3>
                    <p className="text-xs sm:text-sm transition-colors duration-300" style={{ color: colors.text.secondary }}>
                      {userEmail}
                    </p>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs sm:text-sm">
                    <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Change Avatar
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2 transition-colors duration-300" style={{ color: colors.text.primary }}>
                      First Name
                    </label>
                    <Input 
                      defaultValue={userName}
                      className="text-xs sm:text-sm"
                      style={{ backgroundColor: colors.bg.primary, borderColor: colors.border, color: colors.text.primary }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2 transition-colors duration-300" style={{ color: colors.text.primary }}>
                      Email
                    </label>
                    <Input 
                      defaultValue={userEmail}
                      disabled
                      className="text-xs sm:text-sm"
                      style={{ backgroundColor: colors.bg.primary, borderColor: colors.border, color: colors.text.primary }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <Card style={{ backgroundColor: colors.bg.card, borderColor: colors.border }}>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-6 transition-colors duration-300" style={{ color: colors.text.primary }}>
                  Settings
                </h3>
                <div className="space-y-4 sm:space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2 transition-colors duration-300" style={{ color: colors.text.primary }}>
                      Portfolio Visibility
                    </label>
                    <select 
                      className="w-full px-3 sm:px-4 py-2 border rounded-lg text-xs sm:text-sm transition-colors duration-300"
                      style={{ borderColor: colors.border, backgroundColor: colors.bg.primary, color: colors.text.primary }}
                    >
                      <option>Private (Only you)</option>
                      <option>Public (Everyone)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-3 transition-colors duration-300" style={{ color: colors.text.primary }}>
                      Notifications
                    </label>
                    <div className="space-y-2 sm:space-y-3">
                      <label className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="transition-colors duration-300" style={{ color: colors.text.secondary }}>
                          Email on new returns
                        </span>
                      </label>
                      <label className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="transition-colors duration-300" style={{ color: colors.text.secondary }}>
                          Investment updates
                        </span>
                      </label>
                      <label className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="transition-colors duration-300" style={{ color: colors.text.secondary }}>
                          Weekly summary
                        </span>
                      </label>
                    </div>
                  </div>

                  <Button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs sm:text-sm">
                    <Save className="w-4 h-4 mr-1 sm:mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
