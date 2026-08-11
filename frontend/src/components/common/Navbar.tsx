'use client';

import Link from 'next/link';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LogoIcon } from './LogoIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/home' },
    { name: 'Trading', href: '/trading-signals' },
    { name: 'Investments', href: '/investment-plans' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
  ];

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setIsOpen(false);
    router.push('/home');
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'
        }`}
    >
      <div className="container mx-auto px-6">
        <div className={`relative flex items-center justify-between px-6 py-3 rounded-full border transition-all duration-500 ${scrolled
            ? 'bg-black/60 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-transparent border-transparent'
          }`}>

          {/* Logo Section */}
          <Link href="/home" className="flex items-center gap-2 group">
            <LogoIcon size={32} />
            <span className="text-xl font-black text-white tracking-tighter uppercase hidden sm:block group-hover:text-blue-400 transition-colors">
              Empire of Forex
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-5 py-2 text-sm font-bold text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                >
                  <User size={16} className="text-blue-400" />
                  <span className="text-sm font-bold text-white truncate max-w-[120px]">{user.name}</span>
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-black/95 border border-white/20 rounded-2xl shadow-xl backdrop-blur-xl z-50">
                    <div className="p-4 border-b border-white/10">
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <Link
                      href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard/user'}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User size={16} />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-bold text-white hover:text-blue-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-[#0a0a1a] border-b border-white/5 p-6 md:hidden"
          >
            <div className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-lg font-bold text-gray-300 hover:text-blue-400 py-2 border-b border-white/5"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 space-y-4">
                {isAuthenticated && user ? (
                  <>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <Link
                      href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard/user'}
                      className="flex items-center justify-center p-4 rounded-2xl bg-blue-600 text-white font-bold"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center p-4 rounded-2xl bg-red-600/20 text-red-400 font-bold border border-red-500/30"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Link
                      href="/login"
                      className="flex items-center justify-center p-4 rounded-2xl bg-white/5 text-white font-bold"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-center p-4 rounded-2xl bg-blue-600 text-white font-bold"
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
    </nav>
  );
}