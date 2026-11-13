'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowDownUp,
  LoaderCircle,
  PiggyBank,
  RefreshCw,
  Search,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import investmentApi from '@/lib/investmentApi';

const PAGE_SIZE = 25;
const investmentStatuses = ['active', 'paused', 'completed', 'cancelled'] as const;
type InvestmentStatus = string;

interface InvestmentRecord {
  id: string;
  userId: string;
  amount: number | string;
  roi: number | string;
  plan: string;
  status: InvestmentStatus;
  createdAt: string;
  user?: { id: string; name: string | null } | null;
}

interface InvestmentResponse {
  success: boolean;
  data?: InvestmentRecord[];
  total?: number;
  message?: string;
}

const money = (value: number | string): string =>
  `$${Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const errorMessage = (error: unknown): string => {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response &&
    error.response.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message;
  }
  return error instanceof Error ? error.message : 'Unable to load investments.';
};

const statusClass: Record<InvestmentStatus, string> = {
  active: 'border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-200',
  paused: 'border-amber-300/20 bg-amber-300/[0.08] text-amber-200',
  completed: 'border-sky-300/20 bg-sky-300/[0.08] text-sky-200',
  cancelled: 'border-rose-300/20 bg-rose-300/[0.08] text-rose-200',
  pending: 'border-white/10 bg-white/[0.04] text-slate-300',
};

const isInvestmentStatus = (value: string): value is (typeof investmentStatuses)[number] =>
  investmentStatuses.some((status) => status === value);

export default function InvestmentControls() {
  const [investments, setInvestments] = useState<InvestmentRecord[]>([]);
  const [profitInputs, setProfitInputs] = useState<Record<string, string>>({});
  const [statusInputs, setStatusInputs] = useState<Record<string, InvestmentStatus>>({});
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadInvestments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await investmentApi.getAllInvestments({
        status: statusFilter || undefined,
        limit: PAGE_SIZE,
        offset,
      }) as InvestmentResponse;
      if (!response.success) throw new Error(response.message || 'Unable to load investments.');

      const rows = response.data ?? [];
      setInvestments(rows);
      setTotal(response.total ?? 0);
      setProfitInputs(Object.fromEntries(rows.map((investment) => [
        investment.id,
        String(Number(investment.amount) > 0
          ? Number(investment.roi) / Number(investment.amount) * 100
          : 0),
      ])));
      setStatusInputs(Object.fromEntries(rows.map((investment) => [
        investment.id,
        investment.status,
      ])));
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setLoading(false);
    }
  }, [offset, statusFilter]);

  useEffect(() => {
    void loadInvestments();
  }, [loadInvestments]);

  const filteredInvestments = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return investments;
    return investments.filter((investment) => [
      investment.user?.name,
      investment.plan,
      investment.id,
    ].some((value) => value?.toLowerCase().includes(query)));
  }, [investments, search]);

  const activeOnPage = investments.filter((investment) => investment.status === 'active').length;
  const investedOnPage = investments.reduce((sum, investment) => sum + Number(investment.amount || 0), 0);

  const updateInvestment = async (investment: InvestmentRecord) => {
    const profitPercent = Number(profitInputs[investment.id]);
    if (!Number.isFinite(profitPercent) || profitPercent < 0 || profitPercent > 100) {
      toast.error('ROI percentage must be between 0 and 100.');
      return;
    }

    setUpdatingId(investment.id);
    try {
      const selectedStatus = statusInputs[investment.id] ?? investment.status;
      const response = await investmentApi.updateInvestment(investment.id, {
        profitPercent,
        ...(selectedStatus !== investment.status && isInvestmentStatus(selectedStatus)
          ? { status: selectedStatus }
          : {}),
      });
      if (!response?.success) throw new Error(response?.message || 'Unable to update investment.');
      toast.success('Investment controls updated.');
      await loadInvestments();
    } catch (cause) {
      toast.error(errorMessage(cause));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-full bg-[#080b12] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              <PiggyBank className="h-4 w-4" aria-hidden="true" />
              Portfolio operations
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Investment controls
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Review platform investments and manage ROI and investment status.
              Changes are applied per investment.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadInvestments()}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            Refresh
          </button>
        </header>

        <section aria-label="Investment summary" className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Investments in view', value: total.toLocaleString(), icon: PiggyBank },
            { label: 'Active on this page', value: activeOnPage.toLocaleString(), icon: TrendingUp },
            { label: 'Principal on this page', value: money(investedOnPage), icon: ArrowDownUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-white/10 bg-[#0b1019] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
                <Icon className="h-4 w-4 text-amber-300" aria-hidden="true" />
              </div>
              <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-white">{value}</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.025]">
          <div className="flex flex-col gap-4 border-b border-white/10 p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Investment portfolio</h2>
              <p className="mt-1 text-xs text-slate-400">
                Adjust target ROI and status, then apply changes to that investment.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:w-auto">
              <label className="relative">
                <span className="sr-only">Search investments</span>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search user, plan, ID"
                  className="min-h-11 w-full rounded-lg border border-white/10 bg-[#0b1019] pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20 sm:w-56"
                />
              </label>
              <label>
                <span className="sr-only">Filter by investment status</span>
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setOffset(0);
                    setStatusFilter(event.target.value);
                  }}
                  className="min-h-11 w-full rounded-lg border border-white/10 bg-[#0b1019] px-3 text-sm text-slate-200 focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20 sm:w-44"
                >
                  <option value="">All statuses</option>
                  {investmentStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {error ? (
            <div role="alert" className="m-4 flex items-start gap-3 rounded-lg border border-rose-300/20 bg-rose-300/[0.06] p-4 text-sm text-rose-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <div className="flex-1">{error}</div>
              <button
                type="button"
                onClick={() => void loadInvestments()}
                className="min-h-11 rounded-md border border-rose-200/20 px-3 text-xs font-semibold hover:bg-rose-200/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-200"
              >
                Retry
              </button>
            </div>
          ) : loading ? (
            <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-slate-400" role="status">
              <LoaderCircle className="h-5 w-5 animate-spin text-amber-300" aria-hidden="true" />
              Loading investments…
            </div>
          ) : filteredInvestments.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
              <PiggyBank className="h-8 w-8 text-slate-600" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-slate-300">No matching investments</p>
              <p className="mt-1 text-xs text-slate-500">Try another search or status filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-white/10 bg-white/[0.02] text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Investor</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Plan</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Principal</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Current return</th>
                    <th scope="col" className="px-4 py-3 font-semibold">ROI %</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredInvestments.map((investment) => {
                    const selectedStatus = statusInputs[investment.id] ?? investment.status;
                    return (
                    <tr key={investment.id} className="align-middle transition hover:bg-white/[0.025]">
                      <td className="max-w-56 px-4 py-3">
                        <span className="block truncate font-medium text-slate-200">
                          {investment.user?.name || 'Unknown investor'}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-slate-500">
                          {investment.userId}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{investment.plan || 'General'}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-200">
                        {money(investment.amount)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-amber-200">
                        {money(investment.roi)}
                      </td>
                      <td className="px-4 py-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={0.1}
                            inputMode="decimal"
                            aria-label={`ROI percentage for ${investment.user?.name || investment.userId}`}
                            value={profitInputs[investment.id] ?? '0'}
                            onChange={(event) => setProfitInputs((current) => ({
                              ...current,
                              [investment.id]: event.target.value,
                            }))}
                            className="min-h-10 w-24 rounded-md border border-white/10 bg-[#0b1019] px-2.5 text-sm text-white focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                          />
                          <span className="text-xs text-slate-500">%</span>
                        </label>
                      </td>
                      <td className="px-4 py-3">
                        <label>
                          <span className="sr-only">Status for investment {investment.id}</span>
                          <select
                            value={selectedStatus}
                            onChange={(event) => setStatusInputs((current) => ({
                              ...current,
                              [investment.id]: event.target.value,
                            }))}
                            className={`min-h-9 rounded-full border px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-300/30 ${statusClass[selectedStatus] ?? 'border-white/10 bg-white/[0.04] text-slate-300'}`}
                          >
                            {!isInvestmentStatus(selectedStatus) && (
                              <option value={selectedStatus} className="bg-[#0b1019] text-slate-100">
                                {selectedStatus}
                              </option>
                            )}
                            {investmentStatuses.map((status) => (
                              <option key={status} value={status} className="bg-[#0b1019] text-slate-100">
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                        </label>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => void updateInvestment(investment)}
                          disabled={updatingId === investment.id}
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-amber-300 px-3 text-xs font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                        >
                          {updatingId === investment.id && (
                            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                          )}
                          {updatingId === investment.id ? 'Saving' : 'Apply'}
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
            <p className="text-xs text-slate-500">
              {total
                ? `${offset + 1}–${Math.min(offset + investments.length, total)} of ${total} investments`
                : '0 investments'}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOffset((current) => Math.max(0, current - PAGE_SIZE))}
                disabled={offset === 0 || loading}
                className="min-h-11 rounded-md border border-white/10 px-3 text-xs font-medium text-slate-300 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setOffset((current) => current + PAGE_SIZE)}
                disabled={offset + PAGE_SIZE >= total || loading}
                className="min-h-11 rounded-md border border-white/10 px-3 text-xs font-medium text-slate-300 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
