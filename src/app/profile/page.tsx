"use client";

import { useEffect, useState } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { ref, get, set, remove } from "firebase/database";
import { getRealtimeDatabase } from "~/services/firebase/client";
import Link from "next/link";

interface UserProfile {
  name: string;
  email: string;
  phoneNumber?: string;
  createdAt?: number;
}

interface Address {
  id: string;
  label: string;
  recipientName: string;
  phoneNumber: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault?: boolean;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
  });
  const [addressForm, setAddressForm] = useState({
    label: "",
    recipientName: "",
    phoneNumber: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    isDefault: false,
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsLoading(false);
      return;
    }

    loadProfile();
    loadAddresses();
  }, [user, authLoading]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const db = getRealtimeDatabase();
      const profileRef = ref(db, `users/${user.uid}/profile`);
      const snapshot = await get(profileRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        setProfile(data);
        setFormData({
          name: data.name ?? "",
          phoneNumber: data.phoneNumber ?? "",
        });
      } else {
        // Create default profile
        const defaultProfile = {
          name: user.displayName ?? user.email?.split("@")[0] ?? "",
          email: user.email ?? "",
          createdAt: Date.now(),
        };
        await set(profileRef, defaultProfile);
        setProfile(defaultProfile);
        setFormData({
          name: defaultProfile.name,
          phoneNumber: "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAddresses = async () => {
    if (!user) return;

    try {
      const db = getRealtimeDatabase();
      const addressesRef = ref(db, `customers/${user.uid}/addresses`);
      const snapshot = await get(addressesRef);

      if (snapshot.exists()) {
        const addressesData = snapshot.val();
        const addressesList: Address[] = Object.entries(addressesData).map(([id, data]: [string, any]) => ({
          id,
          ...data,
        }));
        setAddresses(addressesList);
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const db = getRealtimeDatabase();
      const profileRef = ref(db, `users/${user.uid}/profile`);
      await set(profileRef, {
        ...profile,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
      });

      // Also update customer node
      const customerRef = ref(db, `customers/${user.uid}`);
      const customerSnapshot = await get(customerRef);
      if (customerSnapshot.exists()) {
        await set(ref(db, `customers/${user.uid}/name`), formData.name);
      }

      setProfile((prev) => (prev ? { ...prev, name: formData.name, phoneNumber: formData.phoneNumber } : null));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Gagal menyimpan profil");
    }
  };

  const handleSaveAddress = async () => {
    if (!user) return;

    try {
      const db = getRealtimeDatabase();
      const addressesRef = ref(db, `customers/${user.uid}/addresses`);

      // If setting as default, unset other defaults
      if (addressForm.isDefault) {
        for (const addr of addresses) {
          if (addr.isDefault && addr.id !== editingAddress?.id) {
            await set(ref(db, `customers/${user.uid}/addresses/${addr.id}/isDefault`), false);
          }
        }
      }

      if (editingAddress) {
        // Update existing address
        await set(ref(db, `customers/${user.uid}/addresses/${editingAddress.id}`), addressForm);
      } else {
        // Create new address
        const newAddressRef = ref(db, `customers/${user.uid}/addresses`).push();
        await set(newAddressRef, addressForm);
      }

      await loadAddresses();
      setIsAddingAddress(false);
      setEditingAddress(null);
      setAddressForm({
        label: "",
        recipientName: "",
        phoneNumber: "",
        address: "",
        city: "",
        province: "",
        postalCode: "",
        isDefault: false,
      });
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Gagal menyimpan alamat");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!user || !confirm("Apakah Anda yakin ingin menghapus alamat ini?")) return;

    try {
      const db = getRealtimeDatabase();
      await remove(ref(db, `customers/${user.uid}/addresses/${addressId}`));
      await loadAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Gagal menghapus alamat");
    }
  };

  const startEditingAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      label: address.label,
      recipientName: address.recipientName,
      phoneNumber: address.phoneNumber,
      address: address.address,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      isDefault: address.isDefault ?? false,
    });
    setIsAddingAddress(true);
  };

  if (authLoading || isLoading) {
    return (
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-500 shadow-sm">
          <p>Memuat profil...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
          <p className="text-neutral-500 mb-4">Anda harus login untuk melihat profil.</p>
          <Link
            href="/auth/login"
            className="inline-block rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
      <header>
        <h1 className="text-3xl font-semibold text-neutral-900">Profil Saya</h1>
        <p className="mt-2 text-neutral-600">Kelola informasi profil dan alamat pengiriman Anda.</p>
      </header>

      {/* Profile Section */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">Informasi Profil</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-900">Nama</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-900">Email</label>
              <input
                type="email"
                value={profile?.email ?? user.email ?? ""}
                disabled
                className="w-full rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-2 text-neutral-500"
              />
              <p className="mt-1 text-xs text-neutral-500">Email tidak dapat diubah</p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-900">Nomor Telepon</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveProfile}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Simpan
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: profile?.name ?? "",
                    phoneNumber: profile?.phoneNumber ?? "",
                  });
                }}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Nama:</span>
              <span className="font-semibold text-neutral-900">{profile?.name ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Email:</span>
              <span className="font-semibold text-neutral-900">{profile?.email ?? user.email ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Nomor Telepon:</span>
              <span className="font-semibold text-neutral-900">{profile?.phoneNumber ?? "-"}</span>
            </div>
          </div>
        )}
      </section>

      {/* Addresses Section */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">Alamat Pengiriman</h2>
          {!isAddingAddress && (
            <button
              onClick={() => {
                setIsAddingAddress(true);
                setEditingAddress(null);
                setAddressForm({
                  label: "",
                  recipientName: "",
                  phoneNumber: "",
                  address: "",
                  city: "",
                  province: "",
                  postalCode: "",
                  isDefault: false,
                });
              }}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Tambah Alamat
            </button>
          )}
        </div>

        {isAddingAddress && (
          <div className="mb-6 space-y-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
            <h3 className="font-semibold text-neutral-900">
              {editingAddress ? "Edit Alamat" : "Tambah Alamat Baru"}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-900">Label</label>
                <input
                  type="text"
                  placeholder="Rumah, Kantor, dll"
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-900">Nama Penerima</label>
                <input
                  type="text"
                  value={addressForm.recipientName}
                  onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-900">Nomor Telepon</label>
                <input
                  type="tel"
                  value={addressForm.phoneNumber}
                  onChange={(e) => setAddressForm({ ...addressForm, phoneNumber: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-900">Kota</label>
                <input
                  type="text"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-900">Provinsi</label>
                <input
                  type="text"
                  value={addressForm.province}
                  onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-neutral-900">Kode Pos</label>
                <input
                  type="text"
                  value={addressForm.postalCode}
                  onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                  className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-neutral-900">Alamat Lengkap</label>
              <textarea
                value={addressForm.address}
                onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-neutral-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={addressForm.isDefault}
                onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                className="h-4 w-4 text-purple-600"
              />
              <label htmlFor="isDefault" className="text-sm text-neutral-700">
                Jadikan alamat default
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveAddress}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Simpan
              </button>
              <button
                onClick={() => {
                  setIsAddingAddress(false);
                  setEditingAddress(null);
                }}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {addresses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
            <p>Belum ada alamat tersimpan.</p>
            <p className="mt-1 text-sm">Tambahkan alamat untuk memudahkan checkout.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`rounded-lg border p-4 ${address.isDefault ? "border-purple-500 bg-purple-50" : "border-neutral-200 bg-white"}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-semibold text-neutral-900">{address.label}</span>
                      {address.isDefault && (
                        <span className="rounded-full bg-purple-600 px-2 py-1 text-xs font-semibold text-white">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-700">{address.recipientName}</p>
                    <p className="text-sm text-neutral-700">{address.phoneNumber}</p>
                    <p className="mt-2 text-sm text-neutral-600">{address.address}</p>
                    <p className="text-sm text-neutral-600">
                      {address.city}, {address.province} {address.postalCode}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditingAddress(address)}
                      className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
