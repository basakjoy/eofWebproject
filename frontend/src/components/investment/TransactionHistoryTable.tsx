"use client";
import { useEffect, useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter,
  Download,
  ChevronLeft,
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/dashboard/ui/button";
import { Input } from "@/components/dashboard/ui/input";

type Transaction = {
  id: string;
  type: "deposit" | "withdrawal" | "profit";
  description: string;
  amount: number;
  date: string;
  time: string;
  status: "completed" | "pending" | "failed";
  reference: string;
  method: string;
};

const allTransactions: Transaction[] = [
  {
    id: "TXN001",
    type: "deposit",
    description: "Investment Deposit",
    amount: 2000,
    date: "Feb 14, 2026",
    time: "2:30 PM",
    status: "completed",
    reference: "DEP-2000-0214",
    method: "Bank Transfer",
  },
  {
    id: "TXN002",
    type: "profit",
    description: "Monthly Profit",
    amount: 450,
    date: "Feb 14, 2026",
    time: "1:15 PM",
    status: "completed",
    reference: "PROFIT-450-0214",
    method: "Trading Profit",
  },
  {
    id: "TXN003",
    type: "withdrawal",
    description: "Profit Withdrawal",
    amount: 1200,
    date: "Feb 13, 2026",
    time: "3:45 PM",
    status: "completed",
    reference: "WTH-1200-0213",
    method: "Bank Transfer",
  },
  {
    id: "TXN004",
    type: "deposit",
    description: "Investment Deposit",
    amount: 3500,
    date: "Feb 12, 2026",
    time: "11:20 AM",
    status: "pending",
    reference: "DEP-3500-0212",
    method: "Credit Card",
  },
  {
    id: "TXN005",
    type: "deposit",
    description: "Referral Bonus",
    amount: 250,
    date: "Feb 10, 2026",
    time: "9:00 AM",
    status: "completed",
    reference: "REF-250-0210",
    method: "Referral Program",
  },
  {
    id: "TXN006",
    type: "withdrawal",
    description: "Monthly Withdrawal",
    amount: 2500,
    date: "Feb 08, 2026",
    time: "2:00 PM",
    status: "completed",
    reference: "WTH-2500-0208",
    method: "Bank Transfer",
  },
  {
    id: "TXN007",
    type: "deposit",
    description: "Investment Deposit",
    amount: 5000,
    date: "Feb 05, 2026",
    time: "4:30 PM",
    status: "completed",
    reference: "DEP-5000-0205",
    method: "Wire Transfer",
  },
  {
    id: "TXN008",
    type: "profit",
    description: "Trading Profit",
    amount: 850,
    date: "Feb 03, 2026",
    time: "12:45 PM",
    status: "completed",
    reference: "PROFIT-850-0203",
    method: "Trading Profit",
  },
  {
    id: "TXN009",
    type: "withdrawal",
    description: "Profit Withdrawal",
    amount: 1500,
    date: "Feb 01, 2026",
    time: "6:15 PM",
    status: "failed",
    reference: "WTH-1500-0201",
    method: "Bank Transfer",
  },
  {
    id: "TXN010",
    type: "deposit",
    description: "Investment Deposit",
    amount: 2750,
    date: "Jan 28, 2026",
    time: "10:00 AM",
    status: "completed",
    reference: "DEP-2750-0128",
    method: "Debit Card",
  },
];

const ITEMS_PER_PAGE = 7;

export default function TransactionHistoryTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "deposit" | "withdrawal" | "profit">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(allTransactions);

  useEffect(() => {
    let filtered = allTransactions;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (tx) =>
          tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((tx) => tx.type === selectedType);
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedType]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTransactions = filteredTransactions.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE
  );

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
      case "profit":
        return <ArrowUpRight className="w-5 h-5" />;
      case "withdrawal":
        return <ArrowDownLeft className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "#10b981";
      case "withdrawal":
        return "#ef4444";
      case "profit":
        return "#0D73ED";
      default:
        return "#64748b";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
        <div>
          <h3 className="font-display font-semibold text-base sm:text-lg" style={{ color: "#1e293b" }}>
            Transaction History
          </h3>
          <p className="text-xs sm:text-sm" style={{ color: "#64748b" }}>
            {filteredTransactions.length} transactions found
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 text-xs sm:text-sm" style={{ borderColor: "#e2e8f0", color: "#64748b" }}>
          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#64748b" }} />
          <Input
            placeholder="Search by description or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm"
            style={{ borderColor: "#e2e8f0" }}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("all")}
            className="text-xs sm:text-sm whitespace-nowrap"
            style={selectedType === "all" ? { backgroundColor: "#0D73ED", color: "white" } : { borderColor: "#e2e8f0", color: "#64748b" }}
          >
            All
          </Button>
          <Button
            variant={selectedType === "deposit" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("deposit")}
            className="text-xs sm:text-sm whitespace-nowrap"
            style={selectedType === "deposit" ? { backgroundColor: "#0D73ED", color: "white" } : { borderColor: "#e2e8f0", color: "#64748b" }}
          >
            Deposits
          </Button>
          <Button
            variant={selectedType === "withdrawal" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("withdrawal")}
            className="text-xs sm:text-sm whitespace-nowrap"
            style={selectedType === "withdrawal" ? { backgroundColor: "#0D73ED", color: "white" } : { borderColor: "#e2e8f0", color: "#64748b" }}
          >
            Withdrawals
          </Button>
          <Button
            variant={selectedType === "profit" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType("profit")}
            className="text-xs sm:text-sm whitespace-nowrap"
            style={selectedType === "profit" ? { backgroundColor: "#0D73ED", color: "white" } : { borderColor: "#e2e8f0", color: "#64748b" }}
          >
            Profits
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full px-4 sm:px-0">
          <table className="w-full">
            <thead>
              <tr style={{ borderColor: "#e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
                <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold" style={{ color: "#64748b" }}>
                  Type
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold" style={{ color: "#64748b" }}>
                  Description
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold" style={{ color: "#64748b" }}>
                  Reference
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold" style={{ color: "#64748b" }}>
                  Amount
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold" style={{ color: "#64748b" }}>
                  Date & Time
                </th>
                <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold" style={{ color: "#64748b" }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    style={{ borderColor: "rgba(226, 232, 240, 0.5)", borderBottom: "1px solid rgba(226, 232, 240, 0.5)" }}
                    className="hover:transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(13, 115, 237, 0.03)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
                  >
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div
                        style={{
                          backgroundColor: tx.type === "deposit" || tx.type === "profit"
                            ? "rgba(16, 185, 129, 0.1)"
                            : "rgba(239, 68, 68, 0.1)"
                        }}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
                      >
                        <span
                          style={{ color: getTypeColor(tx.type) }}
                        >
                          {getTransactionIcon(tx.type)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div>
                        <p className="font-medium text-xs sm:text-sm" style={{ color: "#1e293b" }}>
                          {tx.description}
                        </p>
                        <p className="text-xs hidden sm:block" style={{ color: "#64748b" }}>
                          {tx.method}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <code className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded" style={{ backgroundColor: "rgba(13, 115, 237, 0.1)", color: "#1e293b" }}>
                        {tx.reference.split('-').slice(-2).join('-')}
                      </code>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <p
                        className="font-mono font-semibold text-xs sm:text-sm"
                        style={{
                          color: tx.type === "withdrawal" ? "#ef4444" : "#10b981"
                        }}
                      >
                        {tx.type === "withdrawal" ? "-" : "+"}$
                        {tx.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <div>
                        <p className="text-xs sm:text-sm" style={{ color: "#1e293b" }}>
                          {tx.date.split(', ')[1]}
                        </p>
                        <p className="text-xs" style={{ color: "#64748b" }}>
                          {tx.time}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <span
                        className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold border"
                        style={{
                          backgroundColor: tx.status === "completed" ? "rgba(16, 185, 129, 0.1)" : tx.status === "pending" ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)",
                          color: tx.status === "completed" ? "#10b981" : tx.status === "pending" ? "#f59e0b" : "#ef4444",
                          borderColor: tx.status === "completed" ? "rgba(16, 185, 129, 0.3)" : tx.status === "pending" ? "rgba(245, 158, 11, 0.3)" : "rgba(239, 68, 68, 0.3)"
                        }}
                      >
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <p className="text-sm" style={{ color: "#64748b" }}>
                      No transactions found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ borderColor: "rgba(226, 232, 240, 0.5)", borderTop: "1px solid rgba(226, 232, 240, 0.5)" }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mt-6 pt-6">
          <p className="text-xs sm:text-sm" style={{ color: "#64748b" }}>
            Showing page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-1 sm:gap-2 overflow-x-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="text-xs sm:text-sm"
              style={currentPage === 1 ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="min-w-8 sm:min-w-10 text-xs sm:text-sm"
                style={currentPage === page ? { backgroundColor: "#0D73ED", color: "#ffffff", borderColor: "#0D73ED" } : { borderColor: "#e2e8f0", color: "#64748b" }}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="text-xs sm:text-sm"
              style={currentPage === totalPages ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            >
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
