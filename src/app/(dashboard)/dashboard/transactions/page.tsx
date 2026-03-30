'use client';

import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { ArrowUpRight, ArrowDownLeft, DollarSign } from 'lucide-react';

export default function TransactionsPage() {
  const transactions = [
    {
      id: 1,
      type: 'deposit',
      description: 'Investment Deposit',
      amount: 5000,
      status: 'completed',
      date: '2024-06-10',
    },
    {
      id: 2,
      type: 'profit',
      description: 'Monthly Profit',
      amount: 450,
      status: 'completed',
      date: '2024-06-05',
    },
    {
      id: 3,
      type: 'withdrawal',
      description: 'Profit Withdrawal',
      amount: -300,
      status: 'completed',
      date: '2024-05-28',
    },
    {
      id: 4,
      type: 'upgrade',
      description: 'Premium Upgrade',
      amount: -99,
      status: 'completed',
      date: '2024-05-15',
    },
  ];

  const getIcon = (type: string) => {
    return type === 'withdrawal' ? (
      <ArrowDownLeft className="w-5 h-5 text-red-600" />
    ) : (
      <ArrowUpRight className="w-5 h-5 text-green-600" />
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-600 mt-1">View all your transaction history</p>
      </div>

      <Card>
        <div className="space-y-4">
          {transactions.map((txn) => (
            <div key={txn.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {getIcon(txn.type)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{txn.description}</p>
                  <p className="text-sm text-gray-500">{new Date(txn.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${txn.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {txn.amount > 0 ? '+' : ''} ${Math.abs(txn.amount).toLocaleString()}
                </p>
                <Badge
                  label={txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                  variant="success"
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
