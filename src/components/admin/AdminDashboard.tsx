
"use client";

import {
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  Plus,
  Filter,
  Search,
  Eye,
  MessageSquare,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  BarChart3,
  Newspaper,
  TrendingDown,
  Bell,
  Settings as SettingsIcon,
  AlertCircle,
  CheckCircle,
  X,
  BookOpen,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useThemeStore } from "@/store/themeStore";
import { useThemeColors } from "@/lib/themeColors";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { SignalsCard } from "@/components/dashboard/SignalsCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { MarketInsightsCard } from "@/components/dashboard/MarketInsightsCard";
import { RecentArticlesCard } from "@/components/dashboard/RecentArticlesCard";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UserActivityCard } from "@/components/dashboard/UserActivityCard";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Badge from "@/components/common/Badge";
import adminApi from "@/lib/adminApi";

type DashboardTab = "overview" | "articles" | "users" | "signals" | "forex" | "blog" | "education" | "transactions" | "notifications" | "settings";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  status: "published" | "draft" | "review";
  views: number;
  comments: number;
  author: string;
  date: string;
  readTime: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  joinDate: string;
}

interface TradingSignal {
  id: string;
  pair: string;
  direction: "BUY" | "SELL";
  entryPrice: number;
  takeProfits: number[];
  stopLoss: number;
  accuracy: number;
  timeframe: string;
  status: "active" | "closed";
  profitLoss: number;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  views: number;
  category: string;
}

interface EducationModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
}

interface Transaction {
  id: string;
  user: string;
  type: "deposit" | "withdrawal" | "transfer" | "profit";
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  date: string;
  read: boolean;
}

const mockArticles: Article[] = [
  { id: "1", title: "Understanding Risk Management in Forex", excerpt: "Learn the fundamentals of protecting your capital...", category: "Education", status: "published", views: 1240, comments: 23, author: "John Smith", date: "Jan 20, 2026", readTime: "8 min" },
  { id: "2", title: "Weekly Market Outlook: EUR/USD Analysis", excerpt: "A comprehensive technical and fundamental analysis...", category: "Analysis", status: "published", views: 892, comments: 15, author: "Sarah Chen", date: "Jan 19, 2026", readTime: "5 min" },
  { id: "3", title: "Technical Indicators Every Trader Should Know", excerpt: "Master these essential indicators to improve...", category: "Education", status: "draft", views: 0, comments: 0, author: "Mike Johnson", date: "Jan 18, 2026", readTime: "12 min" },
  { id: "4", title: "Central Bank Policies and Currency Movements", excerpt: "How monetary policies affect forex markets...", category: "Blog", status: "review", views: 0, comments: 0, author: "Emma Davis", date: "Jan 17, 2026", readTime: "10 min" },
  { id: "5", title: "Psychology of Trading: Mastering Your Emotions", excerpt: "The mental game is crucial for trading success...", category: "Education", status: "published", views: 2100, comments: 45, author: "David Lee", date: "Jan 16, 2026", readTime: "7 min" },
];

const mockBlogPosts: BlogPost[] = [
  { id: "1", title: "Understanding Support and Resistance", excerpt: "Learn how to identify and trade key price levels...", author: "John Smith", date: "Feb 3, 2026", views: 2547, category: "Technical Analysis" },
  { id: "2", title: "Central Bank Impact on Forex", excerpt: "How monetary policy decisions affect currency pairs...", author: "Sarah Chen", date: "Feb 1, 2026", views: 1823, category: "Economics" },
  { id: "3", title: "Risk Management Best Practices", excerpt: "Essential strategies to protect your trading capital...", author: "Mike Johnson", date: "Jan 30, 2026", views: 3021, category: "Risk Management" },
];

const mockEducationModules: EducationModule[] = [
  { id: "1", title: "Forex Basics", description: "Introduction to foreign exchange markets", duration: "2 hours", level: "Beginner", progress: 100 },
  { id: "2", title: "Technical Analysis", description: "Learn charting patterns and indicators", duration: "4 hours", level: "Intermediate", progress: 65 },
  { id: "3", title: "Advanced Trading Strategies", description: "Master complex trading techniques", duration: "6 hours", level: "Advanced", progress: 30 },
];

const stats = [
  {
    title: "Active Signals",
    value: "24",
    change: "+4",
    trend: "up",
    icon: TrendingUp,
    iconColor: "bg-blue-100",
  },
  {
    title: "Total Users",
    value: "12,847",
    change: "+142",
    trend: "up",
    icon: Users,
    iconColor: "bg-green-100",
  },
  {
    title: "Published Articles",
    value: "186",
    change: "+12",
    trend: "up",
    icon: FileText,
    iconColor: "bg-amber-100",
  },
  {
    title: "Total Investment",
    value: "$2,845,920",
    change: "+18.5%",
    trend: "up",
    icon: TrendingUp,
    iconColor: "bg-emerald-100",
  },
  {
    title: "Monthly Revenue",
    value: "$28,165",
    change: "+8.3%",
    trend: "up",
    icon: DollarSign,
    iconColor: "bg-purple-100",
  },
] as const;

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const colors = useThemeColors();
  
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; userId: string | null; userName: string | null }>({ open: false, userId: null, userName: null });
  const [deletedUsers, setDeletedUsers] = useState<Set<string>>(new Set());

  // Data states
  const [statsData, setStatsData] = useState<any[]>([
    {
      title: "Active Signals",
      value: "0",
      change: "+4",
      trend: "up",
      icon: TrendingUp,
      iconColor: "bg-blue-100",
    },
    {
      title: "Total Users",
      value: "0",
      change: "+142",
      trend: "up",
      icon: Users,
      iconColor: "bg-green-100",
    },
    {
      title: "Total Investments",
      value: "$0",
      change: "+18.5%",
      trend: "up",
      icon: TrendingUp,
      iconColor: "bg-emerald-100",
    },
    {
      title: "Pending Withdrawals",
      value: "0",
      change: "+8.3%",
      trend: "up",
      icon: DollarSign,
      iconColor: "bg-purple-100",
    },
  ]);
  const [users, setUsers] = useState<User[]>([]);
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [educationModules, setEducationModules] = useState<EducationModule[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [dashboardStatsRes, usersRes, signalsRes, withdrawalsRes, analysisRes, notificationsRes] = await Promise.all([
          adminApi.getDashboardStats().catch(err => ({ success: false, data: {} })),
          adminApi.getAllUsers({ limit: 50 }).catch(err => ({ success: false, data: [] })),
          adminApi.getAllSignals().catch(err => ({ success: false, data: [] })),
          adminApi.getAllWithdrawals({ limit: 50 }).catch(err => ({ success: false, data: [] })),
          adminApi.getAllAnalysis({ limit: 50 }).catch(err => ({ success: false, data: [] })),
          adminApi.getAllNotifications({ limit: 50 }).catch(err => ({ success: false, data: [] })),
        ]);

        // Update stats
        if (dashboardStatsRes.success && dashboardStatsRes.data) {
          const data = dashboardStatsRes.data;
          setStatsData([
            {
              title: "Active Signals",
              value: (data.totalSignals || 0).toString(),
              change: "+4",
              trend: "up",
              icon: TrendingUp,
              iconColor: "bg-blue-100",
            },
            {
              title: "Total Users",
              value: (data.totalUsers || 0).toLocaleString(),
              change: "+142",
              trend: "up",
              icon: Users,
              iconColor: "bg-green-100",
            },
            {
              title: "Total Investment",
              value: "$" + ((data.totalInvestments || 0) * 1000).toLocaleString(),
              change: "+18.5%",
              trend: "up",
              icon: TrendingUp,
              iconColor: "bg-emerald-100",
            },
            {
              title: "Pending Withdrawals",
              value: (data.totalWithdrawals || 0).toString(),
              change: "+8.3%",
              trend: "up",
              icon: DollarSign,
              iconColor: "bg-purple-100",
            },
          ]);
        }

        // Update users
        if (usersRes.success && Array.isArray(usersRes.data)) {
          setUsers(usersRes.data.map((u: any) => ({
            id: u.id,
            name: u.name || "Unknown",
            email: u.email || "",
            role: u.role || "User",
            status: u.status || "active",
            joinDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A",
          })));
        }

        // Update signals
        if (signalsRes.success && Array.isArray(signalsRes.data)) {
          setSignals(signalsRes.data.map((s: any) => ({
            id: s.id,
            pair: s.pair || "N/A",
            direction: s.type === 'BUY' ? 'BUY' : 'SELL',
            entryPrice: s.entryPrice || 0,
            takeProfits: s.takeProfit ? [s.takeProfit] : [],
            stopLoss: s.stopLoss || 0,
            accuracy: s.reliability ? s.reliability * 100 : 0,
            timeframe: s.timeframe || "1H",
            status: s.status || "active",
            profitLoss: 0,
          })));
        }

        // Update notifications
        if (notificationsRes.success && Array.isArray(notificationsRes.data)) {
          setNotifications(notificationsRes.data.map((n: any) => ({
            id: n.id,
            title: n.title || "Notification",
            message: n.message || "",
            type: n.type || "info",
            date: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "N/A",
            read: n.read || false,
          })));
        }

        // Update transactions
        if (withdrawalsRes.success && Array.isArray(withdrawalsRes.data)) {
          setTransactions(withdrawalsRes.data.map((w: any) => ({
            id: w.id,
            user: w.userId || "Unknown",
            type: "withdrawal",
            amount: w.amount || 0,
            date: w.createdAt ? new Date(w.createdAt).toLocaleDateString() : "N/A",
            status: w.status || "pending",
          })));
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update activeTab whenever search params change
  useEffect(() => {
    const tab = (searchParams.get("tab") as DashboardTab) || "overview";
    setActiveTab(tab);
  }, [searchParams]);

  const handleDeleteUser = (userId: string, userName: string) => {
    setDeleteConfirm({ open: true, userId, userName });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.userId) {
      try {
        const result = await adminApi.deleteUser(deleteConfirm.userId);
        if (result.success) {
          setUsers(users.filter(u => u.id !== deleteConfirm.userId));
          setDeletedUsers(new Set([...deletedUsers, deleteConfirm.userId]));
          setDeleteConfirm({ open: false, userId: null, userName: null });
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(user => !deletedUsers.has(user.id));
  return (
    <div className="space-y-6 animate-fade-in transition-colors duration-300" style={{  color: colors.text.primary }}>
      {/* Header */}
      <div className="px-4 sm:px-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-display transition-colors duration-300 break-words" style={{ color: colors.text.primary }}>
          {activeTab === "overview" && "Dashboard Overview"}
          {activeTab === "articles" && "Articles"}
          {activeTab === "users" && "Users"}
          {activeTab === "signals" && "Trading Signals"}
          {activeTab === "forex" && "Forex Signals"}
          {activeTab === "blog" && "Market Insights Blog"}
          {activeTab === "education" && "Education"}
          {activeTab === "transactions" && "Transactions"}
          {activeTab === "notifications" && "Notifications"}
          {activeTab === "settings" && "Settings"}
        </h1>
        <p className="text-xs sm:text-sm md:text-base mt-1 transition-colors duration-300 break-words" style={{ color: colors.text.secondary }}>
          {activeTab === "overview" && "Welcome back! Here's what's happening today."}
          {activeTab === "articles" && "Create and manage forex educational content"}
          {activeTab === "users" && "Manage user accounts and permissions"}
          {activeTab === "signals" && "Manage forex trading signals"}
          {activeTab === "forex" && "Manage and monitor active forex trading signals"}
          {activeTab === "blog" && "View market insights and analysis articles"}
          {activeTab === "education" && "Manage educational modules and courses"}
          {activeTab === "transactions" && "View and manage user transactions"}
          {activeTab === "notifications" && "System notifications and alerts"}
          {activeTab === "settings" && "Configure system settings and preferences"}
        </p>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6 px-4 sm:px-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 transition-colors duration-300" style={{ color: colors.text.secondary }}>Loading dashboard...</p>
              </div>
            </div>
          ) : error ? (
            <div className="border rounded-lg p-6 transition-colors duration-300" style={{ backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2', borderColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : '#fecaca' }}>
              <p className="transition-colors duration-300" style={{ color: theme === 'dark' ? '#fca5a5' : '#b91c1c' }}>{error}</p>
            </div>
          ) : (
            <>
              {/* Stats - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {statsData.map((stat) => (
                  <StatsCard key={stat.title} {...stat} />
                ))}
              </div>

              {/* Content - Responsive Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  <RevenueChart />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <SignalsCard />
                    <MarketInsightsCard />
                  </div>

                  <RecentArticlesCard />
                </div>

                {/* Right - Sidebar on large screens */}
                <div className="space-y-4 sm:space-y-6">
                  <CalendarWidget />
                  <QuickActions />
                  <UserActivityCard />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Articles Tab */}
      {activeTab === "articles" && (
        <div className="space-y-6 px-4 sm:px-6">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 flex-shrink-0" style={{ color: colors.text.tertiary }} />
              <Input placeholder="Search articles..." className="pl-10 w-full transition-colors duration-300" />
            </div>

            <div className="flex gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Filter className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Filter</span>
              </Button>

              <Button
                className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">New Article</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </div>

          {/* Articles List */}
          <div className="grid gap-4">
            {mockArticles.map((article) => (
              <div
                key={article.id}
                className="border rounded-lg p-4 sm:p-6 transition-all duration-300"
                style={{  borderColor: colors.border }}
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300" style={{ backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgb(219, 234, 254)' }}>
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold hover:text-blue-600 cursor-pointer transition-colors duration-300 truncate sm:text-base text-sm" style={{ color: colors.text.primary }}>
                        {article.title}
                      </h3>

                      <p className="text-xs sm:text-sm mt-1 line-clamp-1 transition-colors duration-300" style={{ color: colors.text.secondary }}>
                        {article.excerpt}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3">
                        <Badge variant="info" label={article.category} size="sm" />

                        <span className="text-xs flex items-center gap-1 transition-colors duration-300 whitespace-nowrap" style={{ color: colors.text.secondary }}>
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          {article.readTime}
                        </span>

                        <span className="text-xs transition-colors duration-300 truncate" style={{ color: colors.text.secondary }}>
                          {article.author}
                        </span>

                        <span className="text-xs transition-colors duration-300 whitespace-nowrap" style={{ color: colors.text.secondary }}>
                          {article.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto flex-wrap sm:flex-nowrap justify-between sm:justify-start">
                    <Badge
                      variant={
                        article.status === "published"
                          ? "success"
                          : article.status === "draft"
                          ? "info"
                          : "warning"
                      }
                      label={article.status}
                    />

                    {article.status === "published" && (
                      <div className="hidden md:flex items-center gap-3 sm:gap-4 text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap" style={{ color: colors.text.secondary }}>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">{article.views.toLocaleString()}</span>
                          <span className="sm:hidden">{article.views > 999 ? `${(article.views / 1000).toFixed(1)}k` : article.views}</span>
                        </span>

                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                          {article.comments}
                        </span>
                      </div>
                    )}

                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === article.id ? null : article.id)
                        }
                        className="p-2 rounded-lg transition-colors"
                        style={{ backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgb(243, 244, 246)' }}
                      >
                        <MoreVertical className="w-4 h-4 transition-colors duration-300" style={{ color: colors.text.secondary }} />
                      </button>

                      {openMenuId === article.id && (
                        <div className="absolute right-0 mt-1 w-40 rounded-lg shadow-lg z-10 transition-colors duration-300" style={{ backgroundColor: colors.bg.card, borderColor: colors.border, border: `1px solid ${colors.border}` }}>
                          <button
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm first:rounded-t-lg transition-colors duration-300"
                            style={{ color: colors.text.primary, backgroundColor: 'transparent' }}
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>

                          <button
                            onClick={() => setOpenMenuId(null)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm last:rounded-b-lg transition-colors duration-300"
                            style={{ color: '#dc2626', borderTop: `1px solid ${colors.border}` }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-6 px-4 sm:px-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 transition-colors duration-300" style={{ color: colors.text.secondary }}>Loading users...</p>
              </div>
            </div>
          ) : error ? (
            <div className="border rounded-lg p-6 transition-colors duration-300" style={{ backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2', borderColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : '#fecaca' }}>
              <p className="transition-colors duration-300" style={{ color: theme === 'dark' ? '#fca5a5' : '#b91c1c' }}>{error}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 mx-auto transition-colors duration-300" style={{ color: colors.text.tertiary }} />
                  <p className="mt-4 transition-colors duration-300" style={{ color: colors.text.secondary }}>No users found</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4 sm:p-6 transition-all duration-300" style={{ backgroundColor: colors.bg.card, borderColor: colors.border }}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors duration-300 flex-shrink-0" style={{ backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgb(219, 234, 254)' }}>
                          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold transition-colors duration-300 text-sm sm:text-base truncate" style={{ color: colors.text.primary }}>{user.name}</h3>
                          <p className="text-xs sm:text-sm transition-colors duration-300 truncate" style={{ color: colors.text.secondary }}>{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 flex-wrap w-full sm:w-auto justify-end">
                        <Badge variant="primary" label={user.role} />
                        <Badge
                          variant={user.status === "active" ? "success" : "danger"}
                          label={user.status}
                        />
                        <span className="text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap" style={{ color: colors.text.secondary }}>{user.joinDate}</span>
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgb(243, 244, 246)' }}
                          >
                            <MoreVertical className="w-4 h-4 transition-colors duration-300" style={{ color: colors.text.secondary }} />
                          </button>

                          {openMenuId === user.id && (
                            <div className="absolute right-0 mt-1 w-40 rounded-lg shadow-lg z-10 transition-colors duration-300" style={{ backgroundColor: colors.bg.card, borderColor: colors.border, border: `1px solid ${colors.border}` }}>
                              <button
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm first:rounded-t-lg transition-colors duration-300"
                                style={{ color: colors.text.primary, backgroundColor: 'transparent' }}
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>

                              <button
                                onClick={() => {
                                  handleDeleteUser(user.id, user.name);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm last:rounded-b-lg transition-colors duration-300"
                                style={{ color: '#dc2626', borderTop: `1px solid ${colors.border}` }}
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Signals Tab */}
      {activeTab === "signals" && (
        <div className="space-y-6 px-4 sm:px-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 transition-colors duration-300" style={{ color: colors.text.secondary }}>Loading signals...</p>
              </div>
            </div>
          ) : error ? (
            <div className="border rounded-lg p-6 transition-colors duration-300" style={{ backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2', borderColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : '#fecaca' }}>
              <p className="transition-colors duration-300" style={{ color: theme === 'dark' ? '#fca5a5' : '#b91c1c' }}>{error}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {signals.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 mx-auto transition-colors duration-300" style={{ color: colors.text.tertiary }} />
                  <p className="mt-4 transition-colors duration-300" style={{ color: colors.text.secondary }}>No signals found</p>
                </div>
              ) : (
                signals.map((signal) => (
                  <div key={signal.id} className="border rounded-lg p-4 sm:p-6 transition-all duration-300" style={{ backgroundColor: colors.bg.card, borderColor: colors.border }}>
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300" style={{ backgroundColor: signal.direction === 'BUY' ? (theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgb(220, 252, 231)') : (theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgb(254, 226, 226)') }}>
                        {signal.direction === 'BUY' ? <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" /> : <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          <h3 className="font-semibold transition-colors duration-300 text-sm sm:text-base" style={{ color: colors.text.primary }}>{signal.pair}</h3>
                          <Badge variant={signal.direction === 'BUY' ? 'success' : 'danger'} label={signal.direction} />
                          <Badge variant={signal.status === 'active' ? 'info' : 'warning'} label={signal.status} />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-3">
                          <div>
                            <p className="text-xs transition-colors duration-300" style={{ color: colors.text.secondary }}>Entry</p>
                            <p className="text-xs sm:text-sm font-semibold transition-colors duration-300 truncate" style={{ color: colors.text.primary }}>{signal.entryPrice.toFixed(4)}</p>
                          </div>
                          <div>
                            <p className="text-xs transition-colors duration-300" style={{ color: colors.text.secondary }}>SL</p>
                            <p className="text-xs sm:text-sm font-semibold transition-colors duration-300 truncate" style={{ color: colors.text.primary }}>{signal.stopLoss.toFixed(4)}</p>
                          </div>
                          <div>
                            <p className="text-xs transition-colors duration-300" style={{ color: colors.text.secondary }}>Accuracy</p>
                            <p className="text-xs sm:text-sm font-semibold transition-colors duration-300" style={{ color: colors.text.primary }}>{signal.accuracy.toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-xs transition-colors duration-300" style={{ color: colors.text.secondary }}>TF</p>
                            <p className="text-xs sm:text-sm font-semibold transition-colors duration-300" style={{ color: colors.text.primary }}>{signal.timeframe}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Forex Signals Tab */}
      {activeTab === "forex" && (
        <div className="space-y-6 px-4 sm:px-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 transition-colors duration-300" style={{ color: colors.text.secondary }}>Loading forex signals...</p>
              </div>
            </div>
          ) : error ? (
            <div className="border rounded-lg p-6 transition-colors duration-300" style={{ backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2', borderColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : '#fecaca' }}>
              <p className="transition-colors duration-300" style={{ color: theme === 'dark' ? '#fca5a5' : '#b91c1c' }}>{error}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {signals.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 mx-auto transition-colors duration-300" style={{ color: colors.text.tertiary }} />
                  <p className="mt-4 transition-colors duration-300" style={{ color: colors.text.secondary }}>No forex signals found</p>
                </div>
              ) : (
                signals.map((signal) => (
                  <div key={signal.id} className="border rounded-lg p-4 sm:p-6 transition-all duration-300 overflow-x-auto" style={{ backgroundColor: colors.bg.card, borderColor: colors.border }}>
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300" style={{ backgroundColor: signal.direction === 'BUY' ? (theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgb(220, 252, 231)') : (theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgb(254, 226, 226)') }}>
                        {signal.direction === 'BUY' ? <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" /> : <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          <h3 className="font-semibold transition-colors duration-300 text-sm sm:text-base" style={{ color: colors.text.primary }}>{signal.pair}</h3>
                          <Badge variant={signal.direction === 'BUY' ? 'success' : 'danger'} label={signal.direction} />
                          <Badge variant={signal.status === 'active' ? 'info' : 'warning'} label={signal.status} />
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mt-3 text-xs sm:text-sm">
                          <div className="min-w-0">
                            <p className="transition-colors duration-300 truncate" style={{ color: colors.text.secondary }}>Entry</p>
                            <p className="font-semibold transition-colors duration-300 truncate" style={{ color: colors.text.primary }}>{signal.entryPrice.toFixed(4)}</p>
                          </div>
                          <div className="min-w-0">
                            <p className="transition-colors duration-300 truncate" style={{ color: colors.text.secondary }}>SL</p>
                            <p className="font-semibold transition-colors duration-300 truncate" style={{ color: colors.text.primary }}>{signal.stopLoss.toFixed(4)}</p>
                          </div>
                          <div className="min-w-0">
                            <p className="transition-colors duration-300 truncate" style={{ color: colors.text.secondary }}>TP</p>
                            <p className="font-semibold transition-colors duration-300 truncate" style={{ color: colors.text.primary }}>{signal.takeProfits[0]?.toFixed(4) || "N/A"}</p>
                          </div>
                          <div className="min-w-0">
                            <p className="transition-colors duration-300 truncate" style={{ color: colors.text.secondary }}>Acc</p>
                            <p className="font-semibold transition-colors duration-300 truncate" style={{ color: colors.text.primary }}>{signal.accuracy.toFixed(1)}%</p>
                          </div>
                          <div className="min-w-0">
                            <p className="transition-colors duration-300 truncate" style={{ color: colors.text.secondary }}>P/L</p>
                            <p className="font-semibold transition-colors duration-300 truncate" style={{ color: signal.profitLoss >= 0 ? '#16a34a' : '#dc2626' }}>${signal.profitLoss}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Blog Tab */}
      {activeTab === "blog" && (
        <div className="space-y-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search blog posts..." className="pl-10 w-full bg-white border-gray-200" />
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-lg transition-all flex-1 sm:flex-none">
              <Plus className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">New Post</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
          <div className="grid gap-4">
            {mockBlogPosts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4 sm:p-6 transition-all duration-300" style={{  borderColor: colors.border }}>
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300" style={{ backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgb(219, 234, 254)' }}>
                      <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold transition-colors duration-300 hover:text-blue-600 cursor-pointer text-sm sm:text-base truncate" style={{ color: colors.text.primary }}>{post.title}</h3>
                      <p className="text-xs sm:text-sm mt-1 line-clamp-1 transition-colors duration-300" style={{ color: colors.text.secondary }}>{post.excerpt}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3">
                        <Badge variant="info" label={post.category} size="sm" />
                        <span className="text-xs transition-colors duration-300 truncate" style={{ color: colors.text.secondary }}>{post.author}</span>
                        <span className="text-xs transition-colors duration-300 whitespace-nowrap" style={{ color: colors.text.secondary }}>{post.date}</span>
                        <span className="text-xs flex items-center gap-1 transition-colors duration-300 whitespace-nowrap" style={{ color: colors.text.secondary }}>
                          <Eye className="w-3 h-3" />
                          <span className="hidden sm:inline">{post.views.toLocaleString()}</span>
                          <span className="sm:hidden">{post.views > 999 ? `${(post.views / 1000).toFixed(1)}k` : post.views}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Tab */}
      {activeTab === "education" && (
        <div className="space-y-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-lg transition-all w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-1 sm:w-6 sm:h-6" />
              <span className="hidden sm:inline">New Module</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
          <div className="grid gap-4">
            {mockEducationModules.map((module) => (
              <div key={module.id} className="border rounded-lg p-4 sm:p-6 transition-all duration-300" style={{ borderColor: colors.border }}>
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300" style={{ backgroundColor: theme === 'dark' ? 'rgba(79, 70, 229, 0.2)' : 'rgb(224, 231, 255)' }}>
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold transition-colors duration-300 text-sm sm:text-base truncate" style={{ color: colors.text.primary }}>{module.title}</h3>
                      <p className="text-xs sm:text-sm mt-1 line-clamp-1 transition-colors duration-300" style={{ color: colors.text.secondary }}>{module.description}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3">
                        <Badge variant={module.level === 'Beginner' ? 'success' : module.level === 'Intermediate' ? 'info' : 'warning'} label={module.level} size="sm" />
                        <span className="text-xs transition-colors duration-300 whitespace-nowrap" style={{ color: colors.text.secondary }}>Duration: {module.duration}</span>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs transition-colors duration-300" style={{ color: colors.text.secondary }}>Progress</span>
                          <span className="text-xs sm:text-sm font-semibold transition-colors duration-300" style={{ color: colors.text.primary }}>{module.progress}%</span>
                        </div>
                        <div className="w-full rounded-full h-2 transition-colors duration-300" style={{ backgroundColor: colors.bg.secondary }}>
                          <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${module.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">View</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div className="space-y-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300" style={{ color: colors.text.tertiary }} />
              <Input placeholder="Search transactions..." className="pl-10 w-full transition-colors duration-300" />
            </div>
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Filter className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 transition-colors duration-300" style={{ color: colors.text.secondary }}>Loading transactions...</p>
              </div>
            </div>
          ) : error ? (
            <div className="border rounded-lg p-6 transition-colors duration-300" style={{ backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2', borderColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : '#fecaca' }}>
              <p className="transition-colors duration-300" style={{ color: theme === 'dark' ? '#fca5a5' : '#b91c1c' }}>{error}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="w-12 h-12 mx-auto transition-colors duration-300" style={{ color: colors.text.tertiary }} />
                  <p className="mt-4 transition-colors duration-300" style={{ color: colors.text.secondary }}>No transactions found</p>
                </div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="border rounded-lg p-4 sm:p-6 transition-all duration-300" style={{ backgroundColor: colors.bg.card, borderColor: colors.border }}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-colors duration-300 flex-shrink-0" style={{ backgroundColor: (tx.type === 'deposit' || tx.type === 'profit') ? (theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgb(220, 252, 231)') : (theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgb(254, 226, 226)') }}>
                          {tx.type === 'deposit' || tx.type === 'profit' ? <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" /> : <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold capitalize transition-colors duration-300 text-sm sm:text-base truncate" style={{ color: colors.text.primary }}>{tx.type} - {tx.user}</h3>
                          <p className="text-xs sm:text-sm transition-colors duration-300" style={{ color: colors.text.secondary }}>{tx.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
                        <div className="text-right">
                          <p className="font-semibold text-sm sm:text-base transition-colors duration-300 whitespace-nowrap" style={{ color: (tx.type === 'deposit' || tx.type === 'profit') ? '#16a34a' : '#dc2626' }}>
                            {tx.type === 'deposit' || tx.type === 'profit' ? '+' : '-'}${tx.amount.toLocaleString()}
                          </p>
                        </div>
                        <Badge variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'info' : 'danger'} label={tx.status} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6 px-4 sm:px-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 transition-colors duration-300" style={{ color: colors.text.secondary }}>Loading notifications...</p>
              </div>
            </div>
          ) : error ? (
            <div className="border rounded-lg p-6 transition-colors duration-300" style={{ backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2', borderColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : '#fecaca' }}>
              <p className="transition-colors duration-300" style={{ color: theme === 'dark' ? '#fca5a5' : '#b91c1c' }}>{error}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 mx-auto transition-colors duration-300" style={{ color: colors.text.tertiary }} />
                  <p className="mt-4 transition-colors duration-300" style={{ color: colors.text.secondary }}>No notifications</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="border rounded-lg p-4 sm:p-6 transition-all duration-300" style={{ 
                    backgroundColor: notif.read ? colors.bg.card : (theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgb(239, 246, 255)'),
                    borderColor: notif.read ? colors.border : '#3b82f6'
                  }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300" style={{ 
                          backgroundColor: notif.type === 'success' ? (theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgb(220, 252, 231)') :
                          notif.type === 'warning' ? (theme === 'dark' ? 'rgba(234, 179, 8, 0.2)' : 'rgb(254, 243, 199)') :
                          notif.type === 'error' ? (theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgb(254, 226, 226)') :
                          (theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgb(219, 234, 254)')
                        }}>
                          {notif.type === 'success' ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> :
                           notif.type === 'warning' ? <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" /> :
                           notif.type === 'error' ? <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" /> :
                           <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold transition-colors duration-300 text-sm sm:text-base truncate" style={{ color: colors.text.primary }}>{notif.title}</h3>
                          <p className="text-xs sm:text-sm mt-1 line-clamp-2 transition-colors duration-300" style={{ color: colors.text.secondary }}>{notif.message}</p>
                          <span className="text-xs transition-colors duration-300 mt-2 block" style={{ color: colors.text.tertiary }}>{notif.date}</span>
                        </div>
                      </div>
                      {!notif.read && <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-1.5 sm:mt-2"></div>}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6 max-w-2xl">
          <div className="border rounded-lg p-6 transition-colors duration-300" style={{  borderColor: colors.border }}>
            <h2 className="text-lg font-semibold mb-4 transition-colors duration-300" style={{ color: colors.text.primary }}>General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 transition-colors duration-300" style={{ color: colors.text.primary }}>Site Name</label>
                <Input placeholder="EOF Trading Platform" defaultValue="EOF Trading Platform" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 transition-colors duration-300" style={{ color: colors.text.primary }}>Site Description</label>
                <Input placeholder="Your site description" defaultValue="Professional Forex Trading Signals & Analytics" />
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6 transition-colors duration-300" style={{  borderColor: colors.border }}>
            <h2 className="text-lg font-semibold mb-4 transition-colors duration-300" style={{ color: colors.text.primary }}>Signal Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium transition-colors duration-300" style={{ color: colors.text.primary }}>Enable New Signals</label>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium transition-colors duration-300" style={{ color: colors.text.primary }}>Email Notifications</label>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 transition-colors duration-300" style={{ color: colors.text.primary }}>Max Signals Per Day</label>
                <Input type="number" placeholder="5" defaultValue="5" />
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6 transition-colors duration-300" style={{  borderColor: colors.border }}>
            <h2 className="text-lg font-semibold mb-4 transition-colors duration-300" style={{ color: colors.text.primary }}>User Management</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium transition-colors duration-300" style={{ color: colors.text.primary }}>Allow User Registration</label>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium transition-colors duration-300" style={{ color: colors.text.primary }}>Email Verification Required</label>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-lg transition-all px-6 border-radius-200">
              Save Settings
            </Button> 
            <Button >Reset to Defaults</Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <div className="rounded-lg shadow-xl max-w-sm w-full transition-colors duration-300" style={{ backgroundColor: colors.bg.card }}>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgb(254, 226, 226)' }}>
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold transition-colors duration-300" style={{ color: colors.text.primary }}>Delete User?</h2>
                  <p className="text-sm mt-1 transition-colors duration-300" style={{ color: colors.text.secondary }}>
                    Are you sure you want to delete <strong>{deleteConfirm.userName}</strong>? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-4 transition-colors duration-300" style={{ borderTop: `1px solid ${colors.border}` }}>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeleteConfirm({ open: false, userId: null, userName: null })}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={confirmDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
