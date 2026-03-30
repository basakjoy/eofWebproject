"use client";
import { ArrowUpRight, ArrowDownLeft, Clock, MoreHorizontal } from "lucide-react";

import { Button }  from "@/components/dashboard/ui/button";

type Transaction = {
    type: "deposit" | "withdrawal";
    description: string;
    amount: string;
    time: string;
    status: "completed" | "pending";
};

const transactions: Transaction[] = [
  {type: "deposit", description: "Investment Deposit" ,amount: "+$2000" ,time: "2min ago", status: "completed" },

  {type: "withdrawal", description: "Profit Withdrawl" ,amount: "-$1,200",time: "1 hour ago", status: "completed"},
  {type: "deposit", description: "Investment Deposit" ,amount: "+$3,500" ,time: "3 hours ago", status: "pending"},
  {type: "deposit", description: "Referral Bonus" ,amount: "+$250" ,time: "1 day ago", status: "completed"},
  {type: "withdrawal", description: "Month Withdrawal" ,amount: "-$2,500" ,time: "2 days ago", status: "completed"},
  
];

export default function RecentTransactions() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <Clock className="w-5 h-5" style={{ color: "#0D73ED" }} />
          </div>
          <div>
            <h3 className="font-display font-semibold" style={{ color: "#1e293b" }}>
              Recent Transactions
            </h3>
            <p className="text-sm" style={{ color: "#64748b" }}>
              Your latest activity
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-5 h-5" style={{ color: "#64748b" }} />
        </Button>
      </div>

      {/*  transaction list*/}
      <div className="space-y-3">
        {transactions.map((tx, index)=> (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg transition-colors" style={{ backgroundColor: "rgba(241, 241, 241, 0.03)" }}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center`} style={{ 
              backgroundColor: tx.type === "deposit" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)"
            }}>
              {tx.type === "deposit" ?(
                <ArrowUpRight className="w-5 h-5" style={{ color: "#10b981" }} />
              ) : (
                <ArrowDownLeft className="w-5 h-5" style={{ color: "#ef4444" }} />
              )}
            </div>
          <div>
            <p className="font-medium" style={{ color: "#1e293b" }}>
              {tx.description}
            </p>
            <p className="text-xs" style={{ color: "#64748b" }}>
              {tx.time}
            </p>
          </div>
          </div>

          <div className="text-right">
            <p className={`font-mono font-semibold`} style={{
              color: tx.type === "deposit" ? "#10b981" : "#ef4444"
            }}>{tx.amount}
            </p>
            <span className={`text-xs px-2 py-0.5 rounded-full capitalize`} style={{
              backgroundColor: tx.status === "completed" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
              color: tx.status === "completed" ? "#10b981" : "#f59e0b",
              border: tx.status === "completed" ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(245, 158, 11, 0.2)"
            }}>{tx.status}
            </span>
          </div>
      </div>
        ))}
      </div>
      {/* Footer */}
      <Button variant="ghost" className="w-full mt-4" style={{ color: "#64748b" }}>
        View All Transactions
      </Button>
    </div>
  );
}
