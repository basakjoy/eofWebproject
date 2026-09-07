'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  Clock,
  Eye,
  ChevronRight,
  TrendingUp,
  Newspaper,
  GraduationCap,
  BarChart3,
  Zap,
  Tag,
  User,
  ArrowRight,
  Sparkles,
  ArrowUpRight,
  Loader2,
  Calendar,
} from 'lucide-react';
import { motion } from 'framer-motion';
import blogApi, { BlogArticle } from '@/lib/blogApi';

/* ─── Helpers ──────────────────────────────────────────────── */

const readTimeOf = (article: BlogArticle) =>
  Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200));

const excerptOf = (article: BlogArticle, len = 120) =>
  article.excerpt ?? article.content.slice(0, len).replace(/[#*`>]/g, '').trim() + '...';

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/* ─── Components ───────────────────────────────────────────── */

// Main Hero Featured Article Card
function FeaturedArticleHero({ article }: { article: BlogArticle }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group relative flex min-h-[460px] md:min-h-[520px] flex-col justify-end overflow-hidden rounded-3xl border border-white/10 bg-[#0C0C10]/60 backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:border-fiery-orange/40"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: article.imageUrl ? `url(${article.imageUrl})` : undefined }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/70 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-fiery-orange/40 to-transparent" />

      <div className="relative z-10 p-8 sm:p-12 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fiery-orange/20 border border-fiery-orange/40 text-xs font-bold text-fiery-orange backdrop-blur-md">
            <Sparkles className="w-3 h-3" />
            {article.category}
          </span>
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-fiery-orange" />
            {readTimeOf(article)} min read
          </span>
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-fiery-orange" />
            {formatDate(article.createdAt)}
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl  text-white leading-tight mb-4 group-hover:text-fiery-orange transition-colors">
          {article.title}
        </h2>
        <p className="line-clamp-2 text-sm sm:text-base text-zinc-300 font-light mb-6 leading-relaxed max-w-2xl">
          {excerptOf(article, 180)}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-fiery-orange/10 border border-fiery-orange/30 flex items-center justify-center text-fiery-orange text-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs  text-white">Empire Research Desk</p>
              <p className="text-[10px] text-zinc-400">Verified Market Analysis</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 text-xs font-extrabold text-fiery-orange group-hover:translate-x-1 transition-transform">
            Read Full Article <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// Grid Article Card
function ArticleCard({ article }: { article: BlogArticle }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-[#0C0C10]/40 hover:bg-[#0C0C10]/70 hover:border-fiery-orange/40 backdrop-blur-2xl shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div>
        <div className="relative h-52 w-full overflow-hidden bg-[#0C0C10]">
          {article.imageUrl ? (
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${article.imageUrl})` }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-fiery-orange/10 via-[#0C0C10] to-fiery-amber/10 flex items-center justify-center">
              <Newspaper className="w-10 h-10 text-fiery-orange/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C10] via-transparent to-transparent" />
          <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full bg-[#030305]/80 border border-white/10 text-[10px] font-bold text-fiery-orange backdrop-blur-md">
            {article.category}
          </span>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 text-[11px] text-zinc-400 mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-fiery-orange" /> {readTimeOf(article)} min
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-fiery-orange" /> {article.viewCount} views
            </span>
          </div>

          <h3 className="text-lg font-bold text-white leading-snug mb-3 group-hover:text-fiery-orange transition-colors line-clamp-2">
            {article.title}
          </h3>

          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 font-light mb-4">
            {excerptOf(article, 120)}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
        <span>{formatDate(article.createdAt)}</span>
        <span className="flex items-center gap-1 text-fiery-orange font-semibold group-hover:translate-x-1 transition-transform">
          Read <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

// Sidebar Row Item
function SidebarRow({ article }: { article: BlogArticle }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex items-center gap-4 p-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-fiery-orange/30 transition-all"
    >
      <div
        className="w-16 h-16 shrink-0 rounded-xl bg-zinc-800 bg-cover bg-center overflow-hidden relative border border-white/10"
        style={{ backgroundImage: article.imageUrl ? `url(${article.imageUrl})` : undefined }}
      >
        {!article.imageUrl && (
          <div className="w-full h-full flex items-center justify-center bg-fiery-orange/10">
            <Newspaper className="w-5 h-5 text-fiery-orange" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-bold text-fiery-orange uppercase tracking-wider block mb-1">
          {article.category}
        </span>
        <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-fiery-orange transition-colors">
          {article.title}
        </h4>
        <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-2">
          <span>{readTimeOf(article)} min read</span>
          <span>•</span>
          <span>{article.viewCount} views</span>
        </p>
      </div>
    </Link>
  );
}

// Card Skeleton
function CardSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0C0C10]/40 p-6 space-y-4 animate-pulse">
      <div className="h-44 bg-zinc-800/50 rounded-2xl" />
      <div className="h-4 bg-zinc-800/50 rounded w-3/4" />
      <div className="h-3 bg-zinc-800/50 rounded w-full" />
      <div className="h-3 bg-zinc-800/50 rounded w-2/3" />
    </div>
  );
}

/* ─── Main Page Component ─────────────────────────────────── */

export default function BlogPage() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const LIMIT = 12;

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

  const fetchCategories = async () => {
    try {
      const res = await blogApi.getCategories();
      const unique = res.data.filter((c) => c.toLowerCase() !== 'all');
      setCategories(['All', ...unique]);
    } catch {
      setCategories(['All']);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [activeCategory, search, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(0);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(0);
  };

  const totalPages = Math.ceil(total / LIMIT);

  const heroArticle = articles.length > 0 && !search && page === 0 ? articles[0] : null;
  const gridArticles = heroArticle ? articles.slice(1) : articles;
  const sidebarTrending = [...articles].sort((a, b) => b.viewCount - a.viewCount).slice(0, 4);

  return (
    <div className="w-full min-h-screen bg-[#030305] text-white font-poppins overflow-x-hidden">

      {/* ── Ambient Background & Image Overlay ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="https://res.cloudinary.com/xxx8fpey/image/upload/v1788764499/pexels-joaojesusdesign-925711.jpg"
          alt="Markets Background"
          className="w-full h-full object-cover opacity-20 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030305]/70 via-[#030305]/85 to-[#030305]" />
        <div className="absolute -top-40 right-[-15%] w-[800px] h-[800px] bg-[#FF6B00]/10 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-[#FF3D00]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-[#FF6B00]/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10">

        {/* ══ HERO ══ */}
        <section className="pt-36 pb-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fiery-orange/10 border border-fiery-orange/20 text-xs font-bold text-fiery-orange mb-8 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 fill-fiery-orange" />
              INSTITUTIONAL INSIGHTS · RESEARCH & ANALYSIS
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-7xl lg:text-[5.5rem] text-white leading-[1.05] tracking-tight mb-6"
            >
              Market{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8C00] to-[#FFB800]">
                Insights
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg leading-relaxed max-w-2xl mx-auto font-light text-zinc-400 mb-10"
            >
              Stay ahead with real-time institutional breakdowns, technical research, and strategies
              curated by our trading desk.
            </motion.p>

            {/* Glass Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto flex items-center gap-3"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search market reports, strategies, or topics..."
                  className="w-full bg-[#0C0C10]/60 border border-white/10 rounded-full pl-11 pr-10 py-3.5 text-sm text-white placeholder-zinc-500 backdrop-blur-xl focus:outline-none focus:border-fiery-orange/50 transition-all shadow-xl"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-fiery-orange to-fiery-amber text-white font-extrabold text-sm shadow-fiery hover:scale-105 transition-all shrink-0"
              >
                Search
              </button>
            </motion.form>

            {/* Category Filter Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-2"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setPage(0);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-fiery-orange to-fiery-amber text-white shadow-fiery scale-105'
                      : 'bg-white/[0.04] border border-white/10 hover:border-fiery-orange/30 text-zinc-300 hover:bg-white/[0.08]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ MAIN BODY ══ */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-16">

          {/* Active Search / Category Indicator */}
          {!loading && (search || activeCategory !== 'All') && (
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <p className="text-sm font-medium text-zinc-400">
                Found <span className="text-fiery-orange font-bold">{total}</span> articles
                {search && (
                  <span>
                    {' '}matching &ldquo;<span className="text-white">{search}</span>&rdquo;
                  </span>
                )}
                {activeCategory !== 'All' && (
                  <span> in category &ldquo;<span className="text-white">{activeCategory}</span>&rdquo;</span>
                )}
              </p>
              {(search || activeCategory !== 'All') && (
                <button
                  onClick={() => {
                    clearSearch();
                    setActiveCategory('All');
                  }}
                  className="text-xs text-fiery-orange hover:underline flex items-center gap-1 font-bold"
                >
                  Clear Filters <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* 1. Featured Article Hero Banner */}
          {heroArticle && !loading && (
            <section className="relative">
              <FeaturedArticleHero article={heroArticle} />
            </section>
          )}

          {/* 2. Grid & Sidebar Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Main Grid Column */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-fiery-orange" />
                  {heroArticle ? 'More Articles' : 'Latest Insights'}
                </h2>
                <span className="text-xs text-zinc-500 font-medium">Updated Daily</span>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <CardSkeleton key={i} />
                  ))}
                </div>
              ) : gridArticles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {gridArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center rounded-3xl border border-white/10 bg-[#0C0C10]/40 backdrop-blur-2xl">
                  <Newspaper className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-1">No articles found</h3>
                  <p className="text-xs text-zinc-400">Try adjusting your search criteria or category filter.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">

              {/* Trending Articles Widget */}
              <div className="p-6 rounded-3xl border border-white/10 bg-[#0C0C10]/40 backdrop-blur-2xl shadow-xl">
                <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2 border-b border-white/10 pb-3">
                  <TrendingUp className="w-4 h-4 text-fiery-orange" />
                  Trending Reads
                </h3>
                <div className="space-y-3">
                  {sidebarTrending.map((art) => (
                    <SidebarRow key={art.id} article={art} />
                  ))}
                </div>
              </div>

              {/* Topics / Tags Widget */}
              <div className="p-6 rounded-3xl border border-white/10 bg-[#0C0C10]/40 backdrop-blur-2xl shadow-xl">
                <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2 border-b border-white/10 pb-3">
                  <Tag className="w-4 h-4 text-fiery-orange" />
                  Explore Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setPage(0);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        activeCategory === cat
                          ? 'bg-fiery-orange text-white'
                          : 'bg-white/[0.04] border border-white/10 hover:border-fiery-orange/30 text-zinc-300 hover:bg-white/[0.08]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter Subscription Widget */}
              <div className="relative p-8 rounded-3xl border border-fiery-orange/30 bg-gradient-to-br from-[#0C0C10]/90 via-[#0C0C10]/60 to-[#111116]/90 backdrop-blur-2xl shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-fiery-orange/10 blur-[50px] rounded-full pointer-events-none" />
                <h3 className="text-xl font-bold text-white mb-2 leading-snug">
                  Get Daily Market Signals & Research
                </h3>
                <p className="text-xs text-zinc-400 mb-6 font-light leading-relaxed">
                  Subscribe to our research newsletter for key market breakdowns delivered directly to your inbox.
                </p>
                <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-fiery-orange/50 transition-all"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-fiery-orange to-fiery-amber text-white font-extrabold text-xs shadow-fiery hover:scale-[1.02] transition-all"
                  >
                    Subscribe Now
                  </button>
                </form>
              </div>

            </aside>

          </section>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-10 border-t border-white/10">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-5 py-2.5 rounded-full border border-white/10 bg-[#0C0C10]/60 text-xs font-bold text-zinc-300 hover:border-fiery-orange/30 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <div className="hidden sm:flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-9 h-9 rounded-full text-xs font-extrabold transition-all ${
                      page === i
                        ? 'bg-gradient-to-r from-fiery-orange to-fiery-amber text-white shadow-fiery'
                        : 'border border-white/10 bg-[#0C0C10]/60 text-zinc-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="px-5 py-2.5 rounded-full border border-white/10 bg-[#0C0C10]/60 text-xs font-bold text-zinc-300 hover:border-fiery-orange/30 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}