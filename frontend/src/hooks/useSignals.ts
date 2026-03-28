import { useState, useEffect } from 'react';
import { signalsApi } from '@/lib/signalsApi';

interface Signal {
  id: string;
  pair: string;
  type: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit?: number;
  status: string;
  createdAt: string;
  accuracy?: number;
  reliability?: number;
}

interface UseSignalsOptions {
  status?: string;
  pair?: string;
  limit?: number;
  offset?: number;
}

export function useSignals(options?: UseSignalsOptions) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        setLoading(true);
        const data = await signalsApi.getAllSignals(options);
        setSignals(data.data || []);
        setTotal(data.total || 0);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching signals:', err);
        setError(err.response?.data?.message || 'Failed to load signals');
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
  }, [options?.status, options?.pair, options?.limit, options?.offset]);

  return { signals, loading, error, total };
}

export function useSignal(signalId: string) {
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSignal = async () => {
      try {
        setLoading(true);
        const data = await signalsApi.getSignalById(signalId);
        setSignal(data.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching signal:', err);
        setError(err.response?.data?.message || 'Failed to load signal');
      } finally {
        setLoading(false);
      }
    };

    if (signalId) {
      fetchSignal();
    }
  }, [signalId]);

  return { signal, loading, error };
}
