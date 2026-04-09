'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LogoIcon } from './LogoIcon';
import gsap from 'gsap';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Navbar entrance animation
    gsap.fromTo(
      '.navbar-container',
      { opacity: 0, y: -30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out' }
    );

    // Logo animation
    gsap.fromTo(
      '.navbar-logo',
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' }
    );

    // Nav items animation
    gsap.fromTo(
      '.nav-item',
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.3, stagger: 0.1, ease: 'power3.out' }
    );

    // Auth buttons animation
    gsap.fromTo(
      '.auth-button',
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.6, delay: 0.5, stagger: 0.1, ease: 'power3.out' }
    );
  }, []);

  // Hover animation for buttons
  const handleButtonHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleButtonHoverEnd = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  return (
    <nav className="fixed top-3 left-1/2 transform -translate-x-1/2 w-[95%] md:w-[90%] lg:w-[85%] max-w-8xl z-50">
      {/* Main Navbar Container - Rounded Pill Shape */}
      <div className="navbar-container bg-white/40 backdrop-blur-md border border-white/20 rounded-full px-4 md:px-6 lg:px-8 py-2 md:py-2.5 lg:py-3 shadow-2xl">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link 
            href="/home" 
            className="navbar-logo flex items-center space-x-2 md:space-x-3 group flex-shrink-0"
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonHoverEnd}
          >
            <div className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-black group-hover:opacity-80 transition-opacity">
              <LogoIcon size={32} rounded />
            </div>
            <span className="text-base md:text-lg lg:text-xl font-black text-white hidden sm:inline">EOF</span>
          </Link>

          {/* Desktop Menu - Center */}
          <div className="hidden md:flex space-x-1 lg:space-x-2 items-center">
            <Link
              href="/home"
              className="nav-item text-black/80 hover:text-white font-medium text-xs lg:text-base px-3 lg:px-5 py-1.5 lg:py-2.5 transition-colors rounded-full hover:bg-black/5"
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonHoverEnd}
            >
              Home
            </Link>
            <Link
              href="/trading-signals"
              className="nav-item text-black/80 hover:text-white font-medium text-xs lg:text-base px-3 lg:px-5 py-1.5 lg:py-2.5 transition-colors rounded-full hover:bg-black/20"
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonHoverEnd}
            >
              Trading
            </Link>
             <Link
              href="/investment-plans"
              className="nav-item text-black/80 hover:text-white font-medium text-xs lg:text-base px-3 lg:px-5 py-1.5 lg:py-2.5 transition-colors rounded-full hover:bg-black/20 hidden lg:block"
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonHoverEnd}
            >
              Investment Plans
            </Link>

            <Link
              href="/about"
              className="nav-item text-black/80 hover:text-white font-medium text-xs lg:text-base px-3 lg:px-5 py-1.5 lg:py-2.5 transition-colors rounded-full hover:bg-black/20"
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonHoverEnd}
            >
              About
            </Link>
            <Link
              href="/services"
              className="nav-item text-black/80 hover:text-white font-medium text-xs lg:text-base px-3 lg:px-5 py-1.5 lg:py-2.5 transition-colors rounded-full hover:bg-black/20 hidden lg:block"
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonHoverEnd}
            >
              Services
            </Link>
          </div>

          {/* Right Side - Auth Buttons */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4 flex-shrink-0">
            <Link
              href="/login"
              className="auth-button text-black/80 hover:text-white font-medium text-xs lg:text-base px-4 lg:px-6 py-1.5 lg:py-2.5 transition-colors rounded-full hover:bg-black/20"
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonHoverEnd}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="auth-button bg-black hover:bg-black/80 text-white font-medium text-xs lg:text-base px-4 lg:px-7 py-1.5 lg:py-2.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonHoverEnd}
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-black text-2xl flex-shrink-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 md:mt-6 bg-white/95 backdrop-blur-md border border-white/20 rounded-3xl px-6 md:px-8 py-6 md:py-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <div className="space-y-4 md:space-y-6">
            <Link
              href="/home"
              className="block text-black/80 hover:text-black font-medium text-sm md:text-base py-2 md:py-3 px-3 md:px-4 rounded-lg hover:bg-black/5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/trading-signals"
              className="block text-black/80 hover:text-black font-medium text-sm md:text-base py-2 md:py-3 px-3 md:px-4 rounded-lg hover:bg-black/5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Trading
            </Link>
            <Link
              href="/investment-plans"
              className="block text-black/80 hover:text-black font-medium text-sm md:text-base py-2 md:py-3 px-3 md:px-4 rounded-lg hover:bg-black/5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Investment Plans
            </Link>
            

            <Link
              href="/about"
              className="block text-black/80 hover:text-black font-medium text-sm md:text-base py-2 md:py-3 px-3 md:px-4 rounded-lg hover:bg-black/5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/services"
              className="block text-black/80 hover:text-black font-medium text-sm md:text-base py-2 md:py-3 px-3 md:px-4 rounded-lg hover:bg-black/5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>

            <div className="pt-4 md:pt-6 border-t border-black/10 space-y-3 md:space-y-4">
              <Link
                href="/login"
                className="block text-black/80 hover:text-black font-medium text-sm md:text-base py-2 md:py-3 px-3 md:px-4 rounded-lg hover:bg-black/5 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block w-full bg-black hover:bg-black/80 text-white font-medium text-sm md:text-base px-6 py-2 md:py-3 rounded-full text-center transition-all shadow-lg hover:shadow-xl"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}