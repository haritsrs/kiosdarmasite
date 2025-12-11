"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import { ProductShowcase } from "~/components/landing/ProductShowcase";
import { getMerchantBySlug, getAllUsers } from "~/services/firebase/merchants";
import { getProductsByMerchant } from "~/services/firebase/products";
import { type MerchantProfile } from "~/models/marketplace";
import { type ProductSummary } from "~/models/marketplace";

const fallbackMerchantImage = "/img/merchant-card-default.svg";

export default function StorePage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [merchant, setMerchant] = useState<MerchantProfile | null>(null);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStoreData = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("[StorePage] Loading store for slug:", slug);
        
        // Get merchant by slug
        const merchantData = await getMerchantBySlug(slug);
        console.log("[StorePage] Found merchant:", merchantData);
        
        if (!merchantData) {
          setError("Merchant tidak ditemukan");
          setIsLoading(false);
          return;
        }
        
        setMerchant(merchantData);
        
        // Get products for this merchant
        const productsData = await getProductsByMerchant(merchantData.id);
        console.log("[StorePage] Found products:", productsData.length);
        setProducts(productsData);
        
      } catch (err: any) {
        console.error("[StorePage] Error loading store:", err);
        setError(err.message ?? "Gagal memuat data toko.");
      } finally {
        setIsLoading(false);
      }
    };

    loadStoreData();
  }, [slug]);

  if (isLoading) {
    return (
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-500 shadow-sm">
          <p>Memuat data toko...</p>
        </div>
      </main>
    );
  }

  if (error || !merchant) {
    return (
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16">
        <Link href="/stores" className="text-sm font-semibold text-purple-600 transition hover:text-purple-700">
          ← Semua toko
        </Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 shadow-sm">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error ?? "Toko tidak ditemukan"}</p>
        </div>
      </main>
    );
  }

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
    </main>
  );
}
