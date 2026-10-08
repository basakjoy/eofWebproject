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
import Link from "next/link";
import { useThemeColors } from "@/lib/themeColors";
import SignalManager from "@/components/admin/SignalManager";
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
import investmentApi from "@/lib/investmentApi";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";

type DashboardTab = "overview" | "articles" | "users" | "signals" | "forex" | "blog" | "education" | "transactions" | "notifications" | "settings" | "traffic";
const LIST_PAGE_SIZE = 20;


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

interface NewArticleFormData {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  author:string;
  content: string;
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

interface AdminUserRecord {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  status?: string | null;
  createdAt?: string | Date | null;
}

interface ArticleRecord {
  id: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  category?: string | null;
  published?: boolean;
  viewCount?: number;
  helpfulCount?: number;
  author?: string | null;
  createdAt?: string | Date | null;
  readTime?: string | null;
}

interface SignalRecord {
  id: string;
  pair?: string | null;
  type?: string | null;
  entryPrice?: number | null;
  takeProfit?: number | null;
  stopLoss?: number | null;
  reliability?: number | null;
  timeframe?: string | null;
  status?: string | null;
}

interface WithdrawalRecord {
  id: string;
  userId?: string | null;
  amount?: number | string | null;
  createdAt?: string | Date | null;
  status?: string | null;
}

interface NotificationRecord {
  id: string;
  title?: string | null;
  message?: string | null;
  type?: string | null;
  createdAt?: string | Date | null;
  read?: boolean | null;
}

interface DashboardStats {
  users?: { total: number; active: number; newToday: number; newThisMonth: number };
  investments?: { total: number; active: number; totalInvestedAmount: number; totalProfitDistributed: number };
  signals?: { total: number; active: number };
  withdrawals?: { pending: number; pendingAmount: number };
  support?: { openTickets: number };
  blog?: { total: number; published: number };
  activity?: {
    deposits?: { pending: number; pendingAmount: number; rows: Array<{ period: string; count: number; amount: number }> };
    withdrawals?: { rows: Array<{ period: string; count: number; amount: number }> };
    registeredUsers?: Array<{ period: string; count: number }>;
    firstDeposits?: Array<{ period: string; count: number; amount: number }>;
    bonuses?: Array<{ period: string; count: number; amount: number }>;
    winLoss?: Array<{ period: string; count: number; amount: number }>;
    turnover?: Array<{ period: string; count: number; amount: number }>;
    grossMargin?: Array<{ period: string; count: number; margin: string }>;
  };
}

interface InvestmentListItem {
  id: string;
  user?: { name?: string | null } | null;
  plan?: string | null;
  amount?: number | string | null;
  status?: string | null;
  roi?: number | string | null;
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
  const { user } = useAuthStore();
  const { t } = useLanguage();
  
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; userId: string | null; userName: string | null }>({ open: false, userId: null, userName: null });
  const [deletedUsers, setDeletedUsers] = useState<Set<string>>(new Set());


  // Article Model States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false);
  const [isDeletingArticleId, setIsDeletingArticleId] = useState<string | null>(null);
  const [ formDate, setFormData ] = useState<NewArticleFormData>({
    title: "",
    content: "",
    excerpt: "",
    category: "Education",
    readTime: "5 min",
    author: ""
   });


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
  const [investmentRows, setInvestmentRows] = useState<Array<{
    id: string;
    userName: string;
    plan: string;
    amount: number;
    status: string;
    roi: number;
  }>>([]);
  const [profitInputs, setProfitInputs] = useState<Record<string, string>>({});
  const [updatingInvestmentId, setUpdatingInvestmentId] = useState<string | null>(null);
  
  // Loading and error states
  const [loadingPage, setLoadingPage] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch overview stats independently so other dashboard lists do not delay first render.
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await adminApi.getDashboardStats();
        if (statsRes.success && statsRes.data) {
          setDashboardStats(statsRes.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard stats');
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRecentInvestments = async () => {
      if (activeTab !== 'overview') return;

      try {
        const response = await investmentApi.getAllInvestments({ limit: 8, offset: 0 });
        if (!response?.success) return;

        const rows = (response.data as InvestmentListItem[]).map((inv) => {
          const amount = Number(inv.amount || 0);
          const roi = Number(inv.roi || 0);
          const pct = amount > 0 ? (roi / amount) * 100 : 0;

          return {
            id: inv.id,
            userName: inv.user?.name || 'Unknown User',
            plan: inv.plan || 'General',
            amount,
            status: inv.status || 'active',
            roi,
            profitPercent: pct,
          };
        });

        setInvestmentRows(rows);
        const nextInputs: Record<string, string> = {};
        rows.forEach((row) => {
          nextInputs[row.id] = String(row.profitPercent || 0);
        });
        setProfitInputs(nextInputs);
      } catch (err) {
        console.error('Error fetching recent investments:', err);
      }
    };

    fetchRecentInvestments();
  }, [activeTab]);

  // Update activeTab whenever search params change
  useEffect(() => {
    const tab = (searchParams.get("tab") as DashboardTab) || "overview";
    setActiveTab(tab);
    setPageIndex(0);
  }, [searchParams]);

  useEffect(() => {
    const offset = pageIndex * LIST_PAGE_SIZE;
    let cancelled = false;
    const fetchPage = async () => {
      if (["overview", "settings", "education", "signals", "traffic"].includes(activeTab)) return;
      setLoadingPage(true);
      setError(null);
      try {
        let pageLength = 0;
        if (activeTab === "users") {
          const response = await adminApi.getAllUsers({ limit: LIST_PAGE_SIZE, offset }) as { success: boolean; data: AdminUserRecord[] };
          pageLength = response.data.length;
          if (!cancelled && response.success) {
            setUsers(response.data.map(u => ({
              id: u.id,
              name: u.name || "Unknown",
              email: u.email || "",
              role: u.role || "User",
              status: u.status === "active" ? "active" : "inactive",
              joinDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A",
            })));
          }
        } else if (activeTab === "articles" || activeTab === "blog") {
          const response = await adminApi.getAllArticles({ limit: LIST_PAGE_SIZE, offset, published: "all" }) as { success: boolean; data: ArticleRecord[] };
          pageLength = response.data.length;
          if (!cancelled && response.success) {
            const mappedArticles: Article[] = response.data.map(article => ({
              id: article.id,
              title: article.title,
              excerpt: article.excerpt || article.content?.slice(0, 120) || "",
              category: article.category || "General",
              status: article.published ? "published" : "draft",
              views: article.viewCount || 0,
              comments: article.helpfulCount || 0,
              author: article.author || user?.name || "Admin",
              date: article.createdAt ? new Date(article.createdAt).toLocaleDateString() : "N/A",
              readTime: article.readTime || "5 min",
            }));
            setArticles(mappedArticles);
            setBlogPosts(mappedArticles.map(article => ({
              id: article.id,
              title: article.title,
              excerpt: article.excerpt,
              author: article.author,
              date: article.date,
              views: article.views,
              category: article.category,
            })));
          }
        } else if (activeTab === "forex") {
          const response = await adminApi.getAllSignals({ limit: LIST_PAGE_SIZE, offset }) as { success: boolean; data: SignalRecord[] };
          pageLength = response.data.length;
          if (!cancelled && response.success) {
            setSignals(response.data.map(s => ({
              id: s.id,
              pair: s.pair || "N/A",
              direction: s.type === "BUY" ? "BUY" : "SELL",
              entryPrice: s.entryPrice || 0,
              takeProfits: s.takeProfit ? [s.takeProfit] : [],
              stopLoss: s.stopLoss || 0,
              accuracy: s.reliability ? s.reliability * 100 : 0,
              timeframe: s.timeframe || "1H",
              status: s.status === "closed" ? "closed" : "active",
              profitLoss: 0,
            })));
          }
        } else if (activeTab === "transactions") {
          const response = await adminApi.getAllWithdrawals({ limit: LIST_PAGE_SIZE, offset }) as { success: boolean; data: WithdrawalRecord[] };
          pageLength = response.data.length;
          if (!cancelled && response.success) {
            setTransactions(response.data.map(w => ({
              id: w.id,
              user: w.userId || "Unknown",
              type: "withdrawal",
              amount: Number(w.amount || 0),
              date: w.createdAt ? new Date(w.createdAt).toLocaleDateString() : "N/A",
              status: w.status === "completed" ? "completed" : w.status === "failed" || w.status === "rejected" ? "failed" : "pending",
            })));
          }
        } else if (activeTab === "notifications") {
          const response = await adminApi.getAllNotifications({ limit: LIST_PAGE_SIZE, offset }) as { success: boolean; data: NotificationRecord[] };
          pageLength = response.data.length;
          if (!cancelled && response.success) {
            setNotifications(response.data.map(n => ({
              id: n.id,
              title: n.title || "Notification",
              message: n.message || "",
              type: n.type === "warning" || n.type === "success" || n.type === "error" ? n.type : "info",
              date: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "N/A",
              read: n.read || false,
            })));
          }
        }
        if (!cancelled) setHasNextPage(pageLength === LIST_PAGE_SIZE);
      } catch (err) {
        if (!cancelled) {
          console.error(`Error fetching ${activeTab} page:`, err);
          setError(`Failed to load ${activeTab}`);
        }
      } finally {
        if (!cancelled) setLoadingPage(false);
      }
    };
    fetchPage();
    return () => { cancelled = true; };
  }, [activeTab, pageIndex, user?.name]);

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

  const handleProfitUpdate = async (investmentId: string) => {
    const percentValue = Number(profitInputs[investmentId]);

    if (!Number.isFinite(percentValue) || percentValue < 0 || percentValue > 100) {
      toast.error('Profit percentage must be between 0 and 100.');
      return;
    }

    setUpdatingInvestmentId(investmentId);

    try {
      const response = await investmentApi.updateInvestment(investmentId, { profitPercent: percentValue });
      if (response?.success) {
        const updatedInvestment = response.data;
        const updatedRoi = Number(updatedInvestment?.roi || 0);
        const amount = Number(updatedInvestment?.amount || 0);
        setInvestmentRows((prev) => prev.map((row) => row.id === investmentId
          ? { ...row, roi: updatedRoi, profitPercent: amount > 0 ? (updatedRoi / amount) * 100 : 0, status: updatedInvestment?.status || row.status }
          : row
        ));
        toast.success(`Profit set to ${percentValue}% for this investment.`);
      } else {
        toast.error(response?.message || 'Unable to update investment profit.');
      }
    } catch (err: unknown) {
      console.error('Error updating investment profit:', err);
      const message = err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
        ? String((err.response.data as { message?: string }).message)
        : 'Failed to update investment profit.';
      toast.error(message);
    } finally {
      setUpdatingInvestmentId(null);
    }
  };

  // Article Modal Handlers
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };
 const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      category: "Education",
      readTime: "5 min",
      author:""
    });
 };
 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formDate.title.trim() || !formDate.content.trim()) {
      setError("Title and content are required to create an article.");
      return;
    }

    setIsSubmittingArticle(true);

    try {
      const response = await adminApi.createArticle({
        title: formDate.title.trim(),
        content: formDate.content.trim(),
        excerpt: formDate.excerpt.trim() || formDate.content.trim().slice(0, 120),
        category: formDate.category,
        keywords: formDate.category,
        published: false,
        authorId: user?.id,
      });

      if (response?.success) {
        const created = response.data;
        const newArticle: Article = {
          id: created?.id || Date.now().toString(),
          title: created?.title || formDate.title,
          excerpt: created?.excerpt || formDate.excerpt || formDate.content.slice(0, 120),
          category: created?.category || formDate.category,
          readTime: created?.readTime || formDate.readTime,
          author: created?.author || user?.name || "Admin",
          date: created?.createdAt ? new Date(created.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }) : new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
          status: created?.published ? "published" : "draft",
          views: created?.viewCount || 0,
          comments: created?.helpfulCount || 0,
        };
        setArticles((prev) => [newArticle, ...prev]);
      }

      handleCloseModal();
    } catch (err) {
      console.error("Error creating article:", err);
      setError("Failed to create article.");
    } finally {
      setIsSubmittingArticle(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm("Delete this article?")) return;

    setIsDeletingArticleId(id);

    try {
      const result = await adminApi.deleteArticle(id);
      if (result?.success) {
        setArticles((prev) => prev.filter((article) => article.id !== id));
      }
    } catch (err) {
      console.error("Error deleting article:", err);
      setError("Failed to delete article.");
    } finally {
      setIsDeletingArticleId(null);
    }
  };

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
                    {dashboardStats?.users?.active ?? 0}
                  </h3>
                  <p className="text-[9px] font-bold text-emerald-500 uppercase mt-1 tracking-wider">
                    Of {dashboardStats?.users?.total ?? 0} Active
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
                    {dashboardStats?.users?.total ?? 0}
                  </h3>
                  <p className="text-[9px] font-bold text-rose-500 uppercase mt-1 tracking-wider">
                    Today {dashboardStats?.users?.newToday ?? 0}
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
                    {dashboardStats?.investments?.totalProfitDistributed ? `USD ${dashboardStats.investments.totalProfitDistributed.toLocaleString()}` : "USD 0.00"}
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

          <motion.div
            whileHover={{ y: -2 }}
            className="bg-slate-950/60 border border-amber-500/20 rounded-2xl p-5 shadow-xl shadow-slate-950/20"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Investment Profit Controls</p>
                <h3 className="mt-2 text-xl font-black text-white">Set admin ROI for active investments</h3>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Update Ready
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase tracking-[0.2em]">
                    <th className="pb-3 pr-4 font-semibold">User</th>
                    <th className="pb-3 pr-4 font-semibold">Plan</th>
                    <th className="pb-3 pr-4 font-semibold">Amount</th>
                    <th className="pb-3 pr-4 font-semibold">Current Profit</th>
                    <th className="pb-3 pr-4 font-semibold">Profit %</th>
                    <th className="pb-3 pr-4 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {investmentRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-4 text-slate-400 text-sm">No investment data available yet.</td>
                    </tr>
                  ) : (
                    investmentRows.map((row) => (
                      <tr key={row.id} className="border-b border-white/5 align-middle">
                        <td className="py-3 pr-4 font-medium text-white">{row.userName}</td>
                        <td className="py-3 pr-4 text-slate-300">{row.plan}</td>
                        <td className="py-3 pr-4 font-mono text-emerald-300">${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="py-3 pr-4 font-mono text-amber-300">${row.roi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="py-3 pr-4">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={0.1}
                            value={profitInputs[row.id] ?? '0'}
                            onChange={(e) => setProfitInputs((prev) => ({ ...prev, [row.id]: e.target.value }))}
                            className="w-24 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none ring-0 focus:border-amber-400"
                          />
                        </td>
                        <td className="py-3 pr-4">
                          <span className="rounded-full border border-sky-500/20 bg-sky-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300">
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            disabled={updatingInvestmentId === row.id}
                            onClick={() => handleProfitUpdate(row.id)}
                            className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {updatingInvestmentId === row.id ? 'Updating...' : 'Apply Profit'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Quick Access: Client Support & Live Chat Hub */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="bg-gradient-to-r from-indigo-950/60 via-[#131627]/90 to-[#0d0f1a] border border-indigo-500/25 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-indigo-950/20"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-display">Client Live Support & Chat Console</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live System Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct real-time text messaging with clients, inquiry management, and resolution tracking.
                </p>
              </div>
            </div>

            <Link
              href="/admin/support"
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0"
            >
              <span>Open Support Console</span>
              <span>→</span>
            </Link>
          </motion.div>

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
                      USD {(dashboardStats?.activity?.deposits?.pendingAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-md">
                      {dashboardStats?.activity?.deposits?.pending || 0}
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
                            <th className="pb-3 text-right">Amount(USD)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02] text-xs sm:text-sm">
                          {(dashboardStats?.activity?.deposits?.rows || []).map((row, i) => (
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
                      USD {(dashboardStats?.withdrawals?.pendingAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-md">
                      {dashboardStats?.withdrawals?.pending || 0}
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
                            <th className="pb-3 text-right">Amount(USD)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02] text-xs sm:text-sm">
                          {(dashboardStats?.activity?.withdrawals?.rows || []).map((row, i) => (
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
                          {(dashboardStats?.activity?.registeredUsers || []).map((row, i) => (
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
                            <th className="pb-3 text-right">Amount(USD)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02] text-xs sm:text-sm">
                          {(dashboardStats?.activity?.firstDeposits || []).map((row, i) => (
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
                            <th className="pb-3 text-right">Amount(USD)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02] text-xs sm:text-sm">
                          {(dashboardStats?.activity?.bonuses || []).map((row, i) => (
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
                            <th className="pb-3 text-right">Amount(USD)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02] text-xs sm:text-sm">
                          {(dashboardStats?.activity?.winLoss || []).map((row, i) => (
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
                            <th className="pb-3 text-right">Amount(USD)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02] text-xs sm:text-sm">
                          {(dashboardStats?.activity?.turnover || []).map((row, i) => (
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
                          {(dashboardStats?.activity?.grossMargin || []).map((row, i) => (
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
            <Button onClick={handleOpenModal} className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs py-2 px-4 rounded-xl flex items-center gap-2">
              <Plus size={16} /> New Article
            </Button>
          </div>
          
          {error && <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>}

          <div className="grid gap-4">
            {articles.length === 0 ? (
              <div className="text-center py-12 bg-[#111018]/30 rounded-2xl border border-white/5">
                <FileText size={32} className="mx-auto text-slate-600 mb-2" />
                <p className="text-xs text-slate-500">No articles available.</p>
              </div>
            ) : (
              articles.map((article) => (
                <div key={article.id} className="bg-[#111018]/50 border border-white/5 p-5 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1">
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
                  <div className="flex items-center gap-2">
                   <Badge variant={article.status === "published" ? "success" : article.status ==="review" ? "warning" : "info"} label={article.status} />
                   <button
                     onClick={() => handleDeleteArticle(article.id)}
                     disabled={isDeletingArticleId === article.id}
                     className="p-2 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 border-transparent hover:border-red-500/10 transition-colors disabled:opacity-50"
                   >
                    {isDeletingArticleId === article.id ? <Clock size={16} /> : <Trash2 size={16} />}
                   </button>
                   </div>
                </div>
              ))
            )}
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
            {blogPosts.map((post) => (
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

      {["articles", "blog", "users", "forex", "transactions", "notifications"].includes(activeTab) && (
        <div className="flex items-center justify-center gap-4 px-6 sm:px-8">
          <Button variant="outline" size="sm" disabled={pageIndex === 0 || loadingPage} onClick={() => setPageIndex(page => Math.max(0, page - 1))}>
            Previous
          </Button>
          <span className="text-xs text-slate-400">Page {pageIndex + 1}{loadingPage ? " · Loading" : ""}</span>
          <Button variant="outline" size="sm" disabled={!hasNextPage || loadingPage} onClick={() => setPageIndex(page => page + 1)}>
            Next
          </Button>
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

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#111018] p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Create Article</h3>
                  <p className="text-sm text-slate-400">Publish content for the website blog and educational sections.</p>
                </div>
                <button onClick={handleCloseModal} className="rounded-xl border border-white/10 p-2 text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Title</label>
                    <Input name="title" value={formDate.title} onChange={handleInputChange} className="bg-[#161520] border-white/5" placeholder="Article title" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Category</label>
                    <select name="category" value={formDate.category} onChange={handleInputChange} className="w-full rounded-xl border border-white/10 bg-[#161520] px-3 py-2.5 text-sm text-slate-200 outline-none">
                      <option value="Education">Education</option>
                      <option value="Analysis">Analysis</option>
                      <option value="Blog">Blog</option>
                      <option value="News">News</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Author</label>
                    <Input name="author" value={formDate.author} onChange={handleInputChange} className="bg-[#161520] border-white/5" placeholder="Author name" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Read Time</label>
                    <Input name="readTime" value={formDate.readTime} onChange={handleInputChange} className="bg-[#161520] border-white/5" placeholder="5 min" />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Excerpt</label>
                  <textarea name="excerpt" value={formDate.excerpt} onChange={handleInputChange} rows={3} className="w-full rounded-xl border border-white/10 bg-[#161520] px-3 py-2.5 text-sm text-slate-200 outline-none" placeholder="Short summary" />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">Content</label>
                  <textarea name="content" value={formDate.content} onChange={handleInputChange} rows={8} className="w-full rounded-xl border border-white/10 bg-[#161520] px-3 py-2.5 text-sm text-slate-200 outline-none" placeholder="Write article content" />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" onClick={handleCloseModal} className="border border-white/10 bg-white/5 text-slate-300">Cancel</Button>
                  <Button type="submit" disabled={isSubmittingArticle} className="bg-purple-600 hover:bg-purple-500 text-white">
                    {isSubmittingArticle ? "Creating..." : "Create Article"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
function resetForm() {
  throw new Error("Function not implemented.");
}

