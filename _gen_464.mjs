import fs from "fs";
import * as D from "/workspaces/default/code/node_modules/docx/dist/index.mjs";
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType,
  BorderStyle, ShadingType, PageBreak, TableOfContents, StyleLevel, ImageRun, Footer, PageNumber,
  NumberFormat, HeadingLevel, VerticalAlign, TableLayoutType,
} = D;

const SRC = "/workspaces/default/code/src/imports/Laporan_Kemajuan_Seminar_Hasil_Natalia_Pangemanan-1.md";
const IMG = "/workspaces/default/code/src/imports/";
const all = fs.readFileSync(SRC, "utf8").split("\n").map((l) => l.replace(/\s+$/, ""));
let text = all.slice(50, 86).concat(all.slice(263)).join("\n");

const misses = [];
// ===== Subbab 4.6.4: bukti log Logcat Android Studio =====
const LOG = `Selain diamati melalui tampilan antarmuka, hasil setiap skenario juga diverifikasi melalui log aplikasi yang direkam menggunakan jendela Logcat pada Android Studio. Karena aplikasi Bloemen dibangun dengan Capacitor, keluaran _console_ dari WebView diteruskan ke Logcat dengan tag Capacitor/Console, sedangkan aktivitas jaringan ke Supabase (Auth, PostgreSQL, Realtime, dan Storage) tercatat beserta status responsnya. Perekaman dilakukan pada perangkat fisik Oppo A3X (Android 15) yang terhubung ke Android Studio melalui _USB debugging_, dengan filter package:mine "[BLOEMEN]" agar hanya log pengujian dari aplikasi Bloemen yang ditampilkan. Setiap proses utama pada aplikasi mencatat hasilnya ke console dengan awalan [BLOEMEN], misalnya "[BLOEMEN] Login berhasil" atau "[BLOEMEN] Realtime chat: SUBSCRIBED", sehingga keberhasilan maupun penolakan setiap skenario dapat dibuktikan langsung dari log.

Log autentikasi dan pengelolaan produk ditunjukkan pada Gambar 4.41. Log tersebut memperlihatkan proses registrasi, login, dan logout yang berhasil, penolakan registrasi dengan email yang sudah terdaftar, serta penyimpanan, perubahan, dan penghapusan data produk tanpa pesan galat (skenario 1 sampai 12).

@@PH|x4.40|Tangkapan layar jendela Logcat Android Studio (filter package:mine "[BLOEMEN]") saat skenario registrasi, login, logout, serta tambah, edit, dan hapus produk dijalankan

**Gambar 4.41** Log Logcat Android Studio pada Pengujian Autentikasi dan Pengelolaan Produk

Gambar 4.42 menampilkan log ketika skenario pemesanan, chat, notifikasi, dan penawaran kustom dijalankan. Pada log terlihat pesanan tersimpan ke tabel preorders, koneksi WebSocket Realtime berstatus SUBSCRIBED, serta pesan chat dan notifikasi yang diterima dalam waktu kurang dari dua detik (skenario 17 sampai 28).

@@PH|x4.41|Tangkapan layar jendela Logcat saat skenario pemesanan, chat real-time, notifikasi, dan penawaran kustom dijalankan (tampak status SUBSCRIBED pada kanal Realtime)

**Gambar 4.42** Log Logcat Android Studio pada Pengujian Pemesanan, Chat Real-time, dan Notifikasi

Adapun Gambar 4.43 memperlihatkan log pada skenario negatif, yaitu penolakan unggah foto berukuran 8 MB serta pengalihan rute ketika halaman penjual diakses tanpa login atau oleh akun pembeli. Munculnya pesan penolakan yang sesuai dan tidak adanya galat fatal (_FATAL EXCEPTION_) maupun _crash_ selama pengujian menunjukkan bahwa validasi dan kontrol akses berjalan sebagaimana dirancang (skenario 29 sampai 32).

@@PH|x4.42|Tangkapan layar jendela Logcat saat skenario unggah foto 8 MB dan akses rute /seller tanpa login dijalankan (tampak pesan validasi dan redirect, tanpa FATAL EXCEPTION)

**Gambar 4.43** Log Logcat Android Studio pada Pengujian Validasi Media dan Kontrol Akses

`;

function R(from, to) {
  if (from instanceof RegExp) {
    if (!from.test(text)) misses.push(String(from));
    text = text.replace(from, to);
  } else {
    if (!text.includes(from)) misses.push(from.slice(0, 90));
    text = text.split(from).join(to);
  }
}
function RL(prefix, newLine) {
  const lines = text.split("\n");
  const i = lines.findIndex((l) => l.startsWith(prefix));
  if (i < 0) { misses.push("LINE " + prefix.slice(0, 80)); return; }
  lines[i] = newLine;
  text = lines.join("\n");
}
if (process.env.ONLY464) R("Hasil pengujian fungsional menunjukkan seluruh 39", LOG + "Hasil pengujian fungsional menunjukkan seluruh 39");
const PIC = (startText) => new RegExp("<!-- Start of picture text -->\\n" + startText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?<!-- End of picture text -->");

// ---------- ABSTRAK / ABSTRACT ----------
R("serta dashboard dan rekap penjualan otomatis dalam format PDF", "referensi desain bunga dari Wikimedia Commons dan foto produk toko, serta dashboard dan rekap penjualan otomatis dalam format Excel");
R("terhadap 39 skenario fungsional menunjukkan", "terhadap 39 skenario fungsional (36 skenario black-box dan 3 alur end-to-end) menunjukkan");
R("pada perangkat Android versi 15 menunjukkan", "pada perangkat Oppo A3X (Android 15) menunjukkan");
R("custom price offers, an event schedule board, and an automated sales dashboard with PDF export", "custom price offers, design references from Wikimedia Commons and store product photos, and an automated sales dashboard with Excel export");
R("Black-Box testing on 39 functional scenarios", "Black-Box testing on 39 functional scenarios (36 black-box scenarios and 3 end-to-end flows)");
R("compatibility testing on Android devices version 15", "compatibility testing on an Oppo A3X device (Android 15)");
R("**_ABSTRACT_**", "### **ABSTRACT**");

// ---------- BAB II ----------
R("### **BAB II PENDAHULUAN**", "### **BAB II LANDASAN TEORI**");
R("memeanfaatkan", "memanfaatkan");
R("##### <mark>2.2.4 Fitur Referensi Desain (Berbasis Wikimedia Commons API)</mark>", "##### 2.2.4 Fitur Referensi Desain (Berbasis Wikimedia Commons API)");
RL("Unsplash merupakan platform", "Wikimedia Commons merupakan repositori media bebas yang dikelola oleh Wikimedia Foundation dan berisi puluhan juta berkas gambar, foto, serta media lain yang dikontribusikan oleh komunitas dari seluruh dunia. Setiap berkas pada Wikimedia Commons dirilis di bawah lisensi bebas, seperti _Creative Commons_ (CC BY, CC BY-SA, CC0) atau domain publik, sehingga dapat digunakan kembali dengan tetap mencantumkan atribusi sesuai lisensinya. Akses terprogram terhadap repositori ini disediakan melalui MediaWiki Action API (endpoint api.php) yang bekerja sebagai REST API berbasis HTTP dan mengembalikan data dalam format JSON. API ini bersifat publik, tidak memerlukan API key, dan mendukung permintaan lintas domain (CORS) melalui parameter origin=*.");
RL("Dalam proyek aplikasi _Bloemen_ , Unsplash API", "Dalam aplikasi _Bloemen_, Wikimedia Commons API dimanfaatkan sebagai sumber gambar pada halaman Referensi Desain Bunga. Pencarian dilakukan dengan parameter action=query dan generator=search pada namespace berkas (gsrnamespace=6) dengan jumlah hasil per halaman yang dibatasi melalui gsrlimit, kemudian URL gambar dan metadata deskripsinya diambil melalui prop=imageinfo (iiprop=url|extmetadata). Kata kunci yang diketik pembeli dalam Bahasa Indonesia terlebih dahulu diterjemahkan ke bahasa Inggris agar hasil lebih relevan, lalu hasil yang bukan gambar bunga (misalnya peta atau ilustrasi buku) disaring sebelum ditampilkan. Selain gambar dari Wikimedia Commons, halaman ini juga menampilkan foto produk dari toko yang terdaftar di aplikasi dan menyisipkannya di sela hasil pencarian dengan label \"Produk Toko\", sehingga pembeli dapat langsung menemukan produk nyata yang mirip dengan inspirasinya. Apabila API tidak dapat diakses, sistem memakai koleksi gambar cadangan bawaan aplikasi. Gambar yang dipilih dapat dikirimkan ke toko melalui fitur chat sebagai referensi desain. Pendekatan ini membuat konten visual tetap bervariasi tanpa membebani penyimpanan (_storage_) aplikasi dengan berkas gambar statis.");
R("- 2.2.5 Sistem Manajemen Pemesanan", "##### 2.2.5 Sistem Manajemen Pemesanan");
R("manajemen status pesanan (dipesan, dikonfirmasi, diproses, selesai)", "manajemen status pesanan (pending, confirmed, processing, ready, delivered, dan cancelled)");
R("Rapid Application Developmet", "Rapid Application Development");
R("seperti sistem rekomendasi, pre-order, dan papan pengumuman", "seperti referensi desain, pre-order, dan penawaran harga kustom");
R("menjalankan emulator guna menguji tampilan aplikasi pada berbagai ukuran layar, serta memantau", "memantau log aplikasi melalui Logcat, serta memantau");
R("informasi pengguna, jadwal acara, data pesanan", "informasi pengguna, data toko, data pesanan");

// ---------- BAB III ----------
R("### **BAB 3**\n\n### **METODOLOGI PELAKSANAAN**", "### **BAB III METODOLOGI PELAKSANAAN**");
R("dan kuisioner kebutuhan", "dan kuesioner kebutuhan");
R("Pengujian aplikasi dilakukan pada perangkat Android fisik dan emulator yang tersedia.", "Pengujian aplikasi dilakukan pada satu perangkat Android fisik, yaitu Oppo A3X (Android 15).");
R("mencakup perangkat pengembangan dan perangkat pengujian.", "mencakup perangkat pengembangan dan satu perangkat pengujian, yaitu Oppo A3X (Android 15).");
R("kerangka pikir (Gambar 3.2)", "kerangka pikir (Gambar §1)");
R("Dalam penelitian ini, dibuatlah kerangka pikir (Gambar §1) dengan tujuan untuk mengarahkan penelitian.\nDalam penelitian ini, dibuatlah kerangka pikir (Gambar 3.2) dengan tujuan untuk mengarahkan penelitian.",
  "Dalam penelitian ini, dibuatlah kerangka pikir (Gambar §1) dengan tujuan untuk mengarahkan penelitian.");
R(PIC("mui >"), "@@PH|§1|Diagram kerangka pikir: Identifikasi masalah → Solusi: aplikasi marketplace kreativitas bunga Bloemen berbasis React, TypeScript, dan Supabase → Metode pengembangan RAD (Tahap 1 Planning, Tahap 2 User Design, Tahap 3 Rapid Construction & Cutover) → Pengujian Black-Box: 39 skenario fungsional valid (36 skenario black-box + 3 alur end-to-end) → Kompatibel pada Oppo A3X (Android 15) → Selesai. (Gambar perlu digambar ulang sesuai isi ini.)\n\n_Gambar §1 Kerangka Pikir Penelitian_");
R(PIC("Diagram Arsitektur Sistem"), "@@ARCH");
R("4. Layanan Eksternal: Unsplash REST API digunakan untuk mengambil gambar inspirasi desain bunga secara dinamis berdasarkan kueri kategori acara.",
  "4. Layanan Eksternal: Wikimedia Commons API (REST API) digunakan untuk mengambil gambar inspirasi desain bunga secara dinamis berdasarkan kata kunci pencarian pembeli, tanpa memerlukan API key.");
R("   5. Observasi Langsung", "1. Observasi Langsung");
R("   6. Kuesioner:", "2. Kuesioner:");
R("   7. Wawancara:", "3. Wawancara:");
R("- 3.6.2 Daftar Kebutuhan Fungsional", "##### **3.6.2 Daftar Kebutuhan Fungsional**");
R("##### **3.5.3 Daftar Kebutuhan Non-Fungsional**", "##### **3.6.3 Daftar Kebutuhan Non-Fungsional**");
R("|||Pembeli dapat mengakses galeri|||\n|15|FR-15|inspirasi desain bunga dari Unsplash<br>berdasarkan kategori acara|Pembeli||",
  "|15|FR-15|Pembeli dapat mengakses halaman referensi desain bunga dari Wikimedia Commons dan foto produk toko, serta mengirimkannya ke toko|Pembeli||");
R("dan mengunduh rekap penjualan dalam<br>format PDF|", "dan mengunduh rekap penjualan dalam<br>format Excel (.xlsx)|");
R(/memungkinkan\|\n+\|No<br>Kode\|Kebutuhan Non-Fungsional\|\n\|---\|---\|\n+penambahan pengguna tanpa konfigurasi ulang server/, "memungkinkan penambahan pengguna tanpa konfigurasi ulang server|");
R(PIC("Sistem Bloemen"), "@@PH|-|Use case diagram dengan aktor Pembeli, Penjual, dan Sistem. Use case: Registrasi Akun, Login Sistem, Kelola Profil Toko, Kelola Produk, Buat Pesanan Pre-Order, Chat Real-time, Kelola Pesanan, Beri Ulasan dan Rating, Lihat Referensi Desain Bunga (Wikimedia Commons dan Produk Toko), serta Lihat Dashboard dan Unduh Rekap Excel. (Gambar perlu digambar ulang sesuai isi ini.)");
R("|**Elemen**||**Deskripsi**|\n|---|---|---|\n|Pasca-kondisi|Sesi login aktif. Pengguna<br>perannya.|berada di halaman utama sesuai|",
  "|**Elemen**|**Deskripsi**|\n|---|---|\n|Pasca-kondisi|Sesi login aktif. Pengguna berada di halaman utama sesuai perannya.|");
R("|Prasyarat<br>Alur Utama<br>(Tambah Produk)|Penjual sudah login dan sudah memiliki profil toko aktif.<br>1. Penjual",
  "|Prasyarat|Penjual sudah login dan sudah memiliki profil toko aktif.|\n|Alur Utama (Tambah Produk)|1. Penjual");
R("Tabel 3.15 Deskripsi Use Case UC-09: Galeri Inspirasi Desain (Unsplash)", "Tabel 3.15 Deskripsi Use Case UC-09: Referensi Desain Bunga (Wikimedia Commons dan Produk Toko)");
R("|Aktor|Pembeli|\n|Deskripsi|Pembeli dapat menelusuri galeri gambar referensi desain bunga", "|Aktor|Pengunjung (tanpa login) dan Pembeli|\n|Deskripsi|Pengguna dapat menelusuri galeri gambar referensi desain bunga");
R("|Prasyarat|-<br>Pembeli sudah login (diperlukan saat membuka chat<br>dengan toko)<br>-<br>Terdapat minimal satu toko yang terdaftar|",
  "|Prasyarat|-<br>Halaman Referensi dapat diakses secara publik tanpa harus login terlebih dahulu<br>-<br>Login hanya diperlukan saat pengguna menekan tombol \"Kirim ke Toko\"<br>-<br>Terdapat minimal satu toko yang terdaftar|");
R("**A4**(Pembeli belum login): Saat pembeli memilih toko tujuan,<br>sistem mengarahkan pembeli ke halaman login.",
  "**A4** (Pengguna belum login): Saat pengguna menekan tombol \"Kirim ke Toko\", sistem mengarahkan pengguna ke halaman login sebelum referensi dapat dikirim. Penelusuran dan pencarian gambar tetap dapat dilakukan tanpa login.");
R(/Tabel 3\.16 Deskripsi Use Case UC-10[\s\S]*?laporan keuangan\.\|/, `Tabel 3.16 Deskripsi Use Case UC-10: Dashboard dan Rekap Penjualan (Excel)

|**Elemen**|**Deskripsi**|
|---|---|
|Use Case ID|UC-10|
|Nama Use Case|Lihat Dashboard dan Unduh Rekap Penjualan (Excel)|
|Aktor|Penjual|
|Deskripsi|Penjual dapat melihat ringkasan bisnis pada dashboard dan mengunduh rekap hasil penjualan dalam format Excel (.xlsx).|
|Prasyarat|Penjual sudah login dan memiliki toko aktif. Terdapat data pesanan pada periode yang dipilih.|
|Alur Utama|1. Penjual membuka Dashboard Penjual. 2. Sistem menampilkan 4 kartu metrik: Total Pendapatan, Pesanan Menunggu, Total Produk Aktif, dan Rating Toko. 3. Penjual membuka menu Rekap Penjualan. 4. Sistem menampilkan halaman "Rekap Hasil Penjualan". 5. Penjual mengatur Filter Periode (Tanggal Mulai dan Tanggal Selesai). 6. Sistem mengambil data pesanan sesuai periode dari Supabase, lalu menampilkan ringkasan penjualan, daftar "Produk Terlaris", dan tabel "Rincian Transaksi". 7. Penjual menekan tombol "Unduh Laporan". 8. Sistem memanggil fungsi exportOrdersToExcel (SheetJS/xlsx) untuk membuat berkas .xlsx berisi sheet "Orders" dan "Summary". 9. Pada aplikasi Android, berkas disimpan ke folder Documents dan dapat dibagikan melalui menu Share; pada versi web, berkas langsung terunduh.|
|Pasca-kondisi|Berkas Excel rekap penjualan tersimpan di perangkat Penjual dan dapat digunakan untuk pembukuan atau laporan keuangan.|`);
R("Galeri Referensi,<br>Dashboard PDF, Capacitor", "Referensi Desain,<br>Dashboard + Rekap Excel, Capacitor");
R("siap untik", "siap untuk");
R("diskon, galeri)", "diskon, referensi desain)");
R("|Memastikan<br>aplikasi berjalan<br>pada berbagai<br>perangkat dan<br>versi Android|Uji pada empat perangkat fisik<br>Android 10 s.d. 13|",
  "|Memastikan<br>aplikasi berjalan<br>baik pada perangkat<br>Android target|Uji pada satu perangkat fisik Oppo A3X (Android 15)|");
R("pada perangkat fisik yang tercantum pada Tabel 3.2,", "pada satu perangkat fisik Oppo A3X (Android 15) sebagaimana tercantum pada Tabel 3.2,");
R("##### **3.10.5** P **engujian Penerimaan Pengguna (UAT)**", "##### **3.10.5 Pengujian Penerimaan Pengguna (UAT)**");

// ---------- BAB IV ----------
R("### **BAB 4 HASIL DAN PEMBAHASAN**", "### **BAB IV HASIL DAN PEMBAHASAN**");
RL("**Langkah 4 yaitu Menyiapkan file .env.**", "**Langkah 4 yaitu Menyiapkan berkas konfigurasi Supabase.** Konfigurasi koneksi Supabase disiapkan pada berkas utils/supabase/info.tsx yang memuat dua nilai, yaitu projectId dan publicAnonKey, yang akan diisi setelah proyek Supabase dibuat. Kedua nilai ini dibaca oleh klien Supabase saat aplikasi dijalankan. Fitur referensi desain yang dibangun pada iterasi ketiga memakai Wikimedia Commons API yang bersifat publik dan tidak memerlukan API key, sehingga tidak ada konfigurasi tambahan untuk fitur tersebut.");
R("menyalin Project URL dan Anon Public Key ke file .env.", "menyalin Project ID dan Anon Public Key ke berkas utils/supabase/info.tsx (projectId dan publicAnonKey).");
R("dengan 5 tab: Beranda, Toko, Pesanan, Pesan, dan Profil.", "dengan 5 tab. Pada prototipe v02.0 kelima tab tersebut adalah Beranda, Toko, Pesanan, Chat, dan Profil. Pada iterasi ketiga (v03.0) tab Pesanan digantikan oleh tab Referensi seiring ditambahkannya fitur Referensi Desain, sedangkan riwayat pesanan dipindahkan ke ikon tas belanja pada header Beranda. Gambar 4.7 menampilkan bottom navigation pada versi final.");
R("+ Rekap Penjualan<br>PDF menggunakan<br>jsPDF|", "+ Rekap Penjualan<br>Excel menggunakan<br>SheetJS (xlsx)|");
R("dan Dashboard Penjual + Rekap PDF.", "dan Dashboard Penjual + Rekap Penjualan Excel.");
R("(Wedding Bouquet, Funeral Wreath, Birthday Flowers, Graduation Flowers, dan Bouquet Pastel) yang memakai nilai searchQuery pada file shopCategories.ts.", "(buket pernikahan, bunga ulang tahun, mawar merah, bunga duka, papan bunga, dan buket tangan), serta daftar Toko Bunga Terdekat.");
R("misalnya \"wedding\", \"duka\", atau \"bouquet\".", "misalnya \"pernikahan\", \"duka\", atau \"buket\".");
R("Filter kategori (klik chip<br>\"Wedding\")|Hanya toko/produk kategori<br>Wedding yang tampil|", "Filter kategori (klik kategori<br>\"Bunga Wedding\")|Hanya toko/produk kategori<br>Bunga Wedding yang tampil|");
R("##### **4.5.7 Implementasi Dashboard Penjual dan Rekap Penjualan PDF**", "##### **4.5.7 Implementasi Dashboard Penjual dan Rekap Penjualan Excel**");
R("menghasilkan laporan penjualan yang dapat dicetak.", "mengunduh rekap penjualan dalam format Excel.");
RL("Halaman SalesReport.tsx menyediakan", "Halaman SalesReport.tsx berjudul \"Rekap Hasil Penjualan\" menyediakan Filter Periode berupa Tanggal Mulai dan Tanggal Selesai, kartu ringkasan penjualan, daftar \"Produk Terlaris\", dan tabel \"Rincian Transaksi\". Penjual dapat menekan tombol \"Unduh Laporan\" yang memanggil fungsi exportOrdersToExcel pada excelExport.ts. Fungsi ini menggunakan pustaka SheetJS (xlsx) untuk menghasilkan berkas Excel (.xlsx) berisi dua sheet, yaitu sheet \"Orders\" dengan kolom No, Order ID, Tanggal Order, Nama Customer, Email Customer, Produk, Jumlah, Harga Satuan, Total, Status, Metode Pembayaran, Tanggal Pengiriman, Alamat Pengiriman, dan Permintaan Khusus, serta sheet \"Summary\" yang memuat ringkasan penjualan pada periode terpilih. Pada aplikasi Android, berkas disimpan ke folder Documents perangkat menggunakan plugin Capacitor Filesystem (Directory.Documents), kemudian dapat langsung dibagikan melalui plugin Share. Pada versi web, berkas diunduh langsung melalui browser.");
R("**Gambar 4.30** Preview PDF Rekap Penjualan yang Dihasilkan Sistem", "**Gambar 4.30** Tampilan Halaman Rekap Hasil Penjualan dan Berkas Excel yang Dihasilkan");
R("filesystem untuk menyimpan PDF rekap ke perangkat, share untuk berbagi PDF ke WhatsApp,", "filesystem untuk menyimpan berkas Excel rekap penjualan ke folder Documents perangkat, share untuk membagikan berkas Excel tersebut (misalnya ke WhatsApp),");
R("appId ‘com.flowermarketplace.app’, appName ‘Bloemen Marketplace’", "appId ‘com.bloemen.app’, appName ‘Bloemen’");
R("menjadi ayer produksi statis", "menjadi aset produksi statis");
R("Tangkapan ayer terminal", "Tangkapan layar terminal");
R("(untuk fitur simpan PDF rekap)", "(untuk fitur simpan berkas Excel rekap)");
R(PIC("[ TEMPATKAN GAMBAR 4.32 DI SINI ]"), "@@IMG|image-6.png");
R("**Gambar 4.32** Proses Build APK di Android Studio", "**Gambar 4.32** Proyek Android Bloemen pada Android Studio (folder app/assets/public hasil build dan plugin Capacitor)");
R("Di Android Studio, penulis memilih menu Build → Build APK(s).", "Di Android Studio terlihat struktur proyek Android Bloemen, termasuk folder app/src/main/assets/public yang berisi hasil build web dan modul plugin Capacitor (Gambar 4.32). Penulis kemudian memilih menu Build → Build APK(s).");
RL("|4|PDF tidak<br>memuat", "|4|Berkas Excel rekap tidak ditemukan di perangkat Android|Android 10 ke atas menerapkan scoped storage sehingga berkas yang ditulis ke direktori internal aplikasi tidak terlihat di file manager|Berkas .xlsx berhasil dibuat tetapi tidak dapat ditemukan penjual di file manager perangkat|Berkas disimpan ke Directory.Documents menggunakan Capacitor Filesystem, kemudian langsung dibagikan melalui Capacitor Share (misalnya ke WhatsApp atau email)|");
R("berjalan baik pada<br>berbagai perangkat dan<br>versi API?|NFR-03|Uji pada 4 perangkat fisik<br>Android 10 s.d. 13|", "berjalan baik pada<br>perangkat Android<br>yang digunakan?|NFR-03|Uji pada satu perangkat fisik Oppo A3X (Android 15) dengan daftar periksa 4 butir|");
R("hingga rekap PDF; alur referensi", "hingga rekap Excel; alur referensi");
R(/\|2\|Perangkat utama\|Xiaomi Redmi Note 11, Android 13, RAM 4 GB\|\n\|3\|Perangkat pembanding\|[^\n]*\n\|4\|Backend/, "|2|Perangkat uji|Oppo A3X (model CPH2641), Android 15 (API 35), RAM 4 GB — satu-satunya perangkat fisik yang digunakan|\n|3|Backend");
R("|5|Layanan eksternal|", "|4|Layanan eksternal|");
R("|6|Penguji|Penulis (pengembang)", "|5|Penguji|Penulis (pengembang)");
R("|7|Metode|Black-box manual", "|6|Metode|Black-box manual");
R("###### **[ TEMPATKAN GAMBAR 4.34 DI SINI ]**\n\n_Tangkapan layar Halaman Beranda aplikasi Bloemen pada perangkat Xiaomi Redmi Note 11.", "@@PH|4.34|Tangkapan layar Halaman Beranda aplikasi Bloemen pada perangkat Oppo A3X (Android 15).");
R("serta ekspor rekap PDF.", "serta unduh rekap penjualan Excel.");
RL("|36|Rekap|", "|36|Rekap|Unduh rekap penjualan (atur Tanggal Mulai–Selesai, tekan tombol \"Unduh Laporan\")|Berkas .xlsx terunduh berisi sheet \"Orders\" dan \"Summary\" sesuai data periode|M|✓Valid|");
R("lihat<br>dashboard, ekspor PDF|", "lihat<br>dashboard, unduh rekap Excel|");
R("dashboard dan PDF sesuai<br>data pesanan|", "dashboard dan berkas Excel<br>sesuai data pesanan|");
R("|FR-16|Dashboard bisnis dan rekap penjualan PDF|", "|FR-16|Dashboard bisnis dan rekap penjualan Excel|");
R(/_Catatan: perumusan FR-15 pada Tabel 3\.5[^\n]*\n/, "");
R("pada Xiaomi Redmi Note 11|", "pada Oppo A3X|");
R("pada Samsung Galaxy A52; penjual", "pada Oppo A3X; penjual");
R("Sedikit lambat pada Oppo A57<br>(Android 11, RAM 4 GB)", "Sedikit lambat pada Oppo A3X<br>(Android 15, RAM 4 GB)");
R("Oppo A3x (model CPH2641)", "Oppo A3X (model CPH2641)");
R("Tampilan halaman beranda aplikasi pada perangkat uji disajikan pada Gambar 4.41.", `Tampilan halaman beranda aplikasi pada perangkat uji disajikan pada Gambar 4.41, sedangkan rincian butir pengujian kompatibilitas disajikan pada Tabel 4.14.

**Tabel 4.14 Hasil Pengujian Kompatibilitas pada Oppo A3X**

|**No**|**Butir Pengujian**|**Hasil Pengamatan**|**Status**|
|---|---|---|---|
|1|Instalasi dan peluncuran APK|app-debug.apk berhasil diinstal dan dibuka tanpa galat|Terpenuhi|
|2|Tampilan responsif|Tata letak, teks, dan tombol tampil utuh pada layar Oppo A3X tanpa terpotong|Terpenuhi|
|3|Fitur native|Akses lokasi (peta toko), unggah foto, serta unduh dan bagikan berkas Excel berjalan normal|Terpenuhi|
|4|Stabilitas Realtime|Chat dan notifikasi real-time tetap tersinkron selama pengujian|Terpenuhi|`);
R(PIC("[ TEMPATKAN GAMBAR 4.41 DI SINI ]"), "@@PH|x4.40|Tangkapan layar Halaman Beranda aplikasi Bloemen pada perangkat Oppo A3X (Android 15).");
R("Dashboard dan rekap laporan PDF menampilkan data", "Dashboard dan rekap penjualan Excel menampilkan data");
R("|6|Dashboard & rekap PDF akurat|", "|6|Dashboard & rekap Excel akurat|");
R(/~~[^~]*~~/g, "");
R("dashboard dan rekap<br>PDF; Capacitor Android|", "dashboard dan rekap<br>Excel; Capacitor Android|");
R("API, jsPDF, dan Capacitor Android|", "API, SheetJS (xlsx), dan Capacitor Android|");
R("kompatibilitas 4 perangkat lulus|", "kompatibilitas 4 butir pada Oppo A3X terpenuhi|");
R("|Android 10 (API 29) hingga Android 13 (API 33), seluruhnya lulus<br>uji|", "|Berjalan baik pada Oppo A3X dengan Android 15 (API 35); target minimum Android 10 (API 29)|");
R("aksesibilitas 7/8 butir;<br>kompatibilitas 4 perangkat|", "aksesibilitas 7/8 butir;<br>kompatibilitas 4/4 butir pada Oppo A3X|");
// Oppo screenshots (Gambar 4.26): replace the two OCR blocks before its caption
R(/<!-- Start of picture text -->\n© Kembalt<br>on[\s\S]*?<!-- End of picture text -->\s*<!-- Start of picture text -->\n© Kembalt<br>Produk[\s\S]*?<!-- End of picture text -->/, "@@IMG2|WhatsApp_Image_2026-09-21_at_01.44.42.jpeg|WhatsApp_Image_2026-09-21_at_01.44.43.jpeg");
R("**Gambar 4.26** Hasil Pencarian Referensi Desain dengan Kata Kunci Bahasa Indonesia", "**Gambar 4.26** Halaman Referensi Desain pada Oppo A3X: (a) Pencarian dan Toko Bunga Terdekat, (b) Hasil Produk Toko + Wikimedia Commons");


// ---------- REVISI: kesesuaian tabel evaluasi iterasi dengan gambar ----------
// Wireframe v01.0 (Gambar 4.1–4.4, dibuat ulang di _gen_charts.mjs) kini memuat
// penanda bernomor yang sama dengan nomor temuan pada Tabel 4.1; setiap temuan
// juga merujuk ke gambar bukti implementasinya. Nomor gambar ditulis dengan
// penomoran sumber (sebelum renumbering otomatis di bawah).
R("**Gambar 4.1** Wireframe Halaman Beranda Sisi Pembeli", "**Gambar 4.1** Wireframe Halaman Beranda Sisi Pembeli (v01.0)");
R("**Gambar 4.2** Wireframe Alur Registrasi Penjual", "**Gambar 4.2** Wireframe Alur Registrasi Penjual (v01.0)");
R("**Gambar 4.3** Wireframe Alur Pemesanan Pembeli", "**Gambar 4.3** Wireframe Alur Pemesanan Pembeli (v01.0)");
R("**Gambar 4.4** Wireframe Sidebar Navigasi Penjual", "**Gambar 4.4** Wireframe Sidebar Navigasi Penjual (v01.0)");
R(/(Wireframe dirancang untuk 17 halaman utama aplikasi[^\n]*)/, `$1

Empat wireframe yang menjadi fokus evaluasi iterasi pertama disajikan pada Gambar 4.1 sampai Gambar 4.4. Gambar tersebut menggambarkan rancangan v01.0 sebelum diperbaiki. Bagian yang mendapat temuan dari responden diberi penanda bernomor merah (1 sampai 5) yang sama dengan nomor temuan pada Tabel 4.1, sedangkan hasil perbaikannya ditunjukkan oleh tangkapan layar aplikasi yang dirujuk pada kolom Bukti Implementasi. Pada v01.0, navigasi bawah pembeli terdiri atas tab Beranda, Toko, Pesanan, Chat, dan Profil, karena tab Referensi baru ditambahkan pada iterasi ketiga. Sidebar penjual v01.0 (Gambar 4.4) juga belum memuat menu Dashboard dan Rekap Penjualan, karena kedua fitur tersebut merupakan hasil evaluasi iterasi kedua (Tabel 4.3); pada iterasi ini sidebar penjual tidak mendapat temuan perubahan.`);
R(/Tabel 4\.1 Hasil Evaluasi dan Tabel Perubahan Prototipe v01\.0\s*\n\n\|\*\*No\*\*\|\*\*Temuan Responden\*\*[\s\S]*?\n\nBerdasarkan hasil evaluasi v01\.0, penulis mencatat lima poin perubahan[^\n]*/, `Tabel 4.1 Hasil Evaluasi dan Tabel Perubahan Prototipe v01.0

|**No**|**Temuan Responden (Acuan Wireframe)**|**Perubahan yang Dilakukan**|**Halaman Terdampak**|**Bukti Implementasi**|**Status**|
|---|---|---|---|---|---|
|1|Kategori pada beranda hanya berupa ikon tanpa teks sehingga tidak jelas bahwa ikon tersebut membuka filter produk (Gambar 4.1, penanda 1)|Setiap kategori ditampilkan sebagai kartu persegi berisi ikon besar dan label teks di bawahnya, dilengkapi tautan "Lihat Semua"|Home.tsx, Categories.tsx|Gambar 4.14|✓|
|2|Tombol "Pre-Order" dan "Chat Penjual" berdampingan tanpa jarak dengan ukuran yang sama sehingga mudah salah tekan (Gambar 4.3 bagian 2, penanda 2)|Kedua tombol dipindahkan ke bar bawah yang tetap (sticky): tombol Chat menjadi tombol ikon ber-outline di sisi kiri, sedangkan tombol Pre-Order Sekarang menjadi tombol lebar berwarna di sisi kanan dengan jarak antartombol|ProductDetail.tsx|Gambar 4.15|✓|
|3|Form registrasi toko memuat seluruh isian dalam satu halaman panjang sehingga terasa melelahkan (Gambar 4.2 bagian 2, penanda 3)|Form dibagi menjadi dua bagian berurutan, yaitu (1) Info Dasar dan Pilihan Kategori serta (2) Lokasi Peta dan Jam Operasional|ShopRegister.tsx|Gambar 4.11 dan Gambar 4.12|✓|
|4|Kartu toko tidak menampilkan apakah toko sedang buka atau tutup (Gambar 4.1, penanda 4)|Ditambahkan badge hijau "Buka" atau merah "Tutup" yang dihitung otomatis dari jam operasional toko pada kartu Daftar Toko dan halaman Detail Toko|Shops.tsx, ShopDetail.tsx|Gambar 4.35|✓|
|5|Halaman detail toko hanya menampilkan alamat dalam bentuk teks sehingga lokasi toko sulit dibayangkan (Gambar 4.3 bagian 1, penanda 5)|Ditambahkan peta lokasi toko serta tombol "Lihat Peta & Rute" yang membuka halaman peta penuh beserta jarak dari posisi pembeli|ShopDetail.tsx, ShopMap.tsx|Gambar 4.36|✓|

Berdasarkan hasil evaluasi v01.0, penulis mencatat lima poin perubahan yang harus diimplementasikan sebelum memulai konstruksi kode. Setiap poin dapat ditelusuri mulai dari penanda pada wireframe (Gambar 4.1 sampai Gambar 4.3) hingga tangkapan layar hasil implementasinya, dan seluruh perubahan ini menjadi acuan pembangunan prototipe v02.0.`);
R(/\*\*Tabel 4\.3 Hasil Evaluasi dan Tabel Perubahan Prototipe v02\.0\*\*[\s\S]*?(?=\n\nHasil evaluasi v02\.0 menghasilkan)/, `**Tabel 4.3 Hasil Evaluasi dan Tabel Perubahan Prototipe v02.0**

|**No**|**Temuan Responden**|**Perubahan / Fitur Tambahan**|**Modul Terdampak**|**Bukti Implementasi**|**Status**|
|---|---|---|---|---|---|
|1|Tidak ada pemberitahuan saat pesanan baru masuk atau status berubah (harus memuat ulang secara manual)|Implementasi sistem notifikasi in-app dengan ikon lonceng real-time dan toast|Modul Notifikasi (baru)|Gambar 4.19|✓ (v03.0)|
|2|Tidak bisa memberi ulasan setelah pesanan selesai|Implementasi fitur Ulasan & Rating (ReviewForm, ReviewList) beserta trigger pembaruan rating toko|Modul Ulasan (baru)|Gambar 4.21 dan Gambar 4.40|✓ (v03.0)|
|3|Tidak ada cara membuat penawaran harga spesifik dalam chat (hanya teks bebas)|Implementasi Custom Order Quote berupa kartu penawaran terstruktur di sela-sela chat|Modul Penawaran Kustom (baru)|Gambar 4.20|✓ (v03.0)|
|4|Sulit mencari inspirasi desain sehingga harus keluar dari aplikasi ke Google|Implementasi halaman Referensi Desain berisi gambar Wikimedia Commons dan foto produk toko, lengkap dengan pengiriman referensi ke toko|Modul Referensi Desain (baru)|Gambar 4.24 sampai Gambar 4.28|✓ (v03.0)|
|5|Belum ada halaman ringkasan maupun laporan penjualan sehingga penjual masih mencatat secara manual|Penambahan menu Dashboard Penjual pada sidebar serta Rekap Penjualan yang dapat diunduh dalam format Excel (SheetJS)|Modul Dashboard & Rekap (baru)|Gambar 4.29 dan Gambar 4.30|✓ (v03.0)|
|6|Tidak ada fitur diskon produk|Penambahan pengaturan diskon persentase dengan pratinjau harga akhir dan badge Diskon pada kartu produk|ProductsManagement.tsx, ProductDetail.tsx|Gambar 4.22 dan Gambar 4.23|✓ (v03.0)|`);

// ---------- REVISI: referensi React.js pada landasan teori ----------
R("React.js merupakan pustaka JavaScript yang dikembangkan oleh Meta (Facebook) untuk membangun antarmuka pengguna (User Interface) berbasis komponen yang bersifat dinamis dan interaktif.",
  "React.js merupakan pustaka JavaScript yang dikembangkan oleh Meta (Facebook) untuk membangun antarmuka pengguna (User Interface) berbasis komponen yang bersifat dinamis dan interaktif (Banks & Porcello, 2020).");
R("serta kemampuannya dalam membangun aplikasi yang responsif dan mudah dikembangkan.",
  "serta kemampuannya dalam membangun aplikasi yang responsif dan mudah dikembangkan. Setiap komponen React mengelola state-nya sendiri, dan ketika state berubah React hanya memperbarui bagian antarmuka yang terdampak, sehingga tampilan tetap sinkron dengan data (Meta Open Source, 2024).");
R(/(- Ana, W\., Sophan[^\n]*\n)/, "$1\n- Banks, A., & Porcello, E. (2020). _Learning React: Modern Patterns for Developing React Apps_ (2nd ed.). O'Reilly Media.\n");
R(/(\n- Nilasari, D\., Yanto)/, "\n- Meta Open Source. (2024). _React: The library for web and native user interfaces_. Diakses dari https://react.dev/learn\n$1");

// ---------- BAB V ----------
R("### **BAB 5**\n\n### **KESIMPULAN DAN SARAN**", "### **BAB V KESIMPULAN DAN SARAN**");
R(/2\. \*\*Efektivitas Sistem Rekomendasi Berbasis Momen:\*\*\n+Sistem rekomendasi produk[^\n]*/, "2. **Fitur Referensi Desain Bunga:** Halaman Referensi Desain berhasil membantu pembeli menemukan inspirasi rangkaian bunga dengan memadukan gambar dari Wikimedia Commons API dan foto produk toko yang terdaftar di aplikasi. Kata kunci berbahasa Indonesia diterjemahkan otomatis, produk toko yang relevan ditampilkan bersama hasil pencarian, dan gambar terpilih dapat dikirim langsung ke toko melalui chat untuk ditindaklanjuti dengan penawaran harga kustom. Hal ini menjawab rumusan masalah mengenai kesulitan konsumen dalam mencari referensi desain produk bunga.");
R("terhadap 32 skenario fungsional,", "terhadap 39 skenario fungsional (36 skenario black-box dan 3 alur end-to-end),");
R("Pengujian kompatibilitas pada berbagai perangkat Android (versi 10 hingga 13) juga", "Pengujian kompatibilitas pada perangkat Oppo A3X (Android 15) juga");
R("2. **Implementasi Fitur Geolokasi dan Maps:**", "2. **Pelacakan Kurir secara Real-time:**");
R("Sesuai dengan batasan masalah saat ini, fitur lokasi belum diaktifkan. Penambahan fitur", "Aplikasi saat ini telah menyediakan peta lokasi toko, tetapi belum memiliki pelacakan pengiriman. Penambahan fitur");
R(/\nLAMPIRAN\n[\s\S]*$/, "\n### **LAMPIRAN**\n\n@@PH|L|Sisipkan dokumen lampiran (instrumen kuesioner, dokumentasi observasi dan wawancara, serta bukti pendukung lainnya).\n");

// ---------- reviewer revisions (judul, metode, Tabel 2.1, simbol, n=28) ----------
text = text.replace(/<\/?mark>/g, "").replace(/ /g, " ");
const JUDUL = "Rancang Bangun Aplikasi Mobile Marketplace Kreativitas Bunga (Bloemen) di Sulawesi Utara";
R(/Rancang Bangun Aplikasi Marketplace Kreativitas Bunga Berbasis Mobile di Sulawesi Utara/g, JUDUL);
R(/aplikasi _Marketplace_ Kreativitas Bunga Berbasis Mobile di Sulawesi Utara/g, "aplikasi _mobile marketplace_ kreativitas bunga (Bloemen) di Sulawesi Utara");
R(/aplikasi tersebut untuk sementara diberi nama/, "aplikasi tersebut diberi nama");
R(/metode\s+_Prototyping_\s+melalui\s+_Rapid Application Development \(RAD\)_\s*,/, "metode _Rapid Application Development (RAD)_,");
R(/(oleh konsumen maupun pelaku usaha bunga di Sulawesi Utara\.)/, `$1 Oleh karena itu, penelitian ini diberi judul "${JUDUL}".`);
R(/Dalam siklus pengembangan perangkat lunak \(Software[\s\S]*?fleksibilitas perubahan fitur\./,
  "Dalam siklus pengembangan perangkat lunak (Software Development Life Cycle/SDLC), penelitian ini menggunakan metode Rapid Application Development (RAD) sebagai metode pengembangan sistem. RAD dipilih karena kebutuhan pengguna terhadap aplikasi Bloemen belum sepenuhnya terdefinisi secara rinci pada awal penelitian, sehingga diperlukan pengembangan yang cepat dan iteratif dengan melibatkan umpan balik pengguna pada setiap iterasi.\n\nSesuai tahapan RAD, pengembangan dilakukan melalui fase Requirements Planning, User Design, Rapid Construction, dan Cutover. Fase User Design dan Rapid Construction dijalankan secara berulang sehingga fitur dapat diperbaiki berdasarkan evaluasi responden tanpa harus membangun ulang keseluruhan sistem. Metode ini sesuai dengan karakteristik proyek yang membutuhkan hasil cepat dan fleksibilitas perubahan fitur.");
R(/Rapid Application Develop(?:me)?t?ment? \(RAD\) adalah metode pengembangan sistem yang menekankan/, "Rapid Application Development (RAD) merupakan metode pengembangan utama yang digunakan dalam penelitian ini. RAD adalah metode pengembangan sistem yang menekankan");
R(/masingmasing/g, "masing-masing");
R(/harus ≥ hari ini \+ po_duration_days produk/g, "minimal tanggal hari ini ditambah durasi pengerjaan produk (po_duration_days)");
R(/99\.9%/g, "99,9%");
text = text.replace(/≥\s*/g, "minimal ").replace(/≤\s*/g, "maksimal ").replace(/\\~/g, " ");
R(/_Tabel 2\. 1 Penelitian[\s\S]*?(?=##### \*\*2\.2 Dasar Teori\*\*)/, [
  "_Tabel 2.1 Penelitian-Penelitian Terkait_", "",
  "|No|Penulis|Tahun|Judul Penelitian|Keterkaitan dengan Penelitian|", "|---|---|---|---|---|",
  "|1|Wahyu Ridhoni, Meta Agustina Anggraini|2023|Pembangunan Aplikasi _Mobile_ Untuk Pencatatan Dan Laporan _Pre-Order_ UMKM Kuliner|Aplikasi jurnal membantu pelaku UMKM kuliner dalam mencatat dan memproses pesanan secara terstruktur, yang dapat ditransfer ke sistem manajemen pesanan _Bloemen_.|",
  "|2|Wahyu Ana, Tiara Dwi Fulandari Sophan, Choirun Nisa, Diah Ayu Sanggarwati|2021|Pengaruh Pemasaran Media _Online_ dan _Marketplace_ Terhadap Tingkat Penjualan Produk UMKM CN Collection di Sidoarjo|Penggunaan platform online membutuhkan antarmuka yang mudah dipahami. Hal ini penting untuk memastikan transaksi berjalan lancar, sebagaimana terlihat dari keberhasilan peningkatan penjualan CN Collection melalui media online dan marketplace.|",
  "|3|Rista Afifah Umar, Lasmedi Afuan, Arief Kelik|2022|Rancang Bangun _Marketplace_ Penjualan Jajanan dan Makanan di Lingkungan Kampus dan Mahasiswa (Studi Kasus Fakultas Teknik Unsoed)|Sama seperti aplikasi kampus, _Bloemen_ membutuhkan sistem pemesanan yang sederhana dan bebas kesalahan, yang terbukti efektif melalui pengujian black-box.|",
  "|4|Oryz Agnu Dian Wulandari, Ujiani, Nita Riskiana Putri|2020|Analisis Pemanfaatan _Marketplace_ Dalam Meningkatkan Pendapatan Bagi Penjualan Produk UMKM Di Purbalingga|Sama seperti studi Purbalingga, aplikasi _Bloemen_ ditujukan untuk memberdayakan UMKM lokal di Sulawesi Utara (penjual produk bunga) dengan pendekatan digital yang terstruktur dan terpusat.|",
  "|5|Roby Satria, Imam Ahmad, Rakhmat Dedi Gunawan|2023|Rancang Bangun E-Marketplace Berbasis Mobile Untuk Meningkatkan Pelayanan Penjualan|Jurnal menyebut antarmuka mobile marketplace cukup ramah dan mudah digunakan, yang juga menjadi tujuan desain UI/UX _Bloemen_.|",
  "|6|Heynindy Desisafitra, Ika Prama Dewi, Vera Irma Delianti, Mahesi Agni Zaus|2024|Rancang Bangun Mobile Commerce Berbasis Android Pada Toko Bunga Hy Buckett Florist Padang|Desain UI prototipe yang informatif dan terstruktur menunjukkan strategi layout yang intuitif untuk menampilkan katalog buket pada _Bloemen_.|",
  "|7|Brilian Adiguna Riyanto, Ardian Abdul Hanan, Ratna Nur Aeni Fillah, Mohammad Iqbal, S.Kom, M.T.|2024|Recording, Sales, and Management of Cake Shop UMKM Using a Native Web-Based Website|Aplikasi cake shop menyediakan mekanisme pencatatan pesanan, penjualan, dan stok. _Bloemen_ dapat mengadopsi fitur serupa melalui dashboard pencatatan transaksi secara digital.|",
  "|8|Tina Martina, Irfandhani Fauzi, Ursae Pramesvari, Akbar Ramadhan, Lily Nafisa Asri|2024|Perancangan _Order Management System_ Berbasis _Web Application_ untuk IKM Garmen|Sistem menyimpan data order secara sistematis hingga laporan, yang akan meningkatkan efisiensi operasional penjual di platform _Bloemen_.|",
  "", ""].join("\n"));
R(/<!-- Start of picture text -->\nPlanning aa[\s\S]*?<!-- End of picture text -->/, "@@DIAG|g2_1_rad.png");
R("_Gambar 2. 1 Tahapan RAD_", "_Gambar 2.1 Tahapan Rapid Application Development (RAD)_");
R(/_Keterangan: \* satu responden tidak mengisi butir ini, sehingga skor maksimum butir tersebut dihitung dari 27 responden\._/,
  "_Keterangan: jumlah responden pembeli adalah 28 orang (n = 28). * Pada butir 2 (kesulitan menemukan lokasi toko), satu responden tidak mengisi jawaban, sehingga butir tersebut dihitung dari 27 responden (skor maksimum 135); butir lainnya dihitung dari 28 responden (skor maksimum 140)._");
R("3. Sisi pembeli (28 responden):", "3. Sisi pembeli (28 responden; khusus butir 2 tentang lokasi toko dihitung dari 27 responden karena satu responden tidak mengisi):");
text = text.replace(/\(Gambar perlu digambar ulang sesuai isi ini\.\)/g, "");

// ---------- figure renumbering ----------
const map3 = { 1: 2, 2: 3, 3: 4, 6: 5, 7: 6, 8: 7, 9: 8, 10: 9 };
text = text.replace(/(Gambar|GAMBAR)(\s+)3\.(\d+)/g, (m, g, s, n) => `${g}${s}3.${map3[n] ?? n}`);
text = text.replace(/§1/g, "3.1");
text = text.replace(/(Gambar|GAMBAR)(\s+)4\.(\d+)/g, (m, g, s, n) => `${g}${s}4.${+n >= 7 ? +n - 1 : n}`);
// architecture caption follows @@ARCH
// generic: fix split codes in tables
text = text.replace(/(FR|E2E|NFR)-(\d)<br>(\d)/g, "$1-$2$3");

// ---------- table overrides (by number) ----------
const OVR = {
  "3.2": [["No", "Perangkat", "Spesifikasi / Fungsi"],
    ["1", "Laptop (Perangkat Pengembangan)", "Prosesor Intel Core i5 Gen 12, RAM 16 GB, SSD 512 GB, OS Windows 11 — digunakan untuk seluruh proses coding, konfigurasi Supabase, dan build APK"],
    ["2", "Oppo A3X (Perangkat Uji)", "Model CPH2641, Android 15 (API 35), RAM 4 GB — satu-satunya perangkat fisik untuk pengujian fungsional, performa, aksesibilitas, dan kompatibilitas"],
    ["3", "Router Wi-Fi", "Koneksi internet minimum 10 Mbps untuk pengujian fitur real-time Supabase"]],
  "3.3": [["No", "Perangkat Lunak", "Versi", "Fungsi"],
    ["1", "Node.js", "v20.x (LTS)", "Runtime JavaScript untuk menjalankan Vite dan toolchain pengembangan"],
    ["2", "Vite", "v5.x", "Build tool dan development server yang cepat untuk proyek React + TypeScript"],
    ["3", "React", "v18.x", "Library utama membangun antarmuka pengguna berbasis komponen"],
    ["4", "TypeScript", "v5.x", "Superset JavaScript dengan static typing untuk keamanan kode"],
    ["5", "Tailwind CSS", "v4.x", "Utility-first CSS framework untuk desain UI yang cepat dan konsisten"],
    ["6", "Supabase", "Cloud (Platform)", "Backend as a Service: PostgreSQL, Auth, Storage, Realtime"],
    ["7", "Capacitor", "v6.x", "Framework untuk mengemas aplikasi web React menjadi APK Android native"],
    ["8", "Android Studio", "Hedgehog (2023.1)", "IDE untuk build dan compile APK Android dari proyek Capacitor"],
    ["9", "Visual Studio Code", "v1.88+", "Editor kode utama untuk penulisan seluruh kode aplikasi"],
    ["10", "Figma", "Web App", "Alat desain wireframe dan prototipe UI sebelum implementasi"],
    ["11", "Wikimedia Commons API", "MediaWiki Action API (REST)", "API publik tanpa API key untuk mengambil gambar inspirasi desain bunga secara dinamis"],
    ["12", "SheetJS (xlsx)", "v0.18.x", "Pustaka JavaScript untuk menghasilkan berkas Excel (.xlsx) rekap penjualan"],
    ["13", "React Router DOM", "v6.x", "Library untuk manajemen routing halaman pada aplikasi React SPA"],
    ["14", "Git + GitHub", "v2.x", "Version control untuk mencatat seluruh iterasi perubahan kode"]],
  "4.29": [["No", "Sumber", "Temuan Pengujian UAT", "Kode FR", "Modul Implementasi", "Status"],
    ["1", "B", "Sulit mencari toko bunga terdekat (64,3%); fitur lokasi dinilai paling penting (indeks 94,1%)", "FR-03, FR-07", "Registrasi toko dengan InteractiveMap; halaman Shops dan ShopMap", "Terpenuhi"],
    ["2", "B", "Sulit mencari referensi desain bunga (39,3%); rekomendasi model bunga menjadi fitur prioritas ke-1 (92,9%)", "FR-15", "Halaman Referensi Desain (Wikimedia Commons dan foto produk toko)", "Terpenuhi"],
    ["3", "B", "Pilihan produk terbatas (35,7%) dan tidak ada katalog yang jelas (21,4%)", "FR-04, FR-07", "Katalog produk dengan variasi ukuran S–XL, pencarian, dan filter kategori", "Terpenuhi"],
    ["4", "B", "Sulit membandingkan antar toko (25,0%) dan harga tidak transparan (17,9%)", "FR-04, FR-06, FR-14", "Kartu toko dengan rating dan status buka; harga per ukuran; badge diskon; ulasan", "Terpenuhi"],
    ["5", "B", "Kebutuhan komunikasi langsung dengan penjual (82,1%)", "FR-11, FR-13", "Chat real-time dan penawaran harga kustom", "Terpenuhi"],
    ["6", "B", "Kebutuhan pelacakan status pesanan (50,0%)", "FR-09, FR-12", "Riwayat pesanan pembeli dan notifikasi in-app real-time", "Terpenuhi"],
    ["7", "B", "Kesulitan pemesanan karena waktu mepet (89,3%); kebutuhan pre-order (indeks 72,9%)", "FR-05, FR-08", "Modul Pre-Order dengan validasi durasi pengerjaan produk", "Terpenuhi"],
    ["8", "B", "Kebutuhan informasi jadwal wisuda atau acara (indeks 77,9%; prioritas terendah 21,4%)", "—", "Belum diimplementasikan pada versi v03.0", "Pengembangan lanjutan"],
    ["9", "J", "Registrasi dan login sesuai peran dinilai mudah (indeks 95,00%)", "FR-01, FR-02", "AuthContext, halaman Register dan Login, guard rute", "Terpenuhi"],
    ["10", "J", "Manajemen produk dan varian harga dinilai mudah (indeks 97,50%)", "FR-04, FR-05, FR-06", "ProductsManagement dengan variasi ukuran, Pre-Order, dan diskon", "Terpenuhi"],
    ["11", "J", "Chat real-time (93,75%) dan notifikasi (95,00%) berjalan baik", "FR-11, FR-12", "ChatRoom dengan Supabase Realtime; NotificationBell dengan trigger basis data", "Terpenuhi"],
    ["12", "J", "Respons penawaran kustom sesuai alur (indeks 95,00%)", "FR-13", "CustomOrderQuote dalam alur chat", "Terpenuhi"],
    ["13", "J", "Dashboard dan rekap Excel menampilkan data akurat (indeks 96,25%)", "FR-16", "SellerDashboard dan SalesReport dengan SheetJS (xlsx)", "Terpenuhi"]],
};
const NOFRAG = new Set(["4.24", "4.25"]);

// ---------- parse ----------
const lines = text.split("\n");
const blocks = [];
const cleanInline = (s) => s.replace(/<\/?(mark|u|sup|sub)>/g, "").replace(/\\\*/g, "*");
const strip = (s) => cleanInline(s).replace(/\*\*/g, "").replace(/(^|[\s(])_([^_\n]+?)_(?=[\s.,;:)]|$)/g, "$1$2").replace(/\s+/g, " ").trim();
const tidy = (s) => s.replace(/\(\s+/g, "(").replace(/\s+\)/g, ")").replace(/\s+([.,;:!?])(?=\s|$|\*|_)/g, "$1").replace(/[ \t]+/g, " ").trim();
const capRe = /^(Tabel|Gambar)\s+(\d+)\.(\d+)\s*[—–-]?\s*(.*)$/;
function asCaption(raw) {
  const st = strip(raw);
  const m = st.match(capRe);
  if (!m) return null;
  const decorated = /^(\*\*|_)/.test(raw.trim()) || raw.trim().startsWith("Tabel ");
  if (!decorated || st.length > 220 || /memperlihatkan|menunjukkan|disajikan/.test(m[4])) return null;
  return { type: m[1] === "Tabel" ? "capT" : "capG", num: `${m[2]}.${m[3]}`, title: tidy(m[4]) };
}
function splitCells(l) {
  let s = l.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|");
}
let i = 0;
let lastTableEnd = -2;
while (i < lines.length) {
  const l = lines[i];
  const t = l.trim();
  if (t === "") { i++; continue; }
  if (t.startsWith("@@DIAG|")) { blocks.push({ type: "img", files: ["@" + t.split("|")[1]] }); i++; continue; }
  if (t.startsWith("@@ARCH")) { blocks.push({ type: "arch" }); i++; continue; }
  if (t.startsWith("@@PH|")) { const [, num, desc] = t.split("|"); blocks.push({ type: "ph", num, desc }); i++; continue; }
  if (t.startsWith("@@IMG|")) { blocks.push({ type: "img", files: [t.split("|")[1]] }); i++; continue; }
  if (t.startsWith("@@IMG2|")) { const p = t.split("|"); blocks.push({ type: "img", files: [p[1], p[2]] }); i++; continue; }
  if (t.startsWith("<!-- Start of picture text -->")) {
    let content = "";
    i++;
    while (i < lines.length && !lines[i].includes("<!-- End of picture text -->")) { content += lines[i] + "\n"; i++; }
    content += (lines[i] || "").replace("<!-- End of picture text -->", "");
    i++;
    if (content.includes("TEMPATKAN GAMBAR")) {
      const parts = content.split(/\[ TEMPATKAN GAMBAR /).slice(1);
      for (const p of parts) {
        const num = p.match(/^(\d+\.\d+)/)[1];
        const segs = p.replace(/^\d+\.\d+ DI SINI \]/, "").split("<br>").map((x) => x.trim());
        let desc = []; let cap = null;
        for (const sgm of segs) {
          const mm = sgm.match(/^Gambar\s+(\d+\.\d+)\s+(.*)$/);
          if (mm) cap = { type: "capG", num: mm[1], title: mm[2].trim() };
          else if (sgm) desc.push(sgm);
        }
        blocks.push({ type: "ph", num, desc: desc.join(" ") });
        if (cap) blocks.push(cap);
      }
    } else blocks.push({ type: "ph", num: null, desc: "" });
    continue;
  }
  if (t.startsWith("|")) {
    const tl = [];
    while (i < lines.length && lines[i].trim().startsWith("|")) { tl.push(lines[i]); i++; }
    if (tl.some((x) => x.includes("TEMPATKAN GAMBAR"))) {
      const s = strip(tl.join(" ").replace(/\|/g, " "));
      const m = s.match(/TEMPATKAN GAMBAR (\d+\.\d+) DI SINI \]\s*(.*)/);
      blocks.push({ type: "ph", num: m[1], desc: m[2] });
      continue;
    }
    const rows = tl.filter((x) => !/^\|?\s*:?-{3,}/.test(x.trim())).map(splitCells);
    const prev = blocks[blocks.length - 1];
    if (prev && prev.type === "table" && lastTableEnd === blocks.length - 1 && prev.rows[0].length === rows[0].length) {
      let add = rows;
      const n0 = (c) => strip(c).replace(/<br>/g, " ").toLowerCase().replace(/[^a-z0-9]/g, "");
      if (n0(rows[0][0]) === n0(prev.rows[0][0]) && rows[0].length > 0 && n0(rows[0].join("")).length > 0 && /\*\*|^no$|^kode/.test(rows[0][0].trim().toLowerCase() + (rows[0][0].includes("**") ? "**" : ""))) add = rows.slice(1);
      else if (n0(rows[0].join("")) === n0(prev.rows[0].join(""))) add = rows.slice(1);
      prev.breaks.push(prev.rows.length);
      prev.rows.push(...add);
    } else {
      blocks.push({ type: "table", rows, breaks: [] });
    }
    lastTableEnd = blocks.length - 1;
    continue;
  }
  lastTableEnd = -2;
  const hm = t.match(/^(#{1,6})\s+(.*)$/);
  if (hm) {
    const ht = tidy(strip(hm[2]));
    if (/^(BAB|ABSTRAK|ABSTRACT|KATA PENGANTAR|DAFTAR|LAMPIRAN)\b/i.test(ht)) blocks.push({ type: "h1", text: ht.toUpperCase() });
    else if (/^\d+\.\d+\.\d+/.test(ht)) blocks.push({ type: "h3", text: ht });
    else if (/^\d+\.\d+/.test(ht)) blocks.push({ type: "h2", text: ht });
    else blocks.push({ type: "h4", text: ht });
    i++; continue;
  }
  const cap = asCaption(t);
  if (cap) { blocks.push(cap); i++; continue; }
  let m;
  if ((m = t.match(/^(\d+)[.,]\s+(.*)$/)) && !/^\d+[.,]\d/.test(t)) { blocks.push({ type: "num", n: m[1], text: m[2] }); i++; continue; }
  if ((m = t.match(/^[-•]\s+(.*)$/))) { blocks.push({ type: "bul", text: m[1] }); i++; continue; }
  // paragraph (with merge of broken lines)
  const prev = blocks[blocks.length - 1];
  const cur = cleanInline(t);
  if (prev && ["p", "num", "bul"].includes(prev.type)) {
    const pt = strip(prev.text);
    const ends = /[.:;!?]$/.test(pt);
    if (!ends && (/^[a-z_(]/.test(cur) || /[,\w]$/.test(pt))) { prev.text += " " + cur; i++; continue; }
  }
  blocks.push({ type: "p", text: cur });
  i++;
}

// assign numbers to generic placeholders from following figure caption
for (let k = 0; k < blocks.length; k++) {
  const b = blocks[k];
  if (b.type === "ph" && !b.num) {
    for (let j = k + 1; j < blocks.length && j < k + 6; j++) if (blocks[j].type === "capG") { b.num = blocks[j].num; break; }
  }
  if (b.type === "ph" && b.num === "-") {
    for (let j = k + 1; j < blocks.length && j < k + 6; j++) if (blocks[j].type === "capG") { b.num = blocks[j].num; break; }
  }
}
// replace placeholders with generated diagrams; drop duplicate placeholders
const DMAP = { "4.1": "g4_1", "4.2": "g4_2", "4.3": "g4_3", "4.4": "g4_4", ...Object.fromEntries([41,42,43,44,45,46,47,48,49,50,51].map((n) => ["4." + n, "g4_" + n])), "3.1": "g3_1_kerangka", "3.2": "g3_2_konseptual", "3.3": "g3_3_erd", "3.5": "g3_5_usecase", "3.6": "g3_6_act_registrasi", "3.7": "g3_7_act_preorder", "3.8": "g3_8_act_chat", "3.9": "g3_9_act_status" };
for (let k = 0; k < blocks.length; k++) {
  const b = blocks[k];
  if (b.type !== "ph") continue;
  if (blocks[k + 1] && blocks[k + 1].type === "ph") { blocks.splice(k, 1); k--; continue; }
  if (DMAP[b.num] && blocks[k + 1] && blocks[k + 1].type === "capG") blocks[k] = { type: "img", files: ["@" + DMAP[b.num] + ".png"] };
}
// placeholder for figure captions without anything before them
for (let k = 0; k < blocks.length; k++) {
  if (blocks[k].type === "capG") {
    const p = blocks[k - 1];
    if (!p || !["ph", "img", "arch"].includes(p.type)) { blocks.splice(k, 0, { type: "ph", num: blocks[k].num, desc: "" }); k++; }
  }
}
// architecture caption
const ai = blocks.findIndex((b) => b.type === "arch");

// ---------- table cleaning ----------
function cellClean(c) {
  let s = c.replace(/~~[^~]*~~/g, "").replace(/<\/?(sup|sub|mark|u)>/g, "");
  s = s.replace(/(^|<br>)\s*-\s*<br>/g, "$1\n- ");
  s = s.replace(/(\w)-<br>(\w)/g, "$1-$2");
  s = s.replace(/<br>/g, " ");
  s = s.replace(/(\w)\*\*([^*]+)\*\*(\w)/g, "$1 **$2** $3").replace(/(\w)\*\*([^*]+)\*\*/g, "$1 **$2**").replace(/\*\*([^*]+)\*\*(\w)/g, "**$1** $2");
  s = s.split("\n").map((x) => tidy(x.replace(/[ \t]+/g, " "))).filter((x) => x !== "").join("\n");
  return s.replace(/ratingtoko/g, "rating toko").replace(/kartuproduk/g, "kartu produk");
}
function cleanTable(tb, num) {
  if (OVR[num]) { tb.rows = OVR[num]; tb.clean = true; return; }
  let rows = tb.rows.map((r) => r.slice());
  // header merged with first data row
  const hdr = rows[0];
  const sp = hdr.map((c) => c.match(/^((?:\s*\*\*[^*]*\*\*\s*(?:<br>)?)+)(.*)$/));
  if (sp.every((m) => m) && sp[0][2].replace(/<br>/g, "").trim() !== "" && !sp[0][2].includes("**")) {
    rows = [sp.map((m) => m[1].replace(/<br>$/, "")), sp.map((m) => m[2])].concat(rows.slice(1));
    tb.breaks = tb.breaks.map((b) => b + 1);
  }
  rows = rows.map((r) => r.map(cellClean));
  // empty header column -> merge into previous column
  for (let c = rows[0].length - 1; c > 0; c--) {
    if (strip(rows[0][c]) === "") {
      rows = rows.map((r) => { const nr = r.slice(); nr[c - 1] = [nr[c - 1], nr[c]].filter((x) => x).join(" "); nr.splice(c, 1); return nr; });
    }
  }
  // fragment rows
  if (!NOFRAG.has(num)) {
    const isFrag = (r) => strip(r[0]) === "" && r.some((c) => strip(c) !== "") && !r.some((c) => c.includes("**Total"));
    const out = [rows[0]];
    const brk = new Set(tb.breaks);
    for (let k = 1; k < rows.length; k++) {
      const r = rows[k];
      if (!isFrag(r)) { out.push(r); continue; }
      const next = rows[k + 1];
      const afterBreak = brk.has(k);
      if (!afterBreak && next && !isFrag(next)) {
        rows[k + 1] = next.map((c, j) => [r[j], c].filter((x) => x && x.trim()).join(" "));
      } else if (out.length > 1) {
        const p = out[out.length - 1];
        out[out.length - 1] = p.map((c, j) => [c, r[j]].filter((x) => x && x.trim()).join(" "));
      } else out.push(r);
    }
    rows = out;
  }
  // use-case step / alternative line breaks
  rows = rows.map((r) => {
    if (r.length === 2 && /^(Alur|Alur Utama|Alur Alternatif)/.test(strip(r[0]))) {
      r[1] = r[1].replace(/\s(?=\d{1,2}\.\s+[A-Z"])/g, "\n").replace(/\s(?=(\*\*)?A\d+(\*\*)?\s*\()/g, "\n");
    }
    return r;
  });
  tb.rows = rows.map((r) => r.map((c) => c.replace(/\*\*A(\d+)\*\*\s*\(/g, "**A$1** (")));
}
let curTab = null;
for (let k = 0; k < blocks.length; k++) {
  const b = blocks[k];
  if (b.type === "capT") curTab = b.num;
  if (b.type === "table") { cleanTable(b, curTab || "?"); curTab = null; }
}
// drop header-only tables
for (let k = blocks.length - 1; k >= 0; k--) if (blocks[k].type === "table" && blocks[k].rows.length < 2) blocks.splice(k, 1);

// ---------- render ----------
const FONT = "Times New Roman";
function runs(s, base = {}) {
  s = tidy(cleanInline(s));
  const out = [];
  const re = /\*\*(.+?)\*\*|(^|[\s(\/"“])_([^_\n]+?)_(?=[\s.,;:)"”\/]|$)/g;
  let last = 0, m;
  const push = (txt, o = {}) => { if (txt) out.push(new TextRun({ text: txt.replace(/\*\*/g, ""), font: FONT, ...base, ...o })); };
  while ((m = re.exec(s))) {
    if (m[1] !== undefined) {
      push(s.slice(last, m.index));
      // italics inside bold
      const inner = m[1];
      const parts = inner.split(/(?:^|(?<=[\s(]))_([^_]+?)_(?=[\s.,;:)]|$)/);
      parts.forEach((pt, idx) => push(pt.replace(/_/g, (x) => x), idx % 2 ? { bold: true, italics: true } : { bold: true }));
    } else {
      push(s.slice(last, m.index) + m[2]);
      push(m[3], { italics: true });
    }
    last = re.lastIndex;
  }
  push(s.slice(last));
  return out.length ? out : [new TextRun({ text: "", font: FONT, ...base })];
}
const body = (s) => new Paragraph({ children: runs(s), alignment: AlignmentType.JUSTIFIED, spacing: { line: 360, after: 120 }, indent: { firstLine: 567 } });
const B1 = { style: BorderStyle.SINGLE, size: 4, color: "B9A0A8" };
const HEAD = "7A3B4E", ZEBRA = "F9F1F3";
const BORD = { top: B1, bottom: B1, left: B1, right: B1, insideHorizontal: B1, insideVertical: B1 };
const NOB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const NOBORD = { top: NOB, bottom: NOB, left: NOB, right: NOB, insideHorizontal: NOB, insideVertical: NOB };
const TW = 7937;

function cellParas(txt, header, center) {
  return txt.split("\n").map((ln) => new Paragraph({
    children: runs(ln, { size: 20, ...(header ? { bold: true, color: "FFFFFF" } : /^(✓|Terpenuhi|Lulus)/.test(strip(ln)) ? { color: "2E7D32", bold: true } : /^(✗|Pengembangan lanjutan|Tidak)/.test(strip(ln)) ? { color: "B26A00", bold: true } : {}) }),
    alignment: header || center ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { line: 240, before: 20, after: 20 },
  }));
}
function renderTable(rows) {
  const nc = rows[0].length;
  rows = rows.map((r) => { r = r.slice(); while (r.length < nc) r.push(""); if (r.length > nc) { const extra = r.splice(nc); r[nc - 1] = [r[nc - 1], ...extra].filter((x) => x && x.trim()).join(" "); } return r; });
  const w = [];
  for (let c = 0; c < nc; c++) {
    const lens = rows.map((r) => strip(r[c] || "").length);
    const avg = lens.reduce((a, b) => a + b, 0) / lens.length;
    const mx = Math.max(...lens.map((x, j) => (j === 0 ? Math.min(x, 14) : x)));
    w.push(Math.max(5, Math.min(55, avg * 0.7 + Math.min(mx, 30) * 0.3)) + 2);
  }
  const tot = w.reduce((a, b) => a + b, 0);
  const cw = w.map((x) => Math.round((x / tot) * TW));
  for (let c = 0; c < nc; c++) {
    const lw = Math.max(...rows.map((r) => Math.max(0, ...strip(r[c] || "").split(/\s+/).map((x) => x.length))));
    const need = Math.min(TW / 3, lw * 115 + 260);
    if (cw[c] < need) { const big = cw.indexOf(Math.max(...cw)); cw[big] -= need - cw[c]; cw[c] = need; }
  }
  if (nc === 5 && strip(rows[0][1]) === "Penulis") { const f = [0.06, 0.24, 0.09, 0.29, 0.32]; f.forEach((x, c) => (cw[c] = Math.round(x * TW))); }
  const shortCol = rows[0].map((_, c) => rows.slice(1).every((r) => strip(r[c] || "").length <= 14));
  const twoCol = nc === 2;
  return new Table({
    width: { size: TW, type: WidthType.DXA },
    columnWidths: cw,
    layout: TableLayoutType.FIXED,
    borders: BORD,
    rows: rows.map((r, ri) => new TableRow({
      tableHeader: ri === 0,
      cantSplit: false,
      children: r.map((c, ci) => new TableCell({
        width: { size: cw[ci], type: WidthType.DXA },
        shading: ri === 0 ? { type: ShadingType.CLEAR, fill: HEAD, color: "auto" } : (twoCol && ci === 0) ? { type: ShadingType.CLEAR, fill: "F1E3E7", color: "auto" } : ri % 2 === 0 ? { type: ShadingType.CLEAR, fill: ZEBRA, color: "auto" } : undefined,
        verticalAlign: ri === 0 || shortCol[ci] ? VerticalAlign.CENTER : VerticalAlign.TOP,
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        children: cellParas(ri === 0 ? strip(c) : (twoCol && ci === 0 ? "**" + strip(c) + "**" : c), ri === 0, shortCol[ci]),
      })),
    })),
  });
}
function placeholder(num, desc) {
  const label = num === "L" ? "[ Sisipkan Lampiran ]" : `[ Sisipkan Gambar ${String(num).replace(/^x/, "")} ]`;
  const kids = [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600, after: 120 }, children: [new TextRun({ text: label, bold: true, font: FONT, color: "7F7F7F" })] })];
  if (desc) kids.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: tidy(strip(desc)), italics: true, size: 20, font: FONT, color: "7F7F7F" })] }));
  else kids.push(new Paragraph({ spacing: { after: 600 }, children: [] }));
  const DB = { style: BorderStyle.DASHED, size: 6, color: "7F7F7F" };
  return new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: [TW], borders: { top: DB, bottom: DB, left: DB, right: DB, insideHorizontal: NOB, insideVertical: NOB },
    rows: [new TableRow({ children: [new TableCell({ width: { size: TW, type: WidthType.DXA }, margins: { left: 200, right: 200 }, children: kids })] })] });
}
function archDiagram() {
  const c = (t, span, fill, bold = false, border = true) => new TableCell({
    columnSpan: span, shading: fill ? { type: ShadingType.CLEAR, fill, color: "auto" } : undefined,
    borders: border ? undefined : { top: NOB, bottom: NOB, left: NOB, right: NOB },
    verticalAlign: VerticalAlign.CENTER, margins: { top: 60, bottom: 60, left: 80, right: 80 },
    children: t.split("\n").map((ln, k) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 240 }, children: [new TextRun({ text: ln, font: FONT, size: 18, bold: bold || k === 0 })] })),
  });
  const cw = Array(5).fill(Math.round(TW / 5));
  return new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: cw, borders: BORD, rows: [
    new TableRow({ children: [c("LAPISAN KLIEN (Client Layer)\nAplikasi Android Bloemen (APK) — Capacitor 6 WebView\nReact 18 + TypeScript · React Router · Tailwind CSS v4 · shadcn/ui · Motion\nPlugin native: Geolocation, Filesystem, Share, Browser", 5, "F2DCE5")] }),
    new TableRow({ children: [c("▲▼  LAPISAN KOMUNIKASI (API Layer)\nHTTPS REST API + WebSocket melalui @supabase/supabase-js (token JWT)", 4, null, false, false), c("▲▼  HTTPS GET (JSON)", 1, null, false, false)] }),
    new TableRow({ children: [c("LAPISAN BACKEND — Supabase (Backend as a Service)", 4, "DDEBF7", true), c("LAYANAN EKSTERNAL", 1, "E2EFDA", true)] }),
    new TableRow({ children: [c("Auth\nSesi & JWT, multi-peran", 1, "EEF4FB"), c("PostgreSQL\n10 tabel + Row Level Security", 1, "EEF4FB"), c("Realtime\nChat & notifikasi", 1, "EEF4FB"), c("Storage\nBucket images", 1, "EEF4FB"), c("Wikimedia Commons API (REST API)\nMediaWiki api.php, tanpa API key", 1, "E2EFDA")] }),
  ] });
}
const capPara = (b) => new Paragraph({
  style: b.type === "capT" ? "CaptionTabel" : "CaptionGambar",
  children: [new TextRun({ text: `${b.type === "capT" ? "Tabel" : "Gambar"} ${b.num} `, bold: true, font: FONT }), ...runs(b.title)],
});
const DIAG = "/workspaces/default/code/docs/diagrams/";
const imgRun = (f, w) => {
  const diag = f.startsWith("@");
  const buf = fs.readFileSync(diag ? DIAG + f.slice(1) : IMG + f);
  let dims = f.endsWith(".png") ? [1733, 958] : [720, 1604];
  if (diag) { dims = [buf.readUInt32BE(16), buf.readUInt32BE(20)]; const maxH = 600; if ((w * dims[1]) / dims[0] > maxH) w = Math.round((maxH * dims[0]) / dims[1]); }
  return new ImageRun({ type: f.endsWith(".png") ? "png" : "jpg", data: buf, transformation: { width: w, height: Math.round((w * dims[1]) / dims[0]) } });
};

function render(bs) {
  const out = [];
  for (const b of bs) {
    switch (b.type) {
      case "h1": out.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, children: [new TextRun({ text: b.text, font: FONT })] })); break;
      case "h2": out.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: b.text, font: FONT })] })); break;
      case "h3": out.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: b.text, font: FONT })] })); break;
      case "h4": out.push(new Paragraph({ spacing: { before: 120, after: 120, line: 360 }, children: [new TextRun({ text: b.text, font: FONT, bold: true, italics: true })] })); break;
      case "p": out.push(body(b.text)); break;
      case "num": out.push(new Paragraph({ children: runs(`${b.n}.\t${b.text}`), alignment: AlignmentType.JUSTIFIED, spacing: { line: 360, after: 80 }, indent: { left: 425, hanging: 425 }, tabStops: [{ type: "left", position: 425 }] })); break;
      case "bul": out.push(new Paragraph({ children: runs(`•\t${b.text}`), alignment: AlignmentType.JUSTIFIED, spacing: { line: 360, after: 60 }, indent: { left: 709, hanging: 284 }, tabStops: [{ type: "left", position: 709 }] })); break;
      case "capT": case "capG": out.push(capPara(b)); break;
      case "table": out.push(renderTable(b.rows)); out.push(new Paragraph({ spacing: { after: 120 }, children: [] })); break;
      case "ph": if (DMAP[b.num] && fs.existsSync(DIAG + DMAP[b.num] + ".png")) out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120 }, children: [imgRun("@" + DMAP[b.num] + ".png", 560)] })); else out.push(placeholder(b.num || "?", b.desc)); break;
      case "arch": out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120 }, children: [imgRun("@g3_4_arsitektur.png", 520)] })); out.push(capPara({ type: "capG", num: "3.4", title: "Diagram Arsitektur Sistem Aplikasi Bloemen" })); break;
      case "img":
        if (b.files.length === 1) out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120 }, children: [imgRun(b.files[0], 520)] }));
        else out.push(new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: [TW / 2, TW / 2], borders: NOBORD, rows: [
          new TableRow({ children: b.files.map((f) => new TableCell({ borders: { top: NOB, bottom: NOB, left: NOB, right: NOB }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [imgRun(f, 200)] })] })) }),
          new TableRow({ children: ["(a)", "(b)"].map((t) => new TableCell({ borders: { top: NOB, bottom: NOB, left: NOB, right: NOB }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: t, font: FONT })] })] })) }),
        ] }));
        break;
    }
  }
  return out;
}
// remove architecture caption duplicate from source (old caption mapped to 3.4)
for (let k = 0; k < blocks.length; k++) if (blocks[k].type === "capG" && blocks[k - 1] && blocks[k - 1].type === "arch") { blocks.splice(k, 1); }

const babIdx = blocks.findIndex((b) => b.type === "h1" && b.text.startsWith("BAB I "));
const front = blocks.slice(0, babIdx);
const main = blocks.slice(babIdx);
const kp = front.findIndex((b) => b.type === "h1" && b.text.startsWith("KATA PENGANTAR"));
const frontEnd = front.length;

const listTitle = (t) => new Paragraph({ style: "JudulDaftar", pageBreakBefore: true, children: [new TextRun({ text: t, font: FONT })] });
const tocs = [
  listTitle("DAFTAR ISI"),
  new TableOfContents("Daftar Isi", { hyperlink: true, headingStyleRange: "1-3" }),
  listTitle("DAFTAR TABEL"),
  new TableOfContents("Daftar Tabel", { hyperlink: true, stylesWithLevels: [new StyleLevel("CaptionTabel", 1)] }),
  listTitle("DAFTAR GAMBAR"),
  new TableOfContents("Daftar Gambar", { hyperlink: true, stylesWithLevels: [new StyleLevel("CaptionGambar", 1)] }),
];
const footer = (fmt) => new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT })] })] });
const page = { size: { width: 11906, height: 16838 }, margin: { top: 1701, left: 2268, right: 1701, bottom: 1701 } };

// first h1 in front matter should not page-break (follows blank page section)
const doc_styles = {
    default: { document: { run: { font: FONT, size: 24 }, paragraph: { spacing: { line: 360 } } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 24, bold: true }, paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 360, line: 360 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 24, bold: true }, paragraph: { spacing: { before: 240, after: 120, line: 360 }, keepNext: true, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: FONT, size: 24, bold: true }, paragraph: { spacing: { before: 200, after: 120, line: 360 }, keepNext: true, outlineLevel: 2 } },
      { id: "CaptionTabel", name: "CaptionTabel", basedOn: "Normal", next: "Normal", run: { font: FONT, size: 24 }, paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 200, after: 120, line: 240 }, keepNext: true } },
      { id: "CaptionGambar", name: "CaptionGambar", basedOn: "Normal", next: "Normal", run: { font: FONT, size: 24 }, paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 120, after: 240, line: 240 } } },
      { id: "JudulDaftar", name: "Judul Daftar", basedOn: "Normal", next: "Normal", run: { font: FONT, size: 24, bold: true }, paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 360 } } },
    ],
  };
const doc = new Document({ features: { updateFields: true }, styles: doc_styles,
  sections: [
    { properties: { page }, children: [new Paragraph({ children: [] })] },
    { properties: { page: { ...page, pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN } } }, footers: { default: footer() },
      children: [...render(front), ...tocs] },
    { properties: { page: { ...page, pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } } }, footers: { default: footer() },
      children: render(main) },
  ],
});
// first front-matter heading: new section already starts a page; pageBreakBefore would add a blank page
if (process.env.ONLY464) {
  const a = main.findIndex((b) => b.type === "h3" && b.text.startsWith("4.6.4"));
  const z = main.findIndex((b, k) => k > a && /^h[123]$/.test(b.type));
  const d2 = new Document({ styles: doc_styles, sections: [{ properties: { page }, footers: { default: footer() }, children: render(main.slice(a, z)) }] });
  fs.writeFileSync("/workspaces/default/code/docs/SUBBAB_4.6.4_PENGUJIAN_FUNGSIONAL_LOGCAT.docx", await Packer.toBuffer(d2));
  console.log("4.6.4 blocks", z - a, main.slice(a, z).filter((b) => b.type === "capG" || b.type === "ph").map((b) => b.type + b.num).join(" "));
  process.exit(0);
}
const buf = await Packer.toBuffer(doc);
fs.writeFileSync("/workspaces/default/code/docs/LAPORAN_REVISI_BLOEMEN.docx", buf);
fs.writeFileSync("/tmp/blocks.json", JSON.stringify(blocks.map((b) => (b.type === "table" ? { type: "table", rows: b.rows } : b)), null, 1));
console.log("blocks", blocks.length, "misses", misses.length);
misses.forEach((m) => console.log(" MISS:", m));
