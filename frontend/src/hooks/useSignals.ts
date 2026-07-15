import { useState, useEffect } from 'react';
import { signalsApi, type SignalRecord } from '@/lib/signalsApi';

interface Signal {
  id: string;
  pair: string;
  type: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit?: number;
  // takeProfits: number[];
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
        const normalizedSignals: Signal[] = (data.data || []).map((signal: SignalRecord) => ({
          ...signal,
          type: (signal.direction ?? signal.type ?? 'BUY').toUpperCase(),
          entryPrice: signal.entryPrice ?? 0,
          stopLoss: signal.stopLoss ?? signal.stoploss ?? 0,
          takeProfit: signal.takeProfit ?? undefined,
          accuracy: signal.accuracy ?? undefined,
          reliability: signal.reliability ?? undefined,
          status: signal.status ?? 'active',
          createdAt: signal.createdAt ?? new Date().toISOString(),
        }));
        setSignals(normalizedSignals);
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
        const signalData = Array.isArray(data.data) ? data.data[0] : data.data as SignalRecord | undefined;
        setSignal(signalData ? {
          ...signalData,
          type: (signalData.direction ?? signalData.type ?? 'BUY').toUpperCase(),
          entryPrice: signalData.entryPrice ?? 0,
          stopLoss: signalData.stopLoss ?? signalData.stoploss ?? 0,
          takeProfit: signalData.takeProfit ?? undefined,
          accuracy: signalData.accuracy ?? undefined,
          reliability: signalData.reliability ?? undefined,
          status: signalData.status ?? 'active',
          createdAt: signalData.createdAt ?? new Date().toISOString(),
        } : null);
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
