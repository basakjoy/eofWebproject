'use client';

import { useCallback, useEffect, useState } from 'react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { Check, Eye, RefreshCw, X } from 'lucide-react';
import { transactionsApi } from '@/lib/transactionsApi';
import { useLanguage } from '@/context/LanguageContext';

type Deposit = {
  id: string;
  userId: string;
  amount: number | string;
  status: string;
  description?: string | null;
  createdAt: string;
  user?: { name?: string | null; email?: string | null };
};

const PAGE_SIZE = 25;

const getErrorMessage = (error: unknown, fallback: string) => {
  const response = error as { response?: { data?: { message?: string } } };
  return response.response?.data?.message || fallback;
};

export default function DepositApproval() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadDeposits = useCallback(async () => {
    setLoading(true);
    try {
      const response = await transactionsApi.getAllTransactions({ type: 'deposit', limit: PAGE_SIZE, offset: page * PAGE_SIZE });
      setDeposits(Array.isArray(response?.data) ? response.data : []);
      setTotal(Number(response?.total ?? 0));
      setError('');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to load deposit requests'));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { void loadDeposits(); }, [loadDeposits]);

  const updateStatus = async (id: string, status: 'completed' | 'failed') => {
    setUpdatingId(id);
    try {
      await transactionsApi.updateTransaction(id, { status });
      await loadDeposits();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to update deposit'));
    } finally {
      setUpdatingId(null);
    }
  };

  const { t } = useLanguage();
  const formatStatus = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Card className="text-white">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.depositRequests', 'Deposit Requests')}</h2>
          <p className="mt-1 text-sm text-slate-400">Review and record incoming deposits.</p>
        </div>
        <button onClick={() => void loadDeposits()} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/10 disabled:opacity-50">
          <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} /> {t('admin.refresh', 'Refresh')}
        </button>
      </div>
      {error && <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>}
      <div className="overflow-x-auto">
        {loading ? <div className="py-12 text-center text-sm text-slate-400">{t('common.loading', 'Loading deposit requests...')}</div> : deposits.length === 0 ? <div className="py-12 text-center text-sm text-slate-400">{t('common.noData', 'No deposit requests found.')}</div> : <table className="w-full text-sm">
          <thead className="border-b border-white/10 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">{t('admin.users', 'User')}</th>
              <th className="px-4 py-3 text-left font-semibold">{t('transactions.amount', 'Amount')}</th>
              <th className="px-4 py-3 text-left font-semibold">{t('transactions.date', 'Date')}</th>
              <th className="px-4 py-3 text-left font-semibold">{t('transactions.status', 'Status')}</th>
              <th className="px-4 py-3 text-left font-semibold">{t('common.actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((deposit) => (
              <tr key={deposit.id} className="border-b border-white/10 hover:bg-white/[0.03]">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{deposit.user?.name || deposit.user?.email || 'Unknown user'}</p>
                    <p className="text-xs text-slate-500">{deposit.userId}</p>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">${Number(deposit.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-3">{new Date(deposit.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Badge
                    label={formatStatus(deposit.status)}
                    variant={
                      deposit.status === 'completed'
                        ? 'success'
                        : deposit.status === 'pending'
                        ? 'warning'
                        : 'danger'
                    }
                    size="sm"
                  />
                </td>
                <td className="flex gap-2 px-4 py-3">
                  {deposit.status === 'pending' && (
                    <>
                      <button
                        onClick={() => void updateStatus(deposit.id, 'completed')}
                        disabled={updatingId === deposit.id}
                        title="Approve deposit"
                        className="rounded p-2 text-green-400 hover:bg-green-500/10 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => void updateStatus(deposit.id, 'failed')}
                        disabled={updatingId === deposit.id}
                        title="Reject deposit"
                        className="rounded p-2 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button title="View deposit details" onClick={() => window.alert(`${deposit.description || 'Deposit request'}\n\nTransaction ID: ${deposit.id}\nUser ID: ${deposit.userId}`)} className="rounded p-2 text-blue-400 hover:bg-blue-500/10">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-slate-400">
        <span>{total ? `Showing ${page * PAGE_SIZE + 1}-${Math.min((page + 1) * PAGE_SIZE, total)} of ${total}` : 'No results'}</span>
        <div className="flex gap-2">
          <button disabled={page === 0 || loading} onClick={() => setPage(value => value - 1)} className="rounded border border-white/10 px-3 py-1 hover:bg-white/10 disabled:opacity-40">{t('common.back', 'Previous')}</button>
          <button disabled={(page + 1) * PAGE_SIZE >= total || loading} onClick={() => setPage(value => value + 1)} className="rounded border border-white/10 px-3 py-1 hover:bg-white/10 disabled:opacity-40">{t('common.next', 'Next')}</button>
        </div>
      </div>
    </Card>
  );
}
