"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Clock, Eye, ThumbsUp, ThumbsDown, Calendar,
  Share2, Loader2, ChevronRight, ArrowUpRight, User
} from 'lucide-react';
import blogApi, { BlogArticle } from '@/lib/blogApi';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

/* ─── Content helpers ──────────────────────────────────────── */

const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '');

// Pull the "## " headings out of the markdown-ish body so we can build
// a table of contents that jumps to the matching heading in the article.
function extractHeadings(content: string) {
  return content
    .split('\n')
    .filter(line => line.startsWith('## '))
    .map(line => {
      const text = line.slice(3).trim();
      return { id: slugify(text), text };
    });
}

// Simple markdown-like renderer
function renderContent(content: string) {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('# '))
      return <h1 key={i} className="mb-4 mt-8 text-3xl font-bold text-slate-900">{line.slice(2)}</h1>;
    if (line.startsWith('## ')) {
      const text = line.slice(3).trim();
      return (
        <h2 key={i} id={slugify(text)} className="mb-3 mt-10 scroll-mt-28 text-2xl font-bold text-slate-900">
          {text}
        </h2>
      );
    }
    if (line.startsWith('### '))
      return <h3 key={i} className="mb-2 mt-6 text-lg font-bold text-slate-900">{line.slice(4)}</h3>;
    if (line.startsWith('> '))
      return (
        <blockquote key={i} className="my-8 max-w-2xl">
          <p className="text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
            &ldquo;{line.slice(2)}&rdquo;
          </p>
        </blockquote>
      );
    const image = line.match(/^!\[(.*)\]\((.*)\)$/);
    if (image)
      return (
        <img
          key={i}
          src={image[2]}
          alt={image[1]}
          className="my-8 w-full rounded-2xl border border-slate-200 object-cover"
        />
      );
    if (line.startsWith('- ') || line.startsWith('* '))
      return <li key={i} className="ml-5 mb-1 list-disc leading-relaxed text-slate-600">{line.slice(2)}</li>;
    if (line.startsWith('**') && line.endsWith('**'))
      return <p key={i} className="my-2 font-bold text-slate-900">{line.slice(2, -2)}</p>;
    if (line.trim() === '') return <div key={i} className="h-3" />;
    return <p key={i} className="mb-2 leading-relaxed text-slate-600">{line}</p>;
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
        setRelated(relRes.data.filter(a => a.id !== res.data.id).slice(0, 2));
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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 size={40} className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (!article) return null;

  const readTime = Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200));
  const headings = extractHeadings(article.content);
  const tags = article.keywords ? article.keywords.split(',').map(k => k.trim()).filter(Boolean) : [];
  const publishedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="bg-[#EAE7DB] pb-16 pt-28">
        <div className="mx-auto max-w-3xl px-6">
          <nav className="mb-8 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <ChevronRight size={12} />
            <Link href="/blog" className="hover:text-slate-900">Blog</Link>
          </nav>

          <div className="flex flex-col items-center text-center">
            <span className="mb-5 inline-block rounded-full border border-slate-400/50 px-4 py-1 text-xs font-semibold text-slate-600">
              {article.category}
            </span>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              {article.title}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-slate-500">
              {article.excerpt ?? article.content.slice(0, 140).replace(/[#*`>]/g, '').trim() + '...'}
            </p>
          </div>
        </div>
      </section>

      {article.imageUrl && (
        <div className="mx-auto -mt-0 max-w-5xl px-6 pt-12">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-[300px] w-full rounded-3xl object-cover sm:h-[420px]"
          />
        </div>
      )}

      {/* ── Main content ──────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_280px]">

          {/* Article body */}
          <article className="min-w-0">
            {renderContent(article.content)}

            {tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-100 pt-8">
                {tags.map(tag => (
                  <span key={tag} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Feedback */}
            <div className="mt-10 border-t border-slate-100 pt-8">
              <p className="mb-4 text-sm font-bold text-slate-700">Was this article helpful?</p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleFeedback(true)}
                  disabled={feedbackSent}
                  className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-xs font-bold transition-all ${
                    feedback === 'helpful'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-700'
                  } disabled:opacity-50`}
                >
                  <ThumbsUp size={14} />
                  Yes, helpful ({article.helpfulCount + (feedback === 'helpful' ? 1 : 0)})
                </button>
                <button
                  onClick={() => handleFeedback(false)}
                  disabled={feedbackSent}
                  className={`flex items-center gap-2 rounded-xl border px-5 py-2.5 text-xs font-bold transition-all ${
                    feedback === 'unhelpful'
                      ? 'border-red-300 bg-red-50 text-red-700'
                      : 'border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-700'
                  } disabled:opacity-50`}
                >
                  <ThumbsDown size={14} />
                  Not helpful
                </button>
                {feedbackSent && <span className="text-xs text-slate-400">Thank you for your feedback!</span>}
              </div>
            </div>

            <div className="mt-10 flex items-center gap-3 border-t border-slate-100 pt-8">
              <Link
                href="/blog"
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-500 transition-all hover:border-slate-300 hover:text-slate-900"
              >
                <ArrowLeft size={13} />
                Back to Blog
              </Link>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-500 transition-all hover:border-slate-300 hover:text-slate-900"
              >
                <Share2 size={13} />
                Share
              </button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8 lg:pt-1">
            {headings.length > 0 && (
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Table of contents</p>
                <ul className="space-y-3 border-l border-slate-200 pl-4">
                  {headings.map(h => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="text-sm font-medium text-slate-500 hover:text-slate-900">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Author</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Admin</p>
                  <p className="text-xs text-slate-500">{publishedDate}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-5 text-xs text-slate-500">
              <span className="flex items-center gap-2"><Calendar size={13} /> {publishedDate}</span>
              <span className="flex items-center gap-2"><Clock size={13} /> {readTime} min read</span>
              <span className="flex items-center gap-2"><Eye size={13} /> {article.viewCount.toLocaleString()} views</span>
            </div>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Subscribe to our newsletter</p>
              <input
                type="email"
                placeholder="Enter your email"
                className="mb-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
              />
              <button className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
                Subscribe
              </button>
            </div>
          </aside>
        </div>
      </section>

      {/* ── From the blog ────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-[#12321F] px-6 py-20 text-white">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-300/70">Latest</p>
                <h2 className="text-3xl font-bold sm:text-4xl">From the blog</h2>
                <p className="mt-3 max-w-md text-sm text-emerald-100/60">
                  The latest industry news, interviews, and resources.
                </p>
              </div>
              <Link
                href="/blog"
                className="shrink-0 rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10"
              >
                View all posts
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {related.map(a => (
                <Link key={a.id} href={`/blog/${a.slug}`} className="group block">
                  <div
                    className="mb-4 h-56 w-full rounded-2xl bg-emerald-950 bg-cover bg-center"
                    style={{ backgroundImage: a.imageUrl ? `url(${a.imageUrl})` : undefined }}
                  />
                  <h3 className="flex items-start gap-1.5 text-lg font-bold">
                    {a.title}
                    <ArrowUpRight size={16} className="mt-1 shrink-0 text-emerald-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-emerald-100/60">
                    {a.excerpt ?? a.content.slice(0, 110).replace(/[#*`>]/g, '').trim() + '...'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Newsletter band ──────────────────────────────── */}
      <section className="border-t border-white/10 bg-[#12321F] px-6 py-12 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-xl font-bold">Join our newsletter</h3>
            <p className="mt-1 text-sm text-emerald-100/60">We&rsquo;ll send you a nice letter once per week. No spam.</p>
          </div>
          <form
            onSubmit={e => e.preventDefault()}
            className="flex w-full max-w-md items-center gap-3 sm:w-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full flex-1 rounded-xl border border-white/20 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-emerald-100/40 outline-none focus:border-white/50"
            />
            <button className="shrink-0 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#12321F] transition-colors hover:bg-emerald-50">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}