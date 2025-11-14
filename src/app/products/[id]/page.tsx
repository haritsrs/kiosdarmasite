import Link from "next/link";
import { notFound } from "next/navigation";

import { getLandingSnapshot } from "~/services/marketplace";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const { topProducts } = await getLandingSnapshot();
  const product = topProducts.find((item) => item.id === id);

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
          Detail produk akan menyatu dengan skema yang digunakan aplikasi merchant (deskripsi, stok real-time, variasi).
        </p>
      </header>

      <section className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-neutral-500">Placeholder gambar produk.</p>
        </div>
        <aside className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Ringkasan</h2>
          <ul className="mt-4 space-y-2 text-sm text-neutral-600">
            <li>Merchant: {product.merchantName}</li>
            <li>Harga: Rp {product.price.toLocaleString("id-ID")}</li>
            <li>Kategori: {product.categoryId}</li>
          </ul>
          <p className="mt-6 text-sm text-neutral-500">
            Alur checkout akan terhubung ke `XenditService` dan mengurangi stok pada merchant saat transaksi sukses.
          </p>
        </aside>
      </section>
    </main>
  );
}


