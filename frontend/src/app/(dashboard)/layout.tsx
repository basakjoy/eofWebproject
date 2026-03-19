  // 'use client';

  // import { usePathname, useRouter } from 'next/navigation';
  // import Link from 'next/link';
  // import {
  //   Sidebar,
  //   SidebarContent,
  //   SidebarFooter,
  //   SidebarGroup,
  //   SidebarGroupContent,
  //   SidebarGroupLabel,
  //   SidebarHeader,
  //   SidebarInset,
  //   SidebarMenu,
  //   SidebarMenuButton,
  //   SidebarMenuItem,
  //   SidebarProvider,
  //   SidebarRail,
  //   SidebarSeparator,   
  //   SidebarTrigger,
  // } from '@/components/dashboard/ui/sidebar';

  // import {
  //   LayoutDashboard,
  //   TrendingUp,
  //   Wallet,
  //   BarChart3,
  //   Settings,
  //   User,
  //   LogOut,
  //   Signal,
  //   LineChart,
  //   MessageSquare,
  //   Crown,
  //   ChevronUp,
  //   Search,
  //   Activity,
  // } from 'lucide-react';

  // import {
  //   DropdownMenu,
  //   DropdownMenuContent,
  //   DropdownMenuItem,
  //   DropdownMenuSeparator,
  //   DropdownMenuTrigger,
  // } from '@/components/dashboard/ui/dropdown-menu';

  // import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard/ui/avatar';
  // import { useAuthStore } from '@/store/authStore';
  // import { LogoIcon } from '@/components/common/LogoIcon';

  // /* ============== Menu Configuration ============== */

  // interface MenuItem {
  //   title: string;
  //   url: string;
  //   icon: React.ComponentType<{ className?: string }>;
  //   badge?: string;
  // }

  // const navigationItems: MenuItem[] = [
  //   { title: 'Dashboard', url: '/dashboard/user', icon: LayoutDashboard },
  //   { title: 'Signals', url: '/signals', icon: Signal },
  //   { title: 'Market Analysis', url: '/market-analysis', icon: LineChart },
  // ];

  // const accountItems: MenuItem[] = [
  //   { title:"Premium Dashboard", url: '/dashboard/premium', icon: Crown },
  //   { title: 'Investments', url: '/dashboard/investments', icon: TrendingUp },
  //   { title: 'Transactions', url: '/dashboard/transactions', icon: Wallet },
  // ];

  // const settingsItems: MenuItem[] = [
  //   { title: 'Profile', url: '/profile', icon: User },
  //   { title: 'Settings', url: '/settings', icon: Settings },
  // ];

  // /* ============== Layout Component ============== */

  // export default function DashboardLayout({
  //   children,
  // }: {
  //   children: React.ReactNode;
  // }) {
  //   const pathname = usePathname();
  //   const router = useRouter();
  //   const { user, logout } = useAuthStore();

  //   const isActive = (url: string) => {
  //     if (url === '/dashboard/user') {
  //       return pathname === url || pathname === '/dashboard';
  //     }
  //     return pathname === url || pathname.startsWith(url + '/');
  //   };

  //   const handleLogout = () => {
  //     logout();
  //     router.push('/');
  //   };

  //   // For the investments page, render without sidebar (it has its own full-screen layout)
  //   const isInvestmentsPage = pathname?.includes('/dashboard/investments');
  //   if (isInvestmentsPage) {
  //     return <div className="min-h-screen bg-background">{children}</div>;
  //   }

  //   const userName = user?.name || 'User';
  //   const userEmail = user?.email || 'user@empireofforex.com';
  //   const userInitials = userName
  //     .split(' ')
  //     .map((n) => n[0])
  //     .join('')
  //     .toUpperCase()
  //     .slice(0, 2);

  //   return (
  //     <SidebarProvider>
  //       {/* ===== SIDEBAR ===== */}
  //       <Sidebar
  //         collapsible="icon"
  //         className="bg-sidebar border-r border-sidebar-border/50"
  //       >

  //         {/* --- Header / Logo --- */}
  //         <SidebarHeader className="border-b border-sidebar-border">
  //           <div className="flex items-center gap-3 px-3 py-3">
  //             <div className="">
              
  //               <LogoIcon size={32} rounded />
  //             </div>
  //             <div className="flex flex-col leading-tight">
  //               <span className="text-sm font-bold text-sidebar-foreground tracking-tight">
  //                 Empire Of Forex
  //               </span>
                
  //             </div>
  //           </div>
  //         </SidebarHeader>

  //         <SidebarContent>
  //           {/* --- Main Navigation --- */}
  //           <SidebarGroup>
  //             <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50 font-semibold">
  //               Navigation
  //             </SidebarGroupLabel>
  //             <SidebarGroupContent>
  //               <SidebarMenu>
  //                 {navigationItems.map((item) => (
  //                   <SidebarMenuItem key={item.title}>
  //                     <SidebarMenuButton
  //                       asChild
  //                       isActive={isActive(item.url)}
  //                       tooltip={item.title}
  //                       size="default"
  //                     >
  //                       <Link
  //                         href={item.url}
  //                         className="flex items-center gap-3"
  //                       >
  //                         <item.icon className="w-4 h-4" />
  //                         <span>{item.title}</span>
  //                       </Link>
  //                     </SidebarMenuButton>
  //                   </SidebarMenuItem>
  //                 ))}
  //               </SidebarMenu>
  //             </SidebarGroupContent>
  //           </SidebarGroup>

  //           <SidebarSeparator />

  //           {/* --- Account --- */}
  //           <SidebarGroup>
  //             <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50 font-semibold">
  //               Account
  //             </SidebarGroupLabel>
  //             <SidebarGroupContent>
  //               <SidebarMenu>
  //                 {accountItems.map((item) => (
  //                   <SidebarMenuItem key={item.title}>
  //                     <SidebarMenuButton
  //                       asChild
  //                       isActive={isActive(item.url)}
  //                       tooltip={item.title}
  //                       size="default"
  //                     >
  //                       <Link
  //                         href={item.url}
  //                         className="flex items-center gap-3"
  //                       >
  //                         <item.icon className="w-4 h-4" />
  //                         <span>{item.title}</span>
  //                       </Link>
  //                     </SidebarMenuButton>
  //                   </SidebarMenuItem>
  //                 ))}
  //               </SidebarMenu>
  //             </SidebarGroupContent>
  //           </SidebarGroup>

  //           <SidebarSeparator />

  //           {/* --- Settings --- */}
  //           <SidebarGroup>
  //             <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/50 font-semibold">
  //               Settings
  //             </SidebarGroupLabel>
  //             <SidebarGroupContent>
  //               <SidebarMenu>
  //                 {settingsItems.map((item) => (
  //                   <SidebarMenuItem key={item.title}>
  //                     <SidebarMenuButton
  //                       asChild
  //                       isActive={isActive(item.url)}
  //                       tooltip={item.title}
  //                       size="default"
  //                     >
  //                       <Link
  //                         href={item.url}
  //                         className="flex items-center gap-3"
  //                       >
  //                         <item.icon className="w-4 h-4" />
  //                         <span>{item.title}</span>
  //                       </Link>
  //                     </SidebarMenuButton>
  //                   </SidebarMenuItem>
  //                 ))}
  //               </SidebarMenu>
  //             </SidebarGroupContent>
  //           </SidebarGroup>
  //         </SidebarContent>

  //         {/* --- Footer / User Menu --- */}
  //         <SidebarFooter className="border-t border-sidebar-border">
  //           <SidebarMenu>
  //             <SidebarMenuItem>
  //               <DropdownMenu>
  //                 <DropdownMenuTrigger asChild>
  //                   <SidebarMenuButton
  //                     size="lg"
  //                     className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
  //                   >
  //                     <Avatar className="h-8 w-8 rounded-lg">
  //                       <AvatarImage src={user?.avatar} alt={userName} />
  //                       <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 text-white text-xs font-semibold">
  //                         {userInitials}
  //                       </AvatarFallback>
  //                     </Avatar>
  //                     <div className="grid flex-1 text-left text-sm leading-tight">
  //                       <span className="truncate font-semibold">
  //                         {userName}
  //                       </span>
  //                       <span className="truncate text-xs text-sidebar-foreground/60">
  //                         {userEmail}
  //                       </span>
  //                     </div>
  //                     <ChevronUp className="ml-auto w-4 h-4 text-sidebar-foreground/40" />
  //                   </SidebarMenuButton>
  //                 </DropdownMenuTrigger>
  //                 <DropdownMenuContent
  //                   className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
  //                   side="top"
  //                   align="end"
  //                   sideOffset={4}
  //                 >
  //                   <div className="flex items-center gap-2 p-2">
  //                     <Avatar className="h-8 w-8 rounded-lg">
  //                       <AvatarImage src={user?.avatar} alt={userName} />
  //                       <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 text-white text-xs font-semibold">
  //                         {userInitials}
  //                       </AvatarFallback>
  //                     </Avatar>
  //                     <div className="grid flex-1 text-left text-sm leading-tight">
  //                       <span className="truncate font-semibold">
  //                         {userName}
  //                       </span>
  //                       <span className="truncate text-xs text-muted-foreground">
  //                         {userEmail}
  //                       </span>
  //                     </div>
  //                   </div>
  //                   <DropdownMenuSeparator />
  //                   {user?.role === 'premium' && (
  //                     <>
  //                       <DropdownMenuItem>
  //                         <Crown className="w-4 h-4 mr-2 text-amber-500" />
  //                         Premium Member
  //                       </DropdownMenuItem>
  //                       <DropdownMenuSeparator />
  //                     </>
  //                   )}
  //                   <DropdownMenuItem
  //                     onClick={() => router.push('/profile')}
  //                   >
  //                     <User className="w-4 h-4 mr-2" />
  //                     Profile
  //                   </DropdownMenuItem>
  //                   <DropdownMenuItem
  //                     onClick={() => router.push('/settings')}
  //                   >
  //                     <Settings className="w-4 h-4 mr-2" />
  //                     Settings
  //                   </DropdownMenuItem>
  //                   <DropdownMenuSeparator />
  //                   <DropdownMenuItem
  //                     onClick={handleLogout}
  //                     className="text-red-600 focus:text-red-600"
  //                   >
  //                     <LogOut className="w-4 h-4 mr-2" />
  //                     Log out
  //                   </DropdownMenuItem>
  //                 </DropdownMenuContent>
  //               </DropdownMenu>
  //             </SidebarMenuItem>
  //           </SidebarMenu>
  //         </SidebarFooter>

  //         <SidebarRail />
  //       </Sidebar>

  //       {/* ===== MAIN CONTENT AREA ===== */}
  //       <SidebarInset className="relative flex-1 min-w-0 md:ml-[var(--sidebar-width)] peer-data-[state=collapsed]:md:ml-[var(--sidebar-width-icon)] transition-[margin] duration-300 ease-in-out overflow-x-hidden">
  //         <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-sidebar-border/50 bg-background/60 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-8">
  //           <div className="flex items-center gap-2 sm:gap-4">
  //             <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
  //             <div className="h-4 w-px bg-sidebar-border/50 hidden sm:block" />
  //             <nav className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-muted-foreground">
  //               <span className="text-foreground/80 lowercase tracking-wider hidden sm:inline">Pages</span>
  //               <span className="text-foreground/20 hidden sm:inline">/</span>
  //               <span className="text-foreground lowercase tracking-widest truncate max-w-[100px] sm:max-w-none">
  //                 {getPageTitle(pathname)}
  //               </span>
  //             </nav>
  //           </div>

  //           <div className="flex items-center gap-3">
  //             <div className="relative hidden md:flex items-center">
  //               <Search className="absolute left-3 w-4 h-4 text-muted-foreground/30" />
  //               <input
  //                 type="text"
  //                 placeholder="Global Search..."
  //                 className="bg-secondary/30 border border-sidebar-border/50 rounded-xl pl-10 pr-4 py-2 text-xs font-medium w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/40"
  //               />
  //             </div>

  //             <button className="p-2 rounded-xl bg-secondary/30 border border-sidebar-border/50 text-muted-foreground hover:text-primary transition-all duration-300">
  //               <Activity className="w-4.5 h-4.5" />
  //             </button>
  //           </div>
  //         </header>

  //         {/* Page Content */}
  //         <main className="flex-1 overflow-y-auto p-4 sm:p-6">
  //           {children}
  //         </main>
  //       </SidebarInset>
  //     </SidebarProvider>
  //   );
  // }

  // /* ============== Helpers ============== */

  // function getPageTitle(pathname: string): string {
  //   const titles: Record<string, string> = {
  //     '/dashboard/user': 'Dashboard',
  //     '/dashboard': 'Dashboard',
  //     '/signals': 'Forex Signals',
  //     '/market-analysis': 'Market Analysis',
  //     '/dashboard/investments': 'Investments',
  //     '/dashboard/transactions': 'Transactions',
  //     '/dashboard/performance': 'Performance',
  //     '/profile': 'Profile',
  //     '/settings': 'Settings',
  //     '/testimonials': 'Testimonials',
  //   };

  //   // Check exact match first
  //   if (titles[pathname]) return titles[pathname];

  //   // Check prefix match
  //   for (const [path, title] of Object.entries(titles)) {
  //     if (pathname.startsWith(path)) return title;
  //   }

  //   return 'Dashboard';
  // }
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { LogoIcon } from '@/components/common/LogoIcon';
import { useAuthStore } from '@/store/authStore';
import Link from "next/link";
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
  Menu,
  ChevronLeft
} from 'lucide-react';

/* ============== Configuration ============== */

const MENU_GROUPS = {
  navigation: [
    { title: 'Dashboard', url: '/dashboard/user', icon: LayoutDashboard, isPremium: false },
    { title: 'Signals', url: '/signals', icon: Signal, isPremium: false },
    { title: 'Market Analysis', url: '/market-analysis', icon: LineChart, isPremium: false },
  ],
  account: [
    { title: "Premium Dashboard", url: '/dashboard/premium', icon: Crown, isPremium: true },
    { title: 'Investments', url: '/dashboard/investments', icon: TrendingUp, isPremium: false },
    { title: 'Transactions', url: '/dashboard/transactions', icon: Wallet, isPremium: false },
  ],
  settings: [
    { title: 'Profile', url: '/profile', icon: User, isPremium: false },
    { title: 'Settings', url: '/settings', icon: Settings, isPremium: false },
  ]
};

/* ============== Mock Data ============== */
// Replacing external store/auth logic with mock state for the preview
const mockUser = {
  name: 'Alex Carter',
  email: 'alex.carter@empireofforex.com',
  avatar: 'https://i.pravatar.cc/150?u=alex'
};

/* ============== Main Component ============== */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userInitials = mockUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Close dropdown if sidebar collapses
  useEffect(() => {
    if (isCollapsed) setIsUserMenuOpen(false);
  }, [isCollapsed]);

  const getPageTitle = (path: string) => {
    const allItems = Object.values(MENU_GROUPS).flat();
    const item = allItems.find(item => {
      if (item.url === '/dashboard/user') {
        return path === item.url || path === '/dashboard' || path === '/dashboard/user';
      }
      return path === item.url || path.startsWith(item.url + '/');
    });
    return item?.title || 'Dashboard';
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      
      {/* ===== SIDEBAR ===== */}
      <aside
        className={`relative flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out z-40 shadow-xl ${
          isCollapsed ? 'w-[80px]' : 'w-72'
        }`}
      >
        {/* --- Header / Logo --- */}
        <div className="flex items-center h-16 px-4 border-b border-slate-200/50 dark:border-slate-800/50 shrink-0 overflow-hidden">
          <div className={`flex items-center gap-3 transition-all duration-300 ${isCollapsed ? 'mx-auto' : ''}`}>
            {/* Logo Icon Replacement */}
            <div className="">
              <LogoIcon size={40} />
            </div>
            
            {/* Brand Text */}
            {!isCollapsed && (
              <div className="flex flex-col whitespace-nowrap animate-in fade-in slide-in-from-left-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-0.5">
                  Empire Of
                </span>
                <span className="text-base font-black bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent tracking-tighter">
                  FOREX
                </span>
              </div>
            )}
          </div>
        </div>

        {/* --- Sidebar Content --- */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8 scrollbar-hide">
          {Object.entries(MENU_GROUPS).map(([group, items]) => (
            <div key={group} className="space-y-2">
              {!isCollapsed && (
                <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400/80 animate-in fade-in">
                  {group}
                </p>
              )}
              <nav className="space-y-1">
                {items.map((item) => {
                  const isActive = item.url === '/dashboard/user' 
                    ? pathname === item.url || pathname === '/dashboard' || pathname === '/dashboard/user'
                    : pathname === item.url || pathname.startsWith(item.url + '/');
                  
                  return (
                  <Link
                    key={item.url}
                    href={item.url}
                    className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                    } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                  >
                    <item.icon className={`w-[20px] h-[20px] shrink-0 transition-transform group-hover:scale-110 ${
                      item.isPremium && !isActive ? 'text-amber-500' : ''
                    }`} />
                    {!isCollapsed && (
                      <span className="font-semibold text-sm tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-1">
                        {item.title}
                      </span>
                    )}
                  </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* --- Sidebar Footer --- */}
        <div className="p-3 border-t border-slate-200/50 dark:border-slate-800/50 relative">
          <button
            onClick={() => !isCollapsed && setIsUserMenuOpen(!isUserMenuOpen)}
            className={`flex items-center w-full p-2 rounded-xl transition-all duration-200 ${
              isUserMenuOpen ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
            } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex-shrink-0 w-9 h-9 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                <img src={mockUser.avatar} alt="User" className="w-full h-full object-cover" />
              </div>
              
              {!isCollapsed && (
                <div className="flex flex-col text-left whitespace-nowrap animate-in fade-in">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {mockUser.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium truncate">
                    {mockUser.email}
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <ChevronUp className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            )}
          </button>

          {/* Collapsible Trigger */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-[-12px] flex items-center justify-center w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-400 hover:text-blue-500 shadow-md hover:scale-110 transition-all"
          >
            <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT AREA ===== */}
      <main className="flex-1 ml-2 flex flex-col min-w-0 bg-slate-50 dark:bg-[#020617]">
        
        {/* Modern Header */}
        <header className="flex items-center justify-between h-16 px-8 bg-white/60 dark:bg-[#020617]/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>Pages</span>
              <ChevronRight className="w-3 h-3 opacity-30" />
              <span className="text-slate-900 dark:text-white">{getPageTitle(pathname)}</span>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:flex items-center group">
              <Search className="absolute left-3 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search analytics..."
                className="bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-full pl-10 pr-4 py-2 text-xs font-medium w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>
            <button className="p-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 transition-all shadow-sm">
              <Activity className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>

    </div>
  );
}