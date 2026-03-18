"use client";

import { Wallet, TrendingUp, PiggyBank, DollarSign } from "lucide-react";
import { DashboardHeader } from "@/components/investment/DashboardHeader";
import StatCard from "@/components/investment/StatCard";
import RevenueChart from "@/components/investment/RevenueChart";
import CurrencyPairs from "@/components/investment/CurrencyPairs";
import InvestmentForm from "@/components/investment/InvestmentForm";
import RecentTransactions from "@/components/investment/RecentTransaction";
import AvailableBalanceCard from "@/components/investment/AvailableBalanceCard";
import TransactionHistoryTable from "@/components/investment/TransactionHistoryTable";
import { useThemeStore } from "@/store/themeStore";
import { useThemeColors } from "@/lib/themeColors";

const Index = () => {
  const theme = useThemeStore((state) => state.theme);
  const colors = useThemeColors();

  const bgGradient = theme === 'dark' 
    ? "linear-gradient(to bottom right, #02040a, #070b14, #0d111b)"
    : "linear-gradient(to bottom right, #f8fafc, #e2e8f0, #f1f5f9)";

  return (
    <div className="fixed inset-0 z-40 overflow-auto transition-colors duration-300" style={{ background: bgGradient }}>
      <DashboardHeader />
      
      <main className="w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          
          {/* Section 1: Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="stat-card border rounded-xl p-6 transition-all duration-300" style={{ backgroundColor: colors.bg.card, borderColor: colors.border, boxShadow: `0 4px 6px ${colors.shadow}` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm mb-2 transition-colors duration-300" style={{ color: colors.text.secondary }}>Total Balance</p>
                  <p className="text-xl sm:text-2xl font-bold transition-colors duration-300" style={{ color: colors.text.primary }}>$125,847.00</p>
                  <div className="flex items-center gap-1 mt-2 sm:mt-3">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    <span className="text-xs sm:text-sm font-semibold text-emerald-600">+12.5%</span>
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#dbeafe' }}>
                  <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
                </div>
              </div>
            </div>

            <div className="stat-card border rounded-xl p-6 transition-all duration-300" style={{ backgroundColor: colors.bg.card, borderColor: colors.border, boxShadow: `0 4px 6px ${colors.shadow}` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm mb-2 transition-colors duration-300" style={{ color: colors.text.secondary }}>Total Profit</p>
                  <p className="text-xl sm:text-2xl font-bold transition-colors duration-300" style={{ color: colors.text.primary }}>$34,256.00</p>
                  <div className="flex items-center gap-1 mt-2 sm:mt-3">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    <span className="text-xs sm:text-sm font-semibold text-emerald-600">+8.2%</span>
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : '#dcfce7' }}>
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="stat-card border rounded-xl p-6 transition-all duration-300" style={{ backgroundColor: colors.bg.card, borderColor: colors.border, boxShadow: `0 4px 6px ${colors.shadow}` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm mb-2 transition-colors duration-300" style={{ color: colors.text.secondary }}>Total Invested</p>
                  <p className="text-xl sm:text-2xl font-bold transition-colors duration-300" style={{ color: colors.text.primary }}>$91,591.00</p>
                  <div className="flex items-center gap-1 mt-2 sm:mt-3">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    <span className="text-xs sm:text-sm font-semibold text-emerald-600">+5.7%</span>
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme === 'dark' ? 'rgba(245, 158, 11, 0.1)' : '#fef3c7' }}>
                  <PiggyBank className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" />
                </div>
              </div>
            </div>

            <div className="stat-card border rounded-xl p-6 transition-all duration-300" style={{ backgroundColor: colors.bg.card, borderColor: colors.border, boxShadow: `0 4px 6px ${colors.shadow}` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm mb-2 transition-colors duration-300" style={{ color: colors.text.secondary }}>Pending Withdrawal</p>
                  <p className="text-xl sm:text-2xl font-bold transition-colors duration-300" style={{ color: colors.text.primary }}>$2,450.00</p>
                  <div className="flex items-center gap-1 mt-2 sm:mt-3">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-rose-600" />
                    <span className="text-xs sm:text-sm font-semibold text-rose-600">-2.4%</span>
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : '#f3e8ff' }}>
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Revenue Chart + Available Balance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="lg:col-span-2 rounded-xl p-6 border transition-all duration-300" style={{ backgroundColor: colors.bg.card, borderColor: colors.border, boxShadow: `0 4px 6px ${colors.shadow}` }}>
              <RevenueChart />
            </div>
            <div>
              <AvailableBalanceCard />
            </div>
          </div>

          {/* Section 3: Investment Form + Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="rounded-xl p-6 border transition-all duration-300" style={{ backgroundColor: colors.bg.card, borderColor: colors.border, boxShadow: `0 4px 6px ${colors.shadow}` }}>
              <InvestmentForm />
            </div>
            <div className="rounded-xl p-6 border transition-all duration-300" style={{ backgroundColor: colors.bg.card, borderColor: colors.border, boxShadow: `0 4px 6px ${colors.shadow}` }}>
              <RecentTransactions />
            </div>
          </div>

          {/* Section 4: Currency Pairs */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="rounded-xl p-6 border transition-all duration-300" style={{ backgroundColor: colors.bg.card, borderColor: colors.border, boxShadow: `0 4px 6px ${colors.shadow}` }}>
              <CurrencyPairs />
            </div>
          </div>

          {/* Section 5: Transaction History Table */}
          <div className="rounded-xl p-6 border mb-8 sm:mb-12 transition-all duration-300" style={{ backgroundColor: colors.bg.card, borderColor: colors.border, boxShadow: `0 4px 6px ${colors.shadow}` }}>
            <TransactionHistoryTable />
          </div>

        </div>
      </main>
    </div>
  );
};

export default Index;
