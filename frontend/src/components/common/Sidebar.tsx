
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  BookOpen,
  GraduationCap,
  Users,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Wallet,
  Bell,
  LogOut,
  Grid3x3,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

/* ---------------- MENU CONFIG ---------------- */

const baseItems = [
  { id: "overview", icon: LayoutDashboard, label: "Overview", path: "/admin?tab=overview" },
];

const mainMenuItems = [
  { id: "forex-signals", icon: BarChart3, label: "Forex Signals", path: "/admin?tab=forex" },
  { id: "articles", icon: Newspaper, label: "Articles", path: "/admin?tab=articles" },
  { id: "blog", icon: FileText, label: "Blog", path: "/admin?tab=blog" },
  { id: "education", icon: BookOpen, label: "Education", path: "/admin?tab=education" },
  { id: "transactions", icon: Wallet, label: "Transactions", path: "/admin?tab=transactions" },
];

const administrationItems = [
  { id: "users", icon: Users, label: "User Management", path: "/admin?tab=users" },
  { id: "roles", icon: Shield, label: "Roles & Permissions", path: "/admin?tab=overview" },
  { id: "notifications", icon: Bell, label: "Notifications", path: "/admin?tab=notifications" },
  { id: "settings", icon: Settings, label: "Settings", path: "/admin?tab=settings" },
];

const investorItems = [
  { id: "investments", icon: TrendingUp, label: "Investments", path: "/dashboard/investments" },
  { id: "trans-inv", icon: Wallet, label: "Transactions", path: "/dashboard/transactions" },
  { id: "performance", icon: BarChart3, label: "Performance", path: "/dashboard/performance" },
];

const premiumItems = [
  { id: "signals-prem", icon: TrendingUp, label: "Signals", path: "/signals" },
  { id: "market-analysis", icon: BarChart3, label: "Market Analysis", path: "/market-analysis" },
  { id: "education-prem", icon: BookOpen, label: "Education", path: "/education" },
];

/* ---------------- COMPONENT ---------------- */

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  const getMenuItems = () => {
    // If on admin page, always show admin items
    if (pathname.startsWith("/admin")) {
      return [...baseItems, ...mainMenuItems, ...administrationItems];
    }

    if (!user) return baseItems;

    switch (user.role) {
      case "admin":
        return [...baseItems, ...mainMenuItems, ...administrationItems];
      case "investor":
        return [...baseItems, ...investorItems];
      case "premium":
        return [...baseItems, ...premiumItems];
      default:
        return baseItems;
    }
  };

  const items = getMenuItems();

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        "fixed left-0 top-0 z-40 md:sticky md:top-0",
        collapsed ? "w-16 sm:w-20" : "w-56 sm:w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 border-b border-gray-200">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div> */}
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display font-bold text-xs sm:text-sm text-gray-900 truncate">
                Empire Of
              </p>
              <p className="font-display font-bold text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Forex
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onToggle}
          className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900 flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] py-3 sm:py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="px-2 sm:px-3 space-y-0.5 sm:space-y-1">
          {/* Render all base items first (Overview) */}
          {items.slice(0, 1).map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base",
                "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                isActive(item.path) &&
                  "bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium",
                collapsed && "justify-center px-2 sm:px-3 gap-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          ))}

          {/* Main Menu Section */}
          {!collapsed && items.length > 1 && (
            <span className="px-2 sm:px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider block py-2 mt-4">
              Main Menu
            </span>
          )}

          {items.slice(1, 1 + mainMenuItems.length).map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base",
                "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                isActive(item.path) &&
                  "bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium",
                collapsed && "justify-center px-2 sm:px-3 gap-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          ))}

          {/* Administration Section */}
          {!collapsed && items.length > 1 + mainMenuItems.length && (
            <span className="px-2 sm:px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider block py-2 mt-4">
              Administration
            </span>
          )}

          {items.slice(1 + mainMenuItems.length).map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base",
                "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                isActive(item.path) &&
                  "bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium",
                collapsed && "justify-center px-2 sm:px-3 gap-0"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* User Info */}
        {!collapsed && user && (
          <div className="mt-auto px-2 sm:px-3 space-y-2 sm:space-y-3 border-t border-gray-200 pt-3 sm:pt-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-3 sm:p-4 border border-blue-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                    {user.role.toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-600">
                    Admin
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </nav>
    </aside>
  );
}
