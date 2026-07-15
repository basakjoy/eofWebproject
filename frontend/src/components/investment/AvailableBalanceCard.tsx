"use client";
import { Banknote, ArrowUpRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/dashboard/ui/button";

export default function AvailableBalanceCard() {
  const availableBalance = 34256.00;
  const weeklyIncome = 2456.00;
  const lastWithdrawal = 2500.00;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <Banknote className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">
              Available Balance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ready to withdraw
            </p>
          </div>
        </div>
      </div>

      {/* Main Balance */}
      <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-slate-100 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400">Total Available</p>
        <p className="text-3xl sm:text-4xl font-bold mb-2 text-blue-600 dark:text-blue-400">
          ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            +${weeklyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })} this week
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="p-3 sm:p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
          <p className="text-xs text-slate-500 dark:text-slate-400">Weekly Income</p>
          <p className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
            ${weeklyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-3 sm:p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30">
          <p className="text-xs text-slate-500 dark:text-slate-400">Last Withdrawal</p>
          <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
            ${lastWithdrawal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          <ArrowUpRight className="w-4 h-4 mr-2" />
          Withdraw Now
        </Button>
        <Button variant="outline" className="w-full border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800">
          View History
        </Button>
      </div>

      {/* Info Box */}
      <div className="p-3 sm:p-4 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
        <p className="text-xs text-slate-800 dark:text-slate-300">
          <span className="mr-1">ⓘ</span> Withdrawals are processed within 24-48 hours. Minimum withdrawal amount is $100.
        </p>
      </div>
    </div>
  );
}