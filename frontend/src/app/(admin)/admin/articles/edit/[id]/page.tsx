'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, Save, Globe, Lock, Eye, Edit3, Tag,
  BookOpen, Loader2, CheckCircle, Trash2, AlertTriangle
} from 'lucide-react';
import blogApi from '@/lib/blogApi';
import { toast } from 'sonner';

const CATEGORIES = ['Education', 'Analysis', 'Blog', 'News', 'Strategy', 'Crypto'];

function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed space-y-2">
      {content.split('\n').map((line, i) => {
        if (line.startsWith('# '))  return <h1 key={i} className="text-2xl font-black text-white mt-6 mb-3">{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-white mt-5 mb-2 border-b border-white/10 pb-2">{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-slate-200 mt-4 mb-2">{line.slice(4)}</h3>;
        if (line.startsWith('> ')) return (
          <blockquote key={i} className="border-l-4 border-blue-500 pl-4 py-1 my-3 bg-blue-500/5 rounded-r-xl text-slate-300 italic">{line.slice(2)}</blockquote>
        );
        if (line.startsWith('- ') || line.startsWith('* ')) return (
          <li key={i} className="ml-5 text-slate-300 leading-relaxed mb-1 list-disc">{line.slice(2)}</li>
        );
        if (line.trim() === '') return <div key={i} className="h-3" />;
        return <p key={i} className="text-slate-300 leading-relaxed mb-2">{line}</p>;
      })}
    </div>
  );
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [form, setForm] = useState({
    title: '',
    category: 'Blog',
    content: '',
    keywords: '',
    imageUrl: '',
    published: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState(false);

  /* Load article by ID */
  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // We need to find the article — use getAllArticles and find by id
        const res = await blogApi.getAllArticles({ limit: 200 });
        const article = res.data.find(a => a.id === id);
        if (!article) { toast.error('Article not found'); router.push('/admin/articles'); return; }
        setForm({
          title: article.title,
          category: article.category,
          content: article.content,
          keywords: article.keywords ?? '',
          imageUrl: article.imageUrl ?? '',
          published: article.published,
        });
      } catch {
        toast.error('Failed to load article');
        router.push('/admin/articles');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const wordCount = form.content.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleSave = async (publish?: boolean) => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.content.trim()) { toast.error('Content is required'); return; }
    setSaving(true);
    try {
      await blogApi.updateArticle(id, {
        title: form.title,
        category: form.category,
        content: form.content,
        keywords: form.keywords,
        imageUrl: form.imageUrl || undefined,
        published: publish !== undefined ? publish : form.published,
      });
      toast.success('Article updated successfully!');
      router.push('/admin/articles');
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Failed to update article');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this article permanently? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await blogApi.deleteArticle(id);
      toast.success('Article deleted');
      router.push('/admin/articles');
    } catch {
      toast.error('Failed to delete article');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#020617] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020617]">
      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-gray-300 dark:text-slate-700">|</span>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-black text-gray-900 dark:text-white">Edit Article</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-slate-500 font-medium hidden sm:block">
            {wordCount} words · ~{readTime} min read
          </span>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50"
          >
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            Delete
          </button>
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-all"
          >
            {preview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 rounded-xl transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" /> Save
          </button>
          <button
            onClick={() => handleSave(!form.published)}
            disabled={saving}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl transition-all disabled:opacity-50 shadow-md ${
              form.published
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-900/20'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20'
            }`}
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
            {form.published ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Editor layout */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* Left: Editor / Preview */}
        <div className="space-y-6">
          <input
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Article title..."
            className="w-full bg-transparent text-3xl font-black text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-slate-700 focus:outline-none border-b-2 border-gray-100 dark:border-slate-800 pb-4 focus:border-blue-500 transition-colors"
          />

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-black text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-3">Cover Image</h3>
              <label className="flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-800 rounded-2xl p-3 cursor-pointer hover:border-blue-500/50 transition-colors">
                <span className="font-semibold text-slate-700 dark:text-slate-200">Upload a cover image</span>
                <span className="text-[11px] text-slate-400">JPG, PNG, WebP (max 2MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 2_100_000) {
                      toast.error('Please choose an image under 2MB');
                      return;
                    }

                    try {
                      const data = new FormData();
                      data.append('image', file);
                      const uploadResponse = await blogApi.uploadArticleImage(data);
                      setForm({ ...form, imageUrl: uploadResponse.data.imageUrl });
                      toast.success('Cover image uploaded successfully');
                    } catch (error: any) {
                      toast.error(error?.response?.data?.message || 'Failed to upload image');
                    }
                  }}
                />
              </label>
              {form.imageUrl && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700">
                  <img src={form.imageUrl} alt="Cover preview" className="w-full h-40 object-cover" />
                </div>
              )}
            </div>

            <div className="min-h-[500px]">
              {preview ? (
                <div className="bg-white dark:bg-[#0d1929] border border-gray-200 dark:border-slate-800 rounded-2xl p-8 min-h-[500px]">
                  {form.content ? <MarkdownPreview content={form.content} /> : (
                    <p className="text-gray-400 dark:text-slate-600 italic text-sm">Nothing to preview yet...</p>
                  )}
                </div>
              ) : (
                <textarea
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  rows={24}
                  placeholder="Write your content in markdown..."
                  className="w-full bg-white dark:bg-[#0d1929] border border-gray-200 dark:border-slate-800 rounded-2xl px-6 py-5 text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder:text-gray-300 dark:placeholder:text-slate-700 min-h-[500px] leading-relaxed"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right: Settings */}
        <div className="space-y-5">
          {/* Status */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5">
            <h3 className="text-xs font-black text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-4">Status</h3>
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border ${
              form.published
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700'
                : 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600'
            }`}>
              {form.published ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {form.published ? 'Currently Published' : 'Currently Draft'}
            </div>
          </div>

          {/* Category */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5">
            <h3 className="text-xs font-black text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-3">Category</h3>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                    form.category === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5">
            <h3 className="text-xs font-black text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Tag className="w-3 h-3" /> Keywords
            </h3>
            <input
              value={form.keywords}
              onChange={e => setForm({ ...form, keywords: e.target.value })}
              placeholder="forex, trading, eurusd..."
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Content stats */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-black text-gray-500 dark:text-slate-400 uppercase tracking-widest">Stats</h3>
            {[
              { label: 'Words', value: wordCount },
              { label: 'Read Time', value: `~${readTime} min` },
              { label: 'Characters', value: form.content.length },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-gray-400 dark:text-slate-500">{label}</span>
                <span className="text-xs font-bold text-gray-700 dark:text-slate-300">{value}</span>
              </div>
            ))}
          </div>

          {/* Validation */}
          <div className="space-y-2">
            {[
              { check: form.title.length > 0, label: 'Title added' },
              { check: form.content.length > 100, label: 'Enough content' },
              { check: form.keywords.length > 0, label: 'Keywords added' },
            ].map(({ check, label }) => (
              <div key={label} className={`flex items-center gap-2 text-xs font-semibold ${check ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-300 dark:text-slate-600'}`}>
                <CheckCircle className="w-3.5 h-3.5" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
