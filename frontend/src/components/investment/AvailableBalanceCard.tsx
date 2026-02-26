"use client";
import { Banknote, ArrowUpRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/dashboard/ui/button";

export default function AvailableBalanceCard() {
  const availableBalance = 34256.00;
  const weeklyIncome = 2456.00;
  const lastWithdrawal = 2500.00;

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200" style={{ borderColor: "#cbd5e1", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <Banknote className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "#0D73ED" }} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm sm:text-base" style={{ color: "#1e293b" }}>
              Available Balance
            </h3>
            <p className="text-xs" style={{ color: "#64748b" }}>
              Ready to withdraw
            </p>
          </div>
        </div>
      </div>

      {/* Main Balance */}
      <div className="mb-4 sm:mb-6 pb-4 sm:pb-6" style={{ borderColor: "rgba(226, 232, 240, 0.5)", borderBottom: "1px solid rgba(226, 232, 240, 0.5)" }}>
        <p className="text-xs" style={{ color: "#64748b" }}>
          Total Available
        </p>
        <p className="text-3xl sm:text-4xl font-display font-bold mb-2" style={{ color: "#0D73ED" }}>
          ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color: "#10b981" }} />
          <span className="text-xs sm:text-sm font-semibold" style={{ color: "#10b981" }}>+${weeklyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })} this week</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="p-3 sm:p-4 rounded-lg" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
          <p className="text-xs" style={{ color: "#64748b" }}>
            Weekly Income
          </p>
          <p className="text-lg sm:text-xl font-bold" style={{ color: "#10b981" }}>
            ${weeklyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-3 sm:p-4 rounded-lg" style={{ backgroundColor: "rgba(13, 115, 237, 0.1)", border: "1px solid rgba(13, 115, 237, 0.2)" }}>
          <p className="text-xs" style={{ color: "#64748b" }}>
            Last Withdrawal
          </p>
          <p className="text-lg sm:text-xl font-bold" style={{ color: "#0D73ED" }}>
            ${lastWithdrawal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        <Button className="w-full text-white font-semibold text-sm sm:text-base" style={{ backgroundColor: "#0D73ED" }}>
          <ArrowUpRight className="w-4 h-4 mr-2" />
          Withdraw Now
        </Button>
        <Button
          variant="outline"
          className="w-full text-sm sm:text-base"
          style={{ borderColor: "#e2e8f0", color: "#1e293b" }}
        >
          View History
        </Button>
      </div>

      {/* Info Box */}
      <div className="p-3 sm:p-4 rounded-lg" style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
        <p className="text-xs" style={{ color: "#1e293b" }}>
          ⓘ <span style={{ color: "#64748b" }} className="text-xs">Withdrawals are processed within 24-48 hours. Minimum withdrawal amount is $100.</span>
        </p>
      </div>
    </div>
  );
}
