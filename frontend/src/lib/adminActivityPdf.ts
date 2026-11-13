import { AdminAccessLogSession } from './adminManagementApi';

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

const displayAdmin = (admin: AdminAccessLogSession['admin']) =>
  admin?.username || admin?.email || admin?.name || 'Deleted administrator';

export async function downloadAdminPageVisitsPdf(
  sessions: AdminAccessLogSession[],
  onlineSessionIds?: ReadonlySet<string>
) {
  if (!sessions.length) throw new Error('There are no admin sessions to export.');

  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageVisitCount = sessions.reduce((count, session) => count + (session.pageVisits?.length || 0), 0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(24);
  doc.text('Admin Page Visit Report', 36, 40);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 36, 57);
  doc.text(`Sessions: ${sessions.length}  ·  Page visits: ${pageVisitCount}`, pageWidth - 36, 57, { align: 'right' });

  const now = Date.now();
  const rows = sessions.flatMap((session) => {
    const online = onlineSessionIds
      ? onlineSessionIds.has(session.id)
      : session.online;
    const finish = session.logoutAt
      ? new Date(session.logoutAt).getTime()
      : online
        ? now
        : new Date(session.lastSeenAt).getTime();
    const sessionTime = [
      `Login: ${formatDate(session.loginAt)}`,
      `Last seen: ${formatDate(session.lastSeenAt)}`,
      `Logout: ${formatDate(session.logoutAt)}`,
      `Session stay: ${formatDuration((finish - new Date(session.loginAt).getTime()) / 1000)}`,
      `Exit: ${session.exitReason?.replaceAll('_', ' ') || (online ? 'In progress' : '—')}`,
    ].join('\n');
    const common = [
      displayAdmin(session.admin),
      session.ipAddress || '—',
      sessionTime,
      session.userAgent || '—',
    ];

    if (!session.pageVisits?.length) {
      return [[...common.slice(0, 1), 'No page visits recorded', '—', '—', '—', ...common.slice(1)]];
    }

    return session.pageVisits.map((visit) => [
      common[0],
      visit.path,
      formatDate(visit.enteredAt),
      formatDate(visit.exitedAt),
      formatDuration(visit.durationSec),
      common[1],
      common[2],
      common[3],
    ]);
  });

  autoTable(doc, {
    startY: 72,
    margin: { left: 36, right: 36 },
    head: [['Administrator', 'Page path', 'Entered', 'Exited', 'Visible stay', 'IP address', 'Session details', 'User agent']],
    body: rows,
    styles: { fontSize: 6, cellPadding: 4, overflow: 'linebreak', valign: 'top' },
    headStyles: { fillColor: [217, 153, 44], textColor: 20, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [246, 247, 249] },
    columnStyles: {
      0: { cellWidth: 72 },
      1: { cellWidth: 105 },
      2: { cellWidth: 88 },
      3: { cellWidth: 88 },
      4: { cellWidth: 52 },
      5: { cellWidth: 65 },
      6: { cellWidth: 105 },
      7: { cellWidth: 123 },
    },
    didDrawPage: () => {
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - 36, doc.internal.pageSize.getHeight() - 18, {
        align: 'right',
      });
    },
  });

  doc.save(`Admin_Page_Visits_${new Date().toISOString().slice(0, 10)}.pdf`);
}
