import Image from "next/image";
import Link from "next/link";

import { CategoryPills } from "../components/landing/CategoryPills";
import { LandingHero } from "../components/landing/LandingHero";
import { LandingSection } from "../components/landing/LandingSection";
import { MerchantHighlights } from "../components/landing/MerchantHighlights";
import { ProductShowcase } from "../components/landing/ProductShowcase";
import { PromoSpotlight } from "../components/landing/PromoSpotlight";
import { getLandingSnapshot } from "~/services/marketplace";

const roadmapItems = [
  {
    title: "Firebase Authentication",
    description: "Implement customer signup/login with role-aware session handling and password reset.",
  },
  {
    title: "Realtime Product Catalog",
    description: "Stream merchant products from `/products` node and hydrate storefront & product detail pages.",
  },
  {
    title: "Xendit-powered Checkout",
    description: "Integrate checkout funnel with Xendit payment intents and sync status to `/transactions`.",
  },
  {
    title: "Customer Order Tracking",
    description: "Expose `/transactions/{userId}` progress updates with merchant fulfilment triggers.",
  },
];

const tickerItems = [
  "Flash Sale 08.00 - 11.00",
  "Kasir Sync v2 live untuk 32 merchant",
  "Gratis ongkir Jabodetabek s/d 30K",
  "QRIS Xendit down? fallback VA tersedia",
  "Promo Cashback 10% untuk pembelian grosir",
];

const hotSearchTerms = ["Minyak goreng", "Beras 5kg", "Gula pasir", "Teh celup", "Kemasan plastik", "Gas LPG", "Kopi sachet"];

const midBanners = [
  { id: "mid-banner-1", src: "/img/home-banner-wide-1.svg", alt: "Banner promo utama KiosDarma", href: "/products" },
  { id: "mid-banner-2", src: "/img/home-banner-wide-2.svg", alt: "Banner grosir mingguan", href: "/products" },
];

export default async function HomePage() {
  const { categories, promos, featuredMerchants, topProducts } = await getLandingSnapshot();

  return (
    <main className="flex flex-col gap-2 pb-24">
      <LandingHero />

      <section className="border-y border-slate-200 bg-white text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-600">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-5 px-4 py-3">
          {tickerItems.map((item) => (
            <span key={item} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm bg-purple-500" />
              {item}
              <span className="h-2 w-2 rounded-sm bg-purple-500" />
            </span>
                    ))}
                  </div>
      </section>

      <section className="border-b border-slate-200 bg-[#f9fafb] text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600">
        <div className="mx-auto flex max-w-6xl items-center gap-4 overflow-x-auto px-4 py-3">
          <span className="shrink-0 text-purple-600">Cari cepat:</span>
          <div className="flex items-center gap-4">
            {hotSearchTerms.map((term) => (
              <span key={term} className="whitespace-nowrap rounded-sm border border-slate-300 bg-white px-3 py-2">
                {term}
                </span>
          ))}
        </div>
      </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 md:grid-cols-2">
          {midBanners.map((banner) => (
            <Link key={banner.id} href={banner.href} className="relative h-40 overflow-hidden rounded-sm border border-slate-200 bg-slate-100">
              <Image src={banner.src} alt={banner.alt} fill className="object-cover" sizes="(min-width: 1024px) 600px, 100vw" />
            </Link>
          ))}
        </div>
      </section>

      <LandingSection
        id="categories"
        title="Kategori Produk"
        description="KiosDarma memetakan produk dari merchant berdasarkan kategori aplikasi kasir. Data akan ditarik langsung dari node `/products`."
        eyebrow="Filter ala warung"
        accent="purple"
        cta={
          <Link href="/products" className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-700 hover:text-purple-600">
            Jelajahi katalog →
          </Link>
        }
      >
        <CategoryPills categories={categories} />
      </LandingSection>

      <LandingSection
        id="promos"
        title="Promo & Banner Terjadwal"
        description="Konten promo diambil dari node Firebase yang sama dengan dashboard aplikasi (mis. `/notifications`)."
        eyebrow="Stiker promo"
        accent="indigo"
        cta={
          <Link href="/notifications" className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-700 hover:text-purple-600">
            Lihat semua promo →
          </Link>
        }
      >
        <PromoSpotlight promos={promos} />
      </LandingSection>

      <LandingSection
        id="merchants"
        title="Merchant Unggulan"
        description="Profil merchant otomatis sinkron dari `/users/{merchantId}/profile`, termasuk rating & jumlah produk."
        eyebrow="Top seller minggu ini"
        accent="lavender"
        cta={
          <Link href="/stores" className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-700 hover:text-purple-600">
            Temukan toko →
          </Link>
        }
      >
        <MerchantHighlights merchants={featuredMerchants} />
      </LandingSection>

      <LandingSection
        id="top-products"
        title="Produk Terlaris"
        description="Ranking sementara bersumber dari transaksi yang tercatat pada `/transactions`. Integrasi realtime akan menyusul."
        eyebrow="FYP di KiosDarma"
        accent="indigo"
        cta={
          <Link href="/products" className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-700 hover:text-purple-600">
            Lihat semua produk →
          </Link>
        }
      >
        <ProductShowcase products={topProducts} />
      </LandingSection>

      <LandingSection
        id="roadmap"
        title="Roadmap Integrasi"
        description="Langkah prioritas untuk menyelaraskan website marketplace dengan ekosistem aplikasi KiosDarma."
        eyebrow="Checklist developer"
        accent="slate"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {roadmapItems.map((item, index) => (
            <article key={item.title} className="flex flex-col gap-3 rounded-sm border border-white/10 bg-slate-800 px-4 py-4 shadow-sm">
              <header className="flex items-center justify-between border-b border-slate-700 pb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-300">
                <span>Step {index + 1}</span>
                <span>Todo</span>
              </header>
              <h3 className="text-base font-semibold text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-slate-200">{item.description}</p>
              <div className="mt-auto flex items-center gap-2 border-t border-slate-700 pt-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-300">
                <span className="h-2 w-2 rounded-sm bg-emerald-300" />
                Ready for build
          </div>
            </article>
            ))}
          </div>
      </LandingSection>
    </main>
  );
}


