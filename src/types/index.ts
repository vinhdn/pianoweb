export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  image: string | null;
  phone: string | null;
  address: string | null;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  children?: Category[];
  products?: Product[];
  sortOrder: number;
  published: boolean;
  metaTitle: string | null;
  metaDesc: string | null;
  createdAt: Date;
}

export interface Product {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  productId: string;
  userId: string;
  user: Pick<User, "id" | "name" | "image">;
  content: string;
  rating: number;
  approved: boolean;
  createdAt: Date;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
