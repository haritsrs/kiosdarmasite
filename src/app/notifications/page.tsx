export default function NotificationsPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
      <header>
        <h1 className="text-3xl font-semibold text-neutral-900">Notifikasi</h1>
        <p className="mt-2 text-neutral-600">
          Halaman ini akan menampilkan data promo dan pesan status yang difilter berdasarkan target {`"customer"`} dari node Firebase `/notifications`.
        </p>
      </header>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500 shadow-sm">
        <p>Feed notifikasi realtime akan ditambahkan setelah implementasi listener Firebase selesai.</p>
      </section>
    </main>
  );
}


