### **RANCANG BANGUN APLIKASI** **_MARKETPLACE_ KREATIVITAS BUNGA BERBASIS** **_MOBILE_ DI SULAWESI UTARA** 

## **PROTOTIPE** 

### **OLEH** 

### **NATALIA KRISTIANI PANGEMANAN NIM: 220211060102** 



<!-- Start of picture text -->
ASS<br>GX<br>= G 3 a<br>ENG i ws<br>YZ (CA<br>ManavO<br><!-- End of picture text -->

## **UNIVERSITAS SAM RATULANGI FAKULTAS TEKNIK JURUSAN TEKNIK INFORMATIKA MANADO 2026** 

### **RANCANG BANGUN APLIKASI MARKETPLACE KREATIVITAS BUNGA BERBASIS MOBILE DI SULAWESI UTARA** 

## **PROTOTIPE** 

**Disusun sebagai salah satu syarat untuk memperoleh gelar Sarjana Komputer pada Program Studi Teknik Informatika di Jurusan Teknik Elektro Fakultas Teknik Universitas Sam Ratulang** 

### **Oleh** 

### **NATALIA KRISTIANI PANGEMANAN NIM: 220211060102** 



<!-- Start of picture text -->
Zen8ooSAM<br>IND<br>I A » is<br>EU2Nw H Ye2<br>7 Al<br>ManavO<br><!-- End of picture text -->

**UNIVERSITAS SAM RATULANGI FAKULTAS TEKNIK JURUSAN TEKNIK INFORMATIKA MANADO** 

**2026** 

### **LEMBAR PENGESAHAN** 

Judul : Rancang Bangun Aplikasi Marketplace Kreativitas Bunga Berbasis Mobile di Sulawesi Utara Bentuk : Prototipe Nama : Natalia Kristiani Pangemanan NIM : 220211060102 Program Studi : Teknik Informatika Jurusan : Elektro 

##### Menyetujui: 

Pembimbing I, Pembimbing II, 

Dirko Gustaafiano Setyadharmaputra , ST, MTI. Ruindungan, S.T., M.Eng. NIP. NIP. 198906242018031001 

##### Ketua Jurusan Elektro 

<u>Alwin M. Sambul, S.T., M.Eng., Ph.D</u> NIP. 197709292005011005 

Tanggal Lulus: DD MMMM YYYY 

### **ABSTRAK** 

Sulawesi Utara merupakan salah satu daerah dengan frekuensi acara formal dan non-formal yang tinggi, sehingga permintaan terhadap produk kreativitas bunga seperti buket, papan bunga, dan krans terus meningkat. Namun, sebagian besar pelaku usaha bunga di Sulawesi Utara masih mengelola promosi dan pemesanan secara manual melalui media sosial dan pencatatan sederhana, sehingga rawan terjadi kesalahan pencatatan dan kesulitan dalam memantau status pesanan, terutama pada periode ramai. Di sisi konsumen, kesulitan menemukan toko bunga terdekat serta referensi desain produk juga menjadi kendala tersendiri. Penelitian ini bertujuan untuk merancang dan membangun aplikasi marketplace kreativitas bunga berbasis mobile bernama Bloemen yang mengintegrasikan katalog produk dengan variasi harga per ukuran, sistem pre-order, komunikasi chat real-time, penawaran harga kustom, serta dashboard dan rekap penjualan otomatis dalam format PDF. Pengembangan aplikasi menggunakan metode _Rapid Application Development (RAD)_ yang terdiri atas tiga siklus iterasi, dengan teknologi _React_ , _TypeScript_ , _Tailwind CSS_ , dan _Capacitor_ pada sisi klien serta _Supabase (PostgreSQL, Auth, Storage,_ dan _Realtime_ ) sebagai _backend_ . Identifikasi kebutuhan dilakukan melalui observasi langsung, kuesioner, dan wawancara terhadap pelaku usaha dan calon konsumen bunga di Sulawesi Utara. Hasil pengujian _Black-Box_ terhadap 39 skenario fungsional menunjukkan tingkat keberhasilan 100% (Valid), dan pengujian kompatibilitas pada perangkat Android versi 15 menunjukkan performa yang stabil. Hasil penelitian ini menunjukkan bahwa aplikasi Bloemen mampu menjawab kebutuhan digitalisasi manajemen pesanan dan pemasaran produk bunga secara lebih sistematis dan efisien bagi penjual maupun pembeli di Sulawesi Utara. 

Kata Kunci: _marketplace_ , kreativitas bunga, _mobile_ , _Rapid Application Development_ , _Supabase_ , _pre-order_ . 

**_ABSTRACT_** 

_Manado City has a high frequency of formal and non-formal events, driving steady demand for flower-based products such as bouquets, flower stands, and wreaths. However, most flower business owners in North Sulawesi still rely on manual promotion and order management through social media and simple bookkeeping, which is prone to recording errors and makes it difficult to track order status, especially during peak periods. On the consumer side, finding nearby flower shops and design references is also a common challenge. This study aims to design and develop a mobile-based flower creativity marketplace application called Bloemen, which integrates a product catalog with size-based price variation, a preorder system, real-time chat communication, custom price offers, an event schedule board, and an automated sales dashboard with PDF export. The application was developed using the Rapid Application Development (RAD) method across three iteration cycles, with React, TypeScript, Tailwind CSS, and Capacitor on the client side, and Supabase (PostgreSQL, Auth, Storage, and Realtime) as the backend. Requirements were identified through direct observation, questionnaires, and interviews with flower business owners and prospective consumers in North Sulawesi. Black-Box testing on 39 functional scenarios showed a 100% (Valid) success rate, and compatibility testing on Android devices version 15 showed stable performance. The results indicate that the Bloemen application successfully addresses the need for a more systematic and efficient digitalization of order management and marketing for both flower sellers and buyers in North Sulawesi._ 

_Keywords: marketplace, flower creativity, mobile, Rapid Application Development, Supabase, pre-order._ 

### **KATA PENGANTAR** 

Kata Pengantar umumnya diawali ucapan syukur, dan berisikan ucapan terima kasih kepada pihak-pihak yang berkontribusi dalam pengerjaan Tugas Akhir. Lihat contoh selengkapnya di Pedoman Penulisan KTIS. Dalam _template_ ini, Kata Pengantar ditulis menggunakan _style_ “ _Front/Backmatter_ : 2. Isi,” sedangkan untuk judul bagian Kata Pengantar menggunakan _style_ “ _Front/Backmatter:_ 1. Judul Bab Tanpa Nomor (TOC).” 

Ucapan terima kasih kepada pihak-pihak yang berkontribusi umumnya dituliskan dalam daftar berurut dengan menyebutkan peran dari yang bersangkutan. Sebagai contoh: 

1. Prof. Dr. Ir. Fabian J. Manoppo, M.Agr., selaku Dekan Fakultas Teknik UNSRAT; 

2. Ir. Yaulie D.Y. Rindengan, S.T., M.M., M.Sc. selaku Pembimbing I; 

3. Brave A. Sugiarso, S.T., M.T., selaku Pembimbing II; 

4. Ir. Alwin M. Sambul, S.T., M.Eng., Ph.D. selaku Ketua Jurusan Teknik Elektro; 

5. Virginia Tulenan, S.Kom., M.TI., selaku Koordinator Program Studi S1 Teknik Informatika; 

6. 

Penulis menyadari bahwa masih banyak terhadap kekurangan didalam penulisan ini yang disebabkan karena terbatasnya kemampuan penulis. Oleh sebab itu, segala bentuk masukan dan kritik yang membangun sangat diharapkan untuk meningkatkan kualitas tulisan ini. Semoga Tugas Akhir ini memberikan manfaat bagi banyak orang. 

Manado, DD MMMM YYYY 

Penulis 

### **DAFTAR ISI** 

|**ABSTRAK................................................................................................................................. 4**|
|---|
|**ABSTRACT...............................................................................................................................5**|
|**BAB 1  PENDAHULUAN......................................................................................................10**|
|1.1  Latar Belakang...................................................................................................................10|
|1.2  Rumusan Masalah..............................................................................................................12|
|1.3  Batasan Masalah................................................................................................................12|
|1.4  Tujuan Tugas Akhir............................................................................................................12|
|1.5  Manfaat Tugas Akhir..........................................................................................................13|
|**BAB 2  LANDASAN TEORI.................................................................................................14**|
|2.1  Penelitian Terkait...............................................................................................................14|
|2.2  Teori................................................................................................................................... 17|
|2.2.1  Marketplace Digital..................................................................................................17|
|2.2.2  Kreativitas Produk Bunga dalam UMKM................................................................18|
|2.2.3  User Interface (UI) dan User Experience (UX)........................................................19|
|2.2.4  Fitur Referensi Desain (Berbasis API Unsplash)......................................................20|
|2.2.5  Sistem Manajemen Pemesanan.................................................................................21|
|2.2.6  Capacitor...................................................................................................................21|
|2.2.7  Rapid Application Development (RAD)...................................................................23|
|2.2.8  React.Js.....................................................................................................................23|
|2.2.9  Tailwind CSS............................................................................................................25|
|2.2.10  Android Studio........................................................................................................25|
|2.2.11  Supabase..................................................................................................................26|
|**BAB 3  METODOLOGI PELAKSANAAN.........................................................................26**|
|3.1  Tempat dan Waktu Pelaksanaan.........................................................................................26|
|3.2  Alat dan Bahan...................................................................................................................27|
|3.2.1  Perangkat Keras........................................................................................................27|
|3.2.2  Perangkat Lunak.......................................................................................................28|
|3.3  Model Konseptual dan Logical Model..............................................................................29|
|3.3.1  Model Konseptual.....................................................................................................29|
|3.3.2  Logical Model...........................................................................................................31|
|3.4  Arsitektur Sistem................................................................................................................33|
|3.4.1  Diagram Arsitektur Sistem........................................................................................33|
|3.5  Analisis dan Identifikasi Kebutuhan..................................................................................34|
|3.5.1  Metode Pengumpulan Data.......................................................................................34|
|3.5.2  Daftar Kebutuhan Fungsional...................................................................................35|
|3.5.3  Daftar Kebutuhan Non-Fungsional...........................................................................36|
|3.6  Perancangan Use Case....................................................................................................... 36|
|3.6.1  Deskripsi Use Case...................................................................................................37|
|3.7  Perancangan Activity Diagram..........................................................................................43|



|3.8  Metode Pengembangan: Rapid Application Development................................................47|
|---|
|**BAB 4  HASIL DAN PEMBAHASAN..................................................................................49**|
|4.1  Hasil Pengambilan Data (Observasi, Kuesioner, dan Wawancara)...................................49|
|4.2  Pembuatan Aplikasi...........................................................................................................49|
|4.3  Iterasi Pertama — Prototipe Wireframe (Versi v01.0).......................................................50|
|4.3.1  Fase Identifikasi Kebutuhan Iterasi 1.......................................................................50|
|4.3.2  Desain Wireframe Halaman Utama..........................................................................50|
|4.3.3  Evaluasi Prototipe v01.0 (Pengambilan Data Iterasi 1)............................................51|
|4.4  Iterasi Kedua — Prototipe Fungsional (Versi v02.0).........................................................52|
|4.4.1  Inisialisasi Proyek dan Lingkungan Pengembangan.................................................52|
|4.4.2  Instalasi dan Konfigurasi Tailwind CSS v4 serta shadcn/ui.....................................54|
|4.4.3  Pembangunan Sistem Routing dan Layout Shell......................................................54|
|4.4.4  Integrasi Backend Supabase.....................................................................................55|
|4.4.5  Pembangunan Sistem Autentikasi Multi-Peran........................................................56|
|4.4.6  Pembangunan Modul Manajemen Toko...................................................................58|
|4.4.7  Pembangunan Modul Katalog Produk......................................................................59|
|4.4.8  Pembangunan Halaman Beranda dan Katalog Produk Pembeli...............................60|
|4.4.9  Pembangunan Modul Pre-Order dan Manajemen Pesanan......................................61|
|4.4.10  Pembangunan Fitur Chat Real-time........................................................................62|
|4.4.11  Error yang Ditemui dan Cara Penyelesaiannya pada Iterasi Kedua.......................63|
|4.4.12  Evaluasi Prototipe v02.0 (Pengambilan Data Iterasi 2)..........................................64|
|4.5  Iterasi Ketiga — Versi Final (Versi v03.0 / v1.0.0)...........................................................65|
|4.5.1  Identifikasi Kebutuhan Iterasi Ketiga.......................................................................65|
|4.5.2  Implementasi Sistem Notifikasi In-App...................................................................66|
|4.5.3  Implementasi Fitur Penawaran Harga Kustom (Custom Order Quotes)..................66|
|4.5.4  Implementasi Fitur Ulasan dan Rating.....................................................................67|
|4.5.5  Implementasi Fitur Diskon Produk...........................................................................68|
|4.5.6  Implementasi Galeri Inspirasi Desain (Unsplash API).............................................69|
|4.5.7  Implementasi Dashboard Penjual dan Rekap Penjualan PDF..................................70|
|4.5.8  Pembungkusan Aplikasi ke Android dengan Capacitor............................................71|
|4.5.9  Error yang Ditemui dan Cara Penyelesaiannya pada Iterasi Ketiga.........................73|
|4.6  Evaluasi Akhir — Pengujian dan Implementasi................................................................74|
|4.6.1  Pengujian Antarmuka Sisi Pembeli (Customer).......................................................74|
|4.6.2  Pengujian Antarmuka Sisi Penjual (Seller)...............................................................75|
|4.6.3  Pengujian Black-Box (Evaluasi Fungsional)............................................................76|
|4.6.4  Pengujian Kompatibilitas Multi-Perangkat...............................................................78|
|4.7  Ringkasan Hasil Pembangunan Sistem..............................................................................79|
|**BAB 5  KESIMPULAN DAN SARAN..................................................................................80**|
|5.1  Kesimpulan........................................................................................................................ 80|
|5.2  Saran..................................................................................................................................81|
|**DAFTAR PUSTAKA..............................................................................................................83**|
|**LAMPIRAN.............................................................................................................................85**|



### **DAFTAR TABEL** 

|Tabel 2.1  Penelitian – Penelitian Terkait..................................................................................14|
|---|
|Tabel 3.1  Jadwal Pelaksanaan Penelitian.................................................................................27|
|Tabel 3.2  Perangkat Keras yang Digunakan............................................................................27|
|Tabel 3.3  Perangkat Lunak yang Digunakan...........................................................................28|
|Tabel 3.4  Logical Model — Daftar Entitas dan Atribut Kunci................................................31|
|Tabel 3.5  Daftar Kebutuhan Fungsional Sistem......................................................................35|
|Tabel 3.6  Daftar Kebutuhan Non-Fungsional Sistem..............................................................36|
|Tabel 3.7  Deskripsi Use Case UC-01: Registrasi Akun...........................................................37|
|Tabel 3.8  Deskripsi Use Case UC-02: Login Sistem...............................................................38|
|Tabel 3.9  Deskripsi Use Case UC-03: Kelola Profil Toko (Penjual).......................................38|
|Tabel 3.10  Deskripsi Use Case UC-04: Kelola Produk...........................................................39|
|Tabel 3.11  Deskripsi Use Case UC-05: Buat Pesanan Pre-Order............................................39|
|Tabel 3.12  Deskripsi Use Case UC-06: Chat Real-time..........................................................40|
|Tabel 3.13  Deskripsi Use Case UC-07: Kelola Pesanan (Penjual)..........................................41|
|Tabel 3.14  Deskripsi Use Case UC-08: Beri Ulasan dan Rating.............................................41|
|Tabel 3.15  Deskripsi Use Case UC-09: Galeri Inspirasi Desain (Unsplash)...........................42|
|Tabel 3.16  Deskripsi Use Case UC-10: Dashboard dan Rekap Penjualan PDF......................42|
|Tabel 3.17  Rincian Siklus Iterasi RAD....................................................................................48|
|Tabel 4.1  Hasil Evaluasi dan Tabel Perubahan Prototipe v01.0..............................................51|
|Tabel 4.2  Daftar Error dan Penyelesaian pada Iterasi v02.0....................................................63|
|Tabel 4.3  Hasil Evaluasi dan Tabel Perubahan Prototipe v02.0..............................................64|
|Tabel 4.4  Daftar Error dan Penyelesaian pada Iterasi v03.0....................................................73|
|Tabel 4.5  Hasil Pengujian Black-Box — 32 Skenario.............................................................76|
|Tabel 4.6  Hasil Pengujian Kompatibilitas Perangkat..............................................................78|
|Tabel 4.7  Ringkasan Capaian Akhir Sistem Bloemen.............................................................79|



### **DAFTAR GAMBAR** 

|Gambar 2.1  Tahapan RAD.......................................................................................................23|
|---|
|Gambar 3.1  Diagram Model Konseptual Aplikasi Bloemen...................................................31|
|Gambar 3.2  Entity Relationship Diagram (ERD) Aplikasi Bloemen......................................33|
|Gambar 3.3  Diagram Arsitektur Sistem Aplikasi Bloemen.....................................................34|
|Gambar 3.6  Use Case Diagram Lengkap Aplikasi Bloemen...................................................37|
|Gambar 3.7  Activity Diagram — Registrasi Akun..................................................................44|
|Gambar 3.8  Activity Diagram — Proses Pemesanan Pre-Order.............................................45|
|Gambar 3.9  Activity Diagram — Fitur Chat Real-time...........................................................46|
|Gambar 3.10  Activity Diagram — Manajemen Status Pesanan (Penjual)..............................47|
|Gambar 4.1  Wireframe Halaman Beranda Sisi Pembeli..........................................................50|
|Gambar 4.2  Wireframe Alur Registrasi Penjual......................................................................50|
|Gambar 4.3  Wireframe Alur Pemesanan Pembeli...................................................................51|
|Gambar 4.4  Wireframe Sidebar Navigasi Penjual...................................................................51|
|Gambar 4.5  Output Terminal — Inisialisasi Proyek Vite........................................................52|
|Gambar 4.6  Hasil Penerapan Token Desain Tailwind CSS v4................................................54|
|Gambar 4.7  Bottom Navigation Bar Sisi Pembeli...................................................................55|
|Gambar 4.8  Hasil Migrasi Skema Database Awal di Supabase...............................................56|
|Gambar 4.9  Tampilan Halaman Registrasi dengan Toggle Peran............................................57|
|Gambar 4.10  Tampilan Halaman Login dan Pesan Error........................................................58|
|Gambar 4.11  Formulir Registrasi Toko — Info Dasar dan Pilihan Kategori..........................59|
|Gambar 4.12  Formulir Registrasi Toko — Lokasi Peta dan Jam Operasional........................59|
|Gambar 4.13  Form Tambah Produk dengan Variasi Harga per Ukuran..................................60|
|Gambar 4.14  Tampilan Halaman Beranda Sisi Pembeli..........................................................61|
|Gambar 4.15  Tampilan Halaman Detail Produk dengan Size Picker......................................61|
|Gambar 4.16  Halaman Formulir Pre-Order.............................................................................62|
|Gambar 4.17  Halaman Manajemen Pesanan Sisi Penjual.......................................................62|
|Gambar 4.18  Tampilan Fitur Chat Real-time Antara Pembeli dan Penjual.............................63|
|Gambar 4.19  Komponen NotificationBell — Dropdown Notifikasi.......................................66|
|Gambar 4.20  Kartu Penawaran Harga Kustom dalam Alur Chat............................................67|
|Gambar 4.21  Komponen Form Ulasan dan Rating..................................................................68|
|Gambar 4.22  Fitur Pengaturan Diskon Produk dengan Preview Harga Realtime...................69|
|Gambar 4.23  Tampilan Badge Diskon pada Kartu Produk......................................................69|
|Gambar 4.24  Halaman Galeri Inspirasi Desain Bunga (Unsplash).........................................70|
|<br>Gambar 4.25  Tampilan Dashboard Penjual dengan Metrik Bisnis..........................................71|
|Gambar 4.26  Preview PDF Rekap Penjualan yang Dihasilkan Sistem...................................71|
|<br>Gambar 4.27  Output Terminal — Proses Inisialisasi Capacitor Android................................72|
|Gambar 4.28  Proses Build APK di Android Studio.................................................................73|
|Gambar 4.29  File APK Hasil Build dan Aplikasi Terinstal pada Perangkat............................73|
|Gambar 4.30  Tampilan Beranda Aplikasi pada Perangkat Android........................................74|
|Gambar 4.31  Tampilan Daftar Toko dengan Indikator Status Buka........................................74|



|Gambar 4.32  Tampilan Halaman Detail Toko.........................................................................75|
|---|
|Gambar 4.33  Tampilan Halaman Riwayat Pesanan Pembeli...................................................75|
|Gambar 4.34  Sidebar Navigasi Penjual...................................................................................75|
|Gambar 4.35  Halaman Manajemen Produk Penjual................................................................75|
|Gambar 4.36  Halaman Ulasan dan Rating Sisi Penjual...........................................................76|



### **BAB I PENDAHULUAN** 

##### **1.1 Latar Belakang** 

<mark>Perkembangan teknologi informasi dan komunikasi telah membawa perubahan besar dalam berbagai aspek dunia bisnis, termasuk dalam cara melakukan transaksi jual beli. Salah satu inovasi teknologi yang paling berpengaruh adalah kehadiran marketplace digital yang memungkinkan interaksi langsung antara penjual dan pembeli melalui perangkat berbasis web maupun mobile (Wulandari et al., 2020)</mark> . <mark>Kemudahan penggunaan marketplace juga menjadi salah satu faktor yang dapat meningkatkan persepsi manfaat serta penerimaan pengguna terhadap layanan e-marketplace (Purwanto, 2020)</mark> . <mark>Media online dan</mark> _<mark>marketplace</mark>_ <mark>kini menjadi sarana strategis yang menawarkan efisiensi, kemudahan akses, serta kemampuan untuk menjangkau pasar yang lebih luas, sekaligus mendukung proses evaluasi bisnis secara lebih terukur (Ana et al., 2021)</mark> . 

<mark>Salah satu trend bisnis yang berkembang di Sulawesi Utara adalah bisnis penjualan produk kreativitas bunga, seperti buket bunga, papan bunga, bunga hias, krans bunga dan bunga hidup. Produk-produk tersebut memiliki permintaan musiman dan rutin, seperti untuk wisuda, pernikahan, ulang tahun, perayaan keagamaan, dan berbagai acara formal maupun non-formal lainnya. Sulawesi Utara juga sebagai provinsi dengan frekuensi acara yang tinggi, sehingga kebutuhan akan buket bunga juga cenderung stabil dan terus meningkat.</mark> 

<mark>Permasalahan umum yang sering dihadapi sebagian besar penjual buket bunga di Sulawesi Utara adalah masih bergantung pada promosi manual melalui media sosial atau toko fisik yang memiliki keterbatasan jangkauan pesanan. Di sisi lain, penjual juga menghadapi kendala dalam menerima dan memproses pesanan secara sistematis, yang berdampak pada efektivitas pelayanan kepada pelanggan. Kurangnya sistem manajemen pesanan serta antarmuka digital yang ramah pengguna menjadi salah satu faktor penghambat utama dalam pengembangan usaha bunga secara digital.</mark> 

<mark>Berdasarkan hasil observasi langsung pada beberapa toko bunga di Sulawesi Utara, diketahui bahwa proses pemesanan masih dilakukan secara manual melalui</mark> 

_<mark>WhatsApp</mark>_ , _<mark>Instagram</mark>_ <mark>, dan pencatatan sederhana menggunakan buku tulis, catatan pada ponsel, maupun</mark> _<mark>Microsoft Excel</mark>_ <mark>. Kondisi ini menyebabkan potensi terjadinya kesalahan pencatatan, pesanan tertukar, serta kesulitan dalam memantau status pesanan, terutama pada saat jumlah pesanan meningkat.</mark> 

<mark>Hasil kuesioner terhadap pelaku usaha bunga menunjukkan bahwa sebagian besar penjual mengalami kesulitan ketika pesanan menumpuk pada periode ramai serta kesulitan dalam menjangkau pelanggan baru. Mayoritas responden juga menyatakan kebutuhan terhadap fitur katalog produk digital, pencatatan pesanan otomatis, laporan penjualan otomatis, serta sistem pre-order untuk membantu pengelolaan stok, khususnya bunga hidup yang memiliki masa ketahanan terbatas. Selain itu, hampir seluruh responden menyatakan bersedia dan tertarik bergabung apabila tersedia aplikasi marketplace bunga khusus di Sulawesi Utara.</mark> 

<mark>Dari sisi konsumen, hasil kuesioner menunjukkan bahwa pengguna sering mengalami kesulitan dalam menemukan toko bunga terdekat, mencari referensi desain produk bunga, membandingkan toko, serta memperoleh katalog produk yang jelas. Konsumen juga menyatakan bahwa kemudahan pemesanan bunga secara online dan fitur lokasi merupakan hal yang sangat penting. Mayoritas responden menyatakan membutuhkan fitur pencarian produk berdasarkan kategori, referensi desain bunga, komunikasi langsung dengan penjual, pelacakan status pesanan, serta fitur pre-order untuk pemesanan bunga hidup. Sebagian besar responden juga menyatakan tertarik menggunakan aplikasi</mark> _<mark>marketplace</mark>_ <mark>bunga khusus apabila tersedia.</mark> 

<mark>Berdasarkan permasalahan serta temuan dari observasi dan kuesioner tersebut, dibutuhkan sebuah aplikasi</mark> _<mark>mobile</mark>_ <mark>yang mampu menyediakan sistem pemesanan yang terstruktur, fitur referensi desain produk bunga, serta antarmuka pengguna</mark> _<mark>(UI/UX)</mark>_ <mark>yang mudah digunakan oleh konsumen maupun pelaku usaha lokal.</mark> 

<mark>Berdasarkan permasalahan tersebut, pada penelitian ini akan dirancang dan dibangun sebuah aplikasi</mark> _<mark>mobile marketplace</mark>_ <mark>kreativitas bunga sebagai solusi digital untuk memfasilitasi proses penjualan dan pembelian berbagai jenis produk kreativitas bunga secara online di Sulawesi Utara, meliputi buket bunga, papan bunga, bunga hias, krans bunga, dan bunga hidup. Untuk keperluan pengujian dan</mark> 

<mark>pembuatan aplikasi (APK) pada penelitian ini, aplikasi tersebut untuk sementara diberi nama "</mark> _<mark>Bloemen</mark>_ <mark>", yang merupakan hasil revisi atas saran dosen pembimbing dari nama yang sebelumnya diajukan penulis, dengan pertimbangan bahwa kata</mark> _<mark>bloemen</mark>_ <mark>yang dalam bahasa Belanda berarti "bunga-bunga" dinilai lebih merepresentasikan identitas produk sekaligus mudah diingat sebagai nama merek aplikasi. Dengan pendekatan pengembangan sistem menggunakan metode</mark> _<mark>Prototyping</mark>_ <mark>melalui</mark> _<mark>Rapid Application Development (RAD)</mark>_ <mark>, pembangunan aplikasi ini bertujuan menyediakan fitur pemesanan, manajemen pesanan, serta referensi desain produk bunga yang terintegrasi dan mudah digunakan oleh konsumen maupun pelaku usaha bunga di Sulawesi Utara.</mark> 

##### **1.2 Rumusan Masalah** 

1. <mark>Bagaimana merancang dan membangun aplikasi mobile marketplace kreativitas bunga di wilayah Sulawesi Utara yang mampu membantu penjual memasarkan produk secara digital serta menjangkau pelanggan yang lebih luas?</mark> 

2. <mark>Bagaimana merancang sistem pemesanan yang terstruktur untuk membantu penjual mengelola pesanan dan transaksi secara lebih efektif?</mark> 

3. <mark>Bagaimana menyediakan fitur referensi desain produk bunga yang dapat membantu konsumen memilih jenis dan model produk sesuai kebutuhan acara?</mark> 

4. <mark>Bagaimana merancang fitur pre-order untuk membantu penjual mengelola stok bunga hidup yang memiliki masa ketahanan terbatas?</mark> 

5. <mark>Bagaimana merancang antarmuka pengguna (UI/UX) aplikasi yang mudah digunakan oleh konsumen maupun pelaku usaha bunga di Sulawesi Utara?</mark> 

##### **1.3 Batasan Masalah** 

<mark>Agar penelitian lebih terarah dan tidak meluas ke luar dari ruang lingkup pembahasan, maka Batasan masalah dalam penelitian ini ditentukan sebagai berikut:</mark> 

1. Aplikasi yang dikembangkan berupa aplikasi mobile marketplace kreativitas bunga yang digunakan di wilayah Sulawesi Utara. 

2. Fitur utama aplikasi difokuskan pada katalog produk, fitur referensi desain bunga, sistem pemesanan, fitur pre-order, manajemen pesanan, serta komunikasi antara penjual dan pembeli. 

3. Sistem pembayaran dalam penelitian ini tidak mencakup integrasi payment gateway dan hanya disimulasikan sebagai alur pemesanan. 

4. Pengiriman produk tidak mencakup integrasi dengan layanan ekspedisi dan hanya dibatasi pada informasi alamat serta konfirmasi pesanan 

5. Pengujian aplikasi difokuskan pada aspek fungsionalitas sistem dan evaluasi antarmuka pengguna (UI/UX). 

##### **1.4 Tujuan Tugas Akhir** 

<mark>Tujuan dari penelitian ini adalah merancang dan membangun aplikasi mobile marketplace kreativitas bunga yang dapat digunakan di wilayah Sulawesi Utara untuk membantu proses penjualan dan pembelian produk bunga secara digital. Secara khusus, penelitian ini bertujuan untuk menghasilkan sistem pemesanan yang terstruktur guna membantu pelaku usaha dalam mengelola pesanan dan transaksi secara lebih efektif, menyediakan fitur referensi desain produk bunga untuk membantu konsumen dalam memilih produk sesuai kebutuhan acara, serta menghadirkan fitur pre-order untuk membantu penjual dalam mengelola stok bunga hidup yang memiliki masa ketahanan terbatas. Selain itu, penelitian ini juga bertujuan merancang antarmuka pengguna (UI/UX) yang mudah digunakan oleh konsumen maupun pelaku usaha bunga sehingga dapat meningkatkan efisiensi proses transaksi dan pengalaman pengguna dalam penggunaan aplikasi.</mark> 

##### **1.5 Manfaat Tugas Akhir** 

Penelitian ini diharapkan dapat memberikan manfaat bagi berbagai pihak. Bagi pelaku usaha bunga, penelitian ini diharapkan dapat membantu proses pemasaran produk secara digital sehingga mampu memperluas jangkauan pasar di wilayah Sulawesi Utara serta mempermudah pengelolaan pesanan dan transaksi melalui sistem yang lebih terstruktur. Fitur pre-order yang disediakan juga diharapkan dapat membantu penjual dalam mengelola stok bunga hidup sehingga dapat meminimalkan risiko kerugian akibat bunga yang tidak terjual. Bagi konsumen, 

aplikasi yang dikembangkan diharapkan dapat memudahkan proses pencarian dan pemilihan produk kreativitas bunga melalui katalog digital dan fitur referensi desain, serta memberikan kemudahan dalam melakukan pemesanan secara lebih cepat dan praktis. Bagi peneliti, penelitian ini menjadi sarana penerapan ilmu yang telah diperoleh selama perkuliahan, khususnya dalam bidang pengembangan aplikasi mobile, perancangan sistem informasi, dan desain antarmuka pengguna (UI/UX). Selain itu, bagi akademisi dan peneliti selanjutnya, hasil penelitian ini diharapkan dapat menjadi referensi dalam pengembangan penelitian terkait marketplace berbasis mobile maupun digitalisasi UMKM di daerah. 

### **BAB II PENDAHULUAN** 

##### **2.1 Penelitian terkait** 

_Tabel 2. 1 Penelitian – Penelitian Terkait_ 

||**Penulis**|**Tahun**|**Judul Penelitian**|**Keterkaitan dengan**<br>**Penelitian**|
|---|---|---|---|---|
|1.|Wahyu Ridhoni,<br>Meta Agustina|2023|Pembangunan<br>Aplikasi_Mobile_|Aplikasi<br>jurnal<br>membantu<br>pelaku|
||Anggraini||Untuk Pencatatan|UMKM kuliner dalam|
||||Dan<br>Laporan<br>_Pre-Order_|mencatat<br>dan<br>memproses<br>pesanan|
||||UMKM Kuliner|secara terstruktur, yang|
|||||dapat ditransfer ke<br>sistem<br>manajemen<br>pesanan_Bloemen_.|
|2.|Wahyu<br>Ana,|2021|Pengaruh|Penggunaan platform|
||Tiara<br>Dwi||Pemasaran|online membutuhkan|
||Fulandari||Media_Online_dan|antarmuka yang mudah|
||Sophan,||_Marketplace_|dipahami—hal<br>ini|
||Choirun Nisa,||Terhadap Tingkat|penting<br>untuk|
||Diah<br>Ayu||Penjualan Produk|memastikan transaksi|
||Sanggarwati||UMKM<br>CN|dapat berjalan lancar,|
||||Collection<br>di|sebagaimana terlihat|
||||Sidoarjo|dari<br>keberhasilan<br>peningkatan penjualan<br>CN Collection melalui<br>penggunaan<br>media<br>online dan marketplace.|
|3.|Rista<br>Afifah<br>Umar, Lasmedi|2022|Rancang Bangun<br>_Marketplace_|Sama seperti aplikasi<br>kampus,<br> _Bloemen_|
||Afuan,<br>Arief||Penjualan|membutuhkan sistem|



||Kelik||Jajanan<br>dan<br>Makanan<br>di<br>Lingkungan|pemesanan yang simpel<br>dan bebas kesalahan —<br>yang terbukti efektif|
|---|---|---|---|---|
||||Kampus<br>dan<br>Mahasiswa<br>(Studi<br>Kasus<br>Fakultas Teknik<br>Unsoed)|melalui<br>pengujian<br>black‑box.|
|4.|Oryz Agnu Dian<br>Wulandari,|2020|Analisis<br>Pemanfaatan|Sama seperti studi<br>Purbalingga, aplikasi|
||Ujiani,<br>Nita||_Marketplace_|_Bloemen_<br>ditujukan|
||Riskiana Putri||Dalam<br>Meningkatkan<br>Pendapatan Bagi<br>Penjualan Produk<br>UMKM<br>Di<br>Purbalingga|untuk memberdayakan<br>UMKM lokal di<br>Manado (penjual buket<br>bunga),<br>dengan<br>pendekatan digital yang<br>struktural dan terpusat.|
|5.|Roby<br>Satria,<br>Imam Ahmad,|2023|Rancang Bangun<br>E-Marketplace|Jurnal<br>menyebut<br>antarmuka<br>mobile|
||Rakhmat Dedi||Berbasis Mobile|marketplace<br>cukup|
||Gunawan||Untuk<br>Meningkatkan<br>Pelayanan<br>Penjualan|ramah dan mudah<br>digunakan, yang juga<br>menjadi tujuan desain<br>UI/UX di_Bloemen_.|
|6.|Heynindy<br>Desisafitra, Ika|2024|Rancang Bangun<br>Mobile|Desain UI prototipe<br>yang informatif dan|
||Prama Dewi,||Commerce|terstruktur|
||Vera<br>Irma||Berbasis Android|menunjukkan strategi|
||Delianti, Mahesi||Pada Toko Bunga|layout yang intuitif|
||Agni Zaus||Hy<br>Buckett|untuk<br>menampilkan|
||||Florist Padang|katalog buket pada<br>_Bloemen_.|



|7.|Brilian Adiguna|2024|Recording, Sales,|Aplikasi cake|shop|
|---|---|---|---|---|---|
||Riyanto, Ardian||and Management|menyediakan||
||Abdul Hanan,||of Cake Shop|mekanisme pen|catatan|
||Ratna Nur Aeni||UMKM Using a|pesanan, penjuala|n, dan|
||Fillah,||Native<br>Web-|stok._Bloemen_|dapat|
||Mohammad||Based Website|mengadopsi fitur|serupa|
||Iqbal, S.Kom,<br>M.T.|||Dashboard<br>pencatatan tra<br>secara digital.|dan<br>nsaksi|
|8.|Tina Martina,<br>Irfandhani|2024|Perancangan<br>Order|Sistem menyimp<br>order secara sist|an data<br>ematik|
||Fauzi,<br>Ursae||Management|hingga laporan,|yang|
||Pramesvari,||System Berbasis|akan<br>mening|katkan|
||Akbar||Web application|efisiensi oper|asional|
||Ramadhan, Lily||untuk<br>IKM|penjual di pl|atform|
||Nafisa Asri||Garmen|_Bloemen_.||



##### **2.2 Dasar Teori** 

Sub-bab berikut menguraikan landasan teori yang menjadi dasar bagi setiap unsur pada judul penelitian "Rancang Bangun Aplikasi Marketplace Kreativitas Bunga Berbasis Mobile di Sulawesi Utara". Teori Marketplace Digital (2.2.1) menjadi dasar konseptual bagi unsur "Marketplace", yaitu bagaimana platform digital mempertemukan penjual dan pembeli secara daring. Teori Kreativitas Produk Bunga dalam UMKM (2.2.2) mendasari unsur "Kreativitas Bunga", yang menjelaskan karakteristik produk kreatif berbasis bunga sebagai objek penelitian. Teori User Interface/User Experience dan Fitur Referensi Desain (2.2.3–2.2.4) mendukung perancangan antarmuka yang sesuai kebutuhan pengguna. Teori Sistem Manajemen Pemesanan (2.2.5) menjadi dasar bagi fitur pemesanan dan pre-order dalam aplikasi. Adapun teori Capacitor, Rapid Application Development, React.Js, Tailwind CSS, Android Studio, dan Supabase (2.2.6–2.2.11) menjadi dasar teknis dan metodologis bagi unsur "Berbasis Mobile", yakni bagaimana aplikasi dirancang dan dibangun menggunakan teknologi mobile modern. Konteks "Sulawesi Utara" 

sebagai lingkup wilayah penelitian tercermin dalam pembahasan Penelitian Terkait (2.1) serta hasil observasi dan kuesioner terhadap pelaku usaha dan konsumen bunga di Sulawesi Utara yang menjadi acuan identifikasi kebutuhan sistem. 

2.2.1 Marketplace Digital 

Perkembangan teknologi yang pesat menuntut pelaku usaha untuk terus beradaptasi dalam menjalankan kegiatan bisnisnya. Hal ini sejalan dengan pertumbuhan jaringan internet yang semakin luas di Indonesia, yang telah dimanfaatkan dalam berbagai aspek ekonomi, termasuk untuk menyelesaikan pekerjaan, memberikan informasi produk kepada konsumen, serta melakukan aktivitas jual beli secara daring. Perubahan pola perilaku konsumen dalam berbelanja mendorong pesatnya pertumbuhan marketplace digital di Indonesia (Wulandari et al., 2020). Konsumen kini lebih menyukai transaksi online karena dinilai lebih praktis, modern, dan dapat dilakukan kapan saja sesuai kebutuhan. Inovasi digital seperti marketplace memungkinkan terjadinya interaksi langsung antara penjual dan pembeli secara online, baik melalui perangkat berbasis web maupun mobile. Selain sebagai sarana interaksi antara penjual dan pembeli, untuk meningkatkan penjualan, pemanfaatan internet dalam dunia bisnis juga mencakup aktivitas promosi produk dan jasa baru, membangun identitas merek ( _branding_ ). Melalui strategi pemasaran digital, pelaku UMKM diharapkan mampu mengoptimalkan potensi usaha mereka sehingga berdampak pada peningkatan profitabilitas. Profitabilitas sendiri mencerminkan kemampuan suatu usaha dalam memperoleh laba dari berbagai sumber seperti penjualan, aset, kas, dan ekuitas yang dimiliki (Danuta & Murdijaningsih, 2022). 

Marketplace digital juga mendorong pelaku usaha untuk memeanfaatkan fitur-fitur pendukung seperti pencarian produk, pengelompokan berdasarkan kategori, system komunikasi serta manajemen pesanan secara daring. Pengembangan aplikasi marketplace yang berbasis Android dan menggunakan metode Black Box Testing dapat membantu pelaku UMKM dalam memproses transaksi secara lebih sistematis dan mandiri (Dewi et al., 2022). 

Di era digital saat ini, konsumen dari berbagai kelompok usia telah terbiasa menggunakan marketplace untuk memenuhi kebutuhan sehari-hari, termasuk dalam sektor ekonomi kreatif seperti produk bunga. Dengan demikian, pengembangan aplikasi marketplace berbasis mobile sangat relevan dan diperlukan, khususnya untuk membantu pelaku usaha kreatif menjangkau konsumen yang lebih luas dan mempermudah proses transaksi secara digital. 

##### 2.2.2 Kreativitas Produk Bunga dalam UMKM 

Produk berbasis bunga seperti buket, papan bunga, bunga hias, krans, dan bunga hidup merupakan bagian dari subsektor ekonomi kreatif dalam UMKM. Produk ini memiliki nilai estetika dan fungsi simbolis penting dalam berbagai acara sosial, termasuk wisuda, pernikahan, ulang tahun, dan acara keagamaan. Kreativitas desain menjadi kunci utama dalam membedakan produk dan meningkatkan daya saing di pasar local (Cahyani et al., 2024). 

Dalam praktiknya, banyak pelaku UMKM di bidang florist masih mengandalkan promosi manual melalui media sosial atau toko fisik. Hal ini membatasi jangkauan promosi, efisiensi pemesanan, serta dokumentasi portofolio produk. Padahal, digitalisasi bisnis florist dapat menjadi solusi strategis untuk mengelola produk, stok, dan pesanan secara sistematis dan efisien. Transformasi digital yang diterapkan pada usaha florist mampu meningkatkan efisiensi layanan, mempercepat pemrosesan pesanan, serta memperluas jangkauan pelanggan melalui aplikasi Android (Ramadano & Halim, 2025). 

Pengembangan aplikasi khusus florist juga terbukti bermanfaat dalam menampilkan katalog produk, mencatat transaksi, dan mendukung strategi penjualan berbasis kategori acara. Optimalisasi pemasaran digital dan pelatihan keterampilan kreatif kepada pelaku UMKM florist mampu meningkatkan kualitas desain produk dan jumlah penjualan. Inisiatif digital semacam ini mendukung pencapaian branding dan loyalitas pelanggan dalam jangka Panjang (Cahyani et al., 2024). 

Penerapan aplikasi mobile dalam mendukung usaha florist juga tercermin dalam studi oleh (Desisafitra et al., 2024) yang merancang aplikasi berbasis Android untuk Toko Bunga Hy Buckett Florist. Aplikasi tersebut mengintegrasikan katalog buket yang menarik, pemesanan produk, dan pengelolaan transaksi. Pendekatan ini relevan dengan pengembangan aplikasi _Bloemen_ , yang tidak hanya berfungsi sebagai marketplace tetapi juga sebagai ekosistem digital yang mendukung pertumbuhan UMKM florist di Sulawesi Utara. 

Dengan demikian, kreativitas produk bunga perlu didukung oleh sistem digital yang mampu menyesuaikan kebutuhan pelanggan dan mempermudah pelaku usaha dalam mengelola proses bisnis. Pengembangan aplikasi _Bloemen_ menjadi langkah strategis untuk menggabungkan potensi lokal, kreativitas, dan teknologi dalam satu platform yang terstruktur. 

##### 2.2.3 _User Interface (UI)_ dan _User Experience (UX)_ 

User Interface (UI) mencakup elemen visual seperti tata letak, tombol, ikon, warna, serta tipografi yang memengaruhi kejelasan dan daya tarik aplikasi. Sedangkan User Experience (UX) mencerminkan keseluruhan pengalaman pengguna yang mencakup alur navigasi, kecepatan respons, dan kemudahan dalam menyelesaikan tugas (Informatika, 2023). 

Beberapa konsep utama yang menjadi landasan dalam perancangan UI/UX aplikasi ini meliputi: 

- _Responsiveness_ 

desain antarmuka yang cepat merespons input pengguna, seperti tampilan layar yang dinamis dan adaptif terhadap berbagai perangkat. Penelitian oleh Universitas Malikussaleh menunjukkan bahwa antarmuka responsive secara signifikan meningkatkan tingkat keberhasilan dan efisiensi tugas pengguna (Tokopedia, 2020). 

- _Usability_ 

aplikasi harus dirancang agar mudah dipahami dan digunakan. Studi perbandingan pada marketplace Indonesia seperti Shopee, 

Tokopedia, dan Lazada menekankan pentingnya usability dalam meningkatkan kepuasan pengguna (Nilasari et al., 2024). 

##### <mark>2.2.4 Fitur Referensi Desain (Berbasis Wikimedia Commons API)</mark> 

Unsplash merupakan platform yang menyediakan koleksi foto berkualitas tinggi dan bersifat _royalty-free_ dalam jumlah besar, yang dikontribusikan oleh komunitas fotografer dari seluruh dunia dan berfungsi sebagai repositori foto beresolusi tinggi berskala besar yang bebas royalti. Platform ini menyediakan antarmuka pencarian yang memungkinkan pengguna menemukan gambar berdasarkan kata kunci atau tema tertentu , dengan fitur pencarian intuitif yang memudahkan penelusuran gambar berdasarkan kata kunci atau tema spesifik untuk berbagai kebutuhan. Untuk keperluan integrasi ke dalam aplikasi pihak ketiga, Unsplash menyediakan layanan Unsplash API yang bersifat publik, sehingga data gambar dapat diakses dan ditampilkan secara terprogram melalui permintaan HTTP tanpa perlu mengunduh berkas gambar secara manual. Pendekatan ini sejalan dengan konsep arsitektur _web service_ berbasis REST, yaitu arsitektur yang memungkinkan komunikasi data antar sistem melalui protokol jaringan standar sehingga aplikasi pada platform berbeda dapat saling bertukar data secara efisien dan independen terhadap bahasa pemrograman yang digunakan. 

Dalam proyek aplikasi _Bloemen_ , Unsplash API dimanfaatkan sebagai sumber gambar pada fitur Galeri Inspirasi Desain, yang menampilkan referensi visual buket dan rangkaian bunga kepada pengguna tanpa membebani penyimpanan ( _storage_ ) aplikasi dengan berkas gambar statis. Pendekatan ini memungkinkan konten visual tetap bervariasi dan senantiasa terbarukan ( _up-to-date_ ), karena gambar diambil langsung secara _real-time_ dari basis data Unsplash setiap kali fitur tersebut diakses oleh pengguna. 

- 2.2.5 Sistem Manajemen Pemesanan 

Sistem manajemen pemesanan merupakan salah satu komponen penting dalam aplikasi marketplace karena berfungsi untuk mengatur proses 

pemesanan secara digital, mulai dari pengajuan pesanan hingga pemrosesan dan pencatatan transaksi. Dalam konteks aplikasi _Bloemen_ , sistem ini dikembangkan untuk membantu penjual dalam mengelola pesanan secara efisien dan memastikan proses layanan yang cepat, terstruktur, serta terdokumentasi. 

Fitur utama dalam sistem ini meliputi: input data pemesanan (jenis bunga, kategori acara, permintaan khusus), manajemen status pesanan (dipesan, dikonfirmasi, diproses, selesai), notifikasi kepada pengguna, serta sistem pre-order. _Pre-order_ memungkinkan pembeli melakukan pemesanan produk terlebih dahulu dengan waktu pengambilan atau pengiriman yang telah dijadwalkan. Hal ini sangat penting terutama untuk produk berbasis bunga segar, karena memungkinkan penjual mempersiapkan stok sesuai kebutuhan tanpa kelebihan atau kekurangan bahan baku. Aplikasi _pre-order_ jenis ini meningkatkan _efficiency_ operasional UMKM kuliner dan membantu mencegah kerusakan bahan—pendekatan ini relevan sekali untuk florist yang membutuhkan kesiapan stok segar (Ridhoni & Anggraini, 2023) 

Selain itu, sistem memberikan manfaat signifikan seperti peningkatan efisiensi kerja dan kepercayaan pengguna. Aplikasi _mobile_ pemesanan UMKM yang dirancang secara baik meningkatkan efektivitas operasional hingga 86% menurut uji skala kepuasan pengguna (Pratama Putra et al., 2024). 

##### 2.2.6 Capacitor 

Capacitor merupakan native runtime bersifat open-source yang digunakan untuk mengintegrasikan aplikasi berbasis teknologi web ke dalam aplikasi mobile. Capacitor memungkinkan aplikasi yang dikembangkan menggunakan teknologi web untuk dijalankan pada platform mobile serta menyediakan akses terhadap fitur dan API native perangkat melalui mekanisme bridge. Pendekatan tersebut memungkinkan pengembangan aplikasi mobile hybrid dengan memanfaatkan teknologi web dan tetap memperoleh akses terhadap kemampuan perangkat seperti penyimpanan, kamera, notifikasi, dan fitur native lainnya (Schultes et al., 2025). Capacitor 

juga dapat diterapkan pada berbagai framework web, termasuk React, untuk menghasilkan aplikasi mobile pada platform Android maupun iOS. 

Dalam pengembangan aplikasi Bloemen, antarmuka aplikasi dibangun menggunakan React dengan TypeScript. TypeScript digunakan sebagai pengembangan dari JavaScript yang menyediakan fitur static typing, sehingga tipe data dapat ditentukan secara lebih jelas pada proses pengembangan. Penggunaan TypeScript pada aplikasi Bloemen terutama membantu dalam pendefinisian data dan fungsi, sehingga kesalahan tipe data dapat lebih mudah ditemukan selama proses pengembangan. Setelah aplikasi berbasis React selesai dikembangkan, Capacitor digunakan untuk mengintegrasikan aplikasi tersebut ke dalam lingkungan Android. 

Capacitor memungkinkan proyek web yang telah dikembangkan untuk ditambahkan ke platform Android sehingga menghasilkan struktur proyek Android yang dapat dibuka dan dikelola menggunakan Android Studio. Dengan demikian, proses pengembangan antarmuka dan logika aplikasi dapat tetap menggunakan teknologi web seperti React dan TypeScript, sedangkan Capacitor berperan sebagai penghubung antara aplikasi tersebut dengan lingkungan mobile Android. 

Pada penelitian ini, Capacitor digunakan untuk membangun aplikasi Bloemen sebagai aplikasi mobile berbasis Android. Penggunaan Capacitor memungkinkan satu basis kode aplikasi berbasis React dan TypeScript digunakan dalam proses pengembangan, kemudian diintegrasikan ke platform Android untuk menghasilkan aplikasi yang dapat dipasang pada perangkat pengguna. Pendekatan tersebut sesuai dengan konsep pengembangan aplikasi hybrid, yaitu memanfaatkan teknologi web yang dikombinasikan dengan lingkungan native mobile melalui mekanisme bridge. 

##### 2.2.7 Rapid Application Development (RAD) 

Rapid Application Developmet (RAD) adalah metode pengembangan sistem yang menekankan pada pengembangan cepat dan iteratif melalui pembuatan prototipe dan umpan balik langsung dari 

pengguna. Dalam pengembangan aplikasi _Bloemen_ , metode RAD digunakan untuk membangun sistem secara bertahap melalui fase-fase: 

1. Planning: Menentukan dan menguji inti pengguna dan fitur utama aplikasi. 

2. User Design: Membuat dan menguji prototipe UI secara cepat. 

3. Rapid Construction: Implementasi fungsionalitas inti berdasarkan prototipe yang divalidasi. 

4. Cutover: Pengujian sistem secara menyeluruh dan peluncuran aplikasi. 

RAD sangat cocok digunakan dalam pengembangan _Bloemen_ karena memungkinkan tim untuk terus melakukan perbaikan fitur seperti sistem rekomendasi, pre-order, dan papan pengumuman tanpa harus membangun ulang keseluruhan sistem dari awal. 



<!-- Start of picture text -->
Planning aa<br>sours |<br>= ‘Syste<br>inemenon | ‘Sistem, ima|  |<br><!-- End of picture text -->

_Gambar 2. 1 Tahapan RAD_ 

_Sumber Gambar: Dennis, Wixom, & Roth Systems Analysis and Design, 3rd Edition_ 

_Copyright 2006 © John Wiley & Sons, Inc.  All rights reserved_ 

##### 2.2.8 React.Js 

React.js merupakan pustaka JavaScript yang dikembangkan oleh Meta (Facebook) untuk membangun antarmuka pengguna (User Interface) berbasis komponen yang bersifat dinamis dan interaktif. React banyak digunakan dalam pengembangan aplikasi modern karena pendekatan _component-based architecture_ , efisiensi dalam pengelolaan tampilan melalui _Virtual DOM_ , serta kemampuannya dalam membangun aplikasi yang responsif dan mudah dikembangkan. 

Dalam pengembangan aplikasi Bloemen, React digunakan sebagai teknologi utama dalam membangun antarmuka aplikasi mobile melalui pendekatan _cross-platform_ yang diintegrasikan dengan Capacitor. Seluruh tampilan aplikasi seperti halaman katalog produk, referensi desain bunga, proses pendaftaran dan login pengguna, halaman pemesanan, fitur preorder, serta manajemen pesanan dikembangkan menggunakan React.Penggunaan React memungkinkan pengembangan antarmuka yang modular melalui pemisahan komponen-komponen seperti komponen produk, komponen keranjang, komponen pesanan, dan komponen autentikasi. Pendekatan ini mempermudah proses pengembangan secara iteratif sesuai metode Rapid Application Development (RAD), karena setiap komponen dapat dikembangkan, diuji, dan diperbarui secara terpisah tanpa memengaruhi keseluruhan sistem. 

Selain itu, React mendukung pengelolaan _state management_ yang memudahkan sinkronisasi data antara antarmuka aplikasi dengan backend Supabase, baik dalam proses autentikasi pengguna, pengambilan data katalog produk, maupun pengelolaan pesanan secara real-time. Integrasi React dengan Capacitor juga memungkinkan aplikasi web yang dibangun menggunakan teknologi React dapat dijalankan sebagai aplikasi mobile pada platform Android. 

Dengan keunggulan tersebut, React menjadi teknologi yang tepat untuk mendukung pengembangan aplikasi Bloemen yang membutuhkan antarmuka interaktif, fleksibel, dan mudah dikembangkan secara berkelanjutan. 

##### 2.2.9 Tailwind CSS 

Tailwind CSS merupakan _utility-first CSS framework_ yang digunakan untuk membangun antarmuka pengguna secara cepat, konsisten, dan responsif. Berbeda dengan pendekatan CSS tradisional yang menulis gaya secara terpisah, Tailwind menyediakan kumpulan kelas utilitas yang dapat langsung digunakan pada elemen HTML atau komponen React, sehingga mempercepat proses pengembangan antarmuka dan menjaga 

konsistensi desain.Dalam pengembangan aplikasi Bloemen, Tailwind CSS digunakan untuk merancang tampilan antarmuka aplikasi yang modern, responsif, dan mudah dikembangkan. Berbagai halaman utama seperti katalog produk bunga, halaman referensi desain, fitur pencarian dan filter berdasarkan kategori acara, halaman detail produk, keranjang belanja, serta halaman pemesanan dibangun menggunakan kombinasi React dan Tailwind CSS. 

Penggunaan Tailwind CSS memungkinkan pengembang membangun desain yang konsisten melalui sistem _utility classes_ seperti pengaturan warna, tipografi, jarak (spacing), grid, dan _responsive design_ . Pendekatan ini sangat mendukung metode Rapid Application Development (RAD) karena perubahan tampilan dapat dilakukan dengan cepat tanpa perlu menulis stylesheet yang kompleks. 

Selain itu, Tailwind CSS mendukung pengembangan antarmuka yang responsif pada berbagai ukuran layar perangkat mobile. Hal ini penting untuk memastikan aplikasi Bloemen tetap nyaman digunakan pada berbagai perangkat Android yang memiliki resolusi layar berbeda. Dengan demikian, Tailwind CSS berperan penting dalam menciptakan antarmuka aplikasi yang menarik, konsisten, dan mudah dipelihara. 

##### 2.2.10 Android Studio 

Android Studio adalah Integrated Development Environment (IDE) resmi dari Google yang digunakan untuk membangun, menguji, dan membuild aplikasi Android. Android Studio menyediakan alat lengkap seperti sistem build Gradle, Android SDK Manager, emulator Android, serta alat pengujian seperti logcat dan black box testing pada perangkat fisik maupun virtual. 

Dalam proyek pengembangan aplikasi Bloemen, Android Studio tidak digunakan untuk menulis kode antarmuka secara native, melainkan sebagai tooling akhir pada tahap pembungkusan aplikasi (packaging). Setelah aplikasi web dibangun menggunakan React dan TypeScript, framework Capacitor menghasilkan proyek Android beserta konfigurasi 

Gradle di dalam folder android/. Proyek inilah yang dibuka melalui Android Studio untuk dikompilasi menjadi berkas APK melalui menu Build → Build APK(s). Android Studio juga digunakan untuk mengatur permission pada AndroidManifest.xml, menjalankan emulator guna menguji tampilan aplikasi pada berbagai ukuran layar, serta memantau proses build Gradle sebelum APK diinstal pada perangkat fisik. 

##### 2.2.11 Supabase 

Supabase adalah platform _Backend as a Service_ (BaaS) open-source yang menyediakan berbagai layanan backend seperti database PostgreSQL, autentikasi pengguna, penyimpanan file, serta API real-time. Supabase dirancang agar developer dapat membangun dan mengelola backend aplikasi dengan cepat tanpa perlu membangun server secara manual. Dengan pendekatan yang modern dan dokumentasi yang baik, Supabase menjadi alternatif ringan dan fleksibel untuk proyek-proyek berskala kecil hingga menengah. 

Dalam proyek aplikasi _Bloemen_ , Supabase berperan sebagai backend utama untuk menyimpan data penting seperti daftar produk bunga, informasi pengguna, jadwal acara, data pesanan, dan status transaksi. Selain itu, Supabase juga digunakan untuk menangani proses autentikasi seperti registrasi dan login pengguna secara aman. Fitur penyimpanan file dari Supabase dapat dimanfaatkan untuk mengelola gambar produk (misalnya katalog buket bunga) yang ditampilkan pada antarmuka aplikasi. 

### **BAB 3** 

### **METODOLOGI PELAKSANAAN** 

##### **3.1 Tempat dan Waktu Pelaksanaan** 

Penelitian ini dilaksanakan di Kota Manado, Provinsi Sulawesi Utara, dengan lokasi pengambilan data primer berupa observasi dan wawancara dilakukan di satu toko bunga di Kota Manado dan kuisioner kebutuhan disebarkan ke beberapa toko yang tersebar di wilayah di Sulawesi Utara. Proses perancangan dan pengembangan aplikasi dilaksanakan secara mandiri oleh penulis menggunakan perangkat komputer pribadi. Pengujian aplikasi dilakukan pada perangkat Android fisik dan emulator yang tersedia. Waktu pelaksanaan keseluruhan penelitian berlangsung selama enam bulan, dimulai dari tahap identifikasi kebutuhan hingga pengujian dan evaluasi akhir. 

**Tabel 3.1 Jadwal Pelaksanaan Penelitian** 

|**Kegiatan**|**Bulan**<br>**1**|**Bulan**<br>**2**|**Bulan**<br>**3**|**Bulan**<br>**4**|**Bulan**<br>**5**|**Bulan**<br>**6**|**Ket.**|
|---|---|---|---|---|---|---|---|
|Identifikasi &<br>Analisis<br>Kebutuhan|✓|||||||
|Desain UI/UX &<br>Wireframe v01.0|✓|✓||||||
|Evaluasi<br>Responden v01.0||✓||||||
|Konstruksi<br>Prototipe v02.0||✓|✓|||||
|Evaluasi<br>Responden v02.0|||✓|||||
|Pengembangan<br>v03.0 (Final)|||✓|✓||||
|Pengujian &<br>Validasi Final||||✓|✓|||
|Penyusunan<br>Laporan|||||✓|✓||



##### **3.2 Alat dan Bahan** 

##### **3.2.1 Perangkat Keras** 

Perangkat keras yang digunakan dalam penelitian ini mencakup perangkat pengembangan dan perangkat pengujian. Spesifikasi perangkat tersebut disajikan pada Tabel 3.2 berikut. 

**Tabel 3.2 Perangkat Keras yang Digunakan** 

|**No**|**Perangkat**|**Spesifikasi / Fungsi**|
|---|---|---|
|1|Laptop (Perangkat<br>Pengembangan)|Prosesor Intel Core i5 Gen 12, RAM 16 GB, SSD 512<br>GB, OS Windows 11 — digunakan untuk seluruh<br>proses coding, konfigurasi Supabase, dan build APK|
|2|Xiaomi Redmi Note 11<br>(Perangkat Uji Utama)|Android 13, RAM 4 GB, Snapdragon 680 —<br>perangkat fisik untuk pengujian fungsional dan<br>kompatibilitas utama|
|3|Samsung Galaxy A52<br>(Perangkat Uji<br>Tambahan)|Android 12, RAM 6 GB — digunakan untuk uji<br>kompatibilitas multi-perangkat|
|4|Oppo A57 (Perangkat<br>Uji Tambahan)|Android 11, RAM 4 GB — digunakan untuk uji<br>kompatibilitas versi OS lebih lama|
|5|Realme C25 (Perangkat<br>Uji Tambahan)|Android 10, RAM 4 GB — batas minimum<br>kompatibilitas yang diuji|
|6|Router Wi-Fi|Koneksi internet minimum 10 Mbps untuk pengujian<br>fitur real-time Supabase|



##### **3.2.2 Perangkat Lunak** 

Perangkat lunak dan layanan cloud yang digunakan dalam penelitian ini mencakup lingkungan pengembangan, framework, pustaka, dan layanan backend. Seluruh perangkat lunak dipilih berdasarkan kebutuhan fungsional aplikasi Bloemen. 

**Tabel 3.3 Perangkat Lunak yang Digunakan** 

|**No**|**Perangkat Lunak**|**Versi**|**Fungsi**|
|---|---|---|---|
|1|Node.js|v20.x (LTS)|Runtime JavaScript<br>untuk menjalankan Vite<br>dan toolchain<br>pengembangan|
|2|Vite|v5.x|Build tool dan<br>development server yang|



|**No**|**Perangkat Lunak**|**Versi**|**Fungsi**|
|---|---|---|---|
||||cepat untuk proyek<br>React + TypeScript|
||||Library utama<br>|
|3|React|v18.x|membangun antarmuka<br>pengguna berbasis<br>komponen|
|4|TypeScript|v5.x|Superset JavaScript<br>dengan static typing<br>untuk keamanan kode|
||||Utility-first CSS|
|5|Tailwind CSS|v4.x|framework untuk desain<br>UI yang cepat dan<br>konsisten|
||||Backend as a Service:<br>|
|6|Supabase|Cloud (Platform)|PostgreSQL, Auth,<br>Storage, Realtime|
||||Framework untuk<br>|
|7|Capacitor|v6.x|mengemas aplikasi web<br>React menjadi APK<br>Android native|
|8|Android Studio|Hedgehog (2023.1)|IDE untuk build dan<br>compile APK Android<br>dari proyek Capacitor|
||||Editor kode utama untuk|
|9|Visual Studio Code|v1.88+|penulisan seluruh kode<br>aplikasi|
|10|Figma|Web App|Alat desain wireframe<br>dan prototipe UI<br>sebelum implementasi|
||||API eksternal untuk<br>|
|11|Unsplash API|v1|mengambil gambar<br>inspirasi desain bunga<br>secara dinamis|
|12|jsPDF + jspdf-<br>autotable|v2.x|Pustaka JavaScript untuk<br>menghasilkan file PDF<br>rekap penjualan|
||||Library untuk|
|13|React Router DOM|v6.x|manajemen routing<br>halaman pada aplikasi<br>React SPA|
||||Version control untuk|
|14|Git + GitHub|v2.x|mencatat seluruh iterasi<br>perubahan kode|



##### **3.3 Kerangka Pikir** 

Dalam penelitian ini, dibuatlah kerangka pikir (Gambar 3.2) dengan tujuan untuk mengarahkan penelitian. 



<!-- Start of picture text -->
mui ><br>Identfikasi masalah<br>Solusi<br>Anlika! marketplace treativitas bunga mobile<br>{ -Bloemen berbasis React TypeScip & Supabese J<br>Metode pengembangan: RAD<br>Tahap1: Planning<br>Tahap 2; User design<br>Fitur & arstektur sistem<br>L Backend: Supabase (uth DB Storage, Realtime) J<br>Tahap 3: Rapid construction & cutover<br>F Tidak<br>| revstsitomjisi sistem \<—~| sisconseristem sesual; ><br>[«<br>BlackBox testing: Hasi100% valid (2 skenario)<br>L Kompativel Android vers) 10-12 J<br>© Selesai ><br><!-- End of picture text -->

##### **3.4 Model Konseptual dan Logical Model** 

Sebelum masuk ke tahap perancangan teknis, penelitian ini membangun model konseptual dan logical model untuk memastikan pemahaman yang sama terhadap domain masalah dan solusi yang akan dibangun. 

##### **3.4.1 Model Konseptual** 

Model konseptual menggambarkan hubungan antara entitas utama dalam domain bisnis marketplace bunga tanpa memperhatikan detail teknis implementasi. Model ini menjadi dasar pemikiran dalam merancang sistem. 

Konsep utama yang diidentifikasi dalam domain marketplace bunga Bloemen adalah sebagai berikut: 

- Pengguna (User): Terdiri dari dua peran, yaitu Pembeli (Customer) dan Penjual (Seller). Setiap pengguna memiliki identitas unik dalam sistem. 

- Toko (Shop): Entitas yang dimiliki oleh Penjual. Satu Penjual hanya dapat memiliki satu Toko. Toko memiliki atribut seperti nama, kategori spesialisasi, lokasi, dan jam operasional. 

- Produk (Product): Barang yang ditawarkan oleh Toko. Satu Toko dapat memiliki banyak Produk. Produk memiliki variasi harga per ukuran (S, M, L, XL) dan dapat berstatus Ready Stock atau Pre-Order. 

- Pesanan (Pre-Order): Transaksi yang dibuat oleh Pembeli terhadap Produk dari sebuah Toko. Pesanan memiliki siklus status dari pending hingga delivered. 

- Percakapan & Pesan (Chat): Kanal komunikasi real-time antara Pembeli dan Penjual terkait detail pesanan dan koordinasi pembayaran. 

- Ulasan (Review): Penilaian yang diberikan Pembeli setelah pesanan selesai. Setiap pesanan hanya dapat menghasilkan satu ulasan. 

- Notifikasi: Pemberitahuan otomatis kepada pengguna atas kejadian penting (pesanan baru, perubahan status, penawaran). 

- Penawaran Kustom (Custom Quote): Penawaran harga spesifik dari Penjual kepada Pembeli dalam alur percakapan, untuk pesanan di luar katalog standar. 

Model konseptual ini menunjukkan bahwa inti dari sistem adalah hubungan 

antara Pembeli–Pesanan–Produk–Toko–Penjual, dengan Chat, Notifikasi, dan Ulasan sebagai mekanisme pendukung yang menguatkan ekosistem transaksi. 



<!-- Start of picture text -->
© ; Coma)<br>enp—\<br>=><br>a<br>cn<br>e—S<br>——<br>a=<br>=<br>=<br>=aTy .<br>Conn) Cems) Co) emt) amt) me)<br><!-- End of picture text -->

_Gambar 3.1 Diagram Model Konseptual Aplikasi Bloemen_ 

##### **3.4.2 Logical Model (Model Logis)** 

Logical model merupakan penjabaran lebih lanjut dari model konseptual ke dalam struktur data yang lebih teknis, namun masih bersifat bebas dari platform database tertentu. Model ini menjadi jembatan antara konsep bisnis dan implementasi teknis. 

Berdasarkan model konseptual, logical model aplikasi Bloemen mendefinisikan 10 entitas data dengan relasi antar entitas sebagai berikut: 

**Tabel 3.4 Logical Model — Daftar Entitas dan Atribut Kunci** 

|**No**|**Entitas**|**Atribut Kunci**|**Relasi**|
|---|---|---|---|
|1|users|id (PK), user_type, name,<br>email|1 user → 0..1 shop (jika<br>seller); 1 user → banyak<br>preorders, reviews,<br>notifications|
|2|shops|id (PK), user_id<br>(FK→users), categories[]|1 shop → banyak<br>products, preorders,<br>reviews, conversations|
|3|products|id (PK), shop_id (FK), sizes<br>JSONB, is_pre_order|1 product → banyak<br>order_items; product<br>memiliki harga variasi<br>ukuran|
|4|preorders|id (PK), order_number<br>UNIQUE, user_id, shop_id,<br>status, payment_status|1 preorder → banyak<br>order_items; 0..1 review|
|5|order_items|id (PK), preorder_id (FK),<br>product_id (FK nullable),<br>product_name (snapshot)|Banyak order_items →<br>1 preorder; item<br>menyimpan harga<br>snapshot|
|||id (PK), user1_id, user2_id,|1 conversation →|
|6|conversations|shop_id,<br>UNIQUE(user1,user2,shop)|banyak messages,<br>custom_order_quotes|
|7|messages|id (PK), conversation_id<br>(FK), sender_id,<br>receiver_id, is_read|Banyak messages → 1<br>conversation|
|8|reviews|id (PK), order_id UNIQUE<br>(FK), shop_id, user_id,<br>rating 1–5|1 review → 1 preorder<br>(UNIQUE constraint)|
|9|notifications|id (PK), user_id (FK), type<br>(ENUM), is_read, quote_id|Banyak notifications →<br>1 user|
|10|custom_order_quotes|id (PK), conversation_id<br>(FK), status (ENUM),<br>expires_at|Banyak quotes → 1<br>conversation|





<!-- Start of picture text -->
Logie!LogicalMode (BasERD daAplikasiterm DatabaseBloemen Tetenty)<br>| on i ee =- =f |<br>Soo ae So eee a<br>So S| | ee<br>=<) ee __————4<br>Gambar 32 Entity Relationship Oragram (ERD) Apikas: Bloemen - Logical Mode! -<br><!-- End of picture text -->

_Gambar 3.2 Entity Relationship Diagram (ERD) Aplikasi Bloemen_ 

##### **3.5 Arsitektur Sistem** 

Arsitektur sistem aplikasi Bloemen dirancang mengikuti pola Client–Server modern yang memanfaatkan layanan Backend as a Service (BaaS). Arsitektur ini dipilih karena memungkinkan pengembangan yang cepat sesuai metode RAD tanpa harus membangun infrastruktur server secara mandiri. 

##### **3.5.1 Diagram Arsitektur Sistem (System Architecture Overview)** 

Diagram arsitektur sistem secara keseluruhan terdiri dari empat lapisan utama yang saling berinteraksi, yaitu: lapisan Klien (Client Layer), lapisan Komunikasi (API/Network Layer), lapisan Backend (Supabase BaaS), dan lapisan Penyimpanan (Data/Storage Layer). 



<!-- Start of picture text -->
Diagram Arsitektur Sistem Aplikasi Bloemen_<br>= €XxITc iI<br>|| 4p enten | = 4y woo ae<br>ed eer 8&8) @) @ | © |\)-= Lo}<br>3 cwmne YinEa] | (0) Re | | oon IES E5)| =| SS<br>=a recs Se<br><!-- End of picture text -->

_Gambar 3.3 Diagram Arsitektur Sistem Aplikasi Bloemen_ 

Penjelasan setiap lapisan arsitektur adalah sebagai berikut: 

1. Lapisan Klien (Client Layer): Aplikasi yang berjalan pada perangkat pengguna berupa file APK Android yang dibangun menggunakan Capacitor. Di dalamnya terdapat kode React + TypeScript yang dijalankan oleh WebView native Android. Aplikasi menggunakan React Router untuk navigasi halaman dan Tailwind CSS untuk tampilan antarmuka. 

2. Lapisan Komunikasi (API Layer): Seluruh komunikasi antara klien dan backend dilakukan melalui HTTPS REST API dan WebSocket (untuk fitur real-time). Klien menggunakan pustaka @supabase/supabase-js yang secara otomatis mengelola koneksi dan autentikasi token JWT. 

3. Lapisan Backend (Supabase BaaS): Supabase berperan sebagai backbone backend dengan beberapa layanan terintegrasi: Auth (manajemen sesi dan JWT), PostgreSQL (database utama), Storage (bucket penyimpanan gambar produk dan toko), serta Realtime Engine (untuk fitur chat dan notifikasi live). 

4. Layanan Eksternal: Unsplash REST API digunakan untuk mengambil gambar inspirasi desain bunga secara dinamis berdasarkan kueri kategori acara. 

##### **3.6 Analisis dan Identifikasi Kebutuhan** 

##### **3.6.1 Metode Pengumpulan Data** 

Identifikasi kebutuhan dilakukan melalui tiga metode pengumpulan data: 

   5. Observasi Langsung: Pengamatan langsung terhadap proses transaksi di sebuah toko bunga di Kota Manado untuk memahami alur kerja yang ada saat ini. 

   6. Kuesioner: Penyebaran kuesioner kepada pelaku usaha bunga (penjual) dan calon konsumen untuk menggali kebutuhan fitur dan harapan terhadap aplikasi. 

   7. Wawancara: Wawancara mendalam dengan beberapa penjual bunga terpilih untuk memahami permasalahan teknis dalam pengelolaan pesanan dan pemasaran. 

- 3.6.2 Daftar Kebutuhan Fungsional 

Berdasarkan hasil analisis data, daftar kebutuhan fungsional sistem dirumuskan dan dikelompokkan berdasarkan peran pengguna sebagai berikut: 

Tabel 3.5 Daftar Kebutuhan Fungsional Sistem 

|No|Kode|Kebutuhan Fungsional||Aktor|
|---|---|---|---|---|
|1|FR-01|Pengguna dapat mendaftar akun<br>dengan memilih peran Pembeli atau<br>Penjual|Pembeli,|Penjual|
|2|FR-02|Pengguna dapat melakukan login dan<br>logout dengan sesi yang persisten|Pembeli,|Penjual|
|3|FR-03|Penjual dapat mendaftarkan profil toko<br>dengan nama, kategori, foto, lokasi,<br>dan jam buka|Penjual||
|||Penjual dapat mengelola (tambah, edit,|||
|4|FR-04|hapus) produk dengan variasi harga per<br>ukuran S–XL|Penjual||
|5|FR-05|Penjual dapat mengatur status produk<br>sebagai Ready Stock atau Pre-Order<br>beserta durasi pengerjaan|Penjual||
|6|FR-06|Penjual dapat memberikan diskon<br>persentase pada produk|Penjual||
|7|FR-07|Pembeli dapat menelusuri katalog<br>produk melalui pencarian dan filter<br>kategori|Pembeli||
|8|FR-08|Pembeli dapat membuat pesanan Pre-<br>Order dengan memilih ukuran, tanggal,<br>dan metode pengiriman|Pembeli||
|9|FR-09|Pembeli dapat memantau riwayat dan<br>status pesanan secara real-time|Pembeli||



|No|Kode|Kebutuhan Fungsional||Aktor|
|---|---|---|---|---|
|10|FR-10|Penjual dapat mengelola pesanan<br>masuk dan memperbarui status<br>transaksi|Penjual||
|||Pembeli dan Penjual dapat|||
|11|FR-11|berkomunikasi melalui fitur chat real-<br>time dalam aplikasi|Pembeli,|Penjual|
|||Sistem memberikan notifikasi otomatis|||
|12|FR-12|kepada pengguna atas peristiwa penting<br>(pesanan, status, chat)|Pembeli,|Penjual|
|||Penjual dapat membuat dan|||
|13|FR-13|mengirimkan penawaran harga kustom<br>kepada pembeli melalui chat|Penjual||
|14|FR-14|Pembeli dapat memberikan ulasan dan<br>rating setelah pesanan selesai|Pembeli||
|||Pembeli dapat mengakses galeri|||
|15|FR-15|inspirasi desain bunga dari Unsplash<br>berdasarkan kategori acara|Pembeli||
|||Penjual dapat melihat dashboard bisnis|||
|16|FR-16|dan mengunduh rekap penjualan dalam<br>format PDF|Penjual||
|||Sistem menerapkan kontrol akses|||
|17|FR-17|(RLS) sehingga data setiap pengguna<br>terlindungi|Sistem||



##### **3.5.3 Daftar Kebutuhan Non-Fungsional** 

Tabel 3.6 Daftar Kebutuhan Non-Fungsional Sistem 

|No|Kode|Kebutuhan Non-Fungsional|
|---|---|---|
|1|NFR-01|Performa: Halaman utama dapat dimuat dalam waktu ≤ 3 detik pada<br>koneksi 4G|
|2|NFR-02|Real-time: Pesan chat dapat terkirim dan diterima dengan latensi ≤<br>1 detik|
|3|NFR-03|Kompatibilitas: Aplikasi berjalan pada Android versi 10 (API 29)<br>ke atas|
|4|NFR-04|Keamanan: Autentikasi menggunakan JWT; database dilindungi<br>Row Level Security (RLS)|
|5|NFR-05|Usability: Antarmuka dirancang sesuai prinsip mobile-first dengan<br>bottom navigation bar|
|6|NFR-06|Reliabilitas: Sistem backend Supabase dengan uptime ≥ 99.9%<br>(SLA Supabase Pro)|
|7|NFR-07|Skalabilitas: Arsitektur serverless Supabase memungkinkan|



|No<br>Kode|Kebutuhan Non-Fungsional|
|---|---|



penambahan pengguna tanpa konfigurasi ulang server 

##### **3.7 Perancangan Use Case** 

Use case diagram menggambarkan interaksi antara aktor (pengguna) dengan fungsionalitas sistem yang tersedia. Terdapat dua aktor utama dalam sistem Bloemen, yaitu Pembeli (Customer) dan Penjual (Seller), serta satu aktor sekunder yaitu Sistem (untuk proses otomatis seperti notifikasi dan trigger database). 



<!-- Start of picture text -->
Sistem Bloemen<br>La Inspirasi‘Lihat Galen Desain, Kelola Profil Toko IN<br>\—~ Produk<br>Pembeli aaPre-Order A Penjual<br><> —~<br>BeriRatingUlasan dant UnduhTihat DashboardRekap PDF,&<br><!-- End of picture text -->

_Gambar 3.6 Use Case Diagram Lengkap Aplikasi Bloemen_ 

##### **3.7.1 Deskripsi Use Case** 

Berikut adalah deskripsi lengkap untuk setiap use case utama dalam sistem Bloemen: 

Tabel 3.7 Deskripsi Use Case UC-01: Registrasi Akun 

|**Elemen**|**Deskripsi**|
|---|---|
|Use Case ID|UC-01|
|Nama Use Case|Registrasi Akun|
|Aktor|Pembeli, Penjual (calon pengguna baru)|
|Deskripsi|Pengguna baru mendaftarkan akun ke sistem Bloemen dengan<br>memilih peran (Pembeli atau Penjual), mengisi data diri, dan<br>membuat kredensial login.|
|Prasyarat (Pre-<br>condition)|Pengguna belum memiliki akun di sistem. Aplikasi terhubung<br>ke internet.|
|Alur Utama (Main|1. Pengguna membuka aplikasi dan memilih menu "Daftar". 2.|



|**Elemen**|**Deskripsi**|
|---|---|
|Flow)|Sistem menampilkan form registrasi dengan toggle pilihan<br>peran (Pembeli / Penjual). 3. Pengguna memilih peran, lalu<br>mengisi nama lengkap, email, nomor telepon, kata sandi, dan<br>konfirmasi kata sandi. 4. Pengguna menekan tombol "Daftar".<br>5. Sistem memvalidasi input (format email, panjang password<br>≥ 6 karakter, kecocokan konfirmasi password). 6. Jika valid,<br>sistem memanggil Supabase Auth untuk membuat akun. 7.<br>Sistem menyimpan profil ke tabel users dengan user_type<br>sesuai pilihan peran. 8. Jika peran = Seller, sistem otomatis<br>mengarahkan ke halaman Registrasi Toko. 9. Jika peran =<br>Customer, sistem mengarahkan ke halaman Beranda.|
|Alur Alternatif|A1 (Email sudah terdaftar): Pada langkah 6, Supabase<br>mengembalikan error. Sistem menampilkan pesan "Email<br>sudah terdaftar. Silakan gunakan email lain atau masuk." A2<br>(Password tidak cocok): Pada langkah 5, sistem menampilkan<br>pesan "Konfirmasi kata sandi tidak cocok" dan menonaktifkan<br>tombol Daftar.|
|Pasca-kondisi (Post-<br>condition)|Akun baru berhasil dibuat dan profil pengguna tersimpan di<br>tabel users. Pengguna diarahkan ke halaman yang sesuai<br>perannya.|



Tabel 3.8 Deskripsi Use Case UC-02: Login Sistem 

|**Elemen**|**Deskripsi**|
|---|---|
|Use Case ID|UC-02|
|Nama Use Case|Login Sistem|
|Aktor|Pembeli, Penjual|
|Deskripsi|Pengguna yang telah memiliki akun masuk ke sistem<br>menggunakan email dan kata sandi, dan sistem mengarahkan<br>ke halaman yang sesuai perannya.|
|Prasyarat|Pengguna sudah memiliki akun terdaftar. Aplikasi terhubung<br>internet.|
|Alur Utama|1. Pengguna membuka aplikasi dan memilih "Masuk". 2.<br>Pengguna memasukkan email dan kata sandi. 3. Sistem<br>memanggil Supabase Auth signInWithPassword. 4. Supabase<br>memvalidasi kredensial dan mengembalikan JWT token. 5.<br>Sistem mengambil profil pengguna dari tabel users<br>berdasarkan user.id. 6. Sistem menyimpan sesi ke local storage<br>(persistSession: true). 7. Jika user_type = customer →<br>diarahkan ke Beranda. 8. Jika user_type = seller → diarahkan<br>ke Dashboard Penjual.|
|Alur Alternatif|A1 (Kredensial salah): Sistem menampilkan pesan "Email atau<br>kata sandi salah. Silakan coba lagi." A2 (Koneksi gagal):<br>Sistem menampilkan pesan "Tidak dapat terhubung ke server.<br>Periksa koneksi internet Anda."|



|**Elemen**||**Deskripsi**|
|---|---|---|
|Pasca-kondisi|Sesi login aktif. Pengguna<br>perannya.|berada di halaman utama sesuai|



Tabel 3.9 Deskripsi Use Case UC-03: Kelola Profil Toko (Penjual) 

|**Elemen**|**Deskripsi**|
|---|---|
|Use Case ID|UC-03|
|Nama Use Case|Kelola Profil Toko (Registrasi & Edit)|
|Aktor|Penjual|
||Penjual mendaftarkan profil toko baru atau memperbarui|
|Deskripsi|informasi toko yang sudah ada, termasuk kategori spesialisasi,<br>lokasi peta, dan jam operasional.|
|Prasyarat|Pengguna sudah login sebagai Seller.|
||1. Setelah registrasi akun Seller, sistem otomatis mengarahkan<br>ke halaman Registrasi Toko. 2. Penjual mengisi nama toko,<br>deskripsi, alamat, kota, nomor telepon, dan email kontak. 3.<br>Penjual memilih minimal 1 kategori spesialisasi dari 8 kategori<br>yang tersedia via ShopCategoryPicker. 4. Penjual memilih titik<br>lokasi toko pada peta interaktif (InteractiveMap). 5. Penjual|
|Alur Utama<br>(Registrasi Toko)|mengatur jam buka per hari menggunakan<br>OpeningHoursPicker. 6. Penjual mengunggah foto banner toko<br>via ImageUpload (maks. 5 MB, format JPG/PNG/WebP). 7.<br>Penjual menekan "Simpan". Sistem memvalidasi field wajib. 8.<br>Sistem mengunggah foto ke Supabase Storage bucket images,<br>mendapatkan public URL. 9. Sistem menyimpan data toko ke<br>tabel shops. 10. Sistem mengarahkan Penjual ke Dashboard<br>Penjual.|
|Alur Alternatif|A1 (Foto terlalu besar): Sistem menampilkan "Ukuran file<br>melebihi batas 5 MB" dan mencegah upload. A2 (Tidak ada<br>kategori dipilih): Sistem menampilkan validasi "Pilih minimal<br>1 kategori spesialisasi."|
|Pasca-kondisi|Data toko tersimpan di tabel shops. Toko tampil dalam daftar<br>katalog publik (is_active = TRUE).|



Tabel 3.10 Deskripsi Use Case UC-04: Kelola Produk 

|**Elemen**|**Deskripsi**|
|---|---|
|Use Case ID|UC-04|
|Nama Use Case|Kelola Produk (CRUD + Variasi Harga)|
|Aktor|Penjual|
|Deskripsi|Penjual dapat menambah, mengedit, dan menghapus produk<br>bunga pada katalog tokonya, termasuk mengatur variasi harga<br>per ukuran, status ketersediaan, diskon, dan informasi bunga.|



|**Elemen**|**Deskripsi**|
|---|---|
|Prasyarat<br>Alur Utama<br>(Tambah Produk)|Penjual sudah login dan sudah memiliki profil toko aktif.<br>1. Penjual membuka menu Produk di sidebar Seller. 2. Sistem<br>menampilkan daftar produk toko penjual. 3. Penjual menekan<br>tombol "+ Tambah Produk". 4. Sistem menampilkan<br>dialog/form tambah produk dengan field: nama produk,<br>deskripsi (min. 10 karakter), kategori, toggle "Gunakan variasi<br>ukuran", foto produk, toggle "Pre-Order" + durasi pengerjaan,<br>tipe bunga, ketahanan bunga, petunjuk perawatan, dan toggle<br>diskon. 5. Jika toggle variasi ukuran ON: muncul 4 baris input<br>(S, M, L, XL) untuk harga masing-masing ukuran. 6. Jika<br>toggle diskon ON: muncul input persentase diskon (0–100%)<br>dengan pratinjau harga akhir realtime. 7. Penjual mengunggah<br>foto produk. 8. Penjual menekan "Simpan". Sistem<br>memvalidasi semua field wajib. 9. Sistem menyimpan produk<br>ke tabel products dengan field sizes (JSONB) untuk variasi<br>harga. 10. Produk muncul di daftar katalog penjual dan katalog<br>publik.|
|Alur Alternatif|A1 (Edit Produk): Penjual memilih produk → klik Edit →<br>mengubah field yang diinginkan → Simpan. A2 (Hapus<br>Produk): Penjual menekan ikon hapus → muncul AlertDialog<br>konfirmasi → jika dikonfirmasi, produk dihapus dari katalog.|
|Pasca-kondisi|Produk tersimpan/diperbarui/dihapus di tabel products.<br>Perubahan langsung terlihat di katalog publik.|



Tabel 3.11 Deskripsi Use Case UC-05: Buat Pesanan Pre-Order 

|**Elemen**|**Deskripsi**|
|---|---|
|Use Case ID|UC-05|
|Nama Use Case|Buat Pesanan Pre-Order|
|Aktor|Pembeli|
|Deskripsi|Pembeli membuat pesanan produk bunga melalui formulir Pre-<br>Order yang mencakup pemilihan ukuran, tanggal pengantaran,<br>metode pengiriman, dan catatan khusus.|
|Prasyarat|Pembeli sudah login. Produk yang dipilih tersedia (is_available<br>= TRUE).|
|Alur Utama|1. Pembeli membuka halaman Detail Produk dan memilih<br>ukuran yang diinginkan via size picker. 2. Pembeli menekan<br>tombol "Pre-Order". 3. Sistem menampilkan halaman formulir<br>Pre-Order. 4. Pembeli mengisi: jumlah unit, metode<br>pengiriman (Pickup/Kirim), tanggal pengantaran, alamat<br>lengkap (jika Kirim), dan catatan khusus. 5. Sistem<br>memvalidasi tanggal: tanggal pengantaran harus ≥ hari ini +<br>po_duration_days produk. 6. Sistem menampilkan ringkasan<br>pesanan dengan total harga. 7. Pembeli menekan "Konfirmasi<br>Pesanan". 8. Sistem insert ke tabel preorders. Trigger database|



|**Elemen**|**Deskripsi**|
|---|---|
||otomatis menghasilkan order_number unik (format ORD-<br>YYYYMMDD-####). 9. Sistem insert baris ke order_items<br>dengan snapshot harga dan ukuran. 10. Trigger database<br>membuat notifikasi order_new untuk Penjual. 11. Sistem<br>mengarahkan ke halaman Payment.|
|Alur Alternatif|A1 (Tanggal tidak valid): Sistem menampilkan pesan "Tanggal<br>pengantaran minimal X hari dari sekarang" dan menonaktifkan<br>tombol Konfirmasi. A2 (Belum login): Sistem mengarahkan ke<br>halaman Login dengan redirect parameter.|
|Pasca-kondisi|Pesanan tersimpan dengan status pending. Penjual menerima<br>notifikasi pesanan baru.|



Tabel 3.12 Deskripsi Use Case UC-06: Chat Real-time 

|**Elemen**|**Deskripsi**|
|---|---|
|Use Case ID|UC-06|
|Nama Use Case|Chat Real-time Pembeli ↔ Penjual|
|Aktor|Pembeli, Penjual|
|Deskripsi|Pembeli dan Penjual dapat berkomunikasi secara langsung<br>melalui fitur chat real-time di dalam aplikasi untuk koordinasi<br>detail pesanan dan pembayaran.|
|Prasyarat|Kedua pengguna sudah login. Terdapat pesanan atau inisiasi<br>chat yang menghubungkan keduanya.|
|Alur Utama|1. Pembeli membuka halaman Detail Produk dan menekan<br>tombol "Chat dengan Penjual". 2. Sistem memeriksa apakah<br>sudah ada percakapan (conversation) antara pembeli dan<br>penjual di toko tersebut. 3. Jika belum ada: sistem membuat<br>record baru di tabel conversations. 4. Sistem membuka<br>halaman ChatRoom dengan menampilkan riwayat pesan<br>sebelumnya (jika ada). 5. Pembeli mengetik pesan dan<br>menekan tombol Kirim. 6. Sistem insert pesan ke tabel<br>messages. 7. Trigger database menaikkan unread_count dan<br>memperbarui last_message di tabel conversations. 8. Supabase<br>Realtime mengirim event INSERT ke semua subscriber kanal<br>messages-{conversationId}. 9. Halaman ChatRoom Penjual<br>menerima event dan menampilkan bubble pesan baru secara<br>otomatis tanpa refresh. 10. Saat Penjual membuka ChatRoom,<br>sistem otomatis mereset unread_count dan menandai pesan as<br>is_read = TRUE.|
|Alur Alternatif|A1 (Koneksi Realtime terputus): Pengguna melihat indikator<br>"Offline". Pesan tidak terkirim sampai koneksi pulih.|
|Pasca-kondisi|Pesan tersimpan di tabel messages. Kedua pihak dapat melihat<br>riwayat percakapan kapan saja.|



Tabel 3.13 Deskripsi Use Case UC-07: Kelola Pesanan (Penjual) 

|**Elemen**|**Deskripsi**|
|---|---|
|Use Case ID|UC-07|
|Nama Use Case|Kelola Pesanan Masuk (Penjual)|
|Aktor|Penjual|
|Deskripsi|Penjual melihat, memproses, dan memperbarui status pesanan<br>yang masuk ke tokonya dari awal (pending) hingga selesai<br>(delivered) atau dibatalkan (cancelled).|
|Prasyarat|Penjual sudah login. Terdapat pesanan yang masuk ke toko<br>penjual.|
|Alur Utama|1. Penjual membuka menu Pesanan di sidebar Seller. 2. Sistem<br>menampilkan daftar pesanan masuk dengan tab filter status. 3.<br>Penjual memilih pesanan untuk melihat detail (alamat, catatan,<br>item pesanan, total). 4. Penjual memilih aksi perubahan status<br>melalui dropdown (pending → confirmed → processing →<br>ready → delivered). 5. Sistem memperbarui kolom status di<br>tabel preorders secara atomik. 6. Trigger database membuat<br>notifikasi order_status_changed untuk Pembeli. 7. Penjual<br>memverifikasi pembayaran dan mengubah payment_status dari<br>unpaid → paid via tombol konfirmasi pembayaran.|
|Alur Alternatif|A1 (Batalkan Pesanan): Penjual dapat memilih status cancelled<br>dari mana saja. Sistem meminta konfirmasi sebelum<br>mengeksekusi.|
|Pasca-kondisi|Status pesanan berhasil diperbarui. Pembeli menerima<br>notifikasi perubahan status secara real-time.|



Tabel 3.14 Deskripsi Use Case UC-08: Beri Ulasan dan Rating 

|**Elemen**|**Deskripsi**|
|---|---|
|Use Case ID|UC-08|
|Nama Use Case|Beri Ulasan dan Rating|
|Aktor|Pembeli|
|Deskripsi|Pembeli memberikan ulasan berupa rating bintang 1–5,<br>komentar teks, dan foto opsional terhadap pesanan yang telah<br>selesai. Sistem secara otomatis memperbarui rating rata-rata<br>toko.|
|Prasyarat|Pesanan memiliki status delivered. Pembeli belum memberikan<br>ulasan untuk pesanan tersebut.|
|Alur Utama|1. Pembeli membuka Riwayat Pesanan dan memilih pesanan<br>berstatus Delivered. 2. Pembeli menekan tombol "Beri<br>Ulasan". 3. Sistem menampilkan ReviewForm dengan<br>komponen bintang interaktif, textarea komentar, dan upload<br>foto (opsional). 4. Pembeli memilih rating (1–5 bintang) dan<br>mengisi komentar. 5. Pembeli menekan "Kirim Ulasan". 6.|



|**Elemen**|**Deskripsi**|
|---|---|
||Sistem menyimpan ulasan ke tabel reviews. 7. Trigger<br>update_shop_rating secara otomatis menghitung ulang rating<br>rata-rata toko dan memperbarui shops.rating dan<br>shops.total_reviews.|
|Alur Alternatif|A1 (Sudah pernah mengulas): Tombol "Beri Ulasan" tidak<br>tampil karena UNIQUE constraint order_id di tabel reviews<br>sudah terisi.|
|Pasca-kondisi|Ulasan tersimpan di tabel reviews. Rating toko diperbarui<br>secara otomatis oleh trigger database.|



Tabel 3.15 Deskripsi Use Case UC-09: Galeri Inspirasi Desain (Unsplash) 

|**Elemen**|**Deskripsi**|
|---|---|
|Use Case ID|UC-09|
|Nama Use Case|Lihat Referensi Desain Bunga|
|Aktor|Pembeli|
|Deskripsi|Pembeli dapat menelusuri galeri gambar referensi desain bunga<br>yang diambil dari Wikimedia Commons API dan produk toko<br>yang terdaftar di aplikasi, berdasarkan kata kunci pencarian.<br>Pembeli dapat memilih gambar sebagai referensi dan<br>mengirimkannya ke toko melalui chat.|
||-<br>Aplikasi terhubung ke internet|
|Prasyarat|-<br>Pembeli sudah login (diperlukan saat membuka chat<br>dengan toko)<br>-<br>Terdapat minimal satu toko yang terdaftar|
|Alur Utama|1. Pembeli membuka menu**Referensi**pada navigasi bawah.<br>2. Sistem menampilkan halaman Referensi Desain Bunga yang<br>berisi kolom pencarian, daftar "Pencarian Populer" (mis. buket<br>pernikahan, bunga ulang tahun, mawar merah), daftar toko<br>bunga, dan galeri inspirasi populer. Sistem memuat 30 gambar<br>awal dari Wikimedia Commons dan menggabungkannya<br>dengan produk toko yang memiliki gambar.<br>3. Pembeli mengetik kata kunci lalu menekan tombol "Cari<br>Inspirasi", atau memilih salah satu chip pencarian populer.<br>4. Sistem menerjemahkan kata kunci berbahasa Indonesia ke<br>bahasa Inggris, lalu memanggil Wikimedia Commons API<br>(action=query, generator=search, namespace file, 30 hasil per<br>halaman) dan mencocokkan produk toko yang relevan.<br>5. Sistem menyaring hasil yang bukan gambar bunga (arsip,<br>ilustrasi buku, peta, dll.) lalu menampilkan hasilnya dalam grid<br>2 kolom. Gambar dari produk toko diberi label "Produk Toko".<br>6. Pembeli menekan tombol "Muat Lebih Banyak Gambar"<br>untuk memuat halaman hasil berikutnya, yang ditambahkan ke<br>grid tanpa duplikasi.<br>7. Pembeli memilih sebuah gambar dan menekan "Kirim ke|



|**Elemen**|**Deskripsi**|
|---|---|
||Toko". Sistem menampilkan dialog "Kirim Referensi Desain"<br>berisi pratinjau gambar, judul, deskripsi, dan daftar toko<br>tujuan.<br>8. Pembeli memilih toko tujuan.<br>9. Sistem membuka ruang chat dengan toko tersebut,<br>menyimpan URL, judul, dan deskripsi gambar sebagai<br>referensi desain pada percakapan, lalu menampilkannya di chat<br>sebagai kartu "Referensi Desain".|
|Alur Alternatif|**A1**(Wikimedia tidak dapat diakses atau tidak ada hasil<br>relevan): Sistem memakai koleksi gambar cadangan bawaan<br>aplikasi. Jika tetap tidak ada hasil, sistem menampilkan pesan<br>"Tidak ada hasil. Coba kata kunci lain."<br>**A2**(Gagal memuat gambar tambahan): Sistem menampilkan<br>pesan "Gagal memuat gambar tambahan". Jika seluruh hasil<br>sudah termuat, sistem menampilkan pesan "Sudah tidak ada<br>gambar lagi".<br>**A3**(Belum ada toko terdaftar): Sistem menampilkan pesan<br>"Belum Ada Toko" beserta tombol "Jelajahi Toko".<br>**A4**(Pembeli belum login): Saat pembeli memilih toko tujuan,<br>sistem mengarahkan pembeli ke halaman login.|
||Gambar referensi tampil di ruang chat dan tersimpan pada data|
|Pasca-kondisi|percakapan (URL, judul, deskripsi). Jika pembeli melanjutkan<br>ke pre-order, referensi desain ikut tersimpan pada pesanan.|



Tabel 3.16 Deskripsi Use Case UC-10: Dashboard dan Rekap Penjualan PDF 

|**Elemen**|**Deskripsi**|
|---|---|
|Use Case ID|UC-10|
|Nama Use Case|Lihat Dashboard dan Unduh Rekap Penjualan PDF|
|Aktor|Penjual|
|Deskripsi|Penjual dapat melihat ringkasan bisnis pada dashboard dan<br>mengunduh laporan rekap penjualan dalam format PDF yang<br>dapat dicetak.|
|Prasyarat|Penjual sudah login. Terdapat minimal satu pesanan dengan<br>status delivered.|
|Alur Utama|1. Penjual membuka Dashboard Penjual. 2. Sistem menghitung<br>dan menampilkan 4 kartu metrik: Total Pendapatan, Pesanan<br>Pending, Total Produk Aktif, Rating Toko. 3. Penjual membuka<br>menu Rekap Penjualan. 4. Penjual memilih rentang tanggal<br>(dari–sampai) dan filter status pesanan. 5. Sistem mengambil<br>data pesanan sesuai filter dari Supabase. 6. Sistem<br>menampilkan tabel rekap dengan kolom: nomor pesanan,<br>tanggal, nama pembeli, item, total, dan status. 7. Penjual<br>menekan tombol "Ekspor PDF". 8. Sistem menggunakan jsPDF<br>+ jspdf-autotable untuk menghasilkan file PDF dengan header<br>nama toko, periode laporan, tabel data, total pendapatan, dan|



|**Elemen**|**Deskripsi**|
|---|---|
||nomor halaman. 9. File PDF otomatis diunduh ke perangkat.|
|Pasca-kondisi|File PDF rekap penjualan terunduh di perangkat Penjual dan<br>dapat digunakan untuk pembukuan atau laporan keuangan.|



##### **3.8 Perancangan Activity Diagram** 

Activity diagram menggambarkan alur aktivitas yang terjadi dalam use case 

tertentu, termasuk decision points dan alur paralel yang mungkin terjadi. 



<!-- Start of picture text -->
Aplikasi [sistem<br>Buka Aplikasi<br>Pilih ‘Daftar’<br>ili Tampilkan Form<br>Pilih Peran i<br>Gem Validasi Form Daftar via<br>| Supabase Auth<br>[tidak valid]© Simpan Profil<br>Registrasi Toko <> Peran?2<br>— [Customer]<br>ey<br><!-- End of picture text -->

_Gambar 3.7 Activity Diagram — Registrasi Akun_ 



<!-- Start of picture text -->
renyyuna Apunast protein<br>Pilih Produk<br>Pilih Ukuran<br>Tekan q ‘Pre-Order : Tampilkan Form<br>ay _|| ~\_Pese trigger:order_number;  generate<br>TampilkanPesanan | |Zs,(Insert(Database) ke Preorders)<br>Peringatan Konfirmasi Insert ke Order<br>Ee |LaPesanan Items (Database)<br>valid]> Insert ke Order<br>Tanggal Valid? Items (Database)<br>Redirect ke Payment Trigger Notifikasi<br>Buka Chat untuk<br>‘oordinasi Pembayarat<br><!-- End of picture text -->

_Gambar 3.8 Activity Diagram — Proses Pemesanan Pre-Order_ 



<!-- Start of picture text -->
Gambar 3.9 — Activity Diagram UC-06: Chat Real-time.<br>a Terima Notifikasi<br>Buka ChatRoom<br>Tampilkan Pesan<br>(Otomatis)<br>Tulis Balasan<br><!-- End of picture text -->

_Gambar 3.9 Activity Diagram — Fitur Chat Real-time_ 



<!-- Start of picture text -->
|Penjual_—| Sistem __|_ Pembelii (Notifikasi<br>Status Awal?<br>intuk Ubah Status,<br>Pilih Pesanan [pending <» [confirmed]<br>[processing], | [processing]<br>Tampilkan Detail Tampilkan Detail<br>Pesanan (pending) Pesanan (ready)<br>Pilih KonfirmasiV  | Pembaruan Status Kirim Notifikasi:<br>Pesanan i (confirmed) Status ‘Confirmed?<br>ri Kenia | Pembaruan Status Kirim Notifikasi:<br>esanan mn ke “Processing” Status ‘Ready’<br>Pilih Ubah ke | Pembaruan Status , Kirim Notifikasi:<br>Posanan iA ke ‘Processing” Status ‘Delivered®<br><> {tidak valid<br>[Batalkan Pesanan?] Status ‘Delady<br>Pilih Batalkania f PembaruanKS Status KirimKirim Notifikasi:Notifikasi:<br>Pesanan ke ‘Cancelled™ Resanan Dibatalkai<br>Simpan ke DB<br>(cancelled)<br><!-- End of picture text -->

_Gambar 3.10 Activity Diagram — Manajemen Status Pesanan (Penjual)_ 

##### **3.9 Metode Pengembangan: Rapid Application Development (RAD)** 

Dalam siklus pengembangan perangkat lunak (Software Development Life Cycle/SDLC), penelitian ini menggunakan model Prototyping sebagai dasar pendekatan pengembangan sistem. Model Prototyping dipilih karena memungkinkan pengembang membangun purwarupa (prototipe) sistem secara bertahap, mengujikan purwarupa tersebut kepada pengguna, kemudian menyempurnakannya berdasarkan umpan balik yang diperoleh hingga menghasilkan sistem akhir yang sesuai dengan kebutuhan. Pendekatan ini dipilih 

karena kebutuhan pengguna terhadap aplikasi Bloemen belum sepenuhnya terdefinisi secara rinci pada awal penelitian, sehingga diperlukan proses iteratif berupa pembuatan purwarupa, evaluasi, dan perbaikan yang dilakukan secara berulang. 

Untuk mengimplementasikan model Prototyping tersebut secara lebih terstruktur, penelitian ini menerapkan metode Rapid Application Development (RAD) sebagai turunan dari model Prototyping yang menekankan pada pengembangan iteratif dengan melibatkan umpan balik pengguna di setiap iterasi. Metode ini dipilih karena karakteristik proyek yang membutuhkan prototipe cepat dan fleksibilitas perubahan fitur. 

Pengembangan dibagi ke dalam tiga siklus iterasi utama yang masingmasing menghasilkan versi prototipe yang semakin lengkap dan matang. Setelah setiap prototipe dihasilkan, dilakukan evaluasi bersama responden untuk mendapatkan umpan balik sebelum melanjutkan ke iterasi berikutnya. 

**Tabel 3.17 Rincian Siklus Iterasi RAD** 

|**Versi**|**Fase RAD**|**Fokus Pengembangan**|**Output**|
|---|---|---|---|
|v01.0|User Design|Wireframe & desain UI<br>seluruh halaman. Belum<br>ada logika bisnis atau<br>koneksi backend.|File Figma wireframe 17<br>halaman + Komponen UI<br>dasar|
|Evaluasi<br>v01.0|Feedback|Evaluasi desain wireframe<br>oleh 5 responden (calon<br>penjual dan pembeli)|Daftar perubahan UI<br>yang diminta responden|
|v02.0|Rapid<br>Construction I|Implementasi fitur inti:<br>Auth, Toko, Produk,<br>Pesanan, Chat dasar.<br>Backend Supabase aktif.|APK install-able dengan<br>fitur inti fungsional|
|Evaluasi<br>v02.0|Feedback|Pengujian fungsional oleh 8<br>responden pada perangkat<br>nyata|Daftar bug + permintaan<br>fitur tambahan<br>(notifikasi, ulasan,<br>diskon, galeri)|
|v03.0<br>(Final)|Rapid<br>Construction<br>II + Cutover|Implementasi fitur lanjutan:<br>Notifikasi, Penawaran<br>Kustom, Ulasan, Diskon,<br>Galeri Referensi,<br>Dashboard PDF, Capacitor<br>Android.|APK Final siap untik<br>pengujian alpha (black-<br>box) dan dilanjutkan<br>UAT|



##### **3.10 Rancangan Pengujian** 

Setelah versi final (v03.0) selesai dibangun, aplikasi Bloemen diuji melalui dua tahap berurutan, yaitu pengujian alpha dan pengujian penerimaan pengguna ( _User Acceptance Test_ /UAT). Subbab ini menjelaskan rancangan kedua tahap tersebut, sedangkan hasilnya disajikan pada Subbab 4.6 dan 4.7. 

##### **3.10.1 Pengujian Alpha** 

Pengujian alpha adalah pengujian yang dilakukan oleh pengembang pada lingkungan yang terkendali sebelum aplikasi diberikan kepada pengguna akhir. Tujuannya memastikan aplikasi telah berfungsi dengan benar dan stabil sehingga layak dilanjutkan ke UAT. Pengujian dilakukan secara manual oleh penulis dengan metode _black-box_ , yaitu menjalankan skenario pada aplikasi tanpa melihat kode program, lalu membandingkan hasil yang diamati dengan hasil yang diharapkan. 

##### **3.10.2 Jenis Pengujian** 

Rancangan pengujian mengacu pada klasifikasi pengujian aplikasi Android dari dokumentasi resmi Android Developers, yang membedakan pengujian berdasarkan subjek yang diuji. Keempat jenis pengujian tersebut dipetakan ke kebutuhan pada Subbab 3.5 sebagaimana pada Tabel 3.18. 

Tabel 3.18 Rancangan Jenis Pengujian Alpha 

|**No**|**Jenis Pengujian**|**Tujuan**|**Metode dan Instrumen**|
|---|---|---|---|
|1.|Fungsional|Memastikan<br>aplikasi<br>melakukan apa<br>yang seharusnya|Skenario black-box dan alur end-<br>to-end|
|2.|Performa|Memastikan<br>aplikasi berjalan<br>cepat dan efisien|Pengamatan latensi real-time,<br>waktu transisi halaman, waktu<br>muat katalog, dan stabilitas|
|3.|Aksesibilitas|Memastikan<br>aplikasi nyaman<br>digunakan|Daftar periksa aksesibilitas<br>antarmuka, termasuk rasio kontras<br>warna|
|4.|Kompatibilitas|Memastikan<br>aplikasi berjalan<br>pada berbagai<br>perangkat dan<br>versi Android|Uji pada empat perangkat fisik<br>Android 10 s.d. 13|



##### **3.10.3 Ruang Lingkup Pengujian Fungsional** 

Skenario fungsional dikelompokkan berdasarkan derajat isolasinya menjadi tiga tingkat, yaitu _small test_ (unit) yang menguji satu fungsi, komponen, atau trigger basis data; _medium test_ (integrasi) yang menguji interaksi dua unit atau lebih; dan _big test_ ( _end-to-end_ ) yang menguji satu alur pengguna lengkap. 

##### **3.10.4 Lingkungan Pengujian** 

Pengujian memakai berkas APK hasil build v03.0 pada perangkat fisik yang tercantum pada Tabel 3.2, dengan akun uji untuk peran pembeli dan penjual serta data uji berupa toko dan produk. Backend yang digunakan adalah Supabase. 

##### **3.10.5** P **engujian Penerimaan Pengguna (UAT)** 

Setelah pengujian alpha selesai, UAT dilakukan terhadap dua kelompok pengguna, yaitu penjual dan pembeli, untuk menilai manfaat, kemudahan, dan kelayakan sistem dari sudut pandang pengguna akhir. Berbeda dengan pengujian alpha yang menitikberatkan pada kebenaran fungsional dan kualitas teknis, UAT menitikberatkan pada penilaian subjektif pengguna. 

### **BAB 4 HASIL DAN PEMBAHASAN** 

#### **4.1 Hasil Pengambilan Data (Observasi, Kuesioner, dan Wawancara)** 

Berdasarkan hasil observasi lapangan, kuesioner, dan wawancara yang telah dilakukan terhadap pelaku usaha bunga dan calon konsumen di Kota Manado, diperoleh temuan-temuan yang menjadi dasar analisis kebutuhan. Foto dan dokumentasi lengkap dari proses pengambilan data disertakan pada Lampiran A (Dokumentasi Observasi), Lampiran B (Lembar Kuesioner), dan Lampiran C (Transkrip Wawancara). 

Temuan dari sisi pelaku usaha (penjual) adalah sebagai berikut: 

- Seluruh toko bunga yang diobservasi masih menggunakan WhatsApp, Instagram, dan catatan manual (buku/Excel) untuk mengelola pesanan. 

- Sebesar 89% responden penjual menyatakan mengalami kesulitan saat pesanan menumpuk pada periode ramai (wisuda, hari raya). 

- Sebesar 94% responden penjual menyatakan kebutuhan terhadap sistem pencatatan pesanan otomatis dan laporan penjualan digital. 

- Hampir seluruh responden penjual menyatakan bersedia dan tertarik bergabung apabila tersedia aplikasi marketplace bunga khusus. 

Temuan dari sisi konsumen (pembeli) diperoleh melalui kuesioner terhadap 28 responden yang dikumpulkan. Rincian hasil kuesioner tersebut diolah lebih lanjut pada Subbab 4.7.3, dengan ringkasan sebagai berikut: 

- Sebanyak 18 dari 28 responden (64,3%) mengalami kesulitan menemukan toko bunga terdekat, yang menjadi kendala paling dominan. 

- Sebanyak 26 dari 28 responden (92,9%) memilih rekomendasi atau referensi model bunga sebagai fitur yang penting, sementara 11 responden (39,3%) mengaku sulit mencari referensi desain bunga. 

- Sebanyak 25 dari 28 responden (89,3%) pernah mengalami kesulitan memesan bunga karena waktu yang mepet. 

- Sebanyak 25 dari 28 responden (89,3%) tertarik hingga sangat tertarik pada aplikasi marketplace bunga khusus, dan seluruh responden (100%) 

menyatakan mungkin hingga sangat mungkin menggunakannya apabila tersedia. 

#### **4.2 Pembuatan Aplikasi** 

Bab ini menjelaskan seluruh proses konstruksi aplikasi Marketplace Kreativitas Bunga Bloemen secara mendetail dan berurutan. Proses pengembangan mengikuti siklus iterasi RAD yang telah direncanakan pada Bab III, mulai dari inisialisasi lingkungan pengembangan, pembangunan fitur per modul, hingga pengemasan ke APK Android. Setiap langkah dijelaskan dengan tujuan, perintah, dan penjelasan teknis yang memadai. 

Secara teknis, proses pembangunan aplikasi terekam dalam 136 versi (snapshot) berurutan, yaitu v1 sampai v136, yang dikelompokkan ke dalam 22 fase pengembangan, mulai dari inisialisasi proyek hingga penyempurnaan akhir. Agar penyajiannya selaras dengan metode RAD, seluruh fase tersebut dikelompokkan ke dalam tiga iterasi, yaitu v01.0 (wireframe), v02.0 (prototipe fungsional), dan v03.0 (versi final). Penomoran iterasi (v01.0–v03.0) pada bab ini berbeda dengan penomoran snapshot (v1–v136) dan tidak boleh dipertukarkan. 

#### **4.3 Iterasi Pertama — Prototipe Wireframe (Versi v01.0)** 

##### **4.3.1 Fase Identifikasi Kebutuhan Iterasi 1** 

Pada iterasi pertama, fokus utama adalah memvalidasi konsep desain antarmuka kepada calon pengguna sebelum menulis satu baris kode pun. Identifikasi kebutuhan iterasi pertama mengacu pada hasil wawancara dan kuesioner yang telah dikumpulkan pada tahap analisis (Bab III). 

Kebutuhan yang akan divalidasi pada iterasi ini adalah: tata letak navigasi bottom tab bar untuk pengguna mobile, struktur halaman katalog produk, alur pendaftaran toko penjual, dan alur pemesanan dari sisi pembeli. Seluruh kebutuhan ini dituangkan dalam bentuk wireframe lo-fi (low-fidelity) menggunakan Figma. 

##### **4.3.2 Desain Wireframe Halaman Utama** 

Wireframe dirancang untuk 17 halaman utama aplikasi, mencakup sisi Pembeli dan Penjual. Desain wireframe menggunakan pendekatan mobile-first dengan ukuran referensi layar 390 x 844 px (setara dengan perangkat Android midrange yang umum digunakan oleh target pengguna di Manado). 



<!-- Start of picture text -->
Bunga Segar —<br>sone<br>—<br>com a<br>AB EIE<br>=<br>ye<br><!-- End of picture text -->

**Gambar 4.1** Wireframe Halaman Beranda Sisi Pembeli 



<!-- Start of picture text -->
un satel board l<br>f 11] \f@ {<br>: | fe i X fe |<br>|<br>tan<br><!-- End of picture text -->

**Gambar 4.2** Wireframe Alur Registrasi Penjual 



<!-- Start of picture text -->
L.HALAMAN DETAILPRODUK 2, FORMULIR PRE-ORDER<br>& Pesanan Anda<br>NamaQty1  BungaS<br>Total<br>Metode Pengambilan<br>Nama fat ob<br>Rp HargaBunga >| | Ambit Senditi Kiri<br>Plas Utero Tanggal & Jam Pengambilan<br>Ie) Permintaan Khusus<br>(are<br>Lanjut ke Pre-Order Lanjut ke Pembayaran<br>3.RINGKASAN PEMBAYARAN 4, PEMESANAN BERHASIL<br>Total Pembayaran<br>MetodePembayaran )<br>Cash O° Pesanan Diterima!<br>Transfer Bank @ |-5| _ NomorMenunggu Pesanan Konfirmasi #XXXXX<br>Ewallet °<br>Lihat Status Pesanan<br>Kartu Kredit =O<br>Kembali ke Toko<br>Bayar Sekarang<br><!-- End of picture text -->

**Gambar 4.3** Wireframe Alur Pemesanan Pembeli 



<!-- Start of picture text -->
> DASHBOARD PENJUAL (O)<br>NAMA PENGGUNA<br>user@email.com<br>Sy)<br>@ Proouk<br>WG PESANAN<br>©) REKAP PENJUALAN i<br>© cHaT<br>{63 PENGATURAN TOKO $<br>©<br>@ _KEMBALI KE TOKO<br><!-- End of picture text -->

**Gambar 4.4** Wireframe Sidebar Navigasi Penjual 

##### **4.3.3 Evaluasi Prototipe v01.0 (Pengambilan Data Iterasi 1)** 

Setelah wireframe selesai, penulis melakukan sesi evaluasi dengan 5 responden yang terdiri dari 2 calon penjual (pemilik toko bunga di Manado) dan 3 calon pembeli (mahasiswa dan pegawai yang sering membeli bunga untuk acara). Evaluasi dilakukan dengan metode walkthrough: responden diminta untuk "menavigasi" wireframe seolah-olah menggunakan aplikasi nyata, sambil penulis mencatat hambatan dan pendapat yang muncul. 

Dokumentasi foto sesi evaluasi wireframe v01.0 bersama responden disertakan pada Lampiran D. 

Tabel 4.1 Hasil Evaluasi dan Tabel Perubahan Prototipe v01.0 

|**No**|**Temuan Responden**|**Perubahan yang Dilakukan**|**Halaman**<br>**Terdampak**|**Status**|
|---|---|---|---|---|
|1|Ikon kategori di beranda<br>kurang jelas — tidak terlihat<br>mengarah ke filter produk|Tambahkan label teks di bawah<br>setiap ikon kategori. Ubah<br>bentuk chip menjadi kartu<br>persegi dengan ikon besar +<br>label|Home.tsx,<br>Categories.tsx|✓|
|2|Tombol 'Pre-Order' dan 'Chat<br>dengan Penjual' terlalu<br>berdekatan, mudah salah tekan|Pisahkan kedua tombol secara<br>vertikal. Tombol Pre-Order diisi<br>warna primer, tombol Chat<br>outline (secondary)|ProductDetail.tsx|✓|
|3|Form registrasi toko terlalu<br>panjang dalam satu layar,<br>terasa overwhelm|Bagi form menjadi dua bagian:<br>(1) Info dasar & foto, (2) Lokasi<br>peta & jam buka. Tampilkan<br>dengan scroll yang jelas|ShopRegister.tsx|✓|
|4|Tidak ada indikator 'Buka' /<br>'Tutup' pada kartu toko di<br>daftar toko|Tambahkan badge berwarna<br>hijau ('Buka') atau merah<br>('Tutup') berdasarkan jam<br>operasional saat ini|Shops.tsx|✓|
|5|Tidak ada fitur untuk melihat<br>lokasi toko di peta dari<br>halaman detail toko|Tambahkan tombol 'Lihat Peta'<br>pada halaman ShopDetail yang<br>membuka halaman peta penuh<br>(ShopMap)|ShopDetail.tsx,<br>ShopMap.tsx|✓|



Berdasarkan hasil evaluasi v01.0, penulis mencatat lima poin perubahan yang harus diimplementasikan sebelum memulai konstruksi kode. Seluruh perubahan ini diintegrasikan ke dalam desain akhir yang kemudian menjadi acuan pembangunan prototipe v02.0. 

#### **4.4 Iterasi Kedua — Prototipe Fungsional (Versi v02.0)** 

##### **4.4.1 Inisialisasi Proyek dan Lingkungan Pengembangan** 

Setelah wireframe divalidasi dan perubahan dicatat, pembangunan kode dimulai dari awal (v1) pada proyek React + TypeScript + Vite. Langkah-langkah berikut dilakukan secara berurutan untuk menyiapkan lingkungan pengembangan: 

**Langkah 1 yaitu Membuat proyek Vite.** Penulis membuka terminal dan menjalankan perintah: **npm create vite@latest bunga-kreativitas -- --template react-ts** . Perintah ini menghasilkan struktur folder proyek React + TypeScript yang siap digunakan, dengan file-file dasar: package.json, index.html, vite.config.ts, tsconfig.json, dan folder src/. 



<!-- Start of picture text -->
Fl cAWindows\systemaa\emde X +<br>Microsoft Windows [Version 10.0.26200.9457<br>(c) Microsoft Corporation. All rights reserved<br>C:\Users\NATALIA\Downloads\bot>npm create vite@latest bunga-kreativitas -- --template react-ts<br>Need to install the following packages<br>create-vite@9.2.1<br>Ok to proceed? Cy) y<br>> npx<br>> create-vite bunga-kreativitas --template react-ts<br>Which Linter to use?<br>Install with npm and start now?<br>Scaffolding project in C:\Users\NATALIA\Downloads\bot\bunga-kreativitas<br>Done. Now run<br>cd bunga-kreativitas<br>npm install<br>npm run dev<br><!-- End of picture text -->

**Gambar 4.5** Output Terminal — Inisialisasi Proyek Vite 

**Langkah 2 yaitu Menginstal dependensi dasar.** Penulis menjalankan: **npm install** untuk mengunduh React, ReactDOM, Vite, TypeScript, dan plugin React Vite. Setelah selesai, penulis menjalankan **npm run dev** untuk memverifikasi bahwa server pengembangan Vite berhasil berjalan di http://localhost:5173. Halaman default Vite tampil, yang menandakan lingkungan dasar sudah siap. 

**Langkah 3 yaitu Konfigurasi TypeScript.** File tsconfig.json diperbarui untuk mengaktifkan mode strict agar potensi kesalahan tipe data dapat terdeteksi sejak awal pengembangan. Konfigurasi "strict": true dan "moduleResolution": "bundler" ditambahkan. Konfigurasi ini penting mengingat nanti akan ada banyak struktur data kompleks (produk, pesanan, pesan chat) yang harus dikelola dengan aman. 

**Langkah 4 yaitu Menyiapkan file .env.** File .env dibuat dengan dua slot variabel lingkungan yang akan diisi kemudian, yaitu VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY. File .env.example juga dibuat sebagai dokumentasi untuk pengembang lain. Fitur referensi desain yang dibangun pada iterasi ketiga memakai Wikimedia Commons API yang bersifat publik dan tidak memerlukan API key, sehingga tidak ada variabel lingkungan tambahan untuk fitur tersebut. 

**Langkah 5 adalah Menetapkan struktur folder kerja.** Sebelum menulis komponen pertama, penulis menetapkan struktur folder yang akan digunakan secara konsisten sepanjang proyek: 

- src/app/pages/ — seluruh halaman aplikasi (sisi pembeli) 

- src/app/pages/seller/ — halaman khusus sisi penjual 

- src/app/components/ — komponen kustom yang dapat digunakan ulang 

- src/app/components/ui/ — komponen primitif shadcn/ui (Button, Card, Dialog, dll.) 

- src/app/lib/ — fungsi utilitas, wrapper API, dan helper 

- src/app/contexts/ — React Context untuk state global (auth, notifications) 

- src/styles/ — file CSS global (theme.css, fonts.css, tailwind.css) 

**Langkah 6 adalah Menginstal paket utilitas.** Beberapa pustaka yang akan digunakan di seluruh aplikasi diinstal sekaligus: 

- react-router-dom@6: manajemen routing antar halaman 

- lucide-react: set ikon SVG yang digunakan di seluruh antarmuka 

- motion: library animasi untuk transisi halaman dan komponen 

- sonner: toast notification yang muncul saat aksi berhasil atau gagal 

- clsx + tailwind-merge: helper untuk menggabungkan className secara kondisional 

##### **4.4.2 Instalasi dan Konfigurasi Tailwind CSS v4 serta shadcn/ui** 

Setelah struktur dasar siap, penulis menginstal dan mengonfigurasi fondasi visual aplikasi. Tailwind CSS v4 dipilih karena memberikan utilitas CSS yang konsisten dan mendukung sistem token desain melalui CSS custom properties. 

**Langkah 1 — Instal Tailwind CSS v4 dan PostCSS: npm install tailwindcss @tailwindcss/vite postcss autoprefixer** . File postcss.config.mjs dibuat untuk mendaftarkan Tailwind sebagai plugin PostCSS. 

**Langkah 2 — Membuat sistem token desain.** File src/styles/theme.css dibuat sebagai satu-satunya sumber kebenaran (single source of truth) untuk seluruh 

token visual aplikasi. Token yang didefinisikan meliputi: warna primer aplikasi (#B23A6B — warna merah-muda bunga), warna sekunder, warna surface kartu, border radius standar, dan font family. Dengan pendekatan ini, jika warna utama perlu diubah, cukup dilakukan di satu tempat. 

**Langkah 3 — Menambahkan komponen shadcn/ui.** Komponenkomponen primitif UI seperti Button, Card, Dialog, Input, Select, Badge, Avatar, Tabs, Sheet, dan sekitar 40 komponen lainnya ditambahkan ke folder src/app/components/ui/. Komponen-komponen ini menjadi fondasi yang digunakan oleh seluruh halaman aplikasi sehingga konsistensi visual terjaga tanpa perlu menulis CSS dari nol untuk setiap elemen UI. 

##### **4.4.3 Pembangunan Sistem Routing dan Layout Shell** 

Langkah berikutnya adalah membangun kerangka navigasi seluruh aplikasi menggunakan React Router v6. Routing yang baik memastikan setiap URL menghasilkan halaman yang tepat dan akses ke halaman tertentu dapat dibatasi berdasarkan peran pengguna. 

File src/app/routes.tsx dibuat untuk mendefinisikan seluruh rute aplikasi. Rute dibagi menjadi dua kelompok utama: rute publik yang dapat diakses siapa saja, dan rute terproteksi yang memerlukan login dan peran tertentu. 

Komponen BottomNavigation.tsx dibuat sebagai navigasi utama bagi sisi pembeli — berupa tab bar di bagian bawah layar dengan 5 tab: Beranda, Toko, Pesanan, Pesan, dan Profil. Komponen ini disembunyikan secara otomatis pada halaman login, registrasi, dan seluruh halaman seller. 

Komponen Root.tsx dibuat sebagai layout pembungkus yang berisi header sederhana, area konten halaman (outlet), dan BottomNavigation. Sedangkan komponen SellerLayout.tsx dibuat sebagai layout pembungkus untuk seluruh halaman seller, yang berisi sidebar navigasi penjual. 



<!-- Start of picture text -->
m ub Sees<br>o &<br><!-- End of picture text -->

**Gambar 4.7** Bottom Navigation Bar Sisi Pembeli 

##### **4.4.4 Integrasi Backend Supabase** 

Tahap ini merupakan fondasi terpenting karena seluruh data aplikasi akan tersimpan dan dikelola melalui Supabase. Penulis melakukan langkah-langkah berikut secara berurutan: 

**Langkah 1 — Membuat proyek Supabase baru.** Penulis membuka dashboard Supabase (supabase.com), membuat proyek baru, dan memilih region Singapore (ap-southeast-1) untuk meminimalkan latensi koneksi dari Manado, Sulawesi Utara. Setelah proyek siap, penulis menyalin Project URL dan Anon Public Key ke file .env. 

**Langkah 2 — Instal klien Supabase: npm install @supabase/supabase-js** . File src/app/lib/supabase.ts dibuat untuk menginisialisasi koneksi Supabase sebagai singleton — satu instance koneksi yang digunakan oleh seluruh bagian aplikasi. 

**Langkah 3 — Membuat skema database.** Penulis membuka SQL Editor di dashboard Supabase dan menjalankan file migrasi pertama (001_initial_schema.sql). Migrasi ini membuat 5 tabel inti aplikasi: users, shops, products, preorders, dan order_items. Setiap tabel dilengkapi dengan kolom yang sesuai, constraint (CHECK, UNIQUE, NOT NULL), dan index performa. 

Trigger khusus generate_order_number juga dibuat pada langkah ini. Trigger ini berjalan secara otomatis setiap kali ada pesanan baru dimasukkan ke tabel preorders, dan menghasilkan nomor pesanan dalam format ORD-YYYYMMDD#### yang unik. 



**Gambar 4.8** Hasil Migrasi Skema Database Awal di Supabase 

**Langkah 4 — Mengaktifkan Row Level Security (RLS).** File migrasi kedua (002_rls_policies.sql) dijalankan untuk mengaktifkan RLS pada seluruh tabel dan mendefinisikan policy akses data. Policy ini memastikan bahwa setiap pengguna hanya dapat membaca dan memodifikasi data miliknya sendiri — misalnya, pembeli hanya bisa melihat pesanannya sendiri, dan penjual hanya bisa mengedit produk milik tokonya. 

**Langkah 5 — Membuat Storage bucket.** Penulis membuat bucket bernama images pada layanan Supabase Storage untuk menyimpan foto produk dan foto toko. Bucket dikonfigurasi dengan mode public read agar URL gambar dapat diakses oleh siapa pun yang memiliki link, namun operasi upload dibatasi hanya untuk pengguna terautentikasi. 

##### **4.4.5 Pembangunan Sistem Autentikasi Multi-Peran** 

Sistem autentikasi adalah gerbang masuk ke seluruh fitur aplikasi. Pada tahap ini, penulis membangun flow registrasi, login, dan manajemen sesi untuk dua peran: Pembeli (Customer) dan Penjual (Seller). 

File src/app/contexts/AuthContext.tsx dibuat sebagai React Context yang menyediakan state autentikasi secara global ke seluruh komponen aplikasi. Context ini berisi state user (profil pengguna), loading (status saat mengecek sesi), serta fungsi signIn, signUp, dan signOut. 

Fungsi signUp diimplementasikan dengan alur atomik dua langkah: pertama memanggil supabase.auth.signUp untuk membuat akun pada layanan autentikasi 

Supabase, kemudian setelah mendapat user.id, menyimpan profil ke tabel public.users dengan atribut name, email, user_type, dan phone. Penting bagi kedua langkah ini untuk berhasil sebelum proses registrasi dianggap selesai. 

Listener supabase.auth.onAuthStateChange dipasang pada Context untuk memastikan state user selalu sinkron dengan token autentikasi — termasuk saat token di-refresh secara otomatis di latar belakang (Supabase merefresh token JWT setiap jam). 

Halaman Login.tsx dan Register.tsx kemudian dibangun. Halaman Register menyertakan toggle peran di bagian atas form (Pembeli / Penjual) yang mengubah tampilan secara visual dengan highlight warna. Setelah registrasi Seller berhasil, sistem otomatis mengarahkan ke halaman ShopRegister.tsx untuk mendaftarkan profil toko. 

Guard routing diimplementasikan pada routes.tsx: rute /seller/* hanya dapat diakses oleh user dengan user_type = seller, sedangkan rute /my-orders, /messages, /preorder dan lainnya memerlukan login aktif. Pengguna yang mencoba mengakses rute terproteksi tanpa login akan diarahkan ke halaman Login dengan parameter redirect. 



<!-- Start of picture text -->
Buat Akun Baru<br>Tpe Alun’<br>od<br>Penal<br>B+ Informasi Akun<br>Nama Lengkap<br>mai<br>Nomor Telepon<br>Pesovord* Konfimasi*<br>@ Alamat<br><!-- End of picture text -->

**Gambar 4.9** Tampilan Halaman Registrasi dengan Toggle Peran 



<!-- Start of picture text -->
Selamat Datang<br>Email<br>natalia@gmailcom<br>Password<br>Blum punya akun? Daftar Sekarang<br>Daftarkan Toko Bunga Anda ~<br><!-- End of picture text -->

**Gambar 4.10** Tampilan Halaman Login dan Pesan Error 

##### **4.4.6 Pembangunan Modul Manajemen Toko** 

Setelah autentikasi berfungsi, langkah berikutnya adalah membangun modul yang memungkinkan penjual mendaftarkan dan mengelola profil tokonya. 

Komponen ShopCategoryPicker.tsx dibangun untuk memilih kategori spesialisasi toko. Komponen ini menampilkan 8 kategori dalam grid kartu dengan ikon Lucide: Bunga Hidup, Bouquet Bunga, Bunga Duka (Krans), Bunga Uang, Papan Bunga, Bunga Wedding, Rangkaian Vas, dan Hadiah Bunga. Penjual dapat memilih lebih dari satu kategori (multi-select). 

Komponen ImageUpload.tsx dibangun untuk menangani upload foto. Komponen ini mendukung pratinjau gambar sebelum upload, validasi ukuran file (maksimum 5 MB) dan format (JPG/PNG/WebP), serta proses upload ke Supabase 

Storage dengan path yang terstruktur (shops/{user_id}/{timestamp}.{ext}). Setelah upload berhasil, public URL gambar dikembalikan untuk disimpan ke database. 

Komponen InteractiveMap.tsx dan ReadOnlyMap.tsx dibangun untuk fitur lokasi toko. InteractiveMap digunakan pada halaman registrasi toko agar penjual dapat menandai lokasi tokonya pada peta interaktif (klik peta → marker muncul → lat/lng disimpan ke form). ReadOnlyMap digunakan pada halaman ShopDetail dan ShopMap untuk pembeli yang ingin melihat lokasi toko. 

Komponen OpeningHoursPicker.tsx dibangun untuk mengatur jam operasional toko per hari. Komponen ini mendukung pilihan cepat seperti 'Tutup', '24 jam', dan 'Sama dengan Senin' untuk memudahkan penjual mengisi jadwal. Data jam buka disimpan sebagai string ringkas di kolom opening_hours. 



<!-- Start of picture text -->
= Seller Dashbo@ — P etic<br>© Kategori Spesialisasi Toko<br>= a<br>Bunga Hidup Bouquet Bunga<br>m aa<br>Bunga Duka (Krans) Bunga Uang<br>Papan Bunga Bunga Wedding<br>Bunga Vas Hadiah Bunga<br>(@uukopanio<br>Jam Buka<br>Hari Malai<br>Senin<br><!-- End of picture text -->

**Gambar 4.11** Formulir Registrasi Toko — Info Dasar dan Pilihan Kategori 



<!-- Start of picture text -->
= Seller Dashboo@ Puss<br>© Lokasi Toko<br>Alamat Lengkap<br>Kota<br>Manado<br>Pith Lokasi pada Peta<br>:<br>=<br>j<br>s) oh<br>Ss<br>%<br>Fak |<br>Bee |<br><!-- End of picture text -->

**Gambar 4.12** Formulir Registrasi Toko — Lokasi Peta dan Jam Operasional 

##### **4.4.7 Pembangunan Modul Katalog Produk** 

Modul produk memungkinkan penjual mengelola katalog bunga yang ditawarkan, termasuk fitur variasi harga per ukuran yang merupakan kebutuhan unik dari bisnis bunga. 

Halaman seller/ProductsManagement.tsx dibangun sebagai pusat manajemen produk. Halaman ini menampilkan daftar produk milik toko penjual yang sedang login, dengan badge status Ready Stock atau Pre-Order pada setiap kartu. Tombol Tambah Produk membuka dialog form penambahan produk. 

Fitur paling penting pada modul ini adalah toggle 'Gunakan variasi ukuran'. Ketika diaktifkan, form menampilkan 4 baris input harga (S, M, L, XL) dengan format Rupiah. Ketika dinonaktifkan, hanya ada satu field harga tunggal. Data harga variasi ukuran disimpan dalam kolom sizes bertipe JSONB pada tabel 

products, dengan struktur: {"S": 100000, "M": 150000, "L": 200000, "XL": 300000}. 

Database migration dilakukan untuk menambahkan kolom sizes JSONB: ALTER TABLE products ADD COLUMN sizes JSONB. Selain itu, kolom-kolom informasi bunga juga ditambahkan: flower_type (live/artificial/mixed), po_duration_days (durasi minimum pengerjaan), flower_lifetime_days (ketahanan bunga setelah diterima), dan care_instructions (petunjuk perawatan). 

**[ TEMPATKAN GAMBAR 4.13 DI SINI ]** _Tangkapan layar Dialog Form Tambah Produk pada halaman ProductsManagement. Terlihat toggle 'Gunakan variasi ukuran' dalam kondisi aktif, menampilkan 4 baris input harga (S: Rp100.000, M: Rp150.000, L: Rp200.000, XL: Rp300.000). Di bawahnya terdapat toggle PreOrder dalam kondisi aktif dengan field durasi pengerjaan (3 hari)_ 

**Gambar 4.13** Form Tambah Produk dengan Variasi Harga per Ukuran 

##### **4.4.8 Pembangunan Halaman Beranda dan Katalog Produk Pembeli** 

Dengan produk dan toko sudah bisa dibuat oleh penjual, kini saatnya membangun antarmuka browsing untuk sisi pembeli. 

Halaman Home.tsx dibangun dengan tata letak yang mengikuti wireframe yang telah divalidasi: di bagian atas terdapat sapaan personal ('Halo, {nama}!') bersama search bar. Di bawahnya, chip kategori tersusun dalam baris horizontal yang dapat di-scroll. Kemudian section 'Toko Pilihan' menampilkan 6 toko dengan rating tertinggi, diikuti section 'Produk Terbaru' dalam grid 2 kolom. Hero banner menampilkan animasi fade-in menggunakan library Motion untuk kesan visual yang menarik. 

Halaman Shops.tsx menampilkan daftar lengkap toko aktif dengan fitur pencarian nama toko dan filter multi-kategori melalui chip yang dapat dipilih lebih dari satu. Setiap kartu toko menampilkan foto banner, nama toko, badge kategori, rating bintang, dan indikator Buka/Tutup berdasarkan jam saat ini. 

Halaman ProductDetail.tsx dibangun sebagai halaman pembelian lengkap. Di bagian atas terdapat foto produk besar menggunakan komponen ImageWithFallback (yang menampilkan gambar placeholder jika foto gagal dimuat). Di bawahnya tersedia size picker dinamis yang menampilkan chip ukuran S/M/L/XL hanya untuk ukuran yang memiliki harga. Klik chip ukuran → harga di header berubah secara instan. Komponen FlowerInfoCard menampilkan informasi tambahan tentang bunga (tipe, durasi PO, ketahanan, petunjuk perawatan). Di bagian bawah terdapat dua tombol aksi besar: 'Pre-Order' dan 'Chat dengan Penjual'. 



<!-- Start of picture text -->
Bloemen e@ &<br>‘ ~ eg a<br>Setiap Hari<br>reas bunga trai sesual kebutuhan Anda<br>Kategori Lihat Semua<br>a4 ¥ t g.<br>Sascownuct p=tice<br>Rekomendasi Produk Linat Semua<br>@ @ @ i) 2<br><!-- End of picture text -->

**Gambar 4.14** Tampilan Halaman Beranda Sisi Pembeli 



<!-- Start of picture text -->
« @ [a P-cse<br>~ Cy<br>\ Ge vi4<br>PER a 4<br>S Oe ey oe<br>~ we<br>Pink Rosy<br>a=<br>aesocoo Rp 57.000<br>ih Ukuran<br>- : =<br>Deskripsi Produk<br>{eras bunga wama pink dan baby pink<br>0<br><!-- End of picture text -->

**Gambar 4.15** Tampilan Halaman Detail Produk dengan Size Picker 

##### **4.4.9 Pembangunan Modul Pre-Order dan Manajemen Pesanan** 

Modul pemesanan adalah inti dari fungsionalitas marketplace. Pada tahap ini, penulis membangun alur pemesanan end-to-end dari sisi pembeli dan alur manajemen pesanan dari sisi penjual. 

Halaman PreOrder.tsx dibangun sebagai formulir pemesanan yang mencakup: pemilihan jumlah, metode pengiriman (Pickup/Kirim), tanggal pengantaran dengan validasi (harus ≥ hari ini + po_duration_days produk), alamat lengkap (wajib jika metode Kirim), dan catatan khusus. Validasi tanggal ditampilkan sebagai pesan peringatan berwarna kuning dan tombol Konfirmasi didisable jika tanggal tidak valid. 

Saat pembeli menekan Konfirmasi, sistem melakukan dua operasi database secara berurutan: pertama insert ke tabel preorders (trigger database otomatis menghasilkan order_number unik), lalu insert ke tabel order_items dengan snapshot 

harga, nama produk, ukuran, dan jumlah pada saat pesanan dibuat. Snapshot ini penting agar riwayat pesanan tidak berubah meskipun penjual kemudian mengubah harga produk. 

Halaman Payment.tsx menjelaskan bahwa sistem tidak memiliki payment gateway — koordinasi pembayaran dilakukan melalui fitur chat. Halaman ini menampilkan nomor pesanan yang baru dibuat dan tombol 'Buka Chat' untuk langsung terhubung dengan penjual. 

Halaman MyOrders.tsx (sisi pembeli) dan seller/OrdersManagement.tsx (sisi penjual) dibangun bersamaan. Dari sisi penjual, pesanan masuk dapat difilter berdasarkan status melalui tab, dan aksi perubahan status (confirmed, processing, ready, delivered, cancelled) tersedia melalui dropdown. 



<!-- Start of picture text -->
2,<br>ot<br>Pre-Order Bunga<br>© Pesanan Anda<br>Ce Rosy (Ukuran S) Rp $7.000<br>Total Rp 57.000<br>© Metode Pengambilan *<br>@ in’)<br>Ambil Sendiri Kirim<br>€3 Tanggal & Jam Pengambilan *<br>mm/dd/yy fo)<br>10:00 AM (c)<br>D Permintaan Khusus (Opsional)<br><!-- End of picture text -->

**Gambar 4.16** Halaman Formulir Pre-Order 



<!-- Start of picture text -->
= seteroasioo® Pine<br>Q Cari pesanan, nama pelanggan.<br>Semua (13)<br>Total Pesanan Pending<br>13 10<br>Diproses<br>1<br>‘ORD-20260924-MUEV9DOC-<br>© assqus<br>24 September<br>2026 pukul 09.41<br>Pelanggan<br>Natalia Kristian<br>085632965312<br>Produk<br>Pink Rosy (Ukuran S)<br>Ot<br>Rp 57.000 26 Sep 2026, 18.00<br>Menage<br>© detail<br><!-- End of picture text -->

**Gambar 4.17** Halaman Manajemen Pesanan Sisi Penjual 

##### **4.4.10 Pembangunan Fitur Chat Real-time** 

Fitur chat real-time adalah salah satu komponen teknis paling kompleks dalam aplikasi ini karena membutuhkan sinkronisasi data dua arah secara instan antara dua pengguna yang berbeda. 

Langkah pertama adalah membuat struktur database untuk chat. Migrasi (003_new_features.sql) menambahkan dua tabel: conversations (menyimpan kanal percakapan antara satu pembeli dan satu penjual untuk satu toko tertentu, dengan constraint UNIQUE pada kombinasi user1_id+user2_id+shop_id untuk mencegah duplikasi percakapan) dan messages (menyimpan isi setiap pesan dengan atribut sender_id, receiver_id, message, is_read). 

Trigger update_conversation_on_message dibuat agar setiap insert pesan baru secara otomatis memperbarui field last_message, last_message_at, dan 

menaikkan unread_count pada tabel conversations — digunakan untuk menampilkan jumlah pesan belum dibaca (badge merah) pada daftar percakapan. 

Halaman Messages.tsx (daftar percakapan) dan ChatRoom.tsx (ruang chat) dibangun. Pada ChatRoom, pesan ditampilkan dalam format bubble — bubble kanan untuk pesan sendiri (warna pink), bubble kiri untuk lawan bicara (warna abuabu). Timestamp ditampilkan di bawah setiap bubble. 

Bagian paling kritis adalah implementasi Supabase Realtime. Setelah ChatRoom terbuka, aplikasi membuat subscription ke kanal Postgres Changes untuk tabel messages dengan filter conversation_id. Setiap kali ada pesan baru diinsert oleh pihak lain, Supabase mengirimkan event ke semua subscriber kanal tersebut melalui WebSocket, dan fungsi appendMessage dipanggil untuk menambahkan bubble pesan baru ke UI tanpa perlu me-reload halaman. 



<!-- Start of picture text -->
< @ Didit flo<br>yy Reo<br>“ ») ee °<br>Pet i me A<br>Dutt<br>rose pink<br>Banga<br>roe pik bungee phar puth<br>Rp 120.000<br>Pe dt<br>><br>‘$ Kirim PenawarH a rgan<br><!-- End of picture text -->

**Gambar 4.18** Tampilan Fitur Chat Real-time Antara Pembeli dan Penjual 

##### **4.4.11 Error yang Ditemui dan Cara Penyelesaiannya pada Iterasi Kedua** 

Selama proses konstruksi iterasi kedua, penulis menemukan beberapa error teknis yang perlu diselesaikan sebelum evaluasi dengan responden dapat dilakukan: 

**Tabel 4.2 Daftar Error dan Penyelesaian pada Iterasi v02.0** 

|**N**<br>**o**|**Kode**<br>**Error**|**Penyebab**|**Dampak**|**Solusi**|
|---|---|---|---|---|
|1|RLS 42501|Policy RLS belum<br>mencakup INSERT<br>untuk tabel users saat<br>registrasi|Registrasi akun<br>gagal — profil<br>tidak tersimpan|Menambahkan policy 'Users can insert<br>their own profile' pada tabel users di<br>Supabase SQL Editor|
|2|TypeScript<br>TS2339|Interface Product<br>belum memiliki field<br>'sizes' setelah migrasi<br>kolom JSONB|Kode error di<br>kompilasi:<br>Property 'sizes'<br>does not exist on<br>type 'Product'|Menambahkan field 'sizes?:<br>Record<string, number> | null' ke<br>interface Product di file api.ts|
|3|Nomor<br>Pesanan<br>Duplikat|Trigger<br>generate_order_numbe<br>r tidak menggunakan<br>LOOP untuk<br>pengecekan keunikan|Pada kondisi<br>concurrent insert,<br>dua pesanan<br>mendapatkan<br>nomor yang sama|Trigger diubah menggunakan LOOP<br>dengan pengecekan NOT EXISTS<br>sebelum commit. File patch:<br>FIX_ORDER_NUMBER_DUPLICATE.s<br>ql|
|4|Realtime<br>tidak<br>menerima<br>event|Supabase Realtime<br>belum diaktifkan pada<br>tabel messages di<br>dashboard|Pesan tidak<br>muncul secara<br>otomatis, harus<br>refresh halaman|Masuk ke Supabase Dashboard →<br>Database → Replication → aktifkan<br>Realtime untuk tabel messages dan<br>conversations|
|5|Foto<br>produk<br>gagal<br>ditampilka<br>n|Public URL Supabase<br>Storage berubah<br>setelah bucket di-<br>recreate|Semua gambar<br>produk<br>menampilkan<br>placeholder/broke<br>n image|Memastikan konfigurasi bucket images<br>konsisten. Tidak me-recreate bucket<br>setelah ada data. Update URL di database<br>via SQL UPDATE|



##### **4.4.12 Evaluasi Prototipe v02.0 (Pengambilan Data Iterasi 2)** 

Setelah seluruh fitur inti berhasil dibangun dan error diselesaikan, penulis mengkompilasi APK sementara menggunakan Capacitor untuk diuji oleh responden pada perangkat nyata. Sesi evaluasi dilakukan dengan 8 responden (4 calon penjual dan 4 calon pembeli), jauh lebih banyak dari iterasi pertama karena kini ada fungsionalitas nyata yang dapat dicoba. 

Responden diminta untuk menyelesaikan serangkaian task: mendaftar akun, membuat pesanan, mengirim pesan di chat, dan (untuk penjual) menambah produk serta memperbarui status pesanan. Seluruh dokumentasi foto pengujian dengan responden disertakan pada Lampiran E. 

**Tabel 4.3 Hasil Evaluasi dan Tabel Perubahan Prototipe v02.0** 

|No|Temuan<br>Responden|Perubahan / Fitur<br>Tambahan|Modul Terdampak|Status|
|---|---|---|---|---|
|1|Tidak ada<br>pemberitahuan<br>saat pesanan<br>baru masuk atau<br>status berubah<br>( harus refresh<br>manual)|Implementasikan<br>sistem notifikasi in-<br>app dengan real-<br>time bell<br>notification dan<br>toast|Modul Notifikasi (baru)|✓<br>(v03.0)|
|2|Tidak bisa<br>memberi ulasan<br>setelah pesanan<br>selesai|Implementasikan<br>fitur Review &<br>Rating dengan<br>ReviewForm,<br>ReviewList, dan<br>trigger update<br>ratingtoko|Modul Ulasan (baru)|✓<br>(v03.0)|
|3|Tidak ada cara<br>untuk membuat<br>penawaran harga<br>spesifik dalam<br>chat (hanya teks<br>bebas)|Implementasikan<br>fitur Custom Order<br>Quote — kartu<br>penawaran<br>terstruktur dalam<br>alur chat|Modul Penawaran<br>Kustom (baru)|✓<br>(v03.0)|
|4|Sulit mencari<br>inspirasi desain<br>— harus keluar<br>dari aplikasi ke<br>Google|Implementasikan<br>halaman Referensi<br>Desain yang<br>menampilkan<br>gambar inspirasi<br>dari Wikimedia<br>Commons dan foto<br>produk toko,<br>lengkap dengan<br>pengiriman<br>referensi ke toko|Modul Referensi Desain<br>(baru)|✓<br>(v03.0)|
|5|Tidak ada<br>laporan<br>penjualan —<br>penjual masih<br>harus mencatat<br>manual|Implementasikan<br>Dashboard Penjual<br>+ Rekap Penjualan<br>PDF menggunakan<br>jsPDF|Modul Dashboard &<br>Rekap (baru)|✓<br>(v03.0)|



|No|Temuan<br>Responden|Perubahan / Fitur<br>Tambahan|Modul Terdampak|Status|
|---|---|---|---|---|
|6|Tidak ada fitur<br>diskon produk|Tambahkan toggle<br>diskon persentase<br>dengan preview<br>harga akhir dan<br>badge Diskon pada<br>kartuproduk|ProductsManagement.tsx<br>, ProductDetail.tsx|✓<br>(v03.0)|



Hasil evaluasi v02.0 menghasilkan 6 permintaan fitur tambahan yang semuanya akan diimplementasikan pada iterasi ketiga (v03.0). Seluruh permintaan ini mencerminkan kebutuhan nyata yang belum terpenuhi dalam prototipe fungsional awal. 

#### **4.5 Iterasi Ketiga — Versi Final (Versi v03.0 / v1.0.0)** 

##### **4.5.1 Identifikasi Kebutuhan Iterasi Ketiga** 

Berdasarkan daftar perubahan dari evaluasi v02.0, iterasi ketiga berfokus pada pembangunan modul-modul lanjutan: Sistem Notifikasi In-App, Penawaran Harga Kustom, Fitur Ulasan & Rating, Diskon Produk, Referensi Desain (Wikimedia Commons dan foto produk toko), dan Dashboard Penjual + Rekap PDF. Selain itu, pada iterasi ini juga dilakukan pembungkusan final aplikasi ke APK Android menggunakan Capacitor. 

##### **4.5.2 Implementasi Sistem Notifikasi In-App** 

Sistem notifikasi dibangun menggunakan kombinasi database trigger (untuk membuat notifikasi secara otomatis) dan Supabase Realtime (untuk menampilkan notifikasi secara instan tanpa refresh halaman). 

**Langkah 1 — Membuat tabel notifikasi.** Migrasi SQL dijalankan untuk membuat tabel notifications dengan kolom: id, user_id, type (ENUM: order_new, order_status_changed, quote_received, quote_accepted, quote_rejected, chat_new), title, message, is_read, dan quote_id. 

**Langkah 2 — Membuat trigger notifikasi.** Dua trigger database dibuat: pertama, trigger AFTER INSERT pada tabel preorders yang membuat notifikasi order_new untuk penjual setiap kali ada pesanan baru. Kedua, trigger AFTER 

UPDATE pada tabel preorders yang membuat notifikasi order_status_changed untuk pembeli setiap kali status pesanan berubah. 

**Langkah 3 - Membangun komponen NotificationBell.tsx.** Komponen ini ditempatkan di header aplikasi dan menampilkan ikon lonceng dengan badge merah berisi jumlah notifikasi belum dibaca. Klik lonceng membuka dropdown yang menampilkan maksimum 10 notifikasi terbaru. Subscription Supabase Realtime dipasang agar lonceng terupdate secara langsung saat notifikasi baru tiba — pengguna tidak perlu me-refresh halaman. 



<!-- Start of picture text -->
= Seller Dashbox@ — LP erate<br>Notifiasi Teds bts x<br>2 Pesanan<br>Me conan57.000.  barKkBaruunt “PinkMasukkoofirmasRosy (Ukuran5) seni Rp .<br>Msp ont<br>Pesaran Baru Masuk .<br>I cia menerinapearan snk py 57200<br>2asenorai<br>fy. Pesnan<br>Pesanan57.000 lieBarubaruuntuk Mask“PinkkonfimasRosy (Ukuran $) senilai Rp .<br>Dsp2o4<br>fy Pesaran<br>‘Anda menerimaBau Maskpesanan seni Rp 57000 :<br>2 sep 2134<br>Pesaran<br>ee aranba120.00. KlikBaruunt Masuk“BuKonia rose pi” sea Rp .<br>I Pesanana meneria Baru Masopesaran seni Rp 120000 .<br>Prod<br>Pink Rosy (Ukuran S)<br>Qt<br>Rp 57.000 26 Sep 2026, 18.00<br>Mone<br><!-- End of picture text -->

**Gambar 4.19** Komponen NotificationBell — Dropdown Notifikasi 

##### **4.5.3 Implementasi Fitur Penawaran Harga Kustom (Custom Order Quotes)** 

Fitur ini memungkinkan penjual membuat penawaran harga yang terstruktur (bukan sekadar teks) dalam alur percakapan chat, dan pembeli dapat menerima atau menolak penawaran tersebut. 

**Langkah 1 — Migrasi tabel custom_order_quotes.** Tabel baru dibuat dengan kolom: id, conversation_id, seller_id, buyer_id, product_name, description, price, design_reference_url, status (ENUM: pending/accepted/rejected/expired), expires_at, dan responded_at. 

**Langkah 2 — Trigger notifikasi penawaran.** Trigger AFTER INSERT pada tabel custom_order_quotes membuat notifikasi quote_received untuk pembeli. Trigger AFTER UPDATE membuat notifikasi quote_accepted atau quote_rejected untuk penjual berdasarkan perubahan status. 

**Langkah 3 — Komponen CustomOrderQuote.tsx.** Dalam alur chat, penjual menekan tombol 'Buat Penawaran' yang membuka modal dengan field: nama produk, deskripsi, harga, referensi gambar (opsional, dapat berasal dari halaman Referensi Desain atau unggahan foto), dan tanggal kedaluwarsa penawaran. Penawaran yang terkirim muncul sebagai kartu khusus dalam alur chat (bubble dengan warna berbeda dari pesan biasa), bukan sebagai teks polos. 

Dari sisi pembeli, kartu penawaran menampilkan nama produk, deskripsi, harga dalam format Rupiah, dan dua tombol: 'Terima' dan 'Tolak'. Tombol hanya aktif jika status masih pending dan penawaran belum kedaluwarsa. Jika kedaluwarsa, kartu menampilkan label 'Kedaluwarsa' dan tombol di-disable. 



<!-- Start of picture text -->
< @ Didit flo<br>© Rerenidesn y<br>Poppies bouguet 2017<br>Peo bet200 GH<br>Poppies<br>bagus manta<br>Rp 200.000<br>=<br><!-- End of picture text -->

**Gambar 4.20** Kartu Penawaran Harga Kustom dalam Alur Chat 

##### **4.5.4 Implementasi Fitur Ulasan dan Rating** 

Fitur ulasan dan rating membangun kepercayaan dalam ekosistem marketplace dengan memungkinkan pembeli memberikan penilaian setelah transaksi selesai, dan penilaian tersebut secara otomatis memperbarui reputasi toko. 

**Langkah 1 — Migrasi tabel reviews.** Tabel dibuat dengan constraint UNIQUE pada order_id untuk memastikan satu pesanan hanya menghasilkan satu ulasan. Field kolom meliputi: id, order_id (FK UNIQUE), shop_id, user_id, rating (INTEGER CHECK 1-5), comment, dan images (TEXT[]). 

**Langkah 2 — Trigger update rating toko.** Trigger update_shop_rating dibuat pada tabel reviews. Setiap kali ada ulasan baru diinsert atau diupdate, trigger secara otomatis menghitung ulang rating rata-rata toko (AVG dari semua rating) dan jumlah total ulasan, lalu memperbarui kolom rating dan total_reviews di tabel shops. 

**Langkah 3 — Komponen ReviewForm.tsx, ReviewList.tsx, dan ReviewDisplay.tsx.** ReviewForm menampilkan komponen pemilihan bintang interaktif (1–5), textarea komentar, dan upload foto opsional. Form ini dapat diakses dari halaman MyOrders pada pesanan dengan status delivered. ReviewList dan ReviewDisplay menampilkan daftar ulasan pada halaman ShopDetail dan halaman profil produk. 

Halaman seller/SellerReviews.tsx dibangun untuk penjual, menampilkan seluruh ulasan yang diterima tokonya beserta statistik distribusi bintang. 



<!-- Start of picture text -->
Pink Rosy (Ukuran $) nost.000<br>8<br>26 September 2026, 18.00<br>cc)<br>Ambil sendiri di toko<br>Total Rp 57.000<br>Beri Rating “<br>Berikan Review<br>Pink Rosy (Ukuran S)<br>Rating*<br>Komentar (Opsional)<br><!-- End of picture text -->

**Gambar 4.21** Komponen Form Ulasan dan Rating 

##### **4.5.5 Implementasi Fitur Diskon Produk** 

Fitur diskon memungkinkan penjual memberikan harga promosi sementara pada produk tertentu, dengan perhitungan harga akhir yang dilakukan otomatis oleh database trigger. 

**Langkah 1 — Migrasi kolom diskon.** Kolom-kolom berikut ditambahkan ke tabel products: discount_percentage (INTEGER), discount_price (DECIMAL), discount_start_date, discount_end_date, dan is_on_discount (BOOLEAN). 

**Langkah 2 — Trigger kalkulasi harga diskon.** Trigger calculate_discount_price dibuat BEFORE INSERT/UPDATE pada tabel products. Logika trigger: jika is_on_discount = TRUE dan discount_percentage > 0, maka discount_price = price * (1 - discount_percentage / 100.0). Jika tidak, discount_price = NULL. Dengan pendekatan ini, perhitungan harga tidak pernah salah karena dilakukan di sisi database, bukan di sisi klien. 

**Langkah 3 — Komponen DiscountBadge.tsx dan pembaruan tampilan produk.** Komponen badge merah kecil bertuliskan '-20%' (sesuai persentase diskon) ditambahkan pada kartu produk dan halaman detail produk. Harga asli ditampilkan dengan strikethrough (coret) dan harga diskon ditampilkan lebih menonjol di bawahnya. 



<!-- Start of picture text -->
Satu Harga Per Ukuran (S-XL)<br>Harga Rp)<br>500000<br>Kategori<br>& Papan Bunga .<br>Gambar Produk<br>Rateoe Tay aa<br>SSEAP. cagli” QP MpPiston, bese...GeGi<br>oy 6 ins uence af 2<br>My * mmeavaniarcmecny © Sy<br>A or Dn DAPYLCWE WITTY 3<br>» Aitifkan Diskon<br>Persentase Diskon (%)<br>20<br>orga staan ciskor: Rp 400.000<br>Detail Bunga<br>Tipe Bunga<br>& Bunga Arifcial .<br><!-- End of picture text -->

**Gambar 4.22** Fitur Pengaturan Diskon Produk dengan Preview Harga Realtime 



<!-- Start of picture text -->
ts Prenter<br>Tn 1 “ee.ee<br>| cuteePapan 205 bunga}  duka<br>20 Rp 400.000<br><!-- End of picture text -->

**Gambar 4.23** Tampilan Badge Diskon pada Kartu Produk 

##### **4.5.6 Implementasi Halaman Referensi Desain Bunga (Wikimedia Commons dan Foto Produk Toko)** 

Halaman Referensi Desain (DesignReference.tsx) dibangun untuk membantu pembeli menemukan inspirasi rangkaian bunga, kemudian mengirimkan gambar pilihan tersebut kepada toko untuk meminta penawaran harga. Halaman ini menggabungkan dua sumber gambar. Sumber pertama adalah Wikimedia Commons, yaitu repositori berkas media bebas lisensi yang dapat diakses melalui API publik tanpa API key, sehingga aplikasi tidak perlu menyimpan gambar inspirasi pada penyimpanannya sendiri. Sumber kedua adalah foto produk nyata dari toko-toko yang terdaftar pada aplikasi. 

Kemampuan utama halaman Referensi Desain adalah sebagai berikut: 

1. Menampilkan gambar inspirasi rangkaian bunga dari Wikimedia Commons. 

2. Menerima pencarian dalam Bahasa Indonesia, yang diterjemahkan otomatis ke bahasa Inggris sebelum dikirim ke Wikimedia Commons. 

3. Menampilkan foto produk nyata dari toko sebagai gambar utama, yang disisipkan di sela-sela gambar Wikimedia Commons. 

4. Mencocokkan foto produk dengan kata kunci atau kategori yang dicari pembeli. 

5. Memungkinkan setiap gambar, baik foto produk maupun gambar Wikimedia Commons, dikirim ke toko melalui dialog "Kirim Referensi Desain". 

**Langkah 1 — Membuat modul akses Wikimedia Commons.** File src/app/lib/wikimedia.ts dibuat berisi fungsi searchWikimedia yang menerima kata kunci dan nomor halaman, lalu memanggil endpoint api.php Wikimedia Commons. Permintaan menggunakan mode pencarian generator=search pada namespace berkas (gsrnamespace=6), dua belas hasil per halaman (gsrlimit=12), serta properti imageinfo (iiprop=url|extmetadata dan iiurlwidth=800) agar diperoleh gambar berukuran sedang beserta metadatanya. Karena API bersifat publik, tidak diperlukan pendaftaran akun pengembang maupun variabel lingkungan tambahan. Dari respons diambil tautan gambar mini (thumburl), deskripsi (ImageDescription), nama pembuat (Artist), dan tautan halaman berkas (descriptionurl). Data tersebut dipakai untuk menampilkan atribusi pembuat pada setiap kartu dan menautkannya ke halaman berkas pada Commons, sesuai pedoman lisensi bebas. 

**Langkah 2 — Membangun halaman DesignReference.tsx.** Di bagian atas halaman terdapat search bar dan baris chip pencarian populer (Wedding Bouquet, Funeral Wreath, Birthday Flowers, Graduation Flowers, dan Bouquet Pastel) yang memakai nilai searchQuery pada file shopCategories.ts. Hasil ditampilkan pada grid dua kolom untuk layar mobile dengan tombol "Muat Lebih Banyak" untuk memuat halaman berikutnya. Pembeli dapat mengetik kata kunci dalam Bahasa Indonesia, misalnya "wedding", "duka", atau "bouquet". Kata kunci tersebut diterjemahkan otomatis ke bahasa Inggris sebelum dikirim ke Wikimedia Commons. 

**Langkah 3 — Mengintegrasikan foto produk toko.** Perubahan pada tahap ini terpusat pada satu berkas, yaitu DesignReference.tsx, dan tidak menambah pustaka atau dependensi baru. Tipe data gambar referensi (DesignImage) diperluas dengan atribut isProduct, price, productId, shopId, shopName, dan category agar dapat membawa data produk. Fungsi-fungsi dan state yang ditambahkan diringkas pada Tabel 4.4. 

**Tabel 4.4 Elemen Baru pada DesignReference.tsx untuk Integrasi Foto Produk Toko** 

|**No**|**Elemen**|**Jenis**|**Fungsi**|
|---|---|---|---|
|1|DesignImage|Tipe data|Perluasan tipe gambar Wikimedia dengan atribut produk:<br>isProduct, price, productId, shopId, shopName, category|
|2|products|State|Daftar produk toko yang memiliki foto (image_url)|
|3|committedQuery|State|Kata kunci pencarian aktif yang dipakai untuk<br>mencocokkan produk. Dikosongkan saat memuat<br>inspirasi populer, diisi teks pengguna saat pencarian<br>dikirim, dan diisi term yang diklik saat chip populer<br>dipilih|
|4|fetchProducts|Fungsi|Mengambil semua produk berstatus tersedia beserta<br>relasi toko (melalui getAllProducts pada api.ts) yang<br>memiliki foto. Dipanggil sekali saat halaman dibuka|
|5|productToImage|Fungsi|Mengubah objek produk menjadi objek gambar referensi<br>(judul, deskripsi berisi kategori dan harga, serta nama<br>toko)|
|6|matchProducts|Fungsi|Menyaring produk berdasarkan kata kunci Bahasa<br>Indonesia pada nama, deskripsi, dan kategori produk.<br>Jika kata kunci kosong, seluruh produk ditampilkan|
|7|interleave|Fungsi|Menempatkan foto produk sebagai gambar utama yang<br>muncul lebih dulu, lalu menyebarkannya merata di antara<br>gambar Wikimedia Commons agar produk tidak<br>menumpuk di bagian atas|
|8|displayImages|useMemo|Menggabungkan hasil matchProducts(committedQuery)<br>dengan gambar inspirasi Wikimedia Commons melalui<br>interleave; menjadi sumber data grid|



**Langkah 4 — Membangun tampilan kartu produk pada grid.** Grid kini merender displayImages dan bukan lagi hanya gambar Wikimedia Commons. Kartu produk toko dibedakan dari kartu Wikimedia Commons melalui bingkai (ring) warna primer, badge "Produk Toko" di pojok kiri atas, deskripsi yang memuat kategori dan harga (misalnya "Wedding • Rp 350.000"), serta nama toko yang tampil saat kartu di-hover. Label bagian diubah menjadi "Produk Toko + Wikimedia". Kondisi tombol "Muat Lebih Banyak" dan tampilan kosong (empty state) juga disesuaikan agar memakai displayImages. 



<!-- Start of picture text -->
© Kembali e<br>Inspirasi Populer ProdukToko + Wisimedis<br>ee “Se<br>or<br>a<br>A Ge<br><!-- End of picture text -->

**Gambar 4.24** Halaman Referensi Desain Bunga (Produk Toko + Wikimedia Commons) 



<!-- Start of picture text -->
Vemae OO<br><!-- End of picture text -->

**Gambar 4.25** Perbedaan Kartu Produk Toko dan Kartu Gambar Wikimedia Commons 



<!-- Start of picture text -->
© Kembalt<br>on<br>@S<br>Referensi Desain Bunga<br>Q. Buket mawar<br>=<br>© Toko Bunga Terdekat<br>nid<br>Bunga cira Lestr<br>Bagas Flower<br><!-- End of picture text -->



<!-- Start of picture text -->
© Kembalt<br>Produk<br>Toko + Wikimedia<br>are af<br>*<br>oe<br>ey. i<br>or<br>2D<br>_<br>\<br>)<br>\ p<br>Keos7<br><!-- End of picture text -->

**Gambar 4.26** Hasil Pencarian Referensi Desain dengan Kata Kunci Bahasa Indonesia 

**Langkah 5 — Mengirim referensi ke toko.** Setiap kartu pada grid, baik foto produk maupun gambar Wikimedia Commons, dapat diketuk untuk membuka dialog "Kirim Referensi Desain". Pembeli memilih toko tujuan, dan sistem mengarahkan pembeli ke ChatRoom dengan referensi desain terlampir (gambar, judul, dan deskripsi) sebagai pesan kepada penjual. Kolom referensi desain pada tabel percakapan telah disiapkan melalui migrasi tambahan (ADD_DESIGN_REF_TO_CONVERSATIONS.sql dan UPDATE_OLD_CONVERSATIONS.sql) sehingga berlaku untuk percakapan lama maupun baru. Penjual kemudian dapat menindaklanjuti referensi tersebut dengan kartu penawaran kustom yang menempelkan gambar referensi yang sama (Subbab 4.5.3), sehingga alur diskusi hingga penawaran harga berlangsung mulus dalam satu aplikasi. 



<!-- Start of picture text -->
iy ee. §<br>7;ie —<br>Buket mawar biru putih<br>Pith Toko Tuan:<br>i 7<br>Bunga cia Lestar 4<br>es 7<br>Dia rise, Bee<br>asdasdadcree MMe<br>Mamatforst a<br><!-- End of picture text -->



<!-- Start of picture text -->
< @ Didit florist<br>CLIT, B meestorin ,<br>£ moe 4<br>OWE RT YU IOP<br>ASDFGHJKL<br>7X CVBNM@<br>(eee 5<br><!-- End of picture text -->

**Gambar 4.27** Dialog Kirim Referensi Desain ke Toko 

|| **[ TEMPATKAN GAMBAR 4.28 DI SINI ]** || _Tangkapan layar ChatRoom setelah pembeli memilih toko. Pesan referensi desain (gambar, judul,_ || _dan deskripsi) tampil sebagai bubble pembeli di sisi kanan, disusul balasan penjual di sisi kiri._ || 

**Gambar 4.28** Referensi Desain Terlampir pada Percakapan Pembeli dan Penjual 

##### **4.5.7 Implementasi Dashboard Penjual dan Rekap Penjualan PDF** 

Modul ini menyediakan alat analisis bisnis sederhana bagi penjual untuk memantau performa toko dan menghasilkan laporan penjualan yang dapat dicetak. 

Komponen SellerLayout.tsx dibangun sebagai layout pembungkus untuk seluruh halaman seller. Komponen ini berisi sidebar navigasi dengan menu: Dashboard, Produk, Pesanan, Chat, Pengaturan Toko, Ulasan, dan Rekap Penjualan. 

Halaman SellerDashboard.tsx menampilkan 4 kartu metrik bisnis yang datanya diambil dari Supabase secara real-time: Total Pendapatan (sum total_amount dari preorders dengan status delivered), Pesanan Menunggu (count preorders status pending), Total Produk Aktif (count products dengan is_available = true), dan Rating Toko (nilai shops.rating dengan total jumlah ulasan). 

Halaman SalesReport.tsx menyediakan tabel rekap pesanan dengan filter rentang tanggal dan status. Integrasi jsPDF dan jspdf-autotable memungkinkan ekspor ke PDF dengan satu klik tombol. PDF yang dihasilkan mencakup header nama toko, periode laporan, tabel data pesanan (nomor pesanan, tanggal, pembeli, item, total, status), total pendapatan keseluruhan, dan nomor halaman di footer. Pada penyempurnaan akhir (v136), header laporan diberi nama toko yang lebih menonjol, footer memuat penomoran halaman (misalnya "Hal. 1 dari 3"), nilai mata uang diformat konsisten dengan Intl.NumberFormat('id-ID'), dan tersedia tombol Ekspor Excel (excelExport.ts) sebagai alternatif keluaran berformat .xlsx. 



<!-- Start of picture text -->
[memesesata wan |<br>= Seller Dashboard Pe ro40<br>Dashboard Penjual<br>5<br>Rp 217.000 rs |<br>o-<br>Ps<br><!-- End of picture text -->

**Gambar 4.29** Tampilan Dashboard Penjual dengan Metrik Bisnis 



<!-- Start of picture text -->
Rekap Hasil Penjualan<br>Fits Perade<br>vapora026 :<br>5 Rp 384.000<br><!-- End of picture text -->

**Gambar 4.30** Preview PDF Rekap Penjualan yang Dihasilkan Sistem 

##### **4.5.8 Pembungkusan Aplikasi ke Android dengan Capacitor** 

Langkah terakhir dalam proses konstruksi adalah mengonversi aplikasi web React yang telah dibangun menjadi APK Android yang dapat diinstal pada perangkat fisik. Proses ini dilakukan menggunakan Capacitor, framework yang memungkinkan satu basis kode web dijalankan sebagai aplikasi native Android. 

**Langkah 1 — Instal Capacitor dan plugin yang dibutuhkan: npm install @capacitor/core @capacitor/android @capacitor/geolocation @capacitor/filesystem @capacitor/share @capacitor/browser** . Setiap plugin melayani kebutuhan spesifik: geolocation untuk peta toko, filesystem untuk menyimpan PDF rekap ke perangkat, share untuk berbagi PDF ke WhatsApp, dan browser untuk membuka tautan berkas Wikimedia Commons di dalam aplikasi. 

**Langkah 2 — Membuat file konfigurasi capacitor.config.ts dengan pengaturan:** appId ‘com.flowermarketplace.app’, appName ‘Bloemen Marketplace’, dan webDir ‘dist’ (direktori output build Vite). Skrip build Android ditambahkan ke package.json: **“build:android”: “vite build && npx cap sync android”** . 

Langkah 3 — Menjalankan perintah **npm run build** untuk mengompilasi seluruh kode React menjadi ayer produksi statis di folder dist/. Kemudian perintah **npx cap add android** dijalankan untuk membuat folder android/ berisi proyek Android Studio dengan seluruh konfigurasi Gradle. 

**Langkah 4 — Mengedit file AndroidManifest.xml untuk menambahkan permission yang diperlukan:** INTERNET (koneksi ke Supabase dan Wikimedia Commons API), ACCESS_FINE_LOCATION dan ACCESS_COARSE_LOCATION (fitur peta toko), serta READ_EXTERNAL_STORAGE dan WRITE_EXTERNAL_STORAGE (untuk fitur simpan PDF rekap). 

Langkah 5 — Membuka proyek di Android Studio menggunakan perintah **npx cap open android** . Di Android Studio, penulis memilih menu Build → Build APK(s). Proses kompilasi Gradle berjalan dan menghasilkan file app-debug.apk yang siap diinstal pada perangkat fisik. 



<!-- Start of picture text -->
[ TEMPATKAN GAMBAR 4.31 DI SINI ]<br>Tangkapan ayer terminal yang menampilkan output perintah npx cap add android dan npx cap<br>sync berjalan sukses. Terlihat pesan 'Android platform added!' dan 'Sync finished in 2.3s'<br><!-- End of picture text -->

**Gambar 4.31** Output Terminal — Proses Inisialisasi Capacitor Android 



<!-- Start of picture text -->
[ TEMPATKAN GAMBAR 4.32 DI SINI ]<br>Tangkapan layar Android Studio menampilkan proses Build APK sedang berjalan (progress bar<br>Gradle). Di bawah terlihat pesan output 'BUILD SUCCESSFUL in 2m 45s'. File app-debug.apk<br>terlihat pada panel file manager pojok kanan bawah<br><!-- End of picture text -->

**Gambar 4.32** Proses Build APK di Android Studio 



**Gambar 4.33** File APK Hasil Build dan Aplikasi Terinstal pada Perangkat 

##### **4.5.9 Error yang Ditemui dan Cara Penyelesaiannya pada Iterasi Ketiga** 

**Tabel 4.5 Daftar Error dan Penyelesaian pada Iterasi v03.0** 

|**No**<br>1|**Kode Error**<br>RLS Storage<br>42501 (Upload<br>Foto Toko)|**Penyebab**<br>Pada flow Register Seller<br>→ ShopRegister, upload<br>foto terjadi sebelum sesi<br>auth sepenuhnya aktif<br>(token JWT belum sampai<br>di klien Storage)|**Dampak**<br>Pendaftaran toko<br>gagal saat upload foto<br>— error 'new row<br>violates row-level<br>security policy'|**Solusi**<br>Menambahkan policy<br>sementara 'Anon upload<br>images' pada Storage bucket<br>images via SQL: CREATE<br>POLICY "Anon upload<br>images" ON storage.objects<br>FOR INSERT WITH<br>CHECK (bucket_id =<br>'images')|
|---|---|---|---|---|
|2|Dropdown<br>Notifikasi<br>Overflow di<br>Mobile|Dropdown menggunakan<br>absolute positioning<br>dengan lebar tetap w-96<br>(384px) yang melebihi<br>viewport mobile (360px–<br>414px)|Dropdown terpotong<br>di layar kanan pada<br>Android, tombol<br>'Tandai dibaca' tidak<br>terlihat|Menggunakan hook<br>useIsMobile: pada mobile<br>dropdown menjadi fixed<br>inset-x-2 top-14, pada<br>desktop tetap absolute right-0<br>w-96. Teks notifikasi diberi<br>class line-clamp-2|
|3|Pencarian<br>Bahasa<br>Indonesia tidak<br>menghasilkan<br>gambar yang<br>relevan dari<br>Wikimedia<br>Commons|Sebagian besar judul dan<br>deskripsi berkas pada<br>Wikimedia Commons<br>ditulis dalam bahasa<br>Inggris, sedangkan kata<br>kunci pembeli (misalnya<br>"duka") berbahasa<br>Indonesia|Hasil galeri sedikit,<br>kosong, atau tidak<br>sesuai dengan kata<br>kunci yang diketik<br>pembeli|Kata kunci diterjemahkan<br>otomatis ke bahasa Inggris<br>sebelum dikirim ke API<br>Wikimedia Commons.<br>Pencocokan foto produk toko<br>tetap memakai kata kunci<br>Bahasa Indonesia apa adanya<br>sehingga keduanya berjalan<br>berdampingan|
|4|PDF tidak<br>memuat di<br>beberapa<br>perangkat<br>Android|Capacitor Filesystem<br>menggunakan directory<br>yang berbeda per versi<br>Android (Android 10 ke<br>atas memiliki scoped<br>storage)|PDF berhasil dibuat<br>tapi tidak ditemukan<br>di file manager<br>perangkat|Menggunakan Capacitor<br>Share plugin untuk<br>membagikan PDF langsung<br>(share ke WhatsApp/email)<br>sebagai alternatif simpan<br>langsung. Untuk fitur simpan<br>permanen, direkomendasikan<br>penggunaan<br>Directory.Documents dengan<br>konfirmasi izin runtime|
|5|Chat penjual<br>tidak muncul<br>saat dibuka<br>dari notifikasi|Route /seller/chat/:shopId<br>tidak memetakan<br>conversationId dengan<br>benar saat dibuka dari<br>notifikasi link|Penjual membuka<br>notifikasi chat →<br>halaman ChatRoom<br>kosong (tanpa riwayat<br>pesan)|Perbaiki logika routing di<br>seller chat: pastikan<br>conversationId diteruskan<br>sebagai parameter URL dan<br>diambil via useParams. Patch<br>terdokumentasi di file<br>FIXED_CHAT_SELLER.md|



##### **4.6 Pengujian Alpha** 

##### **4.6.1 Rancangan Pengujian Alpha** 

Pengujian alpha adalah pengujian yang dilakukan oleh pengembang pada lingkungan yang terkendali sebelum aplikasi diberikan kepada pengguna akhir. Tujuan pengujian alpha pada penelitian ini adalah memastikan bahwa aplikasi Bloemen versi final (v03.0) telah berfungsi dengan benar dan stabil sehingga layak diserahkan kepada pengguna untuk pengujian penerimaan (User Acceptance Test/UAT) pada Subbab 4.7. Rancangan pengujian mengacu pada klasifikasi pengujian aplikasi Android dari dokumentasi resmi Android Developers, yang membedakan pengujian berdasarkan subjek yang diuji dan berdasarkan ruang lingkup atau derajat isolasinya. 

Berdasarkan subjeknya, pengujian dibedakan menjadi empat jenis, yaitu pengujian fungsional ( _functional testing_ ) yang menguji apakah aplikasi melakukan apa yang seharusnya, pengujian performa ( _performance testing_ ) yang menguji apakah aplikasi melakukannya dengan cepat dan efisien, pengujian aksesibilitas ( _accessibility testing_ ) yang menguji apakah aplikasi dapat digunakan dengan baik oleh pengguna dan layanan aksesibilitas, serta pengujian kompatibilitas ( _compatibility testing_ ) yang menguji apakah aplikasi berjalan baik pada berbagai perangkat dan tingkat API. Keempat jenis pengujian tersebut diterapkan pada Bloemen sebagaimana dirangkum pada Tabel 4.6. 

**Tabel 4.6 Rancangan Pengujian Alpha Berdasarkan Subjek Pengujian** 

|**No**|**Jenis**<br>**Pengujian**|**Pertanyaan yang**<br>**Dijawab**|**Rujukan**<br>**Kebutuhan**|**Metode dan Instrumen**|**Subbab**|
|---|---|---|---|---|---|
|1|Fungsional|Apakah aplikasi<br>melakukan apa yang<br>seharusnya?|FR-01 s.d.<br>FR-17|Black-box 36 skenario dan<br>3 alur end-to-end;<br>keterlacakan terhadap<br>kebutuhan fungsional|4.6.4|
|2|Performa|Apakah aplikasi<br>melakukannya dengan<br>cepat dan efisien?|NFR-01,<br>NFR-02|Pengamatan latensi real-<br>time, waktu transisi<br>halaman, waktu muat<br>katalog, dan stabilitas|4.6.5|



|**No**|**Jenis**<br>**Pengujian**|**Pertanyaan yang**<br>**Dijawab**|**Rujukan**<br>**Kebutuhan**|**Metode dan Instrumen**|**Subbab**|
|---|---|---|---|---|---|
|3|Aksesibilitas|Apakah aplikasi dapat<br>digunakan dengan<br>nyaman dan bekerja<br>baik dengan layanan<br>aksesibilitas?|NFR-05|Daftar periksa<br>aksesibilitas antarmuka (8<br>butir) termasuk<br>perhitungan rasio kontras<br>warna|4.6.6|
|4|Kompatibilitas|Apakah aplikasi<br>berjalan baik pada<br>berbagai perangkat dan<br>versi API?|NFR-03|Uji pada 4 perangkat fisik<br>Android 10 s.d. 13|4.6.7|



Berdasarkan ruang lingkupnya (ukuran atau derajat isolasi), pengujian dibedakan menjadi tiga tingkat. _Small test_ atau _unit test_ hanya memverifikasi bagian yang sangat kecil dari aplikasi, seperti satu fungsi, komponen, atau trigger basis data. _Medium test_ memeriksa integrasi antara dua unit atau lebih. _Big test_ atau _endto-end test_ memverifikasi bagian aplikasi yang lebih besar sekaligus, seperti satu layar penuh atau satu alur pengguna. Penerapan ketiga tingkat tersebut pada Bloemen disajikan pada Tabel 4.7. 

**Tabel 4.7 Ruang Lingkup Pengujian Alpha pada Aplikasi Bloemen** 

|**No**|**Ruang Lingkup**|**Objek yang Diuji pada**<br>**Bloemen**|**Contoh**|
|---|---|---|---|
|1|Small (unit)|Satu fungsi, komponen, aturan<br>validasi, atau trigger basis data|Trigger calculate_discount_price; helper<br>buildProductPayload; validasi tanggal<br>pre-order; validasi ukuran unggahan<br>foto; fungsi matchProducts|
|2|Medium<br>(integrasi)|Interaksi dua unit atau lebih,<br>misalnya antarmuka dengan<br>Supabase, trigger, atau Realtime|Pesanan yang memicu notifikasi; chat<br>via Supabase Realtime; ulasan yang<br>memperbarui rating toko; guard rute<br>dengan AuthContext; halaman Referensi<br>dengan Wikimedia Commons dan data<br>produk|
|3|Big (end-to-end)|Satu alur pengguna lengkap yang<br>melibatkan banyak halaman dan<br>modul|Alur pembeli dari registrasi hingga<br>ulasan; alur penjual dari registrasi toko<br>hingga rekap PDF; alur referensi desain<br>hingga penawaran kustom|



Seluruh pengujian pada penelitian ini dilakukan secara manual oleh penulis (metode _black-box_ ) dengan menjalankan skenario pada aplikasi yang berjalan di perangkat fisik. Penelitian ini belum menggunakan kerangka pengujian otomatis (misalnya Vitest, Jest, atau Espresso). Otomatisasi pengujian dicatat sebagai saran pengembangan lanjutan pada Bab 5. 

##### **4.6.2 Lingkungan Pengujian** 

Pengujian alpha dilaksanakan menggunakan berkas app-debug.apk hasil build versi v03.0 (Subbab 4.5.8) pada perangkat Android fisik, dengan akun uji untuk peran pembeli dan penjual serta data uji berupa toko dan produk. Lingkungan pengujian dirangkum pada Tabel 4.8. 

**Tabel 4.8 Lingkungan Pengujian Alpha** 

|**No**|**Komponen**|**Spesifikasi**|
|---|---|---|
|1|Objek uji|Aplikasi Bloemen versi v03.0 (app-debug.apk) yang dibungkus<br>dengan Capacitor|
|2|Perangkat utama|Xiaomi Redmi Note 11, Android 13, RAM 4 GB|
|3|Perangkat pembanding|Samsung Galaxy A52 (Android 12), Oppo A57 (Android 11),<br>Realme C25 (Android 10)|
|4|Backend|Supabase (PostgreSQL, Auth, Realtime, Storage) pada region<br>Singapore (ap-southeast-1)|
|5|Layanan eksternal|Wikimedia Commons API untuk gambar inspirasi pada halaman<br>Referensi Desain|
|6|Penguji|Penulis (pengembang), menggunakan akun uji pembeli dan<br>penjual|
|7|Metode|Black-box manual berbasis skenario, pengamatan langsung, dan<br>daftar periksa|



##### **4.6.3 Verifikasi Tampilan Antarmuka pada Perangkat Fisik** 

##### **_a. Antarmuka Sisi Pembeli (Customer)_** 

Setelah APK final berhasil dibuat, penulis melakukan pengujian komprehensif pada perangkat fisik Oppo A3X (Android 15). Pengujian mencakup seluruh alur utama dari perspektif pembeli, mulai dari membuka aplikasi pertama kali hingga menyelesaikan satu siklus transaksi lengkap. 

###### **[ TEMPATKAN GAMBAR 4.34 DI SINI ]** 

_Tangkapan layar Halaman Beranda aplikasi Bloemen pada perangkat Xiaomi Redmi Note 11. Menampilkan tampilan mobile yang bersih: hero banner animasi 'Temukan Bunga Impianmu di Manado', search bar, chip 8 kategori horizontal (dapat di-scroll), section Toko Pilihan, dan Bottom Navigation Bar 5 tab di bawah_ 

**Gambar 4.34** Tampilan Beranda Aplikasi pada Perangkat Android 



<!-- Start of picture text -->
[ TEMPATKAN GAMBAR 4.35 DI SINI ]<br>Tangkapan layar Halaman Daftar Toko. Menampilkan kartu toko 'Toko Mawar Indah Manado'<br>dengan foto banner, badge kategori 'Bouquet  ◆  Wedding', bintang rating '4.6 ★ (12 ulasan)',<br>badge hijau 'Buka' (jam 09:00–18:00), dan tombol 'Lihat Toko'<br><!-- End of picture text -->

**Gambar 4.35** Tampilan Daftar Toko dengan Indikator Status Buka 



<!-- Start of picture text -->
[ TEMPATKAN GAMBAR 4.36 DI SINI ]<br>Tangkapan layar Halaman Detail Toko (ShopDetail). Bagian atas: foto banner toko besar, nama<br>toko, alamat (dengan tombol 'Lihat Peta' di sebelahnya), jam operasional per hari. Bagian<br>bawah: Tab 'Ready Stock' (aktif) dan 'Pre-Order' untuk memfilter produk, diikuti grid 2 kolom<br>produk toko<br><!-- End of picture text -->

**Gambar 4.36** Tampilan Halaman Detail Toko 



<!-- Start of picture text -->
[ TEMPATKAN GAMBAR 4.37 DI SINI ]<br>Tangkapan layar Halaman Riwayat Pesanan (My Orders). Daftar pesanan pembeli: (1)<br>ORD-20260615-0001 — status badge 'Dikonfirmasi' (biru), tanggal pengantaran 20 Jun 2026,<br>total Rp200.000, tombol 'Chat' dan 'Detail'; (2) ORD-20260602-0005 — status 'Selesai' (hijau),<br>tombol 'Beri Ulasan' aktif<br><!-- End of picture text -->

**Gambar 4.37** Tampilan Halaman Riwayat Pesanan Pembeli 

##### **_b. Antarmuka Sisi Penjual (Seller)_** 

Pengujian pada sisi penjual mencakup seluruh modul manajemen yang tersedia di halaman seller, mulai dari dashboard hingga rekap penjualan. 



<!-- Start of picture text -->
[ TEMPATKAN GAMBAR 4.38 DI SINI ]<br>Tangkapan layar Sidebar Navigasi Penjual (SellerLayout) pada tampilan mobile. Menu tersusun<br>vertikal: Dashboard (aktif, highlight pink), Produk, Pesanan (dengan badge oranye angka '3'),<br>Chat, Pengaturan Toko, Ulasan, Rekap Penjualan, dan tombol Logout di bagian bawah<br>Gambar 4.38  Sidebar Navigasi Penjual<br>[ TEMPATKAN GAMBAR 4.39 DI SINI ]<br>Tangkapan layar Halaman Manajemen Produk. Daftar produk toko: (1) 'Buket Mawar Merah<br>Premium' — badge 'Pre-Order' oranye, badge '-20%' merah, harga dari Rp160.000; (2) 'Papan<br>Bunga Selamat' — badge 'Ready Stock' hijau, harga Rp750.000. Tombol edit (pensil) dan hapus<br>(tempat sampah) pada setiap produk<br>Gambar 4.39  Halaman Manajemen Produk Penjual<br>[ TEMPATKAN GAMBAR 4.40 DI SINI ]<br>Tangkapan layar Halaman Ulasan Toko (SellerReviews). Di bagian atas: statistik distribusi<br>rating (bintang 5: 8 ulasan |||||||, bintang 4: 3 ulasan |||, bintang 3: 1 ulasan |). Di bawah: daftar<br>kartu ulasan — nama pembeli, bintang rating berwarna kuning, teks komentar, timestamp '3 hari<br>yang lalu'<br><!-- End of picture text -->

**Gambar 4.40** Halaman Ulasan dan Rating Sisi Penjual 

##### **4.6.4 Pengujian Fungsional (Functional Testing)** 

Pengujian fungsional dilakukan untuk memvalidasi bahwa setiap fitur yang dibangun menghasilkan keluaran sesuai yang diharapkan, tanpa melihat struktur internal kode. Pengujian mencakup 36 skenario _black-box_ pada tingkat _small_ dan _medium_ serta 3 alur _end-to-end_ pada tingkat _big_ . Skenario nomor 33 sampai 36 

ditambahkan untuk menguji pembaruan fitur Referensi Desain (foto produk toko, pencarian Bahasa Indonesia, dan pengiriman referensi ke toko) serta ekspor rekap PDF. Pada kolom skala, huruf S menandakan _small test_ dan huruf M menandakan _medium test_ . 

**Tabel 4.9 Hasil Pengujian Black-Box (36 Skenario)** 

|**No**|**Modul**|**Skenario dan Input**|**Output yang Diharapkan**|**Skala**|**Hasil**|
|---|---|---|---|---|---|
|1|Auth|Registrasi akun baru sebagai<br>Pembeli (email valid, kata sandi ≥<br>6 karakter)|Akun dibuat, pengguna<br>diarahkan ke Beranda|M|✓Valid|
|2|Auth|Registrasi dengan email yang<br>sudah terdaftar|Pesan error "Email sudah<br>terdaftar"|S|✓Valid|
|3|Auth|Login sebagai Penjual (email dan<br>kata sandi akun Seller)|Diarahkan ke Dashboard<br>Penjual|M|✓Valid|
|4|Auth|Logout dari sistem (klik tombol<br>Keluar)|Sesi berakhir, kembali ke<br>halaman Login|S|✓Valid|
|5|Toko|Registrasi profil toko baru (nama,<br>alamat, kategori, foto)|Data toko tersimpan dan tampil<br>di katalog|M|✓Valid|
|6|Toko|Edit jam operasional toko (jam<br>tutup 17:00 menjadi 20:00)|Data profil terbarui secara<br>instan|M|✓Valid|
|7|Produk|Tambah produk Ready Stock<br>(nama, harga Rp200.000, stok 10)|Produk tampil di katalog<br>publik|M|✓Valid|
|8|Produk|Set diskon 20% pada produk<br>berharga Rp200.000|Harga diskon Rp160.000<br>tampil dengan badge "-20%"|S|✓Valid|
|9|Produk|Input harga variasi ukuran (S =<br>100 rb, M = 150 rb, L = 200 rb,<br>XL = 300 rb)|Size picker berfungsi, harga<br>berubah per ukuran|S|✓Valid|
|10|Produk|Set produk sebagai Pre-Order<br>(toggle ON, durasi 3 hari)|Badge "Pre-Order" muncul,<br>validasi tanggal aktif|S|✓Valid|
|11|Produk|Edit deskripsi produk yang ada<br>(teks deskripsi baru)|Informasi terbaru tersimpan<br>dan tampil|M|✓Valid|
|12|Produk|Hapus produk dari katalog<br>(konfirmasi pada AlertDialog)|Produk hilang dari katalog<br>pembeli dan penjual|S|✓Valid|
|13|Pencarian|Cari produk dengan kata kunci<br>"mawar"|Hanya produk yang<br>mengandung "mawar" yang<br>tampil|S|✓Valid|
|14|Pencarian|Filter kategori (klik chip<br>"Wedding")|Hanya toko/produk kategori<br>Wedding yang tampil|S|✓Valid|
|15|Referensi|Buka halaman Referensi Desain<br>(klik menu Referensi)|Grid gambar Wikimedia<br>Commons tampil bersama foto<br>produk toko|M|✓Valid|
|16|Referensi|Cari inspirasi "wedding" pada<br>search bar|Gambar buket pernikahan<br>tampil; produk toko yang<br>cocok muncul lebih dulu|M|✓Valid|
|17|Pemesanan|Pesan produk Ready Stock (qty 2,<br>ukuran L, metode Kirim)|Pesanan tersimpan, stok<br>berkurang 2|M|✓Valid|
|18|Pemesanan|Pesan produk Pre-Order dengan<br>tanggal pengantaran valid|Pesanan tersimpan dengan<br>nomor unik|M|✓Valid|



|**No**|**Modul**|**Skenario dan Input**|**Output yang Diharapkan**|**Skala**|**Hasil**|
|---|---|---|---|---|---|
|19|Pemesanan|Pesan dengan tanggal hari ini<br>(tidak valid)|Peringatan validasi muncul,<br>tombol Konfirmasi nonaktif|S|✓Valid|
|20|Pemesanan|Lihat riwayat pesanan pembeli<br>(buka My Orders)|Semua pesanan tampil lengkap<br>dengan detailnya|M|✓Valid|
|21|Pemesanan|Penjual menandai pesanan<br>menjadi "delivered"|Status berubah, notifikasi<br>terkirim ke pembeli|M|✓Valid|
|22|Chat|Pembeli mengirim pesan ke<br>penjual ("Bisa kirim pagi?")|Pesan terkirim < 1 detik dan<br>muncul di ChatRoom|M|✓Valid|
|23|Chat|Penjual membalas pesan pembeli|Bubble chat muncul otomatis<br>via Realtime|M|✓Valid|
|24|Notifikasi|Pembeli menekan "Konfirmasi<br>Pesanan"|Lonceng penjual menampilkan<br>badge +1|M|✓Valid|
|25|Notifikasi|Penjual mengubah status pesanan<br>menjadi "confirmed"|Notifikasi muncul di lonceng<br>pembeli dalam < 2 detik|M|✓Valid|
|26|Ulasan|Pembeli memberi ulasan setelah<br>pesanan selesai (5 bintang dan<br>komentar)|Ulasan tersimpan, rating toko<br>diperbarui otomatis|M|✓Valid|
|27|Penawaran|Penjual mengirim penawaran<br>kustom (nama produk, harga<br>Rp350.000)|Kartu penawaran muncul<br>dalam chat pembeli|M|✓Valid|
|28|Penawaran|Pembeli menekan tombol<br>"Terima" pada kartu penawaran|Status berubah "accepted",<br>notifikasi terkirim ke penjual|M|✓Valid|
|29|Media|Unggah foto berukuran 8 MB|Muncul pesan error batas<br>ukuran file (maksimum 5 MB)|S|✓Valid|
|30|Akses|Akses Dashboard Penjual tanpa<br>login (ketik manual URL /seller)|Redirect otomatis ke halaman<br>Login|M|✓Valid|
|31|Akses|Akses rute /my-orders tanpa login|Redirect ke Login dengan<br>parameter redirect|M|✓Valid|
|32|Akses|Pembeli mencoba mengakses rute<br>/seller/products|Redirect ke Beranda dengan<br>pesan "Akses ditolak"|M|✓Valid|
|33|Referensi|Buka halaman Referensi ketika<br>sudah ada produk toko yang<br>memiliki foto|Foto produk tampil dengan<br>bingkai dan badge "Produk<br>Toko", tersebar di sela gambar<br>Wikimedia Commons|M|✓Valid|
|34|Referensi|Cari kata kunci Bahasa Indonesia<br>"duka"|Produk kategori Bunga Duka<br>tersaring; Wikimedia<br>Commons dicari dengan kata<br>kunci terjemahan|S|✓Valid|
|35|Referensi|Ketuk gambar (produk atau<br>Wikimedia), lalu pilih toko pada<br>dialog "Kirim Referensi Desain"|Pengguna diarahkan ke chat<br>dengan referensi desain<br>terlampir|M|✓Valid|
|36|Rekap|Ekspor rekap penjualan ke PDF<br>(rentang tanggal, status delivered)|PDF memuat header toko,<br>tabel pesanan, total, dan nomor<br>halaman|M|✓Valid|



Selanjutnya, pengujian _end-to-end_ dilakukan pada tiga alur pengguna utama. Berbeda dengan skenario pada Tabel 4.9 yang menguji satu fitur atau satu integrasi, pengujian ini memastikan seluruh modul bekerja utuh dalam satu rangkaian pemakaian. Hasilnya disajikan pada Tabel 4.10. 

**Tabel 4.10 Hasil Pengujian End-to-End (Big Test)** 

|**Kode**|**Alur Pengguna**|**Langkah Utama**|**Output yang Diharapkan**|**Hasil**|
|---|---|---|---|---|
|E2E-0<br>1|Alur pembeli dari<br>registrasi hingga<br>ulasan|Registrasi, login, cari produk,<br>pilih ukuran, Pre-Order,<br>koordinasi via chat, pantau<br>status dan notifikasi, pesanan<br>delivered, beri ulasan|Satu siklus transaksi selesai;<br>nomor pesanan unik;<br>notifikasi muncul pada setiap<br>perubahan status; rating toko<br>diperbarui|✓Valid|
|E2E-0<br>2|Alur penjual dari<br>registrasi toko<br>hingga rekap<br>penjualan|Registrasi penjual, daftar toko<br>(kategori, peta, jam buka),<br>tambah produk (variasi ukuran,<br>diskon, Pre-Order), terima<br>notifikasi pesanan, ubah status<br>hingga delivered, lihat<br>dashboard, ekspor PDF|Toko dan produk tampil di<br>katalog; pesanan terkelola;<br>dashboard dan PDF sesuai<br>data pesanan|✓Valid|
|E2E-0<br>3|Alur referensi<br>desain hingga<br>penawaran<br>kustom|Buka Referensi, cari kata kunci,<br>ketuk gambar, kirim ke toko,<br>penjual menerima di chat,<br>penjual mengirim penawaran<br>kustom berisi referensi, pembeli<br>menerima|Referensi terkirim ke chat;<br>kartu penawaran muncul;<br>status "accepted" dan<br>notifikasi terkirim ke penjual|✓Valid|



Agar seluruh kebutuhan fungsional yang dirumuskan pada Tabel 3.5 terbukti telah diuji, dilakukan pemetaan keterlacakan ( _traceability_ ) antara kebutuhan fungsional dan skenario pengujian, sebagaimana disajikan pada Tabel 4.11. Seluruh 17 kebutuhan fungsional (FR-01 sampai FR-17) telah tercakup oleh setidaknya satu skenario. 

**Tabel 4.11 Keterlacakan Kebutuhan Fungsional terhadap Skenario Pengujian** 

|**Kode**<br>**FR**|**Kebutuhan Fungsional**|**Skenario Pengujian**|**Status**|
|---|---|---|---|
|FR-01|Pendaftaran akun dengan pilihan peran<br>Pembeli atau Penjual|#1, #2|Terpenuhi|
|FR-02|Login dan logout dengan sesi persisten|#3, #4|Terpenuhi|
|FR-03|Pendaftaran profil toko (nama, kategori, foto,<br>lokasi, jam buka)|#5, #6|Terpenuhi|
|FR-04|Pengelolaan produk dengan variasi harga per<br>ukuran S–XL|#7, #9, #11, #12|Terpenuhi|
|FR-05|Status produk Ready Stock atau Pre-Order<br>dengan durasi pengerjaan|#10, #18|Terpenuhi|
|FR-06|Diskon persentase pada produk|#8|Terpenuhi|
|FR-07|Penelusuran katalog melalui pencarian dan<br>filter kategori|#13, #14|Terpenuhi|
|FR-08|Pembuatan pesanan Pre-Order (ukuran,<br>tanggal, metode pengiriman)|#17, #18, #19|Terpenuhi|
|FR-09|Pemantauan riwayat dan status pesanan|#20, #25|Terpenuhi|
|FR-10|Pengelolaan pesanan masuk dan pembaruan<br>status oleh penjual|#21|Terpenuhi|



|**Kode**<br>**FR**|**Kebutuhan Fungsional**|**Skenario Pengujian**|**Status**|
|---|---|---|---|
|FR-11|Chat real-time pembeli dan penjual|#22, #23|Terpenuhi|
|FR-12|Notifikasi otomatis (pesanan, status, chat)|#24, #25|Terpenuhi|
|FR-13|Penawaran harga kustom melalui chat|#27, #28|Terpenuhi|
|FR-14|Ulasan dan rating setelah pesanan selesai|#26|Terpenuhi|
|FR-15|Referensi desain bunga (Wikimedia<br>Commons dan foto produk toko) dan<br>pengiriman ke toko|#15, #16, #33, #34, #35,<br>E2E-03|Terpenuhi|
|FR-16|Dashboard bisnis dan rekap penjualan PDF|#36, E2E-02|Terpenuhi|
|FR-17|Kontrol akses dengan Row Level Security dan<br>guard rute|#29, #30, #31, #32|Terpenuhi|



_Catatan: perumusan FR-15 pada Tabel 3.5 disesuaikan dengan implementasi akhir, yaitu "Pembeli dapat mengakses halaman referensi desain bunga yang memuat gambar dari Wikimedia Commons dan foto produk toko, serta mengirimkannya kepada toko"._ 

Hasil pengujian fungsional menunjukkan seluruh 39 skenario (36 skenario _black-box_ dan 3 alur _end-to-end_ ) berstatus valid dengan tingkat keberhasilan 100%. Hal ini menunjukkan bahwa sistem yang dibangun telah berfungsi sesuai kebutuhan fungsional yang dirumuskan pada Bab III. 

##### **4.6.5 Pengujian Performa (Performance Testing)** 

Pengujian performa menilai apakah aplikasi bekerja dengan cepat dan efisien. Parameter yang diamati meliputi kecepatan komunikasi real-time (chat dan notifikasi), kelancaran transisi antarhalaman, kecepatan muat katalog, stabilitas aplikasi, dan kelancaran menggulir daftar yang panjang. Target waktu untuk latensi chat dan waktu muat mengacu pada kebutuhan non-fungsional NFR-02 dan NFR-01, sedangkan target waktu notifikasi dan transisi halaman ditetapkan sebagai target pengujian. Hasilnya disajikan pada Tabel 4.12. 

**Tabel 4.12 Hasil Pengujian Performa** 

|**Kode**|**Parameter**|**Target**|**Hasil Pengamatan**|**Status**|
|---|---|---|---|---|
|P-01|Latensi pengiriman<br>pesan chat<br>(Supabase Realtime)|≤ 1 detik<br>(NFR-02)|Pesan muncul di ChatRoom lawan<br>bicara < 1 detik (skenario #22 dan<br>#23)|Terpenuhi|
|P-02|Latensi notifikasi<br>real-time|≤ 2 detik (target<br>pengujian)|Notifikasi muncul di lonceng < 2<br>detik setelah pemicu (skenario #24<br>dan #25)|Terpenuhi|
|P-03|Waktu transisi<br>antarhalaman|≤ 300 ms (target<br>pengujian)|Animasi halus dan transisi ≤ 300 ms<br>pada Xiaomi Redmi Note 11|Terpenuhi|



|**Kode**|**Parameter**|**Target**|**Hasil Pengamatan**|**Status**|
|---|---|---|---|---|
|P-04|Kecepatan muat<br>katalog dan gambar|≤ 3 detik<br>(NFR-01)|Katalog dan gambar dimuat lancar<br>pada Samsung Galaxy A52; penjual<br>menilai kecepatan muat 95,00% (butir<br>7 UAT)|Terpenuhi|
|P-05|Stabilitas aplikasi<br>selama pengujian|Tidak berhenti<br>mendadak<br>(crash)|Seluruh 39 skenario selesai tanpa<br>aplikasi berhenti; galat pada iterasi<br>sebelumnya telah diperbaiki (Tabel<br>4.2 dan Tabel 4.5); penjual menilai<br>96,25% (butir 8 UAT)|Terpenuhi|
|P-06|Kelancaran<br>menggulir daftar<br>toko yang panjang|Tidak<br>menghambat<br>penggunaan|Sedikit lambat pada Oppo A57<br>(Android 11, RAM 4 GB), tetapi tidak<br>memblokir penggunaan|Terpenuhi<br>dengan catatan|



Dari enam parameter, lima parameter terpenuhi penuh dan satu parameter terpenuhi dengan catatan. Catatan tersebut berkaitan dengan kelancaran menggulir daftar toko yang panjang pada perangkat dengan RAM 4 GB, yang tidak menghambat penggunaan tetapi dapat dioptimalkan pada pengembangan lanjutan, misalnya dengan penerapan paginasi atau _lazy loading_ pada daftar toko. Dari sisi efisiensi, pengambilan data hanya dilakukan sekali saat halaman dibuka (misalnya pemuatan produk pada halaman Referensi Desain) dan gambar inspirasi tidak disimpan pada aplikasi karena dimuat langsung dari Wikimedia Commons. 

##### **4.6.6 Pengujian Aksesibilitas (Accessibility Testing)** 

Pengujian aksesibilitas menilai apakah antarmuka aplikasi dapat digunakan dengan nyaman oleh beragam pengguna dan apakah aplikasi bekerja baik dengan layanan aksesibilitas. Pengujian dilakukan melalui daftar periksa delapan butir, yang mencakup kontras warna, keterbacaan, ukuran elemen, kejelasan tata letak, dan umpan balik sistem. Rasio kontras warna dihitung menggunakan rumus luminansi relatif dari pedoman WCAG 2.1, dengan ambang batas 4,5:1 untuk teks berukuran normal (level AA). Hasil pengujian disajikan pada Tabel 4.13. 

**Tabel 4.13 Hasil Pengujian Aksesibilitas** 

|**Kode**|**Aspek**|**Kriteria**|**Hasil Pengamatan**|**Status**|
|---|---|---|---|---|
|A-01|Kontras warna|Rasio kontras ≥ 4,5:1<br>(WCAG 2.1 AA)|Warna primer #B23A6B terhadap<br>latar putih menghasilkan rasio<br>5,66:1|Terpenuhi|
|A-02|Label teks pada<br>ikon|Ikon tidak berdiri<br>sendiri tanpa<br>keterangan|Setiap ikon kategori di beranda<br>diberi label teks dan berbentuk kartu<br>(perbaikan temuan v01.0 nomor 1)|Terpenuhi|



|**Kode**|**Aspek**|**Kriteria**|**Hasil Pengamatan**|**Status**|
|---|---|---|---|---|
|A-03|Ukuran teks dan<br>tombol|Nyaman dilihat dan<br>ditekan di layar mobile|Penjual menilai 97,50% (butir 12<br>UAT); tidak ada penilaian di bawah<br>4|Terpenuhi|
|A-04|Pemisahan<br>tombol aksi|Tombol utama dan<br>sekunder tidak mudah<br>salah tekan|Tombol Pre-Order (solid) dan Chat<br>(outline) dipisah secara vertikal<br>(perbaikan temuan v01.0 nomor 2)|Terpenuhi|
|A-05|Responsivitas<br>tata letak|Konten tidak terpotong<br>pada lebar layar 360–<br>414 px|Dropdown notifikasi memakai fixed<br>inset-x-2 pada mobile dan teks<br>dibatasi line-clamp-2 (perbaikan<br>v135)|Terpenuhi|
|A-06|Umpan balik<br>sistem|Pengguna mendapat<br>informasi status dan<br>kesalahan|Pesan validasi berwarna kuning,<br>toast (sonner), pesan error login dan<br>unggah foto, serta badge status<br>pesanan|Terpenuhi|
|A-07|Konten gambar<br>gagal muat|Tampilan tetap utuh<br>saat gambar gagal<br>dimuat|Komponen ImageWithFallback<br>menampilkan gambar pengganti<br>(placeholder)|Terpenuhi|
|A-08|Layanan<br>aksesibilitas<br>sistem|Kompatibel dengan<br>pembaca layar<br>(TalkBack) dan<br>pembesaran teks<br>sistem|Belum diuji secara khusus|Belum diuji|



Tujuh dari delapan butir aksesibilitas terpenuhi. Butir A-08 belum diuji karena pengujian dengan pembaca layar TalkBack dan pengaturan pembesaran teks sistem belum dilakukan pada penelitian ini. Hal tersebut menjadi keterbatasan penelitian dan dicatat sebagai saran pengembangan, yaitu menambahkan atribut aksesibilitas (label deskriptif pada tombol ikon dan gambar) serta mengujinya dengan layanan aksesibilitas Android. 

##### **4.6.7 Pengujian Kompatibilitas (Compatibility Testing)** 

Pengujian kompatibilitas dilakukan pada satu perangkat Android fisik, yaitu Oppo A3x (model CPH2641) dengan sistem operasi Android 15 (API 35) dan RAM 4 GB. Pengujian ini bertujuan memastikan aplikasi dapat berjalan dengan baik pada perangkat dengan versi Android yang sama atau lebih baru dari versi minimum Android 10 (API 29) sebagaimana ditetapkan pada NFR-03. Hasil pengujian menunjukkan bahwa aplikasi berjalan baik dan stabil pada perangkat tersebut. Aplikasi hanya terasa sedikit lambat saat menggulir daftar toko yang panjang, tetapi hal ini tidak menghambat penggunaan. Tampilan halaman beranda aplikasi pada perangkat uji disajikan pada Gambar 4.41. 



<!-- Start of picture text -->
[ TEMPATKAN GAMBAR 4.41 DI SINI ]<br>Kolase empat tangkapan layar Halaman Beranda aplikasi Bloemen yang diambil dari empat<br>perangkat uji secara berdampingan (dari kiri ke kanan): Xiaomi Redmi Note 11 (Android 13),<br>Samsung Galaxy A52 (Android 12), Oppo A57 (Android 11), dan Realme C25 (Android 10). Di<br>bawah tiap tangkapan layar dicantumkan nama perangkat dan versi Android.<br><!-- End of picture text -->

**Gambar 4.41** Tampilan Beranda Aplikasi pada Oppo A3X 

##### **4.6.8 Rekapitulasi dan Pembahasan Pengujian Alpha** 

Rekapitulasi hasil pengujian alpha berdasarkan jenis pengujian disajikan pada Tabel 4.15 dan divisualisasikan pada Gambar 4.42. Sementara itu, rekapitulasi skenario fungsional berdasarkan ruang lingkup disajikan pada Tabel 4.16. 

**Tabel 4.15 Rekapitulasi Hasil Pengujian Alpha Berdasarkan Jenis Pengujian** 

|**No**|**Jenis Pengujian**|**Jumlah**<br>**Butir**|**Terpenuhi**|**Dengan**<br>**Catatan**|**Belum**<br>**Diuji**|**Keterpenuhan**<br>**Penuh**|
|---|---|---|---|---|---|---|
|1|Fungsional|39|39|0|0|100,0%|
|2|Performa|6|5|1|0|83,3%|
|3|Aksesibilitas|8|7|0|1|87,5%|
|4|Kompatibilitas|4|4|0|0|100,0%|
||**Total**|**57**|**55**|**1**|**1**|**96,5%**|



**Tabel 4.16 Rekapitulasi Skenario Fungsional Berdasarkan Ruang Lingkup** 

|**No**|**Ruang Lingkup**|**Jumlah**<br>**Skenario**|**Skenario**|**Hasil**|
|---|---|---|---|---|
|1|Small (unit)|11|#2, #4, #8, #9, #10, #12, #13, #14, #19,<br>#29, #34|Seluruhnya<br>valid|
|2|Medium (integrasi)|25|#1, #3, #5, #6, #7, #11, #15–#18, #20–<br>#28, #30–#33, #35, #36|Seluruhnya<br>valid|
|3|Big (end-to-end)|3|E2E-01, E2E-02, E2E-03|Seluruhnya<br>valid|
||**Total**|**39**||**100% valid**|





<!-- Start of picture text -->
(b) Skenario fungsional per ruang lingkup<br>(a) Hasil per jenis pengujian (Seluruhnya valid)<br>30<br>* 39 BE TerpenuhiTerpenuli dengan catatan 25<br>Belum diy 25<br>2<br>Ens 222<br>zs<br>=3= 20 215a3 u<br>= 210<br>* 10 8<br>6 4 5 3<br>0 Fungsional Performa Aksesibilitas._-- Kompatibilitas 0 Small Medium Big<br>(unit) (integrasi) (end-to-end)<br><!-- End of picture text -->

**Gambar 4.42** Rekapitulasi Hasil Pengujian Alpha: (a) per Jenis Pengujian dan (b) Skenario Fungsional per Ruang Lingkup 

Dari 57 butir pengujian, 55 butir (96,5%) terpenuhi penuh, satu butir terpenuhi dengan catatan, dan satu butir belum diuji. Dua temuan yang perlu ditindaklanjuti adalah kelancaran menggulir daftar toko yang panjang pada perangkat berkapasitas RAM 4 GB (P-06) dan pengujian dengan layanan aksesibilitas TalkBack (A-08). Kedua temuan tersebut tidak menghalangi fungsi utama aplikasi sehingga aplikasi dinyatakan layak untuk dilanjutkan ke tahap pengujian penerimaan pengguna (UAT) pada Subbab 4.7. 

##### **4.7 Pengujian Penerimaan Pengguna (User Acceptance Test/UAT)** 

##### **4.7.1 Perancangan Pengujian UAT** 

Pengujian penerimaan pengguna (UAT) dilaksanakan setelah pengujian alpha selesai. Berbeda dengan pengujian alpha yang menitikberatkan pada kebenaran fungsional dan kualitas teknis sistem, UAT menitikberatkan pada penilaian subjektif pengguna akhir terhadap manfaat, kemudahan, dan kelayakan sistem. UAT dilakukan terhadap dua kelompok pengguna, yaitu penjual (pelaku usaha bunga) dan pembeli (konsumen produk bunga), dengan rancangan sebagaimana disajikan pada Tabel 4.17. 

**Tabel 4.17 Rancangan Pengujian UAT** 

|**No**|**Kelompok**|**Responden**|**Waktu**|**Instrumen**|**Fokus Penilaian**|
|---|---|---|---|---|---|
|1|Penjual|16 pelaku usaha<br>bunga (pemilik<br>atau pengelola<br>toko)|23<br>September<br>2026|Kuesioner tertutup<br>(Google Forms): 14<br>pernyataan berskala Likert<br>1–5 dan kolom saran|Penilaian setelah<br>menggunakan aplikasi<br>sisi penjual: fungsi,<br>performa, tampilan,<br>dan manfaat|



|**No**|**Kelompok**|**Responden**|**Waktu**|**Instrumen**|**Fokus Penilaian**|
|---|---|---|---|---|---|
|2|Pembeli|28 konsumen<br>produk bunga|23-24<br>September<br>2026|Kuesioner tertutup<br>(Google Forms): profil,<br>perilaku, kendala, prioritas<br>fitur, dan penerimaan<br>berskala Likert 1–5|Penerimaan<br>kebutuhan dan konsep<br>aplikasi, yang<br>dipetakan terhadap<br>fitur yang<br>diimplementasikan|



Setiap butir pernyataan diberi bobot 1 sampai 5, dengan bobot 5 untuk jawaban paling positif (misalnya "Sangat Setuju", "Sangat Penting", atau "Sangat Mungkin") dan bobot 1 untuk jawaban paling negatif. Tingkat penerimaan dihitung menggunakan rumus indeks persentase berikut. 

##### **_Indeks Penerimaan (%) = (Total Skor Perolehan ÷ Skor Maksimum) × 100%_** 

dengan Skor Maksimum = 5 × jumlah responden yang menjawab butir tersebut. Hasil perhitungan indeks diinterpretasikan menggunakan kategori pada Tabel 4.18. 

**Tabel 4.18 Kategori Interpretasi Indeks Penerimaan** 

|**No**|**Rentang Indeks**|**Kategori**|**Makna Penerimaan**|
|---|---|---|---|
|1|0% – 20%|Sangat Kurang|Sistem tidak dapat diterima pengguna|
|2|21% – 40%|Kurang|Sistem perlu dirancang ulang secara menyeluruh|
|3|41% – 60%|Cukup|Sistem diterima dengan banyak catatan<br>perbaikan|
|4|61% – 80%|Baik|Sistem diterima dengan sebagian catatan<br>perbaikan|
|5|81% – 100%|Sangat Baik|Sistem diterima dan layak diimplementasikan|



_Sumber: Adaptasi kategori interpretasi skor Likert (Riduwan, 2015)._ 

##### **4.7.2 UAT Sisi Penjual** 

UAT sisi penjual dilakukan dengan meminta pelaku usaha bunga menggunakan aplikasi Bloemen pada sisi penjual, yang mencakup registrasi dan login, pengelolaan produk, pengelolaan pesanan, chat, notifikasi, penawaran kustom, serta dashboard dan rekap penjualan. Setelah itu responden mengisi kuesioner 14 pernyataan yang dikelompokkan menjadi empat aspek, yaitu fungsional, performa dan keandalan, tampilan dan _usability_ , serta manfaat dan kepuasan. Kisi-kisi instrumen disajikan pada Tabel 4.19. 

**Tabel 4.19 Kisi-Kisi Instrumen UAT Sisi Penjual** 

|**No**|**Aspek**|**Pernyataan**|**Rujukan**|
|---|---|---|---|
|1|Fungsional|Fitur registrasi dan login dapat digunakan dengan mudah dan<br>berjalan sesuai peran (pembeli/penjual).|FR-01, FR-02|
|2|Fungsional|Fitur chat realtime berjalan lancar untuk komunikasi antara<br>pembeli dan penjual.|FR-11, NFR-02|
|3|Fungsional|Fitur notifikasi realtime muncul tepat waktu saat ada<br>aktivitas baru (pesan, pesanan, dsb).|FR-12|
|4|Fungsional|Fitur manajemen produk (termasuk varian harga) mudah<br>digunakan untuk mengelola katalog toko.|FR-04, FR-05,<br>FR-06|
|5|Fungsional|Fitur untuk merespons permintaan penawaran kustom dari<br>pembeli berjalan sesuai alur yang diharapkan.|FR-13|
|6|Fungsional|Dashboard dan rekap laporan PDF menampilkan data<br>penjualan dengan akurat.|FR-16|
|7|Performa &<br>keandalan|Aplikasi dapat diakses dan dimuat dengan cepat.|NFR-01|
|8|Performa &<br>keandalan|Aplikasi tidak mengalami crash atau error saat digunakan.|NFR-06|
|9|Performa &<br>keandalan|Proses pengiriman pesan pada fitur chat dan notifikasi<br>berjalan tanpa jeda yang mengganggu.|NFR-02|
|10|Tampilan &<br>usability|Tampilan aplikasi menarik dan sesuai dengan tema<br>marketplace bunga.|NFR-05|
|11|Tampilan &<br>usability|Tata letak menu dan navigasi mudah dipahami tanpa perlu<br>penjelasan tambahan.|NFR-05|
|12|Tampilan &<br>usability|Ukuran teks, tombol, dan elemen visual nyaman dilihat di<br>perangkat mobile.|NFR-05|
|13|Manfaat &<br>kepuasan|Aplikasi Bloemen membantu mempermudah proses jual-beli<br>produk kreativitas bunga dibandingkan cara konvensional.|Tujuan penelitian|
|14|Manfaat &<br>kepuasan|Secara keseluruhan, saya puas menggunakan aplikasi<br>Bloemen dan bersedia merekomendasikannya kepada orang<br>lain.|Tujuan penelitian|



##### **_a. Karakteristik Responden_** 

Responden berjumlah 16 pelaku usaha bunga yang masing-masing mewakili satu toko atau usaha bunga. Seluruh kuesioner yang masuk dinyatakan sah sehingga 16 tanggapan dianalisis. Daftar responden beserta perolehan skornya disajikan pada Tabel 4.20. 

**Tabel 4.20 Perolehan Skor per Responden UAT Sisi Penjual (n = 16)** 

|**Kode**|**Nama Toko/Usaha**|**Total**<br>**Skor**|**Skor**<br>**Maks**|**Indeks**|**Kategori**|
|---|---|---|---|---|---|
|R1|Yotsuba florist|69|70|98,57%|Sangat<br>Baik|
|R2|Stemona Creations|66|70|94,29%|Sangat<br>Baik|



|**Kode**|**Nama Toko/Usaha**|**Total**<br>**Skor**|**Skor**<br>**Maks**|**Indeks**|**Kategori**|
|---|---|---|---|---|---|
|R3|@delas.flowers|68|70|97,14%|Sangat<br>Baik|
|R4|Florist Manado|68|70|97,14%|Sangat<br>Baik|
|R5|Mitra Florist and gift|67|70|95,71%|Sangat<br>Baik|
|R6|Beyoutiful Florist by Catherine<br>Christiani|65|70|92,86%|Sangat<br>Baik|
|R7|SJ_buckets|69|70|98,57%|Sangat<br>Baik|
|R8|Bunaken Flower 25|68|70|97,14%|Sangat<br>Baik|
|R9|Manado Bouquet|67|70|95,71%|Sangat<br>Baik|
|R10|Manado Rose|66|70|94,29%|Sangat<br>Baik|
|R11|Minahasa House|67|70|95,71%|Sangat<br>Baik|
|R12|The Flower Atelier|65|70|92,86%|Sangat<br>Baik|
|R13|Angelic Florist|68|70|97,14%|Sangat<br>Baik|
|R14|Bloom Craft Studio|68|70|97,14%|Sangat<br>Baik|
|R15|Velvet Petals|70|70|100,00%|Sangat<br>Baik|
|R16|Rumah Mawar Boutique|68|70|97,14%|Sangat<br>Baik|





<!-- Start of picture text -->
p<br>R1— Yotsuba florist 98,6%%<br>R2~ Stemona Creations 94.3%<br>R3— @delas.flowers z 97.1%<br>R4~ Florist Manado 97,1%<br>R5~ Mitra Florist and gift 95,7%<br>RG ~ Beyoutiful Florist z 92.9%<br>R7~SIJ_buckets 98,6%<br>R86 ~ Bunaken Flower 25 97.1%<br>R9— Manado Bouquet z 95,7%<br>R10 ~ Manado Rose 94,3%<br>R11 —Minahasa House 95,7%<br>R12~The Flower Atelier 92.9%<br>p<br>R13 — Angelic Florist 97.1%<br>R14 Bloom Craft Studio 97,1%<br>R15 — Velvet Petals 100,0%<br>:<br>RIG — Rumah Mawar Boutique 97.1%<br>0 20 40 60 80 100<br>Indeks penerimaan per responden (%6)<br>Garis putus-putus: batas Kategori "Sangat Baik" (81%)<br><!-- End of picture text -->

**Gambar 4.43** Indeks Penerimaan per Responden pada UAT Sisi Penjual 

Seluruh responden memberikan penilaian dengan indeks antara 92,86% dan 100,00%, sehingga seluruhnya berada pada kategori Sangat Baik. Tidak ada responden yang memberikan penilaian secara keseluruhan di bawah kategori tersebut. 

##### **_b. Hasil Penilaian per Butir Pernyataan_** 

Rekapitulasi skor dan indeks penerimaan setiap butir pernyataan disajikan pada Tabel 4.21 dan divisualisasikan pada Gambar 4.44. 

**Tabel 4.21 Rekapitulasi Skor dan Indeks Penerimaan UAT Sisi Penjual (n = 16)** 

|**No**|**Butir Pernyataan**|**5**|**4**|**3**|**2**|**1**|**Total**<br>**Skor**|**Skor**<br>**Maks**|**Indeks**|**Kategori**|
|---|---|---|---|---|---|---|---|---|---|---|
|1|Registrasi & login sesuai peran|12|4|0|0|0|76|80|95,00%|Sangat Baik|
|2|Chat real-time berjalan lancar|11|5|0|0|0|75|80|93,75%|Sangat Baik|
|3|Notifikasi real-time tepat<br>waktu|12|4|0|0|0|76|80|95,00%|Sangat Baik|
|4|Manajemen produk & varian<br>harga mudah|14|2|0|0|0|78|80|97,50%|Sangat Baik|
|5|Respons penawaran kustom<br>sesuai alur|12|4|0|0|0|76|80|95,00%|Sangat Baik|
|6|Dashboard & rekap PDF akurat|13|3|0|0|0|77|80|96,25%|Sangat Baik|
|7|Aplikasi dimuat cepat|12|4|0|0|0|76|80|95,00%|Sangat Baik|
|8|Tidak crash / error|13|3|0|0|0|77|80|96,25%|Sangat Baik|
|9|Pesan & notifikasi tanpa jeda|14|2|0|0|0|78|80|97,50%|Sangat Baik|
|10|Tampilan menarik & sesuai<br>tema|16|0|0|0|0|80|80|100,00%|Sangat Baik|
|11|Navigasi mudah dipahami|13|3|0|0|0|77|80|96,25%|Sangat Baik|
|12|Teks & tombol nyaman di<br>mobile|14|2|0|0|0|78|80|97,50%|Sangat Baik|
|13|Mempermudah jual-beli bunga|12|4|0|0|0|76|80|95,00%|Sangat Baik|
|14|Puas & bersedia<br>merekomendasikan|15|1|0|0|0|79|80|98,75%|Sangat Baik|
||**Rata-rata indeks penerimaan**||||||**1079**|**1120**|**96,34%**|**Sangat**<br>**Baik**|





<!-- Start of picture text -->
1. Registrasi & login sesual peran 95,0096<br>;<br>2. Chat real-time lancar 93,75%<br>3. Notifikast real-time tepat waktu 95,00%<br>4, Manajemen produk & varian harga 97.50%<br>5. Respons penawaran kustom 95,00%%<br>f<br>6. Dashboard & rekap PDF akurat 5 96,25%<br>7. Aplikasi dimuat cepat 95.00%<br>8, Tidak crash /ertor 96,259%<br>9, Pesan & notifikasitanpa jeda 97:50%<br>10. Tampilan menarik & sesuai tema 100,00%<br>.<br>11. Navigasi mudah dipahami 1 96,259%<br>12. "Teks & tombol nyaman di mobile 9750%<br>13. Mempermudah jual-beli bunga 95.00%<br>14, Puas & bersedia merekomendasikan 98,75%<br>° 20 40 0 80 100<br>Indeks penerimaan (96)<br>Garis putus-putus: batas kategor!"Sangat Baik" (81%)<br><!-- End of picture text -->

**Gambar 4.44** Indeks Penerimaan UAT Sisi Penjual per Butir Pernyataan 

Berdasarkan Tabel 4.21, seluruh 14 butir pernyataan memperoleh indeks di atas 93% dan berada pada kategori Sangat Baik. Dari 224 jawaban (16 responden × 14 butir), sebanyak 183 jawaban (81,7%) bernilai 5 dan 41 jawaban (18,3%) bernilai 4, sedangkan tidak ada jawaban bernilai 3 atau lebih rendah. Rata-rata indeks penerimaan keseluruhan adalah 96,34% (1.079 dari skor maksimum 1.120). 

Indeks tertinggi diperoleh butir 10 (tampilan aplikasi menarik dan sesuai tema marketplace bunga) sebesar 100,00%, disusul butir 14 (kepuasan dan kesediaan merekomendasikan aplikasi) sebesar 98,75%, serta butir 4 (manajemen produk termasuk varian harga) dan butir 9 (pengiriman pesan dan notifikasi tanpa jeda) masing-masing 97,50%. Indeks terendah diperoleh butir 2 (chat real-time berjalan lancar) sebesar 93,75%, yang tetap berada pada kategori Sangat Baik. Lima dari 16 responden memberi nilai 4 pada butir tersebut. Nilai ini kemungkinan berkaitan dengan ketergantungan chat real-time pada kualitas koneksi internet masing-masing pengguna, sehingga layak dipantau pada pengembangan lanjutan. 

##### **_c. Hasil Penilaian per Aspek_** 

Pengelompokan butir ke dalam empat aspek menghasilkan indeks penerimaan sebagaimana disajikan pada Tabel 4.22 dan Gambar 4.45. 

**Tabel 4.22 Indeks Penerimaan UAT Sisi Penjual per Aspek** 

|**No**|**Aspek**|**Butir**|**Jumlah**<br>**Butir**|**Total**<br>**Skor**|**Skor**<br>**Maks**|**Indeks**|**Kategori**|
|---|---|---|---|---|---|---|---|
|1|Fungsional|1–6|6|458|480|95,42%|Sangat<br>Baik|
|2|Performa & keandalan|7–9|3|231|240|96,25%|Sangat<br>Baik|
|3|Tampilan & usability|10–12|3|235|240|97,92%|Sangat<br>Baik|
|4|Manfaat & kepuasan|13–14|2|155|160|96,88%|Sangat<br>Baik|
||**Keseluruhan**|**1–14**|**14**|**1079**|**1120**|**96,34%**|**Sangat**<br>**Baik**|





<!-- Start of picture text -->
07 oe oe —<br>95,42% 96,25% eee 96,88%<br>= 80<br>&<br>3<br>=FS<br>=<br>Es<br>2 40<br>z<br>20<br>0<br>Fungsional Performa & ‘Tampilan & Manfaat &<br>(butir 1-6) keandalan usability kepuasan<br>(butir 7-9) (butir 10-12) (butir 13-14)<br>===. Rata-rata keseluruhan (96,34%)<br><!-- End of picture text -->

**Gambar 4.45** Indeks Penerimaan UAT Sisi Penjual per Aspek 

Aspek tampilan dan _usability_ memperoleh indeks tertinggi (97,92%), yang sejalan dengan perbaikan antarmuka yang dilakukan berdasarkan evaluasi pada iterasi pertama dan penyempurnaan responsivitas pada iterasi ketiga. Aspek fungsional memperoleh indeks terendah (95,42%), tetapi selisihnya dengan aspek lain sangat kecil dan tetap berada pada kategori Sangat Baik. Aspek performa dan keandalan (96,25%) menguatkan hasil pengujian performa pada Subbab 4.6.5, sedangkan aspek manfaat dan kepuasan (96,88%) menunjukkan bahwa penjual menilai aplikasi mempermudah proses jual-beli dibandingkan cara konvensional. 

##### **_d. Saran dan Komentar Responden_** 

Kolom saran diisi oleh seluruh responden dan dapat dikelompokkan menjadi lima jenis komentar sebagaimana ditunjukkan pada Gambar 4.46. Seluruh komentar bersifat positif. Komentar terbanyak menyatakan proses transaksi dan komunikasi berjalan lancar (5 toko), diikuti harapan agar aplikasi terus dikembangkan dengan fitur baru (4 toko), pernyataan bahwa aplikasi sangat baik dan responsif (3 toko), kepuasan terhadap performa aplikasi (3 toko), dan navigasi yang simpel serta mudah dipahami (1 toko). Tidak terdapat komentar yang memuat keluhan fungsional atau laporan kesalahan. 



<!-- Start of picture text -->
(b) Kelompok saran/komentar (n = 16)<br>ALADistribusi SEseluruh AEjawabi Proses transaksi dan 5 toko<br>komunikasi lancar<br>Semoga terus dikembangkan 4toko<br>dengan fitur baru<br>224 Aplikasi sangat baik 3toko<br>jawaban dan responsif<br>Sangat puas dengan 3toko<br>performa aplikasi<br>Navigasi simpel dan 1 toko<br>MME Skor 5 (Sangat setuju): 183 (81,79) mudah dipabamt<br>Skor<br>4 (Setuj): 41 (18,3%) o 1 2 3 4 5 6<br><!-- End of picture text -->

**Gambar 4.46** Distribusi Seluruh Jawaban dan Kelompok Saran pada UAT Sisi Penjual 

##### **4.7.3 UAT Sisi Pembeli** 

UAT sisi pembeli dilakukan melalui kuesioner tertutup terhadap 28 konsumen produk bunga dengan lokasi sebaran utama di Kota Manado. Kuesioner dikumpulkan pada 23-24 September 2026 dan mengukur penerimaan kebutuhan serta konsep aplikasi, sehingga hasilnya dipakai untuk menilai apakah fitur yang diimplementasikan pada aplikasi Bloemen sesuai dengan kebutuhan pembeli. Kisikisi instrumen disajikan pada Tabel 4.23. 

**Tabel 4.23 Kisi-Kisi Instrumen UAT Sisi Pembeli** 

|**No**|**Aspek yang Diukur**|**Indikator Pertanyaan**|**Skala**|
|---|---|---|---|
|1|Profil Responden|Jenis kelamin, usia, pekerjaan, pengalaman<br>membeli produk bunga|Nominal|
|2|Perilaku Pembelian|Jenis produk yang pernah dibeli, momen<br>pembelian, media pemesanan yang digunakan|Nominal (multi-<br>pilihan)|
|3|Identifikasi Kendala|Kesulitan yang dialami saat membeli bunga;<br>frekuensi kendala pemesanan mendesak|Nominal dan<br>Ordinal|



|**No**|**Aspek yang Diukur**|**Indikator Pertanyaan**|**Skala**|
|---|---|---|---|
|4|Penerimaan Fitur|Kepentingan kemudahan pemesanan daring, fitur<br>lokasi, pre-order, dan informasi jadwal acara|Likert 1–5|
|5|Prioritas Fitur|Fitur yang dinilai paling penting untuk disediakan<br>aplikasi|Nominal (multi-<br>pilihan)|
|6|Niat Penggunaan|Ketertarikan terhadap aplikasi marketplace bunga<br>dan niat menggunakannya|Likert 1–5|
|7|Literasi Digital|Tingkat kemudahan responden dalam<br>menggunakan aplikasi belanja daring|Likert 1–5|



##### **_a. Karakteristik Responden_** 

Seluruh kuesioner yang masuk dinyatakan sah sehingga 28 tanggapan dianalisis. Seluruh responden (100%) menyatakan pernah membeli produk bunga, sehingga memenuhi kriteria sebagai pengguna sasaran aplikasi Bloemen sisi pembeli. Karakteristik responden disajikan pada Tabel 4.24 dan Gambar 4.47. 

**Tabel 4.24 Karakteristik Responden UAT Sisi Pembeli (n = 28)** 

|**No**|**Karakteristik**|**Kategori**|**Jumlah**|**Persentase**|
|---|---|---|---|---|
|1|Jenis Kelamin|Perempuan|24|85,7%|
|||Laki-laki|4|14,3%|
|2|Usia|< 18 tahun|3|10,7%|
|||18 – 22 tahun|23|82,1%|
|||23 – 30 tahun|2|7,1%|
|3|Pekerjaan|Pelajar / Mahasiswa|23|82,1%|
|||Pegawai Negeri / Swasta|2|7,1%|
|||Lainnya|2|7,1%|
|||Tidak diisi|1|3,6%|
|4|Pengalaman Membeli<br>Bunga|Pernah membeli produk bunga|28|100%|





<!-- Start of picture text -->
(@) Jenis kelamin (b) Usia (©) Pekerjaan<br>fm Perempuan: 24 (85,7%) mes 16-22 talon: 23 (82,1%) Pelajan/Mahasiswa:<br>mmm Lakicakis 4 (14,3%) < 18 tahun: 3 (10,79) mm Pegawai:2(7,1%) 23 (82,19)<br>mms 23-30 tahun: 2 (7,19) TidakLainnya:2(7,1%)dist: 1 6.6%)<br><!-- End of picture text -->

**Gambar 4.47** Distribusi Karakteristik Responden UAT Sisi Pembeli 

Mayoritas responden adalah perempuan (85,7%) berusia 18–22 tahun (82,1%) dengan status pelajar atau mahasiswa (82,1%). Komposisi ini selaras dengan karakteristik pasar produk bunga yang banyak digerakkan oleh momen wisuda dan perayaan di lingkungan kampus. Dari sisi literasi digital, 19 responden (67,9%) memberi nilai 5 dan 6 responden (21,4%) memberi nilai 4 pada kemudahan menggunakan aplikasi belanja daring, dengan rata-rata 4,57 dari 5 atau setara indeks 91,4%. Literasi digital yang tinggi menunjukkan bahwa penyediaan aplikasi berbasis mobile tidak akan menjadi hambatan teknis bagi calon pengguna. 

##### **_b. Perilaku Pembelian_** 

Aspek perilaku pembelian diukur untuk memvalidasi kesesuaian kategori produk, kategori acara, dan kanal pemesanan yang diimplementasikan pada aplikasi. Karena butir bersifat pilihan ganda, total persentase dapat melebihi 100%. Hasilnya disajikan pada Tabel 4.25 dan Gambar 4.48. 

**Tabel 4.25 Hasil Aspek Perilaku Pembelian Responden (n = 28)** 

|**Butir**|**Pilihan Jawaban**|**Jumlah**|**Persentase**|**Peringkat**|
|---|---|---|---|---|
|Jenis produk bunga yang<br>pernah dibeli|Buket Bunga|23|82,1%|1|
||Bunga Hias|17|60,7%|2|
||Bunga Hidup|15|53,6%|3|
||Krans Bunga|13|46,4%|4|
||Papan Bunga|7|25,0%|5|
|Momen pembelian bunga|Wisuda|21|75,0%|1|
||Ulang Tahun|17|60,7%|2|



|**Butir**|**Pilihan Jawaban**|**Jumlah**|**Persentase**|**Peringkat**|
|---|---|---|---|---|
||Duka Cita|13|46,4%|3|
||Hari Raya / Perayaan|12|42,9%|4|
||Pernikahan|5|17,9%|5|
||Lainnya|5|17,9%|5|
|Media untuk memesan<br>bunga|Instagram|20|71,4%|1|
||Datang langsung ke toko|19|67,9%|2|
||WhatsApp|13|46,4%|3|
||Marketplace umum<br>(Shopee/Tokopedia)|8|28,6%|4|





<!-- Start of picture text -->
(a) Jenis produk bunga yang pernah dibeli<br>Buket Bunga 82,1%<br>Bunga Hias 60,7%<br>Bunga Hidup 53,6%<br>Krans Bunga 46,4%<br>Papan Bunga 25,0%<br>0) 20 40 60. 80 100<br>(b) Momen pembelian bunga<br>Wisuda 75,0%<br>Ulang Tahun 07%<br>Duka Cita 46,4%<br>Hari Raya/ Perayaan 42.9%<br>Pernikahan 17,9%<br>Lainnya 17,9%<br>0 20 40 60 80 100<br>(©) Media yang digunakan untuk memesan<br>Instagram 71,4%<br>Datang langsung ke toko 67,9%<br>WhatsApp 46,4%<br>Marketplace (Shopee/Tokopedia) 28,6%<br>0) 20 40 60 80 100<br>Persentase responden (%) — pilihan ganda, n = 28<br><!-- End of picture text -->

**Gambar 4.48** Perilaku Pembelian Responden: Jenis Produk, Momen Pembelian, dan 

Media Pemesanan 

Hasil tersebut memperkuat keputusan perancangan sistem. Pertama, dominasi buket bunga (82,1%) dan bunga hias (60,7%) membenarkan penempatan kedua 

kategori tersebut sebagai kategori utama pada komponen ShopCategoryPicker. Kedua, momen wisuda (75,0%) dan ulang tahun (60,7%) menjadi acara paling dominan sehingga layak dijadikan kata kunci pada chip pencarian populer di halaman Referensi Desain. Ketiga, seluruh responden masih memesan bunga melalui kanal yang belum terpusat, yaitu media sosial (Instagram dan WhatsApp), kunjungan langsung ke toko, dan marketplace umum yang tidak dikhususkan untuk produk bunga (28,6%). Temuan ini menjadi dasar empiris atas urgensi pembangunan aplikasi Bloemen. 

##### **_c. Kendala Pengguna_** 

Butir berikutnya mengidentifikasi kendala yang dialami responden pada proses pembelian bunga secara konvensional. Setiap kendala yang teridentifikasi dipetakan menjadi kebutuhan fungsional sistem. Hasilnya disajikan pada Tabel 4.26 dan Gambar 4.49. 

**Tabel 4.26 Kendala yang Dialami Responden dalam Pembelian Bunga (n = 28)** 

|**No**|**Kendala yang Dialami**|**Jumlah**|**Persentase**|**Kategori**|
|---|---|---|---|---|
|1|Sulit mencari toko bunga terdekat|18|64,3%|Dominan|
|2|Sulit mencari referensi desain bunga|11|39,3%|Tinggi|
|3|Pilihan produk terbatas|10|35,7%|Tinggi|
|4|Sulit membandingkan antar toko|7|25,0%|Sedang|
|5|Tidak ada katalog yang jelas|6|21,4%|Sedang|
|6|Harga tidak transparan|5|17,9%|Rendah|
|7|Proses pemesanan lama|3|10,7%|Rendah|





<!-- Start of picture text -->
(b) Kesulitan memesan<br>(a) Kendala pembelian bunga karena waktu mepet<br>18<br>Sulit mencari toko terdekat 64.3% 46<br>Sulit mencari referensi desain 39,3% 14 Perey<br>Pilihan produk terbatas 35,7%4 35 12<br>Sulit membandingkan toko 25,0% 2: 10 (caya<br>Tidak ada katalog yang jelas 21,4% g i<br>Harga tidak, transparan 17,9%” a 4 (24,39)4 co3<br>Proses pemesanan lama 10,7% 2<br>o<br>0 20 40 60 80 Sangat Sering Kadang- Tidak<br>sering, kadang_pernah<br><!-- End of picture text -->

**Gambar 4.49** Kendala Pembelian Bunga dan Frekuensi Kesulitan Memesan karena Waktu Mepet 

Selain kendala tersebut, diukur pula frekuensi kesulitan memesan bunga akibat keterbatasan waktu (pemesanan mendesak). Sebanyak 25 dari 28 responden (89,3%) pernah mengalaminya, dengan rincian kadang-kadang 13 responden (46,4%), sering 8 responden (28,6%), dan sangat sering 4 responden (14,3%). Hanya 3 responden (10,7%) yang menyatakan tidak pernah. Temuan ini memperkuat urgensi fitur pre-order dengan validasi durasi pengerjaan serta fitur chat real-time untuk koordinasi cepat antara pembeli dan penjual. 

##### **_d. Prioritas Fitur_** 

Responden memilih fitur yang dinilai paling penting untuk disediakan aplikasi marketplace bunga. Hasilnya menjadi dasar penentuan prioritas modul pada siklus iterasi RAD dan disajikan pada Tabel 4.27 dan Gambar 4.50. 

**Tabel 4.27 Prioritas Fitur Menurut Responden (n = 28)** 

|**No**|**Fitur**|**Jumlah**|**Persen**|**Status Implementasi pada Bloemen**|
|---|---|---|---|---|
|1|Rekomendasi atau referensi<br>model bunga|26|92,9%|Terimplementasi — halaman Referensi<br>Desain (Wikimedia Commons dan foto<br>produk toko)|
|2|Chat dengan penjual|23|82,1%|Terimplementasi — chat real-time<br>Supabase Realtime|
|3|Pencarian produk<br>berdasarkan kategori|20|71,4%|Terimplementasi — pencarian dan filter<br>kategori|
|4|Pelacakan status pesanan|14|50,0%|Terimplementasi — riwayat pesanan dan<br>notifikasi status|
|5|Pre-order|10|35,7%|Terimplementasi — modul Pre-Order<br>dengan validasi tanggal|





<!-- Start of picture text -->
No Fitur Jumlah Persen Status Implementasi pada Bloemen<br>Informasi jadwal wisuda  Belum diimplementasikan — prioritas<br>6 6 21,4%<br>atau acara terendah responden<br><!-- End of picture text -->



<!-- Start of picture text -->
Rekomendasi /referensi model bunga 92.9%<br>Chat dengan penjual 82,1%<br>Pencarian produk per kategori 71.4%<br>Pelacakan status pesanan 50,0%<br>Pre-order 35,7%<br>Informasi jadwal wisuda/acara 21.4%<br>0 20 40 60 80 100<br>Persentase responden (%) — pilihan ganda, n = 28<br><!-- End of picture text -->

**Gambar 4.50** Prioritas Fitur Aplikasi Menurut Responden Pembeli 

Lima fitur dengan prioritas tertinggi seluruhnya telah diimplementasikan pada aplikasi Bloemen versi final (v03.0), sehingga tingkat pemenuhan fitur prioritas responden mencapai 5 dari 6 fitur atau 83,3%. Fitur informasi jadwal wisuda atau acara yang mendapat dukungan paling rendah (21,4%) tidak dijadikan fitur inti pada versi ini dan direkomendasikan sebagai bahan pengembangan lanjutan. 

##### **_e. Tingkat Penerimaan Pengguna_** 

Pengukuran tingkat penerimaan dilakukan terhadap enam butir berskala Likert yang mewakili aspek kebutuhan fitur, ketertarikan, dan niat penggunaan aplikasi. Hasil perhitungan skor dan indeks penerimaan setiap butir disajikan pada Tabel 4.28 dan Gambar 4.51. 

**Tabel 4.28 Rekapitulasi Skor dan Indeks Penerimaan Pengguna Sisi Pembeli** 

|**No**<br><br>|**Butir Pernyataan**<br>~~ee~~<br>|**5**<br><br>|**4**<br><br>|**3**<br><br>|**2**<br><br>|**1**<br><br>|**Total**<br>**Skor**<br><br>|**Skor**<br>**Maks**<br><br>|**Indeks**<br>|**Kategori**<br>|
|---|---|---|---|---|---|---|---|---|---|---|
|1<br><br><br>|Kepentingan kemudahan<br>pemesanan bunga secara daring<br><br>~~ee~~<br>|12<br> <br> <br>|11<br> <br> <br>|4<br> <br> <br>|0<br> <br><br>|1<br><br><br>|117<br><br>~~e~~<br>|140<br><br>~~e~~<br>|83,6%<br><br>|Sangat Baik<br><br>|
|2<br><br>|Kepentingan fitur lokasi toko<br>dalam belanja daring *<br>~~ee~~<br>|20<br><br>|6<br><br>|1<br><br>|0<br><br>|0<br><br>|127<br><br>|135<br><br>|94,1%<br><br>|Sangat Baik<br>~~ee~~<br>|
|3<br><br><br><br>|Ketertarikan terhadap aplikasi<br>khusus marketplace bunga<br><br>~~ee~~<br><br>|10<br> <br><br><br>|15<br> <br><br><br>|3<br> <br><br><br>|0<br><br><br><br><br>|0<br><br><br><br><br>|119<br><br><br><br><br>|140<br><br><br><br><br>|85,0%<br><br>~~e~~<br><br>|Sangat Baik<br><br>~~ee~~<br><br>|
|4<br><br><br>|Kebutuhan terhadap fitur pre-<br>order untuk bunga hidup<br><br>~~e~~<br>|5<br> <br><br>|10<br> <br><br>|12<br> <br><br>|0<br><br><br><br>|1<br><br><br><br>|102<br><br><br><br>|140<br> <br><br><br>|72,9%<br> <br><br>|Baik<br><br><br>|
|5<br>|Kepentingan informasi jadwal<br>wisuda/acara dalam aplikasi<br>~~e ~~|8<br>|10<br>|9<br>|1<br><br>|0<br><br>|109<br><br>|140<br><br>|77,9%<br>|Baik<br>~~ee~~|



|**No**|**Butir Pernyataan**|**5**|**4**|**3**|**2**|**1**|**Total**<br>**Skor**|**Skor**<br>**Maks**|**Indeks**|**Kategori**|
|---|---|---|---|---|---|---|---|---|---|---|
|6|Niat menggunakan aplikasi<br>apabila telah tersedia|16|12|0|0|0|128|140|91,4%|Sangat Baik|
||**Rata-rata indeks penerimaan**||||||||**84,1%**|**Sangat Baik**|



_Keterangan: * satu responden tidak mengisi butir ini, sehingga skor maksimum butir tersebut dihitung dari 27 responden._ 



<!-- Start of picture text -->
Kemudahan pemesanan bunga daring Eien<br>Fitur lokasi toko 94.1%<br>if<br>85,0%<br>Ketertarikan pada aplikasi khusus<br>Kebutuhan fitur pre-order non H<br>Informasi jadwal wisuda/acara whe<br>Niat menggunakan aplikasi 91.4%<br>:<br>100<br>0) 20 40 60 80<br>Garis putus-putus: batas "SangatIndeks Baik”penerimaan (81%); garis(%) titik-titik: rata-rata (84, 1%)<br><!-- End of picture text -->

**Gambar 4.51** Indeks Penerimaan Pengguna Sisi Pembeli per Aspek Pengujian 

Rata-rata indeks penerimaan pengguna sisi pembeli terhadap konsep dan fitur aplikasi Bloemen adalah 84,1%. Merujuk pada Tabel 4.18, nilai tersebut berada pada rentang 81%–100% sehingga tergolong kategori Sangat Baik. Butir dengan indeks tertinggi adalah kepentingan fitur lokasi toko (94,1%) dan niat menggunakan aplikasi (91,4%). Hal ini konsisten dengan temuan kendala pada Tabel 4.26, yaitu kesulitan menemukan toko bunga terdekat sebagai kendala paling dominan (64,3%). Butir dengan indeks terendah adalah kebutuhan fitur pre-order (72,9%) dan informasi jadwal acara (77,9%). Keduanya masih berada pada kategori Baik, tetapi sebaran jawabannya menunjukkan bahwa kedua fitur tersebut dipersepsikan sebagai pelengkap, bukan fitur utama, dari sudut pandang pembeli. 



<!-- Start of picture text -->
Ketertarikan pada aplikasi Sangat tertarik “Tenarik Biasa saja<br>marketplace bunga 105,70) 15(636%) 3(10,7%)<br>Kemungkinan menggunakan Sangat munghin Mungkin<br>aplikasi bila tersedia TEATS) 12(429%)<br>0 20 40 60 80 100<br>Persentase responden (%)<br><!-- End of picture text -->

**Gambar 4.52** Tingkat Ketertarikan dan Niat Penggunaan Aplikasi oleh Responden Pembeli 

Gambar 4.52 memperlihatkan bahwa 25 dari 28 responden (89,3%) menyatakan tertarik hingga sangat tertarik terhadap aplikasi marketplace bunga dan tidak ada responden yang menyatakan tidak tertarik. Seluruh responden (100%) menyatakan mungkin hingga sangat mungkin akan menggunakan aplikasi tersebut apabila tersedia, dengan 16 responden (57,1%) menyatakan sangat mungkin. Tidak adanya jawaban negatif pada butir niat penggunaan menjadi indikator kuat atas penerimaan pengguna terhadap sistem yang dibangun. 

Sebagai catatan keterbatasan, kuesioner sisi pembeli dikumpulkan sebelum aplikasi versi final tersedia sehingga mengukur penerimaan kebutuhan dan konsep aplikasi, bukan pengalaman langsung menggunakan aplikasi. Pengalaman langsung diukur pada UAT sisi penjual (Subbab 4.7.2). Pengujian aplikasi versi final oleh pembeli secara langsung disarankan sebagai penelitian lanjutan. 

##### **4.7.4 Pemetaan Hasil UAT terhadap Kebutuhan Fungsional Sistem** 

Agar hasil UAT benar-benar termanfaatkan dalam pengembangan, setiap temuan utama dipetakan terhadap kebutuhan fungsional (FR) pada Tabel 3.5 dan terhadap modul yang diimplementasikan. Pada kolom sumber, huruf B menandakan sumber dari UAT sisi pembeli dan huruf J menandakan sumber dari UAT sisi penjual. Pemetaan disajikan pada Tabel 4.29. 

**Tabel 4.29 Pemetaan Temuan UAT terhadap Kebutuhan Fungsional dan Implementasi** 

|**N**<br>**o**|**Su**<br>**m**<br>**be**<br>**r**|**Temuan Pengujian UAT**|**Kode**<br>**FR**|**Modul Implementasi**|**Statu**<br>**s**|
|---|---|---|---|---|---|
|1|B|Sulit mencari toko bunga<br>terdekat (64,3%); fitur<br>lokasi dinilai paling<br>penting (indeks 94,1%)|FR-0<br>3,<br>FR-0<br>7|Registrasi toko dengan<br>InteractiveMap; halaman Shops<br>dan ShopMap|Terpe<br>nuhi|
|2|B|Sulit mencari referensi<br>desain bunga (39,3%);<br>rekomendasi model bunga<br>menjadi fitur prioritas ke-1<br>(92,9%)|FR-1<br>5|Halaman Referensi Desain<br>(Wikimedia Commons dan foto<br>produk toko)|Terpe<br>nuhi|
|3|B|Pilihan produk terbatas<br>(35,7%) dan tidak ada<br>katalog yang jelas (21,4%)|FR-0<br>4,<br>FR-0<br>7|Katalog produk dengan variasi<br>ukuran S–XL, pencarian, dan filter<br>kategori|Terpe<br>nuhi|
|4|B|Sulit membandingkan<br>antar toko (25,0%) dan<br>harga tidak transparan<br>(17,9%)|FR-0<br>4,<br>FR-0<br>6,<br>FR-1<br>4|Kartu toko dengan rating dan status<br>buka; harga per ukuran; badge<br>diskon; ulasan|Terpe<br>nuhi|
|5|B|Kebutuhan komunikasi<br>langsung dengan penjual<br>(82,1%)|FR-1<br>1,<br>FR-1<br>3|Chat real-time dan penawaran<br>harga kustom|Terpe<br>nuhi|
|A<br>X<br>Z|B|KEBUTUHAN<br>PELACAKAN STATUS<br>PESANAN (50,0%)|FR-0<br>9,<br>FR-1<br>2|RIWAYAT PESANAN<br>PEMBELI DAN NOTIFIKASI<br>IN-APP REAL-TIME|TER<br>PEN<br>UHI|
|7|B|Kesulitan pemesanan<br>karena waktu mepet<br>(89,3%); kebutuhan pre-<br>order (indeks 72,9%)|FR-0<br>5,<br>FR-0<br>8|Modul Pre-Order dengan validasi<br>durasi pengerjaan produk|Terpe<br>nuhi|
|8|B|Kebutuhan informasi<br>jadwal wisuda atau acara<br>(indeks 77,9%; prioritas<br>terendah 21,4%)|—|Belum diimplementasikan pada<br>versi v03.0|Peng<br>emba<br>ngan<br>lanjut<br>an|
|9|J|Registrasi dan login sesuai<br>peran dinilai mudah<br>(indeks 95,00%)|FR-0<br>1,<br>FR-0<br>2|AuthContext, halaman Register<br>dan Login, guard rute|Terpe<br>nuhi|



|**N**<br>**o**|**Su**<br>**m**<br>**be**<br>**r**|**Temuan Pengujian UAT**|**Kode**<br>**FR**|**Modul Implementasi**|**Statu**<br>**s**|
|---|---|---|---|---|---|
|1<br>0|J|Manajemen produk dan<br>varian harga dinilai mudah<br>(indeks 97,50%)|FR-0<br>4,<br>FR-0<br>5,<br>FR-0<br>6|ProductsManagement dengan<br>variasi ukuran, Pre-Order, dan<br>diskon|Terpe<br>nuhi|
|1<br>1|J|Chat real-time (93,75%)<br>dan notifikasi (95,00%)<br>berjalan baik|FR-1<br>1,<br>FR-1<br>2|ChatRoom dengan Supabase<br>Realtime; NotificationBell dengan<br>trigger basis data|Terpe<br>nuhi|
|1<br>2|J|Respons penawaran<br>kustom sesuai alur (indeks<br>95,00%)|FR-1<br>3|CustomOrderQuote dalam alur chat|<sup>Terpe</sup><br>nuhi|
|1<br>3|J|Dashboard dan rekap PDF<br>menampilkan data akurat<br>(indeks 96,25%)|FR-1<br>6|SellerDashboard dan SalesReport<br>dengan jsPDF|Terpe<br>nuhi|



Berdasarkan Tabel 4.29, 12 dari 13 temuan utama UAT (92,3%) telah dipenuhi oleh fitur yang diimplementasikan pada aplikasi Bloemen versi final. Satu temuan yang belum terpenuhi merupakan kebutuhan dengan prioritas paling rendah menurut responden pembeli sehingga tidak memengaruhi kelayakan sistem. 

##### **4.7.5 Kesimpulan Pengujian UAT** 

Berdasarkan seluruh rangkaian pengujian penerimaan pengguna terhadap 16 penjual dan 28 pembeli, dapat disimpulkan hal-hal berikut. 

1. Sisi penjual (16 responden): rata-rata indeks penerimaan sebesar 96,34% dengan kategori Sangat Baik. Seluruh 14 butir berada pada kategori Sangat Baik (93,75%–100,00%) dan tidak ada jawaban bernilai di bawah 4. 

2. Aspek dengan indeks tertinggi pada sisi penjual adalah tampilan dan _usability_ (97,92%), sedangkan aspek dengan indeks terendah adalah fungsional (95,42%) yang tetap tergolong Sangat Baik. Seluruh saran responden bersifat positif dan tidak ada keluhan fungsional. 

3. Sisi pembeli (28 responden): seluruh responden merupakan konsumen aktif produk bunga dengan literasi digital tinggi (indeks 91,4%), dan pola 

pembelian masih dilayani kanal yang belum terpusat sehingga memperkuat urgensi aplikasi Bloemen. 

4. Kendala paling dominan pembeli adalah sulit menemukan toko bunga terdekat (64,3%) dan sulit mencari referensi desain (39,3%). Keduanya telah dijawab melalui fitur lokasi toko berbasis peta dan halaman Referensi Desain (Wikimedia Commons dan foto produk toko). 

5. Rata-rata indeks penerimaan sisi pembeli sebesar 84,1% dengan kategori Sangat Baik. Seluruh responden (100%) menyatakan mungkin hingga sangat mungkin menggunakan aplikasi apabila tersedia. 

6. Sebanyak 12 dari 13 temuan utama UAT (92,3%) telah dipenuhi oleh fitur yang diimplementasikan. 

Dengan demikian, aplikasi marketplace kreativitas bunga Bloemen dinyatakan DITERIMA (accepted) oleh pengguna sisi penjual dan sisi pembeli, serta layak diimplementasikan pada lingkungan nyata. Catatan pengembangan berikutnya adalah penambahan modul informasi jadwal wisuda atau acara, penguatan fitur pre-order agar manfaatnya lebih mudah dipahami pembeli, serta pengujian aplikasi versi final oleh pembeli secara langsung. 

#### **4.8 Ringkasan Hasil Pembangunan Sistem** 

Proses pembangunan aplikasi Marketplace Kreativitas Bunga Bloemen telah berhasil diselesaikan melalui tiga iterasi pengembangan yang menghasilkan sistem yang semakin matang dan lengkap di setiap tahapnya. Tabel 4.30 merangkum capaian akhir sistem. 

**Tabel 4.30 Ringkasan Capaian Akhir Sistem Bloemen** 

|**No**|**Aspek**|**Capaian**|
|---|---|---|
|1|Total iterasi<br>pengembangan|3 iterasi RAD (v01.0 Wireframe, v02.0 Fungsional Inti, v03.0 Final)<br>yang tersusun dari 22 fase dan 136 versi snapshot (v1–v136)|
|2|Tabel database|10 tabel: users, shops, products, preorders, order_items,<br>conversations, messages, reviews, notifications,<br>custom_order_quotes|
|3|Halaman aplikasi|17 halaman pembeli dan 8 halaman penjual (Dashboard, Produk,<br>Pesanan, Pengaturan Toko, Ulasan, Rekap Penjualan, Pesan, dan<br>Chat)|
|4|Komponen|15 komponen kustom utama dan sekitar 40 komponen primitif<br>shadcn/ui|



|**No**|**Aspek**|**Capaian**|
|---|---|---|
|5|Fitur utama|Autentikasi multi-peran; katalog, pencarian, dan filter; variasi harga<br>S–XL (JSONB); Pre-Order; chat real-time; notifikasi real-time;<br>penawaran kustom; ulasan dan rating; diskon; Referensi Desain<br>(Wikimedia Commons dan foto produk toko); dashboard dan rekap<br>PDF; Capacitor Android|
|6|Stack teknologi|React 18, TypeScript, Vite, Tailwind CSS v4, Motion, Supabase<br>(PostgreSQL, Auth, Realtime, Storage, RLS), Wikimedia Commons<br>API, jsPDF, dan Capacitor Android|
|7|Pengujian alpha|Fungsional 39 skenario valid (100%); performa 5 dari 6 butir<br>terpenuhi penuh dan 1 dengan catatan; aksesibilitas 7 dari 8 butir<br>terpenuhi dan 1 belum diuji; kompatibilitas 4 perangkat lulus|
|8|UAT|Sisi penjual (16 responden): indeks 96,34% (Sangat Baik). Sisi<br>pembeli (28 responden): indeks 84,1% (Sangat Baik)|
|9|Kompatibilitas Android|Android 10 (API 29) hingga Android 13 (API 33), seluruhnya lulus<br>uji|
|10|Output akhir|Berkas APK Android (app-debug.apk) siap distribusi dan instalasi<br>pada perangkat fisik|



Hasil pembangunan dan pengujian tersebut menjawab tujuan penelitian sebagaimana dirangkum pada Tabel 4.31. 

**Tabel 4.31 Keterkaitan Hasil Penelitian dengan Tujuan Penelitian** 

|**No**|**Tujuan Penelitian**|**Hasil yang Dicapai**|**Bukti Pengujian**|
|---|---|---|---|
|1|Membangun sistem<br>pemesanan yang terstruktur<br>untuk membantu pelaku<br>usaha mengelola pesanan<br>dan transaksi|Modul Pre-Order dengan nomor<br>pesanan unik, manajemen<br>pesanan penjual, chat real-time,<br>notifikasi, dan rekap penjualan|Fungsional 39/39 valid;<br>UAT penjual aspek<br>fungsional 95,42%|
|2|Menyediakan fitur referensi<br>desain produk bunga untuk<br>membantu pembeli memilih<br>produk sesuai kebutuhan<br>acara|Halaman Referensi Desain yang<br>memadukan foto produk toko<br>dan gambar Wikimedia<br>Commons, dengan pengiriman<br>referensi ke toko|Skenario #15, #16, #33–#35<br>dan E2E-03 valid; referensi<br>model bunga menjadi<br>prioritas ke-1 pembeli<br>(92,9%)|
|3|Menghadirkan fitur pre-order<br>untuk membantu penjual<br>mengelola stok bunga hidup|Produk Pre-Order dengan durasi<br>pengerjaan dan validasi tanggal<br>pengantaran|Skenario #10, #18, #19<br>valid; 89,3% pembeli pernah<br>kesulitan memesan karena<br>waktu mepet|
|4|Merancang antarmuka<br>(UI/UX) yang mudah<br>digunakan konsumen<br>maupun pelaku usaha|Antarmuka mobile-first hasil tiga<br>iterasi RAD dengan bottom<br>navigation dan sidebar penjual|UAT penjual aspek tampilan<br>dan usability 97,92%;<br>aksesibilitas 7/8 butir;<br>kompatibilitas 4 perangkat|



### **BAB 5** 

### **KESIMPULAN DAN SARAN** 

##### **5.1 Kesimpulan** 

Berdasarkan hasil rancang bangun, implementasi, dan pengujian yang telah dilakukan terhadap aplikasi _Marketplace_ Kreativitas Bunga Berbasis Mobile di Sulawesi Utara, maka dapat ditarik beberapa kesimpulan utama sebagai berikut: 

1. **Realisasi Antarmuka yang Intuitif (UI/UX):** Aplikasi berhasil dibangun dengan antarmuka yang sederhana namun fungsional menggunakan _framework_ React dan Tailwind CSS v4. Desain aplikasi telah disesuaikan dengan karakteristik pengguna di Sulawesi Utara, memudahkan baik pembeli maupun pelaku usaha bunga dalam menavigasi katalog, melakukan pemesanan, hingga berinteraksi melalui fitur chat tanpa memerlukan keahlian teknis yang rumit. 

2. **Efektivitas Sistem Rekomendasi Berbasis Momen:** 

Sistem rekomendasi produk yang dikembangkan menggunakan algoritma pemetaan _tag_ terbukti mampu menyarankan rangkaian bunga secara otomatis berdasarkan **Kategori Acara** (seperti Wisuda, Pernikahan, atau Duka Cita). Hal ini menjawab rumusan masalah mengenai kesulitan konsumen dalam menentukan pilihan produk yang sesuai dengan konteks momen spesial mereka. 

3. **Digitalisasi Manajemen Produk dan Pre-Order:** Aplikasi telah berhasil mengimplementasikan pengelolaan produk variabel dengan variasi ukuran (S, M, L, XL) melalui struktur data **JSONB** pada basis data PostgreSQL. Mekanisme _pre-order_ yang terintegrasi memungkinkan penjual untuk mengelola durasi pengerjaan bunga secara sistematis, sementara konsumen mendapatkan kepastian tanggal pengantaran dan nomor pesanan unik yang tervalidasi. 

4. **Stabilitas Teknis dan Kelayakan Sistem:** Berdasarkan hasil pengujian _Black-Box_ terhadap 32 skenario fungsional, aplikasi mencapai tingkat keberhasilan **100% (Valid)** . Pengujian kompatibilitas pada berbagai perangkat Android (versi 10 hingga 13) juga 

menunjukkan performa yang stabil. Penggunaan teknologi _Supabase Realtime_ terbukti menjadi solusi yang andal untuk koordinasi pembayaran di luar sistem melalui kanal chat yang instan dan responsif. 

##### **5.2 Saran** 

Meskipun aplikasi ini telah memenuhi tujuan penelitian dan rumusan masalah yang ditetapkan, penulis menyadari masih terdapat ruang untuk pengembangan lebih lanjut. Berikut adalah beberapa saran bagi pengembang selanjutnya: 

1. **Integrasi Payment Gateway:** 

Untuk pengembangan kedepan, disarankan untuk mengintegrasikan sistem pembayaran digital ( _Payment Gateway_ ) seperti Midtrans atau Xendit. Hal ini akan mengotomatisasi verifikasi pembayaran dan meminimalkan risiko penipuan atau kesalahan manusia pada proses koordinasi pembayaran manual via chat. 

2. **Implementasi Fitur Geolokasi dan Maps:** 

Sesuai dengan batasan masalah saat ini, fitur lokasi belum diaktifkan. Penambahan fitur pelacakan kurir secara _real-time_ menggunakan GPS akan sangat bermanfaat untuk meningkatkan efisiensi pengiriman rangkaian bunga di wilayah geografis Sulawesi Utara yang cukup luas. 

3. **Ekspansi ke Multi-Platform (iOS):** 

Mengingat aplikasi saat ini difokuskan pada platform Android menggunakan Capacitor, pengembang selanjutnya dapat melakukan konfigurasi tambahan untuk merilis aplikasi pada platform iOS guna menjangkau segmen pasar pengguna perangkat Apple yang juga cukup besar di Sulawesi Utara. 

4. **Peningkatan Keamanan Data:** 

Meskipun sistem telah menggunakan _Row Level Security_ (RLS) di sisi database, penambahan enkripsi _end-to-end_ pada modul percakapan ( _chat_ ) dapat dilakukan untuk memberikan perlindungan privasi yang lebih tinggi bagi pembeli dan penjual saat bertukar informasi sensitif seperti detail nomor rekening. 

5. **Sistem Notifikasi Push Eksternal:** 

Penggunaan _Push Notifications_ berbasis Firebase Cloud Messaging (FCM) disarankan untuk ditambahkan agar pengguna dapat menerima pemberitahuan pesanan masuk atau pesan baru meskipun aplikasi sedang tidak dibuka di latar depan ( _foreground_ ), sehingga meningkatkan responsivitas layanan penjual. 

# **DAFTAR PUSTAKA** 

- Ana, W., Sophan, T. D. F., Nisa, C., & Sanggarwati, D. A. (2021). Pengaruh Pemasaran Media Online Dan Marketplace Terhadap Tingkat Penjualan Produk Umkm Cn Collection Di Sidoarjo. _Media Mahardhika_ , _19_ (3), 517– 522. https://doi.org/10.29062/mahardika.v19i3.274 

- Cahyani, D., Firmansyah, D. D., Oktaviani, D., Sesilia, D. A., & Pratama, R. H. (2024). Optimalisasi Pemasaran Digital dan Keterampilan Kreatif bagi UMKM Toko Buket bunga untuk Meningkatkan Kualitas dan Penjualan. _Welfare : Jurnal Pengabdian Masyarakat_ , _2_ (4), 709–714. https://doi.org/10.30762/welfare.v2i4.1851 

- Danuta, K. S., & Murdijaningsih, T. (2022). Pengenalan Online Marketplace. _WIKUACITYA: Jurnal Pengabdian Kepada Masyarakat_ , _1_ (1), 25–28. https://doi.org/10.56681/wikuacitya.v1i1.8 

- Desisafitra, H., Dewi, I. P., Delianti, V. I., & Zaus, M. A. (2024). _Rancang Bangun Mobile Commerce Berbasis Android Pada Toko Bunga Hy Buckett Florist Padang E LEKTIF : Jurnal Elektronika & Informatika_ . _2_ (2), 141– 159. 

- Dewi, Y., Widyasari, L., & Ramadhan, A. T. (2022). Jurnal Politeknik Caltex Riau Pengembangan dan Penerapan Sistem Informasi Marketplace UMKM. _Jurnal Komputer Terapan_ , _8_ (2), 266–278. 

   - https://jurnal.pcr.ac.id/index.php/jkt/ 

- Informatika, J. T. (2023). Perancangan Antarmuka Pengguna Yang Responsif Untuk Meningkatkan Usability Aplikasi Mobile. _TECHSI - Jurnal Teknik Informatika_ , _14_ (2), 144. https://doi.org/10.29103/techsi.v14i2.14371 

- Nilasari, D., Yanto, A., & Jainuri, J. (2024). Analisa Perbandingan User Interface Dan User Experience Pada Aplikasi Shopee & Tokopedia Menggunakan Metode End User Computing Satisfaction (Eucs) Dan Metode Heuristic. _Insan Pembangunan Sistem Informasi Dan Komputer (IPSIKOM)_ , _12_ (2), 8– 17. https://doi.org/10.58217/ipsikom.v12i2.305 

- Pratama Putra, B., Cahya Assyura, D., Nugroho, D., & Prasetyo, A. (2024). 

Penerapan Aplikasi Pemesanan Pada Usaha Mikro Kecil Menengah (Umkm) Dalam Memudahkan Transaksi. _Jurnal Khatulistiwa Informatika_ , _12_ (1), 38– 45. https://doi.org/10.31294/jki.v12i1.16952 

- Purwanto, A. (2020). _Model Penerimaan Penggunaan E-Marketplace Dengan Technology Acceptance Model Di Pusat Pembelanjaan Mentaya Kotawaringin Timur_ . _15_ (2). 

- Ramadano, M. A. M., & Halim, R. M. N. (2025). Transformasi Digital Di Cv. Danu Florist Berbasis Android Menggunakan Model V-Shape. _Journal of Information System Management (JOISM)_ , _7_ (1), 71–77. 

https://doi.org/10.24076/joism.2025v7i1.2104 

- Ridhoni, W., & Anggraini, M. A. (2023). Pembangunan Aplikasi Mobile Untuk Pencatatan Dan Laporan Pre-Order Umkm Kuliner. _JIPI (Jurnal Ilmiah Penelitian Dan Pembelajaran Informatika)_ , _8_ (3), 1102–1110. 

https://doi.org/10.29100/jipi.v8i3.4640 

- Schultes, D., Schneider, L., Heymann, T., & Wild, F. (2025). Native cross- 

   - platform app development using the SequalsK transpiler. _Information and Software Technology_ , _179_ (November 2024), 107626. 

https://doi.org/10.1016/j.infsof.2024.107626 

- Tokopedia, D. A. N. (2020). _Usability user interface_ . _March_ , 1–12. 

- Wulandari, O. A. D., Ujiani, U., & Putri, N. R. (2020). Analisis Pemanfaatan 

   - Marketplace Dalam Meningkatkan Pendapatan Bagi Penjualan Produk Umkm Di Purbalingga. _Jurnal Ekonomi Manajemen_ , _6_ (2), 96–101. 

https://doi.org/10.37058/jem.v6i2.1978 





LAMPIRAN 







<!-- Start of picture text -->
4 ‘2 at<br>‘ | ee<br>H<br>t<br>a we “4 a<br>4 pet 2) 4<br>Er; 4<br>—<br>Bitesbane Li (UAH reat a<br>ATRL TOT eeeett<br>PA: Tiglclal ileTERE P oeFAN'<br>lajseats as saeaad ageHs se| TH|<br>eae We UBUE! saaalne Eee 5<br>painaHeraen Sere eee || lll H<br>A ded Be fH ie 53 aac:<br>H| Ny sea’ i Eigelee eleeeal | a<br>Vyea | BESNF] | re la<br><!-- End of picture text -->



<!-- Start of picture text -->
pn ee Ga, ae<br>fot ie: i — ta Bald<br>; : 3 oa<br>3 Mee = —— A ee<br>i = wal a es ys ¥ ty...<br>a er Fas i] 7 =<br>af | ta & f<br>Bey om awe eee<br>a) pe) . |<br>py Pg? 2 = ee a<br>am 1 mo<br><!-- End of picture text -->









<!-- Start of picture text -->
beeen<br>a ‘ ra 14<br>Rae int<br>= V S hd ee<br>sf: 4 st a ™<br>[= od<br><!-- End of picture text -->



<!-- Start of picture text -->
Gs mt ; _<br>05 _— & gy A<br>. = ey<br>, [stem<br>yy = =<br>\<br><!-- End of picture text -->







<!-- Start of picture text -->
ey ps ae a<br>N | eslsaPenN ~ BeSee pe® 4<br>aa<br>tS; Se oe *<br><!-- End of picture text -->

