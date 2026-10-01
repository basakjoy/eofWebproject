'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  TrendingUp,
  Search,
  Download,
  Filter,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Crown,
  Sparkles,
  ShieldCheck,
  X,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { transactionsApi } from '@/lib/transactionsApi';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

export interface TransactionRecord {
  id: string | number;
  type: 'deposit' | 'withdrawal' | 'profit' | 'upgrade' | string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | string;
  date: string;
  time?: string;
  reference?: string;
  method?: string;
  fee?: number;
  netAmount?: number;
}

function normalizeTransaction(value: unknown): TransactionRecord | null {
  if (!value || typeof value !== 'object') return null;

  const record = value as Record<string, unknown>;
  const id = record.id;
  const amount = Number(record.amount);
  if ((typeof id !== 'string' && typeof id !== 'number') || !Number.isFinite(amount)) return null;

  let metadata: Record<string, unknown> = {};
  if (typeof record.metadata === 'string') {
    try {
      const parsed = JSON.parse(record.metadata);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) metadata = parsed;
    } catch {
      metadata = {};
    }
  } else if (record.metadata && typeof record.metadata === 'object' && !Array.isArray(record.metadata)) {
    metadata = record.metadata as Record<string, unknown>;
  }

  const createdAt = record.createdAt ?? record.date;
  const parsedDate = createdAt ? new Date(String(createdAt)) : null;
  const isValidDate = parsedDate && !Number.isNaN(parsedDate.getTime());
  const stringValue = (...values: unknown[]) => {
    const result = values.find((item) => typeof item === 'string' && item.trim());
    return typeof result === 'string' ? result : undefined;
  };

  return {
    id,
    type: stringValue(record.type) ?? 'transaction',
    description: stringValue(record.description) ?? 'Transaction',
    amount,
    status: stringValue(record.status) ?? 'unknown',
    date: isValidDate ? parsedDate!.toLocaleDateString() : 'Date unavailable',
    time: isValidDate ? parsedDate!.toLocaleTimeString() : undefined,
    reference: stringValue(record.reference, metadata.reference, metadata.referenceId),
    method: stringValue(record.method, metadata.method, metadata.paymentMethod),
    fee: Number.isFinite(Number(record.fee ?? metadata.fee)) ? Number(record.fee ?? metadata.fee) : undefined,
    netAmount: Number.isFinite(Number(record.netAmount ?? metadata.netAmount))
      ? Number(record.netAmount ?? metadata.netAmount)
      : undefined,
  };
}

function signedAmount(transaction: TransactionRecord): number {
  const amount = Math.abs(transaction.amount);
  return ['withdrawal', 'investment', 'upgrade'].includes(transaction.type.toLowerCase()) ? -amount : amount;
}

export default function RefinedTransactionsPage() {
  const { user } = useAuthStore();
  const { t } = useLanguage();
  
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTxn, setSelectedTxn] = useState<TransactionRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const requestId = useRef(0);

  const fetchTransactions = useCallback(async () => {
    const currentRequestId = ++requestId.current;
    if (!user?.id) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);
    try {
      const pageSize = 100;
      const response = await transactionsApi.getUserTransactions(String(user.id), { limit: pageSize, offset: 0 });
      if (requestId.current !== currentRequestId) return;
      const getRecords = (result: unknown): unknown[] => {
        if (Array.isArray(result)) return result;
        if (result && typeof result === 'object' && Array.isArray((result as { data?: unknown }).data)) {
          return (result as { data: unknown[] }).data;
        }
        return [];
      };
      const records = getRecords(response);
      const reportedTotal = Number(response?.total);
      const totalRecords = Number.isFinite(reportedTotal) ? Math.max(reportedTotal, records.length) : records.length;

      for (let offset = pageSize; offset < totalRecords; offset += pageSize * 4) {
        const offsets = Array.from(
          { length: Math.min(4, Math.ceil((totalRecords - offset) / pageSize)) },
          (_, index) => offset + index * pageSize
        );
        const pages = await Promise.all(
          offsets.map((pageOffset) =>
            transactionsApi.getUserTransactions(String(user.id), { limit: pageSize, offset: pageOffset })
          )
        );
        if (requestId.current !== currentRequestId) return;
        pages.forEach((page) => records.push(...getRecords(page)));
      }

      setTransactions(records.map(normalizeTransaction).filter((transaction): transaction is TransactionRecord => transaction !== null));
      setCurrentPage(1);
    } catch {
      if (requestId.current === currentRequestId) {
        setLoadError('Unable to load your transaction history. Please try again.');
      }
    } finally {
      if (requestId.current === currentRequestId) setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void fetchTransactions();
    return () => {
      requestId.current += 1;
    };
  }, [fetchTransactions]);

  // Copy reference handler
  const handleCopyRef = async (ref: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(ref);
      setCopiedId(ref);
      toast.success('Reference copied to clipboard');
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Could not copy the reference.');
    }
  };

  // Export statement handler
  const handleExportStatement = () => {
    const headers = ['Transaction ID', 'Type', 'Description', 'Amount ($)', 'Status', 'Date', 'Reference', 'Method'];
    const escapeCsvCell = (value: string | number) => {
      const rawValue = String(value);
      const safeValue = typeof value === 'string' && /^[=+\-@\t\r]/.test(rawValue) ? `'${rawValue}` : rawValue;
      return `"${safeValue.replace(/"/g, '""')}"`;
    };
    const csvRows = [
      headers.map(escapeCsvCell).join(','),
      ...filteredTransactions.map((transaction) =>
        [
          transaction.id,
          transaction.type,
          transaction.description,
          transaction.amount,
          transaction.status,
          transaction.date,
          transaction.reference || 'N/A',
          transaction.method || 'N/A',
        ].map(escapeCsvCell).join(',')
      ),
    ];
    const blob = new Blob([`\uFEFF${csvRows.join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EmpireOfForex_Statement_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Transaction statement exported as CSV!');
  };

  const handlePrintReceipt = (transaction: TransactionRecord) => {
    const printWindow = window.open('', '_blank', 'width=760,height=800');
    if (!printWindow) {
      toast.error('Allow pop-ups to print this receipt.');
      return;
    }

    const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[character]!);
    const amount = signedAmount(transaction);
    const details = [
      ['Transaction ID', String(transaction.id)],
      ['Type', transaction.type],
      ['Description', transaction.description],
      ['Payment method', transaction.method || 'Not provided'],
      ['Date', `${transaction.date} ${transaction.time ?? ''}`.trim()],
      ...(transaction.reference ? [['Reference', transaction.reference]] : []),
    ];

    printWindow.document.write(`<!doctype html><html><head><title>Receipt ${escapeHtml(String(transaction.id))}</title><style>
      body{font:14px Arial,sans-serif;color:#18181b;margin:40px auto;max-width:680px;padding:0 24px}
      header{border-bottom:2px solid #f97316;padding-bottom:16px;margin-bottom:24px}
      h1{font-size:22px;margin:0 0 6px}p{color:#52525b;margin:0}
      .amount{font-size:30px;font-weight:700;margin:24px 0 6px}.status{color:#52525b;text-transform:capitalize}
      dl{margin-top:24px}dl div{display:flex;justify-content:space-between;gap:24px;padding:12px 0;border-bottom:1px solid #e4e4e7}
      dt{color:#52525b}dd{margin:0;text-align:right;overflow-wrap:anywhere}
      @media print{body{margin:0 auto;padding:0 12px}}
    </style></head><body><header><h1>Transaction receipt</h1><p>Empire of Forex</p></header>
      <p class="amount">${amount < 0 ? '-' : '+'}$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
      <p class="status">${escapeHtml(transaction.status)}</p><dl>${details.map(([label, value]) =>
        `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`
      ).join('')}</dl></body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // Filtered dataset
  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.reference && item.reference.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.method && item.method.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = typeFilter === 'all' || item.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [transactions, searchQuery, typeFilter, statusFilter]);

  // Paginated dataset
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  // Financial Summaries
  const stats = useMemo(() => {
    const totalDeposits = transactions
      .filter((t) => t.type === 'deposit' && t.status === 'completed')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalProfits = transactions
      .filter((t) => t.type === 'profit' && t.status === 'completed')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const totalWithdrawals = transactions
      .filter((t) => t.type === 'withdrawal' && t.status === 'completed')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const netBalance = totalDeposits + totalProfits - totalWithdrawals;

    return { totalDeposits, totalProfits, totalWithdrawals, netBalance };
  }, [transactions]);

  const hasLoadedTransactions = !isLoading && !loadError;

  useEffect(() => {
    if (!selectedTxn) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedTxn(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTxn]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  // Helper for Type Badges & Icons
  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'deposit':
        return {
          icon: <ArrowUpRight className="w-4 h-4 text-emerald-400" />,
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          label: 'Deposit',
        };
      case 'withdrawal':
        return {
          icon: <ArrowDownLeft className="w-4 h-4 text-rose-400" />,
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          label: 'Withdrawal',
        };
      case 'profit':
        return {
          icon: <TrendingUp className="w-4 h-4 text-amber-400" />,
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          label: 'Profit Distribution',
        };
      case 'upgrade':
        return {
          icon: <Crown className="w-4 h-4 text-indigo-400" />,
          bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
          label: 'Plan Upgrade',
        };
      default:
        return {
          icon: <Wallet className="w-4 h-4 text-zinc-400" />,
          bg: 'bg-zinc-500/10 border-zinc-500/30 text-zinc-300',
          label: type,
        };
    }
  };

  // Helper for Status Badges
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            Processing
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-500/10 border border-zinc-500/30 text-zinc-400 text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 p-2 sm:p-4 text-white font-poppins selection:bg-fiery-orange selection:text-white">
      
      {/* ══ HEADER ══ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-fiery-orange/10 border border-fiery-orange/20 text-xs font-bold text-fiery-amber mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-fiery-orange" />
            {t('userDashboard.transactions.badge', 'TRANSACTION LEDGER')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t('userDashboard.transactions.title', 'Transaction')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-fiery-orange to-fiery-amber">{t('userDashboard.transactions.titleHighlight', 'History')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {t('userDashboard.transactions.subtitle', 'Review your deposits, profits, withdrawals, and plan activity.')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTransactions}
            disabled={isLoading}
            className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 hover:text-white transition-all disabled:opacity-50"
            title="Refresh Transactions"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-fiery-orange' : ''}`} />
          </button>

          <button
            onClick={handleExportStatement}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-fiery-orange via-fiery-red to-fiery-amber text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-fiery hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Download className="w-4 h-4 text-black" />
            {t('userDashboard.transactions.exportStatement', 'Export Statement (CSV)')}
          </button>
        </div>
      </div>

        {loadError && (
          <div role="alert" className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            <span>{loadError}</span>
            <button
              onClick={() => void fetchTransactions()}
              disabled={isLoading}
              className="inline-flex items-center gap-2 self-start sm:self-auto font-semibold text-white hover:text-rose-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Retry
            </button>
          </div>
        )}

      {/* ══ SUMMARY STATS ══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Net Flow */}
        <div className="bg-card-dark/80 backdrop-blur-xl p-5 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-fiery-orange/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Net Completed Flow</span>
            <div className="w-9 h-9 rounded-xl bg-fiery-orange/10 border border-fiery-orange/20 flex items-center justify-center text-fiery-orange">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black font-mono text-white">
              {hasLoadedTransactions ? `$${stats.netBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-fiery-amber" />
              Completed deposits + profits - withdrawals
            </p>
          </div>
        </div>

        {/* Deposits */}
        <div className="bg-card-dark/80 backdrop-blur-xl p-5 rounded-3xl border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400/90 uppercase tracking-wider">Total Deposits</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black font-mono text-emerald-400">
              {hasLoadedTransactions ? `+$${stats.totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">Total funded capital</p>
          </div>
        </div>

        {/* Profits */}
        <div className="bg-card-dark/80 backdrop-blur-xl p-5 rounded-3xl border border-amber-500/20 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400/90 uppercase tracking-wider">Total Signal Profits</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black font-mono text-amber-400">
              {hasLoadedTransactions ? `+$${stats.totalProfits.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">Calculated distributions</p>
          </div>
        </div>

        {/* Withdrawals */}
        <div className="bg-card-dark/80 backdrop-blur-xl p-5 rounded-3xl border border-rose-500/20 relative overflow-hidden group hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400/90 uppercase tracking-wider">Total Withdrawals</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black font-mono text-rose-400">
              {hasLoadedTransactions ? `-$${stats.totalWithdrawals.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">Processed payout volume</p>
          </div>
        </div>

      </div>

      {/* ══ CONTROLS: SEARCH & FILTERS ══ */}
      <div className="bg-card-dark/60 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-white/10 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by ID, reference, description or payment method..."
              className="w-full bg-panel-dark/80 border border-white/10 rounded-2xl pl-11 pr-10 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-fiery-orange focus:ring-1 focus:ring-fiery-orange/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Activity' },
              { id: 'deposit', label: 'Deposits' },
              { id: 'profit', label: 'Profits' },
              { id: 'withdrawal', label: 'Withdrawals' },
              { id: 'upgrade', label: 'Subscriptions' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  setTypeFilter(btn.id);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  typeFilter === btn.id
                    ? 'bg-fiery-orange  border-fiery-orange shadow-md'
                    : 'bg-panel-dark  border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

        </div>

        {/* Secondary Filter: Status */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-fiery-orange" />
            <span>Filter Status:</span>
            {['all', 'completed', 'pending', 'failed'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`capitalize px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === st ? 'text-fiery-amber font-bold bg-fiery-orange/10' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="hidden sm:block text-[11px] text-zinc-500">
            Showing <strong className="text-white">{filteredTransactions.length}</strong> matching records
          </div>
        </div>
      </div>

      {/* ══ TRANSACTIONS TABLE & CARD FEED ══ */}
      <div className="bg-card-dark/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-panel-dark/90 border-b border-white/10 text-[11px] font-extrabold uppercase tracking-wider text-zinc-400">
                <th className="py-4 px-6">Transaction ID / Type</th>
                <th className="py-4 px-6">Description & Method</th>
                <th className="py-4 px-6">Reference Tag</th>
                <th className="py-4 px-6">Date & Time</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Amount ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-zinc-400" role="status">
                    <RefreshCw className="w-5 h-5 mx-auto mb-2 animate-spin text-fiery-orange" />
                    Loading transactions...
                  </td>
                </tr>
              ) : paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-zinc-500">
                    <FileText className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold">{transactions.length === 0 ? 'No transactions yet.' : 'No transactions match your filters.'}</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setTypeFilter('all');
                        setStatusFilter('all');
                      }}
                      className="mt-3 text-xs text-fiery-amber underline font-bold"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((txn) => {
                  const typeMeta = getTypeBadge(txn.type);
                  const displayAmount = signedAmount(txn);
                  const isPositive = displayAmount > 0;
                  return (
                    <tr
                      key={txn.id}
                      onClick={() => setSelectedTxn(txn)}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      {/* ID & Type */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl border ${typeMeta.bg}`}>
                            {typeMeta.icon}
                          </div>
                          <div>
                            <span className="font-mono font-bold text-white block group-hover:text-fiery-amber transition-colors">
                              {txn.id}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-semibold">{typeMeta.label}</span>
                          </div>
                        </div>
                      </td>

                      {/* Description & Method */}
                      <td className="py-4 px-6">
                        <span className="font-semibold text-white block">{txn.description}</span>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">{txn.method || 'Standard Direct Desk'}</span>
                      </td>

                      {/* Reference */}
                      <td className="py-4 px-6">
                        {txn.reference ? (
                          <button
                            onClick={(e) => handleCopyRef(txn.reference!, e)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-panel-dark border border-white/10 text-[11px] font-mono text-zinc-300 hover:border-fiery-orange/40 hover:text-white transition-all"
                            title="Click to copy reference"
                          >
                            <span>{txn.reference}</span>
                            {copiedId === txn.reference ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-zinc-500" />
                            )}
                          </button>
                        ) : (
                          <span className="text-zinc-600 font-mono">—</span>
                        )}
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-6">
                        <span className="text-white block font-medium">{txn.date}</span>
                        <span className="text-[10px] text-zinc-500">{txn.time || '12:00:00'}</span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">{getStatusBadge(txn.status)}</td>

                      {/* Amount */}
                      <td className="py-4 px-6 text-right">
                        <span
                          className={`font-mono text-sm font-extrabold ${
                            isPositive ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isPositive ? '+' : isPositive === false ? '-' : ''}
                          ${Math.abs(displayAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] text-zinc-500 block">USD</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Feed View */}
        <div className="block md:hidden divide-y divide-white/5">
          {isLoading ? (
            <div className="p-8 text-center text-zinc-400" role="status">
              <RefreshCw className="w-5 h-5 mx-auto mb-2 animate-spin text-fiery-orange" />
              <p className="text-xs font-semibold">Loading transactions...</p>
            </div>
          ) : paginatedTransactions.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 space-y-2">
              <FileText className="w-8 h-8 mx-auto text-zinc-600" />
              <p className="text-xs font-semibold">{transactions.length === 0 ? 'No transactions yet.' : 'No transactions match your filters.'}</p>
            </div>
          ) : (
            paginatedTransactions.map((txn) => {
              const typeMeta = getTypeBadge(txn.type);
              const displayAmount = signedAmount(txn);
              const isPositive = displayAmount > 0;
              return (
                <div
                  key={txn.id}
                  onClick={() => setSelectedTxn(txn)}
                  className="p-4 space-y-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl border ${typeMeta.bg}`}>{typeMeta.icon}</div>
                      <div>
                        <span className="text-xs font-bold text-white block">{txn.description}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">{txn.id}</span>
                      </div>
                    </div>
                    <span
                      className={`font-mono text-sm font-black ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPositive ? '+' : '-'}${Math.abs(displayAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                    <span className="text-zinc-500">{txn.date}</span>
                    <div>{getStatusBadge(txn.status)}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ══ PAGINATION FOOTER ══ */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-panel-dark/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-400">
            Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-panel-dark border border-white/10 text-xs font-bold text-zinc-300 hover:text-white disabled:opacity-40 disabled:hover:text-zinc-300 transition-all flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <span className="px-3.5 py-2 rounded-xl bg-fiery-orange/15 border border-fiery-orange/30 text-xs font-black text-fiery-amber">
              {currentPage}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 rounded-xl bg-panel-dark border border-white/10 text-xs font-bold text-zinc-300 hover:text-white disabled:opacity-40 disabled:hover:text-zinc-300 transition-all flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ══ TRANSACTION RECEIPT / DETAIL MODAL ══ */}
      <AnimatePresence>
        {selectedTxn && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedTxn(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="transaction-receipt-title"
              tabIndex={-1}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#09090D] border border-white/10 rounded-3xl p-6 shadow-2xl text-white space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-fiery-orange" />
                  <h3 id="transaction-receipt-title" className="text-lg font-black">Transaction Receipt</h3>
                </div>
                <button
                  onClick={() => setSelectedTxn(null)}
                  aria-label="Close transaction receipt"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Top Amount Banner */}
              <div className="bg-panel-dark p-5 rounded-2xl border border-white/5 text-center space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Gross Value</span>
                <p className={`text-3xl font-black font-mono ${signedAmount(selectedTxn) > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {signedAmount(selectedTxn) > 0 ? '+' : '-'}${Math.abs(signedAmount(selectedTxn)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <div className="pt-2">{getStatusBadge(selectedTxn.status)}</div>
              </div>

              {/* Receipt Specs Grid */}
              <div className="space-y-3 bg-white/[0.02] p-4 rounded-2xl border border-white/5 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-zinc-400 font-sans">Transaction ID</span>
                  <span className="text-white font-bold">{selectedTxn.id}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-zinc-400 font-sans">Type Category</span>
                  <span className="text-fiery-amber font-bold capitalize">{selectedTxn.type}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-zinc-400 font-sans">Description</span>
                  <span className="text-white font-sans text-right max-w-[200px]">{selectedTxn.description}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-zinc-400 font-sans">Payment Method</span>
                  <span className="text-zinc-300 font-sans">{selectedTxn.method || 'Standard Direct Transfer'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-zinc-400 font-sans">Date & Timestamp</span>
                  <span className="text-zinc-300">{selectedTxn.date} {selectedTxn.time || ''}</span>
                </div>
                {selectedTxn.reference && (
                  <div className="flex justify-between py-1.5">
                    <span className="text-zinc-400 font-sans">Reference Code</span>
                    <span className="text-emerald-400 font-bold">{selectedTxn.reference}</span>
                  </div>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handlePrintReceipt(selectedTxn)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-fiery-orange to-fiery-amber text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-fiery hover:scale-[1.02] transition-all"
                >
                  <Download className="w-4 h-4 text-black" /> Print / Save as PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
