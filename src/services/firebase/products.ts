import { ref, get, query, orderByChild, limitToFirst, equalTo, type DatabaseReference } from "firebase/database";
import { getRealtimeDatabase } from "./client";
import { type ProductSummary } from "~/models/marketplace";

export async function getProducts(limit?: number): Promise<ProductSummary[]> {
  const db = getRealtimeDatabase();
  const productsRef = ref(db, "products");
  let productsQuery: DatabaseReference = productsRef;

  if (limit) {
    productsQuery = query(productsRef, limitToFirst(limit));
  }

  const snapshot = await get(productsQuery);
  if (!snapshot.exists()) {
    return [];
  }

  const productsData = snapshot.val();
  return Object.entries(productsData).map(([id, data]: [string, any]) => ({
    id,
    name: data.name ?? "",
    price: data.price ?? 0,
    currency: data.currency ?? "IDR",
    imageUrl: data.imageUrl ?? data.image ?? undefined,
    categoryId: data.categoryId ?? data.category ?? "",
    merchantId: data.merchantId ?? data.merchant_id ?? "",
    merchantName: data.merchantName ?? data.merchant_name ?? "",
    rating: data.rating ?? undefined,
    soldCount: data.soldCount ?? data.sold_count ?? data.sold ?? undefined,
    stock: data.stock ?? undefined,
  }));
}

export async function getProductById(productId: string): Promise<ProductSummary | null> {
  const db = getRealtimeDatabase();
  const productRef = ref(db, `products/${productId}`);
  const snapshot = await get(productRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.val();
  return {
    id: productId,
    name: data.name ?? "",
    price: data.price ?? 0,
    currency: data.currency ?? "IDR",
    imageUrl: data.imageUrl ?? data.image ?? undefined,
    categoryId: data.categoryId ?? data.category ?? "",
    merchantId: data.merchantId ?? data.merchant_id ?? "",
    merchantName: data.merchantName ?? data.merchant_name ?? "",
    rating: data.rating ?? undefined,
    soldCount: data.soldCount ?? data.sold_count ?? data.sold ?? undefined,
    stock: data.stock ?? undefined,
  };
}

export async function getProductsByCategory(categoryId: string, limit?: number): Promise<ProductSummary[]> {
  const db = getRealtimeDatabase();
  const productsRef = ref(db, "products");
  let productsQuery = query(productsRef, orderByChild("categoryId"), equalTo(categoryId));

  if (limit) {
    productsQuery = query(productsRef, orderByChild("categoryId"), equalTo(categoryId), limitToFirst(limit));
  }

  const snapshot = await get(productsQuery);
  if (!snapshot.exists()) {
    return [];
  }

  const productsData = snapshot.val();
  return Object.entries(productsData).map(([id, data]: [string, any]) => ({
    id,
    name: data.name ?? "",
    price: data.price ?? 0,
    currency: data.currency ?? "IDR",
    imageUrl: data.imageUrl ?? data.image ?? undefined,
    categoryId: data.categoryId ?? data.category ?? "",
    merchantId: data.merchantId ?? data.merchant_id ?? "",
    merchantName: data.merchantName ?? data.merchant_name ?? "",
    rating: data.rating ?? undefined,
    soldCount: data.soldCount ?? data.sold_count ?? data.sold ?? undefined,
    stock: data.stock ?? undefined,
  }));
}

export async function getProductsByMerchant(merchantId: string, limit?: number): Promise<ProductSummary[]> {
  const db = getRealtimeDatabase();
  const productsRef = ref(db, "products");
  let productsQuery = query(productsRef, orderByChild("merchantId"), equalTo(merchantId));

  if (limit) {
    productsQuery = query(productsRef, orderByChild("merchantId"), equalTo(merchantId), limitToFirst(limit));
  }

  const snapshot = await get(productsQuery);
  if (!snapshot.exists()) {
    return [];
  }

  const productsData = snapshot.val();
  return Object.entries(productsData).map(([id, data]: [string, any]) => ({
    id,
    name: data.name ?? "",
    price: data.price ?? 0,
    currency: data.currency ?? "IDR",
    imageUrl: data.imageUrl ?? data.image ?? undefined,
    categoryId: data.categoryId ?? data.category ?? "",
    merchantId: data.merchantId ?? data.merchant_id ?? "",
    merchantName: data.merchantName ?? data.merchant_name ?? "",
    rating: data.rating ?? undefined,
    soldCount: data.soldCount ?? data.sold_count ?? data.sold ?? undefined,
    stock: data.stock ?? undefined,
  }));
}

export async function getTopProducts(limit: number = 10): Promise<ProductSummary[]> {
  const db = getRealtimeDatabase();
  const productsRef = ref(db, "products");
  const productsQuery = query(productsRef, orderByChild("soldCount"), limitToFirst(limit));

  const snapshot = await get(productsQuery);
  if (!snapshot.exists()) {
    return [];
  }

  const productsData = snapshot.val();
  return Object.entries(productsData)
    .map(([id, data]: [string, any]) => ({
      id,
      name: data.name ?? "",
      price: data.price ?? 0,
      currency: data.currency ?? "IDR",
      imageUrl: data.imageUrl ?? data.image ?? undefined,
      categoryId: data.categoryId ?? data.category ?? "",
      merchantId: data.merchantId ?? data.merchant_id ?? "",
      merchantName: data.merchantName ?? data.merchant_name ?? "",
      rating: data.rating ?? undefined,
      soldCount: data.soldCount ?? data.sold_count ?? data.sold ?? undefined,
      stock: data.stock ?? undefined,
    }))
    .sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0));
}

