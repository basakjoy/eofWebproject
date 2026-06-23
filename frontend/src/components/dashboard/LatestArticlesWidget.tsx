'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, Clock, Eye, ArrowRight, Loader2,
  TrendingUp, GraduationCap, Newspaper, BarChart3
} from 'lucide-react';
import blogApi, { BlogArticle } from '@/lib/blogApi';

const CATEGORY_COLORS: Record<string, string> = {
  Education: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Analysis:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Blog:      'bg-purple-500/15 text-purple-400 border-purple-500/20',
  News:      'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Strategy:  'bg-rose-500/15 text-rose-400 border-rose-500/20',
  Crypto:    'bg-orange-500/15 text-orange-400 border-orange-500/20',
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Education: GraduationCap,
  Analysis: BarChart3,
  Blog: Newspaper,
  News: TrendingUp,
};

export default function LatestArticlesWidget() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await blogApi.getArticles({ limit: 3 });
        setArticles(res.data.slice(0, 3));
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-[#0d1929] border border-white/[0.07] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <h3 className="text-sm font-black text-white tracking-tight">Latest Insights</h3>
        </div>
        <Link
          href="/blog"
          className="flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Articles */}
      <div className="divide-y divide-white/[0.04]">
        {loading ? (
          <>
            {[0, 1, 2].map(i => (
              <div key={i} className="px-5 py-4 animate-pulse flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/5 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-white/5 rounded w-3/4" />
                  <div className="h-2.5 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </>
        ) : articles.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <BookOpen className="w-8 h-8 mx-auto text-slate-700 mb-2" />
            <p className="text-xs text-slate-500 font-medium">No articles published yet</p>
          </div>
        ) : (
          articles.map((article) => {
            const Icon = CATEGORY_ICONS[article.category] ?? Newspaper;
            const catColor = CATEGORY_COLORS[article.category] ?? 'bg-slate-500/15 text-slate-400 border-slate-500/20';
            const readTime = Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200));
            return (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="flex items-start gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors group"
              >
                {/* Category icon */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${catColor}`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors leading-snug line-clamp-2 mb-1.5">
                    {article.title}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-semibold">
                    <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{readTime}m read</span>
                    <span className="flex items-center gap-1"><Eye className="w-2.5 h-2.5" />{article.viewCount.toLocaleString()}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase border ${catColor}`}>
                      {article.category}
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-colors shrink-0 mt-0.5" />
              </Link>
            );
          })
        )}
      </div>

      {/* Footer CTA */}
      {!loading && articles.length > 0 && (
        <div className="px-5 py-3 bg-blue-500/5 border-t border-blue-500/10">
          <Link
            href="/blog"
            className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <TrendingUp className="w-3 h-3" />
            Browse all trading insights
          </Link>
        </div>
      )}
    </div>
  );
}
