"use client";

import { useState } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfileSettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }

    setIsDeleting(true);
    try {
      // TODO: Implement account deletion API
      // await fetch("/api/user/delete", { method: "DELETE" });
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Gagal menghapus akun. Silakan hubungi support.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
      <header>
        <h1 className="text-3xl font-semibold text-neutral-900">Pengaturan Akun</h1>
        <p className="mt-2 text-neutral-600">Kelola pengaturan akun dan preferensi Anda.</p>
      </header>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-neutral-900">Informasi Akun</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-neutral-700">Email</label>
            <p className="mt-1 text-neutral-900">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">Nama</label>
            <p className="mt-1 text-neutral-900">{user?.displayName ?? "Tidak diatur"}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-red-900">Zona Berbahaya</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-red-900">Hapus Akun</h3>
            <p className="mt-1 text-sm text-red-700">
              Menghapus akun Anda akan menghapus semua data yang terkait. Tindakan ini tidak dapat dibatalkan.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="mt-4 rounded-lg border border-red-600 bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? "Menghapus..." : "Hapus Akun"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}


