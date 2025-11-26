import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-purple-600">KiosDarma</h3>
            <p className="text-sm text-neutral-600">
              Marketplace UMKM terintegrasi dengan aplikasi kasir KiosDarma. Semua kebutuhan warung & rumah tangga dalam satu platform.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-neutral-900">Belanja</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/products" className="transition hover:text-purple-600">
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link href="/stores" className="transition hover:text-purple-600">
                  Semua Toko
                </Link>
              </li>
              <li>
                <Link href="/notifications" className="transition hover:text-purple-600">
                  Promo & Diskon
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-neutral-900">Akun</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/profile" className="transition hover:text-purple-600">
                  Profil Saya
                </Link>
              </li>
              <li>
                <Link href="/orders" className="transition hover:text-purple-600">
                  Pesanan Saya
                </Link>
              </li>
              <li>
                <Link href="/cart" className="transition hover:text-purple-600">
                  Keranjang
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-neutral-900">Bantuan</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/support" className="transition hover:text-purple-600">
                  Dukungan
                </Link>
              </li>
              <li>
                <Link href="/support" className="transition hover:text-purple-600">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-8 text-center text-sm text-neutral-600">
          <p>&copy; {new Date().getFullYear()} KiosDarma. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

