"use client";

import { Wallet, TrendingUp, PiggyBank, DollarSign, TrendingDown } from "lucide-react";
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

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 transition-colours duration-300 p-8 text-slate-900 dark:text-slate-100">
      <main className="w-full">
        <div className="max-w-[1400px] mx-auto space-y-8">
          
          {/* Section 1: Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            {/* 1 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sw">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs sm-text-sm mb-2 text-slate-500 dark:text-slate-400">Total Balance</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">$125,847.00</p>
                  <div className="flex items-center gap-1 mt-2 sm:mt-3">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    <span className="text-xs sm:text-sm font-semibold text-emerald-600">+12.5%</span>
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            {/* 2 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sw">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs sm-text-sm mb-2 text-slate-500 dark:text-slate-400">Total Profit</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">$34,256.00</p>
                  <div className="flex items-center gap-1 mt-2 sm:mt-3">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    <span className="text-xs sm:text-sm font-semibold text-emerald-600">+8.2%</span>
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sw">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs sm-text-sm mb-2 text-slate-500 dark:text-slate-400">Total Invested</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">$91,591.00</p>
                  <div className="flex items-center gap-1 mt-2 sm:mt-3">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    <span className="text-xs sm:text-sm font-semibold text-emerald-600">+5.7%</span>
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <PiggyBank className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sw">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs sm-text-sm mb-2 text-slate-500 dark:text-slate-400">Pending Withdrawal</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">$2.450.00</p>
                  <div className="flex items-center gap-1 mt-2 sm:mt-3">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-rose-600" />
                    <span className="text-xs sm:text-sm font-semibold text-rose-600">-2.4%</span>
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Revenue Chart + Available Balance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="lg:col-span-2 rounded-xl p-6  transition-all duration-300" style={{  boxShadow: `0 4px 6px ${colors.shadow}` }}>
              <RevenueChart />
            </div>
            <div>
              <AvailableBalanceCard />
            </div>
          </div>

          {/* Section 3: Investment Form + Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="rounded-xl p-6  transition-all duration-300" style={{  boxShadow: `0 4px 6px ${colors.shadow}` }}>
              <InvestmentForm />
            </div>
            <div className="rounded-xl p-6  transition-all duration-300" style={{  boxShadow: `0 4px 6px ${colors.shadow}` }}>
              <RecentTransactions />
            </div>
          </div>

          {/* Section 4: Currency Pairs */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="rounded-xl p-6  transition-all duration-300" style={{  boxShadow: `0 4px 6px ${colors.shadow}` }}>
              <CurrencyPairs />
            </div>
          </div>

          {/* Section 5: Transaction History Table */}
          <div className="rounded-xl p-6  mb-8 sm:mb-12 transition-all duration-300" style={{  boxShadow: `0 4px 6px ${colors.shadow}` }}>
            <TransactionHistoryTable />
          </div>

        </div>
      </main>
    </div>
  );
};

export default Index;
