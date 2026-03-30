'use client'
import { FileText, Eye, MessageSquare, MoreVertical } from "lucide-react";
import { Badge } from "@/components/dashboard/ui/badge";

interface Article {
  id: string;
  title: string;
  category: string;
  status: "published" | "draft" | "review";
  views: number;
  comments: number;
  author: string;
  date: string;
}

const mockArticles: Article[] = [
  {
    id: "1",
    title: "Understanding Risk Management in Forex",
    category: "Education",
    status: "published",
    views: 1240,
    comments: 23,
    author: "John Smith",
    date: "Jan 20, 2026",
  },
  {
    id: "2",
    title: "Weekly Market Outlook: EUR/USD Analysis",
    category: "Analysis",
    status: "published",
    views: 892,
    comments: 15,
    author: "Sarah Chen",
    date: "Jan 19, 2026",
  },
  {
    id: "3",
    title: "Technical Indicators Every Trader Should Know",
    category: "Education",
    status: "draft",
    views: 0,
    comments: 0,
    author: "Mike Johnson",
    date: "Jan 18, 2026",
  },
  {
    id: "4",
    title: "Central Bank Policies and Currency Movements",
    category: "Blog",
    status: "review",
    views: 0,
    comments: 0,
    author: "Emma Davis",
    date: "Jan 17, 2026",
  },
];

export function RecentArticlesCard() {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="section-title mb-0">Recent Content</h3>
        <button className="text-sm text-primary hover:underline">Manage</button>
      </div>

      <div className="space-y-3">
        {mockArticles.map((article) => (
          <div
            key={article.id}
            className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground text-sm truncate">{article.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{article.category}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{article.author}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  article.status === "published"
                    ? "default"
                    : article.status === "draft"
                    ? "secondary"
                    : "outline"
                }
                className={
                  article.status === "published"
                    ? "bg-success/20 text-success border-0"
                    : article.status === "draft"
                    ? "bg-muted text-muted-foreground"
                    : "bg-warning/20 text-warning border-0"
                }
              >
                {article.status}
              </Badge>
              {article.status === "published" && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {article.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {article.comments}
                  </span>
                </div>
              )}
              <button className="p-1 hover:bg-secondary rounded">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
