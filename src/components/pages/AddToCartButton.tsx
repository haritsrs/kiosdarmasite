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

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product, 1);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isAdding || (product.stock != null && product.stock <= 0)}
      className={className}
    >
      {isAdding ? "Ditambahkan!" : product.stock != null && product.stock <= 0 ? "Stok Habis" : "Tambah ke Keranjang"}
    </button>
  );
}












