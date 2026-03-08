# 💰 Smart Expenses Tracker 

Aplikasi pelacak keuangan pribadi berbasis HTML/CSS/JS murni — tanpa framework, tanpa build tools, tanpa dependensi eksternal.

## Fitur

- ➕ Tambah pemasukan & pengeluaran
- 🗂️ Kategorisasi transaksi
- 🔍 Filter & urutkan riwayat
- 📊 Dua donut chart (pengeluaran & pemasukan per kategori)
- 💾 Data tersimpan di `localStorage` (tidak hilang saat refresh)
- 📥 Export ke CSV (UTF-8 BOM — kompatibel dengan Excel)
- ♿ Accessible (ARIA labels, keyboard navigation, live regions)

## Struktur Folder

```
expense-tracker/
├── index.html          # Shell HTML, tidak ada inline CSS/JS
├── css/
│   └── styles.css      # Semua styling (CSS custom properties, animasi)
├── js/
│   ├── constants.js    # Konstanta app (kategori, warna, storage key)
│   ├── storage.js      # Wrapper localStorage (load / save)
│   ├── utils.js        # Pure helper functions (format, parse, escape)
│   ├── ui.js           # Toast, validasi form, category dropdown
│   ├── chart.js        # SVG donut chart renderer
│   ├── render.js       # Fungsi render DOM (dashboard, list, all)
│   ├── events.js       # Setup event listeners, delete, export CSV
│   └── app.js          # Entry point — init() & state object
└── README.md
```

### Urutan load script (penting)

Script di-load secara berurutan di bagian bawah `index.html`. Urutan ini harus dipertahankan karena file-file berikutnya bergantung pada yang sebelumnya:

```
constants → storage → utils → ui → chart → render → events → app
```

## Deploy ke GitHub Pages

1. Buat repository baru di [github.com](https://github.com)
2. Upload seluruh folder ini (pertahankan struktur)
3. Buka **Settings → Pages → Branch: main / (root)** → Save
4. Akses di: `https://<username>.github.io/<repo-name>/`

## Pengembangan Lokal

Cukup buka `index.html` langsung di browser — tidak perlu server.

> **Catatan:** Beberapa browser memblokir `localStorage` pada file `file://`.
> Gunakan ekstensi [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
> di VS Code, atau jalankan:
> ```bash
> npx serve .
> ```

## Konvensi Kode

| Hal | Keputusan |
|-----|-----------|
| State | Satu objek `state` di `app.js`, di-pass by reference ke handler |
| DOM manipulation | `textContent` untuk user input (cegah XSS), `innerHTML` hanya untuk template statis |
| Storage | Semua read/write lewat `storage.js` — mudah diganti ke API lain |
| Style | CSS custom properties untuk semua warna & radius |
| Script loading | Tradisional `<script>` tags (bukan ES modules) agar bisa jalan tanpa server |
