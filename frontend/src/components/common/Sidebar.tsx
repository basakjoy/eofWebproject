"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  BookOpen,
  Users,
  Settings,
  Shield,
  ChevronLeft,
  ChevronDown,
  BarChart3,
  Wallet,
  Bell,
  LogOut,
  Grid3x3,
  Newspaper,
  Activity,
  Layers,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { LogoIcon } from "./LogoIcon";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface SubItem {
  id: string;
  label: string;
  path: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  badge?: number | string;
  subItems: SubItem[];
}

/* ---------------- MENU CONFIGS BY ROLE ---------------- */

const adminMenuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "DASHBOARD",
    icon: LayoutDashboard,
    subItems: [
      { id: "overview", label: "Overview", path: "/admin?tab=overview" },
      { id: "traffic", label: "Traffic", path: "/admin?tab=traffic" },
      { id: "analytics", label: "Analytics", path: "/admin?tab=traffic" },
    ],
  },
  {
    id: "member",
    label: "MEMBER",
    icon: Users,
    subItems: [
      { id: "users", label: "User Management", path: "/admin?tab=users" },
      { id: "roles", label: "Roles & Permissions", path: "/admin?tab=overview" },
    ],
  },
  {
    id: "payment",
    label: "PAYMENT",
    icon: Wallet,
    subItems: [
      { id: "transactions", label: "Transactions", path: "/admin?tab=transactions" },
      { id: "forex", label: "Forex Signals", path: "/admin?tab=forex" },
    ],
  },
  {
    id: "marketing",
    label: "MARKETING",
    icon: FileText,
    subItems: [
      { id: "articles", label: "Articles", path: "/admin?tab=articles" },
      { id: "blog", label: "Blog Insights", path: "/admin?tab=blog" },
      { id: "education", label: "Education", path: "/admin?tab=education" },
    ],
  },
  {
    id: "report",
    label: "REPORT",
    icon: BarChart3,
    subItems: [
      { id: "reports", label: "Financial Reports", path: "/admin?tab=overview" },
      { id: "logs", label: "System Logs", path: "/admin?tab=overview" },
      { id: "notifications", label: "Notifications", path: "/admin?tab=notifications" },
    ],
  },
  {
    id: "affiliate",
    label: "AFFILIATE",
    icon: Layers,
    badge: 3, // Custom Affiliate count badge as seen in screenshots
    subItems: [
      { id: "affiliate-list", label: "Affiliate List", path: "/admin?tab=overview" },
      { id: "commission", label: "Commission Stats", path: "/admin?tab=overview" },
    ],
  },
  {
    id: "referral",
    label: "REFERRAL",
    icon: TrendingUp,
    subItems: [
      { id: "referral-tree", label: "Referral Tree", path: "/admin?tab=overview" },
      { id: "referral-earnings", label: "Referral Earnings", path: "/admin?tab=overview" },
      { id: "settings", label: "Settings", path: "/admin?tab=settings" },
    ],
  },
];

const investorMenuItems: MenuItem[] = [
  {
    id: "investor-dashboard",
    label: "DASHBOARD",
    icon: LayoutDashboard,
    subItems: [
      { id: "overview", label: "Overview", path: "/admin?tab=overview" }
    ]
  },
  {
    id: "investments",
    label: "INVESTMENTS",
    icon: TrendingUp,
    subItems: [
      { id: "invest-list", label: "My Investments", path: "/dashboard/investments" },
      { id: "performance", label: "Performance", path: "/dashboard/performance" }
    ]
  },
  {
    id: "wallet",
    label: "WALLET",
    icon: Wallet,
    subItems: [
      { id: "trans", label: "Transactions", path: "/dashboard/transactions" }
    ]
  }
];

const premiumMenuItems: MenuItem[] = [
  {
    id: "premium-dashboard",
    label: "DASHBOARD",
    icon: LayoutDashboard,
    subItems: [
      { id: "overview", label: "Overview", path: "/admin?tab=overview" }
    ]
  },
  {
    id: "signals",
    label: "SIGNALS",
    icon: TrendingUp,
    subItems: [
      { id: "active-signals", label: "Forex Signals", path: "/signals" },
      { id: "analysis", label: "Market Analysis", path: "/market-analysis" }
    ]
  },
  {
    id: "education",
    label: "EDUCATION",
    icon: BookOpen,
    subItems: [
      { id: "courses", label: "Premium Education", path: "/education" }
    ]
  }
];

/* ---------------- COMPONENT ---------------- */

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    dashboard: true, // Default open
    member: false,
    payment: false,
    marketing: false,
    report: false,
    affiliate: false,
    referral: false,
  });

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const getMenuItems = (): MenuItem[] => {
    if (pathname.startsWith("/admin")) {
      return adminMenuItems;
    }

    if (!user) return adminMenuItems;

    switch (user.role) {
      case "admin":
        return adminMenuItems;
      case "investor":
        return investorMenuItems;
      case "premium":
        return premiumMenuItems;
      default:
        return adminMenuItems;
    }
  };

  const items = getMenuItems();

  // Helper to check if any child item is active
  const isMenuGroupActive = (menu: MenuItem) => {
    return menu.subItems.some((sub) => pathname === sub.path || (pathname.startsWith("/admin") && sub.path.includes(`tab=${pathname.split("=")[1]}`)));
  };

  const isSubItemActive = (subPath: string) => {
    // If the path contains query parameters, match those too
    if (subPath.includes("?tab=")) {
      const tabName = subPath.split("?tab=")[1];
      const search = typeof window !== "undefined" ? window.location.search : "";
      return search.includes(`tab=${tabName}`);
    }
    return pathname === subPath;
  };

  return (
    <aside
      className={cn(
        "h-screen glass-morphism-sidebar transition-all duration-300 flex flex-col z-40 md:sticky md:top-0",
        "fixed left-0 top-0 border-r border-white/5 bg-background/90 backdrop-blur-xl shadow-2xl",
        collapsed ? "w-16 sm:w-20" : "w-64 sm:w-72"
      )}
    >
      {/* Logo Section */}
      <div className="flex h-16 sm:h-20 items-center justify-between px-4 sm:px-5 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-gradient-to-tr from-primary/30 to-primary/10 rounded-xl p-[1px] border border-primary/20">
            <LogoIcon size={36} rounded />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="min-w-0"
            >
              <p className="font-display font-bold text-sm tracking-tight text-white leading-tight">
                EMPIRE OF
              </p>
              <p className="font-display font-black text-sm text-primary">
                FOREX
              </p>
            </motion.div>
          )}
        </div>

        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-slate-400 hover:text-white flex-shrink-0 border border-transparent hover:border-white/10"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          ) : (
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4 sm:py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent space-y-1 sm:space-y-1.5 px-3">
        {items.map((menu) => {
          const isOpen = expandedMenus[menu.id];
          const isGroupActive = isMenuGroupActive(menu);

          return (
            <div key={menu.id} className="space-y-1">
              {/* Accordion Trigger Header */}
              <button
                onClick={() => toggleMenu(menu.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl transition-all duration-200 group text-left",
                  "text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent",
                  isGroupActive && "bg-white/[0.02] text-white border-white/[0.03] shadow-md shadow-black/10",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? menu.label : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <menu.icon
                    className={cn(
                      "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
                      isGroupActive ? "text-primary" : "text-slate-400"
                    )}
                  />
                  {!collapsed && (
                    <span className="text-xs sm:text-sm font-semibold tracking-wide font-display">
                      {menu.label}
                    </span>
                  )}
                </div>

                {!collapsed && (
                  <div className="flex items-center gap-2">
                    {/* Affiliate Badge */}
                    {menu.badge && (
                      <span className="bg-red-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-red-500/20">
                        {menu.badge}
                      </span>
                    )}
                    {/* Arrow / Chevron */}
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-slate-500 transition-transform duration-300",
                        isOpen ? "transform rotate-0" : "transform -rotate-90 text-slate-400"
                      )}
                    />
                  </div>
                )}
              </button>

              {/* Submenu Accordion Items */}
              <AnimatePresence initial={false}>
                {isOpen && !collapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden pl-7 sm:pl-8 pr-1 space-y-0.5 border-l border-white/5 ml-5 sm:ml-6 mt-1"
                  >
                    {menu.subItems.map((sub) => {
                      const active = isSubItemActive(sub.path);
                      return (
                        <Link
                          key={sub.id}
                          href={sub.path}
                          className={cn(
                            "flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm transition-all duration-200",
                            "text-slate-400 hover:text-white hover:bg-white/[0.02]",
                            active &&
                              "text-primary bg-primary/10 border-l-2 border-primary font-medium pl-3 shadow-inner shadow-primary/5"
                          )}
                        >
                          <span className="truncate">{sub.label}</span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* User Footer / Profile area */}
      {!collapsed && user && (
        <div className="p-4 sm:p-5 border-t border-white/5 bg-white/[0.01] space-y-3 sm:space-y-4">
          <div className="bg-background rounded-2xl p-3 sm:p-4 border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-white truncate leading-snug">
                {user.role.toUpperCase()}
              </p>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">
                Authorized Admin
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 rounded-xl transition-all duration-200 text-xs sm:text-sm font-semibold"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Logout Account</span>
          </button>
        </div>
      )}
    </aside>
  );
}
