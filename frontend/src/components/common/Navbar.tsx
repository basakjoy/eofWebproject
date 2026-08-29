'use client';

import Link from 'next/link';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LogoIcon } from './LogoIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      // Find the first section on the page to match BottomNavbar's exact trigger point
      const firstSection =
        document.querySelector('main > section:first-of-type') ||
        document.querySelector('section') ||
        document.querySelector('main > div:first-child');

      const threshold = firstSection
        ? Math.max(250, Math.min(firstSection.clientHeight * 0.75, window.innerHeight * 0.7))
        : window.innerHeight * 0.5;

      const isPast = window.scrollY > threshold;
      setIsVisible(!isPast);
      setScrolled(window.scrollY > 20);

      // Close open dropdowns/drawers when navbar transitions out
      if (isPast) {
        setIsOpen(false);
        setProfileOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/home' },
    { name: 'Trading Signals', href: '/trading-signals' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Plans', href: '/investment-plans' },
    { name: 'Blog', href: '/blog' },
  ];

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setIsOpen(false);
    router.push('/home');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed top-6 left-0 w-full z-[100] px-4 pointer-events-auto"
        >
          <div className="max-w-fit mx-auto">
            <div className="flex items-center gap-6 sm:gap-8 px-5 py-2.5 rounded-full bg-[#16161c]/80 backdrop-blur-2xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.6)] transition-all">

          {/* Logo / Brand Icon */}
          <Link href="/home" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:border-[#FF6B00]/40 transition-all">
              <LogoIcon size={18} />
            </div>
          </Link>

          {/* Desktop Menu Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-medium text-gray-300 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-black font-semibold text-xs transition-colors hover:bg-gray-200"
                >
                  <User size={13} className="text-black" />
                  <span className="truncate max-w-[100px]">{user.name}</span>
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute top-full right-0 mt-3 w-48 bg-[#111116] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 p-1">
                    <div className="p-3 border-b border-white/10">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-gray-400">{user.email}</p>
                    </div>
                    <Link
                      href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard/user'}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-white/5 rounded-xl transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User size={13} />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <LogOut size={13} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-gray-300 hover:text-white text-xs font-medium transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] hover:brightness-110 text-white text-xs font-semibold rounded-full transition-all shadow-[0_0_15px_rgba(255,107,0,0.35)] active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Trigger */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 max-w-sm mx-auto bg-[#16161c]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 md:hidden shadow-2xl"
          >
            <div className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-sm font-medium text-gray-300 hover:text-white py-1.5 border-b border-white/5"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-3 border-t border-white/10">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <Link
                      href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard/user'}
                      className="w-full flex items-center justify-center gap-2 p-2.5 rounded-full bg-white text-black text-xs font-semibold"
                      onClick={() => setIsOpen(false)}
                    >
                      <User size={13} />
                      Dashboard ({user.name})
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 p-2.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold"
                    >
                      <LogOut size={13} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center p-2.5 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/15 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      className="w-full flex items-center justify-center p-2.5 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] text-white text-xs font-semibold shadow-lg transition-all"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )}
</AnimatePresence>
  );
}
