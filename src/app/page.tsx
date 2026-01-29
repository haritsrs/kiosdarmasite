import Image from "next/image";
import Link from "next/link";
import { type Metadata } from "next";

import { CategoryPills } from "../components/landing/CategoryPills";
import { LandingHero } from "../components/landing/LandingHero";
import { LandingSection } from "../components/landing/LandingSection";
import { MerchantHighlights } from "../components/landing/MerchantHighlights";
import { ProductShowcase } from "../components/landing/ProductShowcase";
import { PromoSpotlight } from "../components/landing/PromoSpotlight";
import { getLandingSnapshot } from "~/services/marketplace";

export const metadata: Metadata = {
  title: "Beranda",
  description: "Marketplace UMKM terintegrasi dengan aplikasi kasir KiosDarma. Belanja kebutuhan warung dan rumah tangga langsung dari merchant terpercaya.",
  alternates: {
    canonical: "/",
  },
};

const midBanners = [
  { id: "mid-banner-1", src: "/img/home-banner-wide-1.svg", alt: "Banner promo utama KiosDarma", href: "/products" },
  { id: "mid-banner-2", src: "/img/home-banner-wide-2.svg", alt: "Banner grosir mingguan", href: "/products" },
];

export default async function HomePage() {
  const { categories, promos, featuredMerchants, topProducts } = await getLandingSnapshot();

  return (
    <main className="flex flex-col gap-2 pb-24">
      <LandingHero />

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
    </main>
  );
}


