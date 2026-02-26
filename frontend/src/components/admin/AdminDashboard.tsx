
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

const mockUsers: User[] = [
  { id: "1", name: "John Smith", email: "john@example.com", role: "Premium", status: "active", joinDate: "Jan 15, 2026" },
  { id: "2", name: "Sarah Chen", email: "sarah@example.com", role: "Investor", status: "active", joinDate: "Jan 10, 2026" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", role: "Free", status: "inactive", joinDate: "Dec 20, 2025" },
  { id: "4", name: "Emma Davis", email: "emma@example.com", role: "Premium", status: "active", joinDate: "Jan 18, 2026" },
  { id: "5", name: "David Lee", email: "david@example.com", role: "Investor", status: "active", joinDate: "Jan 12, 2026" },
];

const mockTradingSignals: TradingSignal[] = [
  { id: "1", pair: "EUR/USD", direction: "BUY", entryPrice: 1.0850, takeProfits: [1.0900, 1.0950], stopLoss: 1.0800, accuracy: 87.5, timeframe: "4H", status: "active", profitLoss: 0 },
  { id: "2", pair: "GBP/USD", direction: "SELL", entryPrice: 1.2680, takeProfits: [1.2600, 1.2500], stopLoss: 1.2750, accuracy: 92.3, timeframe: "1H", status: "closed", profitLoss: 85 },
  { id: "3", pair: "USD/JPY", direction: "BUY", entryPrice: 148.50, takeProfits: [149.00, 149.50], stopLoss: 148.00, accuracy: 79.8, timeframe: "Daily", status: "active", profitLoss: 0 },
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

const mockTransactions: Transaction[] = [
  { id: "1", user: "John Smith", type: "deposit", amount: 5000, date: "Feb 4, 2026", status: "completed" },
  { id: "2", user: "Sarah Chen", type: "withdrawal", amount: 2500, date: "Feb 3, 2026", status: "completed" },
  { id: "3", user: "Mike Johnson", type: "transfer", amount: 1000, date: "Feb 2, 2026", status: "pending" },
  { id: "4", user: "Emma Davis", type: "profit", amount: 385, date: "Feb 1, 2026", status: "completed" },
];

const mockNotifications: Notification[] = [
  { id: "1", title: "New Signal Generated", message: "EUR/USD BUY signal has been generated", type: "info", date: "2 hours ago", read: false },
  { id: "2", title: "User Withdrawal Request", message: "Sarah Chen requested withdrawal of $2,500", type: "warning", date: "5 hours ago", read: false },
  { id: "3", title: "System Maintenance", message: "Scheduled maintenance completed successfully", type: "success", date: "1 day ago", read: true },
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; userId: string | null; userName: string | null }>({ open: false, userId: null, userName: null });
  const [deletedUsers, setDeletedUsers] = useState<Set<string>>(new Set());

  // Update activeTab whenever search params change
  useEffect(() => {
    const tab = (searchParams.get("tab") as DashboardTab) || "overview";
    setActiveTab(tab);
  }, [searchParams]);

  const handleDeleteUser = (userId: string, userName: string) => {
    setDeleteConfirm({ open: true, userId, userName });
  };

  const confirmDelete = () => {
    if (deleteConfirm.userId) {
      setDeletedUsers(new Set([...deletedUsers, deleteConfirm.userId]));
      setDeleteConfirm({ open: false, userId: null, userName: null });
    }
  };

  const filteredUsers = mockUsers.filter(user => !deletedUsers.has(user.id));
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-gray-900">
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
        <p className="text-sm sm:text-base text-gray-600 mt-1">
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
        <div className="space-y-6">
          {/* Stats - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <StatsCard key={stat.title} {...stat} />
            ))}
          </div>

          {/* Content - Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left */}
            <div className="lg:col-span-2 space-y-6">
              <RevenueChart />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SignalsCard />
                <MarketInsightsCard />
              </div>

              <RecentArticlesCard />
            </div>

            {/* Right - Sidebar on large screens */}
            <div className="space-y-6">
              <CalendarWidget />
              <QuickActions />
              <UserActivityCard />
            </div>
          </div>
        </div>
      )}

      {/* Articles Tab */}
      {activeTab === "articles" && (
        <div className="space-y-6">
          {/* Search & Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search articles..." className="pl-10 bg-white border-gray-200" />
            </div>

            <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>

            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 mr-1" />
              New Article
            </Button>
          </div>

          {/* Articles List */}
          <div className="grid gap-4">
            {mockArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                        {article.title}
                      </h3>

                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {article.excerpt}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        <Badge variant="info" label={article.category} size="sm" />

                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>

                        <span className="text-xs text-gray-600">
                          {article.author}
                        </span>

                        <span className="text-xs text-gray-600">
                          {article.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
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
                      <div className="hidden sm:flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {article.views.toLocaleString()}
                        </span>

                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {article.comments}
                        </span>
                      </div>
                    )}

                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === article.id ? null : article.id)
                        }
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>

                      {openMenuId === article.id && (
                        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <button
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm first:rounded-t-lg"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>

                          <button
                            onClick={() => setOpenMenuId(null)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm last:rounded-b-lg border-t border-gray-200"
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
        <div className="space-y-6">
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap justify-end">
                    <Badge variant="primary" label={user.role} />
                    <Badge
                      variant={user.status === "active" ? "success" : "danger"}
                      label={user.status}
                    />
                    <span className="text-sm text-gray-600">{user.joinDate}</span>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>

                      {openMenuId === user.id && (
                        <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <button
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm first:rounded-t-lg"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              handleDeleteUser(user.id, user.name);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm last:rounded-b-lg border-t border-gray-200"
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

      {/* Signals Tab */}
      {activeTab === "signals" && (
        <div className="space-y-6">
          <div className="grid gap-4">
            {mockTradingSignals.map((signal) => (
              <div key={signal.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${signal.direction === 'BUY' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {signal.direction === 'BUY' ? <TrendingUp className="w-6 h-6 text-green-600" /> : <TrendingDown className="w-6 h-6 text-red-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{signal.pair}</h3>
                        <Badge variant={signal.direction === 'BUY' ? 'success' : 'danger'} label={signal.direction} />
                        <Badge variant={signal.status === 'active' ? 'info' : 'warning'} label={signal.status} />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-gray-600">Entry Price</p>
                          <p className="text-sm font-semibold text-gray-900">{signal.entryPrice.toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Stop Loss</p>
                          <p className="text-sm font-semibold text-gray-900">{signal.stopLoss.toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Accuracy</p>
                          <p className="text-sm font-semibold text-gray-900">{signal.accuracy}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Timeframe</p>
                          <p className="text-sm font-semibold text-gray-900">{signal.timeframe}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Forex Signals Tab */}
      {activeTab === "forex" && (
        <div className="space-y-6">
          <div className="grid gap-4">
            {mockTradingSignals.map((signal) => (
              <div key={signal.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${signal.direction === 'BUY' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {signal.direction === 'BUY' ? <TrendingUp className="w-6 h-6 text-green-600" /> : <TrendingDown className="w-6 h-6 text-red-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{signal.pair}</h3>
                        <Badge variant={signal.direction === 'BUY' ? 'success' : 'danger'} label={signal.direction} />
                        <Badge variant={signal.status === 'active' ? 'info' : 'warning'} label={signal.status} />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-gray-600">Entry</p>
                          <p className="text-sm font-semibold text-gray-900">{signal.entryPrice.toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">SL</p>
                          <p className="text-sm font-semibold text-gray-900">{signal.stopLoss.toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">TP</p>
                          <p className="text-sm font-semibold text-gray-900">{signal.takeProfits[0].toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Accuracy</p>
                          <p className="text-sm font-semibold text-gray-900">{signal.accuracy}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">P/L</p>
                          <p className={`text-sm font-semibold ${signal.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>${signal.profitLoss}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blog Tab */}
      {activeTab === "blog" && (
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search blog posts..." className="pl-10 bg-white border-gray-200" />
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-lg transition-all">
              <Plus className="w-4 h-4 mr-1" />
              New Post
            </Button>
          </div>
          <div className="grid gap-4">
            {mockBlogPosts.map((post) => (
              <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <Newspaper className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">{post.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">{post.excerpt}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        <Badge variant="info" label={post.category} size="sm" />
                        <span className="text-xs text-gray-600">{post.author}</span>
                        <span className="text-xs text-gray-600">{post.date}</span>
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views.toLocaleString()} views
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Tab */}
      {activeTab === "education" && (
        <div className="space-y-6">
          <div className="flex gap-4">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-lg transition-all">
              <Plus className="w-4 h-4 mr-1" />
              New Module
            </Button>
          </div>
          <div className="grid gap-4">
            {mockEducationModules.map((module) => (
              <div key={module.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{module.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        <Badge variant={module.level === 'Beginner' ? 'success' : module.level === 'Intermediate' ? 'info' : 'warning'} label={module.level} size="sm" />
                        <span className="text-xs text-gray-600">Duration: {module.duration}</span>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">Progress</span>
                          <span className="text-sm font-semibold text-gray-900">{module.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${module.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search transactions..." className="pl-10 bg-white border-gray-200" />
            </div>
            <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          <div className="grid gap-4">
            {mockTransactions.map((tx) => (
              <div key={tx.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${tx.type === 'deposit' || tx.type === 'profit' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {tx.type === 'deposit' || tx.type === 'profit' ? <TrendingUp className={`w-6 h-6 ${tx.type === 'deposit' || tx.type === 'profit' ? 'text-green-600' : 'text-red-600'}`} /> : <TrendingDown className="w-6 h-6 text-red-600" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize">{tx.type} - {tx.user}</h3>
                      <p className="text-sm text-gray-600">{tx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`font-semibold ${tx.type === 'deposit' || tx.type === 'profit' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'deposit' || tx.type === 'profit' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'info' : 'danger'} label={tx.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="grid gap-4">
            {mockNotifications.map((notif) => (
              <div key={notif.id} className={`bg-white border rounded-lg p-6 hover:shadow-sm transition-all ${notif.read ? 'border-gray-200' : 'border-blue-300 bg-blue-50'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      notif.type === 'success' ? 'bg-green-100' :
                      notif.type === 'warning' ? 'bg-yellow-100' :
                      notif.type === 'error' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      {notif.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                       notif.type === 'warning' ? <AlertCircle className="w-5 h-5 text-yellow-600" /> :
                       notif.type === 'error' ? <X className="w-5 h-5 text-red-600" /> :
                       <Bell className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                      <span className="text-xs text-gray-500 mt-2 block">{notif.date}</span>
                    </div>
                  </div>
                  {!notif.read && <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0 mt-2"></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6 max-w-2xl">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Site Name</label>
                <Input placeholder="EOF Trading Platform" defaultValue="EOF Trading Platform" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Site Description</label>
                <Input placeholder="Your site description" defaultValue="Professional Forex Trading Signals & Analytics" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Signal Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">Enable New Signals</label>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">Email Notifications</label>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Max Signals Per Day</label>
                <Input type="number" placeholder="5" defaultValue="5" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Management</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">Allow User Registration</label>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">Email Verification Required</label>
                <input type="checkbox" className="w-5 h-5" defaultChecked />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-lg transition-all">
              Save Settings
            </Button>
            <Button variant="outline">Reset to Defaults</Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">Delete User?</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Are you sure you want to delete <strong>{deleteConfirm.userName}</strong>? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-200">
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
