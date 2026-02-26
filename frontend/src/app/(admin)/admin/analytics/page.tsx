'use client';

import Card from '@/components/common/Card';
import Table from '@/components/common/Table';
import Badge from '@/components/common/Badge';

export default function AnalyticsPage() {
  const analyticsData = [
    { metric: 'Total Users', value: 125, change: '+15%' },
    { metric: 'Premium Users', value: 42, change: '+8%' },
    { metric: 'Total Deposits', value: '$65,000', change: '+25%' },
    { metric: 'Active Signals', value: 28, change: '+5%' },
  ];

  const logs = [
    { timestamp: '2024-06-10 14:30', action: 'Created Signal', user: 'Admin 1', status: 'success' },
    { timestamp: '2024-06-10 13:45', action: 'Approved Deposit', user: 'Admin 1', status: 'success' },
    { timestamp: '2024-06-10 12:15', action: 'User Registration', user: 'System', status: 'success' },
    { timestamp: '2024-06-10 11:00', action: 'Failed Login Attempt', user: 'user123', status: 'error' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Platform metrics and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map((data, idx) => (
          <Card key={idx}>
            <p className="text-gray-600 text-sm font-medium">{data.metric}</p>
            <p className="text-3xl font-bold mt-2">{data.value}</p>
            <p className="text-green-600 text-sm mt-2">{data.change}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <Table
          columns={[
            { key: 'timestamp', label: 'Timestamp' },
            { key: 'action', label: 'Action' },
            { key: 'user', label: 'User' },
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
