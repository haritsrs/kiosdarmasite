"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "~/contexts/CartContext";

const fallbackProductImage = "/img/product-card-default.svg";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isLoading } = useCart();

  if (isLoading) {
    return (
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
        <header>
          <h1 className="text-3xl font-semibold text-neutral-900">Keranjang Belanja</h1>
        </header>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-500 shadow-sm">
          <p>Memuat keranjang...</p>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
        <header>
          <h1 className="text-3xl font-semibold text-neutral-900">Keranjang Belanja</h1>
          <p className="mt-2 text-neutral-600">Keranjang Anda kosong.</p>
        </header>

        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
          <p className="text-neutral-500">Belum ada item di keranjang Anda.</p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Mulai Belanja
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
      <header>
        <h1 className="text-3xl font-semibold text-neutral-900">Keranjang Belanja</h1>
        <p className="mt-2 text-neutral-600">
          {totalItems} {totalItems === 1 ? "item" : "items"} di keranjang Anda
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <section className="space-y-4">
          {items.map((item) => (
            <article
              key={item.product.id}
              className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <Link href={`/products/${item.product.id}`} className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                <Image
                  src={item.product.imageUrl ?? fallbackProductImage}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </Link>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="font-semibold text-neutral-900 hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-neutral-600">{item.product.merchantName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id)}
                    className="text-neutral-400 transition hover:text-red-600"
                    aria-label="Hapus item"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded border border-neutral-300 text-neutral-600 transition hover:bg-neutral-100"
                      aria-label="Kurangi jumlah"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-semibold text-neutral-900">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded border border-neutral-300 text-neutral-600 transition hover:bg-neutral-100"
                      aria-label="Tambah jumlah"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-neutral-900">
                    Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Ringkasan</h2>
          <div className="mt-4 space-y-3 border-t border-neutral-200 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})</span>
              <span className="font-semibold text-neutral-900">Rp {totalPrice.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Ongkir</span>
              <span className="font-semibold text-neutral-900">-</span>
            </div>
            <div className="border-t border-neutral-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900">Total</span>
                <span className="text-xl font-bold text-neutral-900">Rp {totalPrice.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block w-full rounded-lg bg-purple-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-purple-700"
          >
            Lanjut ke Checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}
