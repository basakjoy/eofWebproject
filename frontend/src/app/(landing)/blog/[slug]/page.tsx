'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Clock, Eye, ThumbsUp, ThumbsDown, Calendar,
  Tag, Share2, BookOpen, Loader2, TrendingUp, ChevronRight, Newspaper
} from 'lucide-react';
import blogApi, { BlogArticle } from '@/lib/blogApi';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

// Simple markdown-like renderer
function renderContent(content: string) {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black text-white mt-8 mb-4">{line.slice(2)}</h1>;
    if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-white mt-7 mb-3 border-b border-white/10 pb-2">{line.slice(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-slate-200 mt-5 mb-2">{line.slice(4)}</h3>;
    if (line.startsWith('> ')) return (
      <blockquote key={i} className="border-l-4 border-blue-500 pl-5 py-2 my-4 bg-blue-500/5 rounded-r-xl text-slate-300 italic">
        {line.slice(2)}
      </blockquote>
    );
    if (line.startsWith('- ') || line.startsWith('* ')) return (
      <li key={i} className="ml-5 text-slate-300 leading-relaxed mb-1 list-disc">{line.slice(2)}</li>
    );
    if (line.startsWith('**') && line.endsWith('**')) return (
      <p key={i} className="font-bold text-white my-2">{line.slice(2, -2)}</p>
    );
    if (line.trim() === '') return <div key={i} className="h-3" />;
    return <p key={i} className="text-slate-300 leading-relaxed mb-2">{line}</p>;
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

        // Fetch related articles (same category)
        const relRes = await blogApi.getArticles({ category: res.data.category, limit: 3 });
        setRelated(relRes.data.filter(a => a.id !== res.data.id).slice(0, 3));
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
    } catch { /* ignore */ }
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
      <div className="min-h-screen bg-[#060d14] flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-blue-400" />
      </div>
    );
  }

  if (!article) return null;

  const readTime = Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200));

  return (
    <div className="min-h-screen bg-[#060d14] text-white">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative pt-28 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-8 font-semibold">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight size={12} />
            <span className="text-slate-300 truncate max-w-xs">{article.title}</span>
          </nav>

          {/* Category Badge */}
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 mb-5">
            <Newspaper size={11} className="text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">{article.category}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight bg-gradient-to-br from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-6">
            {article.title}
          </h1>

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-semibold mb-6">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-blue-400" />
              {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-emerald-400" />
              {readTime} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={13} className="text-amber-400" />
              {article.viewCount.toLocaleString()} views
            </span>
            {article.keywords && (
              <span className="flex items-center gap-1.5">
                <Tag size={13} className="text-purple-400" />
                {article.keywords.split(',').slice(0, 3).join(', ')}
              </span>
            )}
          </div>

          {/* Action row */}
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-xl px-4 py-2 transition-all"
            >
              <ArrowLeft size={13} />
              Back to Blog
            </Link>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-white/5 border border-white/10 rounded-xl px-4 py-2 transition-all"
            >
              <Share2 size={13} />
              Share
            </button>
          </div>
        </div>
      </section>

      {/* ── Main Content ──────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">

          {/* Article Body */}
          <article className="min-w-0">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 lg:p-10">
              <div className="prose-custom">
                {renderContent(article.content)}
              </div>

              {/* Helpful Feedback */}
              <div className="mt-10 pt-8 border-t border-white/10">
                <p className="text-sm font-bold text-slate-300 mb-4">Was this article helpful?</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleFeedback(true)}
                    disabled={feedbackSent}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      feedback === 'helpful'
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30'
                    } disabled:opacity-50`}
                  >
                    <ThumbsUp size={14} />
                    Yes, helpful ({article.helpfulCount + (feedback === 'helpful' ? 1 : 0)})
                  </button>
                  <button
                    onClick={() => handleFeedback(false)}
                    disabled={feedbackSent}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      feedback === 'unhelpful'
                        ? 'bg-red-500/20 border-red-500/40 text-red-400'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-red-400 hover:border-red-500/30'
                    } disabled:opacity-50`}
                  >
                    <ThumbsDown size={14} />
                    Not helpful
                  </button>
                  {feedbackSent && (
                    <span className="text-xs text-slate-400 animate-in fade-in">Thank you for your feedback!</span>
                  )}
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* CTA Box */}
            <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={18} className="text-blue-400" />
                <span className="text-sm font-black text-white uppercase tracking-wider">Live Signals</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Get professional forex signals with up to 85% accuracy. Join thousands of traders.
              </p>
              <Link
                href="/trading-signals"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl transition-all"
              >
                View Signals
                <ChevronRight size={13} />
              </Link>
            </div>

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={15} className="text-slate-400" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">Related Articles</h3>
                </div>
                <div className="space-y-3">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/blog/${rel.slug}`}
                      className="flex items-start gap-3 group p-2 rounded-xl hover:bg-white/5 transition-all"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors leading-snug line-clamp-2">
                          {rel.title}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {Math.max(1, Math.ceil(rel.content.split(/\s+/).length / 200))} min read
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}
