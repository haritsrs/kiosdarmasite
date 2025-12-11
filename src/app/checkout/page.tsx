"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "~/contexts/CartContext";
import { useAuth } from "~/contexts/AuthContext";
import { createOrder } from "~/services/firebase/orders";
import { getMerchantById } from "~/services/firebase/merchants";

const fallbackProductImage = "/img/product-card-default.svg";

interface OrderGroup {
  merchantId: string;
  merchantName: string;
  merchantPhone?: string;
  items: Array<{
    product: {
      id: string;
      name: string;
      price: number;
      imageUrl?: string;
    };
    quantity: number;
  }>;
  subtotal: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, totalPrice, clearCart, isLoading: cartLoading } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [merchantPhones, setMerchantPhones] = useState<Record<string, string>>({});

  // Group items by merchant
  const orderGroups = useMemo(() => {
    const groups: Record<string, OrderGroup> = {};

    for (const item of items) {
      const merchantId = item.product.merchantId;
      if (!groups[merchantId]) {
        groups[merchantId] = {
          merchantId,
          merchantName: item.product.merchantName,
          merchantPhone: merchantPhones[merchantId],
          items: [],
          subtotal: 0,
        };
      }

      groups[merchantId]!.items.push(item);
      groups[merchantId]!.subtotal += item.product.price * item.quantity;
    }

    return Object.values(groups);
  }, [items, merchantPhones]);

  // Load merchant phone numbers
  useMemo(() => {
    const loadMerchantPhones = async () => {
      const phones: Record<string, string> = {};
      for (const group of orderGroups) {
        if (!group.merchantPhone) {
          try {
            const merchant = await getMerchantById(group.merchantId);
            if (merchant?.phoneNumber) {
              phones[group.merchantId] = merchant.phoneNumber;
            }
          } catch (error) {
            console.error(`Failed to load merchant ${group.merchantId}:`, error);
          }
        }
      }
      if (Object.keys(phones).length > 0) {
        setMerchantPhones((prev) => ({ ...prev, ...phones }));
      }
    };

    if (orderGroups.length > 0) {
      loadMerchantPhones();
    }
  }, [orderGroups]);

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
          <p className="mb-4 text-neutral-500">Anda harus login untuk melanjutkan checkout.</p>
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

  const generateWhatsAppMessage = (group: OrderGroup): string => {
    const customerName = user.displayName ?? user.email?.split("@")[0] ?? "Pelanggan";
    let message = `Halo ${group.merchantName}! 👋\n\n`;
    message += `Saya ingin memesan:\n\n`;

    for (const item of group.items) {
      message += `• ${item.product.name}\n`;
      message += `  Jumlah: ${item.quantity}\n`;
      message += `  Harga: Rp ${item.product.price.toLocaleString("id-ID")}\n`;
      message += `  Subtotal: Rp ${(item.product.price * item.quantity).toLocaleString("id-ID")}\n\n`;
    }

    message += `Total: Rp ${group.subtotal.toLocaleString("id-ID")}\n\n`;
    message += `Nama: ${customerName}\n`;
    if (user.email) {
      message += `Email: ${user.email}\n`;
    }
    message += `\nMohon konfirmasi ketersediaan dan detail pengiriman. Terima kasih! 🙏`;

    return message;
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // For now, we'll create one order per merchant group
      // In the future, you might want to create separate orders for each merchant
      const firstGroup = orderGroups[0]!;
      
      if (!firstGroup.merchantPhone) {
        throw new Error(`Nomor WhatsApp merchant ${firstGroup.merchantName} belum tersedia. Silakan hubungi merchant terlebih dahulu.`);
      }

      const orderItems = firstGroup.items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: item.product.price * item.quantity,
      }));

      const whatsappMessage = generateWhatsAppMessage(firstGroup);

      // Create order in Firebase
      const newOrderId = await createOrder(
        user.uid,
        orderItems,
        whatsappMessage
      );

      setOrderId(newOrderId);

      // Open WhatsApp with the message
      const phoneNumber = firstGroup.merchantPhone.replace(/[^0-9]/g, "");
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, "_blank");

      // Clear cart
      clearCart();
      setOrderCreated(true);
      setIsProcessing(false);

      // Redirect to orders page after 3 seconds
      setTimeout(() => {
        router.push("/orders");
      }, 3000);
    } catch (err: any) {
      setError(err.message ?? "Terjadi kesalahan saat membuat pesanan");
      setIsProcessing(false);
    }
  };

  if (orderCreated) {
    return (
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center shadow-sm">
          <div className="mb-4 text-4xl">✅</div>
          <h2 className="mb-2 text-2xl font-semibold text-green-900">Pesanan Berhasil Dibuat!</h2>
          <p className="mb-4 text-green-700">
            Pesanan Anda telah dicatat. Silakan lanjutkan komunikasi dengan merchant melalui WhatsApp.
          </p>
          <p className="mb-6 text-sm text-green-600">
            ID Pesanan: <span className="font-mono font-semibold">{orderId}</span>
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/orders"
              className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Lihat Pesanan Saya
            </Link>
            <Link
              href="/products"
              className="rounded-lg border border-green-600 px-6 py-3 font-semibold text-green-600 transition hover:bg-green-50"
            >
              Lanjut Belanja
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
      <header>
        <Link href="/cart" className="text-sm font-semibold text-purple-600 transition hover:text-purple-700">
          ← Kembali ke keranjang
        </Link>
        <h1 className="mt-2 text-3xl font-semibold text-neutral-900">Checkout</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Pesanan akan dikirim melalui WhatsApp. Pembayaran dan pengiriman diatur langsung dengan merchant.
        </p>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <section className="space-y-6">
          {orderGroups.map((group) => (
            <div key={group.merchantId} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-4">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">{group.merchantName}</h2>
                  {group.merchantPhone ? (
                    <p className="text-sm text-neutral-600">
                      📱 {group.merchantPhone}
                    </p>
                  ) : (
                    <p className="text-sm text-amber-600">
                      ⚠️ Nomor WhatsApp belum tersedia
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {group.items.map((item) => (
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
          ))}
        </section>

        <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Ringkasan Pesanan</h2>
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
            disabled={isProcessing || orderGroups.some((g) => !g.merchantPhone)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? (
              "Memproses..."
            ) : (
              <>
                <span>📱</span>
                <span>Kirim via WhatsApp</span>
              </>
            )}
          </button>
          {orderGroups.some((g) => !g.merchantPhone) && (
            <p className="mt-2 text-xs text-amber-600">
              Beberapa merchant belum memiliki nomor WhatsApp. Silakan hubungi merchant terlebih dahulu.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
