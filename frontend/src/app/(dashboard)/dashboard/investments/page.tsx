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

const Index = () => {
  return (
    <div className="fixed inset-0 z-40 overflow-auto" style={{ background: "linear-gradient(to bottom right, #f8fafc, #e2e8f0, #f1f5f9)" }}>
      <DashboardHeader />
      
      <main className="w-full">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          
          {/* Section 1: Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="stat-card bg-white border border-slate-200 rounded-xl p-6" style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-slate-600 mb-2">Total Balance</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">$125,847.00</p>
                  <div className="flex items-center gap-1 mt-2 sm:mt-3">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    <span className="text-xs sm:text-sm font-semibold text-emerald-600">+12.5%</span>
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
                </div>
              </div>
            </div>

            <div className="stat-card bg-white border border-slate-200 rounded-xl p-6" style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-slate-600 mb-2">Total Profit</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">$34,256.00</p>
                  <div className="flex items-center gap-1 mt-2 sm:mt-3">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    <span className="text-xs sm:text-sm font-semibold text-emerald-600">+8.2%</span>
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="stat-card bg-white border border-slate-200 rounded-xl p-6" style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-slate-600 mb-2">Total Invested</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">$91,591.00</p>
                  <div className="flex items-center gap-1 mt-2 sm:mt-3">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                    <span className="text-xs sm:text-sm font-semibold text-emerald-600">+5.7%</span>
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <PiggyBank className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" />
                </div>
              </div>
            </div>

            <div className="stat-card bg-white border border-slate-200 rounded-xl p-6" style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-slate-600 mb-2">Pending Withdrawal</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">$2,450.00</p>
                  <div className="flex items-center gap-1 mt-2 sm:mt-3">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-rose-600" />
                    <span className="text-xs sm:text-sm font-semibold text-rose-600">-2.4%</span>
                  </div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Revenue Chart + Available Balance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200" style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)" }}>
              <RevenueChart />
            </div>
            <div>
              <AvailableBalanceCard />
            </div>
          </div>

          {/* Section 3: Investment Form + Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl p-6 border border-slate-200" style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)" }}>
              <InvestmentForm />
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200" style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)" }}>
              <RecentTransactions />
            </div>
          </div>

          {/* Section 4: Currency Pairs */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl p-6 border border-slate-200" style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)" }}>
              <CurrencyPairs />
            </div>
          </div>

          {/* Section 5: Transaction History Table */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8 sm:mb-12" style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)" }}>
            <TransactionHistoryTable />
          </div>

        </div>
      </main>
    </div>
  );
};

export default Index;
