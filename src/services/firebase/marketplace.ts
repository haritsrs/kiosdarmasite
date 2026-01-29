/**
 * Marketplace Service: Read-only access to POS store & product data
 * Integrates with PPSI POS Firebase database structure
 *
 * Data sources:
 * - Store profile: users/{uid}/settings/business (if marketplaceOptIn=true)
 * - Products: users/{uid}/products (if marketplaceVisible=true)
 * - Orders: marketplace/orders
 */

import { ref, get, onValue, push, update, query, orderByChild, equalTo, type DatabaseReference, type Unsubscribe } from "firebase/database";
import { getRealtimeDatabase } from "./client";
import {
  type MarketplaceStore,
  type MarketplaceProduct,
  type MarketplaceOrder,
  type MarketplaceOrderItem,
  type OrderStatus,
} from "~/models/marketplace";

// ============================================================================
// STORE OPERATIONS
// ============================================================================

/**
 * Get all stores opted into marketplace
 * @param category - Optional: filter by store category (Makanan/Minuman/Kopi/Lainnya)
 * @param tags - Optional: filter by store tags
 * @returns Array of marketplace-visible stores
 */
export async function getMarketplaceStores(
  options?: {
    category?: string;
    tags?: string[];
  }
): Promise<MarketplaceStore[]> {
  try {
    const db = getRealtimeDatabase();
    const usersRef = ref(db, "users");

    console.log("[getMarketplaceStores] Fetching marketplace stores");
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) {
      console.log("[getMarketplaceStores] No users found");
      return [];
    }

    const stores: MarketplaceStore[] = [];
    const usersData = snapshot.val() as Record<string, any>;

    for (const [uid, userData] of Object.entries(usersData)) {
      const settings = userData?.settings?.business as Record<string, any> | undefined;

      // Filter: opted in + active status
      if (settings?.marketplaceOptIn !== true || userData?.status !== "active") {
        continue;
      }

      // Optional: category filter
      if (options?.category && settings?.category !== options.category) {
        continue;
      }

      // Optional: tags filter
      if (options?.tags && options.tags.length > 0) {
        const storeTags = (settings?.tags as string[]) || [];
        if (!options.tags.some((tag) => storeTags.includes(tag))) {
          continue;
        }
      }

      const store: MarketplaceStore = {
        storeId: uid,
        storeName: settings?.name || "Unnamed Store",
        storeLogo: settings?.logo,
        description: settings?.description,
        category: settings?.category,
        address: settings?.address || "",
        whatsappPhone: settings?.phone || "",
        tags: (settings?.tags as string[]) || [],
        marketplaceOptIn: true,
        status: userData?.status || "active",
        lastUpdated: userData?.lastUpdated ? new Date(userData.lastUpdated) : undefined,
      };

      stores.push(store);
      console.log(`[getMarketplaceStores] Added store: ${store.storeName} (${uid})`);
    }

    console.log(`[getMarketplaceStores] Found ${stores.length} marketplace stores`);
    return stores;
  } catch (error) {
    console.error("[getMarketplaceStores] Error:", error);
    throw error;
  }
}

/**
 * Subscribe to realtime updates of all marketplace stores
 * @param options - Optional filters
 * @returns Unsubscribe function
 */
export function subscribeToMarketplaceStores(
  callback: (stores: MarketplaceStore[]) => void,
  options?: {
    category?: string;
    tags?: string[];
  }
): Unsubscribe {
  const db = getRealtimeDatabase();
  const usersRef = ref(db, "users");

  return onValue(usersRef, (snapshot) => {
    const stores: MarketplaceStore[] = [];

    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const usersData = snapshot.val() as Record<string, any>;

    for (const [uid, userData] of Object.entries(usersData)) {
      const settings = userData?.settings?.business as Record<string, any> | undefined;

      if (settings?.marketplaceOptIn !== true || userData?.status !== "active") {
        continue;
      }

      if (options?.category && settings?.category !== options.category) {
        continue;
      }

      if (options?.tags && options.tags.length > 0) {
        const storeTags = (settings?.tags as string[]) || [];
        if (!options.tags.some((tag) => storeTags.includes(tag))) {
          continue;
        }
      }

      stores.push({
        storeId: uid,
        storeName: settings?.name || "Unnamed Store",
        storeLogo: settings?.logo,
        description: settings?.description,
        category: settings?.category,
        address: settings?.address || "",
        whatsappPhone: settings?.phone || "",
        tags: (settings?.tags as string[]) || [],
        marketplaceOptIn: true,
        status: userData?.status || "active",
        lastUpdated: userData?.lastUpdated ? new Date(userData.lastUpdated) : undefined,
      });
    }

    callback(stores);
  });
}

// ============================================================================
// PRODUCT OPERATIONS
// ============================================================================

/**
 * Get all marketplace-visible products from a store
 * @param storeId - Store UID
 * @returns Array of products visible on marketplace
 */
export async function getStoreProducts(storeId: string): Promise<MarketplaceProduct[]> {
  try {
    const db = getRealtimeDatabase();
    const productsRef = ref(db, `users/${storeId}/products`);

    console.log(`[getStoreProducts] Fetching products for store: ${storeId}`);
    const snapshot = await get(productsRef);

    if (!snapshot.exists()) {
      console.log(`[getStoreProducts] No products found for store: ${storeId}`);
      return [];
    }

    const products: MarketplaceProduct[] = [];
    const productsData = snapshot.val() as Record<string, any>;

    for (const [productId, productData] of Object.entries(productsData)) {
      // Only include marketplace-visible + active products
      if (productData.marketplaceVisible !== true || productData.isActive !== true) {
        continue;
      }

      const product: MarketplaceProduct = {
        productId,
        storeId,
        name: productData.name || "",
        description: productData.description,
        price: productData.price || 0,
        stock: productData.stock || 0,
        imageUrl: productData.imageUrl,
        category: productData.category || "Lainnya",
        tags: (productData.tags as string[]) || [],
        priceVisible: productData.priceVisible !== false,
        marketplaceVisible: true,
        createdAt: productData.createdAt ? new Date(productData.createdAt) : new Date(),
        isAvailable: productData.stock > 0,
        stockStatus: getStockStatus(productData.stock || 0),
      };

      products.push(product);
    }

    // Sort: available first, then by name
    products.sort((a, b) => {
      if (a.isAvailable !== b.isAvailable) {
        return a.isAvailable ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    console.log(`[getStoreProducts] Found ${products.length} products for store: ${storeId}`);
    return products;
  } catch (error) {
    console.error(`[getStoreProducts] Error for store ${storeId}:`, error);
    throw error;
  }
}

/**
 * Subscribe to realtime product updates from a store
 * @param storeId - Store UID
 * @param callback - Called whenever products change
 * @returns Unsubscribe function
 */
export function subscribeToStoreProducts(
  storeId: string,
  callback: (products: MarketplaceProduct[]) => void
): Unsubscribe {
  const db = getRealtimeDatabase();
  const productsRef = ref(db, `users/${storeId}/products`);

  return onValue(productsRef, (snapshot) => {
    const products: MarketplaceProduct[] = [];

    if (!snapshot.exists()) {
      callback([]);
      return;
    }

    const productsData = snapshot.val() as Record<string, any>;

    for (const [productId, productData] of Object.entries(productsData)) {
      if (productData.marketplaceVisible !== true || productData.isActive !== true) {
        continue;
      }

      products.push({
        productId,
        storeId,
        name: productData.name || "",
        description: productData.description,
        price: productData.price || 0,
        stock: productData.stock || 0,
        imageUrl: productData.imageUrl,
        category: productData.category || "Lainnya",
        tags: (productData.tags as string[]) || [],
        priceVisible: productData.priceVisible !== false,
        marketplaceVisible: true,
        createdAt: productData.createdAt ? new Date(productData.createdAt) : new Date(),
        isAvailable: productData.stock > 0,
        stockStatus: getStockStatus(productData.stock || 0),
      });
    }

    products.sort((a, b) => {
      if (a.isAvailable !== b.isAvailable) {
        return a.isAvailable ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    callback(products);
  });
}

// ============================================================================
// ORDER OPERATIONS
// ============================================================================

/**
 * Create a new marketplace order
 * @param order - Order data to create
 * @returns Generated order ID
 */
export async function createMarketplaceOrder(
  order: Omit<MarketplaceOrder, "orderId">
): Promise<string> {
  try {
    const db = getRealtimeDatabase();
    const ordersRef = ref(db, "marketplace/orders");

    const orderData = {
      storeId: order.storeId,
      userId: order.userId,
      items: order.items,
      subtotal: order.subtotal,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      expiresAt: order.expiresAt.toISOString(),
      whatsappSentAt: order.whatsappSentAt?.toISOString(),
      storeConfirmedAt: order.storeConfirmedAt?.toISOString(),
      userConfirmedAt: order.userConfirmedAt?.toISOString(),
      notes: order.notes,
      cancelReason: order.cancelReason,
    };

    const newOrderRef = push(ordersRef);
    await newOrderRef.set(orderData);

    const orderId = newOrderRef.key;
    if (!orderId) {
      throw new Error("Failed to generate order ID");
    }

    console.log(`[createMarketplaceOrder] Created order: ${orderId} for store: ${order.storeId}`);
    return orderId;
  } catch (error) {
    console.error("[createMarketplaceOrder] Error:", error);
    throw error;
  }
}

/**
 * Update marketplace order status
 * @param orderId - Order ID to update
 * @param newStatus - New order status
 * @param notes - Optional: cancel reason or notes
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  notes?: string
): Promise<void> {
  try {
    const db = getRealtimeDatabase();
    const orderRef = ref(db, `marketplace/orders/${orderId}`);

    const updates: Record<string, any> = {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    if (newStatus === "confirmed") {
      updates.storeConfirmedAt = new Date().toISOString();
    } else if (newStatus === "completed") {
      updates.userConfirmedAt = new Date().toISOString();
    } else if (newStatus === "cancelled" && notes) {
      updates.cancelReason = notes;
    }

    await update(orderRef, updates);
    console.log(`[updateOrderStatus] Updated order ${orderId} to ${newStatus}`);
  } catch (error) {
    console.error(`[updateOrderStatus] Error for order ${orderId}:`, error);
    throw error;
  }
}

/**
 * Record that WhatsApp message was sent for an order
 */
export async function markOrderWhatsappSent(orderId: string): Promise<void> {
  try {
    const db = getRealtimeDatabase();
    const orderRef = ref(db, `marketplace/orders/${orderId}`);

    await update(orderRef, {
      whatsappSentAt: new Date().toISOString(),
    });

    console.log(`[markOrderWhatsappSent] Marked WhatsApp sent for order: ${orderId}`);
  } catch (error) {
    console.error(`[markOrderWhatsappSent] Error for order ${orderId}:`, error);
    throw error;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get human-readable stock status message
 */
function getStockStatus(stock: number): string {
  if (stock === 0) return "Stok Habis";
  if (stock <= 5) return `Terbatas (${stock})`;
  return "Tersedia";
}
