'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LogoIcon } from '@/components/common/LogoIcon';
import { useAuthStore } from '@/store/authStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import Link from 'next/link';
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Settings,
  User,
  LogOut,
  Signal,
  LineChart,
  Crown,
  ChevronUp,
  Search,
  Activity,
  ChevronRight,
  ChevronLeft,
  Bell,
  Menu,
  X,
} from 'lucide-react';

// ─── Config ───────────────────────────────────────────────────────────────────

const MENU_GROUPS = {
  navigation: [
    { title: 'Dashboard',       url: '/dashboard/user',          icon: LayoutDashboard,  isPremium: false },
    { title: 'Signals',         url: '/signals',                  icon: Signal,           isPremium: false },
    { title: 'Market Analysis', url: '/market-analysis',          icon: LineChart,        isPremium: false },
  ],
  account: [
    { title: 'Premium Dashboard', url: '/dashboard/premium',       icon: Crown,            isPremium: true },
    { title: 'Investments',       url: '/dashboard/investments',   icon: TrendingUp,       isPremium: false },
    { title: 'Transactions',      url: '/dashboard/transactions',  icon: Wallet,           isPremium: false },
  ],
  settings: [
    { title: 'Profile',  url: '/profile',  icon: User,     isPremium: false },
    { title: 'Settings', url: '/settings', icon: Settings, isPremium: false },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isRouteActive(itemUrl: string, pathname: string): boolean {
  if (itemUrl === '/dashboard/user') {
    return pathname === '/dashboard/user' || pathname === '/dashboard';
  }
  return pathname === itemUrl || pathname.startsWith(itemUrl + '/');
}

function getPageTitle(pathname: string): string {
  const all = Object.values(MENU_GROUPS).flat();
  return all.find(i => isRouteActive(i.url, pathname))?.title ?? 'Dashboard';
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useRequireAuth();
  const { logout } = useAuthStore();

  const [collapsed, setCollapsed]       = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close user menu when sidebar collapses
  useEffect(() => { if (collapsed) setUserMenuOpen(false); }, [collapsed]);
  // Close mobile sidebar on route change
  useEffect(() => { setMobileSidebarOpen(false); }, [pathname]);

  const displayUser = {
    name:   user?.name  || 'User',
    email:  user?.email || '',
    avatar: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=FF6B00&color=fff&bold=true`,
  };

  return (
    <div className="flex h-screen w-full bg-[#050508] text-white font-sans overflow-hidden">

      {/* ══════════════════════════════════════════════════════
          SIDEBAR — Desktop
      ══════════════════════════════════════════════════════ */}
      <aside
        className={`hidden lg:flex relative flex-col bg-[#0C0C10] border-r border-white/[0.06] transition-all duration-300 ease-in-out z-40 ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-white/[0.06] shrink-0 overflow-hidden ${collapsed ? 'px-4 justify-center' : 'px-5 gap-3'}`}>
          <LogoIcon size={36} />
          {!collapsed && (
            <div className="flex flex-col whitespace-nowrap animate-in fade-in slide-in-from-left-2">
              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-white/25 leading-none">Empire Of</span>
              <span className="text-base font-black text-[#FF6B00] tracking-tight leading-snug">FOREX</span>
            </div>
          )}
        </div>

        {/* Nav Groups */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6 scrollbar-hide">
          {Object.entries(MENU_GROUPS).map(([group, items]) => (
            <div key={group} className="space-y-1">
              {!collapsed && (
                <p className="px-3 mb-2 text-[9px] font-black uppercase tracking-[0.22em] text-white/20">
                  {group}
                </p>
              )}
              {items.map(item => {
                const active = isRouteActive(item.url, pathname);
                return (
                  <Link
                    key={item.url}
                    href={item.url}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      collapsed ? 'justify-center' : 'justify-start'
                    } ${
                      active
                        ? 'bg-[#FF6B00]/10 text-[#FF6B00]'
                        : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                    }`}
                  >
                    {/* Active left accent */}
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#FF6B00] rounded-r-full" />
                    )}
                    <item.icon className={`w-[18px] h-[18px] shrink-0 transition-transform group-hover:scale-110 ${
                      item.isPremium && !active ? 'text-amber-400' : ''
                    }`} />
                    {!collapsed && (
                      <span className="text-sm font-semibold whitespace-nowrap">{item.title}</span>
                    )}
                    {!collapsed && item.isPremium && (
                      <span className="ml-auto text-[9px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                        VIP
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-white/[0.06] relative">
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3.5 top-[-14px] flex items-center justify-center w-7 h-7 bg-[#0C0C10] border border-white/[0.1] rounded-full text-white/30 hover:text-white/80 hover:border-white/20 shadow-lg transition-all"
          >
            <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>

          {/* User button */}
          <button
            onClick={() => !collapsed && setUserMenuOpen(!userMenuOpen)}
            className={`flex items-center w-full p-2 rounded-xl transition-all duration-200 ${
              userMenuOpen ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'
            } ${collapsed ? 'justify-center' : 'justify-between'}`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src={displayUser.avatar}
                alt="User"
                className="w-8 h-8 rounded-xl object-cover border border-white/10 flex-shrink-0"
              />
              {!collapsed && (
                <div className="flex flex-col text-left whitespace-nowrap min-w-0">
                  <span className="text-sm font-bold text-white truncate">{displayUser.name}</span>
                  <span className="text-[10px] text-white/25 truncate">{displayUser.email}</span>
                </div>
              )}
            </div>
            {!collapsed && (
              <ChevronUp className={`w-3.5 h-3.5 text-white/25 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
            )}
          </button>

          {/* Dropdown */}
          {userMenuOpen && !collapsed && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#111116] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 duration-150">
              <Link href="/profile" className="flex items-center gap-2.5 px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors">
                <User className="w-4 h-4" /> Profile
              </Link>
              <Link href="/settings" className="flex items-center gap-2.5 px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <div className="border-t border-white/[0.06]" />
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════
          SIDEBAR — Mobile Overlay
      ══════════════════════════════════════════════════════ */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#0C0C10] border-r border-white/[0.06] flex flex-col animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <LogoIcon size={34} />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.22em] text-white/25">Empire Of</span>
                  <span className="text-base font-black text-[#FF6B00]">FOREX</span>
                </div>
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-2 text-white/30 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Nav */}
            <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6 scrollbar-hide">
              {Object.entries(MENU_GROUPS).map(([group, items]) => (
                <div key={group} className="space-y-1">
                  <p className="px-3 mb-2 text-[9px] font-black uppercase tracking-[0.22em] text-white/20">{group}</p>
                  {items.map(item => {
                    const active = isRouteActive(item.url, pathname);
                    return (
                      <Link
                        key={item.url}
                        href={item.url}
                        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                          active
                            ? 'bg-[#FF6B00]/10 text-[#FF6B00]'
                            : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                        }`}
                      >
                        {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#FF6B00] rounded-r-full" />}
                        <item.icon className="w-[18px] h-[18px] shrink-0" />
                        <span className="text-sm font-semibold">{item.title}</span>
                        {item.isPremium && <span className="ml-auto text-[9px] font-black text-amber-400">VIP</span>}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
            {/* Footer */}
            <div className="p-4 border-t border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={displayUser.avatar} alt="User" className="w-8 h-8 rounded-xl border border-white/10" />
                <div>
                  <p className="text-sm font-bold text-white">{displayUser.name}</p>
                  <p className="text-[10px] text-white/25">{displayUser.email}</p>
                </div>
              </div>
              <button onClick={() => logout()} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#050508] overflow-hidden">

        {/* Top Header */}
        <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-[#0C0C10]/80 backdrop-blur-xl border-b border-white/[0.06] sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-white/40 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
              <span className="text-white/20">Pages</span>
              <ChevronRight className="w-3 h-3 text-white/10" />
              <span className="text-white/70">{getPageTitle(pathname)}</span>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-3 w-3.5 h-3.5 text-white/20" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-white/[0.04] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/20 w-52 focus:outline-none focus:border-[#FF6B00]/30 focus:bg-white/[0.06] transition-all"
              />
            </div>
            {/* Notification bell */}
            <button className="relative p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white hover:border-white/[0.12] transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FF6B00] rounded-full" />
            </button>
            {/* Activity */}
            <button className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white hover:border-white/[0.12] transition-all hidden sm:block">
              <Activity className="w-4 h-4" />
            </button>
            {/* Avatar */}
            <img
              src={displayUser.avatar}
              alt="User"
              className="w-8 h-8 rounded-xl border border-white/10 cursor-pointer hover:border-[#FF6B00]/40 transition-colors"
            />
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}