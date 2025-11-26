import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MerchantHighlights } from "~/components/landing/MerchantHighlights";
import { ProductShowcase } from "~/components/landing/ProductShowcase";
import { getMerchantBySlug, getMerchants } from "~/services/firebase/merchants";
import { getProductsByMerchant } from "~/services/firebase/products";

type StorePageProps = {
  params: Promise<{ slug: string }>;
};

const fallbackMerchantImage = "/img/merchant-card-default.svg";

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;
  const merchant = await getMerchantBySlug(slug);

  if (!merchant) {
    notFound();
  }

  const [products, otherMerchants] = await Promise.all([
    getProductsByMerchant(merchant.id),
    getMerchants(6).then((merchants) => merchants.filter((m) => m.id !== merchant.id)),
  ]);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16">
      <header className="space-y-4">
        <Link href="/stores" className="text-sm font-semibold text-purple-600 transition hover:text-purple-700">
          ← Semua toko
        </Link>
        <div className="flex items-start gap-6">
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-2 border-neutral-200 bg-white">
            <Image
              src={merchant.avatarUrl ?? fallbackMerchantImage}
              alt={`Logo ${merchant.name}`}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-neutral-900">{merchant.name}</h1>
              {merchant.isVerified && (
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">Verified</span>
              )}
            </div>
            {merchant.location && (
              <p className="text-sm text-neutral-600">📍 {merchant.location}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              {merchant.rating != null && (
                <span className="font-semibold text-neutral-900">⭐ {merchant.rating.toFixed(1)}</span>
              )}
              {merchant.productCount != null && (
                <span>{merchant.productCount} produk</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-900">Katalog Produk</h2>
        {products.length > 0 ? (
          <ProductShowcase products={products} />
        ) : (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-500 shadow-sm">
            <p>Belum ada produk tersedia dari merchant ini.</p>
          </div>
        )}
      </section>

      {otherMerchants.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-neutral-900">Merchant lain yang mungkin Anda suka</h2>
          <div className="mt-6">
            <MerchantHighlights merchants={otherMerchants.slice(0, 3)} />
          </div>
        </section>
      )}
    </main>
  );
}


