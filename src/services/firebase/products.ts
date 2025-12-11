import { ref, get, query, orderByChild, limitToFirst, equalTo, type DatabaseReference } from "firebase/database";
import { getRealtimeDatabase } from "./client";
import { type ProductSummary } from "~/models/marketplace";

export async function getProducts(limit?: number): Promise<ProductSummary[]> {
  const db = getRealtimeDatabase();
  const usersRef = ref(db, "users");
  
  console.log("[getProducts] Fetching products from /users/{userId}/products");
  const usersSnapshot = await get(usersRef);
  
  if (!usersSnapshot.exists()) {
    console.log("[getProducts] No users found");
    return [];
  }

  const usersData = usersSnapshot.val();
  const allProducts: ProductSummary[] = [];

  // Iterate through all users and collect their products
  for (const [userId, userData] of Object.entries(usersData as Record<string, any>)) {
    const userProductsRef = ref(db, `users/${userId}/products`);
    const productsSnapshot = await get(userProductsRef);
    
    if (productsSnapshot.exists()) {
      const productsData = productsSnapshot.val();
      const userRole = userData?.role;
      const userProfile = userData?.profile ?? {};
      const merchantName = userProfile.name ?? userData?.displayName ?? userData?.email?.split("@")[0] ?? "Unknown Merchant";
      
      console.log(`[getProducts] Found products for user ${userId} (${merchantName}):`, Object.keys(productsData || {}).length);
      
      for (const [productId, productData] of Object.entries(productsData as Record<string, any>)) {
        const imageUrl = productData.imageUrl ?? productData.image;
        const categoryId = productData.categoryId ?? productData.category ?? "";
        
        allProducts.push({
          id: `${userId}_${productId}`, // Use composite ID to avoid conflicts
          name: productData.name ?? "",
          price: productData.price ?? 0,
          currency: productData.currency ?? "IDR",
          imageUrl: imageUrl && imageUrl.trim() !== "" ? imageUrl : "/img/product-card-default.svg",
          categoryId: categoryId,
          merchantId: userId,
          merchantName: merchantName,
          rating: productData.rating ?? undefined,
          soldCount: productData.soldCount ?? productData.sold_count ?? productData.sold ?? undefined,
          stock: productData.stock ?? undefined,
        });
      }
    }
  }

  console.log(`[getProducts] Total products found: ${allProducts.length}`);
  
  // Apply limit if specified
  if (limit) {
    return allProducts.slice(0, limit);
  }
  
  return allProducts;
}

export async function getProductById(productId: string): Promise<ProductSummary | null> {
  // Product ID format: {userId}_{productId}
  const parts = productId.split("_");
  if (parts.length < 2) {
    console.error("[getProductById] Invalid product ID format:", productId);
    return null;
  }
  
  const userId = parts[0]!;
  const actualProductId = parts.slice(1).join("_");
  
  const db = getRealtimeDatabase();
  const productRef = ref(db, `users/${userId}/products/${actualProductId}`);
  const snapshot = await get(productRef);

  if (!snapshot.exists()) {
    return null;
  }

  // Get merchant info
  const userRef = ref(db, `users/${userId}`);
  const userSnapshot = await get(userRef);
  const userData = userSnapshot.val();
  const userProfile = userData?.profile ?? {};
  const merchantName = userProfile.name ?? userData?.displayName ?? userData?.email?.split("@")[0] ?? "Unknown Merchant";

  const data = snapshot.val();
  const imageUrl = data.imageUrl ?? data.image;
  const categoryId = data.categoryId ?? data.category ?? "";
  
  return {
    id: productId,
    name: data.name ?? "",
    price: data.price ?? 0,
    currency: data.currency ?? "IDR",
    imageUrl: imageUrl && imageUrl.trim() !== "" ? imageUrl : "/img/product-card-default.svg",
    categoryId: categoryId,
    merchantId: userId,
    merchantName: merchantName,
    rating: data.rating ?? undefined,
    soldCount: data.soldCount ?? data.sold_count ?? data.sold ?? undefined,
    stock: data.stock ?? undefined,
  };
}

export async function getProductsByCategory(categoryId: string, limit?: number): Promise<ProductSummary[]> {
  const allProducts = await getProducts();
  const filtered = allProducts.filter((p) => 
    p.categoryId.toLowerCase() === categoryId.toLowerCase()
  );
  
  if (limit) {
    return filtered.slice(0, limit);
  }
  
  return filtered;
}

export async function getProductsByMerchant(merchantId: string, limit?: number): Promise<ProductSummary[]> {
  const db = getRealtimeDatabase();
  const productsRef = ref(db, `users/${merchantId}/products`);
  const snapshot = await get(productsRef);
  
  if (!snapshot.exists()) {
    return [];
  }

  // Get merchant info
  const userRef = ref(db, `users/${merchantId}`);
  const userSnapshot = await get(userRef);
  const userData = userSnapshot.val();
  const userProfile = userData?.profile ?? {};
  const merchantName = userProfile.name ?? userData?.displayName ?? userData?.email?.split("@")[0] ?? "Unknown Merchant";

  const productsData = snapshot.val();
  const products = Object.entries(productsData).map(([productId, data]: [string, any]) => {
    const imageUrl = data.imageUrl ?? data.image;
    const categoryId = data.categoryId ?? data.category ?? "";
    
    return {
      id: `${merchantId}_${productId}`,
      name: data.name ?? "",
      price: data.price ?? 0,
      currency: data.currency ?? "IDR",
      imageUrl: imageUrl && imageUrl.trim() !== "" ? imageUrl : "/img/product-card-default.svg",
      categoryId: categoryId,
      merchantId: merchantId,
      merchantName: merchantName,
      rating: data.rating ?? undefined,
      soldCount: data.soldCount ?? data.sold_count ?? data.sold ?? undefined,
      stock: data.stock ?? undefined,
    };
  });
  
  if (limit) {
    return products.slice(0, limit);
  }
  
  return products;
}

export async function getTopProducts(limit: number = 10): Promise<ProductSummary[]> {
  const allProducts = await getProducts();
  
  // Sort by soldCount (descending) and take top N
  return allProducts
    .sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0))
    .slice(0, limit);
}

