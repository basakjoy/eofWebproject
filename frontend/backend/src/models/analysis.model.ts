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
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      symbol TEXT,
      content TEXT NOT NULL,
      metrics TEXT,
      createdBy TEXT NOT NULL,
      status TEXT DEFAULT 'draft',
      viewCount INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Analysis Metrics table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS analysis_metrics (
      id TEXT PRIMARY KEY,
      analysisId TEXT NOT NULL,
      metricName TEXT NOT NULL,
      metricValue TEXT,
      unit TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (analysisId) REFERENCES analysis(id) ON DELETE CASCADE
    )
  `);

  // Analysis Comments table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS analysis_comments (
      id TEXT PRIMARY KEY,
      analysisId TEXT NOT NULL,
      userId TEXT NOT NULL,
      comment TEXT NOT NULL,
      rating INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (analysisId) REFERENCES analysis(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Analysis Reports table
  await runAsync(`
    CREATE TABLE IF NOT EXISTS analysis_reports (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      period TEXT NOT NULL,
      summary TEXT,
      statistics TEXT,
      createdBy TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
};
