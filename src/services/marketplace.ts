import { type LandingSnapshot } from "~/models/marketplace";

/**
 * Basic service stubs for the marketplace experience.
 * These functions currently return placeholder data and will be replaced
 * with Firebase-backed implementations once the integration layer is ready.
 */

export async function getLandingSnapshot(): Promise<LandingSnapshot> {
  return {
    categories: [
      { id: "food", name: "Makanan", icon: "🍛", color: "bg-orange-100" },
      { id: "beverage", name: "Minuman", icon: "🥤", color: "bg-sky-100" },
      { id: "daily", name: "Kebutuhan Harian", icon: "🧺", color: "bg-lime-100" },
      { id: "snack", name: "Snack", icon: "🍿", color: "bg-yellow-100" },
      { id: "health", name: "Kesehatan", icon: "💊", color: "bg-rose-100" },
    ],
    promos: [
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
    featuredMerchants: [
      {
        id: "merchant-1",
        name: "Warung Harits",
        slug: "warung-harits",
        location: "Depok, Jawa Barat",
        rating: 4.8,
        productCount: 45,
        isVerified: true,
        avatarUrl: "/img/merchant-card-default.svg",
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
    topProducts: [
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
}


