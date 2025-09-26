# React + TypeScript + Vite


1. Cara Menjalankan
- Node.js 18+ (disarankan 20+)
- npm/pnpm/yarn

Developmet
```bash
# pilih salah satu manajer paket
npm install
npm run dev
# buka http://localhost:5173
```

Production Build (lokal)
```bash
npm run build
npm run preview
# buka http://localhost:4173
```

Structur Data
- file Data public/data/shuttles.json
- akses dari kode
```ts
const res = await fetch("/data/shuttles.json");
const shuttles = await res.json();
```

structur json dari public/data/shuttles.json harus
```json
[
  {
    "id": "JKT-BDG-0800-Blue",
    "operator": "Blue Shuttle",
    "origin": "Jakarta",
    "destination": "Bandung",
    "tanggal": "2025-09-26",
    "departures": [
      {
        "id": "BW-01-0700",
        "berangkat": "07:00",
        "tiba": "10:00",
        "durasiMenit": 180,
        "sisaKursi": 8,
        "harga": 120000,
        "pickup": "Slipi",
        "dropoff": "Pasteur"
      },
    ]
  },
```

2. Keputusan Teknis
- Framework: React (SPA) agar navigasi cepat & mudah dideploy ke static hosting.

- Bundler: Vite untuk DX/HMR cepat & build ringan.

- Routing: React Router v6; semua rute disajikan client-side.

- Data: public/data/shuttles.json untuk mematuhi batasan “tanpa backend”. Same-origin → bebas CORS.

- State URL-first: parameter (origin, destination, tanggal, operator, id) dikelola via query string supaya deep-linking dan tombol kembali bekerja konsisten.

- UX Responsif:

- Desktop: <aside> ringkasan sticky.

- Mobile/Tablet (<lg): SimpleSummaryDrawer (tombol → fullscreen).

- A11y: label ARIA (button, drawer), aria-live pada pesan kedaluwarsa, fokus tidak terperangkap (versi simple, tanpa trap).

- Formatting: Intl.NumberFormat('id-ID', { currency: 'IDR', style: 'currency' }) & waktu 24-jam; timezone Asia/Jakarta.

- Fallback Navigasi: Back → history.back() jika aman; jika tidak, rekonstruksi URL /search?...; jika tetap gagal → /.

- Error Handling: try/catch pada fetch, render empty state/toast singkat jika data gagal dimuat.

4.Asumsi

- Data contoh berisi kombinasi origin–destination hanya dari AREAS yang ditentukan.

- Tanggal tersedia dari 26 sampai akhir bulan (demo HRD).

- Tidak ada autentikasi/otorisasi.

- Reservasi tidak benar-benar mengurangi sisaKursi (mock/demo).
