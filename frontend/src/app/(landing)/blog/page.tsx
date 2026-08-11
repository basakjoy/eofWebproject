
// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import {
//   Search, BookOpen, Clock, Eye, ThumbsUp, ChevronRight,
//   TrendingUp, Newspaper, GraduationCap, BarChart3, ArrowRight,
//   Loader2, Filter, X, User, Zap, Tag, Bookmark, Headphones, MapPin, Play
// } from 'lucide-react';
// import blogApi, { BlogArticle } from '@/lib/blogApi';


// /* ─── Config ──────────────────────────────────────────────── */
// const CATEGORY_ICONS: Record<string, React.ElementType> = {
//   All:       Filter,
//   Education: GraduationCap,
//   Analysis:  BarChart3,
//   Blog:      Newspaper,
//   News:      TrendingUp,
//   Strategy:  Zap,
//   Crypto:    TrendingUp,
// };

// // Pastel cover gradients (Ncmaz-style soft backgrounds)
// const CATEGORY_GRADIENTS: Record<string, string> = {
//   Education: 'from-blue-100 via-blue-50 to-white',
//   Analysis:  'from-emerald-100 via-emerald-50 to-white',
//   Blog:      'from-purple-100 via-purple-50 to-white',
//   News:      'from-amber-100 via-amber-50 to-white',
//   Strategy:  'from-rose-100 via-rose-50 to-white',
//   Crypto:    'from-orange-100 via-orange-50 to-white',
// };

// const CATEGORY_COLORS: Record<string, string> = {
//   Education: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
//   Analysis:  'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
//   Blog:      'bg-purple-100 text-purple-700 hover:bg-purple-200',
//   News:      'bg-amber-100 text-amber-700 hover:bg-amber-200',
//   Strategy:  'bg-rose-100 text-rose-700 hover:bg-rose-200',
//   Crypto:    'bg-orange-100 text-orange-700 hover:bg-orange-200',
// };

// const getGradient = (cat: string) => CATEGORY_GRADIENTS[cat] ?? 'from-slate-100 via-slate-50 to-white';
// const getColor = (cat: string) => CATEGORY_COLORS[cat] ?? 'bg-slate-100 text-slate-700 hover:bg-slate-200';

// /* ─── Shared UI Components ────────────────────────────────── */

// function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
//   return (
//     <div className="flex items-end justify-between mb-8">
//       <div>
//         <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
//           {title}
//         </h2>
//         {subtitle && <p className="text-slate-500 mt-2 text-sm">{subtitle}</p>}
//       </div>
//       <button className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 bg-slate-50 px-4 py-2 rounded-full transition-colors">
//         View all <ChevronRight className="w-4 h-4" />
//       </button>
//     </div>
//   );
// }

// function AuthorBlock({ article }: { article: BlogArticle }) {
//   const readTime = Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200));
//   return (
//     <div className="flex items-center gap-3 mt-4">
//       <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
//         <User className="w-4 h-4 text-slate-500" />
//       </div>
//       <div className="flex-col flex">
//         <span className="text-xs font-semibold text-slate-900">Admin</span>
//         <span className="text-[11px] text-slate-500">{readTime} min read</span>
//       </div>
//     </div>
//   );
// }

// /* ─── Layout Specific Cards ───────────────────────────────── */

// function MainHeroCard({ article }: { article: BlogArticle }) {
//   const grad = getGradient(article.category);
//   const color = getColor(article.category);
  
//   return (
//     <Link href={`/blog/${article.slug}`} className="block relative w-full h-[450px] md:h-[550px] rounded-3xl overflow-hidden group">
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{ backgroundImage: article.imageUrl ? `url(${article.imageUrl})` : undefined }}
//       />
//       {!article.imageUrl && <div className={`absolute inset-0 bg-gradient-to-br ${grad} opacity-80`} />}
//       <div className="absolute inset-0 bg-black/15 group-hover:bg-black/10 transition-colors" />
//       <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center max-w-3xl">
//         <span className={`inline-block w-fit text-xs font-bold px-3 py-1 rounded-full mb-4 ${color}`}>
//           {article.category}
//         </span>
//         <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-6 group-hover:text-slate-700 transition-colors">
//           {article.title}
//         </h1>
//         <p className="text-slate-700 text-sm md:text-base line-clamp-2 max-w-xl mb-8">
//           {article.excerpt ?? article.content.slice(0, 200).replace(/[#*`>]/g, '').trim()}...
//         </p>
//         <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md w-fit px-4 py-2.5 rounded-full shadow-sm">
//           <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
//             <User className="w-4 h-4 text-slate-500" />
//           </div>
//           <span className="text-sm font-semibold text-slate-900">Read Article</span>
//         </div>
//       </div>
//     </Link>
//   );
// }

// function SubHeroCard({ article }: { article: BlogArticle }) {
//   const grad = getGradient(article.category);
//   const color = getColor(article.category);
  
//   return (
//     <Link href={`/blog/${article.slug}`} className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex gap-4 h-full">
//       <div className={`w-24 h-24 rounded-2xl shrink-0 bg-gradient-to-br ${grad} flex items-center justify-center relative overflow-hidden`}>
//         <BookOpen className="w-8 h-8 text-white/50" />
//         <span className={`absolute top-2 left-2 text-[8px] font-bold px-2 py-0.5 rounded-full ${color}`}>
//           {article.category}
//         </span>
//       </div>
//       <div className="flex flex-col justify-between flex-1">
//         <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600">
//           {article.title}
//         </h3>
//         <AuthorBlock article={article} />
//       </div>
//     </Link>
//   );
// }

// function NcmazCard({ article }: { article: BlogArticle }) {
//   const grad = getGradient(article.category);
//   const color = getColor(article.category);
  
//   return (
//     <Link href={`/blog/${article.slug}`} className="group flex flex-col bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300">
//       <div
//         className={`relative h-56 rounded-3xl overflow-hidden m-2 bg-cover bg-center`}
//         style={{ backgroundImage: article.imageUrl ? `url(${article.imageUrl})` : undefined }}
//       >
//         {!article.imageUrl && <div className={`absolute inset-0 bg-gradient-to-br ${grad}`} />}
//         <div className="absolute inset-0 bg-black/10" />
//         <div className="absolute top-3 left-3">
//           <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm ${color}`}>
//             {article.category}
//           </span>
//         </div>
//         <div className="absolute top-3 right-3 bg-white/40 hover:bg-white backdrop-blur-md p-2 rounded-full cursor-pointer transition-colors">
//           <Bookmark className="w-4 h-4 text-slate-700" />
//         </div>
//       </div>
//       <div className="px-2 py-4 flex flex-col flex-1">
//         <h2 className="text-base font-bold text-slate-900 group-hover:text-slate-600 transition-colors mb-2 line-clamp-2 leading-snug">
//           {article.title}
//         </h2>
//         <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
//           {article.excerpt ?? article.content.slice(0, 100).replace(/[#*`>]/g, '').trim()}...
//         </p>
//         <AuthorBlock article={article} />
//       </div>
//     </Link>
//   );
// }

// function SmallListCard({ article }: { article: BlogArticle }) {
//   const grad = getGradient(article.category);
//   const color = getColor(article.category);

//   return (
//     <Link href={`/blog/${article.slug}`} className="group flex gap-5 bg-white rounded-2xl hover:bg-slate-50 transition-colors p-2">
//       <div
//         className={`w-32 h-32 rounded-2xl shrink-0 relative overflow-hidden bg-cover bg-center`}
//         style={{ backgroundImage: article.imageUrl ? `url(${article.imageUrl})` : undefined }}
//       >
//          {!article.imageUrl && <div className={`absolute inset-0 bg-gradient-to-br ${grad}`} />}
//          <div className="absolute inset-0 bg-black/10" />
//          <span className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-1 rounded-full ${color}`}>
//             {article.category}
//           </span>
//       </div>
//       <div className="flex flex-col justify-center flex-1 py-1">
//         <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
//           {article.title}
//         </h3>
//         <p className="text-xs text-slate-500 line-clamp-2 mb-3">
//           {article.excerpt ?? article.content.slice(0, 100).replace(/[#*`>]/g, '').trim()}...
//         </p>
//         <div className="flex items-center gap-3 text-[11px] text-slate-400">
//           <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 2 min read</span>
//           <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.viewCount} views</span>
//         </div>
//       </div>
//     </Link>
//   );
// }

// /* ─── Skeleton ─────────────────────────────────────────────── */
// function SkeletonCard() {
//   return (
//     <div className="bg-white rounded-3xl overflow-hidden animate-pulse p-2">
//       <div className="h-56 bg-slate-100 rounded-3xl" />
//       <div className="p-4 space-y-3">
//         <div className="h-4 bg-slate-100 rounded w-3/4" />
//         <div className="h-3 bg-slate-100 rounded w-full" />
//         <div className="h-8 bg-slate-100 rounded-full w-24 mt-4" />
//       </div>
//     </div>
//   );
// }

// /* ─── Main Page ────────────────────────────────────────────── */
// export default function BlogPage() {
//   const router = useRouter();
//   const [articles, setArticles] = useState<BlogArticle[]>([]);
//   const [categories, setCategories] = useState<string[]>(['All']);
//   const [catCounts, setCatCounts] = useState<Record<string, number>>({});
//   const [activeCategory, setActiveCategory] = useState('All');
//   const [search, setSearch] = useState('');
//   const [searchInput, setSearchInput] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(0);
//   const LIMIT = 15; // Increased to fill out the long layout

//   const fetchArticles = async () => {
//     setLoading(true);
//     try {
//       const res = await blogApi.getArticles({
//         category: activeCategory === 'All' ? undefined : activeCategory,
//         search: search || undefined,
//         limit: LIMIT,
//         offset: page * LIMIT,
//       });
//       setArticles(res.data);
//       setTotal(res.total);
//     } catch {
//       setArticles([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchMeta = async () => {
//     try {
//       const [catRes, allRes] = await Promise.all([
//         blogApi.getCategories(),
//         blogApi.getArticles({ limit: 200 }),
//       ]);
//       setCategories(catRes.data);
//       const counts: Record<string, number> = { All: allRes.total };
//       allRes.data.forEach(a => { counts[a.category] = (counts[a.category] || 0) + 1; });
//       setCatCounts(counts);
//     } catch {
//       setCategories(['All']);
//     }
//   };

//   useEffect(() => { fetchMeta(); }, []);
//   useEffect(() => { fetchArticles(); }, [activeCategory, search, page]);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     setSearch(searchInput);
//     setPage(0);
//   };

//   const clearSearch = () => { setSearchInput(''); setSearch(''); setPage(0); };

//   const totalPages = Math.ceil(total / LIMIT);

//   // Slicing articles for layout sections
//   const heroArticle = articles[0];
//   const subHeroArticles = articles.slice(1, 4);
//   const editorsPicks = articles.slice(4, 8);
//   const lifestyleArticles = articles.slice(8, 12);
//   const latestArticles = articles.slice(12);

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
  

//       {/* ── Top Header / Search ──────────────────────────────────────── */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8 pt-28 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
//           Blog & Articles
//         </h1>
//         <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-sm w-full">
//           <div className="relative flex-1">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//             <input
//               value={searchInput}
//               onChange={e => setSearchInput(e.target.value)}
//               placeholder="Search..."
//               className="w-full bg-white border border-slate-200 rounded-full pl-11 pr-10 py-2.5 text-sm focus:outline-none focus:border-slate-400 shadow-sm transition-all"
//             />
//             {searchInput && (
//               <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
//                 <X className="w-3.5 h-3.5" />
//               </button>
//             )}
//           </div>
//         </form>
//       </div>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8 pb-24 space-y-24">
        
//         {/* Render Standard Grid if Searching or Paginated */}
//         {search || page > 0 ? (
//           <div>
//              {!loading && (
//               <p className="text-sm text-slate-500 mb-8 font-medium">
//                 {total > 0 ? `Showing ${articles.length} of ${total} results` : 'No results found'}
//                 {search && <span className="ml-1">for "<span className="text-slate-900">{search}</span>"</span>}
//               </p>
//             )}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {loading ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />) 
//                        : articles.map(a => <NcmazCard key={a.id} article={a} />)}
//             </div>
//           </div>
//         ) : (
//           /* ── Complex Layout (Page 0, No Search) ─────────────────── */
//           <>
//             {/* 1. Hero Section */}
//             {heroArticle && !loading && (
//               <section className="relative">
//                 <MainHeroCard article={heroArticle} />
//                 {subHeroArticles.length > 0 && (
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto -mt-16 relative z-10 px-4">
//                     {subHeroArticles.map(article => (
//                       <SubHeroCard key={article.id} article={article} />
//                     ))}
//                   </div>
//                 )}
//               </section>
//             )}

//             {/* 2. Trending Topics */}
//             <section>
//               <SectionHeader title="Discover trending topics" />
//               <div className="flex flex-wrap gap-4 overflow-x-auto pb-4 hide-scrollbar">
//                 {categories.filter(c => c !== 'All').map(cat => {
//                   const Icon = CATEGORY_ICONS[cat] ?? Newspaper;
//                   const grad = getGradient(cat);
//                   const count = catCounts[cat] || 0;
//                   return (
//                     <button key={cat} onClick={() => { setActiveCategory(cat); setPage(0); }}
//                       className="group flex flex-col items-center min-w-[140px] shrink-0">
//                       <div className={`w-full aspect-square rounded-3xl bg-gradient-to-br ${grad} p-6 flex flex-col items-center justify-center gap-3 relative overflow-hidden shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-1`}>
//                         <div className="bg-white/80 backdrop-blur rounded-2xl p-3">
//                           <Icon className="w-6 h-6 text-slate-700" />
//                         </div>
//                         <span className="font-bold text-slate-900">{cat}</span>
//                         <span className="absolute top-3 right-3 text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded-full">
//                           {count}
//                         </span>
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             </section>

//             {/* 3. Editor's Picks */}
//             {editorsPicks.length > 0 && !loading && (
//               <section className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-100">
//                 <SectionHeader title="Editor's picks" subtitle="Discover the most outstanding articles in all topics of life." />
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                   {editorsPicks.map(a => <NcmazCard key={a.id} article={a} />)}
//                 </div>
//               </section>
//             )}

//             {/* 4. Listen to Audio (Simulated with Lifestyles block) */}
//             {lifestyleArticles.length > 0 && !loading && (
//               <section>
//                 <SectionHeader title="Life styles 🎧" />
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                   {/* Big Card on Left */}
//                   <div className="lg:col-span-2">
//                     <Link href={`/blog/${lifestyleArticles[0].slug}`} className="block relative w-full h-full min-h-[400px] rounded-3xl overflow-hidden group">
//                       <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(lifestyleArticles[0].category)}`} />
//                       <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
//                       <div className="absolute top-4 left-4 flex gap-2">
//                          <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${getColor(lifestyleArticles[0].category)}`}>
//                           {lifestyleArticles[0].category}
//                         </span>
//                       </div>
//                       <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/80 to-transparent text-white">
//                         <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-200 transition-colors">{lifestyleArticles[0].title}</h2>
//                         <div className="flex items-center gap-3 text-sm text-white/80">
//                            <User className="w-4 h-4" /> Admin • {lifestyleArticles[0].viewCount} views
//                         </div>
//                       </div>
//                     </Link>
//                   </div>
//                   {/* Smaller Cards on Right */}
//                   <div className="flex flex-col gap-6">
//                     {lifestyleArticles.slice(1, 3).map(a => (
//                       <Link key={a.id} href={`/blog/${a.slug}`} className="relative h-[200px] rounded-3xl overflow-hidden group block">
//                         <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(a.category)}`} />
//                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
//                          <div className="absolute top-4 left-4">
//                             <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${getColor(a.category)}`}>
//                               {a.category}
//                             </span>
//                          </div>
//                          <div className="absolute bottom-0 left-0 p-5 w-full bg-gradient-to-t from-black/80 to-transparent text-white">
//                             <h3 className="text-lg font-bold line-clamp-2">{a.title}</h3>
//                          </div>
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               </section>
//             )}

//             {/* 5. Newsletter Block */}
//             <section className="bg-rose-50 rounded-[40px] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
//               <div className="max-w-xl">
//                 <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Join our newsletter 🎉</h2>
//                 <p className="text-slate-600 mb-8 text-lg">Read and share new perspectives on just about any topic. Everyone's welcome.</p>
//                 <div className="flex flex-col sm:flex-row gap-3">
//                   <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-rose-100">
//                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">01</span>
//                      Get more discount
//                   </span>
//                   <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm border border-rose-100">
//                      <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs">02</span>
//                      Get premium magazines
//                   </span>
//                 </div>
//                 <div className="mt-8 relative max-w-md">
//                    <input type="email" placeholder="Enter your email" className="w-full bg-white rounded-full py-4 pl-6 pr-32 border-none shadow-sm focus:ring-2 focus:ring-rose-200 outline-none" />
//                    <button className="absolute right-2 top-2 bottom-2 bg-slate-900 text-white rounded-full px-6 font-semibold hover:bg-slate-800 transition-colors">
//                      Submit
//                    </button>
//                 </div>
//               </div>
//               <div className="hidden md:flex relative w-64 h-64 shrink-0 bg-rose-200 rounded-full items-center justify-center">
//                  <Newspaper className="w-32 h-32 text-rose-400" />
//               </div>
//             </section>

//             {/* 6. Latest Articles + Sidebar */}
//             <section className="flex flex-col lg:flex-row gap-10">
//               <div className="flex-1">
//                 <SectionHeader title="Latest articles" subtitle="Discover the most outstanding articles in all topics of life." />
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {loading 
//                     ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
//                     : latestArticles.map(a => <NcmazCard key={a.id} article={a} />)
//                   }
//                   {!loading && latestArticles.length === 0 && <p className="text-slate-500">No more articles to show here.</p>}
//                 </div>
//               </div>
              
//               {/* Right Sidebar */}
//               <div className="w-full lg:w-[320px] shrink-0 space-y-10">
//                 {/* Discover Tags */}
//                 <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
//                   <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
//                     <Tag className="w-4 h-4" /> Discover more tags
//                   </h3>
//                   <div className="flex flex-wrap gap-2">
//                     {categories.slice(0, 6).map(cat => (
//                       <button key={cat} onClick={() => { setActiveCategory(cat); setPage(0); }} 
//                         className="px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors">
//                         {cat}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Popular Authors (Simulated) */}
//                 <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
//                   <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
//                     <User className="w-4 h-4" /> Top Authors
//                   </h3>
//                   <div className="space-y-4">
//                     {[1,2,3].map((i) => (
//                       <div key={i} className="flex items-center gap-3">
//                          <div className={`w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0`}>
//                            <User className="w-5 h-5 text-slate-500" />
//                          </div>
//                          <div>
//                             <p className="text-sm font-bold text-slate-900">Author {i}</p>
//                             <p className="text-xs text-slate-500">@{`author${i}`}</p>
//                          </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </section>
//           </>
//         )}

//         {/* Pagination (Bottom) */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-center gap-2 pt-10 border-t border-slate-200">
//             <button
//               onClick={() => setPage(Math.max(0, page - 1))}
//               disabled={page === 0}
//               className="px-5 py-2.5 text-sm font-semibold bg-white border border-slate-200 rounded-full text-slate-600 hover:text-slate-900 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
//             >
//               Previous
//             </button>
//             <div className="flex items-center gap-1 hidden sm:flex">
//               {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setPage(i)}
//                   className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
//                     page === i
//                       ? 'bg-slate-900 text-white shadow-md'
//                       : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//             </div>
//             <button
//               onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
//               disabled={page >= totalPages - 1}
//               className="px-5 py-2.5 text-sm font-semibold bg-white border border-slate-200 rounded-full text-slate-600 hover:text-slate-900 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </main>

 
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, Clock, Eye, ChevronRight } from 'lucide-react';
import blogApi, { BlogArticle } from '@/lib/blogApi';

/* ─── Helpers ──────────────────────────────────────────────── */

const readTimeOf = (article: BlogArticle) =>
  Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200));

const excerptOf = (article: BlogArticle, len = 110) =>
  article.excerpt ?? article.content.slice(0, len).replace(/[#*`>]/g, '').trim() + '...';

/* ─── Cards ────────────────────────────────────────────────── */

// Large photo card used in the main "Featured" grid — image fills the
// card, title + excerpt sit on a bottom gradient, category tag floats
// over the top-left corner of the image.
function FeatureCard({ article }: { article: BlogArticle }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group relative flex h-[420px] flex-col justify-end overflow-hidden rounded-3xl bg-slate-200"
    >
      <div
        className="absolute inset-0 bg-slate-300 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: article.imageUrl ? `url(${article.imageUrl})` : undefined }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      <span className="absolute left-5 top-5 w-fit rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-800 backdrop-blur-sm">
        {article.category}
      </span>

      <div className="relative z-10 p-6">
        <h3 className="mb-2 text-xl font-bold leading-snug text-white">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm text-white/75">{excerptOf(article, 130)}</p>
      </div>
    </Link>
  );
}

// Small row card used in the sidebar — square thumbnail, eyebrow (read
// time), title.
function SidebarRow({ article }: { article: BlogArticle }) {
  return (
    <Link href={`/blog/${article.slug}`} className="group flex items-start gap-3">
      <div
        className="h-16 w-16 shrink-0 rounded-xl bg-slate-200 bg-cover bg-center"
        style={{ backgroundImage: article.imageUrl ? `url(${article.imageUrl})` : undefined }}
      />
      <div className="min-w-0">
        <p className="mb-1 text-xs font-medium text-slate-400">
          {readTimeOf(article)} min read
        </p>
        <h4 className="text-sm font-bold leading-snug text-slate-900 line-clamp-2 group-hover:text-blue-600">
          {article.title}
        </h4>
      </div>
    </Link>
  );
}

function FeatureCardSkeleton() {
  return <div className="h-[420px] animate-pulse rounded-3xl bg-slate-100" />;
}

function SidebarRowSkeleton() {
  return (
    <div className="flex items-start gap-3">
      <div className="h-16 w-16 shrink-0 animate-pulse rounded-xl bg-slate-100" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-2.5 w-16 animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */

export default function BlogPage() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const LIMIT = 15;

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
      const unique = res.data.filter( c => c.toLowerCase() !== 'all' );
      setCategories(['All', ...unique]);
    } catch {
      setCategories(['All']);
    }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchArticles(); }, [activeCategory, search, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(0);
  };

  const clearSearch = () => { setSearchInput(''); setSearch(''); setPage(0); };

  const totalPages = Math.ceil(total / LIMIT);

  // Featured = the first three articles (large grid); the rest are split
  // between the "Featured" and "Latest" sidebar lists.
  const featured = articles.slice(0, 3);
  const rest = articles.slice(3);
  const sidebarFeatured = rest.slice(0, 3);
  const sidebarLatest = rest.slice(3, 8);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 pb-16 pt-28 text-center">
        <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
          Blog
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Discover our latest news
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-slate-500">
          Discover the achievements that set us apart. From groundbreaking projects to
          industry accolades, we take pride in our accomplishments.
        </p>

        <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-md items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Input Placeholder"
              className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-9 text-sm shadow-sm outline-none transition-colors focus:border-slate-400"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Find Now
          </button>
        </form>

        {/* Category filter — quiet pill row under the search bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setPage(0); }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 pb-24">
        {!loading && (
          <p className="mb-6 text-sm font-medium text-slate-400">
            {total > 0 ? `${total} articles` : 'No results found'}
            {search && <span className="ml-1">for &ldquo;<span className="text-slate-900">{search}</span>&rdquo;</span>}
          </p>
        )}

        <div className="flex flex-col gap-12 lg:flex-row">
          {/* ── Left: featured grid ─────────────────────────────── */}
          <div className="flex-1">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Whiteboards are remarkable.
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <FeatureCardSkeleton key={i} />)
                : featured.map(a => <FeatureCard key={a.id} article={a} />)}
            </div>

            {!loading && rest.length > 8 && (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.slice(8).map(a => <FeatureCard key={a.id} article={a} />)}
              </div>
            )}

            {!loading && articles.length === 0 && (
              <p className="py-16 text-center text-slate-500">No articles to show here.</p>
            )}
          </div>

          {/* ── Right: sidebar ───────────────────────────────────── */}
          <aside className="w-full shrink-0 space-y-10 lg:w-[300px]">
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Featured</h3>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </div>
              <div className="space-y-5">
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => <SidebarRowSkeleton key={i} />)
                  : sidebarFeatured.map(a => <SidebarRow key={a.id} article={a} />)}
              </div>
            </div>

            <div>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Latest</h3>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </div>
              <div className="space-y-5">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => <SidebarRowSkeleton key={i} />)
                  : sidebarLatest.map(a => <SidebarRow key={a.id} article={a} />)}
              </div>
            </div>

            {/* Quick stat, in place of a decorative widget */}
            {!loading && sidebarLatest.length > 0 && (
              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-400">
                <Eye className="h-3.5 w-3.5" />
                Most read:&nbsp;
                <span className="font-semibold text-slate-600">
                  {[...articles].sort((a, b) => b.viewCount - a.viewCount)[0]?.title}
                </span>
              </div>
            )}
          </aside>
        </div>

        {/* ── Pagination ───────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-2 border-t border-slate-100 pt-10">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <div className="hidden items-center gap-1 sm:flex">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`h-10 w-10 rounded-full text-sm font-bold transition-all ${
                    page === i
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}