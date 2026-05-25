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
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'open',
      assignedTo TEXT,
      attachments TEXT,
      resolution TEXT,
      resolutionTime INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      closedAt DATETIME,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (assignedTo) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Support Messages table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS support_messages (
      id TEXT PRIMARY KEY,
      ticketId TEXT NOT NULL,
      userId TEXT NOT NULL,
      message TEXT NOT NULL,
      attachments TEXT,
      isInternal BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ticketId) REFERENCES support_tickets(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Support Categories table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS support_categories (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      icon TEXT,
      responseTime INTEGER,
      position INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // FAQ Articles table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS faq_articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      content TEXT NOT NULL,
      keywords TEXT,
      viewCount INTEGER DEFAULT 0,
      helpfulCount INTEGER DEFAULT 0,
      unhelpfulCount INTEGER DEFAULT 0,
      author TEXT NOT NULL,
      published BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Support Agents table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS support_agents (
      id TEXT PRIMARY KEY,
      userId TEXT UNIQUE NOT NULL,
      agentId TEXT UNIQUE NOT NULL,
      department TEXT NOT NULL,
      status TEXT DEFAULT 'offline',
      ticketsAssigned INTEGER DEFAULT 0,
      avgResolutionTime REAL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Support Metrics table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS support_metrics (
      id TEXT PRIMARY KEY,
      period TEXT NOT NULL,
      totalTickets INTEGER DEFAULT 0,
      resolvedTickets INTEGER DEFAULT 0,
      averageResolutionTime REAL,
      customerSatisfaction REAL,
      avgFirstResponseTime REAL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
