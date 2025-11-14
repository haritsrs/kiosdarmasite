export default function SupportPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
      <header>
        <h1 className="text-3xl font-semibold text-neutral-900">Dukungan & Kontak</h1>
        <p className="mt-2 text-neutral-600">
          Sistem tiket pelanggan akan menulis ke `/supportTickets/{userId}` dan mengirimkan notifikasi ke merchant melalui aplikasi.
        </p>
      </header>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-500 shadow-sm">
        <p>Formulir dukungan akan dibuat setelah skema pesan dan SLA disepakati.</p>
      </section>
    </main>
  );
}


