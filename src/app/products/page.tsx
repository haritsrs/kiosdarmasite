import { ProductShowcase } from "~/components/landing/ProductShowcase";
import { getProducts } from "~/services/firebase/products";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-neutral-900">Katalog Produk</h1>
        <p className="max-w-2xl text-neutral-600">
          Katalog realtime dari Firebase `/products` dengan filter kategori, merchant, dan stok.
        </p>
      </header>

      {products.length > 0 ? (
        <ProductShowcase products={products} />
      ) : (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-500 shadow-sm">
          <p>Belum ada produk tersedia.</p>
        </div>
      )}
    </main>
  );
}


