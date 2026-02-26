// User Types
export type UserRole = 'normal' | 'premium' | 'investor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Forex Signal
export type SignalType = 'BUY' | 'SELL' | 'TP' | 'SL';

export interface ForexSignal {
  id: string;
  pair: string;
  type: SignalType;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  analysis: string;
  timeframe: string;
  createdBy: string;
  createdAt: string;
  status: 'active' | 'closed';
}

// Market Analysis
export interface MarketAnalysis {
  id: string;
  title: string;
  content: string;
  pair: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  technicalLevel: number;
  createdBy: string;
  createdAt: string;
}

// Investment
export interface Investment {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  investmentDate: string;
  expectedReturn: number;
  currentProfit: number;
  roi: number;
}

// Transaction
export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'profit' | 'upgrade';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  timestamp: string;
}

// Testimonial
export interface Testimonial {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  rating: number;
  createdAt: string;
}

// Admin Log
export interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  targetId?: string;
  targetType?: string;
  details: string;
  timestamp: string;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  type: 'signal' | 'deposit' | 'message' | 'alert';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// Chart Data
export interface ChartDataPoint {
  date: string;
  value: number;
  profit?: number;
}
