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
  Activity,
  Gift,
  UserPlus,
  Coins,
  ChevronDown,
  Sparkles,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useThemeColors } from "@/lib/themeColors";
import SignalManager from "./SignalManager";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
  Legend
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Badge from "@/components/common/Badge";
import adminApi from "@/lib/adminApi";
import { cn } from "@/lib/utils";

type DashboardTab = "overview" | "articles" | "users" | "signals" | "forex" | "blog" | "education" | "transactions" | "notifications" | "settings" | "traffic";

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

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const colors = useThemeColors();
  
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; userId: string | null; userName: string | null }>({ open: false, userId: null, userName: null });
  const [deletedUsers, setDeletedUsers] = useState<Set<string>>(new Set());

  // Collapsible Accordion Panels States (Overview Tab)
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({
    deposit: true,
    withdrawal: true,
    registeredUser: true,
    firstDeposit: true,
    bonus: true,
    vipPoint: false,
    winLoss: false,
    turnover: false,
    grossMargin: false,
  });

  const togglePanel = (panelId: string) => {
    setOpenPanels(prev => ({
      ...prev,
      [panelId]: !prev[panelId]
    }));
  };

  // Data states
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
        const [usersRes, signalsRes, withdrawalsRes, notificationsRes] = await Promise.all([
          adminApi.getAllUsers({ limit: 50 }).catch(() => ({ success: false, data: [] })),
          adminApi.getAllSignals().catch(() => ({ success: false, data: [] })),
          adminApi.getAllWithdrawals({ limit: 50 }).catch(() => ({ success: false, data: [] })),
          adminApi.getAllNotifications({ limit: 50 }).catch(() => ({ success: false, data: [] })),
        ]);

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

  const handleDeleteUser = (userId: string) => {
    setDeleteConfirm({ open: true, userId, userName: users.find(u => u.id === userId)?.name || "User" });
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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10 min-h-screen text-slate-100"
    >
      {/* Overview Tab (Exact Recreation of Approved High-Fidelity UI) */}
      {activeTab === "overview" && (
        <div className="space-y-6 px-6 sm:px-8">
          
          {/* Dashboard Header Bar */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase font-display bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Dashboard
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-background border border-white/5 rounded-xl px-3 py-2 gap-2 text-xs font-semibold text-slate-300 shadow-inner">
                <Calendar size={14} className="text-primary" />
                <span> {new Date().toLocaleDateString("en-US", {month: "short" , day: "numeric", year: "numeric"})} </span>
              </div>
            </div>
          </div>

          {/* 4 Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: BONUS */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-gradient-to-br from-[#1C2C35]/80 to-[#10191F]/95 border border-cyan-500/20 p-5 rounded-2xl relative overflow-hidden group shadow-lg shadow-cyan-950/20"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-cyan-400 uppercase tracking-widest leading-none">
                    Bonus
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-display mt-3 leading-none">
                    USD 0.00
                  </h3>
                </div>
                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/15 group-hover:scale-110 transition-transform">
                  <Gift size={20} />
                </div>
              </div>
              <button className="w-full text-left text-[10px] font-black text-cyan-400/80 hover:text-cyan-300 uppercase tracking-widest border-t border-cyan-500/10 pt-3 mt-5 flex items-center justify-between transition-colors">
                <span>View More</span>
                <span>→</span>
              </button>
            </motion.div>

            {/* Card 2: ONLINE USER */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-gradient-to-br from-[#1C3322]/80 to-[#102015]/95 border border-emerald-500/20 p-5 rounded-2xl relative overflow-hidden group shadow-lg shadow-emerald-950/20"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-emerald-400 uppercase tracking-widest leading-none">
                    Online User
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-display mt-3 leading-none">
                    4
                  </h3>
                  <p className="text-[9px] font-bold text-emerald-500 uppercase mt-1 tracking-wider">
                    Of 89 Active
                  </p>
                </div>
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/15 group-hover:scale-110 transition-transform">
                  <Users size={20} />
                </div>
              </div>
              <button className="w-full text-left text-[10px] font-black text-emerald-400/80 hover:text-emerald-300 uppercase tracking-widest border-t border-emerald-500/10 pt-3 mt-5 flex items-center justify-between transition-colors">
                <span>View More</span>
                <span>→</span>
              </button>
            </motion.div>

            {/* Card 3: REGISTERED USER */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-gradient-to-br from-[#351F24]/80 to-[#201014]/95 border border-rose-500/20 p-5 rounded-2xl relative overflow-hidden group shadow-lg shadow-rose-950/20"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-rose-400 uppercase tracking-widest leading-none">
                    Registered User
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-display mt-3 leading-none">
                    3
                  </h3>
                  <p className="text-[9px] font-bold text-rose-500 uppercase mt-1 tracking-wider">
                    Yesterday 0
                  </p>
                </div>
                <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/15 group-hover:scale-110 transition-transform">
                  <UserPlus size={20} />
                </div>
              </div>
              <button className="w-full text-left text-[10px] font-black text-rose-400/80 hover:text-rose-300 uppercase tracking-widest border-t border-rose-500/10 pt-3 mt-5 flex items-center justify-between transition-colors">
                <span>View More</span>
                <span>→</span>
              </button>
            </motion.div>

            {/* Card 4: COMPANY TOTAL WIN LOSS */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-gradient-to-br from-[#352B1C]/80 to-[#201810]/95 border border-amber-500/20 p-5 rounded-2xl relative overflow-hidden group shadow-lg shadow-amber-950/20"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest leading-none">
                    Company Total Win Loss
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-display mt-3 leading-none">
                    USD 0.00
                  </h3>
                </div>
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/15 group-hover:scale-110 transition-transform">
                  <Coins size={20} />
                </div>
              </div>
              <button className="w-full text-left text-[10px] font-black text-amber-400/80 hover:text-amber-300 uppercase tracking-widest border-t border-amber-500/10 pt-3 mt-5 flex items-center justify-between transition-colors">
                <span>View More</span>
                <span>→</span>
              </button>
            </motion.div>
          </div>

          {/* 9 Collapsible Panels accordion stack */}
          <div className="space-y-4">
            
            {/* Panel 1: DEPOSIT */}
            <div className="bg-background/40 border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl">
              <button 
                onClick={() => togglePanel("deposit")}
                className="w-full flex items-center justify-between px-6 py-4.5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors border-b border-white/5 text-left"
              >
                <div className="flex items-center gap-3">
                 
                  <span className="font-display font-black text-sm uppercase tracking-wider text-slate-100">
                    Deposit
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Total Pending Badges */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Pending:</span>
                    <span className="text-[10px] font-bold bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                      USD 0.00
                    </span>
                    <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-md">
                      0
                    </span>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-200", openPanels.deposit && "transform rotate-180")} />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openPanels.deposit && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden relative"
                  >
                    {/* Confirmed Banner Ribbon */}
                    <div className="absolute top-0 left-0 overflow-hidden w-24 h-24 pointer-events-none z-10">
                      <div className="absolute top-4 -left-8 w-32 bg-primary/90 text-white font-bold text-[9px] uppercase tracking-widest text-center py-1.5 transform -rotate-45 shadow-lg shadow-primary/20">
                        Confirmed
                      </div>
                    </div>

                    <div className="p-6 overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                          <tr className="border-b border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="pb-3 pl-12">Period</th>
                            <th className="pb-3 text-center">Count</th>
                            <th className="pb-3 text-right">Amount(K)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02] text-xs sm:text-sm">
                          {[
                            { period: "Today", count: 0, amount: "0.00" },
                            { period: "Yesterday", count: 0, amount: "0.00" },
                            { period: "This Week", count: 0, amount: "0.00" },
                            { period: "Last Week", count: 0, amount: "0.00" },
                            { period: "This Month", count: 0, amount: "0.00" },
                            { period: "Last Month", count: 0, amount: "0.00" },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                              <td className="py-3.5 font-bold text-slate-300 pl-12">{row.period}</td>
                              <td className="py-3.5 text-center text-slate-400 font-semibold">{row.count}</td>
                              <td className="py-3.5 text-right font-display font-semibold text-slate-200">{row.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Panel 2: WITHDRAWAL */}
            <div className="bg-background/40 border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl">
              <button 
                onClick={() => togglePanel("withdrawal")}
                className="w-full flex items-center justify-between px-6 py-4.5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors border-b border-white/5 text-left"
              >
                <div className="flex items-center gap-3">
                 
                  <span className="font-display font-black text-sm uppercase tracking-wider text-slate-100">
                    Withdrawal
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Pending:</span>
                    <span className="text-[10px] font-bold bg-rose-600/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-md">
                      USD 0.00
                    </span>
                    <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-md">
                      0
                    </span>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-200", openPanels.withdrawal && "transform rotate-180")} />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openPanels.withdrawal && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden relative"
                  >
                    <div className="absolute top-0 left-0 overflow-hidden w-24 h-24 pointer-events-none z-10">
                      <div className="absolute top-4 -left-8 w-32 bg-primary/90 text-white font-bold text-[9px] uppercase tracking-widest text-center py-1.5 transform -rotate-45 shadow-lg shadow-primary/20">
                        Confirmed
                      </div>
                    </div>

                    <div className="p-6 overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                          <tr className="border-b border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="pb-3 pl-12">Period</th>
                            <th className="pb-3 text-center">Count</th>
                            <th className="pb-3 text-right">Amount(K)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02] text-xs sm:text-sm">
                          {[
                            { period: "Today", count: 0, amount: "0.00" },
                            { period: "Yesterday", count: 0, amount: "0.00" },
                            { period: "This Week", count: 0, amount: "0.00" },
                            { period: "Last Week", count: 0, amount: "0.00" },
                            { period: "This Month", count: 0, amount: "0.00" },
                            { period: "Last Month", count: 0, amount: "0.00" },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                              <td className="py-3.5 font-bold text-slate-300 pl-12">{row.period}</td>
                              <td className="py-3.5 text-center text-slate-400 font-semibold">{row.count}</td>
                              <td className="py-3.5 text-right font-display font-semibold text-slate-200">{row.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Panel 3: REGISTERED USER */}
            <div className="bg-background/40 border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl">
              <button 
                onClick={() => togglePanel("registeredUser")}
                className="w-full flex items-center justify-between px-6 py-4.5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors border-b border-white/5 text-left"
              >
                <div className="flex items-center gap-3">
                  
                  <span className="font-display font-black text-sm uppercase tracking-wider text-slate-100">
                    Registered User
                  </span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-200", openPanels.registeredUser && "transform rotate-180")} />
              </button>

              <AnimatePresence initial={false}>
                {openPanels.registeredUser && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                          <tr className="border-b border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="pb-3">Period</th>
                            <th className="pb-3 text-right pr-6">Count</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02] text-xs sm:text-sm">
                          {[
                            { period: "Today", count: 3 },
                            { period: "Yesterday", count: 0 },
                            { period: "This Week", count: 5 },
                            { period: "Last Week", count: 12 },
                            { period: "This Month", count: 3 },
                            { period: "Last Month", count: 61 },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                              <td className="py-3.5 font-bold text-slate-300">{row.period}</td>
                              <td className="py-3.5 text-right font-display font-semibold text-slate-200 pr-6">{row.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Panel 4: FIRST DEPOSIT */}
            <div className="bg-background/40 border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl">
              <button 
                onClick={() => togglePanel("firstDeposit")}
                className="w-full flex items-center justify-between px-6 py-4.5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors border-b border-white/5 text-left"
              >
                <div className="flex items-center gap-3">
                 
                  <span className="font-display font-black text-sm uppercase tracking-wider text-slate-100">
                    First Deposit
                  </span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-200", openPanels.firstDeposit && "transform rotate-180")} />
              </button>

              <AnimatePresence initial={false}>
                {openPanels.firstDeposit && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                          <tr className="border-b border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="pb-3">Period</th>
                            <th className="pb-3 text-center">Count</th>
                            <th className="pb-3 text-right">Amount(K)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02] text-xs sm:text-sm">
                          {[
                            { period: "Today", count: 0, amount: "0.00" },
                            { period: "Yesterday", count: 0, amount: "0.00" },
                            { period: "This Week", count: 0, amount: "0.00" },
                            { period: "Last Week", count: 0, amount: "0.00" },
                            { period: "This Month", count: 3, amount: "3.00" },
                            { period: "Last Month", count: 61, amount: "61.00" },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                              <td className="py-3.5 font-bold text-slate-300">{row.period}</td>
                              <td className="py-3.5 text-center text-slate-400 font-semibold">{row.count}</td>
                              <td className="py-3.5 text-right font-display font-semibold text-slate-200">{row.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Panel 5: BONUS */}
            <div className="bg-background/40 border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl">
              <button 
                onClick={() => togglePanel("bonus")}
                className="w-full flex items-center justify-between px-6 py-4.5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors border-b border-white/5 text-left"
              >
                <div className="flex items-center gap-3">
                  
                  <span className="font-display font-black text-sm uppercase tracking-wider text-slate-100">
                    Bonus
                  </span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-200", openPanels.bonus && "transform rotate-180")} />
              </button>

              <AnimatePresence initial={false}>
                {openPanels.bonus && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                          <tr className="border-b border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="pb-3">Period</th>
                            <th className="pb-3 text-center">Count</th>
                            <th className="pb-3 text-right">Amount(K)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02] text-xs sm:text-sm">
                          {[
                            { period: "Today", count: 0, amount: "0.00" },
                            { period: "Yesterday", count: 0, amount: "0.00" },
                            { period: "This Week", count: 1, amount: "2,000.00" },
                            { period: "Last Week", count: 0, amount: "0.00" },
                            { period: "This Month", count: 0, amount: "0.00" },
                            { period: "Last Month", count: 9, amount: "12,600.00" },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                              <td className="py-3.5 font-bold text-slate-300">{row.period}</td>
                              <td className="py-3.5 text-center text-slate-400 font-semibold">{row.count}</td>
                              <td className="py-3.5 text-right font-display font-semibold text-slate-200">{row.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Panel 6: VIP POINT TO CASH */}
            <div className="bg-background/40 border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl">
              <button 
                onClick={() => togglePanel("vipPoint")}
                className="w-full flex items-center justify-between px-6 py-4.5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors border-b border-white/5 text-left"
              >
                <div className="flex items-center gap-3">
                 
                  <span className="font-display font-black text-sm uppercase tracking-wider text-slate-100">
                    VIP Point To Cash
                  </span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-200", openPanels.vipPoint && "transform rotate-180")} />
              </button>

              <AnimatePresence initial={false}>
                {openPanels.vipPoint && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                          <tr className="border-b border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="pb-3">Period</th>
                            <th className="pb-3 text-center">Uid</th>
                            <th className="pb-3 text-right">Amount(K)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02] text-xs sm:text-sm">
                          {[
                            { period: "Today", uid: 0, amount: "0.00" },
                            { period: "Yesterday", uid: 0, amount: "0.00" },
                            { period: "This Week", uid: 0, amount: "0.00" },
                            { period: "Last Week", uid: 0, amount: "0.00" },
                            { period: "This Month", uid: 0, amount: "0.00" },
                            { period: "Last Month", uid: 0, amount: "0.00" },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                              <td className="py-3.5 font-bold text-slate-300">{row.period}</td>
                              <td className="py-3.5 text-center text-slate-400 font-semibold">{row.uid}</td>
                              <td className="py-3.5 text-right font-display font-semibold text-slate-200">{row.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Panel 7: COMPANY WIN / LOSS */}
            <div className="bg-background/40 border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl">
              <button 
                onClick={() => togglePanel("winLoss")}
                className="w-full flex items-center justify-between px-6 py-4.5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors border-b border-white/5 text-left"
              >
                <div className="flex items-center gap-3">
                 
                  <span className="font-display font-black text-sm uppercase tracking-wider text-slate-100">
                    Company Win / Loss
                  </span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-200", openPanels.winLoss && "transform rotate-180")} />
              </button>

              <AnimatePresence initial={false}>
                {openPanels.winLoss && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                          <tr className="border-b border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="pb-3">Period</th>
                            <th className="pb-3 text-center">Count</th>
                            <th className="pb-3 text-right">Amount(K)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02] text-xs sm:text-sm">
                          {[
                            { period: "Today", count: 0, amount: "0.00" },
                            { period: "Yesterday", count: 0, amount: "0.00" },
                            { period: "This Week", count: 0, amount: "0.00" },
                            { period: "Last Week", count: 0, amount: "0.00" },
                            { period: "This Month", count: 0, amount: "0.00" },
                            { period: "Last Month", count: 1, amount: "50.00" },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                              <td className="py-3.5 font-bold text-slate-300">{row.period}</td>
                              <td className="py-3.5 text-center text-slate-400 font-semibold">{row.count}</td>
                              <td className="py-3.5 text-right font-display font-semibold text-slate-200">{row.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Panel 8: TURNOVER */}
            <div className="bg-background/40 border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl">
              <button 
                onClick={() => togglePanel("turnover")}
                className="w-full flex items-center justify-between px-6 py-4.5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors border-b border-white/5 text-left"
              >
                <div className="flex items-center gap-3">
                 
                  <span className="font-display font-black text-sm uppercase tracking-wider text-slate-100">
                    Turnover
                  </span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-200", openPanels.turnover && "transform rotate-180")} />
              </button>

              <AnimatePresence initial={false}>
                {openPanels.turnover && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                          <tr className="border-b border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="pb-3">Period</th>
                            <th className="pb-3 text-center">Count</th>
                            <th className="pb-3 text-right">Amount(K)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02] text-xs sm:text-sm">
                          {[
                            { period: "Today", count: 0, amount: "0.00" },
                            { period: "Yesterday", count: 0, amount: "0.00" },
                            { period: "This Week", count: 0, amount: "0.00" },
                            { period: "Last Week", count: 0, amount: "0.00" },
                            { period: "This Month", count: 0, amount: "0.00" },
                            { period: "Last Month", count: 1, amount: "50.00" },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                              <td className="py-3.5 font-bold text-slate-300">{row.period}</td>
                              <td className="py-3.5 text-center text-slate-400 font-semibold">{row.count}</td>
                              <td className="py-3.5 text-right font-display font-semibold text-slate-200">{row.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Panel 9: GROSS MARGIN */}
            <div className="bg-background/40 border border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl">
              <button 
                onClick={() => togglePanel("grossMargin")}
                className="w-full flex items-center justify-between px-6 py-4.5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors border-b border-white/5 text-left"
              >
                <div className="flex items-center gap-3">
                    
                  <span className="font-display font-black text-sm uppercase tracking-wider text-slate-100">
                    Gross Margin
                  </span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-200", openPanels.grossMargin && "transform rotate-180")} />
              </button>

              <AnimatePresence initial={false}>
                {openPanels.grossMargin && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                          <tr className="border-b border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="pb-3">Period</th>
                            <th className="pb-3 text-center">Count</th>
                            <th className="pb-3 text-right">Margin %</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02] text-xs sm:text-sm">
                          {[
                            { period: "Today", count: 0, margin: "0%" },
                            { period: "Yesterday", count: 0, margin: "0%" },
                            { period: "This Week", count: 0, margin: "0%" },
                            { period: "Last Week", count: 0, margin: "0%" },
                            { period: "This Month", count: 0, margin: "0%" },
                            { period: "Last Month", count: 1, margin: "100%" },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                              <td className="py-3.5 font-bold text-slate-300">{row.period}</td>
                              <td className="py-3.5 text-center text-slate-400 font-semibold">{row.count}</td>
                              <td className="py-3.5 text-right font-display font-semibold text-purple-400">{row.margin}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      )}

      {/* Articles Tab */}
      {activeTab === "articles" && (
        <div className="space-y-6 px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <h2 className="text-xl font-bold font-display uppercase tracking-wider text-white">Articles Directory</h2>
            <Button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs py-2 px-4 rounded-xl flex items-center gap-2">
              <Plus size={16} /> New Article
            </Button>
          </div>

          <div className="grid gap-4">
            {mockArticles.map((article) => (
              <div key={article.id} className="bg-[#111018]/50 border border-white/5 p-5 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-200 hover:text-purple-400 transition-colors cursor-pointer">{article.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{article.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-md border border-purple-500/10">{article.category}</span>
                      <span>• {article.readTime}</span>
                      <span>• {article.author}</span>
                      <span>• {article.date}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={article.status === "published" ? "success" : "info"} label={article.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-6 px-6 sm:px-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold font-display uppercase text-white">Member Accounts</h2>
            <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-4 py-2 rounded-xl flex items-center gap-2">
              <Plus size={16} /> Add Member
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 bg-[#111018]/30 rounded-2xl border border-white/5">
                <Users size={32} className="mx-auto text-slate-600 mb-2" />
                <p className="text-xs text-slate-500">No member accounts loaded.</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="bg-[#111018]/50 border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600/30 to-blue-500/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-400 text-sm">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-200">{user.name}</h3>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 justify-between sm:justify-start">
                    <Badge variant="primary" label={user.role} />
                    <Badge variant={user.status === "active" ? "success" : "danger"} label={user.status} />
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{user.joinDate}</span>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-transparent hover:border-red-500/10 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Trading Signals Tab */}
      {activeTab === "signals" && (
        <div className="space-y-6 px-6 sm:px-8">
          <SignalManager />
        </div>
      )}

      {/* Forex Signals Tab */}
      {activeTab === "forex" && (
        <div className="space-y-6 px-6 sm:px-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold font-display uppercase text-white">Forex Signal Logs</h2>
          </div>
          <div className="grid gap-4">
            {signals.map((sig) => (
              <div key={sig.id} className="bg-[#111018]/50 border border-white/5 p-5 rounded-2xl flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm", 
                  sig.direction === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                )}>
                  {sig.direction}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-200">{sig.pair}</h3>
                    <span className="text-[10px] text-slate-500 font-semibold bg-white/5 px-2 py-0.5 rounded border border-white/5">{sig.timeframe}</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2 text-xs">
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-bold">Entry</p>
                      <p className="font-bold text-slate-300 mt-0.5">{sig.entryPrice.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-bold">Stop Loss</p>
                      <p className="font-bold text-slate-300 mt-0.5">{sig.stopLoss.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-bold">Accuracy</p>
                      <p className="font-bold text-slate-300 mt-0.5">{sig.accuracy.toFixed(0)}%</p>
                    </div>
                  </div>
                </div>
                <Badge variant={sig.status === 'active' ? 'success' : 'danger'} label={sig.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blog Tab */}
      {activeTab === "blog" && (
        <div className="space-y-6 px-6 sm:px-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold font-display uppercase text-white">Insights Blog Posts</h2>
            <Button className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-4 py-2 rounded-xl">Add New Post</Button>
          </div>
          <div className="grid gap-4">
            {mockBlogPosts.map((post) => (
              <div key={post.id} className="bg-[#111018]/50 border border-white/5 p-5 rounded-2xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-200">{post.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{post.excerpt}</p>
                    <div className="flex items-center gap-3 mt-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded">{post.category}</span>
                      <span>By {post.author}</span>
                      <span>• {post.date}</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {post.views}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Tab */}
      {activeTab === "education" && (
        <div className="space-y-6 px-6 sm:px-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold font-display uppercase text-white">Education Curriculum</h2>
          </div>
          <div className="grid gap-4">
            {mockEducationModules.map((module) => (
              <div key={module.id} className="bg-[#111018]/50 border border-white/5 p-5 rounded-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-base text-slate-200">{module.title}</h3>
                      <Badge variant="info" label={module.level} size="sm" />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{module.description}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">Duration: {module.duration}</p>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                        <span className="text-slate-400">Completion</span>
                        <span className="text-purple-400">{module.progress}%</span>
                      </div>
                      <div className="w-full bg-[#1A1825] rounded-full h-1.5 border border-white/5">
                        <div className="bg-purple-500 h-1.5 rounded-full shadow-lg shadow-purple-500/30" style={{ width: `${module.progress}%` }} />
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === "transactions" && (
        <div className="space-y-6 px-6 sm:px-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold font-display uppercase text-white">Transaction Logs</h2>
          </div>
          <div className="grid gap-4">
            {transactions.length === 0 ? (
              <div className="text-center py-12 bg-[#111018]/30 rounded-2xl border border-white/5">
                <DollarSign size={32} className="mx-auto text-slate-600 mb-2" />
                <p className="text-xs text-slate-500">No transactions recorded.</p>
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="bg-[#111018]/50 border border-white/5 p-5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-200 capitalize">{tx.type} request</h3>
                      <p className="text-xs text-slate-400">{tx.user}</p>
                      <span className="text-[10px] text-slate-500 font-bold uppercase mt-1 block">{tx.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-display font-black text-sm sm:text-base text-emerald-400">
                      +K{tx.amount.toLocaleString()}
                    </span>
                    <Badge variant={tx.status === 'completed' ? 'success' : 'warning'} label={tx.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6 px-6 sm:px-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold font-display uppercase text-white">System Alerts</h2>
          </div>
          <div className="grid gap-4">
            {notifications.map((notif) => (
              <div key={notif.id} className={cn("bg-[#111018]/50 border border-white/5 p-5 rounded-2xl flex items-start gap-4", 
                !notif.read && "border-purple-500/20 bg-purple-500/[0.01]"
              )}>
                <div className="p-3 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
                  <Bell size={18} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm sm:text-base text-slate-200">{notif.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{notif.message}</p>
                  <span className="text-[9px] text-slate-500 font-bold uppercase block mt-2">{notif.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6 px-6 sm:px-8 max-w-3xl">
          <div className="bg-[#111018]/50 border border-white/5 p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold font-display text-white uppercase tracking-wider">General Configurations</h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-slate-400 font-bold text-xs uppercase mb-1">Platform Name</label>
                <Input defaultValue="Empire Of Forex" className="bg-[#161520] border-white/5" />
              </div>
              <div>
                <label className="block text-slate-400 font-bold text-xs uppercase mb-1">System Mail</label>
                <Input defaultValue="noreply@empireforex.com" className="bg-[#161520] border-white/5" />
              </div>
            </div>
            <div className="pt-3">
              <Button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs py-2.5 px-6 rounded-xl">
                Save Global Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Traffic Tab */}
      {activeTab === "traffic" && (
        <div className="space-y-6 px-6 sm:px-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold font-display uppercase text-white">Analytics & Traffic Overview</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#111018]/50 border border-white/5 p-5 rounded-2xl">
              <p className="text-slate-400 font-bold text-xs uppercase">Unique Visitors</p>
              <h3 className="text-2xl font-black text-white font-display mt-2">24,592</h3>
              <p className="text-[10px] text-emerald-400 font-bold mt-1">+12.5% vs Last Month</p>
            </div>
            <div className="bg-[#111018]/50 border border-white/5 p-5 rounded-2xl">
              <p className="text-slate-400 font-bold text-xs uppercase">Page Views</p>
              <h3 className="text-2xl font-black text-white font-display mt-2">142,845</h3>
              <p className="text-[10px] text-emerald-400 font-bold mt-1">+18.2% vs Last Month</p>
            </div>
            <div className="bg-[#111018]/50 border border-white/5 p-5 rounded-2xl">
              <p className="text-slate-400 font-bold text-xs uppercase">Avg. Session Duration</p>
              <h3 className="text-2xl font-black text-white font-display mt-2">4m 32s</h3>
              <p className="text-[10px] text-rose-400 font-bold mt-1">-1.5% vs Last Month</p>
            </div>
          </div>

          <div className="bg-[#111018]/50 border border-white/5 p-6 rounded-2xl">
            <h3 className="text-base font-bold font-display text-white uppercase mb-6">Traffic & Pageview Trends</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: "Week 1", visitors: 4000, pageviews: 24000 },
                  { name: "Week 2", visitors: 3000, pageviews: 13980 },
                  { name: "Week 3", visitors: 2000, pageviews: 9800 },
                  { name: "Week 4", visitors: 2780, pageviews: 39080 },
                  { name: "Week 5", visitors: 1890, pageviews: 4800 },
                  { name: "Week 6", visitors: 2390, pageviews: 3800 },
                  { name: "Week 7", visitors: 3490, pageviews: 4300 },
                ]}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#111016', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="pageviews" name="Page Views" stroke="#A855F7" fillOpacity={1} fill="url(#colorVisitors)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.open && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111018] border border-white/5 max-w-sm w-full rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <h3 className="text-base font-bold font-display text-white uppercase">Confirm User Deletion</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you absolutely sure you want to permanently delete member account <strong className="text-white">{deleteConfirm.userName}</strong>? This action is irreversible.
              </p>
              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-500 text-white font-semibold text-xs py-2 px-4 rounded-xl flex-1"
                >
                  Delete Account
                </Button>
                <Button 
                  onClick={() => setDeleteConfirm({ open: false, userId: null, userName: null })}
                  className="bg-white/5 border border-white/5 text-slate-300 font-semibold text-xs py-2 px-4 rounded-xl flex-1"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
