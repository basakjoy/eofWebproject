'use client';

import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { Check, X, Eye } from 'lucide-react';

export default function DepositApproval() {
  const [deposits, setDeposits] = useState([
    {
      id: 1,
      userId: 'user1',
      userName: 'John Doe',
      amount: 5000,
      status: 'pending',
      date: '2024-06-10',
    },
    {
      id: 2,
      userId: 'user2',
      userName: 'Jane Smith',
      amount: 10000,
      status: 'pending',
      date: '2024-06-09',
    },
    {
      id: 3,
      userId: 'user3',
      userName: 'Bob Johnson',
      amount: 3000,
      status: 'approved',
      date: '2024-06-08',
    },
  ]);

  const handleApprove = (id: number) => {
    setDeposits(
      deposits.map((d) => (d.id === id ? { ...d, status: 'approved' } : d))
    );
  };

  const handleReject = (id: number) => {
    setDeposits(
      deposits.map((d) => (d.id === id ? { ...d, status: 'rejected' } : d))
    );
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Deposit Requests</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">User</th>
              <th className="px-4 py-3 text-left font-semibold">Amount</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((deposit) => (
              <tr key={deposit.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{deposit.userName}</p>
                    <p className="text-xs text-gray-500">{deposit.userId}</p>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">${deposit.amount.toLocaleString()}</td>
                <td className="px-4 py-3">{new Date(deposit.date).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <Badge
                    label={deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                    variant={
                      deposit.status === 'approved'
                        ? 'success'
                        : deposit.status === 'pending'
                        ? 'warning'
                        : 'danger'
                    }
                    size="sm"
                  />
                </td>
                <td className="px-4 py-3 flex gap-2">
                  {deposit.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(deposit.id)}
                        className="p-2 hover:bg-green-100 rounded text-green-600"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(deposit.id)}
                        className="p-2 hover:bg-red-100 rounded text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button className="p-2 hover:bg-blue-100 rounded text-blue-600">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

import { useState } from 'react';
