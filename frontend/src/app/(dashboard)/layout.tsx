'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/dashboard/ui/sidebar';

import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  BarChart3,
  Settings,
  User,
  LogOut,
  Signal,
  LineChart,
  MessageSquare,
  Crown,
  ChevronUp,
  Search,
  Activity,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/dashboard/ui/dropdown-menu';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard/ui/avatar';
import { useAuthStore } from '@/store/authStore';

/* ============== Menu Configuration ============== */

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navigationItems: MenuItem[] = [
  { title: 'Dashboard', url: '/dashboard/user', icon: LayoutDashboard },
  { title: 'Signals', url: '/signals', icon: Signal },
  { title: 'Market Analysis', url: '/market-analysis', icon: LineChart },
];

const accountItems: MenuItem[] = [
  { title: 'Investments', url: '/dashboard/investments', icon: TrendingUp },
  { title: 'Transactions', url: '/dashboard/transactions', icon: Wallet },
];

const settingsItems: MenuItem[] = [
  { title: 'Profile', url: '/profile', icon: User },
  { title: 'Settings', url: '/settings', icon: Settings },
];

/* ============== Layout Component ============== */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const isActive = (url: string) => {
    if (url === '/dashboard/user') {
      return pathname === url || pathname === '/dashboard';
    }
    return pathname === url || pathname.startsWith(url + '/');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // For the investments page, render without sidebar (it has its own full-screen layout)
  const isInvestmentsPage = pathname?.includes('/dashboard/investments');
  if (isInvestmentsPage) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  const userName = user?.name || 'User';
  const userEmail = user?.email || 'user@empireofforex.com';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <SidebarProvider>
      {/* ===== SIDEBAR ===== */}
      <Sidebar
        collapsible="icon"
        className="bg-sidebar border-r border-sidebar-border/50"
      >

        {/* --- Header / Logo --- */}
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-sidebar-foreground tracking-tight">
                Empire Of
              </span>
              <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Forex
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* --- Main Navigation --- */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50 font-semibold">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                      size="default"
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          {/* --- Account --- */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50 font-semibold">
              Account
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {accountItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                      size="default"
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          {/* --- Settings --- */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50 font-semibold">
              Settings
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {settingsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                      size="default"
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* --- Footer / User Menu --- */}
        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.avatar} alt={userName} />
                      <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 text-white text-xs font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userName}
                      </span>
                      <span className="truncate text-xs text-sidebar-foreground/60">
                        {userEmail}
                      </span>
                    </div>
                    <ChevronUp className="ml-auto w-4 h-4 text-sidebar-foreground/40" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="top"
                  align="end"
                  sideOffset={4}
                >
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.avatar} alt={userName} />
                      <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 text-white text-xs font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userName}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {userEmail}
                      </span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {user?.role === 'premium' && (
                    <>
                      <DropdownMenuItem>
                        <Crown className="w-4 h-4 mr-2 text-amber-500" />
                        Premium Member
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={() => router.push('/profile')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push('/settings')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* ===== MAIN CONTENT AREA ===== */}
      <SidebarInset className="relative flex-1 min-w-0 md:ml-[var(--sidebar-width)] peer-data-[state=collapsed]:md:ml-[var(--sidebar-width-icon)] transition-[margin] duration-300 ease-in-out overflow-x-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-sidebar-border/50 bg-background/60 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
            <div className="h-4 w-px bg-sidebar-border/50 hidden sm:block" />
            <nav className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-muted-foreground">
              <span className="text-foreground/80 lowercase tracking-wider hidden sm:inline">Pages</span>
              <span className="text-foreground/20 hidden sm:inline">/</span>
              <span className="text-foreground lowercase tracking-widest truncate max-w-[100px] sm:max-w-none">
                {getPageTitle(pathname)}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-muted-foreground/30" />
              <input
                type="text"
                placeholder="Global Search..."
                className="bg-secondary/30 border border-sidebar-border/50 rounded-xl px-4 py-2 text-xs font-medium w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/40"
              />
            </div>
            <button className="p-2 rounded-xl bg-secondary/30 border border-sidebar-border/50 text-muted-foreground hover:text-primary transition-all duration-300">
              <Activity className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

/* ============== Helpers ============== */

function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    '/dashboard/user': 'Dashboard',
    '/dashboard': 'Dashboard',
    '/signals': 'Forex Signals',
    '/market-analysis': 'Market Analysis',
    '/dashboard/investments': 'Investments',
    '/dashboard/transactions': 'Transactions',
    '/dashboard/performance': 'Performance',
    '/profile': 'Profile',
    '/settings': 'Settings',
    '/testimonials': 'Testimonials',
  };

  // Check exact match first
  if (titles[pathname]) return titles[pathname];

  // Check prefix match
  for (const [path, title] of Object.entries(titles)) {
    if (pathname.startsWith(path)) return title;
  }

  return 'Dashboard';
}
