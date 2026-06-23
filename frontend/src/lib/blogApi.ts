import apiClient from './api';

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt?: string;
  keywords?: string;
  viewCount: number;
  helpfulCount: number;
  unhelpfulCount?: number;
  author: string;
  published: boolean;
  readTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleInput {
  title: string;
  category: string;
  content: string;
  keywords?: string;
  published?: boolean;
  authorId: string;
}

export interface UpdateArticleInput {
  title?: string;
  category?: string;
  content?: string;
  keywords?: string;
  published?: boolean;
}

const blogApi = {
  // ── Public ────────────────────────────────────────────────
  getArticles: async (params?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
    published?: 'all' | boolean;
  }) => {
    const response = await apiClient.get('/blog', { params });
    return response.data as { success: boolean; data: BlogArticle[]; total: number };
  },

  getArticleBySlug: async (slug: string) => {
    const response = await apiClient.get(`/blog/${slug}`);
    return response.data as { success: boolean; data: BlogArticle };
  },

  getCategories: async () => {
    const response = await apiClient.get('/blog/categories');
    return response.data as { success: boolean; data: string[] };
  },

  markHelpful: async (id: string, helpful: boolean) => {
    const response = await apiClient.post(`/blog/${id}/helpful`, { helpful });
    return response.data;
  },

  // ── Admin ─────────────────────────────────────────────────
  createArticle: async (data: CreateArticleInput) => {
    const response = await apiClient.post('/blog', data);
    return response.data as { success: boolean; data: BlogArticle; message: string };
  },

  updateArticle: async (id: string, data: UpdateArticleInput) => {
    const response = await apiClient.put(`/blog/${id}`, data);
    return response.data as { success: boolean; data: BlogArticle; message: string };
  },

  deleteArticle: async (id: string) => {
    const response = await apiClient.delete(`/blog/${id}`);
    return response.data as { success: boolean; message: string };
  },

  getAllArticles: async (params?: { limit?: number; offset?: number }) => {
    const response = await apiClient.get('/blog', { params: { ...params, published: 'all' } });
    return response.data as { success: boolean; data: BlogArticle[]; total: number };
  },
};

export default blogApi;
