'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Share2,
  Loader2,
  ChevronRight,
  ArrowUpRight,
  User,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import blogApi, { BlogArticle } from '@/lib/blogApi';
import Navbar from '@/components/common/Navbar';

/* ─── Content Helpers ──────────────────────────────────────── */

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w]+/g, '-')
    .replace(/(^-|-$)/g, '');

function extractHeadings(content: string) {
  return content
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => {
      const text = line.slice(3).trim();
      return { id: slugify(text), text };
    });
}

function renderContent(content: string) {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('# '))
      return (
        <h1 key={i} className="text-3xl sm:text-4xl font-black text-white mt-10 mb-5 leading-tight">
          {line.slice(2)}
        </h1>
      );
    if (line.startsWith('## ')) {
      const text = line.slice(3).trim();
      return (
        <h2
          key={i}
          id={slugify(text)}
          className="text-2xl sm:text-3xl font-bold text-white mt-12 mb-4 scroll-mt-28 border-l-2 border-fiery-orange pl-4"
        >
          {text}
        </h2>
      );
    }
    if (line.startsWith('### '))
      return (
        <h3 key={i} className="text-xl font-bold text-white mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
    if (line.startsWith('> '))
      return (
        <blockquote key={i} className="my-8 p-6 rounded-2xl bg-fiery-orange/10 border-l-4 border-fiery-orange backdrop-blur-md">
          <p className="text-lg font-semibold italic text-white leading-relaxed">
            &ldquo;{line.slice(2)}&rdquo;
          </p>
        </blockquote>
      );
    const image = line.match(/^!\[(.*)\]\((.*)\)$/);
    if (image)
      return (
        <div key={i} className="my-8 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <img
            src={image[2]}
            alt={image[1]}
            className="w-full object-cover max-h-[500px]"
          />
        </div>
      );
    if (line.startsWith('- ') || line.startsWith('* '))
      return (
        <li key={i} className="ml-6 mb-2 list-disc text-zinc-300 font-light leading-relaxed">
          {line.slice(2)}
        </li>
      );
    if (line.startsWith('**') && line.endsWith('**'))
      return (
        <p key={i} className="my-3 font-bold text-white text-base">
          {line.slice(2, -2)}
        </p>
      );
    if (line.trim() === '') return <div key={i} className="h-4" />;
    return (
      <p key={i} className="mb-4 text-zinc-300 font-light leading-relaxed text-base">
        {line}
      </p>
    );
  });
}

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [related, setRelated] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<'helpful' | 'unhelpful' | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await blogApi.getArticleBySlug(slug);
        setArticle(res.data);

        const relRes = await blogApi.getArticles({ category: res.data.category, limit: 3 });
        setRelated(relRes.data.filter((a) => a.id !== res.data.id).slice(0, 2));
      } catch {
        router.push('/blog');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleFeedback = async (helpful: boolean) => {
    if (feedbackSent || !article) return;
    try {
      await blogApi.markHelpful(article.id, helpful);
      setFeedback(helpful ? 'helpful' : 'unhelpful');
      setFeedbackSent(true);
    } catch {
      /* ignore */
    }
  };

  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({ title: article.title, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030305] text-white">
        <Loader2 size={40} className="animate-spin text-fiery-orange" />
      </div>
    );
  }

  if (!article) return null;

  const readTime = Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200));
  const headings = extractHeadings(article.content);
  const tags = article.keywords ? article.keywords.split(',').map((k) => k.trim()).filter(Boolean) : [];
  const publishedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="w-full min-h-screen bg-[#030305] text-white font-poppins overflow-x-hidden">
      <Navbar />

      {/* ── Ambient Background & Image Overlay ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="https://res.cloudinary.com/xxx8fpey/image/upload/v1788764499/pexels-joaojesusdesign-925711.jpg"
          alt="Markets Background"
          className="w-full h-full object-cover opacity-15 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030305]/70 via-[#030305]/85 to-[#030305]" />
        <div className="absolute -top-40 right-[-15%] w-[800px] h-[800px] bg-[#FF6B00]/10 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] left-[-10%] w-[600px] h-[600px] bg-[#FF3D00]/8 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10">

        {/* ══ HERO ══ */}
        <section className="pt-36 pb-12 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <nav className="mb-6 flex items-center justify-center gap-2 text-xs font-medium text-zinc-400">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={12} className="text-zinc-600" />
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <ChevronRight size={12} className="text-zinc-600" />
              <span className="text-fiery-orange font-bold">{article.category}</span>
            </nav>

            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-fiery-orange/10 border border-fiery-orange/30 text-xs font-bold text-fiery-orange mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              {article.category}
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight mb-6">
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed max-w-2xl mx-auto mb-8">
              {article.excerpt ?? article.content.slice(0, 150).replace(/[#*`>]/g, '').trim() + '...'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-md text-zinc-400 pt-4 border-t border-white/10">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-fiery-orange" /> Empire Research Desk
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-fiery-orange" /> {publishedDate}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-fiery-orange" /> {readTime} min read
              </span>
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-fiery-orange" /> {article.viewCount.toLocaleString()} views
              </span>
            </div>
          </div>
        </section>

        {/* ══ COVER IMAGE BANNER ══ */}
        {article.imageUrl && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full max-h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030305]/60 via-transparent to-transparent" />
            </div>
          </div>
        )}

        {/* ══ MAIN ARTICLE CONTENT & SIDEBAR ══ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

            {/* Main Article Body */}
            <div className="lg:col-span-2 p-8 sm:p-12 rounded-3xl border border-white/10 bg-[#0C0C10]/40 backdrop-blur shadow-2xl">
              <article className="prose prose-invert max-w-none">
                {renderContent(article.content)}
              </article>

              {/* Keywords / Tags */}
              {tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-bold text-zinc-400 mr-2 uppercase tracking-wider">Tags:</span>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-zinc-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Feedback Widget */}
              <div className="mt-10 pt-8 border-t border-white/10 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-sm font-bold text-white mb-4">Was this article helpful?</p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleFeedback(true)}
                    disabled={feedbackSent}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      feedback === 'helpful'
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                        : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-400'
                    } disabled:opacity-50`}
                  >
                    <ThumbsUp size={14} />
                    Yes, helpful ({article.helpfulCount + (feedback === 'helpful' ? 1 : 0)})
                  </button>
                  <button
                    onClick={() => handleFeedback(false)}
                    disabled={feedbackSent}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      feedback === 'unhelpful'
                        ? 'border-rose-500 bg-rose-500/20 text-rose-400'
                        : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:border-rose-500/50 hover:text-rose-400'
                    } disabled:opacity-50`}
                  >
                    <ThumbsDown size={14} />
                    Not helpful
                  </button>
                  {feedbackSent && (
                    <span className="text-xs text-fiery-orange font-semibold">
                      Thank you for your feedback!
                    </span>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-10 pt-8 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.04] hover:border-fiery-orange/40 text-xs font-bold text-white transition-all"
                >
                  <ArrowLeft size={14} />
                  Back to Blog
                </Link>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.04] hover:border-fiery-orange/40 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  <Share2 size={14} />
                  Share Article
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="p-6 rounded-3xl border border-white/10 bg-[#0C0C10]/40 backdrop-blur-2xl shadow-xl">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-fiery-orange mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Table of Contents
                  </h3>
                  <ul className="space-y-2.5 border-l border-white/10 pl-4">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          className="text-xs font-medium text-zinc-400 hover:text-fiery-orange transition-colors block leading-relaxed"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Author & Info Card */}
              <div className="p-6 rounded-3xl border border-white/10 bg-[#0C0C10]/40 backdrop-blur-2xl shadow-xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-fiery-orange border-b border-white/10 pb-3">
                  Article Info
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-fiery-orange/10 border border-fiery-orange/30 flex items-center justify-center text-fiery-orange font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Empire Research Desk</p>
                    <p className="text-xs text-zinc-400">{publishedDate}</p>
                  </div>
                </div>
                <div className="pt-2 text-xs text-zinc-400 space-y-2 border-t border-white/[0.06]">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="text-white font-semibold">{article.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reading Time:</span>
                    <span className="text-white font-semibold">{readTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Views:</span>
                    <span className="text-white font-semibold">{article.viewCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Newsletter Callout */}
              <div className="p-6 rounded-3xl border border-fiery-orange/30 bg-gradient-to-br from-[#0C0C10]/80 via-[#0C0C10]/50 to-[#111116]/80 backdrop-blur-2xl shadow-2xl">
                <h4 className="text-base font-bold text-white mb-2">Subscribe to Research Desk</h4>
                <p className="text-xs text-zinc-400 mb-4  leading-relaxed">
                  Get our weekly market analysis and trade breakdowns delivered to your inbox.
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 mb-3 focus:outline-none focus:border-fiery-orange/50"
                />
                <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-fiery-orange to-fiery-amber text-white font-bold text-xs shadow-fiery">
                  Subscribe
                </button>
              </div>
            </aside>

          </div>
        </section>

        {/* ══ RELATED ARTICLES BANNER ══ */}
        {related.length > 0 && (
          <section className="py-20 px-4 sm:px-6 bg-[#0A0A0E]/50 border-t border-white/10">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
                <div>
                  <p className="text-xs font-bold text-fiery-orange uppercase tracking-widest mb-2">More Research</p>
                  <h2 className="text-3xl sm:text-4xl font-black text-white">From the Blog</h2>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:border-fiery-orange/40 text-xs font-bold text-white transition-all"
                >
                  View All Articles <ArrowUpRight className="w-4 h-4 text-fiery-orange" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="group flex flex-col justify-between p-6 rounded-3xl border border-white/10 bg-[#0C0C10]/40 hover:border-fiery-orange/40 hover:bg-[#0C0C10]/70 backdrop-blur-2xl transition-all duration-300"
                  >
                    <div>
                      <div
                        className="h-48 w-full rounded-2xl bg-zinc-800 bg-cover bg-center mb-5 border border-white/10 overflow-hidden group-hover:scale-[1.02] transition-transform"
                        style={{ backgroundImage: rel.imageUrl ? `url(${rel.imageUrl})` : undefined }}
                      />
                      <span className="text-[10px] font-bold text-fiery-orange uppercase tracking-wider block mb-2">
                        {rel.category}
                      </span>
                      <h3 className="text-xl font-bold text-white group-hover:text-fiery-orange transition-colors mb-2">
                        {rel.title}
                      </h3>
                      <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed">
                        {rel.excerpt ?? rel.content.slice(0, 110).replace(/[#*`>]/g, '').trim() + '...'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}