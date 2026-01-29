"use client";

import { useEffect } from "react";
import { captureException } from "~/lib/error-tracking";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureException(error, {
      url: typeof window !== "undefined" ? window.location.href : "unknown",
      userAgent: typeof window !== "undefined" ? navigator.userAgent : "unknown",
      type: "global-error",
    });
  }, [error]);

  return (
    <html lang="id">
      <body>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h1>Terjadi Kesalahan Fatal</h1>
          <p>Maaf, terjadi kesalahan yang tidak terduga. Silakan refresh halaman atau hubungi support.</p>
          <button onClick={reset} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  );
}


