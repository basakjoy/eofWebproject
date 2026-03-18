// Brokers Model Types and Interfaces
export interface Broker {
  id: string;
  name: string;
  code: string;
  logo?: string;
  website?: string;
  email?: string;
  phone?: string;
  country?: string;
  status: 'active' | 'inactive';
  rating: number;
  reviews: number;
  minimumDeposit?: number;
  leverage?: string;
  spreads?: string;
  features?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BrokerReview {
  id: string;
  brokerId: string;
  userId: string;
  rating: number;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrokerAccount {
  id: string;
  userId: string;
  brokerId: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  status: 'active' | 'inactive' | 'suspended';
  connectedAt: Date;
}

export interface BrokerComparison {
  id: string;
  title: string;
  description: string;
  brokers: string[]; // broker IDs
  criteria: Record<string, any>;
  createdBy: string;
  createdAt: Date;
}

/**
 * Initialize brokers tables in database
 */
export const initBrokersTables = async (runAsync: (sql: string, params?: any[]) => Promise<void>) => {
  // Brokers table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS brokers (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      code TEXT UNIQUE NOT NULL,
      logo TEXT,
      website TEXT,
      email TEXT,
      phone TEXT,
      country TEXT,
      status TEXT DEFAULT 'active',
      rating REAL DEFAULT 0,
      reviews INTEGER DEFAULT 0,
      minimumDeposit REAL,
      leverage TEXT,
      spreads TEXT,
      features TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Broker Reviews table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS broker_reviews (
      id TEXT PRIMARY KEY,
      brokerId TEXT NOT NULL,
      userId TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      verified BOOLEAN DEFAULT 0,
      helpful INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(brokerId, userId),
      FOREIGN KEY (brokerId) REFERENCES brokers(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Broker Accounts table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS broker_accounts (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      brokerId TEXT NOT NULL,
      accountNumber TEXT,
      accountType TEXT,
      balance REAL DEFAULT 0,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'active',
      connectedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(userId, brokerId),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (brokerId) REFERENCES brokers(id) ON DELETE CASCADE
    )
  `);

  // Broker Comparisons table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS broker_comparisons (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      brokers TEXT,
      criteria TEXT,
      createdBy TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};
