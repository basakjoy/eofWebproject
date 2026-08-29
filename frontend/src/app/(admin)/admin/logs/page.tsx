'use client';

import Card from '@/components/common/Card';
import Table from '@/components/common/Table';
import Badge from '@/components/common/Badge';
import { RefreshCw, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';

type Log = { id: string; createdAt: string; action: string; adminId: string; status: string; reason?: string | null; targetId?: string | null; targetType?: string | null; admin?: { user?: { name?: string; email?: string } } };
const PAGE_SIZE = 25;

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminApi.getAdminLogs({ action: query.trim() || undefined, limit: PAGE_SIZE, offset: page * PAGE_SIZE });
      setLogs(Array.isArray(response?.data) ? response.data : []);
      setTotal(Number(response?.total ?? 0));
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load system logs');
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => { void loadLogs(); }, [loadLogs]);

  const rows = logs.map(log => ({
    timestamp: log.createdAt ? new Date(log.createdAt).toLocaleString() : '—',
    action: log.action,
    admin: log.admin?.user?.name || log.admin?.user?.email || log.adminId,
    details: [log.targetType, log.targetId, log.reason].filter(Boolean).join(' · ') || '—',
    status: log.status,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">System Logs</h1>
          <p className="mt-1 text-slate-400">Monitor platform activity and actions</p>
        </div>
        <button
          onClick={() => void loadLogs()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10 disabled:opacity-60"
        >
          <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
          Refresh
        </button>
      </div>
      <Card>
        <div className="mb-5 flex max-w-md items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            value={query}
            onChange={event => { setPage(0); setQuery(event.target.value); }}
            placeholder="Search actions..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>
        {error && (
          <div className="mb-4 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}
        {loading ? (
          <div className="py-12 text-center text-sm text-slate-400">Loading logs...</div>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">No system logs found.</div>
        ) : (
          <Table
            columns={[
              { key: 'timestamp', label: 'Timestamp' },
              { key: 'action', label: 'Action' },
              { key: 'admin', label: 'Admin/System' },
              { key: 'details', label: 'Details' },
              { key: 'status', label: 'Status', render: value => <Badge label={value} variant={value === 'success' ? 'success' : 'danger'} size="sm" /> },
            ]}
            data={rows}
          />
        )}
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-slate-400">
          <span>{total ? `Showing ${page * PAGE_SIZE + 1}-${Math.min((page + 1) * PAGE_SIZE, total)} of ${total}` : 'No results'}</span>
          <div className="flex gap-2">
            <button
              disabled={page === 0 || loading}
              onClick={() => setPage(value => value - 1)}
              className="rounded border border-white/10 bg-white/[0.03] px-3 py-1 text-slate-300 transition-colors hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/[0.03]"
            >
              Previous
            </button>
            <button
              disabled={(page + 1) * PAGE_SIZE >= total || loading}
              onClick={() => setPage(value => value + 1)}
              className="rounded border border-white/10 bg-white/[0.03] px-3 py-1 text-slate-300 transition-colors hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/[0.03]"
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}