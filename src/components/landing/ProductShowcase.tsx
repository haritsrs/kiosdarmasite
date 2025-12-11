import Image from "next/image";
import Link from "next/link";

import { type ProductSummary } from "~/models/marketplace";
import { AddToCartButton } from "~/components/pages/AddToCartButton";

type ProductShowcaseProps = {
  products: ProductSummary[];
};

const fallbackProductImage = "/img/product-card-default.svg";

export function ProductShowcase({ products }: ProductShowcaseProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
        Belum ada produk yang tersedia.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <article key={product.id} className="flex h-full flex-col gap-3 rounded-sm border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <div className="grid grid-cols-[96px_1fr] gap-3">
            <div className="relative h-24 w-full overflow-hidden rounded-sm border border-slate-200 bg-slate-100">
              <Image
                src={product.imageUrl ?? fallbackProductImage}
                alt={`Foto produk ${product.name}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 96px, 30vw"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">
                <Link href={`/products/${product.id}`} className="hover:underline">
                  {product.name}
                </Link>
              </h3>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">{product.merchantName}</p>
            </div>
          </div>

          <div className="grid gap-2 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span className="uppercase tracking-[0.25em] text-slate-500">Harga</span>
              <span className="rounded-sm bg-purple-600 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-white">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
            </div>
            {typeof product.rating === "number" ? (
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-[0.25em] text-slate-500">Rating</span>
                <span className="font-semibold text-slate-900">{product.rating.toFixed(1)} / 5</span>
              </div>
            ) : null}
            {typeof product.soldCount === "number" ? (
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-[0.25em] text-slate-500">Terjual</span>
                <span className="font-semibold text-slate-900">{product.soldCount}+ pcs</span>
              </div>
            ) : null}
            {product.stock != null ? (
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-[0.25em] text-slate-500">Stok</span>
                <span className="font-semibold text-emerald-600">{product.stock}</span>
              </div>
            ) : null}
          </div>

          <footer className="mt-auto border-t border-slate-200 pt-3">
            <AddToCartButton
              product={product}
              className="w-full rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </footer>
        </article>
      ))}
    </div>
  );
}
