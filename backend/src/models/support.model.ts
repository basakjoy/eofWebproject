// Support Model Types and Interfaces
export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'waiting' | 'resolved' | 'closed';
  assignedTo?: string;
  attachments?: string[];
  resolution?: string;
  resolutionTime?: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  attachments?: string[];
  isInternal: boolean;
  createdAt: Date;
}

export interface SupportCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  responseTime?: number;
  position: number;
  active: boolean;
  createdAt: Date;
}

export interface FAQArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  keywords?: string[];
  viewCount: number;
  helpfulCount: number;
  unhelpfulCount: number;
  author: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportAgent {
  id: string;
  userId: string;
  agentId: string;
  department: string;
  status: 'available' | 'busy' | 'offline';
  ticketsAssigned: number;
  avgResolutionTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupportMetrics {
  id: string;
  period: string;
  totalTickets: number;
  resolvedTickets: number;
  averageResolutionTime: number;
  customerSatisfaction: number;
  avgFirstResponseTime: number;
  createdAt: Date;
}

/**
 * Initialize support tables in database
 */
export const initSupportTables = async (runAsync: (sql: string, params?: any[]) => Promise<void>) => {
  // Support Tickets table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS support_tickets (
      id VARCHAR(36) PRIMARY KEY,
      userId VARCHAR(36) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      priority VARCHAR(50) DEFAULT 'medium',
      status VARCHAR(50) DEFAULT 'open',
      assignedTo VARCHAR(36),
      attachments TEXT,
      resolution TEXT,
      resolutionTime INT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      closedAt TIMESTAMP NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (assignedTo) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Support Messages table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS support_messages (
      id VARCHAR(36) PRIMARY KEY,
      ticketId VARCHAR(36) NOT NULL,
      userId VARCHAR(36) NOT NULL,
      message TEXT NOT NULL,
      attachments TEXT,
      isInternal BOOLEAN DEFAULT false,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ticketId) REFERENCES support_tickets(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Support Categories table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS support_categories (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      icon VARCHAR(500),
      responseTime INT,
      position INT DEFAULT 0,
      active BOOLEAN DEFAULT true,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // FAQ Articles table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS faq_articles (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      category VARCHAR(100) NOT NULL,
      content TEXT NOT NULL,
      keywords VARCHAR(500),
      viewCount INT DEFAULT 0,
      helpfulCount INT DEFAULT 0,
      unhelpfulCount INT DEFAULT 0,
      author VARCHAR(36) NOT NULL,
      published BOOLEAN DEFAULT false,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Support Agents table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS support_agents (
      id VARCHAR(36) PRIMARY KEY,
      userId VARCHAR(36) UNIQUE NOT NULL,
      agentId VARCHAR(36) UNIQUE NOT NULL,
      department VARCHAR(100) NOT NULL,
      status VARCHAR(50) DEFAULT 'offline',
      ticketsAssigned INT DEFAULT 0,
      avgResolutionTime DECIMAL(10, 2),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Support Metrics table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS support_metrics (
      id VARCHAR(36) PRIMARY KEY,
      period VARCHAR(100) NOT NULL,
      totalTickets INT DEFAULT 0,
      resolvedTickets INT DEFAULT 0,
      averageResolutionTime DECIMAL(10, 2),
      customerSatisfaction DECIMAL(3, 2),
      avgFirstResponseTime DECIMAL(10, 2),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
