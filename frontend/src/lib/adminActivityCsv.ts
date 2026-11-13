import { AdminAccessLogSession } from './adminManagementApi';

const formatDate = (value: string | null) => value
  ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(value))
  : '—';

const formatDuration = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;
  const parts: string[] = [];

  if (hours) parts.push(`${hours} hr`);
  if (minutes) parts.push(`${minutes} min`);
  if (remainingSeconds || parts.length === 0) parts.push(`${remainingSeconds} sec`);
  return parts.join(' ');
};

const escapeCsvCell = (value: string) => {
  const safeValue = /^[\u0000-\u0020]*[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
};

const getReportedDevice = (userAgent: string | null) => {
  if (!userAgent) return 'Not recorded';

  const browser = userAgent.match(/Edg\/[\d.]+/)
    ? 'Microsoft Edge'
    : userAgent.match(/OPR\/[\d.]+/)
      ? 'Opera'
      : userAgent.match(/Firefox\/[\d.]+/)
        ? 'Mozilla Firefox'
        : userAgent.match(/(?:Chrome|CriOS)\/[\d.]+/)
          ? 'Google Chrome'
          : userAgent.match(/Version\/[\d.]+.*Safari/)
            ? 'Apple Safari'
            : 'Browser not identified';
  const device = /Android/i.test(userAgent)
    ? 'Android'
    : /iPhone|iPad|iPod/i.test(userAgent)
      ? 'iOS'
      : /Windows/i.test(userAgent)
        ? 'Windows'
        : /Macintosh|Mac OS X/i.test(userAgent)
          ? 'macOS'
          : /CrOS/i.test(userAgent)
            ? 'ChromeOS'
            : /Linux/i.test(userAgent)
              ? 'Linux'
              : 'device not identified';

  return `${browser} on ${device}`;
};

const getExitReason = (session: AdminAccessLogSession, online: boolean) => {
  switch (session.exitReason) {
    case 'LOGOUT':
      return 'Administrator logged out';
    case 'TIMEOUT':
      return 'Ended after inactivity';
    case 'TOKEN_EXPIRED':
      return 'Login expired';
    case 'FORCED':
      return 'Ended by an administrator';
    default:
      return online ? 'Session is still active' : 'Not recorded';
  }
};

export function downloadAdminPageVisitsCsv(
  sessions: AdminAccessLogSession[],
  onlineSessionIds?: ReadonlySet<string>
) {
  if (!sessions.length) throw new Error('There are no admin sessions to export.');

  const now = Date.now();
  const rows = sessions.flatMap((session) => {
    const online = onlineSessionIds
      ? onlineSessionIds.has(session.id)
      : session.online;
    const sessionEnd = session.logoutAt
      ? new Date(session.logoutAt).getTime()
      : online
        ? now
        : new Date(session.lastSeenAt).getTime();
    const adminName = session.admin?.name || 'Deleted administrator';
    const adminLogin = session.admin?.username || session.admin?.email || 'Not available';
    const sessionDuration = formatDuration(
      (sessionEnd - new Date(session.loginAt).getTime()) / 1000
    );
    const common = [
      adminName,
      adminLogin,
      online ? 'Online' : 'Offline',
      formatDate(session.loginAt),
      formatDate(session.lastSeenAt),
      formatDate(session.logoutAt),
      sessionDuration,
      getExitReason(session, online),
      getReportedDevice(session.userAgent),
      session.ipAddress || 'Not recorded',
      session.userAgent || 'Not recorded',
    ];

    if (!session.pageVisits?.length) {
      return [[
        ...common.slice(0, 8),
        'No page visits recorded',
        '—',
        '—',
        '—',
        ...common.slice(8),
      ]];
    }

    return session.pageVisits.map((visit) => [
      ...common.slice(0, 8),
      visit.path,
      formatDate(visit.enteredAt),
      formatDate(visit.exitedAt),
      formatDuration(visit.durationSec),
      ...common.slice(8),
    ]);
  });
  const csv = [
    [
      'Administrator name',
      'Administrator username or email',
      'Current session status',
      'Session started (local time)',
      'Last activity (local time)',
      'Session ended (local time)',
      'Total session time',
      'How the session ended',
      'Page visited',
      'Page visit started (local time)',
      'Page visit ended (local time)',
      'Time spent on page',
      'Reported browser and device',
      'IP address',
      'Browser/device technical details (user agent)',
    ],
    ...rows,
  ]
    .map((row) => row.map(escapeCsvCell).join(','))
    .join('\r\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  try {
    link.href = url;
    link.download = `Admin_Page_Visit_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
  } finally {
    link.remove();
    URL.revokeObjectURL(url);
  }
}
