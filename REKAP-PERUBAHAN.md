# Rekap Perubahan Aplikasi Bloemen

Dokumen ini merangkum seluruh perubahan pada fitur **Referensi Desain Bunga** dari awal
sampai akhir, termasuk integrasi foto produk toko dan kemampuan mengirim referensi ke toko.

> Sumber gambar inspirasi: **Wikimedia Commons** (gratis, tanpa API key) + **foto produk
> nyata** dari toko yang terdaftar.

---

## 1. Tujuan Fitur

Halaman **Referensi** (`/reference`) membantu pembeli menemukan inspirasi rangkaian bunga,
lalu mengirim gambar pilihan itu ke toko untuk meminta penawaran harga.

Kemampuan utama:
1. Menampilkan inspirasi bunga dari **Wikimedia Commons**.
2. Pencarian menggunakan **Bahasa Indonesia** (diterjemahkan otomatis untuk Wikimedia).
3. Menampilkan **foto produk nyata** dari toko sebagai gambar utama, disisipkan di
   sela-sela gambar Wikimedia.
4. Mencocokkan foto produk dengan **kata kunci / kategori** pencarian.
5. Setiap gambar (produk maupun Wikimedia) bisa **dikirim ke toko** melalui dialog.

---

## 2. Ringkasan File yang Diubah

| Status | File | Keterangan |
|--------|------|------------|
| 📝 Diubah | `src/app/pages/DesignReference.tsx` | Integrasi foto produk + penyisipan + kirim ke toko |

> Tidak ada file baru yang ditambahkan dan tidak ada file yang dihapus.

---

## 3. Detail Perubahan pada `src/app/pages/DesignReference.tsx`

### 3.1 Import
- Tambah `useMemo` dari React.
- Tambah ikon `Store` dari `lucide-react`.
- Tambah `getAllProducts` dari `../lib/api`.
- Tambah `FLOWER_PLACEHOLDER` dari `../lib/placeholder`.

### 3.2 Perluasan Tipe `DesignImage`
Tipe gambar referensi diperluas agar bisa membawa data produk:

```ts
type DesignImage = WikimediaImage & {
  isProduct?: boolean;   // penanda gambar berasal dari produk toko
  price?: number;        // harga produk
  productId?: string;    // id produk
  shopId?: string;       // id toko pemilik produk
  shopName?: string;     // nama toko
  category?: string;     // kategori produk
};
```

### 3.3 State Baru
- `products` — daftar produk toko yang punya foto.
- `committedQuery` — kata kunci pencarian aktif, dipakai untuk mencocokkan produk.

### 3.4 Ambil Produk (`fetchProducts`)
Mengambil semua produk tersedia yang memiliki `image_url`, dipanggil sekali saat halaman dibuka.

### 3.5 Konversi Produk → Gambar (`productToImage`)
Mengubah objek produk menjadi objek gambar referensi (judul, deskripsi berisi
kategori + harga, nama toko, dsb.).

### 3.6 Pencocokan Produk (`matchProducts`)
Menyaring produk berdasarkan kata kunci **Bahasa Indonesia** pada nama, deskripsi, dan
kategori produk. Jika kata kunci kosong (inspirasi populer), semua produk ditampilkan.

### 3.7 Penyisipan (`interleave`)
Menaruh foto produk sebagai gambar **utama**, muncul lebih dulu lalu tersebar merata di
antara gambar Wikimedia — sehingga produk tidak menumpuk di atas.

### 3.8 Gabungan yang Ditampilkan (`displayImages`)
`useMemo` yang menggabungkan hasil `matchProducts(committedQuery)` dengan
`inspirationImages` (Wikimedia) melalui `interleave`.

### 3.9 Penyetelan `committedQuery`
Nilai `committedQuery` di-set pada:
- Muat inspirasi populer → dikosongkan (`''`).
- Submit pencarian → diisi teks pencarian pengguna.
- Klik chip pencarian populer → diisi term yang diklik.

### 3.10 Tampilan Grid
- Grid merender `displayImages` (bukan lagi hanya `inspirationImages`).
- Kartu **produk** ditandai:
  - Bingkai (ring) warna primary.
  - Badge **"🏪 Produk Toko"** di pojok kiri atas.
  - Deskripsi menampilkan **kategori + harga** (mis. `Wedding • Rp 350.000`).
  - Nama toko saat di-hover.
- **Semua kartu** (produk maupun Wikimedia) → tap membuka dialog **"Kirim Referensi Desain"**
  dan bisa dikirim ke toko mana pun.
- Label bagian diubah menjadi **"Produk Toko + Wikimedia"**.
- Kondisi tombol **"Muat Lebih Banyak"** dan empty-state memakai `displayImages`.

---

## 4. Alur Pengguna (End-to-End)

1. Pembeli membuka halaman **Referensi**.
2. Sistem memuat inspirasi populer dari Wikimedia + semua foto produk toko.
3. Foto produk muncul sebagai gambar utama dengan badge "Produk Toko", disisipkan di
   antara gambar Wikimedia.
4. Pembeli mengetik kata kunci (mis. "wedding", "duka", "bouquet") dalam Bahasa Indonesia:
   - Wikimedia: kata kunci diterjemahkan ke Inggris lalu dicari.
   - Produk: disaring berdasarkan nama/deskripsi/kategori.
5. Pembeli menge-tap salah satu gambar → dialog **"Kirim Referensi Desain"** terbuka.
6. Pembeli memilih toko tujuan → diarahkan ke chat dengan referensi desain terlampir.

---

## 5. Data & Kategori

### Kategori Produk (`src/app/lib/productCategories.ts`)
`Bouquet`, `Hand Bouquet`, `Vas Bunga`, `Bunga Meja`, `Wedding`, `Papan Bunga`,
`Bunga Duka`, `Lainnya`.

### Sumber Data Produk
Fungsi `getAllProducts()` (`src/app/lib/api.ts`) mengambil produk `is_available = true`
beserta relasi toko (`shops`), termasuk field `image_url`, `name`, `price`, `category`.

---

## 6. Cara Menguji

1. Pastikan ada minimal satu produk toko yang memiliki foto.
2. Buka halaman **Referensi**.
3. Foto produk akan tampil dengan bingkai + badge "Produk Toko" di antara foto Wikimedia.
4. Cari nama/kategori produk untuk memverifikasi penyaringan.
5. Tap gambar mana pun → dialog "Kirim Referensi Desain" muncul → pilih toko.

---

## 7. Catatan

- Sumber gambar inspirasi memakai **Wikimedia Commons** yang gratis dan tanpa API key.
- Pencocokan produk memakai kata kunci **Bahasa Indonesia** apa adanya, sedangkan
  pencarian Wikimedia diterjemahkan ke Inggris — keduanya berjalan berdampingan.
- Tidak ada penambahan library/dependensi baru untuk fitur ini.

---

## Pembaruan: Chat Penawaran, Panduan Bunga Hidup, Upload Referensi

| Status | File | Keterangan |
|--------|------|------------|
| 📝 Diubah | `src/app/pages/ChatRoom.tsx` | Pesan + penawaran + event "Deal" digabung dalam 1 timeline kronologis; bar "Pesan" ringkas di atas input; tombol 📎 kirim gambar/referensi |
| 📝 Diubah | `src/app/components/CustomOrderQuote.tsx` | Kartu penawaran jadi bubble chat ringkas + komponen `QuoteDealEvent` |
| ➕ Baru | `src/app/lib/flowerCare.ts` | Data daya tahan 12 jenis bunga + langkah penyimpanan |
| ➕ Baru | `src/app/components/FreshFlowerGuide.tsx` | Kartu "Daya Tahan & Cara Penyimpanan" bunga hidup |
| 📝 Diubah | `src/app/pages/ProductDetail.tsx` | Menampilkan panduan bunga hidup (tipe live/mixed) |
| 📝 Diubah | `src/app/pages/seller/ProductsManagement.tsx` | Tombol "Isi otomatis" cara perawatan; field juga untuk tipe campuran |
| 📝 Diubah | `src/app/pages/PreOrder.tsx` | Catatan ketepatan waktu pengambilan bunga hidup |
| ➕ Baru | `src/app/lib/designReferences.ts` | Upload ke Storage + CRUD tabel `design_references` |
| 📝 Diubah | `src/app/pages/DesignReference.tsx` | Seksi "Referensi Saya": upload, simpan, hapus, kirim ke toko |
| ➕ Baru | `supabase/ADD_UPLOAD_REFERENCE.sql` | Tabel `design_references` + RLS, kolom `messages.image_url`, bucket & policy storage |

### Upload Referensi Langsung ke Toko Tujuan
| Status | File | Keterangan |
|--------|------|------------|
| ➕ Baru | `src/app/components/SendReferenceToShop.tsx` | Dialog upload/pilih referensi + judul & catatan → kirim ke 1 toko |
| 📝 Diubah | `src/app/pages/ShopDetail.tsx` | Tombol "Kirim Referensi" di samping "Chat Toko" |
| 📝 Diubah | `src/app/pages/Shops.tsx` | Tombol "Referensi" di setiap kartu toko |
| 📝 Diubah | `src/app/pages/ChatRoom.tsx` | Referensi dari navigasi (`postAsMessage`) otomatis terkirim sebagai pesan bergambar, sekali saja |
| 📝 Diubah | `src/app/pages/DesignReference.tsx` | "Kirim ke Toko" juga memunculkan gambar di chat |

### Navigasi Kembali & Pencarian
| Status | File | Keterangan |
|--------|------|------------|
| ➕ Baru | `src/app/lib/navigation.ts` | Hook `useGoBack(fallback)`: mundur 1 halaman, atau langsung ke halaman induk bila tidak ada riwayat |
| 📝 Diubah | 17 halaman | `navigate(-1)` → `goBack()` |
| 📝 Diubah | `BottomNavigation.tsx`, `SellerLayout.tsx` | Pindah tab memakai `replace` (riwayat tidak menumpuk) |
| 📝 Diubah | `ProductList.tsx`, `Shops.tsx` | Filter kategori/pencarian memakai `replace` |
| 📝 Diubah | `Login`, `Register`, `ShopRegister`, `PreOrder`, `Payment`, halaman seller | Redirect setelah aksi memakai `replace` |
| 📝 Diubah | `Home.tsx` | Kolom pencarian berfungsi → `/products?q=…` |
| 📝 Diubah | `ProductList.tsx` | Kolom pencarian live (nama, deskripsi, kategori, nama toko) + gabung filter kategori |
| 📝 Diubah | `Shops.tsx` | Kolom pencarian toko (nama, alamat, kota, kategori) |

### Kirim Referensi = Kirim Penawaran (kartu di chat)
| Status | File | Keterangan |
|--------|------|------------|
| 📝 Diubah | `src/app/components/CustomOrderQuote.tsx` | Komponen baru `ReferenceCard` (gaya sama dengan kartu penawaran) |
| 📝 Diubah | `src/app/components/SendReferenceToShop.tsx` | Field Judul* + Catatan + Budget; mode `onSend` untuk dipakai di chat |
| 📝 Diubah | `src/app/pages/ChatRoom.tsx` | Tombol pembeli "Kirim Referensi Desain"; kartu referensi di timeline; penjual "Buat Penawaran" → form terisi otomatis |
| 📝 Diubah | `supabase/ADD_UPLOAD_REFERENCE.sql` | Kolom `messages.message_type` & `messages.metadata` |

### Rapikan Referensi & Chat (revisi pengguna)
| Status | File | Keterangan |
|--------|------|------------|
| 📝 Diubah | `DesignReference.tsx` | Seksi "Toko Bunga Terdekat" dihapus; tambah chip Kategori; dialog Pilih Toko hanya menampilkan toko sesuai kategori referensi |
| ➕ Baru | `src/app/lib/referenceCategory.ts` | Pemetaan kategori produk → kategori toko + deteksi kategori dari kata kunci |
| 📝 Diubah | `ChatRoom.tsx` | Banner gambar referensi (pin) di atas chat dihapus; tombol 📎 diganti tombol ringkas "Referensi"/"Tawarkan" di samping kolom ketik; chat langsung terbuka di pesan terbaru |
| 📝 Diubah | `CustomOrderQuote.tsx` | Kartu referensi: gambar besar di atas, judul, catatan, budget |
| ➕ Baru | `src/app/lib/money.ts` | Input Rupiah berbasis teks (fix "150.000" tersimpan sebagai 150) |
| 📝 Diubah | `SendReferenceToShop.tsx` | Field budget memakai input Rupiah |
