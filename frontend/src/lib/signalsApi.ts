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
  takeProfits?: number[];
  accuracy?: number | null;
  reliability?: number | null;
  timeframe?: string | null;
  status?: string | null;
  category?: string | null;
  riskReward?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Shape as it actually arrives from the API, before normalization.
// Kept separate from SignalRecord so callers only ever see the clean shape.
interface RawSignalRecord {
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

interface RawSignalsApiResponse extends Omit<SignalsApiResponse, 'data'> {
  data: RawSignalRecord | RawSignalRecord[];
}

// ---------------------------------------------------------------------------
// Field normalization
//
// The API has historically sent stop loss / take profit under several
// different keys (stopLoss vs stoploss, takeProfit vs takeProfit1/2/3 vs
// takeProfits[]). Normalize once here so the rest of the app only ever
// deals with `stopLoss` and `takeProfits: number[]`.
// ---------------------------------------------------------------------------
function normalizeSignal(raw: RawSignalRecord): SignalRecord {
  const stopLoss = raw.stopLoss ?? raw.stoploss ?? null;

  const takeProfits = (
    raw.takeProfits?.filter((v): v is number => v != null) ?? [
      raw.takeProfit,
      raw.takeProfit1,
      raw.takeProfit2,
      raw.takeProfit3,
    ].filter((v): v is number => v != null)
  );

  return {
    id: raw.id,
    pair: raw.pair,
    type: raw.type,
    direction: raw.direction ?? null,
    entryPrice: raw.entryPrice ?? null,
    stopLoss,
    takeProfits,
    accuracy: raw.accuracy ?? null,
    reliability: raw.reliability ?? null,
    timeframe: raw.timeframe ?? null,
    status: raw.status ?? null,
    category: raw.category ?? null,
    riskReward: raw.riskReward ?? null,
    createdAt: raw.createdAt ?? null,
    updatedAt: raw.updatedAt ?? null,
  };
}

function normalizeResponse(raw: RawSignalsApiResponse): SignalsApiResponse {
  const data = Array.isArray(raw.data) ? raw.data : [raw.data];
  return { ...raw, data: data.map(normalizeSignal) };
}

// ---------------------------------------------------------------------------
// Retry helper (unchanged behavior, kept for 5xx / network errors)
// ---------------------------------------------------------------------------
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableSignalError = (error: unknown): boolean => {
  if (!axios.isAxiosError(error)) return true;
  const status = error.response?.status;
  return !status || status >= 500;
};

async function withRetry<T>(request: () => Promise<T>): Promise<T> {
  const maxRetries = 2;
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await request();
    } catch (error) {
      if (attempt >= maxRetries || !isRetryableSignalError(error)) throw error;
      // add jitter so parallel retries don't all land on the same tick
      const backoff = 400 * 2 ** attempt + Math.random() * 100;
      await sleep(backoff);
    }
  }
}

// ---------------------------------------------------------------------------
// 304 handling
//
// Root cause of the reported "API showing 304": axios's default
// validateStatus only accepts 200-299, so a conditional-GET "Not Modified"
// response (valid HTTP, empty body) gets thrown as an error instead of
// being treated as "here's your cached data, unchanged."
//
// Fix: accept 304 as a valid status *for these GET requests only* (scoped
// per-call so it doesn't change behavior for other endpoints on the shared
// apiClient instance), and keep a small in-memory ETag cache so a 304
// resolves to the last known good payload instead of an empty body.
// ---------------------------------------------------------------------------
interface CacheEntry {
  etag: string;
  response: SignalsApiResponse;
}

const responseCache = new Map<string, CacheEntry>();

function cacheKey(url: string, params?: Record<string, unknown>): string {
  return `${url}?${JSON.stringify(params ?? {})}`;
}

async function cachedGet(
  url: string,
  params?: Record<string, unknown>,
  signal?: AbortSignal
): Promise<SignalsApiResponse> {
  const key = cacheKey(url, params);
  const cached = responseCache.get(key);

  const response = await withRetry(() =>
    apiClient.get<RawSignalsApiResponse>(url, {
      params,
      signal,
      // Accept 304 alongside 2xx so axios doesn't throw on a cache hit.
      validateStatus: (status) => (status >= 200 && status < 300) || status === 304,
      headers: cached ? { 'If-None-Match': cached.etag } : undefined,
    })
  );

  if (response.status === 304 && cached) {
    return cached.response;
  }

  const normalized = normalizeResponse(response.data);
  const etag = response.headers?.etag as string | undefined;
  if (etag) {
    responseCache.set(key, { etag, response: normalized });
  }

  return normalized;
}

export function clearSignalsCache(): void {
  responseCache.clear();
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export const signalsApi = {
  getAllSignals: async (
    options?: { status?: string; pair?: string; type?: string; limit?: number; offset?: number },
    signal?: AbortSignal
  ): Promise<SignalsApiResponse> => {
    try {
      return await cachedGet('/signals', options, signal);
    } catch (error) {
      console.error('Error fetching signals:', error);
      throw error;
    }
  },

  getSignalById: async (signalId: string, signal?: AbortSignal): Promise<SignalsApiResponse> => {
    try {
      return await cachedGet(`/signals/${signalId}`, undefined, signal);
    } catch (error) {
      console.error('Error fetching signal:', error);
      throw error;
    }
  },

  createSignal: async (data: {
    pair: string;
    type?: string;
    direction?: string;
    entryPrice: number;
    stopLoss?: number;
    takeProfits?: number[];
    accuracy?: number;
    reliability?: number;
    timeframe?: string;
    status?: string;
  }): Promise<SignalsApiResponse> => {
    try {
      const response = await apiClient.post<RawSignalsApiResponse>('/signals', data);
      clearSignalsCache(); // list results are now stale
      return normalizeResponse(response.data);
    } catch (error) {
      console.error('Error creating signal:', error);
      throw error;
    }
  },

  updateSignal: async (
    signalId: string,
    data: Record<string, unknown>
  ): Promise<SignalsApiResponse> => {
    try {
      const response = await apiClient.put<RawSignalsApiResponse>(`/signals/${signalId}`, data);
      clearSignalsCache();
      return normalizeResponse(response.data);
    } catch (error) {
      console.error('Error updating signal:', error);
      throw error;
    }
  },

  deleteSignal: async (signalId: string): Promise<SignalsApiResponse> => {
    try {
      const response = await apiClient.delete<RawSignalsApiResponse>(`/signals/${signalId}`);
      clearSignalsCache();
      return normalizeResponse(response.data);
    } catch (error) {
      console.error('Error deleting signal:', error);
      throw error;
    }
  },
};