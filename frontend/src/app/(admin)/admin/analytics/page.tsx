'use client';

import Card from '@/components/common/Card';
import Table from '@/components/common/Table';
import Badge from '@/components/common/Badge';
import { RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';

type DashboardStats = {
  users: { total: number; active: number; newToday: number; newThisMonth: number };
  investments: { total: number; active: number; totalInvestedAmount: number; totalProfitDistributed: number };
  signals: { total: number; active: number };
  withdrawals: { pending: number; pendingAmount: number };
  support: { openTickets: number };
  blog: { total: number; published: number };
};
type ActivityLog = { id: string; createdAt: string; action: string; adminId: string; status: string };

const money = (value: number) => `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const [statsResponse, logsResponse] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getAdminLogs({ limit: 10 }),
      ]);
      setStats(statsResponse?.data ?? null);
      setLogs(Array.isArray(logsResponse?.data) ? logsResponse.data : []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadAnalytics(); }, [loadAnalytics]);

  const analyticsData = [
    { metric: 'Total Users', value: stats?.users.total ?? 0, detail: `${stats?.users.active ?? 0} active` },
    { metric: 'New Users This Month', value: stats?.users.newThisMonth ?? 0, detail: `${stats?.users.newToday ?? 0} today` },
    { metric: 'Total Invested', value: money(stats?.investments.totalInvestedAmount ?? 0), detail: `${stats?.investments.active ?? 0} active plans` },
    { metric: 'Active Signals', value: stats?.signals.active ?? 0, detail: `${stats?.signals.total ?? 0} total signals` },
    { metric: 'Profit Distributed', value: money(stats?.investments.totalProfitDistributed ?? 0), detail: 'Across all investments' },
    { metric: 'Pending Withdrawals', value: stats?.withdrawals.pending ?? 0, detail: money(stats?.withdrawals.pendingAmount ?? 0) },
    { metric: 'Open Support Tickets', value: stats?.support.openTickets ?? 0, detail: 'Require attention' },
    { metric: 'Published Articles', value: stats?.blog.published ?? 0, detail: `${stats?.blog.total ?? 0} total articles` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-3xl font-bold text-white">Analytics</h1><p className="mt-1 text-gray-600">Live platform metrics and activity</p></div>
        <button onClick={() => void loadAnalytics()} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm disabled:opacity-60"><RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />Refresh</button>
      </div>
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {analyticsData.map((data) => <Card key={data.metric}><p className="text-sm font-medium text-gray-600">{data.metric}</p><p className="mt-2 text-3xl font-bold">{loading ? '—' : data.value}</p><p className="mt-2 text-sm text-gray-500">{data.detail}</p></Card>)}
      </div>
      <Card>
        <h2 className="mb-6 text-2xl font-bold">Recent Activity</h2>
        <Table columns={[{ key: 'createdAt', label: 'Timestamp', render: value => value ? new Date(value).toLocaleString() : '—' }, { key: 'action', label: 'Action' }, { key: 'adminId', label: 'Admin' }, { key: 'status', label: 'Status', render: value => <Badge label={value} variant={value === 'success' ? 'success' : 'danger'} size="sm" /> }]} data={logs} />
        {!loading && logs.length === 0 && <p className="py-6 text-center text-sm text-gray-500">No activity recorded yet.</p>}
      </Card>
    </div>
  );
}
