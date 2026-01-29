# KiosDarma Marketplace – Integrasi Tahap Awal

Dokumen ini merangkum prioritas implementasi untuk membawa website marketplace KiosDarma live dengan integrasi Firebase dan ekosistem aplikasi merchant. Marketplace ini menggunakan model Facebook Marketplace dimana pembayaran dan pengiriman dilakukan secara privat melalui WhatsApp.

## 1. Fondasi Frontend
- [x] Struktur halaman dasar (landing, katalog, toko, produk, auth, profil, pesanan, notifikasi, dukungan).
- [ ] Desain sistem komponen UI (button, card, badge) yang konsisten dengan aplikasi kasir.
- [ ] Konfigurasi PWA & responsive state (service worker, manifest).

## 2. Autentikasi & Profil Pengguna
- [ ] Firebase Auth (email/password, Google, phone optional).
- [ ] Penandaan role (`customer`, `merchant`, `admin`) pada claim pengguna.
- [ ] Sinkronisasi profil pelanggan di `/customers/{userId}`.

## 3. Katalog Produk & Toko
- [ ] Listener realtime `/products` dengan filter kategori & merchant.
- [ ] Halaman toko (`/stores/{slug}`) menampilkan katalog merchant.
- [ ] Foto produk & toko melalui Firebase Storage + CDN caching.

## 4. Keranjang & Checkout (WhatsApp-based)
- [x] Persistensi keranjang (localStorage untuk guest, Firestore untuk login).
- [x] Checkout mengirim pesan WhatsApp ke merchant dengan template detail pesanan.
- [x] Penulisan pesanan ke `/marketplaceOrders/{userId}/{orderId}`.
- [x] Sistem konfirmasi dua arah (user dan merchant) untuk menandai pesanan selesai.

## 5. Pelacakan Pesanan & Notifikasi
- [x] Status pesanan tersinkron dari Firebase → `/marketplaceOrders/{userId}`.
- [ ] Feed notifikasi dari `/notifications` (promo & update pesanan).
- [x] WhatsApp integration untuk komunikasi langsung dengan merchant.
- [x] UI konfirmasi dua arah untuk menandai item telah diterima.

## 6. Ulasan & Dukungan
- [ ] Form ulasan produk/toko ke `/reviews/{productId}/{reviewId}`.
- [ ] Dasbor merchant menampilkan rating rata-rata & feedback ringkas.
- [ ] Form tiket dukungan ke `/supportTickets/{userId}`.

## 7. Admin & Analitik
- [ ] Agregasi penjualan, promo, dan performa merchant di `/transactions`, `/products`, `/users`.
- [ ] Audit log memanfaatkan `DatabaseService`.
- [ ] Role admin hanya dapat diakses melalui path `app/admin/*`.

## Langkah Berikutnya
1. Sinkronisasi skema Firebase terkini (produk, transaksi, profil merchant).
2. Siapkan `firebase` client & admin SDK di folder `src/services`.
3. Implementasi context/auth guard untuk halaman customer-only.
4. Mulai dari katalog produk → checkout → pesanan demi alur end-to-end.



