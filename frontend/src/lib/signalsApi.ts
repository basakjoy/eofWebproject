import apiClient from './api';
import axios from 'axios';

export interface SignalRecord {
  id: string;
  pair: string;
  type: string;
  direction?: string | null;
  entryPrice?: number | null;
  stopLoss?: number | null;
  stoploss?: number | null;
  takeProfit?: number | null;
  takeProfit1?: number | null;
  takeProfit2?: number | null;
  takeProfit3?: number | null;
  takeProfits?: Array<number | null>;
  accuracy?: number | null;
  reliability?: number | null;
  timeframe?: string | null;
  status?: string | null;
  category?: string | null;
  riskReward?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface SignalsApiResponse {
  success: boolean;
  data: SignalRecord[];
  total?: number;
  limit?: number;
  offset?: number;
  hasMore?: boolean;
  message?: string;
}

const sleep = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const isRetryableSignalError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return true;
  const status = error.response?.status;
  return !status || status >= 500;
};

async function getSignalsWithRetry<T>(request: () => Promise<T>): Promise<T> {
  const maxRetries = 2;

  for (let attempt = 0; ; attempt += 1) {
    try {
      return await request();
    } catch (error) {
      if (attempt >= maxRetries || !isRetryableSignalError(error)) {
        throw error;
      }

      await sleep(400 * 2 ** attempt);
    }
  }
}

export const signalsApi = {
  // Get all signals with filtering
  getAllSignals: async (options?: {
    status?: string;
    pair?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }) => {
    try {
      const response = await getSignalsWithRetry(() =>
        apiClient.get<SignalsApiResponse>('/signals', { params: options })
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching signals:', error);
      throw error;
    }
  },

  // Get signal by ID
  getSignalById: async (signalId: string) => {
    try {
      const response = await getSignalsWithRetry(() =>
        apiClient.get<SignalsApiResponse>(`/signals/${signalId}`)
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching signal:', error);
      throw error;
    }
  },

  // Create new signal
  createSignal: async (data: {
    pair: string;
    type?: string;
    direction?: string;
    entryPrice: number;
    stopLoss?: number;
    stoploss?: number;
    takeProfit?: number;
    takeProfit1?: number;
    takeProfit2?: number;
    takeProfit3?: number;
    takeProfits?: number[];
    accuracy?: number;
    reliability?: number;
    timeframe?: string;
    status?: string;
  }) => {
    try {
      const response = await apiClient.post<SignalsApiResponse>('/signals', data);
      return response.data;
    } catch (error) {
      console.error('Error creating signal:', error);
      throw error;
    }
  },

  // Update signal
  updateSignal: async (signalId: string, data: Record<string, unknown>) => {
    try {
      const response = await apiClient.put<SignalsApiResponse>(`/signals/${signalId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating signal:', error);
      throw error;
    }
  },

  // Delete signal
  deleteSignal: async (signalId: string) => {
    try {
      const response = await apiClient.delete<SignalsApiResponse>(`/signals/${signalId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting signal:', error);
      throw error;
    }
  },
};
