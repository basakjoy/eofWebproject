'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  TrendingUp,
  DollarSign,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  Grid3x3,
  Newspaper,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeColors } from '@/lib/themeColors';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'overview', icon: LayoutDashboard, label: 'Dashboard', path: '/admin?tab=overview' },
  { id: 'users', icon: Users, label: 'User Management', path: '/admin?tab=users' },
  { id: 'articles', icon: Newspaper, label: 'Articles', path: '/admin?tab=articles' },
  { id: 'blog', icon: FileText, label: 'Blog', path: '/admin?tab=blog' },
  { id: 'education', icon: BookOpen, label: 'Education', path: '/admin?tab=education' },
  { id: 'signals', icon: TrendingUp, label: 'Trading Signals', path: '/admin?tab=signals' },
  { id: 'transactions', icon: DollarSign, label: 'Transactions', path: '/admin?tab=transactions' },
  { id: 'notifications', icon: Bell, label: 'Notifications', path: '/admin?tab=notifications' },
  { id: 'settings', icon: Settings, label: 'Settings', path: '/admin?tab=settings' },
];

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';
  const colors = useThemeColors();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  const isActive = (itemId: string) => {
    return currentTab === itemId;
  };

  return (
    <aside
      className={cn(
        'h-screen border-r transition-all duration-300 flex flex-col fixed left-0 top-0 z-40',
        collapsed ? 'w-16 sm:w-20' : 'w-56 sm:w-64'
      )}
      style={{ borderColor: colors.border, backgroundColor: colors.bg.card }}
    >
      {/* Logo/Header */}
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 border-b" style={{ borderColor: colors.border }}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-bold text-xs sm:text-sm transition-colors duration-300" style={{ color: colors.text.primary }}>
                Empire Of
              </p>
              <p className="font-bold text-xs sm:text-sm bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                Admin
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onToggle}
          className="p-1.5 sm:p-2 rounded-lg transition-colors flex-shrink-0"
          style={{ color: colors.text.secondary }}
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
      <nav className="flex flex-col h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] py-3 sm:py-4 overflow-y-auto">
        <div className="px-2 sm:px-3 space-y-0.5 sm:space-y-1 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                const url = `/admin?tab=${item.id}`;
                router.push(url);
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base',
                isActive(item.id)
                  ? 'font-medium'
                  : '',
                collapsed && 'justify-center px-2 sm:px-3 gap-0'
              )}
              style={{
                color: isActive(item.id) ? '#dc2626' : colors.text.secondary,
                backgroundColor: isActive(item.id) ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
              }}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <div className="px-2 sm:px-3 border-t space-y-2 sm:space-y-3 pt-3 sm:pt-4" style={{ borderColor: colors.border }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all text-sm"
            style={{ color: colors.text.secondary }}
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
}
