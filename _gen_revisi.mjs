import fs from "fs";
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, PageBreak,
} from "docx";

/* ===================== HELPERS ===================== */
const FONT = "Times New Roman";
const ACCENT = "B23A6B";
const GREY = "F2F2F2";

const runs = (text, opts = {}) => new TextRun({ text, font: FONT, size: 22, ...opts });
const p = (text, opts = {}) =>
  new Paragraph({ alignment: opts.align || AlignmentType.JUSTIFIED, spacing: { after: 120, line: 276 },
    children: Array.isArray(text) ? text : [runs(text, opts)] });
const title = (t) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
  children: [new TextRun({ text: t, font: FONT, size: 36, bold: true, color: ACCENT })] });
const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 280, after: 140 },
  children: [new TextRun({ text: t, font: FONT, size: 30, bold: true, color: ACCENT })] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 220, after: 120 },
  children: [new TextRun({ text: t, font: FONT, size: 26, bold: true })] });
const h3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 180, after: 100 },
  children: [new TextRun({ text: t, font: FONT, size: 23, bold: true, italics: true })] });
const h4 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_4, spacing: { before: 140, after: 80 },
  children: [new TextRun({ text: t, font: FONT, size: 22, bold: true })] });
const bullets = (items) => items.map((it) => new Paragraph({ bullet: { level: 0 },
  alignment: AlignmentType.JUSTIFIED, spacing: { after: 50, line: 264 },
  children: Array.isArray(it) ? it : [runs(it)] }));
const numbered = (items) => items.map((it, i) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED, spacing: { after: 40, line: 264 }, indent: { left: 420, hanging: 300 },
  children: [runs(((i + 1) + ". "), { bold: true }), ...(Array.isArray(it) ? it : [runs(it)])] }));
const label = (t) => new Paragraph({ spacing: { after: 40 }, children: [runs(t, { bold: true })] });
const spacer = () => new Paragraph({ spacing: { after: 60 }, children: [runs("")] });
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

const figure = (num, caption, specLines = []) => {
  const box = new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
    new TableRow({ children: [ new TableCell({
      shading: { type: ShadingType.CLEAR, color: "auto", fill: GREY },
      margins: { top: 200, bottom: 200, left: 150, right: 150 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: ("[ TEMPAT GAMBAR " + num + " ]"), font: FONT, size: 22, bold: true, color: "888888" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(sisipkan tangkapan layar / diagram di sini)", font: FONT, size: 18, italics: true, color: "999999" })] }),
      ] }) ] }) ] });
  const cap = new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 80 },
    children: [new TextRun({ text: ("Gambar " + num + " " + caption), font: FONT, size: 20, bold: true })] });
  const out = [box, cap];
  if (specLines.length) {
    out.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Keterangan isi gambar:", font: FONT, size: 20, italics: true, bold: true })] }));
    out.push(...bullets(specLines.map((s) => [runs(s, { size: 20 })])));
  }
  out.push(spacer());
  return out;
};
const tableCaption = (t) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 60 },
  children: [new TextRun({ text: t, font: FONT, size: 20, bold: true })] });
const cell = (content, { width, align } = {}) => new TableCell({
  width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
  margins: { top: 50, bottom: 50, left: 90, right: 90 },
  children: [ new Paragraph({ alignment: align || AlignmentType.LEFT, spacing: { after: 0, line: 250 },
    children: Array.isArray(content) ? content : [new TextRun({ text: String(content), font: FONT, size: 19 })] }) ] });
const headerRow = (headers, widths) => new TableRow({ tableHeader: true, children: headers.map((hd, i) =>
  new TableCell({ width: widths?.[i] ? { size: widths[i], type: WidthType.PERCENTAGE } : undefined,
    shading: { type: ShadingType.CLEAR, color: "auto", fill: ACCENT }, margins: { top: 50, bottom: 50, left: 90, right: 90 },
    children: [ new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: hd, font: FONT, size: 19, bold: true, color: "FFFFFF" })] }) ] })) });
const tbl = (headers, rows, widths) => new Table({ width: { size: 100, type: WidthType.PERCENTAGE },
  borders: {
    top: { style: BorderStyle.SINGLE, size: 4, color: "999999" }, bottom: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
    left: { style: BorderStyle.SINGLE, size: 4, color: "999999" }, right: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "BBBBBB" }, insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "BBBBBB" } },
  rows: [headerRow(headers, widths), ...rows.map((r) => new TableRow({ children: r.map((c, i) => cell(c, { width: widths?.[i] })) }))] });

const C = [];
const push = (...x) => x.forEach((e) => (Array.isArray(e) ? C.push(...e) : C.push(e)));

/* Complete use-case description block (numbered as Tabel 4.1.<no>) */
const ucBlock = (no, uc) => {
  push(tableCaption("Tabel 4.3." + no + " Deskripsi Use Case " + uc.id + " — " + uc.nama));
  const rows = [
    ["Nama Use Case", uc.nama],
    ["Kode", uc.id],
    ["Aktor Utama", uc.aktorUtama],
    ["Aktor Kedua", uc.aktorKedua || "—"],
    ["Deskripsi / Tujuan", uc.tujuan],
    ["Prakondisi", uc.prakondisi],
    ["Kondisi Akhir (Sukses)", uc.sukses],
    ["Kondisi Akhir (Gagal)", uc.gagal],
    ["Trigger", uc.trigger],
    ["Alur Utama", uc.alur.map((s, i) => (i + 1) + ". " + s).join("\n")],
    ["Alur Alternatif / Ekstensi", (uc.ekstensi && uc.ekstensi.length) ? uc.ekstensi.join("\n") : "—"],
  ];
  push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: { style: BorderStyle.SINGLE, size: 4, color: "999999" }, bottom: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "999999" }, right: { style: BorderStyle.SINGLE, size: 4, color: "999999" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "BBBBBB" }, insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "BBBBBB" } },
    rows: [ headerRow(["Atribut", "Keterangan"], [26, 74]),
      ...rows.map(([k, v]) => new TableRow({ children: [
        cell(k, { width: 26 }),
        new TableCell({ width: { size: 74, type: WidthType.PERCENTAGE }, margins: { top: 50, bottom: 50, left: 90, right: 90 },
          children: String(v).split("\n").map((line) => new Paragraph({ spacing: { after: 0, line: 250 },
            children: [new TextRun({ text: line, font: FONT, size: 19 })] })) }),
      ] })) ] }));
  push(spacer());
};

/* ===================== COVER ===================== */
push(title("REVISI LENGKAP BAB III & BAB IV"));
push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
  children: [runs("Rancang Bangun Aplikasi Marketplace Kreativitas Bunga “Bloemen” Berbasis Mobile di Sulawesi Utara", { italics: true, size: 24 })] }));
push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 },
  children: [runs("Natalia Kristiani Pangemanan — 220211060102 — Teknik Informatika, Universitas Sam Ratulangi", { size: 20 })] }));
push(p([
  runs("Dokumen ini merupakan penulisan ulang Bab III dan Bab IV sesuai catatan revisi dosen. "),
  runs("Sesuai arahan revisi, seluruh aktivitas perancangan (Use Case Diagram, Activity Diagram, Entity Relationship Diagram, Model Relasional, serta perancangan antarmuka Low-Fidelity dan High-Fidelity) dipindahkan dari Bab III ke Bab IV pada sub-bab 4.1 Perancangan. ", { bold: true }),
  runs("Bab III kini berisi metodologi pelaksanaan, arsitektur sistem, Data Flow Diagram, analisis kebutuhan, dan rancangan pengujian. Penulisan pada bagian perancangan dibuat lengkap layaknya tutorial pengembangan, namun tetap dalam ragam bahasa skripsi. Setiap gambar ditandai kotak "),
  runs("[ TEMPAT GAMBAR ]", { bold: true }), runs(" beserta keterangan isinya; setiap tabel disajikan utuh. Pengembangan mengikuti metode Prototyping dengan tiga iterasi versi: "),
  runs("v0.1.0 (wireframe)", { bold: true }), runs(" → validasi responden → "),
  runs("v0.2.0 (high-fidelity)", { bold: true }), runs(" → validasi responden → "),
  runs("v0.3.0 (final fungsional)", { bold: true }),
  runs(". Aplikasi dibangun dengan React + TypeScript + Vite + Tailwind CSS v4; backend Supabase (PostgreSQL + Auth + Realtime + Storage); galeri inspirasi menggunakan Wikimedia Commons API; dan dikemas menjadi APK Android via Capacitor."),
]));
push(pageBreak());

/* ===================== BAB III ===================== */
push(h1("BAB III  METODOLOGI PELAKSANAAN"));

push(h2("3.1 Metode Pengembangan Sistem"));
push(p("Penelitian ini menggunakan metode Prototyping. Prototyping adalah pendekatan pengembangan perangkat lunak yang menekankan pembuatan model awal sistem (prototipe) yang dievaluasi bersama pengguna, kemudian disempurnakan secara bertahap berdasarkan umpan balik hingga memenuhi kebutuhan. Metode ini dipilih karena: (1) sebagian kebutuhan pengguna belum sepenuhnya jelas di awal sehingga perlu digali melalui prototipe yang dapat dilihat dan dicoba langsung; (2) keterlibatan pengguna pada setiap iterasi meningkatkan kesesuaian antarmuka dengan kebutuhan nyata; (3) waktu pengerjaan terbatas sehingga perbaikan desain perlu dilakukan secara cepat; serta (4) fleksibel terhadap perubahan kebutuhan selama pengembangan."));
push(p("Metode Prototyping pada penelitian ini mengikuti model prototipe evolusioner (evolutionary prototyping) yang terdiri atas lima tahapan, yaitu: (1) Pengumpulan Kebutuhan (mendengarkan pelanggan/listening to customer); (2) Perancangan Cepat dan Pembangunan Prototipe (quick design & build prototype); (3) Evaluasi Prototipe oleh pengguna (customer test-drives); (4) Perbaikan Prototipe berdasarkan umpan balik yang diulang hingga disepakati; dan (5) Implementasi serta Pengujian sistem akhir. Prototipe yang telah disetujui pada iterasi terakhir dikembangkan lebih lanjut menjadi sistem produksi, bukan dibuang."));
push(...figure("3.1", "Tahapan Metode Prototyping pada penelitian", [
  "Siklus berulang: Pengumpulan Kebutuhan → Perancangan Cepat & Bangun Prototipe → Evaluasi Prototipe oleh pengguna → Perbaikan Prototipe.",
  "Panah umpan balik dari Evaluasi kembali ke Perancangan Cepat membentuk lingkar iterasi (loop) prototipe: Wireframe v0.1.0 → validasi responden → v0.2.0 → validasi responden → v0.3.0 final.",
  "Setelah prototipe disetujui, alur keluar dari lingkar menuju Implementasi & Pengujian sistem akhir.",
]));

push(h2("3.2 Tahapan Penelitian"));
push(p("Agar pelaksanaan terarah, tahapan penelitian dijabarkan sebagai berikut. Tahapan-tahapan ini menjadi acuan urutan penyusunan Bab III (metodologi) dan Bab IV (perancangan, implementasi, dan pengujian)."));
push(...numbered([
  "Identifikasi masalah dan studi literatur.",
  "Pengumpulan data melalui observasi, kuesioner, dan wawancara (tahap Pengumpulan Kebutuhan).",
  "Analisis kebutuhan fungsional dan non-fungsional (dibahas pada §3.5).",
  "Penetapan arsitektur sistem dan pemodelan aliran data dengan DFD (§3.3 dan §3.4).",
  "Perancangan sistem: Use Case Diagram dan deskripsinya, Activity Diagram, ERD, Model Relasional, serta perancangan antarmuka Low-Fidelity (wireframe) dan High-Fidelity (dibahas pada Bab IV §4.1).",
  "Konstruksi/implementasi sistem secara iteratif mengikuti hasil perancangan (Bab IV §4.2–§4.5).",
  "Pengujian sistem (Black-Box) dan pengujian kompatibilitas perangkat (Bab IV §4.7).",
  "Penyusunan dokumentasi dan laporan akhir.",
]));

push(h2("3.3 Arsitektur Sistem (System Overview)"));
push(p("Aplikasi Bloemen dirancang dengan arsitektur tiga lapis (three-tier) berbasis layanan cloud sehingga tidak memerlukan server backend yang dibangun manual."));
push(...figure("3.2", "Diagram Arsitektur Sistem Aplikasi Bloemen", [
  "Lapisan KLIEN: aplikasi Android hasil bungkus Capacitor; di dalamnya React + TypeScript + Tailwind CSS v4, React Router, dan Supabase JS Client.",
  "Lapisan BACKEND (Supabase BaaS): Auth (JWT), PostgreSQL + Row Level Security (RLS), Realtime (WebSocket), Storage (bucket images).",
  "Lapisan EKSTERNAL: Wikimedia Commons REST API untuk galeri inspirasi.",
  "Panah: Klien ⇄ Supabase via HTTPS/REST & WebSocket; Klien → Wikimedia Commons via HTTPS (read-only).",
]));
push(tableCaption("Tabel 3.1 Komponen Arsitektur dan Fungsinya"));
push(tbl(["Lapisan", "Komponen", "Teknologi", "Fungsi"], [
  ["Klien", "Antarmuka mobile", "React + TypeScript + Tailwind v4, Capacitor", "Menampilkan UI & membungkus menjadi APK Android"],
  ["Klien", "Navigasi", "React Router", "Routing antar halaman di sisi klien"],
  ["Backend", "Autentikasi", "Supabase Auth (JWT)", "Registrasi & login multi-peran"],
  ["Backend", "Basis data", "PostgreSQL + RLS", "Menyimpan data & membatasi akses per pengguna"],
  ["Backend", "Realtime", "Supabase Realtime (WebSocket)", "Sinkronisasi chat & notifikasi instan"],
  ["Backend", "Penyimpanan", "Supabase Storage (bucket images)", "Menyimpan foto toko/produk"],
  ["Eksternal", "Galeri inspirasi", "Wikimedia Commons REST API", "Menyediakan gambar referensi desain"],
], [12, 20, 31, 37]));

push(h2("3.4 Diagram Konteks dan Data Flow Diagram (DFD)"));
push(h3("3.4.1 Diagram Konteks (DFD Level 0)"));
push(p("Diagram konteks menggambarkan sistem sebagai satu proses tunggal yang berinteraksi dengan dua entitas eksternal (Konsumen dan Penjual) serta satu sistem eksternal (Wikimedia Commons API)."));
push(...figure("3.3", "Diagram Konteks (DFD Level 0)", [
  "Proses pusat: “0  Sistem Marketplace Bunga Bloemen”.",
  "KONSUMEN → sistem: data registrasi/login, kata kunci pencarian, data pesanan, pesan chat, ulasan.",
  "Sistem → KONSUMEN: katalog, hasil pencarian, status pesanan, notifikasi, balasan chat, galeri inspirasi.",
  "PENJUAL → sistem: data toko, data produk (harga S–XL & diskon), pembaruan status, penawaran kustom.",
  "Sistem → PENJUAL: daftar pesanan, notifikasi, rekap penjualan.",
  "Sistem ⇄ WIKIMEDIA COMMONS API: permintaan kata kunci & respons gambar.",
]));
push(h3("3.4.2 DFD Level 1"));
push(p("DFD Level 1 menguraikan proses tunggal menjadi tujuh proses utama beserta penyimpanan data (data store) pada basis data Supabase."));
push(...figure("3.4", "DFD Level 1 Aplikasi Bloemen", [
  "Proses: 1.0 Autentikasi, 2.0 Kelola Toko, 3.0 Kelola Produk, 4.0 Pencarian & Galeri, 5.0 Pemesanan/Pre-Order, 6.0 Chat & Penawaran, 7.0 Notifikasi & Rekap.",
  "Data store: D1 users, D2 shops, D3 products, D4 preorders & order_items, D5 conversations & messages, D6 reviews, D7 notifications, D8 custom_order_quotes.",
]));
push(tableCaption("Tabel 3.2 Deskripsi Proses DFD Level 1"));
push(tbl(["Kode", "Nama Proses", "Deskripsi", "Data Store"], [
  ["1.0", "Autentikasi", "Registrasi & login (customer/seller), sesi JWT", "D1"],
  ["2.0", "Kelola Toko", "Pendaftaran & pembaruan profil toko", "D2"],
  ["3.0", "Kelola Produk", "CRUD produk, harga S–XL, diskon, detail bunga", "D3"],
  ["4.0", "Pencarian & Galeri", "Pencarian/filter & galeri inspirasi Wikimedia Commons", "D3 (+Wikimedia Commons)"],
  ["5.0", "Pemesanan / Pre-Order", "Pembuatan pesanan, ukuran, jadwal, status", "D4"],
  ["6.0", "Chat & Penawaran", "Percakapan real-time & penawaran kustom", "D5, D8"],
  ["7.0", "Notifikasi & Rekap", "Notifikasi peristiwa & rekap penjualan PDF", "D7, D4"],
], [8, 22, 47, 23]));

push(h2("3.5 Analisis Kebutuhan Sistem"));
push(h3("3.5.1 Kebutuhan Fungsional"));
push(tableCaption("Tabel 3.3 Kebutuhan Fungsional"));
push(tbl(["Kode", "Kebutuhan Fungsional", "Aktor"], [
  ["KF-01", "Registrasi & login dengan pemilihan peran (pembeli/penjual)", "Pembeli, Penjual"],
  ["KF-02", "Menampilkan beranda (sapaan, pencarian, kategori)", "Pembeli"],
  ["KF-03", "Katalog produk dengan pencarian & filter kategori", "Pembeli"],
  ["KF-04", "Daftar & detail toko (kategori, jam buka, lokasi peta)", "Pembeli"],
  ["KF-05", "Detail produk (harga per ukuran S–XL, tipe bunga, durasi PO, ketahanan, perawatan)", "Pembeli"],
  ["KF-06", "Galeri inspirasi Wikimedia Commons (pencarian & pagination)", "Pembeli"],
  ["KF-07", "Pre-order (ukuran, tanggal, pickup/kirim, alamat, catatan)", "Pembeli"],
  ["KF-08", "Riwayat & status pesanan", "Pembeli"],
  ["KF-09", "Chat real-time + lampiran referensi Wikimedia Commons", "Pembeli, Penjual"],
  ["KF-10", "Ulasan & rating setelah pesanan selesai", "Pembeli"],
  ["KF-11", "Pendaftaran & pengaturan toko (kategori, lokasi peta)", "Penjual"],
  ["KF-12", "Kelola produk (CRUD, harga per ukuran, diskon)", "Penjual"],
  ["KF-13", "Kelola pesanan & pembaruan status (pending→delivered)", "Penjual"],
  ["KF-14", "Kirim penawaran harga kustom via chat", "Penjual"],
  ["KF-15", "Dashboard ringkasan & cetak rekap penjualan (PDF)", "Penjual"],
  ["KF-16", "Notifikasi real-time (pesanan, status, penawaran)", "Pembeli, Penjual"],
], [10, 70, 20]));
push(h3("3.5.2 Kebutuhan Non-Fungsional"));
push(tableCaption("Tabel 3.4 Kebutuhan Non-Fungsional"));
push(tbl(["Kode", "Aspek", "Keterangan"], [
  ["KNF-01", "Usability", "Antarmuka mudah dipahami, dapat dioperasikan satu tangan"],
  ["KNF-02", "Responsiveness", "Tata letak responsif di berbagai ukuran layar Android"],
  ["KNF-03", "Performance", "Chat & notifikasi tersinkron < 1 detik (Realtime)"],
  ["KNF-04", "Security", "Autentikasi JWT + RLS membatasi akses data"],
  ["KNF-05", "Portability", "Berjalan pada Android (min. 8.0) via Capacitor"],
  ["KNF-06", "Reliability", "Penanganan kesalahan jaringan & validasi input"],
  ["KNF-07", "Maintainability", "Kode terstruktur per komponen + TypeScript"],
], [10, 26, 64]));

push(h2("3.6 Rancangan Pengujian Sistem"));
push(p("Pengujian dirancang menggunakan Black-Box Testing untuk memvalidasi kebenaran keluaran terhadap masukan tanpa memeriksa kode internal. Skenario uji mencakup seluruh modul, yaitu autentikasi, toko, produk, pencarian, pemesanan, chat & penawaran, ulasan, notifikasi, galeri inspirasi, rekap penjualan, serta kontrol akses berbasis peran. Selain itu dilakukan pengujian kompatibilitas pada beberapa perangkat Android dengan versi sistem operasi dan kapasitas RAM yang berbeda. Hasil pengujian disajikan pada Bab IV §4.7."));
push(pageBreak());

/* ===================== BAB IV ===================== */
push(h1("BAB IV  HASIL DAN PEMBAHASAN"));
push(p("Bab ini menyajikan hasil perancangan dan konstruksi aplikasi Bloemen secara berurutan, lengkap dan rinci layaknya tutorial pengembangan, namun ditulis dalam ragam bahasa skripsi. Sesuai catatan revisi, pembahasan diawali dengan sub-bab Perancangan (§4.1) yang memuat Use Case Diagram, Activity Diagram, Entity Relationship Diagram, Model Relasional, serta perancangan antarmuka Low-Fidelity dan High-Fidelity. Setelah perancangan, disajikan persiapan lingkungan (§4.2), realisasi tiga versi prototipe (§4.3–§4.5), ringkasan antar-versi (§4.6), pengujian (§4.7), dan ringkasan keseluruhan (§4.8)."));

/* =================================================================
   §4.1 PERANCANGAN — pindahan dari Bab III, ditulis bergaya tutorial-skripsi
   ================================================================= */
push(h2("4.1 Perancangan"));
push(p("Tahap perancangan bertujuan menerjemahkan kebutuhan sistem (Bab III §3.5) menjadi model perilaku, model data, dan model antarmuka yang siap diimplementasikan. Langkah-langkah perancangan disusun secara berurutan: (1) memodelkan perilaku sistem melalui Use Case Diagram beserta deskripsi setiap use case; (2) memodelkan alur aktivitas menggunakan Activity Diagram untuk use case utama; (3) memodelkan data secara konseptual hingga fisik melalui Entity Relationship Diagram; (4) menurunkan Model Relasional sebagai jembatan menuju struktur tabel; (5) merancang antarmuka Low-Fidelity (wireframe) yang divalidasi responden; dan (6) menyempurnakan rancangan menjadi High-Fidelity yang juga divalidasi sebelum dijadikan acuan konstruksi."));

/* ---------- 4.1.1 Use Case ---------- */
push(h3("4.1.1 Use Case Diagram"));
push(p("Langkah pertama tahap perancangan ialah mengidentifikasi aktor dan kebutuhan fungsional, kemudian memetakannya ke dalam Use Case Diagram. Aktor pada sistem terdiri atas dua peran, yaitu Konsumen (pembeli) dan Penjual (pemilik toko bunga). Penyusunan diagram dilakukan dengan langkah-langkah berikut:"));
push(...numbered([
  "Mendaftarkan seluruh kebutuhan fungsional dari Bab III §3.5.1 (KF-01 sampai KF-16).",
  "Mengelompokkan kebutuhan tersebut berdasarkan aktor yang berinteraksi langsung.",
  "Menetapkan relasi antar use case: «include» untuk perilaku wajib yang dipanggil bersama, dan «extend» untuk perilaku opsional yang memperluas use case dasar.",
  "Menggambarkan diagram dengan dua swimlane aktor di sisi kiri dan kanan serta batas sistem (system boundary) di tengah.",
  "Memberi kode UC-01 sampai UC-18 pada setiap use case agar dapat dirujuk pada deskripsi, Activity Diagram, dan pengujian.",
]));
push(...figure("4.1", "Use Case Diagram Aplikasi Bloemen", [
  "Aktor KONSUMEN: Registrasi, Login, Cari & Filter Produk, Lihat Detail Produk, Lihat Lokasi Toko (Peta), Lihat Galeri Inspirasi, Melakukan Pre-Order, Lihat Riwayat Pesanan, Chat, Terima/Tolak Penawaran, Beri Ulasan, Kelola Profil.",
  "Aktor PENJUAL: Registrasi, Login, Daftar & Kelola Toko, Kelola Produk, Kelola Pesanan & Status, Kirim Penawaran Kustom, Chat, Lihat Dashboard, Balas Ulasan, Cetak Rekap Penjualan.",
  "«include»: Pre-Order include Pilih Ukuran S–XL; Kelola Produk include Set Harga per Ukuran; Beri Ulasan include Pesanan Selesai.",
  "«extend»: Pre-Order extend Kirim Referensi Gambar; Login extend Lupa Kata Sandi; Chat extend Kirim Penawaran Kustom.",
]));
push(tableCaption("Tabel 4.1 Identifikasi Aktor"));
push(tbl(["Aktor", "Deskripsi"], [
  ["Konsumen (Pembeli)", "Pengguna yang mencari, memesan, berkomunikasi, dan mengulas produk bunga."],
  ["Penjual (Seller)", "Pemilik toko bunga yang mengelola toko, produk, pesanan, penawaran, dan laporan."],
], [25, 75]));
push(tableCaption("Tabel 4.2 Daftar Use Case"));
push(tbl(["Kode", "Use Case", "Aktor"], [
  ["UC-01", "Registrasi", "Pembeli, Penjual"],
  ["UC-02", "Login & Logout", "Pembeli, Penjual"],
  ["UC-03", "Mencari & Memfilter Produk", "Pembeli"],
  ["UC-04", "Melihat Detail Produk", "Pembeli"],
  ["UC-05", "Melihat Lokasi Toko pada Peta", "Pembeli"],
  ["UC-06", "Melihat Galeri Inspirasi (Wikimedia Commons)", "Pembeli"],
  ["UC-07", "Melakukan Pre-Order", "Pembeli"],
  ["UC-08", "Melihat Riwayat & Status Pesanan", "Pembeli"],
  ["UC-09", "Chat Real-time", "Pembeli, Penjual"],
  ["UC-10", "Menerima/Menolak Penawaran Kustom", "Pembeli"],
  ["UC-11", "Memberi Ulasan & Rating", "Pembeli"],
  ["UC-12", "Mengelola Profil", "Pembeli, Penjual"],
  ["UC-13", "Mendaftarkan & Mengelola Toko", "Penjual"],
  ["UC-14", "Mengelola Produk (CRUD, harga S–XL, diskon)", "Penjual"],
  ["UC-15", "Mengelola Pesanan & Memperbarui Status", "Penjual"],
  ["UC-16", "Mengirim Penawaran Kustom", "Penjual"],
  ["UC-17", "Melihat Dashboard & Mencetak Rekap Penjualan", "Penjual"],
  ["UC-18", "Mengelola/Membalas Ulasan", "Penjual"],
], [10, 62, 28]));
push(p("Setelah Use Case Diagram terbentuk, langkah berikutnya ialah menyusun deskripsi lengkap untuk masing-masing use case. Deskripsi memuat aktor, prakondisi, kondisi akhir (sukses/gagal), pemicu (trigger), alur utama, serta alur alternatif/ekstensi. Deskripsi ini menjadi rujukan utama saat menyusun Activity Diagram (§4.1.2) dan skenario pengujian Black-Box (§4.7)."));

const UCS = [
  { id: "UC-01", nama: "Registrasi", aktorUtama: "Pembeli / Penjual", tujuan: "Membuat akun baru beserta peran (pembeli atau penjual).",
    prakondisi: "Aplikasi terbuka dan perangkat terhubung internet.", sukses: "Akun dibuat pada Supabase Auth dan profil tersimpan di tabel users; pengguna diarahkan sesuai peran.",
    gagal: "Validasi gagal atau email sudah terdaftar; sistem menampilkan pesan kesalahan.", trigger: "Pengguna menekan tombol “Daftar”.",
    alur: ["Pengguna membuka halaman Register.", "Pengguna memilih peran melalui toggle Pembeli/Penjual.", "Pengguna mengisi nama, email, nomor telepon, dan kata sandi.", "Sistem memvalidasi format email dan panjang kata sandi.", "Pengguna menekan “Daftar”.", "Sistem membuat akun pada Supabase Auth.", "Sistem menyimpan profil ke tabel users beserta user_type.", "Sistem mengarahkan pembeli ke beranda, atau penjual ke form pendaftaran toko."],
    ekstensi: ["4a. Email sudah terdaftar → tampil pesan “Email terdaftar”.", "4b. Kata sandi terlalu pendek → tampil peringatan validasi."] },
  { id: "UC-02", nama: "Login & Logout", aktorUtama: "Pembeli / Penjual", tujuan: "Memberi akses ke sistem sesuai peran dan mengakhiri sesi.",
    prakondisi: "Pengguna telah memiliki akun.", sukses: "Sesi JWT terbentuk; pengguna masuk ke halaman sesuai peran. Logout mengakhiri sesi.",
    gagal: "Kredensial salah; sistem menolak dan menampilkan pesan.", trigger: "Pengguna menekan “Masuk” atau “Keluar”.",
    alur: ["Pengguna memasukkan email dan kata sandi.", "Sistem memvalidasi kredensial melalui Supabase Auth.", "Sistem membentuk token JWT dan menyimpan sesi (persistSession).", "Sistem mengarahkan ke beranda (pembeli) atau dashboard (penjual).", "Untuk logout, pengguna menekan Keluar; sistem menghapus sesi dan kembali ke Login."],
    ekstensi: ["2a. Kredensial salah → pesan kesalahan login.", "1a. Pengguna menekan “Lupa Kata Sandi” → alur pemulihan kata sandi [extend]."] },
  { id: "UC-03", nama: "Mencari & Memfilter Produk", aktorUtama: "Pembeli", tujuan: "Menemukan produk sesuai kata kunci atau kategori acara.",
    prakondisi: "Pembeli berada pada beranda/katalog.", sukses: "Sistem menampilkan daftar produk yang relevan.", gagal: "Tidak ada hasil; sistem menampilkan pesan kosong.",
    trigger: "Pembeli mengetik kata kunci atau memilih kategori.",
    alur: ["Pembeli memasukkan kata kunci pada kolom pencarian atau memilih kategori (mis. Bouquet, Bunga Duka, Wedding).", "Sistem mengkueri tabel products sesuai kriteria.", "Sistem menampilkan hasil pada katalog."],
    ekstensi: ["3a. Pembeli mengurutkan hasil berdasarkan harga.", "2a. Tidak ada produk → pesan “produk tidak ditemukan”."] },
  { id: "UC-04", nama: "Melihat Detail Produk", aktorUtama: "Pembeli", tujuan: "Melihat informasi lengkap produk termasuk harga per ukuran dan detail bunga.",
    prakondisi: "Pembeli memilih sebuah produk.", sukses: "Halaman detail menampilkan deskripsi, harga per ukuran, diskon, tipe bunga, durasi PO, ketahanan, dan perawatan.", gagal: "Data produk gagal dimuat.",
    trigger: "Pembeli menekan kartu produk.",
    alur: ["Pembeli menekan produk pada katalog.", "Sistem mengambil data produk (termasuk sizes JSONB).", "Pembeli memilih ukuran S/M/L/XL; harga berubah otomatis.", "Sistem menampilkan badge Pre-Order/Diskon bila ada.", "Pembeli dapat menekan “Pre-Order” atau “Chat”."],
    ekstensi: ["3a. Produk tidak memiliki variasi ukuran → tampil harga tunggal."] },
  { id: "UC-05", nama: "Melihat Lokasi Toko pada Peta", aktorUtama: "Pembeli", tujuan: "Melihat posisi toko pada peta untuk memperkirakan jarak.",
    prakondisi: "Toko memiliki koordinat (latitude/longitude).", sukses: "Peta menampilkan penanda lokasi toko.", gagal: "Koordinat tidak tersedia / peta gagal dimuat.",
    trigger: "Pembeli menekan “Lihat Peta” pada halaman toko.",
    alur: ["Pembeli membuka halaman detail toko.", "Pembeli menekan “Lihat Lokasi/Peta”.", "Sistem membaca koordinat toko dan menampilkannya pada komponen peta."],
    ekstensi: ["3a. Koordinat kosong → tampil pesan lokasi belum tersedia."] },
  { id: "UC-06", nama: "Melihat Galeri Inspirasi (Wikimedia Commons)", aktorUtama: "Pembeli", tujuan: "Memperoleh referensi visual rangkaian bunga.",
    prakondisi: "Perangkat terhubung internet.", sukses: "Grid gambar dari Wikimedia Commons tampil sesuai kata kunci.", gagal: "Gambar gagal dimuat karena gangguan koneksi/API.",
    trigger: "Pembeli membuka menu “Referensi Desain”.",
    alur: ["Pembeli membuka halaman Galeri Inspirasi.", "Pembeli mengetik kata kunci (mis. “wedding bouquet”).", "Sistem mengirim permintaan ke Wikimedia Commons API.", "Sistem menampilkan hasil dalam grid dan memuat halaman berikutnya saat di-scroll (pagination)."],
    ekstensi: ["4a. Pembeli menekan “Diskusikan dengan Penjual” → gambar dikirim ke chat penjual [extend]."] },
  { id: "UC-07", nama: "Melakukan Pre-Order", aktorUtama: "Pembeli", tujuan: "Memesan rangkaian bunga dengan ukuran, jadwal, dan metode pickup/kirim.",
    prakondisi: "Pembeli sudah login dan memilih produk.", sukses: "Pesanan tersimpan di preorders dengan nomor ORD-YYYYMMDD-#### berstatus pending; order_items terbentuk.", gagal: "Validasi tanggal gagal / penyimpanan gagal; tampil peringatan.",
    trigger: "Pembeli menekan “Pre-Order” pada detail produk.",
    alur: ["Pembeli memilih ukuran S/M/L/XL [include Pilih Ukuran].", "Sistem menyesuaikan harga sesuai ukuran.", "Pembeli memilih metode pickup atau kirim.", "Pembeli mengisi tanggal pengantaran, alamat, dan catatan khusus.", "Sistem memvalidasi tanggal ≥ durasi PO minimum.", "Pembeli menekan “Konfirmasi”.", "Sistem menyimpan pesanan & order_items, lalu memicu notifikasi ke penjual.", "Sistem menampilkan nomor pesanan."],
    ekstensi: ["4a. Pembeli melampirkan referensi gambar kustom [extend].", "5a. Tanggal tidak valid → peringatan validasi."] },
  { id: "UC-08", nama: "Melihat Riwayat & Status Pesanan", aktorUtama: "Pembeli", tujuan: "Memantau daftar pesanan dan perkembangan statusnya.",
    prakondisi: "Pembeli sudah login dan memiliki pesanan.", sukses: "Daftar pesanan beserta status tampil lengkap.", gagal: "Data pesanan gagal dimuat.",
    trigger: "Pembeli membuka menu “Pesanan Saya”.",
    alur: ["Pembeli membuka halaman My Orders.", "Sistem mengambil data preorders milik pembeli.", "Sistem menampilkan nomor, status, tanggal, dan rincian item.", "Pembeli dapat menekan pesanan untuk melihat detail."],
    ekstensi: ["4a. Pembeli membuka kanal chat dari detail pesanan."] },
  { id: "UC-09", nama: "Chat Real-time", aktorUtama: "Pembeli", aktorKedua: "Penjual", tujuan: "Komunikasi dua arah secara instan terkait produk/pesanan.",
    prakondisi: "Kedua pihak sudah login.", sukses: "Pesan terkirim dan diterima < 1 detik melalui Supabase Realtime.", gagal: "Pesan gagal terkirim karena gangguan koneksi.",
    trigger: "Pengguna menekan ikon “Chat” pada toko/pesanan.",
    alur: ["Pembeli membuka ruang chat dengan penjual.", "Pembeli mengetik dan mengirim pesan.", "Sistem menyimpan pesan ke tabel messages dan memperbarui conversations.", "Penjual menerima notifikasi dan membalas.", "Sistem menampilkan balasan secara real-time."],
    ekstensi: ["2a. Pembeli melampirkan gambar referensi dari Wikimedia Commons [extend].", "4a. Penjual mengirim penawaran kustom [extend, lihat UC-16]."] },
  { id: "UC-10", nama: "Menerima/Menolak Penawaran Kustom", aktorUtama: "Pembeli", tujuan: "Menanggapi penawaran harga kustom dari penjual.",
    prakondisi: "Terdapat penawaran berstatus pending pada chat.", sukses: "Status penawaran menjadi accepted/rejected dan notifikasi terkirim ke penjual.", gagal: "Penawaran kedaluwarsa sebelum ditanggapi.",
    trigger: "Pembeli menerima notifikasi penawaran.",
    alur: ["Pembeli membuka kartu penawaran di ruang chat.", "Pembeli meninjau nama produk, deskripsi, dan harga.", "Pembeli menekan “Terima” atau “Tolak”.", "Sistem memperbarui status pada custom_order_quotes dan mengirim notifikasi ke penjual."],
    ekstensi: ["2a. Waktu berlaku (expires_at) terlampaui → status expired."] },
  { id: "UC-11", nama: "Memberi Ulasan & Rating", aktorUtama: "Pembeli", tujuan: "Memberi penilaian dan komentar atas pesanan yang selesai.",
    prakondisi: "Pesanan berstatus selesai/delivered dan belum diulas [include Pesanan Selesai].", sukses: "Ulasan tersimpan di reviews; rata-rata rating toko diperbarui otomatis.", gagal: "Penyimpanan ulasan gagal.",
    trigger: "Pembeli menekan “Beri Ulasan” pada pesanan selesai.",
    alur: ["Pembeli memilih jumlah bintang (1–5).", "Pembeli menulis komentar dan (opsional) melampirkan foto.", "Pembeli menekan “Kirim Ulasan”.", "Sistem menyimpan ke reviews dan trigger memperbarui rating toko."],
    ekstensi: ["—"] },
  { id: "UC-12", nama: "Mengelola Profil", aktorUtama: "Pembeli / Penjual", tujuan: "Memperbarui data diri/akun pengguna.",
    prakondisi: "Pengguna sudah login.", sukses: "Perubahan profil tersimpan.", gagal: "Perubahan gagal disimpan karena input tidak valid.",
    trigger: "Pengguna membuka menu “Profil”.",
    alur: ["Pengguna membuka halaman Profil.", "Pengguna mengubah nama/nomor telepon/foto.", "Pengguna menekan “Simpan”.", "Sistem memperbarui data pada tabel users."],
    ekstensi: ["—"] },
  { id: "UC-13", nama: "Mendaftarkan & Mengelola Toko", aktorUtama: "Penjual", tujuan: "Membuat dan memperbarui profil toko bunga.",
    prakondisi: "Penjual sudah login.", sukses: "Data toko tersimpan/diperbarui pada tabel shops (is_active = TRUE).", gagal: "Data gagal disimpan.",
    trigger: "Penjual membuka “Daftar Toko” atau “Pengaturan Toko”.",
    alur: ["Penjual mengisi nama, deskripsi, kategori spesialisasi, alamat, jam buka, dan titik lokasi peta.", "Penjual mengunggah foto toko melalui komponen ImageUpload ke Storage (bucket images).", "Sistem menyimpan data ke tabel shops dengan user_id pemilik.", "Sistem menampilkan toko pada marketplace."],
    ekstensi: ["1a. Penjual memperbarui jam operasional/lokasi kapan saja."] },
  { id: "UC-14", nama: "Mengelola Produk (CRUD, Harga S–XL, Diskon)", aktorUtama: "Penjual", tujuan: "Menambah/mengubah/menghapus produk beserta harga per ukuran dan diskon.",
    prakondisi: "Penjual login dan memiliki toko aktif.", sukses: "Data produk tersimpan pada tabel products (sizes JSONB; discount_price dihitung otomatis).", gagal: "Perubahan tidak tersimpan.",
    trigger: "Penjual membuka menu “Produk”.",
    alur: ["Penjual menekan Tambah/Edit Produk.", "Penjual mengunggah foto serta mengisi nama, deskripsi, kategori, tipe bunga, durasi PO, ketahanan, dan perawatan.", "Penjual mengisi harga per ukuran S–XL [include Set Harga].", "Penjual (opsional) mengaktifkan diskon persentase.", "Penjual menyimpan; sistem menghitung discount_price dan menyimpan sizes sebagai JSONB.", "Produk tampil di katalog dengan badge yang sesuai."],
    ekstensi: ["1a. Penjual menghapus produk yang tidak tersedia.", "4a. Diskon dinonaktifkan → discount_price dikosongkan."] },
  { id: "UC-15", nama: "Mengelola Pesanan & Memperbarui Status", aktorUtama: "Penjual", tujuan: "Memproses pesanan masuk dan memperbarui status pengerjaan.",
    prakondisi: "Terdapat pesanan masuk.", sukses: "Status pesanan diperbarui (pending→confirmed→processing→ready→delivered) dan notifikasi terkirim ke pembeli.", gagal: "Pembaruan status gagal.",
    trigger: "Penjual membuka menu “Pesanan”.",
    alur: ["Penjual melihat daftar pesanan masuk.", "Penjual memilih pesanan tertentu.", "Penjual mengubah status melalui tombol/dropdown.", "Sistem memperbarui tabel preorders dan mengirim notifikasi ke pembeli."],
    ekstensi: ["3a. Penjual membatalkan pesanan → status cancelled."] },
  { id: "UC-16", nama: "Mengirim Penawaran Kustom", aktorUtama: "Penjual", aktorKedua: "Pembeli", tujuan: "Memberi penawaran harga untuk pesanan kustom melalui chat.",
    prakondisi: "Terdapat percakapan aktif dengan pembeli.", sukses: "Penawaran tersimpan di custom_order_quotes (pending) dan notifikasi terkirim ke pembeli.", gagal: "Penawaran gagal disimpan/terkirim.",
    trigger: "Penjual menekan “Buat Penawaran” di chat.",
    alur: ["Penjual mengisi nama produk, deskripsi, dan harga; opsional referensi desain.", "Penjual mengirim penawaran.", "Sistem menyimpan ke custom_order_quotes dan mengirim notifikasi tipe quote_received.", "Pembeli menanggapi (lihat UC-10)."],
    ekstensi: ["3a. Penawaran diberi masa berlaku (expires_at)."] },
  { id: "UC-17", nama: "Melihat Dashboard & Mencetak Rekap Penjualan", aktorUtama: "Penjual", tujuan: "Memantau ringkasan bisnis dan mengunduh rekap penjualan PDF.",
    prakondisi: "Penjual login dan memiliki data pesanan.", sukses: "Ringkasan tampil; berkas PDF rekap berhasil dibuat (jsPDF) dan terunduh.", gagal: "PDF gagal dibuat karena data kosong.",
    trigger: "Penjual membuka “Dashboard” / “Rekap Penjualan”.",
    alur: ["Sistem menampilkan total pendapatan, jumlah pesanan, dan produk aktif.", "Penjual membuka menu Rekap Penjualan.", "Penjual memilih rentang waktu.", "Penjual menekan “Cetak PDF”.", "Sistem menyusun tabel rekap dan menghasilkan berkas PDF."],
    ekstensi: ["—"] },
  { id: "UC-18", nama: "Mengelola/Membalas Ulasan", aktorUtama: "Penjual", tujuan: "Melihat ulasan pelanggan pada toko.",
    prakondisi: "Penjual login dan terdapat ulasan.", sukses: "Daftar ulasan tampil; penjual dapat menanggapi.", gagal: "Ulasan gagal dimuat.",
    trigger: "Penjual membuka menu “Ulasan”.",
    alur: ["Penjual membuka halaman Ulasan.", "Sistem menampilkan daftar ulasan beserta rating dan komentar.", "Penjual meninjau masukan pelanggan."],
    ekstensi: ["—"] },
];
UCS.forEach((uc, i) => ucBlock(i + 1, uc));

/* ---------- 4.1.2 Activity Diagram ---------- */
push(h3("4.1.2 Activity Diagram"));
push(p("Setelah seluruh use case dideskripsikan, langkah selanjutnya ialah memodelkan alur aktivitas untuk use case utama menggunakan Activity Diagram. Penyusunan diagram dilakukan dengan langkah-langkah berikut:"));
push(...numbered([
  "Memilih use case utama yang memiliki alur cabang/keputusan yang signifikan.",
  "Menetapkan swimlane sesuai aktor yang terlibat (Pengguna/Pembeli/Penjual dan Sistem).",
  "Menggambarkan titik mulai (start node), aktivitas, percabangan (decision), penggabungan (merge), dan titik akhir (end node).",
  "Mencocokkan setiap aktivitas dengan langkah pada deskripsi use case (§4.1.1).",
]));
const activity = (num, judul, intro, flow) => {
  push(h4(judul));
  if (intro) push(p(intro));
  push(...figure(num, "Activity Diagram " + judul.replace(/^Activity Diagram\s*/i, ""), flow));
};
activity("4.2", "Activity Diagram Registrasi & Login", "Diagram ini menggambarkan alur pembuatan akun dan masuk ke sistem sesuai peran (UC-01 & UC-02).", [
  "Swimlane PENGGUNA dan SISTEM.",
  "Pengguna: buka Register → pilih peran → isi data → submit.",
  "Decision “data valid & email unik?” — jika tidak → tampilkan pesan (kembali ke isi data); jika ya → lanjut.",
  "Sistem: buat akun Auth → simpan profil users → arahkan (pembeli→beranda / penjual→daftar toko). End.",
]);
activity("4.3", "Activity Diagram Cari & Filter Produk", "Diagram ini menggambarkan pencarian dan penyaringan katalog (UC-03).", [
  "Swimlane PEMBELI dan SISTEM.",
  "Pembeli: masukkan kata kunci / pilih kategori.",
  "Sistem: kueri tabel products → decision “ada hasil?” — tidak → tampilkan pesan kosong; ya → tampilkan daftar. End.",
]);
activity("4.4", "Activity Diagram Melakukan Pre-Order", "Diagram ini menggambarkan proses pemesanan dengan validasi tanggal (UC-07).", [
  "Swimlane PEMBELI dan SISTEM.",
  "Pembeli: pilih ukuran → pilih metode pickup/kirim → isi tanggal, alamat, catatan → konfirmasi.",
  "Decision “tanggal ≥ durasi PO?” — tidak → peringatan (kembali ke isi tanggal); ya → lanjut.",
  "Sistem: simpan preorders & order_items → buat notifikasi ke penjual → tampilkan nomor pesanan. End.",
]);
activity("4.5", "Activity Diagram Chat & Penawaran Kustom", "Diagram ini menggambarkan komunikasi real-time dan penawaran harga kustom (UC-09, UC-16, UC-10).", [
  "Swimlane PEMBELI, SISTEM, PENJUAL.",
  "Pembeli kirim pesan → Sistem simpan messages & update conversations (Realtime) → Penjual terima notifikasi.",
  "Penjual buat penawaran → Sistem simpan custom_order_quotes + notifikasi → Pembeli Terima/Tolak → Sistem update status. End.",
]);
activity("4.6", "Activity Diagram Kelola Produk", "Diagram ini menggambarkan penambahan/perubahan produk dengan harga per ukuran dan diskon (UC-14).", [
  "Swimlane PENJUAL dan SISTEM.",
  "Penjual: buka menu Produk → Tambah/Edit → unggah foto & isi detail → isi harga S–XL → decision “aktifkan diskon?”.",
  "Jika ya: isi persentase → Sistem hitung discount_price; jika tidak: lanjut.",
  "Sistem: validasi → simpan products (sizes JSONB) → tampilkan di katalog. End.",
]);
activity("4.7", "Activity Diagram Kelola Pesanan & Status", "Diagram ini menggambarkan pembaruan status pesanan oleh penjual (UC-15).", [
  "Swimlane PENJUAL, SISTEM, PEMBELI.",
  "Penjual: pilih pesanan → ubah status (pending→confirmed→processing→ready→delivered).",
  "Sistem: update preorders → kirim notifikasi → Pembeli menerima pembaruan status. End.",
]);
activity("4.8", "Activity Diagram Memberi Ulasan", "Diagram ini menggambarkan pemberian ulasan setelah pesanan selesai (UC-11).", [
  "Swimlane PEMBELI dan SISTEM.",
  "Decision “pesanan selesai & belum diulas?” — tidak → tombol ulasan nonaktif; ya → lanjut.",
  "Pembeli: pilih bintang → tulis komentar → kirim.",
  "Sistem: simpan reviews → trigger update rating toko. End.",
]);
activity("4.9", "Activity Diagram Cetak Rekap Penjualan", "Diagram ini menggambarkan pembuatan laporan penjualan PDF (UC-17).", [
  "Swimlane PENJUAL dan SISTEM.",
  "Penjual: buka Rekap Penjualan → pilih rentang waktu → tekan Cetak PDF.",
  "Sistem: tarik data preorders → susun tabel rekap → hasilkan PDF (jsPDF) → unduh. End.",
]);

/* ---------- 4.1.3 ERD ---------- */
push(h3("4.1.3 Entity Relationship Diagram (ERD)"));
push(p("Perancangan basis data dilakukan melalui tiga tingkatan model — konseptual, logikal, dan fisik — agar transisi dari konsep menuju struktur tabel PostgreSQL pada Supabase berlangsung tertib. Langkah-langkah penyusunan ERD adalah sebagai berikut:"));
push(...numbered([
  "Mengidentifikasi entitas inti dari hasil analisis kebutuhan dan deskripsi use case.",
  "Menetapkan relasi antar entitas (1–1, 1–N, N–N) beserta partisipasinya.",
  "Menambahkan atribut, primary key, dan foreign key pada model logikal.",
  "Menerjemahkan model logikal menjadi model fisik dengan tipe data PostgreSQL (UUID, TEXT, JSONB, dst.).",
]));
push(h4("a. Model Konseptual"));
push(p("Model konseptual memetakan entitas dan relasinya pada tingkat tinggi tanpa atribut. Sepuluh entitas inti yang teridentifikasi adalah: Users, Shops, Products, Preorders, Order_Items, Conversations, Messages, Reviews, Notifications, dan Custom_Order_Quotes."));
push(...figure("4.10", "ERD Konseptual Aplikasi Bloemen", [
  "Kotak entitas tanpa atribut: Users, Shops, Products, Preorders, Order_Items, Conversations, Messages, Reviews, Notifications, Custom_Order_Quotes.",
  "Relasi: Users 1–1 Shops; Shops 1–N Products; Users 1–N Preorders; Shops 1–N Preorders.",
  "Preorders 1–N Order_Items; Products 1–N Order_Items; Users N–N Conversations; Conversations 1–N Messages.",
  "Preorders 1–1 Reviews; Users 1–N Notifications; Conversations 1–N Custom_Order_Quotes.",
]));
push(h4("b. Model Logikal"));
push(p("Model logikal menambahkan atribut, primary key (PK), dan foreign key (FK) pada setiap entitas, namun belum terikat pada DBMS tertentu."));
push(tableCaption("Tabel 4.4 Model Logikal — Entitas, Atribut, dan Relasi"));
push(tbl(["Entitas", "Atribut Utama", "Kunci", "Relasi"], [
  ["Users", "id, email, name, user_type, phone, avatar_url", "PK: id", "1–1 Shops; 1–N Preorders/Reviews/Notifications/Messages"],
  ["Shops", "id, user_id, name, description, address, city, phone, opening_hours, image_url, latitude, longitude, categories, rating, is_active", "PK: id; FK: user_id", "N–1 Users; 1–N Products/Preorders/Reviews"],
  ["Products", "id, shop_id, user_id, name, description, price, sizes, stock, category, image_url, is_pre_order, discount_percentage, discount_price, flower_type, po_duration_days, flower_lifetime_days, care_instructions", "PK: id; FK: shop_id, user_id", "N–1 Shops; 1–N Order_Items"],
  ["Preorders", "id, order_number, user_id, shop_id, delivery_date, delivery_address, special_requests, total_amount, status, payment_status, design_reference_url", "PK: id; FK: user_id, shop_id", "1–N Order_Items; 1–1 Reviews"],
  ["Order_Items", "id, preorder_id, product_id, product_name, product_price, quantity, subtotal", "PK: id; FK: preorder_id, product_id", "N–1 Preorders & Products"],
  ["Conversations", "id, user1_id, user2_id, shop_id, last_message, last_message_at, unread_count", "PK: id; FK: user1_id, user2_id, shop_id", "1–N Messages & Custom_Order_Quotes"],
  ["Messages", "id, conversation_id, sender_id, receiver_id, shop_id, message, is_read", "PK: id; FK: conversation_id, sender_id, receiver_id", "N–1 Conversations"],
  ["Reviews", "id, order_id, shop_id, user_id, rating, comment, images", "PK: id; FK: order_id, shop_id, user_id", "1–1 Preorders; N–1 Users/Shops"],
  ["Notifications", "id, user_id, type, title, message, is_read, quote_id", "PK: id; FK: user_id", "N–1 Users"],
  ["Custom_Order_Quotes", "id, conversation_id, shop_id, seller_id, buyer_id, product_name, price, design_reference_url, status, expires_at", "PK: id; FK: conversation_id, seller_id, buyer_id", "N–1 Conversations"],
], [13, 40, 23, 24]));
push(h4("c. Model Fisik"));
push(p("Model fisik menggambarkan struktur tabel pada PostgreSQL/Supabase dengan tipe data yang sesungguhnya, di mana primary key menggunakan UUID dan variasi harga ukuran disimpan sebagai JSONB."));
push(...figure("4.11", "ERD Fisik — Struktur Tabel Supabase", [
  "Sepuluh tabel dengan kolom & tipe data sesuai Tabel 4.6–4.10.",
  "Garis FK: shops.user_id→users; products.shop_id→shops; preorders.user_id→users & shop_id→shops; order_items.preorder_id→preorders & product_id→products; messages.conversation_id→conversations; reviews.order_id→preorders; custom_order_quotes.conversation_id→conversations.",
]));

/* ---------- 4.1.4 Model Relasional ---------- */
push(h3("4.1.4 Model Relasional"));
push(p("Setelah ERD selesai, dilakukan transformasi ke Model Relasional untuk menyajikan skema dalam notasi relasi. Notasi yang digunakan ialah relasi(atribut1, atribut2, …) dengan garis bawah pada primary key dan tanda asterisk pada foreign key. Langkah transformasinya sebagai berikut:"));
push(...numbered([
  "Setiap entitas pada ERD diubah menjadi satu relasi (tabel).",
  "Relasi 1–1 (Users–Shops, Preorders–Reviews) diwujudkan dengan FK pada salah satu sisi yang diberi atribut UNIQUE.",
  "Relasi 1–N diwujudkan dengan FK pada sisi N (mis. products.shop_id, preorders.user_id, preorders.shop_id).",
  "Relasi N–N pada percakapan diwujudkan dengan tabel Conversations yang memuat user1_id dan user2_id.",
  "Atribut multinilai (mis. images pada ulasan, kategori spesialisasi toko) direpresentasikan sebagai TEXT[] (array) PostgreSQL.",
  "Atribut komposit harga per ukuran direpresentasikan sebagai kolom JSONB sizes pada relasi Products.",
]));
push(tableCaption("Tabel 4.5 Skema Relasional Aplikasi Bloemen (PK digarisbawahi, FK bertanda *)"));
push(tbl(["Relasi", "Notasi Skema"], [
  ["Users", "users(id, email, name, user_type, phone, avatar_url, created_at, updated_at)"],
  ["Shops", "shops(id, *user_id, name, description, address, city, phone, email, opening_hours, image_url, latitude, longitude, categories, rating, total_reviews, is_active)"],
  ["Products", "products(id, *shop_id, *user_id, name, description, category, price, sizes, stock, image_url, is_pre_order, is_available, discount_percentage, discount_price, is_on_discount, flower_type, po_duration_days, flower_lifetime_days, care_instructions)"],
  ["Preorders", "preorders(id, order_number, *user_id, *shop_id, delivery_date, delivery_address, special_requests, total_amount, status, payment_status, design_reference_url, design_title, design_description)"],
  ["Order_Items", "order_items(id, *preorder_id, *product_id, product_name, product_price, quantity, subtotal)"],
  ["Conversations", "conversations(id, *user1_id, *user2_id, *shop_id, last_message, last_message_at, unread_count_user1, unread_count_user2)"],
  ["Messages", "messages(id, *conversation_id, *sender_id, *receiver_id, *shop_id, message, is_read, created_at)"],
  ["Reviews", "reviews(id, *order_id, *shop_id, *user_id, rating, comment, images)"],
  ["Notifications", "notifications(id, *user_id, type, title, message, is_read, *quote_id, created_at)"],
  ["Custom_Order_Quotes", "custom_order_quotes(id, *conversation_id, *shop_id, *seller_id, *buyer_id, product_name, description, price, design_reference_url, status, expires_at)"],
], [22, 78]));
push(p("Untuk memperjelas struktur fisik tabel hasil model relasional, lima tabel pendukung berikut menyajikan kolom, tipe data, dan keterangan setiap atribut."));
const physTable = (cap, rows) => { push(tableCaption(cap)); push(tbl(["Kolom", "Tipe Data", "Keterangan"], rows, [34, 28, 38])); push(spacer()); };
physTable("Tabel 4.6 Struktur Tabel users", [
  ["id", "UUID", "PK, refer auth.users(id)"], ["email", "TEXT (UNIQUE)", "Email pengguna"], ["name", "TEXT", "Nama"],
  ["user_type", "TEXT (CHECK)", "'customer' / 'seller'"], ["phone", "TEXT", "Telepon (opsional)"],
  ["avatar_url", "TEXT", "Foto profil"], ["created_at / updated_at", "TIMESTAMPTZ", "Waktu"],
]);
physTable("Tabel 4.7 Struktur Tabel shops", [
  ["id", "UUID", "PK"], ["user_id", "UUID", "FK→users.id, UNIQUE"], ["name/description/address/city", "TEXT", "Identitas & alamat"],
  ["phone/email/opening_hours", "TEXT", "Kontak & jam buka"], ["image_url", "TEXT", "Foto toko (Storage)"],
  ["latitude/longitude", "DECIMAL", "Koordinat peta"], ["categories", "TEXT[]", "Kategori spesialisasi"],
  ["rating/total_reviews", "DECIMAL/INTEGER", "Akumulasi ulasan"], ["is_active", "BOOLEAN", "Status toko"],
]);
physTable("Tabel 4.8 Struktur Tabel products", [
  ["id", "UUID", "PK"], ["shop_id/user_id", "UUID", "FK→shops/users"], ["name/description/category", "TEXT", "Info produk"],
  ["price", "DECIMAL(12,2)", "Harga dasar"], ["sizes", "JSONB", "Harga per ukuran {S,M,L,XL}"], ["stock", "INTEGER", "Stok"],
  ["image_url", "TEXT", "Foto produk"], ["is_pre_order/is_available", "BOOLEAN", "Pre-order & ketersediaan"],
  ["discount_percentage/discount_price/is_on_discount", "INTEGER/DECIMAL/BOOLEAN", "Diskon (discount_price via trigger)"],
  ["flower_type", "TEXT (CHECK)", "'live'/'artificial'/'mixed'"], ["po_duration_days/flower_lifetime_days", "INTEGER", "Durasi PO & ketahanan"],
  ["care_instructions", "TEXT", "Perawatan"],
]);
physTable("Tabel 4.9 Struktur Tabel preorders & order_items", [
  ["preorders.id", "UUID", "PK"], ["order_number", "TEXT (UNIQUE)", "ORD-YYYYMMDD-#### (trigger)"], ["user_id/shop_id", "UUID", "FK→users/shops"],
  ["delivery_date", "DATE", "Tanggal pengantaran/pickup"], ["delivery_address", "TEXT", "Alamat"], ["special_requests", "TEXT", "Catatan"],
  ["total_amount", "DECIMAL(12,2)", "Total biaya"], ["status", "TEXT (CHECK)", "pending/confirmed/processing/ready/delivered/cancelled"],
  ["payment_status", "TEXT (CHECK)", "unpaid/paid/refunded"], ["design_reference_url/title/description", "TEXT", "Referensi desain (opsional)"],
  ["order_items.id", "UUID", "PK"], ["preorder_id", "UUID", "FK→preorders.id"], ["product_id", "UUID", "FK→products.id (SET NULL)"],
  ["product_name/product_price", "TEXT/DECIMAL", "Snapshot produk"], ["quantity/subtotal", "INTEGER/DECIMAL", "Jumlah & subtotal"],
]);
physTable("Tabel 4.10 Struktur Tabel conversations, messages, reviews, notifications, custom_order_quotes", [
  ["conversations.id", "UUID", "PK"], ["user1_id/user2_id/shop_id", "UUID", "FK→users/shops"],
  ["last_message/last_message_at", "TEXT/TIMESTAMPTZ", "Pesan terakhir"], ["unread_count_user1/2", "INTEGER", "Belum dibaca"],
  ["messages.id", "UUID", "PK"], ["conversation_id/sender_id/receiver_id", "UUID", "FK relasi pesan"], ["message/is_read", "TEXT/BOOLEAN", "Isi & status baca"],
  ["reviews.id", "UUID", "PK; order_id UNIQUE"], ["reviews.order_id/shop_id/user_id", "UUID", "FK relasi ulasan"],
  ["reviews.rating/comment/images", "INTEGER/TEXT/TEXT[]", "1–5, komentar, foto"], ["notifications.id/user_id", "UUID", "PK/FK→users"],
  ["notifications.type/title/message/is_read", "TEXT/BOOLEAN", "Jenis & isi"], ["quotes.id", "UUID", "PK"],
  ["quotes.conversation_id/seller_id/buyer_id/shop_id", "UUID", "FK relasi penawaran"], ["quotes.product_name/price/status", "TEXT/DECIMAL/TEXT", "Detail & status"],
]);

/* ---------- 4.1.5 Wireframe Low-Fidelity ---------- */
push(h3("4.1.5 Perancangan Antarmuka Low-Fidelity (Wireframe — Versi 0.1.0)"));
push(p("Mengikuti tahap Perancangan Cepat dan Pembangunan Prototipe pada metode Prototyping, perancangan antarmuka dilakukan secara iteratif. Iterasi pertama menghasilkan wireframe low-fidelity (v0.1.0) yang berupa kerangka hitam-putih tanpa warna/branding. Tujuannya memvalidasi struktur tata letak, hierarki informasi, dan alur navigasi sebelum mengembangkan tampilan detail. Langkah-langkah penyusunan wireframe sebagai berikut:"));
push(...numbered([
  "Mengidentifikasi layar utama yang diperlukan dari daftar use case (§4.1.1).",
  "Menyusun sketsa setiap layar dengan kotak abu-abu sebagai placeholder gambar dan garis sebagai placeholder teks.",
  "Memastikan elemen interaktif (search bar, tombol, picker ukuran, dll.) ditempatkan pada posisi yang konsisten antar layar.",
  "Menyusun alur navigasi antar layar mengikuti Activity Diagram (§4.1.2).",
  "Menguji wireframe kepada responden (calon pembeli dan penjual) untuk memperoleh umpan balik.",
]));
push(label("Layar yang dirancang pada v0.1.0:"));
push(...bullets([
  "Wireframe Beranda (search bar, kategori, daftar toko/produk).",
  "Wireframe Katalog & Pencarian/Filter.",
  "Wireframe Detail Produk (placeholder gambar, ukuran, harga).",
  "Wireframe Formulir Pre-Order.",
  "Wireframe Ruang Chat.",
  "Wireframe Dashboard Penjual.",
]));
push(...figure("4.12", "Wireframe Beranda — Versi 0.1.0", ["Kerangka low-fidelity: kotak abu-abu untuk gambar, garis untuk teks, posisi search bar di atas, baris kategori, dan daftar kartu produk."]));
push(...figure("4.13", "Wireframe Detail Produk & Pre-Order — Versi 0.1.0", ["Kerangka: area foto produk, pemilih ukuran S–XL, label harga, tombol Pre-Order; formulir tanggal/alamat/catatan."]));
push(...figure("4.14", "Wireframe Dashboard Penjual — Versi 0.1.0", ["Kerangka: kartu metrik, menu sidebar (Toko, Produk, Pesanan, Chat, Rekap)."]));
push(label("Validasi Responden v0.1.0:"));
push(p("Wireframe diujikan kepada responden dengan pertanyaan pokok “apakah struktur dan alur sudah sesuai kebutuhan?”. Ringkasan umpan balik dan tindak lanjut perbaikannya disajikan pada Tabel 4.11."));
push(tableCaption("Tabel 4.11 Umpan Balik Responden & Tindak Lanjut — v0.1.0"));
push(tbl(["No", "Umpan Balik Responden", "Tindak Lanjut (→ v0.2.0)"], [
  ["1", "Kategori produk belum terlihat jelas di beranda", "Menambah baris ikon kategori yang menonjol di beranda"],
  ["2", "Belum jelas perbedaan produk Ready Stock dan Pre-Order", "Menambah penanda/badge status pada kartu produk"],
  ["3", "Alur pemilihan ukuran dan perubahan harga belum tergambar", "Menegaskan size picker dengan harga yang berubah dinamis"],
  ["4", "Lokasi toko sulit diperkirakan", "Menambah tampilan peta lokasi pada detail toko"],
  ["5", "Tampilan masih polos sehingga sulit dinilai", "Melanjutkan ke prototipe high-fidelity berwarna (v0.2.0)"],
], [6, 47, 47]));
push(p("Kesimpulan iterasi: berdasarkan umpan balik tersebut, wireframe v0.1.0 dinilai belum sepenuhnya sesuai, sehingga dilakukan perbaikan dan dilanjutkan ke perancangan high-fidelity pada versi 0.2.0."));

/* ---------- 4.1.6 High-Fidelity ---------- */
push(h3("4.1.6 Perancangan Antarmuka High-Fidelity (Versi 0.2.0 dan Versi 0.3.0)"));
push(p("Iterasi berikutnya menyempurnakan wireframe menjadi rancangan high-fidelity. Langkah-langkah perancangan high-fidelity dilakukan sebagai berikut:"));
push(...numbered([
  "Menetapkan skema warna primer (aksen merah muda B23A6B), tipografi, dan komponen ikonografi (lucide-react).",
  "Menerjemahkan setiap wireframe menjadi mockup berwarna lengkap dengan badge, ilustrasi placeholder, dan komponen kontrol.",
  "Mengakomodasi seluruh umpan balik pada Tabel 4.11 (kategori menonjol, badge Pre-Order/Diskon, size picker dinamis, peta lokasi).",
  "Menguji prototipe kepada responden untuk memvalidasi kejelasan navigasi, kesesuaian tampilan, dan kelengkapan fitur.",
  "Melakukan iterasi akhir menjadi versi final (v0.3.0) yang memuat seluruh fitur fungsional sebagai acuan konstruksi.",
]));
push(...figure("4.15", "Diagram Alur Iterasi Perancangan Antarmuka", [
  "Mulai → Identifikasi Kebutuhan → Wireframe v0.1.0 → Validasi Responden → Decision “desain sesuai?”.",
  "Jika TIDAK → catat umpan balik (Tabel 4.11/4.13) → Desain ulang → High-Fidelity v0.2.0 → Validasi Responden → Decision.",
  "Jika masih belum → iterasi → Desain Final v0.3.0 → Validasi Responden akhir → Jika YA → lanjut Konstruksi (§4.3–§4.5).",
]));
push(h4("a. Versi 0.2.0 — High-Fidelity Awal"));
push(...figure("4.16", "Prototipe Beranda — Versi 0.2.0", ["Tampilan berwarna: sapaan personal, search bar, baris ikon kategori (Bouquet, Wedding, Bunga Duka, dll.), kartu produk dengan badge."]));
push(...figure("4.17", "Prototipe Detail Produk & Pre-Order — Versi 0.2.0", ["Foto produk, size picker S–XL dengan harga dinamis, badge Pre-Order/Diskon, formulir pre-order dengan pilihan pickup/kirim."]));
push(...figure("4.18", "Prototipe Ruang Chat — Versi 0.2.0", ["Gelembung pesan dua arah, kolom input, indikator pesan, tombol lampiran referensi."]));
push(label("Validasi Responden v0.2.0:"));
push(p("Prototipe v0.2.0 diujikan kembali kepada responden. Hasil umpan balik dan tindak lanjut perbaikannya disajikan pada Tabel 4.12."));
push(tableCaption("Tabel 4.12 Umpan Balik Responden & Tindak Lanjut — v0.2.0"));
push(tbl(["No", "Umpan Balik Responden", "Tindak Lanjut (→ v0.3.0)"], [
  ["1", "Pembeli ingin referensi desain langsung di aplikasi", "Menambah galeri inspirasi Wikimedia Commons dengan pencarian & pagination"],
  ["2", "Negosiasi pesanan kustom masih manual", "Menambah fitur penawaran harga kustom (custom order quote) di chat"],
  ["3", "Belum ada mekanisme reputasi/penilaian toko", "Menambah ulasan & rating beserta perhitungan rating otomatis"],
  ["4", "Penjual butuh laporan penjualan yang dapat dicetak", "Menambah dashboard ringkasan & cetak rekap penjualan PDF"],
  ["5", "Dropdown notifikasi kurang nyaman di layar kecil", "Memperbaiki tata letak notifikasi agar responsif di mobile"],
], [6, 47, 47]));
push(p("Kesimpulan iterasi: sebagian besar tampilan dinilai sudah sesuai, namun masih diperlukan penambahan fitur fungsional, sehingga dilanjutkan ke versi final 0.3.0."));
push(h4("b. Versi 0.3.0 — Desain Final"));
push(...figure("4.19", "Desain Final Beranda & Katalog — Versi 0.3.0", ["Tampilan final konsumen dengan kategori, pencarian, dan kartu produk berbadge."]));
push(...figure("4.20", "Desain Final Galeri Inspirasi & Chat — Versi 0.3.0", ["Grid galeri Wikimedia Commons dengan tombol “Diskusikan dengan Penjual”; ruang chat dengan kartu penawaran kustom."]));
push(...figure("4.21", "Desain Final Dashboard & Rekap Penjualan — Versi 0.3.0", ["Dashboard metrik penjual dan halaman rekap penjualan dengan tombol Cetak PDF."]));
push(label("Validasi Responden v0.3.0:"));
push(p("Pada validasi akhir, responden menilai desain final telah sesuai kebutuhan baik dari sisi pembeli maupun penjual, sehingga desain dinyatakan disetujui dan siap memasuki tahap konstruksi pada §4.3–§4.5."));
push(tableCaption("Tabel 4.13 Ringkasan Evolusi Antar-Versi Perancangan"));
push(tbl(["Versi", "Jenis", "Cakupan Utama", "Hasil Validasi"], [
  ["0.1.0", "Wireframe low-fidelity", "Struktur tata letak & alur navigasi", "Perlu perbaikan → lanjut"],
  ["0.2.0", "Prototipe high-fidelity", "Warna, komponen, size picker, peta, badge", "Sebagian sesuai → tambah fitur"],
  ["0.3.0", "Final fungsional", "Galeri Wikimedia Commons, penawaran kustom, ulasan, rekap PDF, notifikasi responsif", "Disetujui → konstruksi"],
], [9, 22, 47, 22]));

/* =================================================================
   §4.2 Persiapan Lingkungan Pengembangan
   ================================================================= */
push(h2("4.2 Persiapan Lingkungan Pengembangan"));
push(label("Hasil:"));
push(p("Lingkungan pengembangan disiapkan menggunakan Visual Studio Code dengan runtime berbasis Node. Proyek diinisialisasi memakai Vite dengan template react-ts, sehingga seluruh kode ditulis dalam TypeScript. Dependensi dasar kemudian dipasang."));
push(...numbered([
  "Membuka VS Code dan menyiapkan direktori kerja proyek.",
  "Menjalankan inisialisasi proyek Vite dengan template react-ts (nama proyek: bunga-kreativitas).",
  "Memasang dependensi dasar serta pustaka pendukung (Supabase JS Client, Tailwind CSS v4, lucide-react, motion, jsPDF).",
]));
push(...figure("4.22", "Terminal VS Code & inisialisasi proyek Vite (react-ts)", ["Terminal menampilkan perintah pembuatan proyek dan proses instalasi dependensi."]));
push(label("Pembahasan:"));
push(p("Pemilihan Vite dan TypeScript mendukung prinsip Prototyping: hot-reload mempercepat pembuatan dan perbaikan prototipe, dan static typing menekan kesalahan sejak dini sehingga perubahan antar-versi prototipe dilakukan dengan aman."));

push(h2("4.3 Realisasi Versi 0.1.0 — Kerangka & Navigasi"));
push(label("Hasil:"));
push(p("Versi 0.1.0 merealisasikan kerangka aplikasi dari wireframe (§4.1.5) menjadi kode: struktur folder, sistem routing, dan halaman-halaman kosong (placeholder) sesuai alur navigasi yang telah divalidasi responden."));
push(...numbered([
  "Membentuk struktur folder src/app (components, pages, lib, contexts).",
  "Menyusun routing terpusat pada routes.tsx menggunakan react-router.",
  "Membuat halaman placeholder: Beranda, Katalog, Detail Produk, Pre-Order, Chat, dan Dashboard.",
]));
push(...figure("4.23", "Definisi routing pada routes.tsx (v0.1.0)", ["Daftar rute publik (“/”, shops, shops/:id, products/:productId, preorder/:shopId, design-reference, messages, chat/:shopId) dan grup seller (products, orders, sales-report, dll.)."]));
push(label("Pembahasan:"));
push(p("Realisasi kerangka ini memvalidasi alur navigasi hasil wireframe secara langsung dalam bentuk kode, sekaligus menjadi fondasi penambahan fitur pada versi berikutnya. Dynamic routing (mis. :id, :productId) memungkinkan konten ditampilkan sesuai data terpilih (mendukung KF-04 dan KF-05)."));

push(h2("4.4 Realisasi Versi 0.2.0 — Fitur Inti"));
push(p("Versi 0.2.0 menambahkan fungsionalitas inti: basis data, autentikasi, pengelolaan toko & produk, pemesanan, chat, dan notifikasi. Setiap modul disajikan beserta pembahasannya."));
const modul = (sec, no, judul, langkah, gambarList, pembahasan) => {
  push(h3(sec + "." + no + " " + judul));
  push(label("Langkah & Hasil:"));
  push(...numbered(langkah));
  gambarList.forEach((g) => push(...figure(g.num, g.cap, g.spec)));
  push(label("Pembahasan:"));
  push(p(pembahasan));
};
modul("4.4", 1, "Pembangunan Basis Data Supabase (PostgreSQL + RLS)", [
  "Membuat proyek Supabase (region Singapura/ap-southeast-1) dan memperoleh URL API serta anon key.",
  "Menyimpan kredensial ke berkas .env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). Galeri inspirasi memakai Wikimedia Commons API yang bersifat publik sehingga tidak memerlukan API key.",
  "Membentuk sepuluh tabel melalui SQL Editor sesuai Model Relasional (§4.1.4) dengan UUID sebagai PK dan FK antar-tabel.",
  "Mengaktifkan Row Level Security (RLS) dan menyusun policy (mis. public read untuk products, owner write untuk pemilik).",
], [
  { num: "4.24", cap: "Pembuatan project & kredensial Supabase", spec: ["Dashboard Supabase: nama proyek, region, URL API & anon key (disensor)."] },
  { num: "4.25", cap: "Isi berkas .env", spec: ["Variabel VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY (nilai disensor). Wikimedia Commons API tidak memerlukan key tambahan."] },
  { num: "4.26", cap: "Hasil eksekusi SQL pembentukan tabel", spec: ["SQL Editor menampilkan tabel: users, shops, products, preorders, order_items, conversations, messages, reviews, notifications, custom_order_quotes."] },
  { num: "4.27", cap: "Konfigurasi RLS & policy tiap tabel", spec: ["Daftar tabel dengan status RLS aktif dan contoh policy."] },
], "Penggunaan Supabase memenuhi KNF-04 (keamanan) melalui RLS dan JWT, sekaligus memangkas waktu pengembangan karena tidak perlu membangun server manual — selaras dengan kecepatan iterasi pada metode Prototyping.");
modul("4.4", 2, "Konfigurasi Supabase Client & Styling", [
  "Membuat src/app/lib/supabase.ts yang menginisialisasi koneksi singleton dengan persistSession.",
  "Memasang dan mengonfigurasi Tailwind CSS v4 beserta lucide-react (ikon) dan motion (animasi).",
], [
  { num: "4.28", cap: "Isi berkas supabase.ts", spec: ["Pemanggilan createClient dengan URL & anon key serta opsi persistSession: true."] },
], "Pemisahan kredensial ke .env memenuhi praktik keamanan; Tailwind v4 mendukung KNF-01/KNF-02 dengan iterasi tata letak cepat sesuai semangat metode Prototyping.");
modul("4.4", 3, "Autentikasi & Manajemen Sesi Multi-Peran", [
  "Mengintegrasikan Supabase Auth ke dalam React Context (AuthContext.tsx).",
  "Membuat fungsi signUp yang mendaftarkan akun ke Auth dan menyimpan profil ke tabel users beserta user_type.",
  "Membuat halaman Register (toggle peran) dan Login dengan penanganan kesalahan.",
  "Mengarahkan pengguna setelah login: pembeli ke beranda, penjual ke pendaftaran toko/dashboard.",
], [
  { num: "4.29", cap: "Cuplikan fungsi signUp pada AuthContext.tsx", spec: ["Logika createUser di Auth + insert profil ke tabel users (name, user_type)."] },
  { num: "4.30", cap: "Halaman Register dengan toggle peran", spec: ["Form registrasi, tombol Pembeli/Penjual, validasi real-time."] },
  { num: "4.31", cap: "Halaman Login", spec: ["Form email & kata sandi dengan error handling informatif."] },
  { num: "4.32", cap: "Beranda setelah login sebagai konsumen", spec: ["Sapaan personal (“Halo, Natalia”), search bar, kategori."] },
], "Modul ini memenuhi KF-01 dan KNF-04; pemisahan peran menjadi fondasi kontrol akses yang diuji pada §4.7.");
modul("4.4", 4, "Modul Pengelolaan Toko", [
  "Membuat form pendaftaran toko (nama, deskripsi, kategori spesialisasi, alamat, jam buka, titik peta).",
  "Mengintegrasikan komponen ImageUpload untuk mengunggah foto ke Supabase Storage (bucket images).",
  "Menyimpan data ke tabel shops dengan user_id pemilik dan is_active = TRUE.",
], [
  { num: "4.33", cap: "Form pendaftaran toko (sebelum & sesudah diisi)", spec: ["Kolom input lengkap dan pratinjau foto toko hasil unggah."] },
  { num: "4.34", cap: "Data toko tersimpan di tabel shops", spec: ["Baris baru dengan user_id pemilik & is_active = TRUE."] },
], "Modul ini memenuhi KF-11; koordinat (latitude/longitude) menjadi dasar fitur peta, dan kategori mendukung filter pada KF-03.");
modul("4.4", 5, "Modul Produk (CRUD, Harga S–XL, Diskon, Detail Bunga)", [
  "Membuat form produk dengan kolom nama, deskripsi, kategori, foto, dan detail bunga (tipe, durasi PO, ketahanan, perawatan).",
  "Menambahkan input harga per ukuran S, M, L, XL yang disimpan sebagai JSONB.",
  "Menambahkan fitur diskon persentase; fungsi buildProductPayload menghitung discount_price.",
  "Menampilkan daftar produk dengan badge Ready Stock/Pre-Order dan label diskon.",
], [
  { num: "4.35", cap: "Form tambah produk dengan harga per ukuran S–XL", spec: ["Empat kolom harga untuk ukuran S, M, L, XL."] },
  { num: "4.36", cap: "Form diskon (mis. 20%: Rp200.000 → Rp160.000)", spec: ["Input persentase diskon & pratinjau harga akhir."] },
  { num: "4.37", cap: "Daftar produk dengan badge Pre-Order & Diskon", spec: ["Indikator Ready Stock vs Pre-Order dan label diskon merah."] },
], "Modul ini memenuhi KF-05 dan KF-12; penyimpanan harga per ukuran dalam satu baris JSONB efisien dan sesuai karakteristik produk bunga.");
modul("4.4", 6, "Modul Pemesanan & Pre-Order", [
  "Membuat halaman Pre-Order dengan pemilihan ukuran, metode pickup/kirim, tanggal, alamat, dan catatan.",
  "Menambahkan validasi tanggal terhadap durasi PO minimum.",
  "Menyimpan pesanan ke preorders (nomor ORD-YYYYMMDD-####) dan rincian ke order_items.",
], [
  { num: "4.38", cap: "Formulir Pre-Order oleh konsumen", spec: ["Kolom tanggal, alamat, metode pickup/kirim, catatan; validasi tanggal."] },
  { num: "4.39", cap: "Riwayat pesanan (My Orders)", spec: ["Daftar pesanan dengan nomor, status, dan rincian item."] },
], "Modul ini memenuhi KF-07 dan KF-08 serta menjawab rumusan masalah sistem pemesanan terstruktur; pemisahan order_items menjaga normalisasi.");
modul("4.4", 7, "Modul Chat Real-time & Notifikasi", [
  "Membuat ruang chat yang menyimpan pesan ke tabel messages dan meringkasnya pada conversations.",
  "Menggunakan Supabase Realtime agar pesan tersinkron secara instan.",
  "Membuat komponen NotificationBell yang menampilkan notifikasi dari tabel notifications.",
], [
  { num: "4.40", cap: "Ruang chat real-time", spec: ["Gelembung pesan dua arah; kanal koordinasi pembayaran (nomor rekening & bukti transfer)."] },
  { num: "4.41", cap: "Komponen NotificationBell & dropdown", spec: ["Ikon lonceng dengan titik merah; daftar notifikasi responsif di mobile."] },
], "Modul ini memenuhi KF-09 dan KF-16 serta KNF-03 (< 1 detik); chat menjadi kanal koordinasi pembayaran karena sistem tidak memiliki payment gateway.");

push(h2("4.5 Realisasi Versi 0.3.0 — Fitur Final & Pengemasan"));
push(p("Versi 0.3.0 melengkapi fitur final hasil validasi responden v0.2.0 (Tabel 4.12) dan mengemas aplikasi menjadi APK Android."));
modul("4.5", 1, "Modul Galeri Inspirasi (Wikimedia Commons)", [
  "Membuat fungsi searchWikimedia pada src/app/lib/wikimedia.ts yang memanggil endpoint publik Wikimedia Commons (commons.wikimedia.org/w/api.php) tanpa API key.",
  "Memetakan respons untuk mengambil URL gambar dan nama pembuat/lisensi (atribusi hak cipta) serta membersihkan metadata HTML.",
  "Membuat halaman galeri dengan pencarian kata kunci dan pagination, serta tombol “Diskusikan dengan Penjual”.",
], [
  { num: "4.42", cap: "Fungsi searchWikimedia pada lib/wikimedia.ts", spec: ["Permintaan ke endpoint Wikimedia Commons dengan parameter generator=search & gsrsearch; mapping URL, deskripsi & atribusi."] },
  { num: "4.43", cap: "Halaman Inspirasi Desain (grid Wikimedia Commons)", spec: ["Grid gambar; pencarian (mis. “wedding bouquet”); tombol “Diskusikan dengan Penjual”."] },
], "Modul ini memenuhi KF-06; penggunaan Wikimedia Commons (menggantikan Unsplash/Pinterest pada draf awal) memberi akses gambar berlisensi bebas tanpa API key dan tanpa penyimpanan lokal.");
modul("4.5", 2, "Modul Penawaran Kustom (Custom Order Quote)", [
  "Membuat komponen CustomOrderQuote untuk membuat penawaran di dalam chat.",
  "Menyimpan penawaran ke tabel custom_order_quotes (status pending) dan mengirim notifikasi quote_received.",
  "Menambahkan aksi Terima/Tolak bagi pembeli yang memperbarui status dan mengirim notifikasi balik.",
], [
  { num: "4.44", cap: "Kartu penawaran kustom dalam chat", spec: ["Detail penawaran (nama, harga) dengan tombol Terima/Tolak."] },
], "Modul ini memenuhi KF-14 dan menjawab kebutuhan negosiasi pesanan kustom yang sebelumnya manual.");
modul("4.5", 3, "Modul Ulasan & Rating", [
  "Membuat form ulasan (rating 1–5, komentar, foto) yang hanya aktif untuk pesanan selesai.",
  "Menyimpan ulasan ke tabel reviews (satu ulasan per pesanan).",
  "Menerapkan trigger yang memperbarui rata-rata rating toko secara otomatis.",
], [
  { num: "4.45", cap: "Form & daftar ulasan toko", spec: ["Form rating bintang + komentar; daftar ulasan dengan nama pengguna & tanggal."] },
], "Modul ini memenuhi KF-10 dan membangun mekanisme reputasi toko untuk meningkatkan kepercayaan konsumen.");
modul("4.5", 4, "Modul Dashboard & Rekap Penjualan (PDF)", [
  "Membuat dashboard penjual berisi total pendapatan, jumlah pesanan, dan produk aktif.",
  "Membuat halaman SalesReport yang menyusun data pesanan menjadi laporan.",
  "Mengekspor rekap ke PDF menggunakan pustaka jsPDF.",
], [
  { num: "4.46", cap: "Dashboard ringkasan bisnis penjual", spec: ["Kartu metrik: pendapatan, pesanan, produk aktif."] },
  { num: "4.47", cap: "Halaman Rekap Penjualan & hasil PDF", spec: ["Tabel rekap + tombol Cetak PDF; pratinjau berkas PDF hasil jsPDF."] },
], "Modul ini memenuhi KF-15 dan menjawab kebutuhan laporan penjualan otomatis yang sebelumnya manual via Excel.");
modul("4.5", 5, "Pembungkusan ke Android dengan Capacitor", [
  "Menjalankan proses build aset produksi aplikasi React.",
  "Menambahkan platform Android (cap add android) dan menyinkronkan aset (cap sync).",
  "Mengompilasi APK versi 0.3.0 melalui Android Studio untuk pengujian perangkat.",
], [
  { num: "4.48", cap: "Proses inisialisasi & sinkronisasi Capacitor Android", spec: ["Urutan perintah build dan cap sync di terminal."] },
  { num: "4.49", cap: "Berkas APK hasil build (v0.3.0)", spec: ["Berkas .apk siap distribusi untuk pengujian lapangan."] },
], "Pembungkusan memenuhi KNF-05 (portability); single codebase tetap dapat dipasang sebagai aplikasi Android.");

push(h2("4.6 Ringkasan Realisasi Antar-Versi"));
push(p("Tabel berikut merangkum modul yang direalisasikan pada setiap versi beserta bukti gambarnya, menegaskan keterkaitan antara perancangan iteratif (§4.1) dan hasil implementasi."));
push(tableCaption("Tabel 4.14 Ringkasan Realisasi per Versi"));
push(tbl(["Versi", "Modul Direalisasikan", "Bukti (Gambar)"], [
  ["0.1.0", "Kerangka folder, routing, halaman placeholder", "Gambar 4.23"],
  ["0.2.0", "Basis data, autentikasi, toko, produk, pemesanan, chat, notifikasi", "Gambar 4.24–4.41"],
  ["0.3.0", "Galeri Wikimedia Commons, penawaran kustom, ulasan, dashboard & rekap PDF, build Android", "Gambar 4.42–4.49"],
], [9, 61, 30]));

push(h2("4.7 Pengujian Sistem"));
push(h3("4.7.1 Pengujian Black-Box (Evaluasi Fungsional)"));
push(label("Hasil:"));
push(p("Pengujian dilakukan pada perangkat fisik Android. Sebanyak 30 skenario fungsional diuji mencakup seluruh modul. Seluruh skenario menghasilkan keluaran sesuai harapan (Valid)."));
push(tableCaption("Tabel 4.15 Hasil Pengujian Black-Box"));
const bb = [
  ["1", "Auth", "Registrasi akun baru", "Email valid & kata sandi", "Akun dibuat, masuk Beranda", "Valid"],
  ["2", "Auth", "Registrasi email ganda", "Email yang sudah ada", "Pesan “Email terdaftar”", "Valid"],
  ["3", "Auth", "Login peran Penjual", "Email & kata sandi penjual", "Masuk Dashboard Penjual", "Valid"],
  ["4", "Auth", "Logout", "Klik Keluar", "Sesi berakhir, kembali ke Login", "Valid"],
  ["5", "Toko", "Daftar profil toko", "Nama, alamat, kategori, foto", "Data tersimpan di tabel shops", "Valid"],
  ["6", "Toko", "Edit profil toko", "Ubah jam operasional", "Data toko terbarui", "Valid"],
  ["7", "Produk", "Tambah produk Ready Stock", "Nama, harga, stok 10", "Produk tampil di katalog", "Valid"],
  ["8", "Produk", "Set diskon 20%", "Harga 200rb, diskon 20%", "Harga tampil Rp160.000", "Valid"],
  ["9", "Produk", "Input harga per ukuran", "S=100rb, XL=300rb", "Size picker & harga benar", "Valid"],
  ["10", "Produk", "Set produk Pre-Order", "Durasi PO 3 hari", "Badge Pre-Order muncul", "Valid"],
  ["11", "Produk", "Isi detail bunga", "Tipe live, ketahanan 5 hari", "Detail tampil di halaman produk", "Valid"],
  ["12", "Produk", "Hapus produk", "Konfirmasi hapus", "Produk hilang dari marketplace", "Valid"],
  ["13", "Cari", "Cari kata kunci", "Keyword: “mawar”", "Muncul produk relevan", "Valid"],
  ["14", "Cari", "Filter kategori toko", "Pilih kategori Bouquet", "Tampil produk bouquet", "Valid"],
  ["15", "Pesan", "Order Ready Stock", "Qty 2, ukuran L", "Stok berkurang 2", "Valid"],
  ["16", "Pesan", "Order Pre-Order", "Pilih tanggal pengantaran", "Pesanan tersimpan, nomor ORD- dibuat", "Valid"],
  ["17", "Pesan", "Validasi tanggal < durasi PO", "Tanggal terlalu cepat", "Peringatan validasi muncul", "Valid"],
  ["18", "Pesan", "Pilih metode pickup/kirim", "Pilih “Kirim” + alamat", "Metode tersimpan di pesanan", "Valid"],
  ["19", "Pesan", "Lihat riwayat pesanan", "Buka My Orders", "Rincian transaksi tampil", "Valid"],
  ["20", "Pesan", "Penjual ubah status", "Klik delivered", "Status berubah, notif terkirim", "Valid"],
  ["21", "Chat", "Kirim pesan ke penjual", "“Bisa kirim pagi?”", "Pesan terkirim < 1 detik", "Valid"],
  ["22", "Chat", "Terima balasan", "Penjual membalas", "Bubble chat muncul otomatis", "Valid"],
  ["23", "Quote", "Penjual kirim penawaran", "Nama, harga penawaran", "Quote tampil, status pending", "Valid"],
  ["24", "Quote", "Pembeli terima penawaran", "Klik Terima", "Status accepted + notifikasi", "Valid"],
  ["25", "Ulasan", "Beri ulasan pesanan selesai", "Rating 5 + komentar", "Ulasan tersimpan, rating toko terupdate", "Valid"],
  ["26", "Notif", "Notifikasi pesanan masuk", "Konsumen buat pesanan", "Penjual dapat notif lonceng", "Valid"],
  ["27", "Inspirasi", "Buka galeri Wikimedia Commons", "Klik menu Referensi", "Grid gambar Wikimedia Commons tampil", "Valid"],
  ["28", "Inspirasi", "Cari & pagination", "Keyword “wedding”, scroll", "Halaman gambar berikutnya dimuat", "Valid"],
  ["29", "Rekap", "Cetak rekap penjualan PDF", "Klik Cetak PDF", "Berkas PDF terunduh (jsPDF)", "Valid"],
  ["30", "Akses", "Buka Dashboard tanpa login", "Ketik URL manual", "Redirect otomatis ke Login", "Valid"],
];
push(tbl(["No", "Modul", "Skenario", "Input", "Output Diharapkan", "Hasil"], bb, [5, 11, 22, 22, 30, 10]));
push(label("Pembahasan:"));
push(p("Seluruh 30 skenario memperoleh hasil Valid (keberhasilan 100%), menunjukkan fungsi inti telah berjalan sesuai kebutuhan fungsional (Bab III §3.5.1). Skenario akses (No. 30) membuktikan efektivitas RLS dan proteksi rute. Pengujian terhadap “papan jadwal acara” pada draf awal dihilangkan karena fitur/tabel tersebut tidak diimplementasikan, dan diganti skenario yang benar-benar tersedia (ulasan, penawaran kustom, rekap penjualan)."));
push(h3("4.7.2 Pengujian Kompatibilitas Perangkat"));
push(label("Hasil:"));
push(tableCaption("Tabel 4.16 Hasil Pengujian Kompatibilitas"));
push(tbl(["Perangkat", "Sistem Operasi", "RAM", "Hasil"], [
  ["Xiaomi Redmi Note 11", "Android 13", "4 GB", "Sangat lancar, transisi mulus"],
  ["Samsung Galaxy A52", "Android 12", "6 GB", "Sangat lancar, loading cepat"],
  ["Oppo A57", "Android 11", "4 GB", "Berjalan baik, stabil"],
  ["Realme C25", "Android 10", "4 GB", "Berjalan lancar, kompatibel"],
], [32, 22, 12, 34]));
push(label("Pembahasan:"));
push(p("Aplikasi berjalan stabil pada Android 10–13 dengan RAM 4–6 GB, memenuhi KNF-02 dan KNF-05, tanpa gejala kebocoran memori, sehingga layak digunakan pada perangkat kelas menengah yang umum di Kota Manado."));

push(h2("4.8 Ringkasan dan Pembahasan Keseluruhan"));
push(p("Secara keseluruhan, aplikasi Bloemen berhasil dirancang dan dibangun melalui pendekatan Prototyping yang iteratif. Pada sub-bab Perancangan (§4.1), seluruh model perilaku (Use Case dan Activity), model data (ERD dan Model Relasional), serta model antarmuka (Wireframe Low-Fidelity dan High-Fidelity) telah disusun secara berurutan dan divalidasi oleh responden pada setiap iterasi (v0.1.0 → v0.2.0 → v0.3.0). Hasil perancangan kemudian direalisasikan menjadi aplikasi fungsional pada §4.3–§4.5 dan lulus pengujian Black-Box (100% Valid) serta kompatibilitas perangkat. Seluruh kebutuhan fungsional (KF-01–KF-16) dan non-fungsional (KNF-01–KNF-07) terpenuhi. Supabase Realtime efektif sebagai kanal koordinasi pembayaran menggantikan ketiadaan payment gateway, dan integrasi Wikimedia Commons menjawab kebutuhan referensi desain. Dengan demikian, sistem dinyatakan layak meningkatkan efisiensi transaksi industri kreatif bunga di Kota Manado."));

/* ===================== BUILD ===================== */
const doc = new Document({
  creator: "Revisi Skripsi Bloemen",
  title: "Revisi Lengkap Bab III & IV - Marketplace Kreativitas Bunga",
  styles: { default: { document: { run: { font: FONT, size: 22 } } } },
  sections: [ { properties: { page: { margin: { top: 1440, bottom: 1440, left: 1700, right: 1440 } } }, children: C } ],
});
const buf = await Packer.toBuffer(doc);
fs.mkdirSync("docs", { recursive: true });
fs.writeFileSync("docs/REVISI_BAB_III_IV_BLOEMEN.docx", buf);
console.log("OK wrote docs/REVISI_BAB_III_IV_BLOEMEN.docx", buf.length, "bytes; elemen:", C.length);
