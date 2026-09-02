'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import IntroSection from '@/components/landing/IntroSection';
import KeyMetrics from '@/components/landing/KeyMetrics';
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
import { 
  ArrowRight, 
  TrendingUp, 
  User, 
  Settings, 
  Zap, 
  Target, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calculator, 
  Eye, 
  ShieldCheck, 
  BarChart3,
  Loader2,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { signalsApi, SignalRecord } from '@/lib/signalsApi';
import SignalDetailModal from '@/components/signals/SignalDetailModal';
import RiskCalculatorModal from '@/components/signals/RiskCalculatorModal';

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  // States for live signals previews in authenticated view
  const [liveSignals, setLiveSignals] = useState<SignalRecord[]>([]);
  const [isLoadingSignals, setIsLoadingSignals] = useState(false);

  // Modal States
  const [selectedSignalDetail, setSelectedSignalDetail] = useState<SignalRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSignalCalc, setSelectedSignalCalc] = useState<SignalRecord | null>(null);
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchTopSignals = async () => {
        setIsLoadingSignals(true);
        try {
          const response = await signalsApi.getAllSignals({ limit: 3 });
          const data = Array.isArray(response.data) ? response.data : [];
          setLiveSignals(data.slice(0, 3));
        } catch (error) {
          console.error("Failed to load home dashboard signals:", error);
        } finally {
          setIsLoadingSignals(false);
        }
      };
      fetchTopSignals();
    }
  }, [isAuthenticated, user]);

  if (isAuthenticated && user) {
    return (
      <div className="w-full min-h-screen pt-24 pb-16 bg-[#030305] text-white font-poppins selection:bg-[#FF6B00] selection:text-white relative overflow-hidden">
        
        {/* Dynamic Background Mesh Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none z-0">
          <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-fiery-orange/10 rounded-full blur-[140px] animate-fiery-glow" />
          <div className="absolute top-32 right-1/4 w-[350px] h-[350px] bg-fiery-amber/10 rounded-full blur-[130px] animate-fiery-glow" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-site mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Welcome Premium Header */}
          <div className="text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-card-dark border border-white/10 text-xs font-semibold text-fiery-amber mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Active Session Connected
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-fiery-orange to-fiery-amber">{user.name}</span>
              </h1>
              <p className="text-sm text-zinc-400 font-light mt-1">
                {user.role === 'admin' 
                  ? 'Administrator control panel & market alerts deployment center.'
                  : 'Access real-time institutional opportunities & track your growth strategy.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 self-center md:self-auto">
              <button 
                onClick={() => {
                  setSelectedSignalCalc(liveSignals[0] || null);
                  setIsCalcOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-panel-dark hover:bg-white/5 border border-white/10 text-xs font-bold text-white flex items-center gap-2 transition-all hover:scale-105"
              >
                <Calculator className="w-4 h-4 text-fiery-orange" />
                Calculator
              </button>

              <Link 
                href="/signals"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fiery-orange to-fiery-amber text-black font-extrabold text-xs flex items-center gap-2 shadow-fiery hover:scale-105 transition-transform"
              >
                <Zap className="w-4 h-4 fill-black" />
                Live Signals
              </Link>
            </div>
          </div>

          {/* Real-time Signals Quick Panel */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-fiery-orange" />
                  Live Market Alert Feed
                </h2>
                <p className="text-xs text-zinc-500">Recent high-probability trading configurations</p>
              </div>
              <Link href="/signals" className="text-xs font-bold text-fiery-amber hover:underline flex items-center gap-1">
                Explore Terminal <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoadingSignals ? (
                <div className="col-span-3 py-12 text-center bg-card-dark/40 border border-white/5 rounded-3xl">
                  <Loader2 className="w-8 h-8 text-fiery-orange animate-spin mx-auto mb-2" />
                  <span className="text-xs text-zinc-400">Loading live setups...</span>
                </div>
              ) : liveSignals.length === 0 ? (
                <div className="col-span-3 py-12 text-center bg-card-dark/40 border border-white/5 rounded-3xl space-y-2">
                  <Zap className="w-8 h-8 text-zinc-500 mx-auto" />
                  <p className="text-xs text-zinc-400">No active signals found in the database right now.</p>
                </div>
              ) : (
                liveSignals.map((signal) => {
                  const isBuy = signal.type?.toUpperCase() === 'BUY';
                  return (
                    <div 
                      key={signal.id}
                      onClick={() => {
                        setSelectedSignalDetail(signal);
                        setIsDetailOpen(true);
                      }}
                      className={`group relative bg-card-dark/60 backdrop-blur-xl border rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
                        isBuy ? 'border-emerald-500/20 hover:border-emerald-500/40' : 'border-rose-500/20 hover:border-rose-500/40'
                      }`}
                    >
                      <div className={`absolute top-0 left-5 right-5 h-[3px] rounded-b-full ${isBuy ? 'bg-emerald-400/80' : 'bg-rose-400/80'}`} />

                      <div className="flex items-center justify-between mb-4 pt-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            isBuy ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-white'
                          }`}>
                            {signal.type}
                          </span>
                          <span className="text-sm font-extrabold text-white">{signal.pair}</span>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400 bg-panel-dark px-2 py-0.5 rounded border border-white/5">
                          {signal.timeframe || '4H'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-panel-dark/60 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Entry</span>
                          <span className="text-xs font-mono font-bold text-white">{signal.entryPrice}</span>
                        </div>
                        <div className="bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/10">
                          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block">Target TP1</span>
                          <span className="text-xs font-mono font-bold text-emerald-400">{signal.takeProfit1 || signal.takeProfit}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-white/5">
                        <span className="flex items-center gap-1 font-medium">
                          <Target className="w-3.5 h-3.5 text-fiery-orange" />
                          Acc: {signal.accuracy || 88}%
                        </span>
                        <span className="text-fiery-orange font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          Setup <Eye className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Quick Command Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Dashboard Card */}
            <Link
              href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard/user'}
              className="group relative p-8 rounded-3xl bg-[#0C0C10]/60 backdrop-blur-xl border border-white/10 hover:border-fiery-orange/50 transition-all hover:shadow-[0_8px_32px_rgba(255,107,0,0.15)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-fiery-orange/10 border border-fiery-orange/20">
                  <TrendingUp className="w-6 h-6 text-fiery-orange" />
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-fiery-orange transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {user.role === 'admin' ? 'Admin Dashboard' : 'Trading Dashboard'}
              </h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                {user.role === 'admin' 
                  ? 'Manage institutional signals, active subscribers, and review analytics.'
                  : 'Track your capital growth, review active positions, and portfolio status.'}
              </p>
            </Link>

            {/* Profile Card */}
            <Link
              href="/profile"
              className="group relative p-8 rounded-3xl bg-[#0C0C10]/60 backdrop-blur-xl border border-white/10 hover:border-fiery-orange/50 transition-all hover:shadow-[0_8px_32px_rgba(255,107,0,0.15)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                  <User className="w-6 h-6 text-cyan-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-fiery-orange transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Account Profile</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Review your current package membership tiers, credentials, and custom profile configurations.
              </p>
            </Link>

            {/* Settings Card */}
            <Link
              href="/settings"
              className="group relative p-8 rounded-3xl bg-[#0C0C10]/60 backdrop-blur-xl border border-white/10 hover:border-fiery-orange/50 transition-all hover:shadow-[0_8px_32px_rgba(255,107,0,0.15)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-fiery-amber/10 border border-fiery-amber/20">
                  <Settings className="w-6 h-6 text-fiery-amber" />
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-fiery-orange transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">System Settings</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Configure your API key integrations, notification triggers, and custom risk profiles.
              </p>
            </Link>
          </div>

          {/* Account Detail Info Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            
            <div className="p-6 rounded-3xl bg-[#0C0C10]/60 backdrop-blur-xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-fiery-orange" />
                Security & Identity
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Email Address</p>
                  <p className="text-white font-mono text-sm mt-0.5">{user.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">Account Privilege</p>
                  <p className="text-white capitalize font-bold mt-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      user.role === 'admin' 
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                        : 'bg-[#FF6B00]/20 text-[#FF6B00] border border-fiery-orange/30'
                    }`}>
                      {user.role} Tier
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#0C0C10]/60 backdrop-blur-xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-fiery-amber" />
                Quick Navigation Links
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { label: 'Trade Room', href: '/signals' },
                  { label: 'Investment Plans', href: '/investment-plans' },
                  { label: 'Market Analysis', href: '/market-analysis' },
                  { label: 'Account Settings', href: '/settings' }
                ].map((link, idx) => (
                  <Link 
                    key={idx}
                    href={link.href}
                    className="flex items-center justify-between p-3 rounded-xl bg-panel-dark/50 hover:bg-white/5 border border-white/5 hover:border-fiery-orange/30 transition-all text-white text-xs font-semibold"
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={14} className="text-zinc-500" />
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Dynamic Interactive Modals */}
        <SignalDetailModal
          signal={selectedSignalDetail}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onOpenCalculator={(sig) => {
            setSelectedSignalCalc(sig);
            setIsCalcOpen(true);
          }}
        />

        <RiskCalculatorModal
          signal={selectedSignalCalc}
          isOpen={isCalcOpen}
          onClose={() => setIsCalcOpen(false)}
        />

      </div>
    );
  }

  // Non-authenticated landing layout
  return (
    <div className="w-full min-h-screen bg-[#030305] font-poppins">
      <IntroSection />
      <KeyMetrics />
      <BrokerTrustSection />
      <PaymentMethodsSection />
      <LiveSignalsSection />
      <PremiumAccountSection />
      <FinalCTASection />
    </div>
  );
}
