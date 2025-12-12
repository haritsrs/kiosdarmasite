"use client";

import { useState } from "react";
import { useCart } from "~/contexts/CartContext";
import { type ProductSummary } from "~/models/marketplace";

type AddToCartButtonProps = {
  product: ProductSummary;
  className?: string;
};

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = () => {
    setIsAdding(true);
    setError(null);
    
    try {
      addItem(product, 1);
      setTimeout(() => {
        setIsAdding(false);
      }, 500);
    } catch (err: any) {
      setError(err.message ?? "Gagal menambahkan produk ke keranjang");
      setIsAdding(false);
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-800">
          {error}
        </div>
      )}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isAdding || (product.stock != null && product.stock <= 0)}
        className={className}
      >
        {isAdding ? "Ditambahkan!" : product.stock != null && product.stock <= 0 ? "Stok Habis" : "Tambah ke Keranjang"}
      </button>
    </div>
  );
}













