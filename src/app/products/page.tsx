"use client";

import { useState, useMemo } from "react";
import { ProductShowcase } from "~/components/landing/ProductShowcase";
import { getProducts } from "~/services/firebase/products";
import { getMerchants } from "~/services/firebase/merchants";
import { type ProductSummary } from "~/models/marketplace";
import { useEffect } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [merchants, setMerchants] = useState<Array<{ id: string; name: string }>>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedMerchant, setSelectedMerchant] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc" | "rating" | "popularity">("name");

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [productsData, merchantsData] = await Promise.all([
          getProducts(),
          getMerchants(),
        ]);
        setProducts(productsData);
        setMerchants(merchantsData.map((m) => ({ id: m.id, name: m.name })));

        // Extract unique categories from products
        const categoryMap = new Map<string, string>();
        for (const product of productsData) {
          if (product.categoryId && !categoryMap.has(product.categoryId)) {
            const categoryName = product.categoryId.charAt(0).toUpperCase() + product.categoryId.slice(1);
            categoryMap.set(product.categoryId, categoryName);
          }
        }
        const uniqueCategories = Array.from(categoryMap.entries()).map(([id, name]) => ({ id, name }));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.merchantName.toLowerCase().includes(query) ||
          product.categoryId.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.categoryId === selectedCategory);
    }

    // Merchant filter
    if (selectedMerchant) {
      filtered = filtered.filter((product) => product.merchantId === selectedMerchant);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "popularity":
        filtered.sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0));
        break;
      case "name":
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, selectedMerchant, sortBy]);

  if (isLoading) {
    return (
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold text-neutral-900">Katalog Produk</h1>
        </header>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-500 shadow-sm">
          <p>Memuat produk...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-neutral-900">Katalog Produk</h1>
        <p className="max-w-2xl text-neutral-600">
          Katalog realtime dari Firebase `/products` dengan filter kategori, merchant, dan stok.
        </p>
      </header>

      <div className="space-y-4">
        {/* Search Bar */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <input
            type="text"
            placeholder="Cari produk, merchant, atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Filters */}
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-900">Kategori</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-900">Merchant</label>
            <select
              value={selectedMerchant}
              onChange={(e) => setSelectedMerchant(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            >
              <option value="">Semua Merchant</option>
              {merchants.map((merchant) => (
                <option key={merchant.id} value={merchant.id}>
                  {merchant.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-900">Urutkan</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            >
              <option value="name">Nama A-Z</option>
              <option value="price-asc">Harga: Rendah ke Tinggi</option>
              <option value="price-desc">Harga: Tinggi ke Rendah</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="popularity">Paling Populer</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-neutral-600">
          Menampilkan {filteredAndSortedProducts.length} dari {products.length} produk
        </div>
      </div>

      {filteredAndSortedProducts.length > 0 ? (
        <ProductShowcase products={filteredAndSortedProducts} />
      ) : (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-500 shadow-sm">
          <p>Tidak ada produk yang sesuai dengan filter Anda.</p>
        </div>
      )}
    </main>
  );
}
