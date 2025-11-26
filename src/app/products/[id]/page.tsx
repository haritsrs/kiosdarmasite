import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProductById } from "~/services/firebase/products";
import { AddToCartButton } from "~/components/pages/AddToCartButton";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

const fallbackProductImage = "/img/product-card-default.svg";

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-16">
      <header className="space-y-2">
        <Link href="/products" className="text-sm font-semibold text-purple-600 transition hover:text-purple-700">
          ← Kembali ke produk
        </Link>
        <h1 className="text-3xl font-semibold text-neutral-900">{product.name}</h1>
        <p className="text-sm text-neutral-600">
          Detail produk dari Firebase dengan stok real-time dan informasi merchant.
        </p>
      </header>

      <section className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <Image
            src={product.imageUrl ?? fallbackProductImage}
            alt={`Foto produk ${product.name}`}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 60vw, 100vw"
          />
        </div>
        <aside className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Ringkasan</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Merchant:</span>
              <span className="font-semibold text-neutral-900">{product.merchantName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Harga:</span>
              <span className="text-lg font-bold text-neutral-900">Rp {product.price.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Kategori:</span>
              <span className="font-semibold text-neutral-900">{product.categoryId}</span>
            </div>
            {product.stock != null && (
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Stok:</span>
                <span className={`font-semibold ${product.stock > 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {product.stock > 0 ? `${product.stock} tersedia` : "Habis"}
                </span>
              </div>
            )}
            {product.rating != null && (
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Rating:</span>
                <span className="font-semibold text-neutral-900">{product.rating.toFixed(1)} / 5</span>
              </div>
            )}
            {product.soldCount != null && (
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Terjual:</span>
                <span className="font-semibold text-neutral-900">{product.soldCount}+ pcs</span>
              </div>
            )}
          </div>
          <AddToCartButton
            product={product}
            className="mt-6 w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </aside>
      </section>
    </main>
  );
}


