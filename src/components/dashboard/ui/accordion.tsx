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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin" },
  { icon: TrendingUp, label: "Forex Signals", path: "/admin/signals" },
  { icon: BarChart3, label: "Market Insights", path: "/admin/insights" },
  { icon: FileText, label: "Articles", path: "/admin/articles" },
  { icon: BookOpen, label: "Blog", path: "/admin/blog" },
  { icon: GraduationCap, label: "Education", path: "/admin/education" },
  { icon: Wallet, label: "Transactions", path: "/admin/transactions" },
];

const adminItems = [
  { icon: Users, label: "User Management", path: "/admin/users" },
  { icon: Shield, label: "Roles & Permissions", path: "/admin/roles" },
  { icon: Bell, label: "Notifications", path: "/admin/notifications" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-lg text-foreground">
              ForexPro
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col h-[calc(100vh-4rem)] py-4 overflow-y-auto scrollbar-thin">
        <div className="px-3 space-y-1">
          {!collapsed && (
            <span className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Main Menu
            </span>
          )}

          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "nav-item",
                isActive(item.path) && "active",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>

        <div className="mt-6 px-3 space-y-1">
          {!collapsed && (
            <span className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Administration
            </span>
          )}

          {adminItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "nav-item",
                isActive(item.path) && "active",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* User Badge */}
        {!collapsed && (
          <div className="mt-auto px-3">
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Super Admin
                  </p>
                  <p className="text-xs text-muted-foreground">Full Access</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}
