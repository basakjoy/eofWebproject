"use client";

import { Plus, Filter, Search, FileText, Eye, MessageSquare, MoreVertical, Edit, Trash2, Clock } from "lucide-react";
import { Button }  from "@/components/dashboard/ui/button";
import { Input } from "@/components/dashboard/ui/input";
import { Badge } from "@/components/dashboard/ui/badge";
import { useRouter } from "next/navigation";

import { useState } from "react";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  status: "published" | "draft" | "review";
  views: number;
  comments: number;
  author: string;
  date: string;
  readTime: string;
}

const mockArticles: Article[] = [
  { id: "1", title: "Understanding Risk Management in Forex", excerpt: "Learn the fundamentals of protecting your capital...", category: "Education", status: "published", views: 1240, comments: 23, author: "John Smith", date: "Jan 20, 2026", readTime: "8 min" },
  { id: "2", title: "Weekly Market Outlook: EUR/USD Analysis", excerpt: "A comprehensive technical and fundamental analysis...", category: "Analysis", status: "published", views: 892, comments: 15, author: "Sarah Chen", date: "Jan 19, 2026", readTime: "5 min" },
  { id: "3", title: "Technical Indicators Every Trader Should Know", excerpt: "Master these essential indicators to improve...", category: "Education", status: "draft", views: 0, comments: 0, author: "Mike Johnson", date: "Jan 18, 2026", readTime: "12 min" },
  { id: "4", title: "Central Bank Policies and Currency Movements", excerpt: "How monetary policies affect forex markets...", category: "Blog", status: "review", views: 0, comments: 0, author: "Emma Davis", date: "Jan 17, 2026", readTime: "10 min" },
  { id: "5", title: "Psychology of Trading: Mastering Your Emotions", excerpt: "The mental game is crucial for trading success...", category: "Education", status: "published", views: 2100, comments: 45, author: "David Lee", date: "Jan 16, 2026", readTime: "7 min" },
];

export default function ArticlesPage() {
  const router = useRouter();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        

        <Button
          onClick={() => router.push("/admin/articles/new")}
          className="bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search articles..." className="pl-10 bg-white border-gray-200" />
        </div>

        <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Articles List */}
      <div className="grid gap-4">
        {mockArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>

                <div>
                  <h3
                    onClick={() => router.push(`/admin/articles/${article.id}`)}
                    className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                  >
                    {article.title}
                  </h3>

                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                    {article.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                      {article.category}
                    </Badge>

                    <span className="text-xs text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>

                    <span className="text-xs text-gray-600">
                      {article.author}
                    </span>

                    <span className="text-xs text-gray-600">
                      {article.date}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge
                  className={
                    article.status === "published"
                      ? "bg-green-100 text-green-700 border-0"
                      : article.status === "draft"
                      ? "bg-gray-100 text-gray-700 border-0"
                      : "bg-amber-100 text-amber-700 border-0"
                  }
                >
                  {article.status}
                </Badge>

                {article.status === "published" && (
                  <div className="hidden sm:flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {article.views.toLocaleString()}
                    </span>

                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {article.comments}
                    </span>
                  </div>
                )}

                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === article.id ? null : article.id)
                    }
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>

                  {openMenuId === article.id && (
                    <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => {
                          router.push(`/admin/articles/edit/${article.id}`);
                          setOpenMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm first:rounded-t-lg"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>

                      <button
                        onClick={() => setOpenMenuId(null)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm last:rounded-b-lg border-t border-gray-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
