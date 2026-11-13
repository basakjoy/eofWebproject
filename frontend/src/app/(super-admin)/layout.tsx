'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PiggyBank,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRequireSuperAdmin } from '@/hooks/useRequireAuth';
import { useAuthStore } from '@/store/authStore';
import { useAdminHeartbeat, usePageTracker } from '@/hooks/useAdminSessionTracking';

const navigationGroups = [
  {
    label: 'Workspace',
    links: [
      { label: 'Overview', href: '/super-admin', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Admin Management',
    links: [
      { label: 'Administrators', href: '/super-admin#administrator-access', icon: ShieldCheck },
      { label: 'Create administrator', href: '/super-admin#create-administrator', icon: Users },
      { label: 'Access Logs', href: '/super-admin/access-logs', icon: Activity },
    ],
  },
  {
    label: 'Platform',
    links: [
      { label: 'User management', href: '/super-admin/users', icon: Users },
      { label: 'Analytics', href: '/super-admin/analytics', icon: BarChart3 },
      { label: 'Signal manager', href: '/super-admin/signals', icon: TrendingUp },
      { label: 'Investment controls', href: '/super-admin/investments', icon: PiggyBank },
    ],
  },
  {
    label: 'Content & partners',
    links: [
      { label: 'Articles', href: '/super-admin/articles', icon: FileText },
      { label: 'Brokers', href: '/super-admin/brokers', icon: BriefcaseBusiness },
    ],
  },
  {
    label: 'Operations',
    links: [
      { label: 'Deposit approvals', href: '/super-admin/deposits', icon: Wallet },
      { label: 'Client support', href: '/super-admin/support', icon: MessageSquare },
      { label: 'System logs', href: '/super-admin/logs', icon: Activity },
      { label: 'Admin activity', href: '/super-admin#activity', icon: Activity },
    ],
  },
];

const getPageTitle = (pathname: string): string => {
  for (const group of navigationGroups) {
    const activeLink = group.links.find((link) => link.href === pathname);
    if (activeLink) return activeLink.label;
  }
  return 'Control center';
};

function Navigation({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Super-admin navigation" className="space-y-7 px-3 py-6">
      {navigationGroups.map((group) => (
        <div key={group.label}>
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {group.label}
          </p>
          <div className="mt-2 space-y-1">
            {group.links.map(({ label, href, icon: Icon }) => {
              const isAnchor = href.includes('#');
              const active = !isAnchor && (
                pathname === href || (href !== '/super-admin' && pathname.startsWith(`${href}/`))
              );
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 ${
                    active
                      ? 'bg-amber-300/10 text-amber-200'
                      : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthorized } = useRequireSuperAdmin();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  usePageTracker();
  useAdminHeartbeat();
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  useEffect(() => {
    if (!mobileNavigationOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileNavigationOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [mobileNavigationOpen]);

  if (!isAuthorized) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#080b12] text-sm text-slate-400"
        role="status"
      >
        Checking super-admin access…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 lg:flex">
      <a
        href="#main-content"
        className="sr-only z-[60] rounded-md bg-amber-300 px-4 py-3 font-semibold text-slate-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#0b1019] lg:flex lg:flex-col">
        <Link
          href="/super-admin"
          className="flex h-[76px] items-center gap-3 border-b border-white/10 px-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10 text-amber-300">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-bold text-white">Empire of Forex</span>
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">
              Owner workspace
            </span>
          </span>
        </Link>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Navigation pathname={pathname} />
        </div>
        <div className="border-t border-white/10 p-4">
          <p className="truncate px-2 text-xs font-medium text-slate-200">
            {user?.name || user?.username || 'Super admin'}
          </p>
          <p className="mt-1 px-2 text-[11px] text-slate-500">Super administrator</p>
          <button
            type="button"
            onClick={() => void logout()}
            className="mt-3 flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-400 transition-colors hover:bg-rose-400/10 hover:text-rose-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#080b12]/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-h-11 items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileNavigationOpen(true)}
                aria-label="Open super-admin navigation"
                aria-expanded={mobileNavigationOpen}
                aria-controls="super-admin-mobile-navigation"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 lg:hidden"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{getPageTitle(pathname)}</p>
                <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
                  Empire of Forex <span className="px-1.5 text-slate-700">/</span> Owner workspace
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden="true" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-200 sm:text-xs">
                Super admin
              </span>
            </div>
          </div>
        </header>

        <main id="main-content" className="min-h-[calc(100dvh-4.25rem)]">
          {children}
        </main>
      </div>

      {mobileNavigationOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close super-admin navigation"
            onClick={() => setMobileNavigationOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/60"
          />
          <aside
            id="super-admin-mobile-navigation"
            className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col border-r border-white/10 bg-[#0b1019] shadow-2xl"
          >
            <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-5">
              <Link
                href="/super-admin"
                onClick={() => setMobileNavigationOpen(false)}
                className="flex items-center gap-3"
              >
                <ShieldCheck className="h-5 w-5 text-amber-300" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-bold text-white">Owner workspace</span>
                  <span className="block text-[10px] uppercase tracking-[0.16em] text-amber-300">
                    Super admin
                  </span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileNavigationOpen(false)}
                aria-label="Close navigation"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <Navigation
                pathname={pathname}
                onNavigate={() => setMobileNavigationOpen(false)}
              />
            </div>
            <div className="border-t border-white/10 p-4">
              <p className="truncate px-2 text-xs font-medium text-slate-200">
                {user?.name || user?.username || 'Super admin'}
              </p>
              <button
                type="button"
                onClick={() => void logout()}
                className="mt-2 flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-slate-400 hover:bg-rose-400/10 hover:text-rose-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
