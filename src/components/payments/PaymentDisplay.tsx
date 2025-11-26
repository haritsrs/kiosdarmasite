"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ref, onValue, off } from "firebase/database";
import { getRealtimeDatabase } from "~/services/firebase/client";
import { type TransactionStatus } from "~/models/marketplace";

interface PaymentDisplayProps {
  transactionId: string;
  paymentType: "qris" | "va";
  qrString?: string;
  accountNumber?: string;
  bankCode?: string;
  amount: number;
}

export function PaymentDisplay({
  transactionId,
  paymentType,
  qrString,
  accountNumber,
  bankCode,
  amount,
}: PaymentDisplayProps) {
  const router = useRouter();
  const [status, setStatus] = useState<TransactionStatus>("pending");
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    const db = getRealtimeDatabase();
    const transactionRef = ref(db, `transactions/${transactionId}`);

    const unsubscribe = onValue(transactionRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const newStatus = data.status ?? "pending";
        setStatus(newStatus);

        // Stop polling if payment is completed or failed
        if (newStatus === "paid" || newStatus === "completed" || newStatus === "cancelled" || newStatus === "failed") {
          setIsPolling(false);
          
          // Redirect to orders page after successful payment
          if (newStatus === "paid") {
            setTimeout(() => {
              router.push("/orders");
            }, 2000);
          }
        }
      }
    });

    return () => {
      off(transactionRef, "value", unsubscribe);
    };
  }, [transactionId, router]);

  const statusLabels: Record<TransactionStatus, string> = {
    pending: "Menunggu Pembayaran",
    paid: "Pembayaran Berhasil",
    processing: "Sedang Diproses",
    shipped: "Sedang Dikirim",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };

  const statusColors: Record<TransactionStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-indigo-100 text-indigo-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">Status Pembayaran</h2>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[status]}`}>
            {statusLabels[status]}
          </span>
        </div>

        <div className="mb-4 text-2xl font-bold text-neutral-900">
          Rp {amount.toLocaleString("id-ID")}
        </div>

        {isPolling && status === "pending" && (
          <div className="mb-4 flex items-center gap-2 text-sm text-neutral-600">
            <div className="h-2 w-2 animate-pulse rounded-full bg-purple-600" />
            <span>Menunggu pembayaran...</span>
          </div>
        )}

        {status === "paid" && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-800">
            <p className="font-semibold">Pembayaran berhasil diterima!</p>
            <p className="mt-1">Anda akan diarahkan ke halaman pesanan...</p>
          </div>
        )}
      </div>

      {paymentType === "qris" && qrString && status === "pending" && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">Scan QRIS untuk Membayar</h3>
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-64 w-64 rounded-lg border-2 border-neutral-200 bg-white p-4">
              {/* Generate QR code using a library or API */}
              <div className="flex h-full w-full items-center justify-center">
                <QRCodeDisplay value={qrString} />
              </div>
            </div>
            <p className="text-center text-sm text-neutral-600">
              Buka aplikasi e-wallet atau mobile banking Anda, lalu scan QR code di atas
            </p>
            <div className="mt-2 rounded-lg bg-purple-50 p-3 text-xs text-purple-700">
              <p className="font-mono break-all">{qrString}</p>
            </div>
          </div>
        </div>
      )}

      {paymentType === "va" && accountNumber && status === "pending" && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-neutral-900">Virtual Account</h3>
          <div className="space-y-4">
            {bankCode && (
              <div>
                <p className="text-sm text-neutral-600">Bank</p>
                <p className="text-lg font-semibold text-neutral-900">{bankCode}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-neutral-600">Nomor Virtual Account</p>
              <p className="text-2xl font-bold text-neutral-900 font-mono">{accountNumber}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
              <p className="font-semibold mb-2">Cara Pembayaran:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Buka aplikasi mobile banking atau ATM</li>
                <li>Pilih menu Transfer atau Bayar</li>
                <li>Masukkan nomor Virtual Account di atas</li>
                <li>Masukkan jumlah pembayaran: Rp {amount.toLocaleString("id-ID")}</li>
                <li>Konfirmasi dan selesaikan pembayaran</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple QR code component - in production, use a proper QR code library like qrcode.react
function QRCodeDisplay({ value }: { value: string }) {
  // For now, we'll use a placeholder. In production, install and use:
  // npm install qrcode.react
  // import { QRCodeSVG } from 'qrcode.react';
  // return <QRCodeSVG value={value} size={256} />;
  
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center text-xs text-neutral-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-32 w-32 text-neutral-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
        />
      </svg>
      <p>QR Code</p>
      <p className="text-[10px]">Install qrcode.react</p>
    </div>
  );
}

