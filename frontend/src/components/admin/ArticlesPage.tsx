"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Search, FileText, Eye, ThumbsUp, Clock, Edit3,
  Trash2, Loader2, X, Save, Globe, Lock, RefreshCw,
  BookOpen, Tag, User, CheckCircle, AlertCircle, Filter,
  ChevronDown, MoreVertical
} from "lucide-react";
import blogApi, { BlogArticle, CreateArticleInput, UpdateArticleInput } from "@/lib/blogApi";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

/* ─── Category Config ─────────────────────────────────────── */
const CATEGORIES = ["Education", "Analysis", "Blog", "News", "Strategy", "Crypto"];

const CATEGORY_COLORS: Record<string, string> = {
  Education: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Analysis:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Blog:      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  News:      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Strategy:  "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  Crypto:    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

/* ─── Empty form ─────────────────────────────────────────── */
const EMPTY_FORM: CreateArticleInput & { id?: string } = {
  title: "",
  category: "Blog",
  content: "",
  keywords: "",
  imageUrl: "",
  published: false,
  authorId: "",
};

/* ─── Article row ────────────────────────────────────────── */
function ArticleRow({
  article,
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  article: BlogArticle;
  onEdit: (a: BlogArticle) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (a: BlogArticle) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const catColor = CATEGORY_COLORS[article.category] ?? "bg-slate-100 text-slate-600";

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 hover:border-blue-300 dark:hover:border-blue-800 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4 flex-1 min-w-0">
          {/* Icon */}
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3
                onClick={() => onEdit(article)}
                className="font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors truncate"
              >
                {article.title}
              </h3>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${catColor}`}>
                {article.category}
              </span>
            </div>

            <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-1 mb-3">{article.excerpt ?? article.content.slice(0, 120)}...</p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 dark:text-slate-500 font-semibold">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime ?? "—"}</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{article.viewCount.toLocaleString()} views</span>
              <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{article.helpfulCount}</span>
              <span className="flex items-center gap-1"><User className="w-3 h-3" />Author ID: {article.author.slice(0, 8)}…</span>
              <span>{new Date(article.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Published badge */}
          <button
            onClick={() => onTogglePublish(article)}
            className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-lg border transition-all ${
              article.published
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 hover:bg-emerald-100"
                : "bg-gray-50 text-gray-500 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 hover:bg-gray-100"
            }`}
          >
            {article.published ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            {article.published ? "Published" : "Draft"}
          </button>

          {/* Three-dot menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-20">
                <button
                  onClick={() => { onEdit(article); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 text-sm rounded-t-xl"
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => { onDelete(article.id); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm rounded-b-xl border-t border-gray-100 dark:border-slate-700"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Article Editor Modal ───────────────────────────────── */
function ArticleModal({
  form,
  setForm,
  onClose,
  onSave,
  saving,
  isEdit,
}: {
  form: typeof EMPTY_FORM;
  setForm: (f: typeof EMPTY_FORM) => void;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
  isEdit: boolean;
}) {
  const [preview, setPreview] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-black text-gray-900 dark:text-white">
              {isEdit ? "Edit Article" : "New Article"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreview(!preview)}
              className="text-xs font-bold px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-lg transition-all"
            >
              {preview ? "✏️ Edit" : "👁️ Preview"}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Title *</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Enter article title..."
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Category + Published row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</label>
              <button
                type="button"
                onClick={() => setForm({ ...form, published: !form.published })}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border transition-all ${
                  form.published
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700"
                    : "bg-gray-50 text-gray-500 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600"
                }`}
              >
                {form.published ? <><Globe className="w-4 h-4" /> Published</> : <><Lock className="w-4 h-4" /> Draft</>}
              </button>
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3 h-3" /> Keywords (comma-separated)
            </label>
            <input
              value={form.keywords}
              onChange={e => setForm({ ...form, keywords: e.target.value })}
              placeholder="forex, trading, analysis..."
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Cover image</label>
            <label className="block rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 p-4 text-sm text-slate-500 dark:text-slate-400 cursor-pointer hover:border-blue-500/50 transition-colors">
              <span className="font-semibold text-slate-700 dark:text-slate-200">Upload image or paste URL</span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 2_100_000) {
                    toast.error('Choose an image under 2MB');
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
              <p className="mt-2 text-xs text-slate-400">Supported formats: JPG, PNG, WebP.</p>
            </label>
            <input
              value={form.imageUrl}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="Or paste a full image URL"
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
            />
            {form.imageUrl && (
              <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-700">
                <img src={form.imageUrl} alt="Article cover preview" className="w-full h-48 object-cover" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Content * (Markdown)</label>
            {preview ? (
              <div className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 min-h-[280px] text-sm text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-mono text-xs">
                {form.content || <span className="text-gray-400 italic">No content to preview...</span>}
              </div>
            ) : (
              <textarea
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                rows={12}
                placeholder={`# Article Title\n\n## Introduction\nWrite your article content here using markdown...\n\n## Section 1\nYour content here.\n\n- Bullet point 1\n- Bullet point 2\n\n> Blockquote example\n\n## Conclusion\nFinal thoughts...`}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-slate-600"
              />
            )}
            <p className="text-[10px] text-gray-400 dark:text-slate-500">
              {form.content.split(/\s+/).filter(Boolean).length} words • ~{Math.max(1, Math.ceil(form.content.split(/\s+/).length / 200))} min read
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
          <p className="text-xs text-gray-400 dark:text-slate-500">
            {form.published ? "Will be visible on the public blog" : "Saved as draft — not publicly visible"}
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all">
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving || !form.title || !form.content}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 shadow-md shadow-blue-900/20"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isEdit ? "Save Changes" : (form.published ? "Publish" : "Save Draft")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function ArticlesPage() {
  const { user } = useAuthStore();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM });

  /* Fetch all articles (admin sees drafts too) */
  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await blogApi.getAllArticles({ limit: 100 });
      let data = res.data;
      if (search) {
        const q = search.toLowerCase();
        data = data.filter(a => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
      }
      if (catFilter !== "All") data = data.filter(a => a.category === catFilter);
      setArticles(data);
      setTotal(res.total);
    } catch {
      toast.error("Failed to load articles");
    } finally {
      setLoading(false);
    }
  }, [search, catFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  /* Open new modal */
  const openNew = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, authorId: user?.id ?? "" });
    setModalOpen(true);
  };

  /* Open edit modal */
  const openEdit = (article: BlogArticle) => {
    setEditingId(article.id);
    setForm({
      id: article.id,
      title: article.title,
      category: article.category,
      content: article.content,
      keywords: article.keywords ?? "",
      imageUrl: article.imageUrl ?? "",
      published: article.published,
      authorId: article.author,
    });
    setModalOpen(true);
  };

  /* Save (create or update) */
  const handleSave = async () => {
    if (!form.title || !form.content) return;
    setSaving(true);
    try {
      if (editingId) {
        const upd: UpdateArticleInput = {
          title: form.title,
          category: form.category,
          content: form.content,
          keywords: form.keywords,
          imageUrl: form.imageUrl || undefined,
          published: form.published,
        };
        await blogApi.updateArticle(editingId, upd);
        toast.success("Article updated successfully!");
      } else {
        if (!form.authorId) {
          toast.error("Author ID is missing — please log in as admin");
          setSaving(false);
          return;
        }
        await blogApi.createArticle(form);
        toast.success(form.published ? "Article published!" : "Draft saved!");
      }
      setModalOpen(false);
      fetch();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  /* Delete */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this article permanently?")) return;
    setDeleting(id);
    try {
      await blogApi.deleteArticle(id);
      toast.success("Article deleted");
      fetch();
    } catch {
      toast.error("Failed to delete article");
    } finally {
      setDeleting(null);
    }
  };

  /* Toggle publish */
  const handleTogglePublish = async (article: BlogArticle) => {
    try {
      await blogApi.updateArticle(article.id, { published: !article.published });
      toast.success(article.published ? "Article unpublished" : "Article published!");
      fetch();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const published = articles.filter(a => a.published).length;
  const drafts = articles.filter(a => !a.published).length;

  return (
    <>
      <div className="space-y-6 animate-in fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Articles & Blog</h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-0.5">Manage your blog posts and articles</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
          >
            <Plus className="w-4 h-4" /> New Article
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total", value: total, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
            { label: "Published", value: published, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
            { label: "Drafts", value: drafts, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl p-4 text-center`}>
              <p className={`text-2xl font-black ${color}`}>{loading ? "—" : value}</p>
              <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setCatFilter(cat)}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                  catFilter === cat
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:text-gray-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 mx-auto text-gray-300 dark:text-slate-600 mb-4" />
            <p className="text-gray-500 dark:text-slate-400 font-medium">No articles found</p>
            <p className="text-gray-400 dark:text-slate-500 text-sm mt-1">
              {search ? "Try a different search term" : "Click \"New Article\" to create your first post"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map(article => (
              <div key={article.id} className="relative">
                {deleting === article.id && (
                  <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center z-10">
                    <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                  </div>
                )}
                <ArticleRow
                  article={article}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onTogglePublish={handleTogglePublish}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {modalOpen && (
        <ArticleModal
          form={form}
          setForm={setForm}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          saving={saving}
          isEdit={!!editingId}
        />
      )}
    </>
  );
}
