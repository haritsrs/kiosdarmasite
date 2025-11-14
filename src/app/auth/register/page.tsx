import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-20">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-neutral-900">Buat Akun Pembeli</h1>
        <p className="text-sm text-neutral-600">
          Registrasi pelanggan akan menambahkan entri ke `/customers/{userId}` bersamaan dengan Firebase Auth.
        </p>
      </header>

      <form className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <label className="flex flex-col gap-2 text-sm font-medium text-neutral-700">
          Nama lengkap
          <input
            type="text"
            placeholder="Nama sesuai identitas"
            className="rounded-lg border border-neutral-300 px-3 py-2 text-neutral-800 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </label>
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
          Daftar
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


