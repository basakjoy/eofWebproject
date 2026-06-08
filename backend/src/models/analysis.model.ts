// Analysis Model Types and Interfaces
export interface Analysis {
  id: string;
  title: string;
  type: 'market' | 'technical' | 'fundamental' | 'sentiment';
  symbol?: string;
  content: string;
  metrics?: Record<string, any>;
  createdBy: string;
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
  favorited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalysisMetric {
  id: string;
  analysisId: string;
  metricName: string;
  metricValue: string | number;
  unit?: string;
}

export interface AnalysisComment {
  id: string;
  analysisId: string;
  userId: string;
  comment: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalysisReport {
  id: string;
  title: string;
  period: string;
  summary: string;
  statistics: Record<string, any>;
  createdBy: string;
  createdAt: Date;
}

/**
 * Initialize analysis tables in database
 */
export const initAnalysisTables = async (runAsync: (sql: string, params?: any[]) => Promise<void>) => {
  // Analysis table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS analysis (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      type VARCHAR(100) NOT NULL,
      symbol VARCHAR(50),
      content TEXT NOT NULL,
      metrics TEXT,
      createdBy VARCHAR(36) NOT NULL,
      status VARCHAR(50) DEFAULT 'draft',
      viewCount INT DEFAULT 0,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Analysis Metrics table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS analysis_metrics (
      id VARCHAR(36) PRIMARY KEY,
      analysisId VARCHAR(36) NOT NULL,
      metricName VARCHAR(255) NOT NULL,
      metricValue TEXT,
      unit VARCHAR(100),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (analysisId) REFERENCES analysis(id) ON DELETE CASCADE
    )
  `);

  // Analysis Comments table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS analysis_comments (
      id VARCHAR(36) PRIMARY KEY,
      analysisId VARCHAR(36) NOT NULL,
      userId VARCHAR(36) NOT NULL,
      comment TEXT NOT NULL,
      rating INT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (analysisId) REFERENCES analysis(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Analysis Reports table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS analysis_reports (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      period VARCHAR(100) NOT NULL,
      summary TEXT,
      statistics TEXT,
      createdBy VARCHAR(36) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};
