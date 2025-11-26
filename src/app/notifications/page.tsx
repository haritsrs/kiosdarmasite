"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "~/contexts/AuthContext";
import { ref, onValue, off } from "firebase/database";
import { getRealtimeDatabase } from "~/services/firebase/client";
import { getNotifications, type Notification } from "~/services/firebase/notifications";

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    // Load initial notifications
    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const customerNotifications = await getNotifications(undefined, "customer");
        setNotifications(customerNotifications);
      } catch (err: any) {
        setError(err.message ?? "Gagal memuat notifikasi");
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();

    // Set up realtime listener for new notifications
    const db = getRealtimeDatabase();
    const notificationsRef = ref(db, "notifications");

    const unsubscribe = onValue(notificationsRef, async (snapshot) => {
      if (snapshot.exists()) {
        try {
          const customerNotifications = await getNotifications(undefined, "customer");
          setNotifications(customerNotifications);
        } catch (err) {
          console.error("Error updating notifications:", err);
        }
      } else {
        setNotifications([]);
      }
    });

    return () => {
      off(notificationsRef, "value", unsubscribe);
    };
  }, [authLoading]);

  if (authLoading || isLoading) {
    return (
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
        <header>
          <h1 className="text-3xl font-semibold text-neutral-900">Notifikasi</h1>
        </header>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-500 shadow-sm">
          <p>Memuat notifikasi...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
        <header>
          <h1 className="text-3xl font-semibold text-neutral-900">Notifikasi</h1>
        </header>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      </main>
    );
  }

  const promoNotifications = notifications.filter((n) => n.type === "promo" || n.type === "banner");
  const orderNotifications = notifications.filter((n) => n.type === "order");

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
      <header>
        <h1 className="text-3xl font-semibold text-neutral-900">Notifikasi</h1>
        <p className="mt-2 text-neutral-600">
          Promo, diskon, dan update pesanan Anda. Data diambil dari node Firebase `/notifications` dengan filter target
          customer.
        </p>
      </header>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
          <p className="text-neutral-500 mb-2">Belum ada notifikasi.</p>
          <p className="text-sm text-neutral-400">Notifikasi promo dan update pesanan akan muncul di sini.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {promoNotifications.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-neutral-900">Promo & Diskon</h2>
              <div className="space-y-4">
                {promoNotifications.map((notification) => (
                  <article
                    key={notification.id}
                    className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
                  >
                    {notification.bannerUrl && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={notification.bannerUrl}
                          alt={notification.title}
                          fill
                          className="object-cover"
                          sizes="(min-width: 768px) 768px, 100vw"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                          {notification.type === "banner" ? "Banner" : "Promo"}
                        </span>
                        {notification.expiresAt && (
                          <span className="text-xs text-neutral-500">
                            Berakhir: {new Date(notification.expiresAt).toLocaleDateString("id-ID")}
                          </span>
                        )}
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-neutral-900">{notification.title}</h3>
                      {notification.description && (
                        <p className="mb-4 text-sm text-neutral-600">{notification.description}</p>
                      )}
                      {notification.deeplink && (
                        <Link
                          href={notification.deeplink}
                          className="inline-block rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
                        >
                          Lihat Detail
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {orderNotifications.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-neutral-900">Update Pesanan</h2>
              <div className="space-y-4">
                {orderNotifications.map((notification) => (
                  <article
                    key={notification.id}
                    className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        Pesanan
                      </span>
                      <span className="text-xs text-neutral-500">
                        {notification.createdAt
                          ? new Date(notification.createdAt).toLocaleString("id-ID")
                          : "Baru saja"}
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-neutral-900">{notification.title}</h3>
                    {notification.description && (
                      <p className="text-sm text-neutral-600">{notification.description}</p>
                    )}
                    {notification.deeplink && (
                      <Link
                        href={notification.deeplink}
                        className="mt-4 inline-block text-sm font-semibold text-purple-600 transition hover:text-purple-700"
                      >
                        Lihat Pesanan →
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
