'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Clock3, Download, LoaderCircle, RefreshCw, ShieldAlert } from 'lucide-react';
import {
  AdminAccessLogSession,
  AdminRecord,
  adminManagementApi,
} from '@/lib/adminManagementApi';
import { downloadAdminPageVisitsPdf } from '@/lib/adminActivityPdf';
import { useAdminPresence } from '@/hooks/useAdminPresence';

const PAGE_SIZE = 25;

const formatDate = (value: string | null) => value
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

const getSessionDuration = (session: AdminAccessLogSession) => {
  const finish = session.logoutAt || (session.online ? new Date().toISOString() : session.lastSeenAt);
  return Math.floor((new Date(finish).getTime() - new Date(session.loginAt).getTime()) / 1000);
};

const displayAdmin = (admin: AdminAccessLogSession['admin']) =>
  admin?.username || admin?.email || admin?.name || 'Deleted administrator';

const inputClass = 'min-h-11 w-full rounded-lg border border-white/10 bg-[#0b1019] px-3 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-amber-300/60 focus:ring-2 focus:ring-amber-300/20';

export default function AdminAccessLogsPage() {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [sessions, setSessions] = useState<AdminAccessLogSession[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [admin, setAdmin] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [ip, setIp] = useState('');
  const [exitReason, setExitReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, AdminAccessLogSession>>({});
  const [detailLoading, setDetailLoading] = useState<string | null>(null);
  const [detailErrors, setDetailErrors] = useState<Record<string, string>>({});
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { onlineSessionIds, connected } = useAdminPresence();

  const filters = useMemo(() => ({
    admin: admin || undefined,
    from: from ? new Date(`${from}T00:00:00`).toISOString() : undefined,
    to: to ? new Date(`${to}T23:59:59.999`).toISOString() : undefined,
    ip: ip.trim() || undefined,
    exitReason: (exitReason || undefined) as AdminAccessLogSession['exitReason'] | undefined,
    page,
    limit: PAGE_SIZE,
  }), [admin, exitReason, from, ip, page, to]);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await adminManagementApi.listAccessLogs(filters);
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Unable to load admin access logs');
      }
      setSessions(result.data);
      setTotal(result.total || 0);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load admin access logs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    adminManagementApi.listAdmins().then((result) => {
      if (result.success) setAdmins(result.data || []);
    }).catch((loadError: unknown) => {
      console.error('Unable to load administrator filter options', loadError);
    });
  }, []);

  useEffect(() => {
    if (!connected) return;
    setSessions((current) => current.map((session) => ({
      ...session,
      online: onlineSessionIds.has(session.id),
    })));
  }, [connected, onlineSessionIds]);

  const changeFilter = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  const toggleDetails = async (sessionId: string) => {
    if (expanded === sessionId) {
      setExpanded(null);
      return;
    }
    setExpanded(sessionId);
    if (details[sessionId]) return;

    setDetailLoading(sessionId);
    setDetailErrors((current) => ({ ...current, [sessionId]: '' }));
    try {
      const result = await adminManagementApi.getAccessLog(sessionId);
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Unable to load this session’s details');
      }
      setDetails((current) => ({ ...current, [sessionId]: result.data! }));
    } catch (loadError) {
      setDetailErrors((current) => ({
        ...current,
        [sessionId]: loadError instanceof Error ? loadError.message : 'Unable to load session details',
      }));
    } finally {
      setDetailLoading(null);
    }
  };

  const handleExportActivityPdf = async () => {
    setExportingPdf(true);
    setExportFeedback(null);
    try {
      const result = await adminManagementApi.listAllAccessLogDetails({
        admin: admin || undefined,
        from: filters.from,
        to: filters.to,
        ip: ip.trim() || undefined,
        exitReason: (exitReason || undefined) as AdminAccessLogSession['exitReason'] | undefined,
      });
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Unable to load page visits for PDF export');
      }
      await downloadAdminPageVisitsPdf(result.data, connected ? onlineSessionIds : undefined);
      const visitCount = result.data.reduce((count, session) => count + (session.pageVisits?.length || 0), 0);
      setExportFeedback({ type: 'success', message: `Downloaded PDF with ${visitCount} page visits across ${result.data.length} sessions.` });
    } catch (exportError) {
      setExportFeedback({
        type: 'error',
        message: exportError instanceof Error ? exportError.message : 'Unable to download page visits PDF',
      });
    } finally {
      setExportingPdf(false);
    }
  };

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const onlineCount = sessions.filter((session) =>
    connected ? onlineSessionIds.has(session.id) : session.online
  ).length;

  return (
    <section className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Admin Management</p>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Access Logs</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Review administrator sign-ins, visible page time, session exits, and successful sensitive actions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => void handleExportActivityPdf()}
            disabled={loading || exportingPdf || sessions.length === 0}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {exportingPdf
              ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              : <Download className="h-4 w-4" aria-hidden="true" />}
            {exportingPdf ? 'Preparing PDF…' : 'Page visits PDF'}
          </button>
          <div className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-3 py-2 text-xs font-medium text-emerald-200">
            <span className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-300' : 'bg-slate-500'}`} aria-hidden="true" />
            <span role="status">{connected ? `${onlineCount} online now · live` : `${onlineCount} online now`}</span>
          </div>
        </div>
      </div>

      {exportFeedback && (
        <p
          className={`mt-4 text-sm ${exportFeedback.type === 'error' ? 'text-rose-200' : 'text-emerald-200'}`}
          role={exportFeedback.type === 'error' ? 'alert' : 'status'}
        >
          {exportFeedback.message}
        </p>
      )}

      <div className="mt-7 grid gap-3 rounded-xl border border-white/10 bg-[#0b1019] p-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="block text-xs font-medium text-slate-400">
          Admin
          <select className={`${inputClass} mt-1.5`} value={admin} onChange={(event) => changeFilter(setAdmin)(event.target.value)}>
            <option value="">All admins</option>
            {admins.map((item) => (
              <option key={item.id} value={item.id}>{item.username || item.email || item.name}</option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-slate-400">
          From
          <input className={`${inputClass} mt-1.5`} type="date" value={from} onChange={(event) => changeFilter(setFrom)(event.target.value)} />
        </label>
        <label className="block text-xs font-medium text-slate-400">
          To
          <input className={`${inputClass} mt-1.5`} type="date" value={to} onChange={(event) => changeFilter(setTo)(event.target.value)} />
        </label>
        <label className="block text-xs font-medium text-slate-400">
          IP address
          <input className={`${inputClass} mt-1.5`} type="search" placeholder="Filter by IP" value={ip} onChange={(event) => changeFilter(setIp)(event.target.value)} />
        </label>
        <label className="block text-xs font-medium text-slate-400">
          Exit reason
          <select className={`${inputClass} mt-1.5`} value={exitReason} onChange={(event) => changeFilter(setExitReason)(event.target.value)}>
            <option value="">Any reason</option>
            <option value="LOGOUT">Logout</option>
            <option value="TIMEOUT">Timeout</option>
            <option value="TOKEN_EXPIRED">Token expired</option>
            <option value="FORCED">Forced</option>
          </select>
        </label>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-[#0b1019]">
        {error && (
          <div className="flex flex-col gap-3 border-b border-rose-300/10 bg-rose-300/[0.05] p-4 text-sm text-rose-200 sm:flex-row sm:items-center sm:justify-between" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => void loadSessions()} className="inline-flex min-h-10 items-center gap-2 self-start rounded-lg border border-rose-200/20 px-3 hover:bg-rose-200/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300">
              <RefreshCw className="h-4 w-4" aria-hidden="true" /> Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-slate-400" role="status">
            <LoaderCircle className="h-5 w-5 animate-spin text-amber-300" aria-hidden="true" /> Loading access logs…
          </div>
        ) : !error && sessions.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center px-4 text-center">
            <Clock3 className="h-8 w-8 text-slate-600" aria-hidden="true" />
            <h2 className="mt-3 font-semibold text-slate-200">No access logs found</h2>
            <p className="mt-1 text-sm text-slate-500">Try changing or clearing the filters.</p>
          </div>
        ) : !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
                <thead className="border-b border-white/10 bg-white/[0.025] text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="w-10 px-4 py-3"><span className="sr-only">Details</span></th>
                    <th scope="col" className="px-3 py-3">Admin</th>
                    <th scope="col" className="px-3 py-3">IP</th>
                    <th scope="col" className="px-3 py-3">Login date/time</th>
                    <th scope="col" className="px-3 py-3">Last seen</th>
                    <th scope="col" className="px-3 py-3">Exit date/time</th>
                    <th scope="col" className="px-3 py-3">Session time</th>
                    <th scope="col" className="px-3 py-3">Exit reason</th>
                    <th scope="col" className="px-3 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {sessions.map((session) => {
                    const online = connected ? onlineSessionIds.has(session.id) : session.online;
                    const detailsOpen = expanded === session.id;
                    const detail = details[session.id];
                    return (
                      <Fragment key={session.id}>
                        <tr className="hover:bg-white/[0.025]">
                          <td className="w-10 px-4 py-3 align-top">
                            <button
                              type="button"
                              aria-expanded={detailsOpen}
                              aria-label={`${detailsOpen ? 'Hide' : 'Show'} details for ${displayAdmin(session.admin)}`}
                              onClick={() => void toggleDetails(session.id)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-400 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
                            >
                              {detailsOpen ? <ChevronDown className="h-4 w-4" aria-hidden="true" /> : <ChevronRight className="h-4 w-4" aria-hidden="true" />}
                            </button>
                          </td>
                          <td className="px-3 py-3 font-medium text-slate-200">{displayAdmin(session.admin)}</td>
                          <td className="px-3 py-3 font-mono text-xs text-slate-400">{session.ipAddress || '—'}</td>
                          <td className="px-3 py-3 text-slate-300">{formatDate(session.loginAt)}</td>
                          <td className="px-3 py-3 text-slate-400">{formatDate(session.lastSeenAt)}</td>
                          <td className="px-3 py-3 text-slate-400">{formatDate(session.logoutAt)}</td>
                          <td className="px-3 py-3 font-mono text-xs text-slate-300">{formatDuration(getSessionDuration(session))}</td>
                          <td className="px-3 py-3 text-slate-400">{session.exitReason?.replaceAll('_', ' ') || '—'}</td>
                          <td className="px-3 py-3">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${online ? 'bg-emerald-300/10 text-emerald-200' : 'bg-slate-400/10 text-slate-400'}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-emerald-300' : 'bg-slate-500'}`} aria-hidden="true" />
                              {online ? 'Online' : 'Offline'}
                            </span>
                          </td>
                        </tr>
                        {detailsOpen && (
                          <tr>
                            <td colSpan={9} className="border-t border-white/[0.06] bg-black/10 px-4 py-5 sm:px-8">
                                    {detailLoading === session.id ? (
                                      <p className="flex items-center gap-2 text-sm text-slate-400" role="status">
                                        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading session details…
                                      </p>
                                    ) : detailErrors[session.id] ? (
                                      <p className="text-sm text-rose-200" role="alert">{detailErrors[session.id]}</p>
                                    ) : detail ? (
                                      <div className="grid gap-6 lg:grid-cols-3">
                                        <section className="lg:col-span-2" aria-labelledby={`visits-${session.id}`}>
                                          <h3 id={`visits-${session.id}`} className="text-sm font-semibold text-white">Page visits</h3>
                                          {!detail.pageVisits?.length ? (
                                            <p className="mt-3 text-sm text-slate-500">No page visits recorded for this session.</p>
                                          ) : (
                                            <div className="mt-3 grid gap-2 sm:grid-cols-2 2xl:grid-cols-3">
                                              {detail.pageVisits.map((visit) => (
                                                <div key={visit.id} className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
                                                  <p className="break-all font-mono text-xs text-amber-200">{visit.path}</p>
                                                  <p className="mt-2 text-xs leading-5 text-slate-500">
                                                    Entered {formatDate(visit.enteredAt)} · Exited {formatDate(visit.exitedAt)}
                                                  </p>
                                                  <p className="mt-1 text-xs text-slate-400">Visible stay: {formatDuration(visit.durationSec)}</p>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </section>
                                        <section aria-labelledby={`actions-${session.id}`}>
                                          <h3 id={`actions-${session.id}`} className="text-sm font-semibold text-white">Successful admin actions</h3>
                                          {!detail.activities?.length ? (
                                            <p className="mt-3 text-sm text-slate-500">No sensitive actions recorded for this session.</p>
                                          ) : (
                                            <ul className="mt-3 space-y-2">
                                              {detail.activities.map((activity) => (
                                                <li key={activity.id} className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
                                                  <p className="text-sm font-medium text-slate-200">{activity.action.replaceAll('_', ' ')}</p>
                                                  {activity.target && <p className="mt-1 break-all font-mono text-xs text-slate-400">Target: {activity.target}</p>}
                                                  <p className="mt-1 text-xs text-slate-500">{formatDate(activity.createdAt)} · {activity.ipAddress || 'IP unavailable'}</p>
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
                                    ) : (
                                      <p className="flex items-center gap-2 text-sm text-slate-400">
                                        <ShieldAlert className="h-4 w-4" aria-hidden="true" /> Session details are not available.
                                      </p>
                                    )}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>Showing {total ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, total)} of {total} sessions</p>
              <div className="flex items-center gap-2">
                <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="min-h-10 rounded-lg border border-white/10 px-3 text-slate-300 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300">
                  Previous
                </button>
                <span aria-live="polite">Page {page} of {pageCount}</span>
                <button type="button" disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)} className="min-h-10 rounded-lg border border-white/10 px-3 text-slate-300 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300">
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
