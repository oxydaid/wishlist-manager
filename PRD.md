# PRD — Wishlist Manager

## 1. Overview

**Nama:** Wishlist Manager
**Repository:** `oxydaid/wishlist-manager`
**Tujuan:** Aplikasi pribadi untuk mencatat wishlist sekaligus menghitung kebutuhan finansial untuk memenuhi wishlist tersebut.

Wishlist bukan hanya daftar barang, tetapi memiliki:

* Nama item
* Harga
* Status sudah dibeli / belum
* Total kebutuhan dana
* Uang/tabungan yang tersedia
* Sisa dana yang masih dibutuhkan
* Progress pencapaian wishlist

**Prinsip utama:** sederhana, cepat, mobile-first, private, tidak over-engineered.

---

## 2. Tech Stack

Gunakan:

* React
* Vite
* TypeScript
* shadcn/ui
* Tailwind CSS v4
* Lucide React
* Browser `localStorage` untuk persistence
* Vercel untuk deployment
* GitHub repository: `oxydaid/wishlist-manager`

### Aturan penting

* **Jangan gunakan Next.js.**
* **Jangan gunakan backend/API/database.**
* **Jangan gunakan Tailwind config lama.**
* Tailwind CSS v4 dikonfigurasi langsung melalui `src/app.css`.
* Jangan menambahkan library besar jika kebutuhan dapat diselesaikan dengan React/native browser API.
* Gunakan shadcn/ui hanya untuk komponen UI yang memang diperlukan.
* TypeScript strict.
* Mobile-first.
* Responsive hingga desktop.
* Semua data utama disimpan di `localStorage`.

---

# 3. Core Concept

Aplikasi memiliki dua data utama:

### Wishlist Item

Setiap item memiliki:

```ts
{
  id: string
  name: string
  price: number
  completed: boolean
  createdAt: string
  updatedAt: string
}
```

### Financial State

```ts
{
  savings: number
}
```

`savings` bukan rekening atau saldo bank sungguhan.

Ini hanyalah angka kasar yang menunjukkan:

> "Saat ini saya punya uang/tabungan yang bisa dialokasikan untuk wishlist."

---

# 4. Business Logic

## Total Wishlist

Total seluruh harga item:

```text
totalPrice = SUM(item.price)
```

Tidak peduli item sudah selesai atau belum, total wishlist tetap merepresentasikan total seluruh wishlist.

## Total Item Selesai

```text
completedPrice = SUM(price dari item completed)
```

## Sisa Wishlist

```text
remainingPrice = SUM(price dari item yang belum completed)
```

## Dana Tersedia

```text
savings = jumlah uang yang tersedia
```

## Kekurangan Dana

```text
shortage = max(remainingPrice - savings, 0)
```

## Sisa Dana Setelah Wishlist

```text
surplus = max(savings - remainingPrice, 0)
```

## Progress

Progress berdasarkan **jumlah harga item yang telah selesai**, bukan jumlah item.

```text
progress = completedPrice / totalPrice * 100
```

Jika `totalPrice = 0`, progress = `0%`.

Contoh:

```text
Wishlist:
Laptop       Rp5.000.000 ✓
Mouse        Rp500.000   ✓
Keyboard     Rp1.000.000

Total        Rp6.500.000
Selesai      Rp5.500.000
Tersisa      Rp1.000.000
Tabungan     Rp4.000.000

Progress     84.6%
Status       Dana mencukupi
```

---

# 5. Fitur

## 5.1 Dashboard

Dashboard adalah halaman utama.

Tampilkan ringkasan:

### Total Wishlist

Jumlah seluruh kebutuhan dana.

### Sudah Terpenuhi

Total harga item yang sudah dicentang.

### Masih Dibutuhkan

Total harga item yang belum selesai.

### Tabungan

Jumlah uang yang tersedia.

### Kekurangan

Jika tabungan belum mencukupi wishlist yang tersisa.

### Progress

Progress dalam bentuk progress bar + persentase.

---

# 6. Wishlist CRUD

## Create

User dapat menambahkan item.

Field:

* Nama item — wajib
* Harga — wajib, minimum `0`

Validasi:

* Nama tidak boleh kosong.
* Harga harus angka valid.
* Harga tidak boleh negatif.
* Hindari harga `NaN`, `Infinity`, atau angka tidak valid.

Setelah berhasil:

* item langsung muncul di daftar
* form/dialog ditutup
* summary otomatis diperbarui
* data disimpan ke localStorage

---

## Read

Tampilkan semua wishlist item.

Setiap item minimal menampilkan:

```text
[✓] Nama Item
    Rp1.500.000

    [Edit] [Delete]
```

Status completed harus mudah dibedakan secara visual.

Item completed:

* checkbox aktif
* nama dapat diberi `line-through`
* opacity sedikit diturunkan

Jangan membuat desain terlalu ramai.

---

## Update

User dapat:

* mengubah nama
* mengubah harga
* mengubah status completed

Perubahan langsung memperbarui seluruh perhitungan.

---

## Delete

Gunakan confirmation dialog sebelum menghapus.

Contoh:

> Hapus "Mechanical Keyboard"?

Action:

* Batal
* Hapus

Jangan langsung menghapus tanpa konfirmasi.

---

# 7. Tabungan

User dapat mengatur angka tabungan secara manual.

Contoh:

```text
Tabungan Saat Ini

Rp2.500.000

[Ubah]
```

Saat mengubah:

```text
Jumlah tabungan
[ Rp 2.500.000 ]

[Batal] [Simpan]
```

Validasi:

* angka valid
* tidak boleh negatif
* tidak boleh `NaN`
* tidak boleh `Infinity`

Tabungan hanya satu angka global.

**Tidak perlu fitur transaksi/deposit/withdraw.**

---

# 8. Financial Summary

Dashboard harus membantu user menjawab:

> "Kalau semua wishlist saya ingin dipenuhi, apakah uang saya cukup?"

Gunakan status sederhana:

### Dana Cukup

Jika:

```text
savings >= remainingPrice
```

Tampilkan:

> Dana cukup untuk wishlist yang tersisa.

### Dana Belum Cukup

Jika:

```text
savings < remainingPrice
```

Tampilkan:

> Masih membutuhkan RpX lagi.

Jika semua wishlist sudah selesai:

> Semua wishlist sudah terpenuhi 🎉

---

# 9. Filtering & Sorting

Karena aplikasi harus tetap simpel, gunakan fitur minimal:

### Filter

* Semua
* Belum dibeli
* Sudah dibeli

### Sorting

Minimal:

* Terbaru
* Harga tertinggi
* Harga terendah

Jangan membuat sistem filter kompleks.

---

# 10. Empty State

Jika belum ada wishlist:

```text
Wishlist masih kosong

Tambahkan sesuatu yang ingin kamu capai.

[+ Tambah Wishlist]
```

Jika semua item selesai:

```text
Semua wishlist sudah terpenuhi 🎉
```

---

# 11. UI / UX

## Design Philosophy

Style:

* clean
* modern
* minimal
* compact
* tidak terlalu banyak dekorasi
* fokus pada angka dan wishlist
* mobile-first

Gunakan shadcn/ui.

Komponen yang dapat digunakan:

* Button
* Card
* Input
* Dialog
* AlertDialog
* Checkbox
* Progress
* Badge
* Separator
* DropdownMenu / Select
* Toast / Sonner

Jangan menggunakan semua komponen jika tidak diperlukan.

---

# 12. Mobile First

Prioritas utama adalah smartphone.

Mobile:

```text
Header
↓
Financial Summary
↓
Progress
↓
Filter
↓
Wishlist List
↓
Floating/Add Button
```

Desktop dapat menggunakan layout yang lebih lebar.

Pastikan:

* tombol mudah ditekan
* input tidak terlalu kecil
* harga mudah dibaca
* tidak ada horizontal overflow
* dialog nyaman digunakan di mobile

---

# 13. App Structure

Gunakan struktur modular tetapi jangan over-engineer.

Contoh:

```text
src/
├── components/
│   ├── layout/
│   ├── wishlist/
│   ├── financial/
│   └── ui/
│
├── hooks/
│   └── useWishlist.ts
│
├── lib/
│   ├── storage.ts
│   ├── calculations.ts
│   └── utils.ts
│
├── types/
│   └── wishlist.ts
│
├── App.tsx
├── main.tsx
└── app.css
```

Tidak perlu membuat repository/service architecture yang kompleks.

---

# 14. State Management

Tidak perlu Redux, Zustand, atau state-management library.

Gunakan:

* React `useState`
* React `useMemo`
* React custom hooks jika memang membantu

Semua perhitungan derived data menggunakan `useMemo` jika relevan.

Contoh:

```text
items
savings
    ↓
calculation functions
    ↓
dashboard summary
```

Jangan menyimpan data turunan seperti `totalPrice` ke localStorage.

Hitung dari data utama.

---

# 15. Local Storage

Gunakan satu namespace yang jelas, misalnya:

```text
wishlist-manager:data
```

Contoh:

```ts
{
  items: [],
  savings: 0
}
```

Requirements:

* safe JSON parsing
* handle corrupted localStorage
* fallback ke initial state
* jangan crash jika localStorage tidak tersedia
* simpan perubahan secara otomatis

Jangan menyimpan password/PIN plaintext jika authentication menggunakan PIN.

---

# 16. Security / Privacy

Karena aplikasi bersifat pribadi, gunakan security ringan.

## PIN Lock

Implementasikan optional PIN lock.

Flow pertama:

```text
Belum ada PIN

Buat PIN
[••••]

Konfirmasi PIN
[••••]

[Simpan]
```

Setelah PIN dibuat, ketika membuka aplikasi:

```text
Wishlist Manager

Masukkan PIN
[••••]

[Masuk]
```

### Rules

* PIN minimal 4 digit.
* Jangan menyimpan PIN plaintext.
* Gunakan Web Crypto API untuk hashing jika memungkinkan.
* Jangan menganggap PIN sebagai security tingkat tinggi.
* Setelah reload, aplikasi kembali terkunci.
* Sediakan opsi mengubah PIN.
* Sediakan logout/lock manual.

### Important

Karena aplikasi menggunakan localStorage dan berjalan di browser:

> PIN lock hanya merupakan privacy layer, bukan keamanan setara authentication server.

Jangan membuat backend hanya demi authentication.

---

# 17. Data Recovery

Tambahkan fitur sederhana:

### Export Data

Download wishlist sebagai JSON.

Contoh:

```text
[ Export Data ]
```

### Import Data

User dapat memasukkan JSON hasil export sebelumnya.

Sebelum overwrite data:

```text
Data saat ini akan digantikan.

[ Batal ] [ Import ]
```

Validasi struktur JSON sebelum diterapkan.

Ini penting karena aplikasi menggunakan localStorage.

---

# 18. Currency

Gunakan Rupiah Indonesia.

Format:

```text
Rp1.500.000
```

Gunakan:

```ts
Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
})
```

Jangan menggunakan floating-point calculation untuk operasi finansial yang membutuhkan desimal.

Karena harga hanya menggunakan Rupiah integer, simpan sebagai integer rupiah.

---

# 19. Accessibility

Wajib:

* semantic HTML
* label pada input
* keyboard navigation
* focus state
* dialog dapat ditutup dengan Escape
* button memiliki accessible name
* checkbox memiliki label
* jangan hanya menggunakan warna untuk menunjukkan status

Target minimal:

> UI dapat digunakan dengan keyboard dan screen reader dasar.

---

# 20. Error Handling

Aplikasi tidak boleh crash karena:

* localStorage corrupt
* JSON import invalid
* harga invalid
* tabungan invalid
* data lama memiliki struktur berbeda
* browser private mode/localStorage unavailable

Tampilkan error yang sederhana dan actionable.

Jangan menampilkan stack trace kepada user.

---

# 21. Performance

Karena aplikasi kecil:

* jangan over-optimize
* jangan menggunakan React Query
* jangan menggunakan server state
* jangan membuat API
* jangan menggunakan database
* jangan menggunakan websocket

Target:

* fast initial load
* minimal JavaScript dependency
* tidak ada unnecessary re-render
* build production bersih

---

# 22. Testing

Minimal lakukan:

### Unit Test

Test business logic:

* total harga
* total completed
* remaining
* shortage
* surplus
* progress
* empty wishlist
* semua item completed

### Component / Integration Test

Test:

* create item
* edit item
* delete item
* toggle completed
* update savings
* filter item
* import/export

### Manual Test

Test responsive:

* mobile
* tablet
* desktop

Test:

* refresh halaman
* localStorage persistence
* corrupted storage
* invalid import
* PIN lock
* PIN salah
* PIN benar

---

# 23. Security Checklist

Sebelum dianggap selesai:

* [ ] Tidak ada secret di source code
* [ ] Tidak ada password/PIN plaintext
* [ ] Semua input divalidasi
* [ ] JSON import divalidasi
* [ ] Tidak menggunakan `dangerouslySetInnerHTML`
* [ ] Tidak menyimpan data sensitif yang tidak diperlukan
* [ ] Dependency diperiksa
* [ ] Tidak ada API key client-side
* [ ] Tidak ada external backend
* [ ] Build production berhasil

---

# 24. DESIGN.md

Buat file:

```text
DESIGN.md
```

Dokumen harus menjelaskan design system aplikasi secara singkat.

Isi minimal:

### Design Principles

* Simple
* Clean
* Mobile-first
* Data-focused
* Accessible

### Color

Definisikan semantic color:

* background
* foreground
* primary
* muted
* destructive
* success
* warning

Gunakan CSS variables/Tailwind v4.

### Typography

Tentukan:

* heading
* body
* label
* financial number

### Spacing

Gunakan spacing system Tailwind.

### Components

Dokumentasikan penggunaan:

* Button
* Card
* Dialog
* Input
* Checkbox
* Progress
* Badge

### Responsive

Jelaskan breakpoint dan perubahan layout mobile → desktop.

Jangan membuat design system berlebihan untuk aplikasi kecil.

---

# 25. Tailwind CSS v4

Wajib menggunakan Tailwind CSS v4.

Jangan membuat:

```text
tailwind.config.js
tailwind.config.ts
```

Theme/custom variables ditulis langsung di:

```text
src/app.css
```

Gunakan syntax Tailwind v4 dan CSS variables.

---

# 26. Deployment

Target deployment:

**Vercel**

Requirements:

* production build berhasil
* SPA routing tidak menghasilkan 404 saat refresh
* environment variable tidak diperlukan untuk core application
* deployment dapat dilakukan langsung dari GitHub

Tambahkan dokumentasi deployment di `README.md`.

---

# 27. GitHub

Repository:

`oxydaid/wishlist-manager`

Workflow:

```text
initialize project
↓
implement foundation
↓
implement wishlist
↓
implement financial calculation
↓
implement persistence
↓
implement PIN lock
↓
implement import/export
↓
testing
↓
build verification
↓
README + DESIGN.md
↓
commit
↓
push ke GitHub
```

Gunakan commit yang jelas dan atomic jika memungkinkan.

Jangan push `.env`, secrets, atau file build yang tidak diperlukan.

---

# 28. README.md

README minimal berisi:

* Project description
* Features
* Tech stack
* Installation
* Development
* Build
* Testing
* Deployment Vercel
* Data storage/privacy explanation
* PIN security limitation

---

# 29. Non-Goals

Jangan implementasikan:

* User registration
* OAuth
* Google login
* Email authentication
* Backend
* Database
* API
* Multi-user
* Cloud synchronization
* Payment gateway
* Bank integration
* Real financial account
* Transaction history
* Budget management kompleks
* Notification system
* AI recommendation
* Social features
* Marketplace
* PWA kecuali benar-benar diperlukan

Fitur-fitur tersebut sengaja dikeluarkan agar aplikasi tetap **simple dan maintainable**.

---

# 30. Definition of Done

Aplikasi dianggap selesai jika:

* [ ] React + Vite + TypeScript berjalan
* [ ] shadcn/ui digunakan
* [ ] Tailwind CSS v4 digunakan
* [ ] Tidak ada Tailwind config lama
* [ ] CRUD wishlist berfungsi
* [ ] Checkbox completed berfungsi
* [ ] Total harga otomatis dihitung
* [ ] Total completed otomatis dihitung
* [ ] Remaining otomatis dihitung
* [ ] Savings dapat diubah
* [ ] Shortage/surplus otomatis dihitung
* [ ] Progress otomatis dihitung
* [ ] Filter berfungsi
* [ ] Sorting berfungsi
* [ ] Data persist setelah refresh
* [ ] Corrupt storage ditangani
* [ ] PIN lock berfungsi
* [ ] PIN tidak disimpan plaintext
* [ ] Import/export JSON berfungsi
* [ ] Responsive mobile-first
* [ ] Accessible dasar
* [ ] Unit test business logic tersedia
* [ ] Production build berhasil
* [ ] `README.md` tersedia
* [ ] `DESIGN.md` tersedia
* [ ] Tidak ada secret
* [ ] Siap deploy ke Vercel
* [ ] Perubahan dipush ke `oxydaid/wishlist-manager`

---

# 31. Agent Rules

Agent wajib mengikuti aturan berikut:

1. **Pahami requirement sebelum coding.**
2. Buat implementation plan singkat sebelum implementasi.
3. Jangan menambahkan fitur di luar PRD tanpa alasan kuat.
4. Jangan over-engineer aplikasi sederhana.
5. Prioritaskan readability dan maintainability.
6. Gunakan TypeScript dengan type yang jelas.
7. Hindari duplicate logic.
8. Business calculation harus dipisahkan dari UI.
9. Jangan menyimpan derived state jika dapat dihitung.
10. Semua user input harus divalidasi.
11. Jangan menyimpan secret/PIN plaintext.
12. Gunakan komponen reusable jika memang ada pengulangan.
13. Jangan membuat abstraction hanya untuk terlihat "enterprise".
14. Setelah implementasi jalankan lint/typecheck/test/build.
15. Perbaiki error sebelum dianggap selesai.
16. Pastikan aplikasi tetap berfungsi setelah refresh.
17. Pastikan layout nyaman di mobile.
18. Dokumentasikan keputusan penting di README/DESIGN.md.
19. Jangan menggunakan dependency tambahan tanpa kebutuhan nyata.
20. Hasil akhir harus **simple, clean, secure, production-ready**.

---

# 32. Prioritas Implementasi

Jika harus memilih prioritas:

```text
P0 — Core
├── Wishlist CRUD
├── Price calculation
├── Completed status
├── Savings
└── Local persistence

P1 — UX
├── Dashboard summary
├── Progress
├── Filter
├── Sorting
└── Responsive UI

P2 — Privacy & Recovery
├── PIN lock
├── Import
└── Export

P3 — Quality
├── Testing
├── Accessibility
├── DESIGN.md
├── README.md
└── Production build/deployment
```

**Jangan mengerjakan P2/P3 dengan mengorbankan kualitas P0.**

---

# Final Product Goal

Wishlist Manager harus terasa seperti:

> **"Catatan wishlist pribadi yang sekaligus menjadi kalkulator sederhana untuk mengetahui berapa uang yang dibutuhkan dan apakah tabungan saya sudah cukup."**

Bukan aplikasi finance kompleks.

**Keep it simple. Keep it useful.**
