'use client';

import { useAuthStore } from '@/store/authStore';
import IntroSection from '@/components/landing/IntroSection';
import BrokerTrustSection from '@/components/landing/BrokerTrustSection';
import LiveSignalsSection from '@/components/landing/LiveSignalsSection';
import WinsSection from '@/components/landing/WinsSection';
import TradingToolsSection from '@/components/landing/TradingToolsSection';
import SpreadsSection from '@/components/landing/SpreadsSection';
import PaymentMethodsSection from '@/components/landing/PaymentMethodsSection';
import FeaturedToolsSection from '@/components/landing/FeaturedToolsSection';
import PremiumAccountSection from '@/components/landing/PremiumAccountSection';
import AwardsSection from '@/components/landing/AwardsSection';
import FinalCTASection from '@/components/landing/FinalCTASection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import { useRouter } from 'next/navigation';
import { ArrowRight, TrendingUp, User, Wallet, Settings, Shield } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-black pt-24">
        <div className="container mx-auto px-6">
          {/* Welcome Section */}
          <div className="mb-16 text-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter">
              Welcome back, <span className="text-[#c99a4b]">{user.name}</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {user.role === 'admin' 
                ? 'Manage the platform and oversee trading signals'
                : 'Access your trading signals and investment portfolio'}
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Dashboard Card */}
            <Link
              href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard/user'}
              className="group p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-[#c99a4b]/50 transition-all hover:shadow-[0_8px_32px_rgba(201,154,75,0.1)]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-blue-500/20">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-[#c99a4b] transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
              </h3>
              <p className="text-sm text-gray-400">
                {user.role === 'admin' 
                  ? 'Manage signals, users, and analytics'
                  : 'View your portfolio and trading signals'}
              </p>
            </Link>

            {/* Profile Card */}
            <Link
              href="/profile"
              className="group p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-[#c99a4b]/50 transition-all hover:shadow-[0_8px_32px_rgba(201,154,75,0.1)]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-purple-500/20">
                  <User className="w-6 h-6 text-purple-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-[#c99a4b] transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Profile</h3>
              <p className="text-sm text-gray-400">Manage your account and preferences</p>
            </Link>

            {/* Settings Card */}
            <Link
              href="/settings"
              className="group p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-[#c99a4b]/50 transition-all hover:shadow-[0_8px_32px_rgba(201,154,75,0.1)]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-amber-500/20">
                  <Settings className="w-6 h-6 text-amber-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-[#c99a4b] transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Settings</h3>
              <p className="text-sm text-gray-400">Configure your account settings</p>
            </Link>
          </div>

          {/* Account Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-white font-monospace">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="text-white capitalize font-bold">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      user.role === 'admin' 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link 
                  href="/signals"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-medium">Trading Signals</span>
                  <ArrowRight size={16} className="text-gray-600" />
                </Link>
                <Link 
                  href="/investment-plans"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-medium">Investment Plans</span>
                  <ArrowRight size={16} className="text-gray-600" />
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    href="/admin/signals"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white font-medium">Manage Signals</span>
                    <ArrowRight size={16} className="text-gray-600" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  return (
    <>
      <IntroSection />
      <BrokerTrustSection />
      <LiveSignalsSection />
      <WinsSection />
      <TradingToolsSection />
      <SpreadsSection />
      <PaymentMethodsSection />
      <FeaturedToolsSection />
      
      <PremiumAccountSection />
      <AwardsSection />
      <TestimonialsSection />
      <FinalCTASection />
    </>
  );
}
