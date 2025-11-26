import { type LandingSnapshot } from "~/models/marketplace";
import { getTopProducts } from "./firebase/products";
import { getMerchants } from "./firebase/merchants";
import { getPromos } from "./firebase/promos";

/**
 * Marketplace service that fetches real data from Firebase.
 * Falls back to placeholder data if Firebase is not available or returns empty results.
 */

const FALLBACK_CATEGORIES = [
  { id: "food", name: "Makanan", icon: "🍛", color: "bg-orange-100" },
  { id: "beverage", name: "Minuman", icon: "🥤", color: "bg-sky-100" },
  { id: "daily", name: "Kebutuhan Harian", icon: "🧺", color: "bg-lime-100" },
  { id: "snack", name: "Snack", icon: "🍿", color: "bg-yellow-100" },
  { id: "health", name: "Kesehatan", icon: "💊", color: "bg-rose-100" },
];

export async function getLandingSnapshot(): Promise<LandingSnapshot> {
  try {
    // Fetch real data from Firebase
    const [topProducts, merchants, promos] = await Promise.all([
      getTopProducts(10).catch(() => []),
      getMerchants(6).catch(() => []),
      getPromos(3).catch(() => []),
    ]);

    // Use real data if available, otherwise fallback
    return {
      categories: FALLBACK_CATEGORIES,
      promos:
        promos.length > 0
          ? promos.map((p) => ({
              ...p,
              bannerUrl: p.bannerUrl ?? "/img/promo-slot-default.svg",
            }))
          : [
              {
                id: "welcome",
                title: "Diskon 30% Pembeli Baru",
                description: "Promo khusus pengguna baru KiosDarma.",
                badge: "Baru",
                expiresAt: "2 hari lagi",
                bannerUrl: "/img/promo-slot-default.svg",
              },
              {
                id: "shipping",
                title: "Gratis Ongkir",
                description: "Gratis ongkir untuk transaksi di atas Rp50.000.",
                badge: "Populer",
                bannerUrl: "/img/promo-slot-default.svg",
              },
            ],
      featuredMerchants:
        merchants.length > 0
          ? merchants.map((m) => ({
              ...m,
              avatarUrl: m.avatarUrl ?? "/img/merchant-card-default.svg",
            }))
          : [
              {
                id: "merchant-1",
                name: "Warung Harits",
                slug: "warung-harits",
                location: "Depok, Jawa Barat",
                rating: 4.8,
                productCount: 45,
                avatarUrl: "/img/merchant-card-default.svg",
                isVerified: true,
              },
              {
                id: "merchant-2",
                name: "Seeowrens",
                slug: "seeowrens",
                location: "Jakarta Selatan",
                rating: 4.9,
                productCount: 67,
                avatarUrl: "/img/merchant-card-default.svg",
              },
            ],
      topProducts:
        topProducts.length > 0
          ? topProducts.map((p) => ({
              ...p,
              imageUrl: p.imageUrl ?? "/img/product-card-default.svg",
            }))
          : [
              {
                id: "product-ayam-bakar",
                name: "Ayam Bakar",
                price: 13500,
                currency: "IDR",
                categoryId: "food",
                merchantId: "merchant-1",
                merchantName: "Warung Harits",
                rating: 4.8,
                soldCount: 234,
                imageUrl: "/img/product-card-default.svg",
              },
              {
                id: "product-teh-botol",
                name: "Teh Botol Sosro",
                price: 5000,
                currency: "IDR",
                categoryId: "beverage",
                merchantId: "merchant-2",
                merchantName: "Seeowrens",
                rating: 4.7,
                soldCount: 567,
                imageUrl: "/img/product-card-default.svg",
              },
            ],
    };
  } catch (error) {
    console.error("Error fetching landing snapshot:", error);
    // Return fallback data on error
    return {
      categories: FALLBACK_CATEGORIES,
      promos: [
        {
          id: "welcome",
          title: "Diskon 30% Pembeli Baru",
          description: "Promo khusus pengguna baru KiosDarma.",
          badge: "Baru",
          expiresAt: "2 hari lagi",
          bannerUrl: "/img/promo-slot-default.svg",
        },
      ],
      featuredMerchants: [],
      topProducts: [],
    };
  }
}
