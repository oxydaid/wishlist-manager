# Design System — Wishlist Manager

## 1. Design Principles

* **Simple**: Menghilangkan kompleksitas visual yang tidak diperlukan. Fokus pada pencatatan barang dan perhitungan keuangan.
* **Clean**: Ruang bernapas yang cukup, kontras tinggi, dan hierarki visual yang jelas.
* **Mobile-First**: Dioptimalkan untuk navigasi satu tangan di smartphone, transisi mulus ke tablet dan desktop.
* **Data-Focused**: Angka finansial, status kekurangan dana, dan persentase progress mudah dipindai secara instan.
* **Accessible**: Kontras warna memadai, navigasi keyboard penuh, indikator status redundan (warna + teks/ikon), dan dialog yang dapat ditutup dengan `Escape`.

---

## 2. Color System (Tailwind CSS v4 & CSS Variables)

Aplikasi mendukung tema ganda (Mode Terang & Mode Gelap) yang dapat diaktifkan melalui toggle di bilah navigasi dan tersimpan di `localStorage` (`wishlist-manager:theme`):

* **Mode Terang**: Latar belakang putih/abu-abu bersih dengan aksen emerald pekat untuk keterbacaan tinggi di siang hari.
* **Mode Gelap**: Latar belakang abu-abu pekat/hitam dengan aksen mint emerald neon untuk kenyamanan visual di malam hari.

Dikonfigurasi melalui `src/app.css` menggunakan CSS variables dan custom variant `@custom-variant dark` tanpa file konfigurasi `tailwind.config.js`.

| Semantic Token | Nilai OKLCH / CSS Var | Deskripsi |
| :--- | :--- | :--- |
| `background` | `oklch(0.14 0.005 285)` | Latar belakang kanvas aplikasi |
| `foreground` | `oklch(0.98 0 0)` | Teks utama kontras tinggi |
| `card` | `oklch(0.18 0.006 285)` | Kontainer kartu dan dialog |
| `card-foreground` | `oklch(0.98 0 0)` | Teks di dalam kartu |
| `primary` | `oklch(0.69 0.17 162)` | Emerald mint highlight, tombol utama, progress |
| `primary-foreground`| `oklch(0.12 0.03 162)` | Teks di atas warna primary |
| `secondary` | `oklch(0.24 0.008 285)` | Tab kontrol, background progress bar |
| `muted` | `oklch(0.22 0.008 285)` | Elemen sekunder yang tidak ditekankan |
| `muted-foreground` | `oklch(0.7 0.01 285)` | Keterangan pembantu dan label minor |
| `border` | `oklch(0.26 0.008 285)` | Garis batas komponen dan pemisah |
| `destructive` | `oklch(0.58 0.22 25)` | Warna peringatan hapus data |
| `success` | `oklch(0.69 0.17 162)` | Indikator dana cukup & target tercapai |
| `warning` | `oklch(0.75 0.16 65)` | Indikator kekurangan dana / tabungan belum cukup |

Dikonfigurasi melalui `src/app.css` tanpa file konfigurasi `tailwind.config.js`.

---

## 3. Typography

Menggunakan sistem tipografi native system font sans-serif dengan fitur OpenType teroptimasi untuk angka:

* **Heading**: `text-lg` (18px) hingga `text-xl` (20px), font weight `bold` (700).
* **Body**: `text-sm` (14px), font weight `normal` (400) dan `medium` (500).
* **Label / Keterangan**: `text-xs` (12px) dan `text-[10px]`, font weight `medium` (500).
* **Financial Numbers**: Ditampilkan dengan format Rupiah integer (`Intl.NumberFormat("id-ID")`), weight `bold` (700) untuk keterbacaan instan.

---

## 4. Spacing & Radius

* **Base unit**: Mengikuti skala Tailwind 4 (4px, 8px, 12px, 16px, 24px).
* **Container**: Maksimal lebar `max-w-4xl` (~896px) dengan padding horizontal `px-4`.
* **Border Radius**:
  * Default radius: `0.75rem` (12px - `rounded-xl`) untuk kartu dan modal.
  * Komponen kontrol: `rounded-lg` (8px) untuk tombol dan form input.
  * Tag & badge: `rounded-full` untuk status pill.

---

## 5. UI Components

* **Button**: Variasi `default`, `outline`, `ghost`, `secondary`, `destructive`. Mendukung keyboard focus ring dan active feedback.
* **Card**: Permukaan dengan border halus `border-border` dan background kontras `bg-card`.
* **Dialog & Modal**: Radix UI primitive dengan backdrop blur, transisi halus, escape dismiss, dan penanganan auto-focus.
* **Input**: Tinggi 40px, padding horizontal, ring fokus jelas `ring-ring`. Input numerik menggunakan `inputMode="numeric"`.
* **Checkbox**: Checkbox custom berbasis Radix UI dengan indikator centang tebal dan label yang dapat diklik.
* **Progress**: Progress bar visual persentase pencapaian total wishlist.
* **Badge**: Pill penanda status filter, status tercapai, dan keamanan PIN.

---

## 6. Responsive Layout

* **Mobile (< 640px)**:
  * Layout single-column vertikal.
  * Kartu finansial menggunakan grid 2 kolom.
  * Tombol aksi "+ Tambah Wishlist" melayang di pojok kanan bawah (Floating Action Button).
  * Modal memenuhi lebar layar dengan sudut membulat atas.
* **Tablet & Desktop (>= 640px)**:
  * Kartu finansial melebar menjadi 4 kolom berjejer.
  * Tombol Tambah menyatu di header / toolbar atas.
  * Modal terpusat di tengah layar dengan ukuran compact `sm:max-w-md`.
