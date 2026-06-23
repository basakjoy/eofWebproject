'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, BookOpen, Clock, Eye, ThumbsUp, ChevronRight,
  TrendingUp, Newspaper, GraduationCap, BarChart3, ArrowRight,
  Loader2, Filter, X, User, Zap, Tag
} from 'lucide-react';
import blogApi, { BlogArticle } from '@/lib/blogApi';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

/* ─── Config ──────────────────────────────────────────────── */
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  All:       Filter,
  Education: GraduationCap,
  Analysis:  BarChart3,
  Blog:      Newspaper,
  News:      TrendingUp,
  Strategy:  Zap,
  Crypto:    TrendingUp,
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  Education: 'from-blue-600/30 via-blue-700/10 to-transparent',
  Analysis:  'from-emerald-600/30 via-emerald-700/10 to-transparent',
  Blog:      'from-purple-600/30 via-purple-700/10 to-transparent',
  News:      'from-amber-600/30 via-amber-700/10 to-transparent',
  Strategy:  'from-rose-600/30 via-rose-700/10 to-transparent',
  Crypto:    'from-orange-600/30 via-orange-700/10 to-transparent',
};

const CATEGORY_BADGE: Record<string, string> = {
  Education: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
  Analysis:  'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
  Blog:      'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
  News:      'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
  Strategy:  'from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-400',
  Crypto:    'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400',
};

const getGradient = (cat: string) => CATEGORY_GRADIENTS[cat] ?? 'from-slate-600/20 to-transparent';
const getBadge   = (cat: string) => CATEGORY_BADGE[cat] ?? 'from-slate-500/20 to-slate-600/10 border-slate-500/30 text-slate-400';

/* ─── Hero Card (first article, full width) ───────────────── */
function HeroCard({ article }: { article: BlogArticle }) {
  const grad = getGradient(article.category);
  const badge = getBadge(article.category);
  const readTime = Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200));

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group relative flex flex-col md:flex-row bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 hover:bg-white/[0.05] transition-all duration-500 hover:shadow-2xl hover:shadow-blue-950/30"
    >
      {/* Left: cover gradient panel */}
      <div className={`relative md:w-2/5 min-h-[220px] bg-gradient-to-br ${grad} flex items-center justify-center`}>
        <div className="absolute inset-0 bg-[#060d14]/60" />
        <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br border flex items-center justify-center mb-4 ${badge}`}>
            <BookOpen className="w-8 h-8" />
          </div>
          <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border bg-gradient-to-r ${badge}`}>
            {article.category}
          </span>
          <p className="text-[10px] text-slate-500 mt-3 font-semibold uppercase tracking-widest">Featured Article</p>
        </div>
      </div>

      {/* Right: content */}
      <div className="flex-1 p-7 lg:p-10 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
              Latest Post
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-white group-hover:text-blue-200 transition-colors leading-tight mb-4">
            {article.title}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6">
            {article.excerpt ?? article.content.slice(0, 200).replace(/[#*`>]/g, '').trim()}...
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-400" />{readTime} min read</span>
            <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-emerald-400" />{article.viewCount.toLocaleString()} views</span>
            <span className="flex items-center gap-1.5"><ThumbsUp className="w-3.5 h-3.5 text-amber-400" />{article.helpfulCount}</span>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-black text-blue-400 group-hover:gap-3 transition-all">
            Read Full Article <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Regular Article Card ────────────────────────────────── */
function ArticleCard({ article }: { article: BlogArticle }) {
  const grad = getGradient(article.category);
  const badge = getBadge(article.category);
  const readTime = Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200));

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/30"
    >
      {/* Cover panel */}
      <div className={`relative h-40 bg-gradient-to-br ${grad} flex items-center justify-center`}>
        <div className="absolute inset-0 bg-[#060d14]/50" />
        <div className="relative z-10 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br border flex items-center justify-center ${badge}`}>
            <BookOpen className="w-5 h-5" />
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border bg-gradient-to-r ${badge}`}>
            {article.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors mb-2 leading-snug line-clamp-2">
          {article.title}
        </h2>
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-4 flex-1">
          {article.excerpt ?? article.content.slice(0, 150).replace(/[#*`>]/g, '').trim()}...
        </p>

        {/* Keywords */}
        {article.keywords && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {article.keywords.split(',').filter(k => k.trim()).slice(0, 2).map((k, i) => (
              <span key={i} className="flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-md">
                <Tag className="w-2 h-2" />{k.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 text-[10px] text-slate-500 font-semibold">
            <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{readTime}m</span>
            <span className="flex items-center gap-1"><Eye className="w-2.5 h-2.5" />{article.viewCount.toLocaleString()}</span>
            <span className="flex items-center gap-1"><ThumbsUp className="w-2.5 h-2.5" />{article.helpfulCount}</span>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-black text-blue-400 group-hover:gap-2 transition-all">
            Read <ArrowRight className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Skeleton ─────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden animate-pulse">
      <div className="h-40 bg-white/[0.04]" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-white/[0.05] rounded w-3/4" />
        <div className="h-3 bg-white/[0.04] rounded w-full" />
        <div className="h-3 bg-white/[0.04] rounded w-5/6" />
        <div className="h-3 bg-white/[0.03] rounded w-1/2" />
      </div>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function BlogPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [catCounts, setCatCounts] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const LIMIT = 9;

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await blogApi.getArticles({
        category: activeCategory === 'All' ? undefined : activeCategory,
        search: search || undefined,
        limit: LIMIT,
        offset: page * LIMIT,
      });
      setArticles(res.data);
      setTotal(res.total);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeta = async () => {
    try {
      const [catRes, allRes] = await Promise.all([
        blogApi.getCategories(),
        blogApi.getArticles({ limit: 200 }),
      ]);
      setCategories(catRes.data);
      // count per category
      const counts: Record<string, number> = { All: allRes.total };
      allRes.data.forEach(a => { counts[a.category] = (counts[a.category] || 0) + 1; });
      setCatCounts(counts);
    } catch {
      setCategories(['All']);
    }
  };

  useEffect(() => { fetchMeta(); }, []);
  useEffect(() => { fetchArticles(); }, [activeCategory, search, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(0);
  };

  const clearSearch = () => { setSearchInput(''); setSearch(''); setPage(0); };

  const totalPages = Math.ceil(total / LIMIT);
  const [heroArticle, ...restArticles] = articles;

  return (
    <div className="min-h-screen bg-[#060d14] text-white">
      <Navbar />

      {/* ── Hero Banner ──────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-[#060d14] to-emerald-950/20" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <Newspaper className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-black uppercase tracking-widest text-blue-400">Forex Insights</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-5">
            Trading Blog & Analysis
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Expert market analysis, trading education, and forex insights — written by professional traders for traders.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center max-w-xl mx-auto gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search articles, analysis, education..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-10 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all"
              />
              {searchInput && (
                <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3.5 rounded-2xl transition-all text-sm whitespace-nowrap shadow-lg shadow-blue-900/30">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── Category Filter Tabs ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 mb-10">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(cat => {
            const Icon = CATEGORY_ICONS[cat] ?? Newspaper;
            const isActive = activeCategory === cat;
            const count = catCounts[cat];
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(0); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/8 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat}
                {count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Content ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        {/* Result count */}
        {!loading && (
          <p className="text-xs text-slate-500 mb-7 text-center font-medium">
            {total > 0 ? `Showing ${articles.length} of ${total} articles` : 'No articles found'}
            {search && <span className="ml-1">for "<span className="text-white">{search}</span>"</span>}
          </p>
        )}

        {loading ? (
          <div className="space-y-6">
            {/* Hero skeleton */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl overflow-hidden animate-pulse h-52" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen className="w-12 h-12 mx-auto text-slate-700 mb-4" />
            <h3 className="text-lg font-bold text-slate-400 mb-2">No articles found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your search or category filter</p>
            {(search || activeCategory !== 'All') && (
              <button
                onClick={() => { setActiveCategory('All'); clearSearch(); }}
                className="mt-4 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Clear all filters →
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Hero: first article featured large */}
            {page === 0 && !search && heroArticle && (
              <HeroCard article={heroArticle} />
            )}

            {/* Remaining articles grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(page === 0 && !search ? restArticles : articles).map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-4 py-2 text-xs font-bold bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                  page === i
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 text-xs font-bold bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
