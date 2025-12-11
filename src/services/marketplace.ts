import { type LandingSnapshot, type Category } from "~/models/marketplace";
import { getTopProducts, getProducts } from "./firebase/products";
import { getMerchants } from "./firebase/merchants";
import { getPromos } from "./firebase/promos";

/**
 * Marketplace service that fetches real data from Firebase.
 * No fallback data - only shows real data from database.
 */

// Category icons mapping
const CATEGORY_ICONS: Record<string, { icon: string; color: string }> = {
  food: { icon: "🍛", color: "bg-orange-100" },
  beverage: { icon: "🥤", color: "bg-sky-100" },
  daily: { icon: "🧺", color: "bg-lime-100" },
  snack: { icon: "🍿", color: "bg-yellow-100" },
  health: { icon: "💊", color: "bg-rose-100" },
  default: { icon: "📦", color: "bg-gray-100" },
};

function extractCategoriesFromProducts(products: Array<{ categoryId: string }>): Category[] {
  const categoryMap = new Map<string, Category>();

  for (const product of products) {
    if (product.categoryId && !categoryMap.has(product.categoryId)) {
      const categoryInfo = CATEGORY_ICONS[product.categoryId] ?? CATEGORY_ICONS.default;
      categoryMap.set(product.categoryId, {
        id: product.categoryId,
        name: product.categoryId.charAt(0).toUpperCase() + product.categoryId.slice(1),
        icon: categoryInfo.icon,
        color: categoryInfo.color,
      });
    }
  }

  return Array.from(categoryMap.values());
}

export async function getLandingSnapshot(): Promise<LandingSnapshot> {
  try {
    // Fetch real data from Firebase
    const [allProducts, topProducts, merchants, promos] = await Promise.all([
      getProducts().catch(() => []),
      getTopProducts(10).catch(() => []),
      getMerchants(6).catch(() => []),
      getPromos(3).catch(() => []),
    ]);

    // Extract categories from products
    const categories = extractCategoriesFromProducts(allProducts);

    // Return only real data - no fallbacks
    return {
      categories,
      promos: promos.map((p) => ({
        ...p,
        bannerUrl: p.bannerUrl ?? "/img/promo-slot-default.svg",
      })),
      featuredMerchants: merchants.map((m) => ({
        ...m,
        avatarUrl: m.avatarUrl ?? "/img/merchant-card-default.svg",
      })),
      topProducts: topProducts.map((p) => ({
        ...p,
        imageUrl: p.imageUrl ?? "/img/product-card-default.svg",
      })),
    };
  } catch (error) {
    console.error("Error fetching landing snapshot:", error);
    // Return empty arrays on error - no fallback data
    return {
      categories: [],
      promos: [],
      featuredMerchants: [],
      topProducts: [],
    };
  }
}
