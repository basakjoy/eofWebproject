export interface Author {
    name: string;
    role: string;
    avatar: string;
}

export interface Article {
    id: string;
    category: string;
    title: string;
    imageUrl: string;
    readTime: string;
    volatility?: string;
    riskStatus?: 'low' | 'medium' | 'high';
    author: Author;
    publishedAt: string;
    tags: string[];
}

export interface EconomicEvent {
    id: string;
    time: string;
    currency: string;
    event: string;
    importance: 'low' | 'medium' | 'high';
    actual: string | null;
    forecast: string;
    previous: string;
    timestamp: Date;
}

export interface LiveTicker {
    pair: string;
    price: number;
    change: number;
    high: number;
    low: number;

}

export interface position {
    id: string;
    pair: string;
    type: 'BUY' | 'SELL';
    entryPrice: number;
    volume: number;
    stopLoss: number;
    takeProfit: number;
    pn1: number;
    timestamp: string;
}

export interface Strategy {
    id: string;
    title: string;
    category: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    description: string;
    setup: string;
    entryRules: string[];
    riskReward: string[];
    winRate: number;
}
