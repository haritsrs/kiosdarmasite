import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-20">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-neutral-900">Masuk ke KiosDarma</h1>
        <p className="text-sm text-neutral-600">
          Autentikasi akan memakai Firebase Auth yang sama dengan aplikasi. Halaman ini menyiapkan struktur UI dan validasi dasar.
        </p>
      </header>

      <form className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <label className="flex flex-col gap-2 text-sm font-medium text-neutral-700">
          Email
          <input
            type="email"
            placeholder="nama@contoh.com"
            className="rounded-lg border border-neutral-300 px-3 py-2 text-neutral-800 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-neutral-700">
          Kata sandi
          <input
            type="password"
            className="rounded-lg border border-neutral-300 px-3 py-2 text-neutral-800 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </label>
        <button type="submit" className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700">
          Masuk
        </button>
      </form>

      <p className="text-center text-sm text-neutral-600">
        Belum punya akun?{" "}
        <Link href="/auth/register" className="font-semibold text-purple-600 transition hover:text-purple-700">
          Daftar sekarang
        </Link>
      </p>
    </main>
  );
}


