'use client';

import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LogoIcon } from './LogoIcon';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        scrolled ? 'py-4' : 'py-8'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className={`relative flex items-center justify-between px-6 py-3 rounded-full border transition-all duration-500 ${
          scrolled 
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
              <div className="pt-6 grid grid-cols-2 gap-4">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}