'use client';

import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { LogoIcon } from './LogoIcon';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <nav className="fixed top-0 w-full bg-black/10 backdrop-blur-lg border-b border-gray-900 z-50">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center h-full">
          {/* Logo */}
          <Link href="/home" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 flex items-center justify-center group-hover:opacity-80 transition-opacity">
              <LogoIcon size={40} rounded />
            </div>
            <span className="text-xl font-black text-white hidden sm:inline">EOF</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              href="/home"
              className="text-gray-300 hover:text-white font-medium text-sm transition-colors"
            >
              Home
            </Link>
            
            {/* Trading Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-300 hover:text-white font-medium text-sm transition-colors">
                Trading
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-gray-950 border border-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2">
                <Link
                  href="/trading-signals"
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-900 rounded-t-lg transition-colors"
                >
                  Trading Signals
                </Link>
                <Link
                  href="/market-analysis"
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-900 transition-colors"
                >
                  Market Analysis
                </Link>
                <Link
                  href="/dashboard/signals"
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-900 rounded-b-lg transition-colors"
                >
                  Signal Dashboard
                </Link>
              </div>
            </div>

            {/* Investment Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-300 hover:text-white font-medium text-sm transition-colors">
                Investment
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-gray-950 border border-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2">
                <Link
                  href="/investment-plans"
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-900 rounded-t-lg transition-colors"
                >
                  Investment Plans
                </Link>
                <Link
                  href="/dashboard/investments"
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-900 transition-colors"
                >
                  My Investments
                </Link>
                <Link
                  href="/dashboard/transactions"
                  className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-900 rounded-b-lg transition-colors"
                >
                  Transactions
                </Link>
              </div>
            </div>

            <Link
              href="/services"
              className="text-gray-300 hover:text-white font-medium text-sm transition-colors"
            >
              Services
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-white font-medium text-sm transition-colors"
            >
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex space-x-3 items-center">
            <Link
              href="/login"
              className="px-6 py-2 text-gray-300 hover:text-white font-medium text-sm transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-300" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-t border-gray-900 px-4 sm:px-6 lg:px-8">
          <div className="py-4 space-y-3">
            <Link href="/" className="block text-gray-300 hover:text-white py-2">
              Home
            </Link>
            
            {/* Trading Dropdown Mobile */}
            <div>
              <button
                onClick={() => toggleDropdown('trading')}
                className="flex items-center gap-2 text-gray-300 hover:text-white py-2 w-full"
              >
                Trading
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'trading' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'trading' && (
                <div className="pl-4 space-y-2">
                  <Link href="/trading-signals" className="block text-gray-400 hover:text-white py-2">
                    Trading Signals
                  </Link>
                  <Link href="/market-analysis" className="block text-gray-400 hover:text-white py-2">
                    Market Analysis
                  </Link>
                  <Link href="/dashboard/signals" className="block text-gray-400 hover:text-white py-2">
                    Signal Dashboard
                  </Link>
                </div>
              )}
            </div>

            {/* Investment Dropdown Mobile */}
            <div>
              <button
                onClick={() => toggleDropdown('investment')}
                className="flex items-center gap-2 text-gray-300 hover:text-white py-2 w-full"
              >
                Investment
                <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'investment' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'investment' && (
                <div className="pl-4 space-y-2">
                  <Link href="/investment-plans" className="block text-gray-400 hover:text-white py-2">
                    Investment Plans
                  </Link>
                  <Link href="/dashboard/investments" className="block text-gray-400 hover:text-white py-2">
                    My Investments
                  </Link>
                  <Link href="/dashboard/transactions" className="block text-gray-400 hover:text-white py-2">
                    Transactions
                  </Link>
                </div>
              )}
            </div>

            <Link href="/services" className="block text-gray-300 hover:text-white py-2">
              Services
            </Link>
            <Link href="/about" className="block text-gray-300 hover:text-white py-2">
              About
            </Link>
            <div className="pt-4 space-y-3">
              <Link href="/login" className="block text-gray-300 hover:text-white py-2">
                Login
              </Link>
              <Link
                href="/register"
                className="block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
