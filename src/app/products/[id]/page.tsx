"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ref, onValue, off } from "firebase/database";
import { getRealtimeDatabase } from "~/services/firebase/client";
import { getProductById, type ProductSummary } from "~/services/firebase/products";
import { getMerchantById } from "~/services/firebase/merchants";
import { AddToCartButton } from "~/components/pages/AddToCartButton";

const fallbackProductImage = "/img/product-card-default.svg";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<ProductSummary | null>(null);
  const [merchantSlug, setMerchantSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const productData = await getProductById(productId);
        if (!productData) {
          setError("Produk tidak ditemukan");
          return;
        }
        setProduct(productData);

        // Load merchant to get slug for linking
        if (productData.merchantId) {
          const merchant = await getMerchantById(productData.merchantId);
          if (merchant) {
            setMerchantSlug(merchant.slug);
          }
        }
      } catch (err: any) {
        setError(err.message ?? "Gagal memuat produk");
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  // Set up realtime listener for stock updates
  useEffect(() => {
    if (!productId) return;

    const db = getRealtimeDatabase();
    const productRef = ref(db, `products/${productId}/stock`);

    const unsubscribe = onValue(productRef, (snapshot) => {
      if (snapshot.exists() && product) {
        const newStock = snapshot.val();
        setProduct((prev) => (prev ? { ...prev, stock: newStock } : null));
      }
    });

    return () => {
      off(productRef, "value", unsubscribe);
    };
  }, [productId, product]);

  if (isLoading) {
    return (
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-16">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-500 shadow-sm">
          <p>Memuat produk...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-16">
        <header className="space-y-2">
          <Link href="/products" className="text-sm font-semibold text-purple-600 transition hover:text-purple-700">
            ← Kembali ke produk
          </Link>
        </header>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-800 shadow-sm">
          <p>{error ?? "Produk tidak ditemukan"}</p>
        </div>
      </main>
    );
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
              {merchantSlug ? (
                <Link
                  href={`/stores/${merchantSlug}`}
                  className="font-semibold text-purple-600 transition hover:text-purple-700"
                >
                  {product.merchantName}
                </Link>
              ) : (
                <span className="font-semibold text-neutral-900">{product.merchantName}</span>
              )}
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
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${product.stock > 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {product.stock > 0 ? `${product.stock} tersedia` : "Habis"}
                  </span>
                  {product.stock > 0 && (
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" title="Update realtime" />
                  )}
                </div>
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
