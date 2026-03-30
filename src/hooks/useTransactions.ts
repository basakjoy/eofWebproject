import { useState, useEffect } from 'react';
import { transactionsApi } from '@/lib/transactionsApi';
import { useAuthStore } from '@/store/authStore';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
}

interface UseTransactionsOptions {
  type?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export function useTransactions(options?: UseTransactionsOptions) {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const data = await transactionsApi.getUserTransactions(user.id, options);
          setTransactions(data.data || []);
          setTotal(data.total || 0);
          setError(null);
        }
      } catch (err: any) {
        console.error('Error fetching transactions:', err);
        setError(err.response?.data?.message || 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchTransactions();
    }
  }, [user?.id, options?.type, options?.status, options?.limit, options?.offset]);

  return { transactions, loading, error, total };
}
