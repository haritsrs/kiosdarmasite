export default function ProfilePage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
      <header>
        <h1 className="text-3xl font-semibold text-neutral-900">Profil Pelanggan</h1>
        <p className="mt-2 text-neutral-600">
          Halaman profil akan memuat data dari Firebase Auth dan node `/customers/{userId}`, termasuk alamat, preferensi notifikasi, dan metode pembayaran.
        </p>
      </header>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">Status Pengembangan</h2>
        <p className="mt-2 text-sm text-neutral-600">
          • Sinkronisasi detail pelanggan & alamat pengiriman{" "}
          <span className="font-semibold text-purple-600">belum diterapkan</span>.<br />
          • Riwayat pesanan akan ditarik dari `/transactions/{userId}`.<br />• Pengaturan preferensi notifikasi akan membaca dari `/notifications`.
        </p>
      </section>
    </main>
  );
}


