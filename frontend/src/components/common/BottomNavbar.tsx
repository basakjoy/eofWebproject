'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Zap,
  Layers,
  ShieldCheck,
  BookOpen,
  ArrowUp,
  UserPlus,
  LayoutDashboard,
  DiamondIcon
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function BottomNavbar() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      // Find the first section on the current page to detect its end, or fallback to viewport height ratio
      const firstSection =
        document.querySelector('main > section:first-of-type') ||
        document.querySelector('section') ||
        document.querySelector('main > div:first-child');

      const threshold = firstSection
        ? Math.max(250, Math.min(firstSection.clientHeight * 0.75, window.innerHeight * 0.7))
        : window.innerHeight * 0.5;

      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const navItems = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'Signals', href: '/trading-signals', icon: Zap, highlight: true },
    { name: 'Services', href: '/services', icon: Layers },
    { name: 'Plans', href: '/investment-plans', icon: ShieldCheck },
    { name: 'Blog', href: '/blog', icon: BookOpen },
    { name: 'Brokers', href: '/brokers', icon: DiamondIcon },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[90] max-w-[95vw] sm:max-w-fit pointer-events-auto"
        >
          <div className="flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full bg-[#121217]/90 backdrop-blur-2xl border border-white/15 shadow-[0_12px_45px_rgba(0,0,0,0.85),0_0_25px_rgba(255,107,0,0.15)] transition-all">
            
            {/* Nav Items */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-white/15 text-white font-semibold shadow-inner'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="relative">
                      <Icon
                        size={16}
                        className={`transition-transform duration-200 group-hover:scale-110 ${
                          isActive
                            ? 'text-[#FF6B00]'
                            : item.highlight
                            ? 'text-amber-400'
                            : 'text-gray-400 group-hover:text-white'
                        }`}
                      />
                      {item.highlight && (
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00]"></span>
                        </span>
                      )}
                    </div>
                    <span className="hidden sm:inline-block tracking-wide">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Separator */}
            <div className="w-[1px] h-5 bg-white/10 mx-1 hidden sm:block" />

            {/* Primary Action / Auth CTA */}
            <div className="flex items-center gap-1.5 pl-1 sm:pl-0">
              {isAuthenticated && user ? (
                <Link
                  href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard/user'}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white text-black hover:bg-gray-200 text-xs font-semibold transition-all shadow-sm group"
                  title="Go to Dashboard"
                >
                  <LayoutDashboard size={14} className="text-black group-hover:rotate-6 transition-transform" />
                  <span className="hidden md:inline-block">Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] hover:brightness-110 text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(255,107,0,0.4)] group active:scale-95"
                >
                  <UserPlus size={14} className="group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline-block">Sign Up</span>
                </Link>
              )}

              {/* Scroll to Top */}
              <button
                onClick={scrollToTop}
                className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors group"
                title="Scroll to Top"
                aria-label="Scroll to top of page"
              >
                <ArrowUp size={15} className="group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
