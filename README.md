# Wishlist Manager

Aplikasi web pribadi yang sederhana, cepat, dan mobile-first untuk mencatat daftar wishlist sekaligus menghitung kebutuhan finansial untuk memenuhinya.

---

## Fitur Utama

1. **Wishlist CRUD & Status**
   * Tambah item dengan nama dan harga (IDR).
   * Edit nama dan harga barang.
   * Tandai barang sebagai sudah dibeli / belum dibeli dengan visual yang jelas.
   * Dialog konfirmasi sebelum menghapus item.

2. **Kalkulator Finansial Otomatis**
   * **Total Wishlist:** Total seluruh estimasi kebutuhan dana.
   * **Sudah Terpenuhi:** Total harga dari barang yang telah dibeli.
   * **Masih Dibutuhkan:** Sisa dana untuk barang yang belum dibeli.
   * **Tabungan Saya:** Input dana siap pakai yang dapat diatur sewaktu-waktu.
   * **Kekurangan / Surplus:** Menghitung apakah tabungan sudah cukup atau masih kurang berapa.
   * **Progress Pencapaian:** Progress bar persentase berdasarkan perbandingan nilai dana.

3. **Filter & Sorting**
   * Filter: Semua, Belum dibeli, Sudah dibeli.
   * Urutan: Terbaru, Harga tertinggi, Harga terendah.

4. **Keamanan & Privasi Ringan (PIN Lock)**
   * Kunci aplikasi dengan PIN minimal 4 digit.
   * Hashing PIN menggunakan Web Crypto API (SHA-256) — tidak pernah disimpan dalam bentuk plaintext.
   * Kunci manual dan otomatis terkunci kembali saat halaman dimuat ulang.
   * Opsi ganti PIN dan hapus PIN.

5. **Backup & Pemulihan (Export / Import JSON)**
   * Export seluruh data wishlist dan tabungan ke file JSON.
   * Import data dengan validasi format dan konfirmasi penggantian data.

6. **Desain Mobile-First & Aksesibel**
   * Responsive layout (smartphone hingga desktop).
   * Floating Add Button di mobile untuk kemudahan navigasi satu tangan.
   * Semantic HTML dan dukungan keyboard navigation.

---

## Tech Stack

* **Framework:** React 19 + TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS v4 (dikonfigurasi via `@tailwindcss/vite` & `src/app.css` tanpa config lama)
* **UI Primitives:** Radix UI (`@radix-ui/react-dialog`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-checkbox`, `@radix-ui/react-progress`)
* **Icons:** Lucide React
* **Persistence:** Browser `localStorage` (dengan safe parsing & in-memory fallback)
* **Deployment:** Vercel

---

## Menjalankan Proyek

### 1. Prasyarat
* Node.js v18+ (direkomendasikan v20+)
* npm / pnpm / yarn

### 2. Instalasi Dependency
```bash
npm install
```

### 3. Mode Pengembangan (Development)
```bash
npm run dev
```
Buka browser di alamat `http://localhost:5173`.

### 4. Menjalankan Unit Test
```bash
npm test
```
Menjalankan pengujian logika finansial dan validasi storage dengan test runner bawaan.

### 5. Build Produksi
```bash
npm run build
```
Hasil build siap pakai berada di direktori `dist/`.

---

## Panduan Deployment ke Vercel

Aplikasi ini sudah dilengkapi file `vercel.json` dengan konfigurasi rewrite untuk Single Page Application (SPA).

### Deploy via GitHub (Direkomendasikan):
1. Push repository ke GitHub: `https://github.com/oxydaid/wishlist-manager`.
2. Masuk ke dashboard [Vercel](https://vercel.com).
3. Klik **Add New Project** dan impor repository `wishlist-manager`.
4. Framework Preset akan otomatis terdeteksi sebagai **Vite**.
5. Build command: `npm run build`
6. Output directory: `dist`
7. Klik **Deploy**. Tidak memerlukan environment variable tambahan.

---

## Penjelasan Penyimpanan Data & Privasi

* **Data Disimpan Secara Lokal:** Seluruh data wishlist dan angka tabungan disimpan langsung di browser pengguna menggunakan namespace `wishlist-manager:data`.
* **Tanpa Backend / Server:** Tidak ada data yang dikirim ke server luar atau pihak ketiga.
* **Penanganan Error:** Jika `localStorage` korup atau diblokir (seperti mode penyamaran tertentu), aplikasi secara otomatis beralih ke in-memory state tanpa mengalami crash.

### Batasan Keamanan PIN (Security Limitation)
* Fitur PIN Lock ditujukan sebagai **privacy layer** lokal untuk mencegah orang lain melihat catatan wishlist saat meminjam ponsel/komputer Anda.
* Karena aplikasi berjalan di sisi browser (client-side), PIN ini **bukan** pengganti sistem otentikasi perbankan atau otentikasi berbasis server.
