export type UserRole = "customer" | "merchant" | "admin";

export type TransactionStatus = "pending" | "paid" | "processing" | "shipped" | "completed" | "cancelled";

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface Promo {
  id: string;
  title: string;
  description?: string;
  badge?: string;
  expiresAt?: string;
  bannerUrl?: string;
  deeplink?: string;
}

export interface MerchantProfile {
  id: string;
  name: string;
  slug: string;
  location?: string;
  rating?: number;
  productCount?: number;
  avatarUrl?: string;
  isVerified?: boolean;
}

export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  currency: string;
  imageUrl?: string;
  categoryId: string;
  merchantId: string;
  merchantName: string;
  rating?: number;
  soldCount?: number;
  stock?: number;
}

export interface LandingSnapshot {
  categories: Category[];
  promos: Promo[];
  featuredMerchants: MerchantProfile[];
  topProducts: ProductSummary[];
}


