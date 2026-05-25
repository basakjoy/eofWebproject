"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Download,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types & Mock Data ---

type TransactionStatus = "completed" | "pending" | "failed";
type TransactionType = "deposit" | "withdrawal" | "profit";

interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  time: string;
  status: TransactionStatus;
  reference: string;
  method: string;
}

const allTransactions: Transaction[] = [
  { id: "TXN001", type: "deposit", description: "Investment Deposit", amount: 2000, date: "Feb 14, 2026", time: "2:30 PM", status: "completed", reference: "DEP-2000-0214", method: "Bank Transfer" },
  { id: "TXN002", type: "profit", description: "Monthly Profit", amount: 450, date: "Feb 14, 2026", time: "1:15 PM", status: "completed", reference: "PROFIT-450-0214", method: "Trading Profit" },
  { id: "TXN003", type: "withdrawal", description: "Profit Withdrawal", amount: 1200, date: "Feb 13, 2026", time: "3:45 PM", status: "completed", reference: "WTH-1200-0213", method: "Bank Transfer" },
  { id: "TXN004", type: "deposit", description: "Investment Deposit", amount: 3500, date: "Feb 12, 2026", time: "11:20 AM", status: "pending", reference: "DEP-3500-0212", method: "Credit Card" },
  { id: "TXN005", type: "deposit", description: "Referral Bonus", amount: 250, date: "Feb 10, 2026", time: "9:00 AM", status: "completed", reference: "REF-250-0210", method: "Referral Program" },
  { id: "TXN006", type: "withdrawal", description: "Monthly Withdrawal", amount: 2500, date: "Feb 08, 2026", time: "2:00 PM", status: "completed", reference: "WTH-2500-0208", method: "Bank Transfer" },
  { id: "TXN007", type: "deposit", description: "Investment Deposit", amount: 5000, date: "Feb 05, 2026", time: "4:30 PM", status: "completed", reference: "DEP-5000-0205", method: "Wire Transfer" },
  { id: "TXN008", type: "profit", description: "Trading Profit", amount: 850, date: "Feb 03, 2026", time: "12:45 PM", status: "completed", reference: "PROFIT-850-0203", method: "Trading Profit" },
  { id: "TXN009", type: "withdrawal", description: "Profit Withdrawal", amount: 1500, date: "Feb 01, 2026", time: "6:15 PM", status: "failed", reference: "WTH-1500-0201", method: "Bank Transfer" },
  { id: "TXN010", type: "deposit", description: "Investment Deposit", amount: 2750, date: "Jan 28, 2026", time: "10:00 AM", status: "completed", reference: "DEP-2750-0128", method: "Debit Card" },
];

const ITEMS_PER_PAGE = 6;

// --- Sub-components ---

const StatusBadge = ({ status }: { status: "completed" | "pending" | "failed" }) => {
  const configs = {
    completed: { icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    pending: { icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-100" },
    failed: { icon: AlertCircle, color: "text-rose-600 bg-rose-50 border-rose-100" },
  };
  const { icon: Icon, color } = configs[status] || configs.pending;

  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}>
      <Icon size={14} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((tx) => {
      const matchesSearch = 
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.reference.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "all" || tx.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const currentItems = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="mx-auto max-w-6xl">
        
        {/* Top Header Card */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Transactions</h1>
            <p className="text-slate-500">View and manage your recent financial activity.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95">
            <Download size={18} />
            Export Statement
          </button>
        </div>

        {/* Filters and Controls */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="relative lg:col-span-8">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by description, reference, or ID..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 lg:col-span-4 overflow-x-auto pb-1 no-scrollbar">
            {["all", "deposit", "withdrawal", "profit"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all whitespace-nowrap border ${
                  selectedType === type
                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Main Table Container */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Transaction</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Reference</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Amount</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence mode="popLayout">
                  {currentItems.length > 0 ? (
                    currentItems.map((tx) => (
                      <motion.tr
                        layout
                        key={tx.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="group hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                              tx.type === 'withdrawal' 
                                ? 'bg-rose-100 text-rose-600' 
                                : tx.type === 'profit' 
                                ? 'bg-indigo-100 text-indigo-600' 
                                : 'bg-emerald-100 text-emerald-600'
                            }`}>
                              {tx.type === 'withdrawal' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{tx.description}</p>
                              <p className="text-xs text-slate-500">{tx.method}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-mono text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                            {tx.reference}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <StatusBadge status={tx.status} />
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm">
                            <p className="font-medium text-slate-900">{tx.date}</p>
                            <p className="text-xs text-slate-500">{tx.time}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <p className={`font-bold tabular-nums ${
                            tx.type === 'withdrawal' ? 'text-rose-600' : 'text-emerald-600'
                          }`}>
                            {tx.type === 'withdrawal' ? '-' : '+'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors shadow-sm border border-transparent hover:border-slate-200">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-4 rounded-full bg-slate-50 text-slate-300">
                            <Search size={40} />
                          </div>
                          <p className="text-slate-500 font-medium">No results found for your search.</p>
                          <button 
                            onClick={() => {setSearchQuery(""); setSelectedType("all")}}
                            className="text-sm text-indigo-600 font-semibold hover:underline"
                          >
                            Clear all filters
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 bg-slate-50/30 px-6 py-4 gap-4">
            <p className="text-sm font-medium text-slate-500">
              Showing <span className="text-slate-900">{currentItems.length}</span> of <span className="text-slate-900">{filteredTransactions.length}</span> results
            </p>
            
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 min-w-[36px] px-2 rounded-xl text-sm font-bold transition-all ${
                      currentPage === page
                        ? "bg-indigo-600 text-white shadow-indigo-200 shadow-lg"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => p + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer Support Info */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
           <div className="flex items-center gap-1.5 hover:text-slate-600 cursor-pointer transition-colors">
              <ExternalLink size={14} />
              <span>Statement Guidelines</span>
           </div>
           <div className="flex items-center gap-1.5 hover:text-slate-600 cursor-pointer transition-colors">
              <AlertCircle size={14} />
              <span>Report Discrepancy</span>
           </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}