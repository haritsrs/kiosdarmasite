"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "~/contexts/AuthContext";
import { PasswordStrength } from "~/components/auth/PasswordStrength";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUp(email, password, name, "customer");
      router.push("/");
    } catch (err: any) {
      setError(err.message ?? "Gagal mendaftar. Periksa data yang Anda masukkan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-20">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-neutral-900">Buat Akun Pembeli</h1>
        <p className="text-sm text-neutral-600">Daftar sebagai pelanggan untuk mulai belanja di KiosDarma Marketplace.</p>
      </header>

      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm" noValidate>
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-neutral-700">
            Nama lengkap
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama sesuai identitas"
            required
            autoComplete="name"
            aria-describedby={error ? "name-error" : undefined}
            aria-invalid={error ? "true" : "false"}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-neutral-800 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="register-email" className="text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@contoh.com"
            required
            autoComplete="email"
            aria-describedby={error ? "email-error" : undefined}
            aria-invalid={error ? "true" : "false"}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-neutral-800 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="register-password" className="text-sm font-medium text-neutral-700">
            Kata sandi
          </label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            aria-describedby="password-help password-error"
            aria-invalid={error ? "true" : "false"}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-neutral-800 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
          <PasswordStrength password={password} />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Daftar"}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-600">
        Sudah punya akun?{" "}
        <Link href="/auth/login" className="font-semibold text-purple-600 transition hover:text-purple-700">
          Masuk sekarang
        </Link>
      </p>
    </main>
  );
}
