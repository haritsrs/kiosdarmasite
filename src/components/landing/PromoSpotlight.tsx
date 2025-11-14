import Image from "next/image";

import { type Promo } from "~/models/marketplace";

type PromoSpotlightProps = {
  promos: Promo[];
};

const fallbackBanner = "/img/promo-slot-default.svg";

export function PromoSpotlight({ promos }: PromoSpotlightProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {promos.map((promo) => (
        <article key={promo.id} className="flex h-full flex-col gap-4 rounded-sm border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="relative h-32 overflow-hidden rounded-sm border border-slate-200">
            <Image
              src={promo.bannerUrl ?? fallbackBanner}
              alt={`Banner promo ${promo.title}`}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 360px, 100vw"
            />
          </div>
          <header className="flex items-center justify-between border-b border-dashed border-slate-200 pb-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            <span>{promo.badge ?? "Promo Spesial"}</span>
            {promo.expiresAt ? <span className="text-purple-600">Selesai {promo.expiresAt}</span> : null}
          </header>
          <div className="space-y-2 text-sm">
            <h3 className="text-lg font-semibold text-slate-900">{promo.title}</h3>
            {promo.description ? <p className="text-slate-600">{promo.description}</p> : null}
          </div>
          <footer className="mt-auto flex items-center justify-between border-t border-slate-200 pt-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            <span>{promo.deeplink ? "Klik untuk klaim" : "Masukkan kode di kasir"}</span>
            {promo.deeplink ? (
              <a href={promo.deeplink} className="rounded-sm border border-purple-200 bg-purple-50 px-3 py-2 text-[11px] font-bold text-purple-700">
                Cek promo
              </a>
            ) : null}
          </footer>
        </article>
      ))}
    </div>
  );
}
