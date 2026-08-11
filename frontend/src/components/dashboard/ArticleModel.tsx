// "use client";

// import { useState, useEffect } from 'react';
// import { Article } from '@/types/blog';

// import blogApi from '@/lib/blogApi';

// import {
//     X,
//     Clock,
//     Calendar,
//     Bookmark,
//     Share2,
//     Award,
//     ArrowLeft,
//     TrendingUp,
//     AlertCircle,
//     Edit3,
//     Save,
//     Trash2,
//     Eye,
//     FileText,
//     Sparkles

// } from 'lucide-react';

// interface ArticleModalProps {
//     article: Article;
//     onClose: () => void;
//     onSave?: (updatedArticle: Article) => void;
//     onDelete?: (article: Article) => void;
// }

// export default function ArticleModal({ article, onClose, onSave, onDelete } : ArticleModalProps ) {
// const [scrollProgress, setScrollProgress] = useState(0);
// const [isBookmarked, setIsBookmarked] = useState(false);
// const [shareStatus, setShareStatus] = useState(false);

// // Editing States
// const [ isEditing, setIsEditing] = useState(!article.id);
// const [title, setTitle] = useState(article.title);
// const [ subtitle, setSubtitle ] = useState(article.category);
// const [ content, setContent ] = useState(article.content);
// const [ imageUrl, setImageUrl ] = useState(article.imageUrl);
// const [readTime, setReadTime] = useState( article.readTime );
// const [volatility, setVolatility] = useState(article.volatility || '' );
// const [ riskStatus, setRiskStatus ] = useState<Required<Article>['riskStatus']>(article.riskStatus || 'low');
// const [authorName, setAuthorName] = useState(article.author.name);
// const [authorRole, setAuthorRole] = useState(article.author.role);
// const [authorAvatar, setAuthorAvatar] = useState(article.author.avatar);
// const [ tagsString, setTagsString] = useState(article.tags.join(', '));
// const [confirmDelete, setConfirmDelete] = useState(false);
// const [ saveSuccess, setSaveSuccess] = useState(false);


// // Synchronize reading progress with scroll position
// useEffect(() => {
//     const handleScroll = () => {
//         const element = document.getElementById('modal-content-container');
//        if (!element) return;
//     }
// })



