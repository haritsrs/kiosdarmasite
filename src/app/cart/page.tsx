export default function CartPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
      <header>
        <h1 className="text-3xl font-semibold text-neutral-900">Keranjang Belanja</h1>
        <p className="mt-2 text-neutral-600">
          Keranjang akan disimpan secara sementara (localStorage) sebelum checkout dan disinkronkan ke `/transactions/pending` saat pengguna memasuki alur pembayaran.
        </p>
      </header>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500 shadow-sm">
        <p>Belum ada item. Checkout integrasi Xendit & WhatsApp akan dipindahkan dari prototipe ke modul transaksi.</p>
      </section>
    </main>
  );
}


