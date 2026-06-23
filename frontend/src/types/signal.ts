// Signal Types and Interfaces
export type SignalType = "Buy" | "Sell";
export type SignalStatus = "Pending" | "Active" | "Profit" | "Loss" | "Cancelled";

export interface SignalFormData {
  pair: string;
  type: SignalType;
  entryPrice: string;
  takeProfit1: string;
  takeProfit2: string;
  takeProfit3: string;
  stopLoss: string;
  reliability: string;
  timeframe: string;
  analysis: string;
}

export interface SignalPayload {
  pair: string;
  type: SignalType;
  entryPrice: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  stopLoss: number;
  reliability: number;
  timeframe: string;
  analysis: string;
}

export interface Signal extends SignalPayload {
  id: string;
  createdAt: string;
  updatedAt?: string;
  status?: SignalStatus;
  // Support both snake_case and camelCase from API
  entry_price?: number;
  take_profit_1?: number;
  take_profit_2?: number;
  take_profit_3?: number;
  stop_loss?: number;
}

export interface SignalResponse {
  success: boolean;
  data: Signal | Signal[];
  message?: string;
  status?: number;
}

export interface SignalListResponse {
  success: boolean;
  data: Signal[] | { signals: Signal[] };
  message?: string;
}

// Constants
export const TRADING_PAIRS = [
  "EUR/USD",
  "GBP/USD",
  "USD/JPY",
  "GOLD",
  "BTC/USD",
] as const;

export const SIGNAL_TYPES = ["Buy", "Sell"] as const;

export const TIMEFRAMES = ["1m", "5m", "15m", "30m", "1h", "4h", "1d"] as const;

export const DEFAULT_RELIABILITY = 85;
export const DEFAULT_TIMEFRAME = "1h";
export const DEFAULT_PAIR = "EUR/USD";
export const DEFAULT_TYPE = "Buy";

export const INITIAL_FORM_DATA: SignalFormData = {
  pair: DEFAULT_PAIR,
  type: DEFAULT_TYPE,
  entryPrice: "",
  takeProfit1: "",
  takeProfit2: "",
  takeProfit3: "",
  stopLoss: "",
  reliability: DEFAULT_RELIABILITY.toString(),
  timeframe: DEFAULT_TIMEFRAME,
  analysis: "",
};

// Status Colors
export const STATUS_COLORS: Record<SignalStatus, { bg: string; text: string }> = {
  Pending: { bg: "bg-gray-100", text: "text-gray-700" },
  Active: { bg: "bg-blue-100", text: "text-blue-700" },
  Profit: { bg: "bg-green-100", text: "text-green-700" },
  Loss: { bg: "bg-red-100", text: "text-red-700" },
  Cancelled: { bg: "bg-amber-100", text: "text-amber-700" },
};

// Type Guards
export function isSignal(obj: any): obj is Signal {
  return obj && typeof obj.id === "string" && typeof obj.pair === "string";
}

export function isSignalArray(data: any): data is Signal[] {
  return Array.isArray(data);
}