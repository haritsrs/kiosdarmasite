"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ref, onValue, off } from "firebase/database";
import { getRealtimeDatabase } from "~/services/firebase/client";
import { useAuth } from "~/contexts/AuthContext";
import { getOrdersByUserId, updateOrderStatus, type Order } from "~/services/firebase/orders";
import { type TransactionStatus } from "~/models/marketplace";

const fallbackProductImage = "/img/product-card-default.svg";

const statusLabels: Record<TransactionStatus, string> = {
  pending: "Menunggu Konfirmasi",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const statusColors: Record<TransactionStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsLoading(false);
      return;
    }

    // Initial load
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userOrders = await getOrdersByUserId(user.uid);
        setOrders(userOrders);
      } catch (err: any) {
        setError(err.message ?? "Gagal memuat data pesanan");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();

    // Set up realtime listener for order updates
    const db = getRealtimeDatabase();
    const userOrdersRef = ref(db, `marketplaceOrders/${user.uid}`);

    const unsubscribe = onValue(userOrdersRef, (snapshot) => {
      if (snapshot.exists()) {
        const ordersData = snapshot.val();
        const updatedOrders: Order[] = Object.values(ordersData);
        updatedOrders.sort((a, b) => b.createdAt - a.createdAt);
        setOrders(updatedOrders);
      } else {
        setOrders([]);
      }
    });

    return () => {
      off(userOrdersRef, "value", unsubscribe);
    };
  }, [user, authLoading]);

  const handleConfirmOrder = async (orderId: string) => {
    if (!user) return;

    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(user.uid, orderId, "completed", "user");
    } catch (err: any) {
      setError(err.message ?? "Gagal mengonfirmasi pesanan");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!user) return;
    if (!confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) return;

    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(user.uid, orderId, "cancelled", "user", user.uid);
    } catch (err: any) {
      setError(err.message ?? "Gagal membatalkan pesanan");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const openWhatsApp = (order: Order) => {
    if (!order.whatsappMessage) return;
    // Extract phone number from WhatsApp message or use a default
    // For now, just show the message - user can copy it
    alert(`Pesan WhatsApp:\n\n${order.whatsappMessage}\n\nSilakan salin dan kirim ke merchant melalui WhatsApp.`);
  };

  if (authLoading || isLoading) {
    return (
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16">
        <header>
          <h1 className="text-3xl font-semibold text-neutral-900">Pesanan Saya</h1>
        </header>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-500 shadow-sm">
          <p>Memuat data pesanan...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16">
        <header>
          <h1 className="text-3xl font-semibold text-neutral-900">Pesanan Saya</h1>
        </header>
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
          <p className="mb-4 text-neutral-500">Anda harus login untuk melihat pesanan.</p>
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

  if (error) {
    return (
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16">
        <header>
          <h1 className="text-3xl font-semibold text-neutral-900">Pesanan Saya</h1>
        </header>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16">
      <header>
        <h1 className="text-3xl font-semibold text-neutral-900">Pesanan Saya</h1>
        <p className="mt-2 text-neutral-600">
          Kelola pesanan Anda dan konfirmasi setelah transaksi selesai.
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
          <p className="mb-4 text-neutral-500">Belum ada pesanan.</p>
          <Link
            href="/products"
            className="inline-block rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Pesanan #{order.id.slice(-8)}
                    </h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status]}`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </div>

                  {order.items.length > 0 && (
                    <div className="mb-3 text-sm text-neutral-600">
                      <p className="font-semibold text-neutral-900">
                        {order.items[0]?.productName ? `Produk: ${order.items[0]!.productName}` : "Pesanan"}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded border border-neutral-200 bg-neutral-100">
                          <Image
                            src={fallbackProductImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-neutral-900">{item.productName}</div>
                          <div className="text-neutral-600">
                            {item.quantity} × Rp {item.price.toLocaleString("id-ID")} = Rp{" "}
                            {item.subtotal.toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {order.status === "pending" && (
                      <>
                        {!order.userConfirmed && (
                          <button
                            type="button"
                            onClick={() => handleConfirmOrder(order.id)}
                            disabled={updatingOrderId === order.id}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {updatingOrderId === order.id ? "Memproses..." : "✓ Konfirmasi Selesai"}
                          </button>
                        )}
                        {order.userConfirmed && (
                          <span className="rounded-lg bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
                            ✓ Anda sudah konfirmasi
                          </span>
                        )}
                        {order.merchantConfirmed && (
                          <span className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
                            ✓ Merchant sudah konfirmasi
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={updatingOrderId === order.id}
                          className="rounded-lg border border-red-600 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Batalkan
                        </button>
                        {order.whatsappMessage && (
                          <button
                            type="button"
                            onClick={() => openWhatsApp(order)}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                          >
                            📱 Lihat Pesan WhatsApp
                          </button>
                        )}
                      </>
                    )}
                    {order.status === "completed" && (
                      <span className="rounded-lg bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
                        ✓ Pesanan Selesai
                      </span>
                    )}
                    {order.status === "cancelled" && (
                      <span className="rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-800">
                        ✕ Pesanan Dibatalkan
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-xs text-neutral-500">
                    <span>Dibuat: {new Date(order.createdAt).toLocaleString("id-ID")}</span>
                    {order.completedAt && (
                      <span>Selesai: {new Date(order.completedAt).toLocaleString("id-ID")}</span>
                    )}
                    {order.cancelledAt && (
                      <span>Dibatalkan: {new Date(order.cancelledAt).toLocaleString("id-ID")}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-neutral-900">
                    Rp {order.total.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
