export default function OrdersPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-16">
      <header>
        <h1 className="text-3xl font-semibold text-neutral-900">Status Pesanan</h1>
        <p className="mt-2 text-neutral-600">
          Order tracking akan membaca data dari `/transactions/{userId}` dengan status {`"pending" | "paid" | "processing" | "shipped" | "completed"`}.
        </p>
      </header>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500 shadow-sm">
        <p>Pencatatan status akan disediakan setelah webhook Xendit dan update merchant POS tersambung ke node transaksi.</p>
      </section>
    </main>
  );
}


