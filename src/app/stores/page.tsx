import { MerchantHighlights } from "~/components/landing/MerchantHighlights";
import { getLandingSnapshot } from "~/services/marketplace";

export default async function StoresPage() {
  const { featuredMerchants } = await getLandingSnapshot();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-neutral-900">Semua Toko</h1>
        <p className="max-w-2xl text-neutral-600">
          Daftar merchant akan diperluas untuk membaca data langsung dari `/users/{merchantId}/profile` dan filter berdasarkan kategori atau lokasi.
        </p>
      </header>

      <MerchantHighlights merchants={featuredMerchants} />
    </main>
  );
}


