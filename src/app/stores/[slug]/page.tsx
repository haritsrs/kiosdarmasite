import Link from "next/link";
import { notFound } from "next/navigation";

import { MerchantHighlights } from "~/components/landing/MerchantHighlights";
import { getLandingSnapshot } from "~/services/marketplace";

type StorePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;
  const { featuredMerchants } = await getLandingSnapshot();
  const merchant = featuredMerchants.find((item) => item.slug === slug);

  if (!merchant) {
    notFound();
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16">
      <header className="space-y-2">
        <Link href="/stores" className="text-sm font-semibold text-purple-600 transition hover:text-purple-700">
          ← Semua toko
        </Link>
        <h1 className="text-3xl font-semibold text-neutral-900">{merchant.name}</h1>
        <p className="text-neutral-600">
          Profil toko akan sinkron otomatis dengan aplikasi merchant (data profil, rating, kontak, dan jam operasional).
        </p>
      </header>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-900">Katalog Produk Merchant</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Placeholder: daftar produk akan diambil dari node `/products/{merchantId}`. Komponen listing akan dibuat setelah data schema final.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-neutral-900">Merchant lain yang mungkin Anda suka</h2>
        <p className="text-sm text-neutral-600">Akan ditenagai oleh rekomendasi berbasis lokasi / kategori produk.</p>
        <div className="mt-6">
          <MerchantHighlights merchants={featuredMerchants.filter((item) => item.id !== merchant.id)} />
        </div>
      </section>
    </main>
  );
}


