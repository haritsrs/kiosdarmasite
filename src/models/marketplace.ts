export type UserRole = "customer" | "merchant" | "admin";

export type TransactionStatus = "pending" | "completed" | "cancelled";

export type OrderStatus = "pending" | "confirmed" | "completed" | "cancelled" | "expired";

export type StoreCategory = "Makanan" | "Minuman" | "Kopi" | "Lainnya";

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
  phoneNumber?: string;
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

// ============================================================================
// POS INTEGRATION MODELS (from PPSI POS specification)
// ============================================================================

/**
 * MarketplaceStore: Store profile data from POS
 * Source: users/{uid}/settings/business
 * Only visible on marketplace if marketplaceOptIn=true
 */
export interface MarketplaceStore {
  storeId: string; // uid from Firebase Auth
  storeName: string;
  storeLogo?: string; // Firebase Storage URL
  description?: string;
  category?: StoreCategory;
  address: string;
  whatsappPhone: string;
  tags: string[]; // e.g., ["Halal", "Delivery", "Takeaway"]
  marketplaceOptIn: boolean;
  status: "active" | "paused" | "closed" | "banned";
  lastUpdated?: Date;
  totalOrders?: number;
  averageRating?: number;
}

/**
 * MarketplaceProduct: Product listing from POS
 * Source: users/{uid}/products
 * Only visible on marketplace if marketplaceVisible=true
 */
export interface MarketplaceProduct {
  productId: string;
  storeId: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category: string;
  tags: string[]; // e.g., ["Populer", "Promo", "Baru"]
  priceVisible: boolean;
  marketplaceVisible: boolean;
  createdAt: Date;

  // Computed properties
  isAvailable: boolean;
  stockStatus: string;
}

/**
 * MarketplaceOrderItem: Line item in marketplace order
 */
export interface MarketplaceOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

/**
 * MarketplaceOrder: Order created from marketplace
 * Stored at: marketplace/orders/{orderId}
 */
export interface MarketplaceOrder {
  orderId: string;
  storeId: string;
  userId: string; // Phone hash or Firebase UID
  items: MarketplaceOrderItem[];
  subtotal: number;
  status: OrderStatus;
  createdAt: Date;
  whatsappSentAt?: Date;
  storeConfirmedAt?: Date;
  userConfirmedAt?: Date;
  expiresAt: Date;
  notes?: string;
  cancelReason?: string;
}


