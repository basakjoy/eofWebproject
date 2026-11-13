'use client';

import { FormEvent, Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Activity,
  BarChart3,
  Ban,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  FileSpreadsheet,
  KeyRound,
  LoaderCircle,
  MessageSquare,
  PiggyBank,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
  XCircle,
} from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { AdminAccessLogSession, AdminRecord, adminManagementApi } from '@/lib/adminManagementApi';
import { downloadAdminPageVisitsPdf } from '@/lib/adminActivityPdf';
import { downloadAdminPageVisitsCsv } from '@/lib/adminActivityCsv';
import { useAdminPresence } from '@/hooks/useAdminPresence';
import { useAuthStore } from '@/store/authStore';

const PAGE_SIZE = 50;
const controlShortcuts = [
  { label: 'User management', detail: 'Manage member accounts and access', href: '/super-admin/users', icon: Users },
  { label: 'Platform analytics', detail: 'Review activity and platform metrics', href: '/super-admin/analytics', icon: BarChart3 },
  { label: 'Signal manager', detail: 'Create and manage market signals', href: '/super-admin/signals', icon: TrendingUp },
  { label: 'Investment controls', detail: 'Review investments and adjust ROI or status', href: '/super-admin/investments', icon: PiggyBank },
  { label: 'Articles', detail: 'Publish and maintain platform content', href: '/super-admin/articles', icon: FileText },
  { label: 'Broker directory', detail: 'Manage broker listings and details', href: '/super-admin/brokers', icon: BriefcaseBusiness },
  { label: 'Deposit approvals', detail: 'Review incoming deposit requests', href: '/super-admin/deposits', icon: Wallet },
  { label: 'Client support', detail: 'Respond to platform support tickets', href: '/super-admin/support', icon: MessageSquare },
  { label: 'System logs', detail: 'Search platform activity records', href: '/super-admin/logs', icon: Activity },
];
const accessModules = [
  { label: 'User management', view: ['view_users'], manage: ['manage_users'] },
  { label: 'Analytics', view: ['view_analytics', 'view_reports', 'view_activity_logs'], manage: [] },
  { label: 'Signal manager', view: ['view_signals'], manage: ['create_signal', 'view_signals', 'edit_signals', 'delete_signals'] },
  { label: 'Articles', view: ['view_articles', 'view_insights'], manage: ['view_articles', 'manage_articles', 'create_insights', 'view_insights', 'edit_insights', 'delete_insights'] },
  { label: 'Broker management', view: ['view_brokers'], manage: ['view_brokers', 'manage_brokers'] },
  { label: 'Deposit approvals', view: ['view_deposits'], manage: ['view_deposits', 'manage_deposits'] },
  { label: 'Support', view: ['view_support'], manage: ['view_support', 'manage_support'] },
];

const displayIdentity = (admin: AdminRecord) => admin.username || admin.email || admin.name;
const displaySessionAdmin = (admin: AdminAccessLogSession['admin']) =>
  admin?.username || admin?.email || admin?.name || 'Deleted administrator';

const formatDateTime = (value: string | null) => value
  ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(value))
  : '—';

const formatDuration = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;
  return [hours, minutes, remainingSeconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
};

const getSessionDuration = (session: AdminAccessLogSession, online: boolean, now: number) => {
  const finish = session.logoutAt
    ? new Date(session.logoutAt).getTime()
    : online
      ? now
      : new Date(session.lastSeenAt).getTime();
  return Math.floor((finish - new Date(session.loginAt).getTime()) / 1000);
};

type ModuleAccess = 'none' | 'view' | 'manage';

const getRequestErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<{ message?: unknown }>(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') return message;
  }
  return error instanceof Error ? error.message : fallback;
};

const getModuleAccess = (permissions: string[], module: typeof accessModules[number]): ModuleAccess => {
  if (module.manage.length && module.manage.every((permission) => permissions.includes(permission))) return 'manage';
  if (module.view.some((permission) => permissions.includes(permission)) ||
    module.manage.some((permission) => permissions.includes(permission))) return 'view';
  return 'none';
};

const setModuleAccess = (
  permissions: string[],
  module: typeof accessModules[number],
  access: ModuleAccess
) => {
  const modulePermissions = [...new Set([...module.view, ...module.manage])];
  const granted = access === 'manage' ? module.manage : access === 'view' ? module.view : [];
  return [...new Set([...permissions.filter((permission) => !modulePermissions.includes(permission)), ...granted])];
};

export default function SuperAdminPage() {
  const currentUser = useAuthStore((state) => state.user);
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [sessions, setSessions] = useState<AdminAccessLogSession[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [changingStatus, setChangingStatus] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [accountRole, setAccountRole] = useState<'admin' | 'super_admin'>('admin');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [adminFilter, setAdminFilter] = useState('');
  const [offset, setOffset] = useState(0);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [sessionDetails, setSessionDetails] = useState<Record<string, AdminAccessLogSession>>({});
  const [detailLoading, setDetailLoading] = useState<string | null>(null);
  const [detailErrors, setDetailErrors] = useState<Record<string, string>>({});
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const { onlineSessionIds, connected } = useAdminPresence();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filters = useMemo(() => ({
    admin: adminFilter || undefined,
    ip: search.trim() || undefined,
    page: Math.floor(offset / PAGE_SIZE) + 1,
    limit: PAGE_SIZE,
  }), [adminFilter, offset, search]);

  const loadConsole = useCallback(async () => {
    setLoading(true);
    try {
      const [adminResult, sessionResult] = await Promise.all([
        adminManagementApi.listAdmins(),
        adminManagementApi.listAccessLogs(filters),
      ]);
      if (!adminResult.success || !sessionResult.success) {
        throw new Error(adminResult.message || sessionResult.message || 'Unable to load super-admin data');
      }
      setAdmins(adminResult.data || []);
      setSessions(sessionResult.data || []);
      setTotalSessions(sessionResult.total || 0);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getRequestErrorMessage(error, 'Unable to load super-admin data'),
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadConsole();
  }, [loadConsole]);

  useEffect(() => {
    setOffset(0);
  }, [adminFilter, search]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!connected) return;
    setSessions((current) => current.map((session) => ({
      ...session,
      online: onlineSessionIds.has(session.id),
    })));
  }, [connected, onlineSessionIds]);

  const toggleSessionDetails = async (sessionId: string) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
      return;
    }
    setExpandedSession(sessionId);
    if (sessionDetails[sessionId]) return;

    setDetailLoading(sessionId);
    setDetailErrors((current) => ({ ...current, [sessionId]: '' }));
    try {
      const result = await adminManagementApi.getAccessLog(sessionId);
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Unable to load session details');
      }
      setSessionDetails((current) => ({ ...current, [sessionId]: result.data! }));
    } catch (error) {
      setDetailErrors((current) => ({
        ...current,
        [sessionId]: getRequestErrorMessage(error, 'Unable to load session details'),
      }));
    } finally {
      setDetailLoading(null);
    }
  };

  const handleExportActivityPdf = async () => {
    setExportingPdf(true);
    setFeedback(null);
    try {
      const result = await adminManagementApi.listAllAccessLogDetails({
        admin: adminFilter || undefined,
        ip: search.trim() || undefined,
      });
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Unable to load page visits for PDF export');
      }
      await downloadAdminPageVisitsPdf(result.data, connected ? onlineSessionIds : undefined);
      const visitCount = result.data.reduce((count, session) => count + (session.pageVisits?.length || 0), 0);
      setFeedback({ type: 'success', message: `Downloaded PDF with ${visitCount} page visits across ${result.data.length} sessions.` });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getRequestErrorMessage(error, 'Unable to download page visits PDF'),
      });
    } finally {
      setExportingPdf(false);
    }
  };

  const handleExportActivityCsv = async () => {
    setExportingCsv(true);
    setFeedback(null);
    try {
      const result = await adminManagementApi.listAllAccessLogDetails({
        admin: adminFilter || undefined,
        ip: search.trim() || undefined,
      });
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Unable to load page visits for CSV export');
      }
      downloadAdminPageVisitsCsv(result.data, connected ? onlineSessionIds : undefined);
      const visitCount = result.data.reduce((count, session) => count + (session.pageVisits?.length || 0), 0);
      setFeedback({ type: 'success', message: `Downloaded CSV with ${visitCount} page visits across ${result.data.length} sessions.` });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getRequestErrorMessage(error, 'Unable to download page visits CSV'),
      });
    } finally {
      setExportingCsv(false);
    }
  };

  const activeAdmins = admins.filter((admin) => admin.status === 'active').length;
  const suspendedAdmins = admins.filter((admin) => admin.status !== 'active').length;
  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const result = await adminManagementApi.createAdmin({
        username: username.trim().toLowerCase(),
        password,
        passwordConfirm,
        role: accountRole,
        permissions: accountRole === 'admin' ? selectedPermissions : [],
      });
      if (!result.success) throw new Error(result.message || 'Could not create administrator account');
      setUsername('');
      setPassword('');
      setPasswordConfirm('');
      setSelectedPermissions([]);
      setAccountRole('admin');
      setFeedback({
        type: 'success',
        message: `${accountRole === 'admin' ? 'Administrator' : 'Super-admin'} account created successfully.`,
      });
      await loadConsole();
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getRequestErrorMessage(error, 'Could not create administrator account'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePermissionSave = async (adminId: string) => {
    setChangingStatus(adminId);
    setFeedback(null);
    try {
      const result = await adminManagementApi.updateAdminPermissions(adminId, editingPermissions);
      if (!result.success) throw new Error(result.message || 'Could not update admin permissions');
      setEditingAdminId(null);
      setFeedback({ type: 'success', message: 'Administrator access updated.' });
      await loadConsole();
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getRequestErrorMessage(error, 'Could not update admin permissions'),
      });
    } finally {
      setChangingStatus(null);
    }
  };

  const handleStatusChange = async (admin: AdminRecord) => {
    const nextStatus = admin.status === 'active' ? 'banned' : 'active';
    const verb = nextStatus === 'banned' ? 'suspend' : 'reactivate';
    if (!window.confirm(`Are you sure you want to ${verb} ${displayIdentity(admin)}?`)) return;
    const passwordConfirm = window.prompt('Enter your current password to confirm this action.');
    if (!passwordConfirm) return;

    setChangingStatus(admin.id);
    setFeedback(null);
    try {
      const result = await adminManagementApi.updateAdminStatus(admin.id, nextStatus, passwordConfirm);
      if (!result.success) throw new Error(result.message || `Could not ${verb} account`);
      setFeedback({ type: 'success', message: `Account ${nextStatus === 'active' ? 'reactivated' : 'suspended'}.` });
      await loadConsole();
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getRequestErrorMessage(error, `Could not ${verb} account`),
      });
    } finally {
      setChangingStatus(null);
    }
  };

  return (
    <div className="min-h-full bg-[#080b12] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Restricted control center
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Platform control center</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Your standalone workspace for platform operations, administrator access, and audit activity.
              Operational tools stay inside this super-admin dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadConsole()}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            Refresh activity
          </button>
        </header>

        <section aria-labelledby="platform-controls-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="platform-controls-heading" className="text-base font-semibold text-white">
                Platform controls
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Open a control area without leaving the super-admin workspace.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500">9 control areas</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {controlShortcuts.map(({ label, detail, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex min-h-[112px] items-start gap-3 rounded-xl border border-white/10 bg-[#0b1019] p-4 transition-colors hover:border-amber-300/25 hover:bg-white/[0.045] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-300/15 bg-amber-300/[0.06] text-amber-200">
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2 text-sm font-semibold text-slate-100">
                    {label}
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-amber-200" aria-hidden="true" />
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-400">{detail}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {feedback && (
          <div
            role={feedback.type === 'error' ? 'alert' : 'status'}
            className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
              feedback.type === 'error'
                ? 'border-rose-400/30 bg-rose-400/10 text-rose-200'
                : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
            }`}
          >
            {feedback.type === 'error'
              ? <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
            <span>{feedback.message}</span>
          </div>
        )}

        <section aria-label="Platform overview" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Admin accounts', value: admins.length, icon: Users, tone: 'text-sky-300' },
            { label: 'Active accounts', value: activeAdmins, icon: CheckCircle2, tone: 'text-emerald-300' },
            { label: 'Suspended accounts', value: suspendedAdmins, icon: Ban, tone: 'text-rose-300' },
            { label: 'Admin login sessions', value: totalSessions, icon: Activity, tone: 'text-amber-300' },
          ].map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
                <Icon className={`h-4 w-4 ${tone}`} aria-hidden="true" />
              </div>
              <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-white">{value}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section id="activity" className="min-w-0 scroll-mt-24 rounded-xl border border-white/10 bg-white/[0.025]">
            <div className="flex flex-col gap-4 border-b border-white/10 p-4 sm:p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <Activity className="h-5 w-5 text-amber-300" aria-hidden="true" />
                    Admin login activity
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Login, IP address, stay duration, and exit time · one login per row
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <label className="relative min-w-[220px] flex-1 sm:max-w-xs">
                    <span className="sr-only">Filter sessions by IP address</span>
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Filter by IP address"
                      className="min-h-11 w-full rounded-lg border border-white/10 bg-[#0b1019] pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => void handleExportActivityPdf()}
                    disabled={loading || exportingPdf || exportingCsv || sessions.length === 0}
                    className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {exportingPdf
                      ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                      : <Download className="h-4 w-4" aria-hidden="true" />}
                    {exportingPdf ? 'Preparing PDF…' : 'Page visits PDF'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleExportActivityCsv()}
                    disabled={loading || exportingPdf || exportingCsv || sessions.length === 0}
                    className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {exportingCsv
                      ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                      : <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />}
                    {exportingCsv ? 'Preparing CSV…' : 'Page visits CSV'}
                  </button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-medium text-slate-400">
                  <span className="mb-1.5 block">Administrator</span>
                  <select
                    value={adminFilter}
                    onChange={(event) => setAdminFilter(event.target.value)}
                    className="min-h-11 w-full rounded-lg border border-white/10 bg-[#0b1019] px-3 text-sm text-slate-200 focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                  >
                    <option value="">All administrators</option>
                    {admins.map((admin) => (
                      <option key={admin.id} value={admin.id}>{displayIdentity(admin)}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-slate-400">
                <LoaderCircle className="h-5 w-5 animate-spin text-amber-300" aria-hidden="true" />
                Loading admin login sessions…
              </div>
            ) : sessions.length === 0 ? (
              <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
                <Activity className="h-8 w-8 text-slate-600" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-slate-300">No matching admin login sessions</p>
                <p className="mt-1 text-xs text-slate-500">Try another filter or refresh to check for recent logins.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1120px] text-left text-sm">
                  <thead className="border-b border-white/10 bg-white/[0.02] text-[11px] uppercase tracking-wide text-slate-500">
                    <tr>
                      <th scope="col" className="w-12 px-3 py-3"><span className="sr-only">Session details</span></th>
                      <th scope="col" className="px-3 py-3 font-semibold">Administrator</th>
                      <th scope="col" className="px-3 py-3 font-semibold">IP address</th>
                      <th scope="col" className="px-3 py-3 font-semibold">Login date/time</th>
                      <th scope="col" className="px-3 py-3 font-semibold">Stay time</th>
                      <th scope="col" className="px-3 py-3 font-semibold">Exit date/time</th>
                      <th scope="col" className="px-3 py-3 font-semibold">Exit reason</th>
                      <th scope="col" className="px-3 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {sessions.map((session) => {
                      const online = connected ? onlineSessionIds.has(session.id) : session.online;
                      const detailsOpen = expandedSession === session.id;
                      const detail = sessionDetails[session.id];
                      return (
                        <Fragment key={session.id}>
                          <tr className="align-top transition hover:bg-white/[0.025]">
                            <td className="px-3 py-2">
                              <button
                                type="button"
                                aria-expanded={detailsOpen}
                                aria-label={`${detailsOpen ? 'Hide' : 'Show'} session details for ${displaySessionAdmin(session.admin)}`}
                                onClick={() => void toggleSessionDetails(session.id)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-400 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
                              >
                                {detailsOpen
                                  ? <ChevronDown className="h-4 w-4" aria-hidden="true" />
                                  : <ChevronRight className="h-4 w-4" aria-hidden="true" />}
                              </button>
                            </td>
                            <td className="px-3 py-3 text-xs font-medium text-slate-200">{displaySessionAdmin(session.admin)}</td>
                            <td className="px-3 py-3 font-mono text-xs text-slate-400">{session.ipAddress || '—'}</td>
                            <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-300">{formatDateTime(session.loginAt)}</td>
                            <td className="px-3 py-3 font-mono text-xs tabular-nums text-slate-300">
                              {formatDuration(getSessionDuration(session, online, now))}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-400">{formatDateTime(session.logoutAt)}</td>
                            <td className="px-3 py-3 text-xs text-slate-400">{session.exitReason?.replaceAll('_', ' ') || (online ? 'In progress' : '—')}</td>
                            <td className="px-3 py-3">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${online ? 'bg-emerald-300/10 text-emerald-200' : 'bg-slate-400/10 text-slate-400'}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-emerald-300' : 'bg-slate-500'}`} aria-hidden="true" />
                                {online ? 'Online' : 'Offline'}
                              </span>
                            </td>
                          </tr>
                          {detailsOpen && (
                            <tr>
                              <td colSpan={8} className="border-t border-white/[0.06] bg-black/10 px-4 py-5 sm:px-8">
                                {detailLoading === session.id ? (
                                  <p className="flex items-center gap-2 text-sm text-slate-400" role="status">
                                    <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading session details…
                                  </p>
                                ) : detailErrors[session.id] ? (
                                  <p className="text-sm text-rose-200" role="alert">{detailErrors[session.id]}</p>
                                ) : detail ? (
                                  <div className="grid gap-6 lg:grid-cols-3">
                                    <section className="lg:col-span-2" aria-labelledby={`dashboard-visits-${session.id}`}>
                                      <h3 id={`dashboard-visits-${session.id}`} className="text-sm font-semibold text-white">Page visits</h3>
                                      {!detail.pageVisits?.length ? (
                                        <p className="mt-3 text-sm text-slate-500">No page visits recorded for this session.</p>
                                      ) : (
                                        <ul className="mt-3 grid gap-2 sm:grid-cols-2 2xl:grid-cols-3">
                                          {detail.pageVisits.map((visit) => (
                                            <li key={visit.id} className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
                                              <p className="break-all font-mono text-xs text-amber-200">{visit.path}</p>
                                              <p className="mt-2 text-xs leading-5 text-slate-500">
                                                Entered {formatDateTime(visit.enteredAt)} · Exited {formatDateTime(visit.exitedAt)}
                                              </p>
                                              <p className="mt-1 text-xs text-slate-400">Visible stay: {formatDuration(visit.durationSec)}</p>
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </section>
                                    <section aria-labelledby={`dashboard-actions-${session.id}`}>
                                      <h3 id={`dashboard-actions-${session.id}`} className="text-sm font-semibold text-white">Successful admin actions</h3>
                                      {!detail.activities?.length ? (
                                        <p className="mt-3 text-sm text-slate-500">No sensitive actions recorded for this session.</p>
                                      ) : (
                                        <ul className="mt-3 space-y-2">
                                          {detail.activities.map((item) => (
                                            <li key={item.id} className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
                                              <p className="text-sm font-medium text-slate-200">{item.action.replaceAll('_', ' ')}</p>
                                              {item.target && <p className="mt-1 break-all font-mono text-xs text-slate-400">Target: {item.target}</p>}
                                              <p className="mt-1 text-xs text-slate-500">{formatDateTime(item.createdAt)} · {item.ipAddress || 'IP unavailable'}</p>
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </section>
                                    {session.userAgent && (
                                      <p className="break-all text-xs leading-5 text-slate-500 lg:col-span-3">
                                        User agent: {session.userAgent}
                                      </p>
                                    )}
                                  </div>
                                ) : null}
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
              <p className="text-xs text-slate-500">
                {totalSessions ? `${offset + 1}–${Math.min(offset + sessions.length, totalSessions)} of ${totalSessions} sessions` : '0 sessions'}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOffset((current) => Math.max(0, current - PAGE_SIZE))}
                  disabled={offset === 0 || loading}
                  className="min-h-11 rounded-md border border-white/10 px-3 text-xs font-medium text-slate-300 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setOffset((current) => current + PAGE_SIZE)}
                  disabled={offset + PAGE_SIZE >= totalSessions || loading}
                  className="min-h-11 rounded-md border border-white/10 px-3 text-xs font-medium text-slate-300 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section id="create-administrator" className="scroll-mt-24 rounded-xl border border-amber-300/20 bg-amber-300/[0.035] p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                <UserPlus className="h-5 w-5 text-amber-300" aria-hidden="true" />
                Create administrator
              </h2>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Create an administrator for the existing dashboard, or grant full super-admin access.
              </p>
              <form onSubmit={handleCreate} className="mt-5 space-y-4">
                <label className="block text-xs font-medium text-slate-300">
                  Account role
                  <select
                    value={accountRole}
                    onChange={(event) => setAccountRole(event.target.value as 'admin' | 'super_admin')}
                    className="mt-1.5 min-h-11 w-full rounded-lg border border-white/10 bg-[#0b1019] px-3 text-sm text-white focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                  >
                    <option value="admin">Admin — selected dashboard access</option>
                    <option value="super_admin">Super admin — full platform access</option>
                  </select>
                </label>
                <label className="block text-xs font-medium text-slate-300">
                  Username
                  <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                    minLength={3}
                    maxLength={32}
                    pattern="[A-Za-z0-9._-]+"
                    autoComplete="username"
                    className="mt-1.5 min-h-11 w-full rounded-lg border border-white/10 bg-[#0b1019] px-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                    placeholder="e.g. platform.owner"
                  />
                  <span className="mt-1.5 block text-[11px] text-slate-500">3–32 letters, numbers, dots, underscores or hyphens.</span>
                </label>
                <label className="block text-xs font-medium text-slate-300">
                  Temporary password
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={12}
                    maxLength={72}
                    autoComplete="new-password"
                    className="mt-1.5 min-h-11 w-full rounded-lg border border-white/10 bg-[#0b1019] px-3 text-sm text-white focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                  />
                  <span className="mt-1.5 block text-[11px] text-slate-500">At least 12 characters. Share securely; it is not shown again.</span>
                </label>
                <label className="block text-xs font-medium text-slate-300">
                  Confirm your current password
                  <input
                    type="password"
                    value={passwordConfirm}
                    onChange={(event) => setPasswordConfirm(event.target.value)}
                    required
                    maxLength={72}
                    autoComplete="current-password"
                    className="mt-1.5 min-h-11 w-full rounded-lg border border-white/10 bg-[#0b1019] px-3 text-sm text-white focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                  />
                  <span className="mt-1.5 block text-[11px] text-slate-500">Required to verify this privileged action. It is never stored in access logs.</span>
                </label>
                {accountRole === 'admin' ? (
                  <fieldset className="space-y-2">
                    <legend className="text-xs font-semibold text-slate-300">Dashboard permissions</legend>
                    <p className="text-[11px] leading-4 text-slate-500">
                      Admin dashboard access is included. Select the sections this account may use.
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {accessModules.map((module) => (
                        <label key={module.label} className="flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs text-slate-300">
                          <span className="min-w-0 flex-1 leading-4">{module.label}</span>
                          <select
                            aria-label={`${module.label} access`}
                            value={getModuleAccess(selectedPermissions, module)}
                            onChange={(event) => setSelectedPermissions(setModuleAccess(selectedPermissions, module, event.target.value as ModuleAccess))}
                            className="min-h-9 w-32 shrink-0 rounded-md border border-white/10 bg-[#0b1019] px-2 text-xs text-white focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                          >
                            <option value="none">No access</option>
                            <option value="view">View only</option>
                            {module.manage.length > 0 && <option value="manage">Manage</option>}
                          </select>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ) : (
                  <p className="rounded-lg border border-amber-300/15 bg-amber-300/[0.04] p-3 text-xs leading-5 text-amber-100/80">
                    Super admins can access every dashboard section and manage other administrators.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-amber-300 px-4 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                    : <KeyRound className="h-4 w-4" aria-hidden="true" />}
                  {submitting ? 'Creating account…' : 'Create account'}
                </button>
              </form>
              <p className="mt-3 text-[11px] leading-5 text-slate-500">
                Username-only accounts cannot use email password recovery. Store the credential securely.
              </p>
            </section>

            <section id="administrator-access" className="scroll-mt-24 rounded-xl border border-white/10 bg-white/[0.025] p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                <Users className="h-5 w-5 text-sky-300" aria-hidden="true" />
                Administrator access
              </h2>
              <div className="mt-4 max-h-[420px] space-y-2 overflow-y-auto pr-1">
                {admins.map((admin) => {
                  const isSelf = admin.id === currentUser?.id;
                  return (
                    <div key={admin.id} className="rounded-lg border border-white/[0.07] bg-black/10 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-200">{displayIdentity(admin)}</p>
                          <p className="mt-1 text-[11px] text-slate-500">
                            {admin.adminScope || admin.role} · {admin.status}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {admin.role === 'admin' && admin.adminScope !== 'SUPER_ADMIN' && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAdminId(editingAdminId === admin.id ? null : admin.id);
                                setEditingPermissions(admin.permissions || []);
                              }}
                              aria-expanded={editingAdminId === admin.id}
                              className="min-h-11 rounded-lg border border-white/10 px-3 text-xs font-medium text-slate-300 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                            >
                              Access
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => void handleStatusChange(admin)}
                            disabled={changingStatus === admin.id || isSelf}
                            aria-label={`${admin.status === 'active' ? 'Suspend' : 'Reactivate'} ${displayIdentity(admin)}`}
                            title={isSelf ? 'You cannot change your own status' : undefined}
                            className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-40 ${
                              admin.status === 'active'
                                ? 'border-rose-300/15 text-rose-300 hover:bg-rose-300/10'
                                : 'border-emerald-300/15 text-emerald-300 hover:bg-emerald-300/10'
                            }`}
                          >
                            {changingStatus === admin.id
                              ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                              : admin.status === 'active'
                                ? <Ban className="h-4 w-4" aria-hidden="true" />
                                : <RotateCcw className="h-4 w-4" aria-hidden="true" />}
                          </button>
                        </div>
                      </div>
                      {editingAdminId === admin.id && (
                        <div className="mt-3 space-y-3 border-t border-white/[0.07] pt-3">
                          <fieldset className="grid grid-cols-1 gap-2">
                            <legend className="sr-only">Permissions for {displayIdentity(admin)}</legend>
                            {accessModules.map((module) => (
                              <label key={module.label} className="flex min-h-12 w-full items-center justify-between gap-3 rounded-md border border-white/[0.06] px-3 py-1.5 text-xs text-slate-400 hover:bg-white/[0.03]">
                                <span className="min-w-0 flex-1 leading-4">{module.label}</span>
                                <select
                                  aria-label={`${module.label} access for ${displayIdentity(admin)}`}
                                  value={getModuleAccess(editingPermissions, module)}
                                  onChange={(event) => setEditingPermissions(setModuleAccess(editingPermissions, module, event.target.value as ModuleAccess))}
                                  className="min-h-9 w-32 shrink-0 rounded-md border border-white/10 bg-[#0b1019] px-2 text-xs text-white focus:border-amber-300/60 focus:outline-none focus:ring-2 focus:ring-amber-300/20"
                                >
                                  <option value="none">No access</option>
                                  <option value="view">View only</option>
                                  {module.manage.length > 0 && <option value="manage">Manage</option>}
                                </select>
                              </label>
                            ))}
                          </fieldset>
                          <button
                            type="button"
                            onClick={() => void handlePermissionSave(admin.id)}
                            disabled={changingStatus === admin.id}
                            className="min-h-11 w-full rounded-lg bg-amber-300 px-3 text-xs font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {changingStatus === admin.id ? 'Saving access…' : 'Save access'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {!admins.length && !loading && (
                  <p className="py-4 text-center text-xs text-slate-500">No admin accounts found.</p>
                )}
              </div>
            </section>

            <div className="flex items-start gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 text-xs leading-5 text-slate-400">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
              Login time and IP are recorded when an admin signs in. Stay time updates while online; exit time is recorded when the session closes.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
