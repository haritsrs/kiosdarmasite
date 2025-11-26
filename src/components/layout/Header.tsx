"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "~/contexts/AuthContext";
import { useCart } from "~/contexts/CartContext";

export function Header() {
  const pathname = usePathname();
  const { user, logout, loading: authLoading } = useAuth();
  const { totalItems } = useCart();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <Image
              src="/img/logo.png"
              alt="KiosDarma Logo"
              fill
              className="object-contain"
              sizes="40px"
              priority
            />
          </div>
          <span className="text-xl font-bold text-purple-600">KiosDarma</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/products"
            className={`text-sm font-medium transition hover:text-purple-600 ${
              isActive("/products") ? "text-purple-600" : "text-neutral-700"
            }`}
          >
            Produk
          </Link>
          <Link
            href="/stores"
            className={`text-sm font-medium transition hover:text-purple-600 ${
              isActive("/stores") ? "text-purple-600" : "text-neutral-700"
            }`}
          >
            Toko
          </Link>
          <Link
            href="/notifications"
            className={`text-sm font-medium transition hover:text-purple-600 ${
              isActive("/notifications") ? "text-purple-600" : "text-neutral-700"
            }`}
          >
            Notifikasi
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {!authLoading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/cart"
                    className="relative flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Keranjang
                    {totalItems > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                        {totalItems > 99 ? "99+" : totalItems}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/orders"
                    className={`hidden rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-neutral-50 sm:block ${
                      isActive("/orders") ? "bg-purple-50 text-purple-600" : "text-neutral-700"
                    }`}
                  >
                    Pesanan
                  </Link>
                  <Link
                    href="/profile"
                    className={`hidden rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-neutral-50 sm:block ${
                      isActive("/profile") ? "bg-purple-50 text-purple-600" : "text-neutral-700"
                    }`}
                  >
                    Profil
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/auth/register"
                    className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}

