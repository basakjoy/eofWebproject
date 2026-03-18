// Withdrawals Model Types and Interfaces
export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  method: 'bank' | 'crypto' | 'wallet' | 'card';
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'failed';
  destinationDetails: Record<string, string>;
  transactionId?: string;
  reason?: string;
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WithdrawalMethod {
  id: string;
  name: string;
  code: string;
  description?: string;
  icon?: string;
  minAmount: number;
  maxAmount: number;
  fee: number;
  processingTime: string;
  available: boolean;
  createdAt: Date;
}

export interface UserWithdrawalAccount {
  id: string;
  userId: string;
  methodId: string;
  accountName: string;
  accountDetails: Record<string, string>; // encrypted
  isDefault: boolean;
  verified: boolean;
  verificationCode?: string;
  createdAt: Date;
}

export interface WithdrawalReport {
  id: string;
  period: string;
  totalRequests: number;
  totalAmount: number;
  approvedAmount: number;
  rejectedAmount: number;
  averageProcessingTime: number;
  createdAt: Date;
}

export interface WithdrawalLimit {
  id: string;
  userId: string;
  dailyLimit: number;
  monthlyLimit: number;
  remainingDaily: number;
  remainingMonthly: number;
  resetDate: Date;
  updatedAt: Date;
}

/**
 * Initialize withdrawals tables in database
 */
export const initWithdrawalsTables = async (runAsync: (sql: string, params?: any[]) => Promise<void>) => {
  // Withdrawals table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS withdrawals (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      method TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      destinationDetails TEXT,
      transactionId TEXT,
      reason TEXT,
      rejectionReason TEXT,
      approvedBy TEXT,
      approvedAt DATETIME,
      completedAt DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (approvedBy) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Withdrawal Methods table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS withdrawal_methods (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      code TEXT UNIQUE NOT NULL,
      description TEXT,
      icon TEXT,
      minAmount REAL,
      maxAmount REAL,
      fee REAL DEFAULT 0,
      processingTime TEXT,
      available BOOLEAN DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User Withdrawal Accounts table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS user_withdrawal_accounts (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      methodId TEXT NOT NULL,
      accountName TEXT NOT NULL,
      accountDetails TEXT,
      isDefault BOOLEAN DEFAULT 0,
      verified BOOLEAN DEFAULT 0,
      verificationCode TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (methodId) REFERENCES withdrawal_methods(id) ON DELETE CASCADE
    )
  `);

  // Withdrawal Reports table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS withdrawal_reports (
      id TEXT PRIMARY KEY,
      period TEXT NOT NULL,
      totalRequests INTEGER DEFAULT 0,
      totalAmount REAL DEFAULT 0,
      approvedAmount REAL DEFAULT 0,
      rejectedAmount REAL DEFAULT 0,
      averageProcessingTime REAL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Withdrawal Limits table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS withdrawal_limits (
      id TEXT PRIMARY KEY,
      userId TEXT UNIQUE NOT NULL,
      dailyLimit REAL,
      monthlyLimit REAL,
      remainingDaily REAL,
      remainingMonthly REAL,
      resetDate DATETIME,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};
