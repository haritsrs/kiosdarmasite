"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "~/contexts/CartContext";
import { useAuth } from "~/contexts/AuthContext";

const fallbackProductImage = "/img/product-card-default.svg";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, totalPrice, clearCart, isLoading: cartLoading } = useCart();
  const [paymentType, setPaymentType] = useState<"qris" | "va">("qris");
  const [bankCode, setBankCode] = useState("BCA");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (cartLoading) {
    return (
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-500 shadow-sm">
          <p>Memuat checkout...</p>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
        <header>
          <h1 className="text-3xl font-semibold text-neutral-900">Checkout</h1>
        </header>
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
          <p className="text-neutral-500">Keranjang Anda kosong.</p>
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

  if (!user) {
    return (
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
        <header>
          <h1 className="text-3xl font-semibold text-neutral-900">Checkout</h1>
        </header>
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
          <p className="text-neutral-500 mb-4">Anda harus login untuk melanjutkan checkout.</p>
          <Link
            href="/auth/login"
            className="inline-block rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const referenceId = `order_${Date.now()}_${user.uid}`;
      
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: paymentType,
          amount: totalPrice,
          referenceId,
          userId: user.uid,
          bankCode: paymentType === "va" ? bankCode : undefined,
          customer: {
            givenNames: user.displayName ?? user.email?.split("@")[0] ?? "Customer",
            email: user.email ?? "",
          },
          description: `Pembayaran untuk ${items.length} item dari KiosDarma`,
          items: items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Gagal membuat pembayaran");
      }

      const paymentData = await response.json();

      // Clear cart after successful payment creation
      clearCart();

      // Redirect to payment page or show payment instructions
      if (paymentType === "qris" && paymentData.qrString) {
        // For QRIS, you might want to show a QR code modal or redirect to a payment page
        router.push(`/orders?paymentId=${paymentData.id}`);
      } else if (paymentType === "va" && paymentData.accountNumber) {
        // For VA, show account number and instructions
        router.push(`/orders?paymentId=${paymentData.id}`);
      } else {
        router.push("/orders");
      }
    } catch (err: any) {
      setError(err.message ?? "Terjadi kesalahan saat memproses pembayaran");
      setIsProcessing(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
      <header>
        <Link href="/cart" className="text-sm font-semibold text-purple-600 transition hover:text-purple-700">
          ← Kembali ke keranjang
        </Link>
        <h1 className="mt-2 text-3xl font-semibold text-neutral-900">Checkout</h1>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <section className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-900">Metode Pembayaran</h2>
            <div className="mt-4 space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 p-4 transition hover:bg-neutral-50">
                <input
                  type="radio"
                  name="paymentType"
                  value="qris"
                  checked={paymentType === "qris"}
                  onChange={(e) => setPaymentType(e.target.value as "qris")}
                  className="h-4 w-4 text-purple-600"
                />
                <div className="flex-1">
                  <div className="font-semibold text-neutral-900">QRIS</div>
                  <div className="text-sm text-neutral-600">Bayar dengan QRIS melalui aplikasi e-wallet atau mobile banking</div>
                </div>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 p-4 transition hover:bg-neutral-50">
                <input
                  type="radio"
                  name="paymentType"
                  value="va"
                  checked={paymentType === "va"}
                  onChange={(e) => setPaymentType(e.target.value as "va")}
                  className="h-4 w-4 text-purple-600"
                />
                <div className="flex-1">
                  <div className="font-semibold text-neutral-900">Virtual Account</div>
                  <div className="text-sm text-neutral-600">Bayar melalui Virtual Account bank</div>
                </div>
              </label>
            </div>

            {paymentType === "va" && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-neutral-900">Pilih Bank</label>
                <select
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900"
                >
                  <option value="BCA">BCA</option>
                  <option value="BNI">BNI</option>
                  <option value="BRI">BRI</option>
                  <option value="MANDIRI">Mandiri</option>
                </select>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-900">Ringkasan Pesanan</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                    <Image
                      src={item.product.imageUrl ?? fallbackProductImage}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900">{item.product.name}</div>
                    <div className="text-sm text-neutral-600">
                      {item.quantity} × Rp {item.product.price.toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div className="font-semibold text-neutral-900">
                    Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Total Pembayaran</h2>
          <div className="mt-4 space-y-3 border-t border-neutral-200 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Subtotal</span>
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
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isProcessing}
            className="mt-6 w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? "Memproses..." : "Buat Pesanan"}
          </button>
        </aside>
      </div>
    </main>
  );
}

