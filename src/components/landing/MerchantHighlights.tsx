import Image from "next/image";
import Link from "next/link";

import { type MerchantProfile } from "~/models/marketplace";

type MerchantHighlightsProps = {
  merchants: MerchantProfile[];
};

const fallbackMerchantImage = "/img/merchant-card-default.svg";

export function MerchantHighlights({ merchants }: MerchantHighlightsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {merchants.map((merchant) => (
        <article key={merchant.id} className="flex h-full flex-col gap-4 rounded-sm border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <header className="flex items-start justify-between border-b border-dashed border-slate-200 pb-3">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900">
                <Link href={`/stores/${merchant.slug}`} className="hover:underline">
                  {merchant.name}
                </Link>
              </h3>
              {merchant.location ? (
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">{merchant.location}</p>
              ) : null}
            </div>
            {merchant.isVerified ? (
              <span className="rounded-sm border border-purple-400 bg-purple-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-purple-700">
                Verified
              </span>
            ) : null}
          </header>

          <div className="relative h-40 overflow-hidden rounded-sm border border-slate-200">
            <Image
              src={merchant.avatarUrl ?? fallbackMerchantImage}
              alt={`Foto toko ${merchant.name}`}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 320px, 100vw"
            />
          </div>

          <dl className="space-y-2 text-sm text-slate-600">
            {typeof merchant.rating === "number" ? (
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <dt className="uppercase tracking-[0.18em] text-[11px] text-slate-500">Rating</dt>
                <dd className="font-semibold text-slate-900">{merchant.rating.toFixed(1)}</dd>
              </div>
            ) : null}

            {typeof merchant.productCount === "number" ? (
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <dt className="uppercase tracking-[0.18em] text-[11px] text-slate-500">Produk</dt>
                <dd className="font-semibold text-slate-900">{merchant.productCount}</dd>
              </div>
            ) : null}

            <div className="flex items-center justify-between">
              <dt className="uppercase tracking-[0.18em] text-[11px] text-slate-500">Kontak</dt>
              <dd className="text-xs text-purple-600">Hubungi via aplikasi</dd>
            </div>
          </dl>

          <footer className="mt-auto border-t border-slate-200 pt-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">
            <Link href={`/stores/${merchant.slug}`} className="inline-flex items-center gap-2 hover:text-purple-600">
              Masuk toko
              <span className="text-[10px]">→</span>
            </Link>
          </footer>
        </article>
      ))}
    </div>
  );
}