/**
 * Mock data for marketplace testing
 * Based on PPSI POS integration specification
 */

import {
  type MarketplaceStore,
  type MarketplaceProduct,
  type MarketplaceOrder,
  type MarketplaceOrderItem,
} from "~/models/marketplace";

// ============================================================================
// MOCK STORES
// ============================================================================

export const mockStore1: MarketplaceStore = {
  storeId: "store123",
  storeName: "Ayam Bakar Solo",
  storeLogo: "https://storage.firebase.com/store123/logo.png",
  description: "Ayam bakar spesial dengan bumbu khas Solo",
  category: "Makanan",
  address: "Jl. Sudirman No. 123, Jakarta",
  whatsappPhone: "+628123456789",
  tags: ["Halal", "Delivery", "Takeaway"],
  marketplaceOptIn: true,
  status: "active",
  totalOrders: 145,
  averageRating: 4.7,
};

export const mockStore2: MarketplaceStore = {
  storeId: "store456",
  storeName: "Kopi Artisan Bandung",
  storeLogo: "https://storage.firebase.com/store456/logo.png",
  description: "Kopi specialty dari perkebunan terbaik",
  category: "Kopi",
  address: "Jl. Braga No. 456, Bandung",
  whatsappPhone: "+628987654321",
  tags: ["Organic", "Takeaway"],
  marketplaceOptIn: true,
  status: "active",
  totalOrders: 89,
  averageRating: 4.8,
};

export const mockStore3: MarketplaceStore = {
  storeId: "store789",
  storeName: "Toko Roti Manis",
  storeLogo: undefined,
  description: "Roti dan kue segar setiap hari",
  category: "Minuman",
  address: "Jl. Merdeka No. 789, Surabaya",
  whatsappPhone: "+6285555555555",
  tags: ["Halal"],
  marketplaceOptIn: false, // Not opted in
  status: "active",
};

// ============================================================================
// MOCK PRODUCTS
// ============================================================================

export const mockProducts: MarketplaceProduct[] = [
  {
    productId: "prod1",
    storeId: "store123",
    name: "Paket Hemat 1",
    description: "Nasi, ayam bakar, sambal",
    price: 15000,
    stock: 17,
    imageUrl: "https://storage.firebase.com/store123/prod1.jpg",
    category: "Makanan",
    tags: ["Populer", "Hemat"],
    priceVisible: true,
    marketplaceVisible: true,
    createdAt: new Date("2025-01-20"),
    isAvailable: true,
    stockStatus: "Tersedia",
  },
  {
    productId: "prod2",
    storeId: "store123",
    name: "Ayam Bakar",
    description: "Ayam bakar utuh dengan bumbu khas",
    price: 18000,
    stock: 25,
    imageUrl: "https://storage.firebase.com/store123/prod2.jpg",
    category: "Makanan",
    tags: ["Spesial"],
    priceVisible: true,
    marketplaceVisible: true,
    createdAt: new Date("2025-01-18"),
    isAvailable: true,
    stockStatus: "Tersedia",
  },
  {
    productId: "prod3",
    storeId: "store123",
    name: "Es Teh Manis",
    description: "Es teh segar buatan sendiri",
    price: 5000,
    stock: 0,
    imageUrl: "https://storage.firebase.com/store123/prod3.jpg",
    category: "Minuman",
    tags: [],
    priceVisible: true,
    marketplaceVisible: true,
    createdAt: new Date("2025-01-15"),
    isAvailable: false,
    stockStatus: "Stok Habis",
  },
  {
    productId: "prod4",
    storeId: "store123",
    name: "Sambel Matah",
    description: "Sambal dengan jeruk nipis segar",
    price: 3000,
    stock: 3,
    imageUrl: "https://storage.firebase.com/store123/prod4.jpg",
    category: "Makanan",
    tags: [],
    priceVisible: true,
    marketplaceVisible: true,
    createdAt: new Date("2025-01-10"),
    isAvailable: true,
    stockStatus: "Terbatas (3)",
  },
  {
    productId: "prod5",
    storeId: "store456",
    name: "Kopi Espresso",
    description: "Kopi espresso premium",
    price: 25000,
    stock: 50,
    imageUrl: "https://storage.firebase.com/store456/prod5.jpg",
    category: "Kopi",
    tags: ["Populer", "Baru"],
    priceVisible: true,
    marketplaceVisible: true,
    createdAt: new Date("2025-01-22"),
    isAvailable: true,
    stockStatus: "Tersedia",
  },
  {
    productId: "prod6-hidden",
    storeId: "store123",
    name: "Produk Tersembunyi",
    description: "Ini tidak akan muncul di marketplace",
    price: 99000,
    stock: 10,
    imageUrl: "https://storage.firebase.com/store123/hidden.jpg",
    category: "Makanan",
    tags: [],
    priceVisible: false,
    marketplaceVisible: false, // Hidden from marketplace
    createdAt: new Date("2025-01-01"),
    isAvailable: true,
    stockStatus: "Tersedia",
  },
];

// ============================================================================
// MOCK ORDERS
// ============================================================================

export const mockOrderItems: MarketplaceOrderItem[] = [
  {
    productId: "prod1",
    productName: "Paket Hemat 1",
    quantity: 2,
    unitPrice: 15000,
    subtotal: 30000,
  },
  {
    productId: "prod2",
    productName: "Ayam Bakar",
    quantity: 1,
    unitPrice: 18000,
    subtotal: 18000,
  },
  {
    productId: "prod4",
    productName: "Sambel Matah",
    quantity: 3,
    unitPrice: 3000,
    subtotal: 9000,
  },
];

export const mockOrder1: MarketplaceOrder = {
  orderId: "order-001",
  storeId: "store123",
  userId: "customer-1",
  items: mockOrderItems,
  subtotal: 57000,
  status: "pending",
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  notes: "Tolong dibungkus rapi",
};

export const mockOrder2: MarketplaceOrder = {
  orderId: "order-002",
  storeId: "store456",
  userId: "customer-2",
  items: [
    {
      productId: "prod5",
      productName: "Kopi Espresso",
      quantity: 2,
      unitPrice: 25000,
      subtotal: 50000,
    },
  ],
  subtotal: 50000,
  status: "confirmed",
  createdAt: new Date(Date.now() - 3600000), // 1 hour ago
  whatsappSentAt: new Date(Date.now() - 3500000),
  storeConfirmedAt: new Date(Date.now() - 2000000),
  expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
};

export const mockOrder3: MarketplaceOrder = {
  orderId: "order-003",
  storeId: "store123",
  userId: "customer-3",
  items: [
    {
      productId: "prod1",
      productName: "Paket Hemat 1",
      quantity: 1,
      unitPrice: 15000,
      subtotal: 15000,
    },
  ],
  subtotal: 15000,
  status: "cancelled",
  createdAt: new Date(Date.now() - 86400000), // 1 day ago
  expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
  cancelReason: "Stok tiba-tiba habis",
};

// ============================================================================
// MOCK FIREBASE DATA STRUCTURE
// ============================================================================

export const mockFirebaseUserData = {
  user123: {
    role: "merchant",
    status: "active",
    profile: {
      name: "Ayam Bakar Solo Owner",
      email: "owner@ayam-bakar.com",
      phoneNumber: "+628123456789",
    },
    settings: {
      business: {
        name: "Ayam Bakar Solo",
        description: "Ayam bakar spesial dengan bumbu khas Solo",
        category: "Makanan",
        address: "Jl. Sudirman No. 123, Jakarta",
        phone: "+628123456789",
        logo: "https://storage.firebase.com/store123/logo.png",
        tags: ["Halal", "Delivery", "Takeaway"],
        marketplaceOptIn: true,
      },
    },
    products: {
      prod1: {
        name: "Paket Hemat 1",
        description: "Nasi, ayam bakar, sambal",
        price: 15000,
        stock: 17,
        imageUrl: "https://storage.firebase.com/store123/prod1.jpg",
        category: "Makanan",
        tags: ["Populer", "Hemat"],
        priceVisible: true,
        marketplaceVisible: true,
        isActive: true,
        createdAt: "2025-01-20T00:00:00Z",
      },
      prod2: {
        name: "Ayam Bakar",
        description: "Ayam bakar utuh dengan bumbu khas",
        price: 18000,
        stock: 25,
        imageUrl: "https://storage.firebase.com/store123/prod2.jpg",
        category: "Makanan",
        tags: ["Spesial"],
        priceVisible: true,
        marketplaceVisible: true,
        isActive: true,
        createdAt: "2025-01-18T00:00:00Z",
      },
    },
  },
  user456: {
    role: "merchant",
    status: "active",
    profile: {
      name: "Kopi Artisan Bandung Owner",
      email: "owner@kopi-artisan.com",
      phoneNumber: "+628987654321",
    },
    settings: {
      business: {
        name: "Kopi Artisan Bandung",
        description: "Kopi specialty dari perkebunan terbaik",
        category: "Kopi",
        address: "Jl. Braga No. 456, Bandung",
        phone: "+628987654321",
        logo: "https://storage.firebase.com/store456/logo.png",
        tags: ["Organic", "Takeaway"],
        marketplaceOptIn: true,
      },
    },
    products: {
      prod5: {
        name: "Kopi Espresso",
        description: "Kopi espresso premium",
        price: 25000,
        stock: 50,
        imageUrl: "https://storage.firebase.com/store456/prod5.jpg",
        category: "Kopi",
        tags: ["Populer", "Baru"],
        priceVisible: true,
        marketplaceVisible: true,
        isActive: true,
        createdAt: "2025-01-22T00:00:00Z",
      },
    },
  },
  user789: {
    role: "merchant",
    status: "active",
    profile: {
      name: "Toko Roti Manis Owner",
    },
    settings: {
      business: {
        name: "Toko Roti Manis",
        description: "Roti dan kue segar setiap hari",
        category: "Minuman",
        address: "Jl. Merdeka No. 789, Surabaya",
        phone: "+6285555555555",
        tags: ["Halal"],
        marketplaceOptIn: false, // Not opted in
      },
    },
  },
};

export const mockMarketplaceOrders = {
  "order-001": {
    storeId: "store123",
    userId: "customer-1",
    items: mockOrderItems,
    subtotal: 57000,
    status: "pending",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Tolong dibungkus rapi",
  },
  "order-002": {
    storeId: "store456",
    userId: "customer-2",
    items: [
      {
        productId: "prod5",
        productName: "Kopi Espresso",
        quantity: 2,
        unitPrice: 25000,
        subtotal: 50000,
      },
    ],
    subtotal: 50000,
    status: "confirmed",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    whatsappSentAt: new Date(Date.now() - 3500000).toISOString(),
    storeConfirmedAt: new Date(Date.now() - 2000000).toISOString(),
    expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
};
