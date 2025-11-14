import Image from "next/image";
import Link from "next/link";

const dailyDeals = [
  { label: "Flash Sale Pagi", description: "08.00 - 11.00 | diskon sampai 60%" },
  { label: "Voucher Ongkir", description: "Gratis ongkir s/d Rp20.000 di Jabodetabek" },
  { label: "Kasir Sync", description: "Stok merchant update otomatis setiap 5 menit" },
];

const heroMedia = {
  main: { src: "/img/hero-main-banner.svg", alt: "Slot banner utama KiosDarma" },
  secondary: [
    { src: "/img/hero-side-banner-1.svg", alt: "Slot banner produk unggulan" },
    { src: "/img/hero-side-banner-2.svg", alt: "Slot banner promo musiman" },
  ],
};

const heroBanners = [
  { title: "Paket Sembako", info: "Mulai Rp99.000", link: "/products", image: "/img/hero-side-banner-1.svg" },
  { title: "Minuman Grosir", info: "Diskon 15% beli 3 karton", link: "/products", image: "/img/hero-side-banner-2.svg" },
  { title: "Perlengkapan UMKM", info: "Alat kasir & printer struk", link: "/products", image: "/img/hero-side-banner-1.svg" },
];

export function LandingHero() {
  return (
    <section className="border-b border-slate-200 bg-[#f7f7f7]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.65fr_1fr]">
          <div className="space-y-4">
            <span className="inline-block bg-purple-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.35em] text-white">
              Marketplace UMKM
            </span>
            <h1 className="text-[32px] font-bold leading-tight text-slate-900">
              Semua kebutuhan warung & rumah tangga, langsung dari merchant KiosDarma.
            </h1>
            <p className="text-sm leading-relaxed text-slate-600">
              Produk berubah setiap jam, stok mengikuti kasir merchant, dan promo hadir sepanjang hari. Jangan tunggu rapi—langsung belanja sebelum kehabisan.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-sm border border-purple-700 bg-purple-700 px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-white hover:bg-purple-800"
              >
                Lihat semua produk
              </Link>
              <Link
                href="/auth/register"
                className="rounded-sm border border-purple-700 px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-purple-700 hover:bg-purple-50"
              >
                Daftar pembeli
              </Link>
              <Link
                href="/stores"
                className="rounded-sm border border-dashed border-purple-300 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-purple-600"
              >
                Toko terbaru →
              </Link>
            </div>

            <div className="grid gap-3 rounded-sm border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <div className="relative h-48 overflow-hidden rounded-sm border border-slate-200">
                <Image
                  src={heroMedia.main.src}
                  alt={heroMedia.main.alt}
                  fill
                  className="object-cover"
                  priority
                  sizes="(min-width: 1024px) 640px, 100vw"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {heroMedia.secondary.map((item) => (
                  <div key={item.src} className="relative h-32 overflow-hidden rounded-sm border border-slate-200">
                    <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="(min-width: 768px) 320px, 50vw" />
                  </div>
                ))}
              </div>
            </div>

            <ul className="grid gap-3 rounded-sm border border-slate-200 bg-white p-4 text-sm text-slate-700">
              {dailyDeals.map((deal) => (
                <li key={deal.label} className="flex flex-col gap-1 border-b border-dashed border-slate-200 pb-3 last:border-b-0 last:pb-0">
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-purple-600">{deal.label}</span>
                  <span>{deal.description}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-4 rounded-sm border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <div className="relative h-48 overflow-hidden rounded-sm border border-slate-200">
              <Image src="/img/promo-slot-default.svg" alt="Slot gambar promo kiosdarma" fill className="object-cover" sizes="(min-width: 1024px) 320px, 100vw" priority />
            </div>
            <header className="border-b border-dashed border-slate-200 pb-3 text-xs font-bold uppercase tracking-[0.35em] text-slate-500">
              Status Sistem
            </header>
            <div className="space-y-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              <div className="flex items-center justify-between">
                <span>Kasir sync</span>
                <span className="text-purple-600">Normal</span>
              </div>
              <div className="flex items-center justify-between">
                <span>QRIS Xendit</span>
                <span className="text-purple-600">Normal</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Virtual account</span>
                <span className="text-purple-400">Padat</span>
              </div>
            </div>
            <footer className="border-t border-slate-200 pt-3 text-[11px] text-slate-500">
              Update terakhir pukul 07:45 WIB • Data realtime dari dashboard merchant.
            </footer>
          </aside>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {heroBanners.map((banner) => (
            <Link
              key={banner.title}
              href={banner.link}
              className="flex flex-col gap-2 rounded-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:border-orange-500"
            >
              <div className="relative h-32 overflow-hidden rounded-sm border border-slate-200">
                <Image src={banner.image} alt={banner.title} fill className="object-cover" sizes="(min-width: 1024px) 320px, 100vw" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">{banner.title}</span>
              <span className="text-base font-semibold text-slate-900">{banner.info}</span>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">Belanja sekarang →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
