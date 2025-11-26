"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "~/contexts/AuthContext";
import { getTransactionsByUserId, type Transaction } from "~/services/firebase/transactions";
import { type TransactionStatus } from "~/models/marketplace";

const fallbackProductImage = "/img/product-card-default.svg";

const statusLabels: Record<TransactionStatus, string> = {
  pending: "Menunggu Pembayaran",
  paid: "Sudah Dibayar",
  processing: "Sedang Diproses",
  shipped: "Sedang Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const statusColors: Record<TransactionStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsLoading(false);
      return;
    }

    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Note: You may need to adjust getTransactionsByUserId to properly filter by userId
        // For now, we'll use the user's UID
        const userTransactions = await getTransactionsByUserId(user.uid);
        setTransactions(userTransactions);
      } catch (err: any) {
        setError(err.message ?? "Gagal memuat data pesanan");
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [user, authLoading]);

  if (authLoading || isLoading) {
    return (
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16">
        <header>
          <h1 className="text-3xl font-semibold text-neutral-900">Status Pesanan</h1>
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
          <h1 className="text-3xl font-semibold text-neutral-900">Status Pesanan</h1>
        </header>
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
          <p className="text-neutral-500 mb-4">Anda harus login untuk melihat pesanan.</p>
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
          <h1 className="text-3xl font-semibold text-neutral-900">Status Pesanan</h1>
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
        <h1 className="text-3xl font-semibold text-neutral-900">Status Pesanan</h1>
        <p className="mt-2 text-neutral-600">
          Lacak status pesanan Anda dari pembayaran hingga pengiriman.
        </p>
      </header>

      {transactions.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
          <p className="text-neutral-500 mb-4">Belum ada pesanan.</p>
          <Link
            href="/products"
            className="inline-block rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <article
              key={transaction.id}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-neutral-900">Pesanan #{transaction.id.slice(-8)}</h3>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[transaction.status]}`}
                    >
                      {statusLabels[transaction.status]}
                    </span>
                  </div>
                  
                  {transaction.description && (
                    <p className="text-sm text-neutral-600 mb-2">{transaction.description}</p>
                  )}

                  {transaction.items && transaction.items.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {transaction.items.map((item, idx) => (
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
                              {item.quantity} × Rp {item.price.toLocaleString("id-ID")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {transaction.paymentType === "qris" && transaction.qrString && transaction.status === "pending" && (
                    <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-3 text-sm">
                      <p className="font-semibold text-purple-900 mb-1">Scan QRIS untuk membayar:</p>
                      <p className="text-purple-700 font-mono text-xs break-all">{transaction.qrString}</p>
                    </div>
                  )}

                  {transaction.paymentType === "va" && transaction.accountNumber && transaction.status === "pending" && (
                    <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm">
                      <p className="font-semibold text-blue-900 mb-1">Virtual Account:</p>
                      <p className="text-blue-700 font-mono text-lg">{transaction.accountNumber}</p>
                      {transaction.bankCode && (
                        <p className="text-blue-600 text-xs mt-1">Bank: {transaction.bankCode}</p>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-4 text-xs text-neutral-500">
                    <span>
                      Dibuat: {new Date(transaction.createdAt).toLocaleString("id-ID")}
                    </span>
                    {transaction.updatedAt && (
                      <span>
                        Diperbarui: {new Date(transaction.updatedAt).toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-neutral-900">
                    Rp {transaction.amount.toLocaleString("id-ID")}
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
