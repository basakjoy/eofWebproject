'use client';

import Card from '@/components/common/Card';
import Table from '@/components/common/Table';
import Badge from '@/components/common/Badge';

export default function LogsPage() {
  const logs = [
    {
      id: 1,
      timestamp: '2024-06-10 14:30',
      action: 'Created Signal',
      admin: 'Admin 1',
      details: 'EUR/USD BUY signal created',
      status: 'success',
    },
    {
      id: 2,
      timestamp: '2024-06-10 13:45',
      action: 'Approved Deposit',
      admin: 'Admin 2',
      details: 'Deposit of $5000 approved',
      status: 'success',
    },
    {
      id: 3,
      timestamp: '2024-06-10 12:15',
      action: 'User Registration',
      admin: 'System',
      details: 'New user registered',
      status: 'success',
    },
    {
      id: 4,
      timestamp: '2024-06-10 11:00',
      action: 'Failed Login',
      admin: 'System',
      details: 'Multiple failed login attempts',
      status: 'error',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
        <p className="text-gray-600 mt-1">Monitor platform activity and actions</p>
      </div>

      <Card>
        <Table
          columns={[
            { key: 'timestamp', label: 'Timestamp' },
            { key: 'action', label: 'Action' },
            { key: 'admin', label: 'Admin/System' },
            { key: 'details', label: 'Details' },
            {
              key: 'status',
              label: 'Status',
              render: (value) => (
                <Badge
                  label={value}
                  variant={value === 'success' ? 'success' : 'danger'}
                  size="sm"
                />
              ),
            },
          ]}
          data={logs}
        />
      </Card>
    </div>
  );
}
