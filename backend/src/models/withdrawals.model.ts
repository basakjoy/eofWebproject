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
      id VARCHAR(36) PRIMARY KEY,
      userId VARCHAR(36) NOT NULL,
      amount DECIMAL(15, 2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'USD',
      method VARCHAR(100) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      destinationDetails TEXT,
      transactionId VARCHAR(255),
      reason TEXT,
      rejectionReason TEXT,
      approvedBy VARCHAR(36),
      approvedAt TIMESTAMP NULL,
      completedAt TIMESTAMP NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (approvedBy) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Withdrawal Methods table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS withdrawal_methods (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      code VARCHAR(50) UNIQUE NOT NULL,
      description TEXT,
      icon VARCHAR(500),
      minAmount DECIMAL(15, 2),
      maxAmount DECIMAL(15, 2),
      fee DECIMAL(5, 2) DEFAULT 0,
      processingTime VARCHAR(100),
      available BOOLEAN DEFAULT true,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User Withdrawal Accounts table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS user_withdrawal_accounts (
      id VARCHAR(36) PRIMARY KEY,
      userId VARCHAR(36) NOT NULL,
      methodId VARCHAR(36) NOT NULL,
      accountName VARCHAR(255) NOT NULL,
      accountDetails TEXT,
      isDefault BOOLEAN DEFAULT false,
      verified BOOLEAN DEFAULT false,
      verificationCode VARCHAR(100),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (methodId) REFERENCES withdrawal_methods(id) ON DELETE CASCADE
    )
  `);

  // Withdrawal Reports table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS withdrawal_reports (
      id VARCHAR(36) PRIMARY KEY,
      period VARCHAR(100) NOT NULL,
      totalRequests INT DEFAULT 0,
      totalAmount DECIMAL(15, 2) DEFAULT 0,
      approvedAmount DECIMAL(15, 2) DEFAULT 0,
      rejectedAmount DECIMAL(15, 2) DEFAULT 0,
      averageProcessingTime DECIMAL(10, 2),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Withdrawal Limits table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS withdrawal_limits (
      id VARCHAR(36) PRIMARY KEY,
      userId VARCHAR(36) UNIQUE NOT NULL,
      dailyLimit DECIMAL(15, 2),
      monthlyLimit DECIMAL(15, 2),
      remainingDaily DECIMAL(15, 2),
      remainingMonthly DECIMAL(15, 2),
      resetDate TIMESTAMP NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};
