const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

type FetchOptions = {
  method?: string;
  token?: string;
  body?: unknown;
  cache?: RequestCache;
  tags?: string[];
};

async function apiFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { method = "GET", token, body, cache = "no-store", tags } = opts;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache,
    ...(tags ? { next: { tags } } : {}),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `API error ${res.status}`);
  return data as T;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiFetch<{ user: User; token: string }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  register: (name: string, email: string, password: string) =>
    apiFetch<{ user: User; token: string }>("/api/auth/register", {
      method: "POST",
      body: { name, email, password },
    }),

  me: (token: string) =>
    apiFetch<User>("/api/auth/me", { token }),

  // Products
  getProducts: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<PaginatedResponse<Product>>(`/api/products${qs}`);
  },

  getProduct: (slug: string) =>
    apiFetch<Product>(`/api/products/${slug}`),

  getRelatedProducts: (id: string) =>
    apiFetch<Product[]>(`/api/products/${id}/related`),

  getAllProducts: (token: string) =>
    apiFetch<Product[]>("/api/products/all", { token }),

  createProduct: (data: Partial<Product>, token: string) =>
    apiFetch<Product>("/api/products", { method: "POST", body: data, token }),

  updateProduct: (id: string, data: Partial<Product>, token: string) =>
    apiFetch<Product>(`/api/products/${id}`, { method: "PUT", body: data, token }),

  deleteProduct: (id: string, token: string) =>
    apiFetch<{ success: boolean }>(`/api/products/${id}`, { method: "DELETE", token }),

  // Categories
  getCategories: () =>
    apiFetch<Category[]>("/api/categories"),

  getCategory: (slug: string) =>
    apiFetch<Category>(`/api/categories/${slug}`),

  getAllCategories: (token: string) =>
    apiFetch<Category[]>("/api/categories/all", { token }),

  createCategory: (data: Partial<Category>, token: string) =>
    apiFetch<Category>("/api/categories", { method: "POST", body: data, token }),

  updateCategory: (id: string, data: Partial<Category>, token: string) =>
    apiFetch<Category>(`/api/categories/${id}`, { method: "PUT", body: data, token }),

  deleteCategory: (id: string, token: string) =>
    apiFetch<{ success: boolean }>(`/api/categories/${id}`, { method: "DELETE", token }),

  // Comments
  getComments: (productId: string) =>
    apiFetch<Comment[]>(`/api/comments?productId=${productId}`),

  getAllComments: (token: string) =>
    apiFetch<Comment[]>("/api/comments/all", { token }),

  createComment: (data: { productId: string; content: string; rating: number }, token: string) =>
    apiFetch<Comment>("/api/comments", { method: "POST", body: data, token }),

  approveComment: (id: string, approved: boolean, token: string) =>
    apiFetch<Comment>(`/api/comments/${id}`, { method: "PATCH", body: { approved }, token }),

  deleteComment: (id: string, token: string) =>
    apiFetch<{ success: boolean }>(`/api/comments/${id}`, { method: "DELETE", token }),

  // Stats
  getStats: (token: string) =>
    apiFetch<AdminStats>("/api/stats", { token }),

  // Upload
  uploadFiles: async (files: File[], token: string): Promise<{ urls: string[] }> => {
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    const res = await fetch(`${BACKEND_URL}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    return res.json();
  },
};

// Re-export types used in api.ts
export type User = {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
  image: string | null;
  phone?: string | null;
  address?: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  parent?: Pick<Category, "name"> | null;
  children?: Category[];
  sortOrder: number;
  published: boolean;
  metaTitle: string | null;
  metaDesc: string | null;
  createdAt: string;
  _count?: { products: number };
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  price: number;
  salePrice: number | null;
  images: string[];
  thumbnail: string | null;
  categoryId: string;
  category?: Category;
  brand: string | null;
  sku: string | null;
  stock: number;
  featured: boolean;
  published: boolean;
  specs: Record<string, string> | null;
  metaTitle: string | null;
  metaDesc: string | null;
  metaKeywords: string | null;
  viewCount: number;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  id: string;
  productId: string;
  userId: string;
  user: Pick<User, "id" | "name" | "image">;
  content: string;
  rating: number;
  approved: boolean;
  createdAt: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AdminStats = {
  totalProducts: number;
  totalCategories: number;
  totalComments: number;
  pendingComments: number;
  totalViews: number;
  recentProducts: Array<Product & { category: { name: string } }>;
};
