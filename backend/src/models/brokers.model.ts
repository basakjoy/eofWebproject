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
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      code VARCHAR(50) UNIQUE NOT NULL,
      logo VARCHAR(500),
      website VARCHAR(500),
      email VARCHAR(255),
      phone VARCHAR(20),
      country VARCHAR(100),
      status VARCHAR(50) DEFAULT 'active',
      rating DECIMAL(3, 2) DEFAULT 0,
      reviews INT DEFAULT 0,
      minimumDeposit DECIMAL(15, 2),
      leverage VARCHAR(100),
      spreads VARCHAR(100),
      features TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Broker Reviews table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS broker_reviews (
      id VARCHAR(36) PRIMARY KEY,
      brokerId VARCHAR(36) NOT NULL,
      userId VARCHAR(36) NOT NULL,
      rating INT NOT NULL,
      comment TEXT,
      verified BOOLEAN DEFAULT false,
      helpful INT DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(brokerId, userId),
      FOREIGN KEY (brokerId) REFERENCES brokers(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Broker Accounts table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS broker_accounts (
      id VARCHAR(36) PRIMARY KEY,
      userId VARCHAR(36) NOT NULL,
      brokerId VARCHAR(36) NOT NULL,
      accountNumber VARCHAR(100),
      accountType VARCHAR(100),
      balance DECIMAL(15, 2) DEFAULT 0,
      currency VARCHAR(10) DEFAULT 'USD',
      status VARCHAR(50) DEFAULT 'active',
      connectedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(userId, brokerId),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (brokerId) REFERENCES brokers(id) ON DELETE CASCADE
    )
  `);

  // Broker Comparisons table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS broker_comparisons (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      brokers TEXT,
      criteria TEXT,
      createdBy VARCHAR(36) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};
