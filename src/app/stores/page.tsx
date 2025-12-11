"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MerchantHighlights } from "~/components/landing/MerchantHighlights";
import { getAllUsers } from "~/services/firebase/merchants";
import { type MerchantProfile } from "~/models/marketplace";

type UserProfile = MerchantProfile & { role?: string };

export default function StoresPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("[StoresPage] Fetching users...");
        const usersData = await getAllUsers();
        console.log("[StoresPage] Fetched users:", usersData.length, usersData);
        setUsers(usersData);
      } catch (err: any) {
        console.error("[StoresPage] Error loading users:", err);
        setError(err.message ?? "Gagal memuat daftar pengguna.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    // Role filter
    if (roleFilter !== "all" && user.role !== roleFilter) {
      return false;
    }

    // Search filter
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.location?.toLowerCase().includes(query) ||
      user.slug.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query)
    );
  });

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-neutral-900">Semua Pengguna</h1>
        <p className="max-w-2xl text-neutral-600">
          Daftar semua pengguna yang terdaftar di KiosDarma. Data diambil langsung dari Firebase `/users`.
        </p>
      </header>

      {/* Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <input
            type="text"
            placeholder="Cari pengguna berdasarkan nama, lokasi, slug, atau role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 placeholder:text-neutral-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Role Filter */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <label className="mb-2 block text-sm font-semibold text-neutral-900">Filter Role</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
          >
            <option value="all">Semua Role</option>
            <option value="customer">Customer</option>
            <option value="merchant">Merchant</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-500 shadow-sm">
          <p>Memuat daftar merchant...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 shadow-sm">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
          <p className="mt-2 text-xs text-red-500">Periksa console untuk detail lebih lanjut.</p>
        </div>
      )}

      {/* Results Count */}
      {!isLoading && !error && (
        <div className="text-sm text-neutral-600">
          Menampilkan {filteredUsers.length} dari {users.length} pengguna
          {roleFilter !== "all" && ` (filter: ${roleFilter})`}
        </div>
      )}

      {/* Users List */}
      {!isLoading && !error && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <article key={user.id} className="flex h-full flex-col gap-4 rounded-sm border border-slate-200 bg-white px-4 py-4 shadow-sm">
              <header className="flex items-start justify-between border-b border-dashed border-slate-200 pb-3">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-slate-900">
                    <Link href={`/stores/${user.slug}`} className="hover:underline">
                      {user.name}
                    </Link>
                  </h3>
                  {user.location ? (
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">{user.location}</p>
                  ) : null}
                  {user.role && (
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-purple-600">
                      Role: {user.role}
                    </p>
                  )}
                </div>
                {user.isVerified ? (
                  <span className="rounded-sm border border-purple-400 bg-purple-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-purple-700">
                    Verified
                  </span>
                ) : null}
              </header>

              {user.avatarUrl && (
                <div className="relative h-40 overflow-hidden rounded-sm border border-slate-200">
                  <img
                    src={user.avatarUrl}
                    alt={`Foto ${user.name}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <dl className="space-y-2 text-sm text-slate-600">
                {typeof user.rating === "number" ? (
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <dt className="uppercase tracking-[0.18em] text-[11px] text-slate-500">Rating</dt>
                    <dd className="font-semibold text-slate-900">{user.rating.toFixed(1)}</dd>
                  </div>
                ) : null}

                {typeof user.productCount === "number" ? (
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <dt className="uppercase tracking-[0.18em] text-[11px] text-slate-500">Produk</dt>
                    <dd className="font-semibold text-slate-900">{user.productCount}</dd>
                  </div>
                ) : null}

                <div className="flex items-center justify-between">
                  <dt className="uppercase tracking-[0.18em] text-[11px] text-slate-500">ID</dt>
                  <dd className="text-xs font-mono text-slate-400">{user.id.substring(0, 8)}...</dd>
                </div>
              </dl>

              <footer className="mt-auto border-t border-slate-200 pt-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">
                <Link href={`/stores/${user.slug}`} className="inline-flex items-center gap-2 hover:text-purple-600">
                  Lihat detail
                  <span className="text-[10px]">→</span>
                </Link>
              </footer>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
