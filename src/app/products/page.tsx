import { notFound } from "next/navigation";

import { ProductShowcase } from "~/components/landing/ProductShowcase";
import { getLandingSnapshot } from "~/services/marketplace";

export default async function ProductsPage() {
  const { topProducts } = await getLandingSnapshot();

  if (!topProducts.length) {
    notFound();
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-neutral-900">Katalog Produk</h1>
        <p className="max-w-2xl text-neutral-600">
          Halaman ini akan diperbarui untuk menampilkan katalog realtime dari node Firebase `/products`, termasuk filter kategori, merchant, dan stok.
        </p>
      </header>

      <ProductShowcase products={topProducts} />
    </main>
  );
}


