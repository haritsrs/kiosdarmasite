"use client";

import { useEffect } from "react";
import { captureException } from "~/lib/error-tracking";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error tracking service
    captureException(error, {
      url: window.location.href,
      userAgent: navigator.userAgent,
    });
  }, [error]);

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
        <h1 className="mb-4 text-2xl font-semibold text-red-900">Terjadi Kesalahan</h1>
        <p className="mb-6 text-red-700">
          Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu dan sedang memperbaikinya.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>
    </main>
  );
}


