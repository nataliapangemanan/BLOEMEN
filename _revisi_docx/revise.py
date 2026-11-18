import sys, os, shutil, re, struct, copy
sys.path.insert(0, '/tmp/lap')
from lib import *

SRC = '/tmp/lap/x'; OUT = '/tmp/lap/y'
shutil.rmtree(OUT, ignore_errors=True); shutil.copytree(SRC, OUT)
DIAG = '/workspaces/default/code/docs/diagrams'
docp = OUT + '/word/document.xml'
tree = etree.parse(docp); root = tree.getroot(); body = root.find(W+'body')
rels_p = OUT + '/word/_rels/document.xml.rels'; rels = etree.parse(rels_p); rroot = rels.getroot()
log = []
RN = '{%s}' % NS['r']

def paras(): return [e for e in body if e.tag == W+'p']
def P(start, contains=False, after_el=None):
    seen = after_el is None
    for e in body:
        if e.tag != W+'p': continue
        if not seen:
            if e is after_el: seen = True
            continue
        t = ptext(e).strip()
        if (contains and start in t) or (not contains and t.startswith(start)): return e
    raise KeyError(start)
def T(caption_start):
    cap = P(caption_start)
    e = cap.getnext()
    while e is not None and e.tag != W+'tbl': e = e.getnext()
    return e
def R(el, old, new, need=True):
    n = replace(el, old, new)
    if need and n == 0: log.append('MISS: ' + old[:70])
    return n

def png_size(path):
    with open(path, 'rb') as f: d = f.read(24)
    return struct.unpack('>II', d[16:24])

EMU = 360000  # per cm
def set_extent(par, width_cm, w, h):
    cx = int(width_cm * EMU); cy = int(cx * h / w)
    for ex in par.iter(WP+'extent'): ex.set('cx', str(cx)); ex.set('cy', str(cy))
    for ex in par.iter(A+'ext'):
        if ex.getparent().tag == A+'xfrm': ex.set('cx', str(cx)); ex.set('cy', str(cy))

def replace_image(par, png, width_cm=13.8):
    blip = next(par.iter(A+'blip')); rid = blip.get(RN+'embed')
    target = [r for r in rroot if r.get('Id') == rid][0].get('Target')
    dst = OUT + '/word/' + target
    if not dst.endswith('.png'):
        newt = re.sub(r'\.\w+$', '.png', target); [r for r in rroot if r.get('Id') == rid][0].set('Target', newt)
        os.remove(dst); dst = OUT + '/word/' + newt
    shutil.copy(png, dst)
    w, h = png_size(png); set_extent(par, width_cm, w, h)

_docpr = [9000]; _rid = [900]
def new_image_par(tpl_par, png, width_cm=13.8):
    p = clone(tpl_par)
    _rid[0] += 1; rid = f'rIdRev{_rid[0]}'; name = f'media/rev_{_rid[0]}.png'
    shutil.copy(png, OUT + '/word/' + name)
    etree.SubElement(rroot, '{http://schemas.openxmlformats.org/package/2006/relationships}Relationship',
                     Id=rid, Type='http://schemas.openxmlformats.org/officeDocument/2006/relationships/image', Target=name)
    next(p.iter(A+'blip')).set(RN+'embed', rid)
    for d in p.iter(WP+'docPr'): _docpr[0] += 1; d.set('id', str(_docpr[0])); d.set('name', f'Picture {_docpr[0]}')
    w, h = png_size(png); set_extent(p, width_cm, w, h)
    return p

# ---------- templates ----------
TPL_BODY = P('Dalam siklus pengembangan perangkat lunak')
TPL_BULLET = P('• Pengguna (User):')
TPL_H3 = P('3.6.3 Daftar Kebutuhan Non-Fungsional')
TPL_CAPG = P('Gambar 3.6 ')
TPL_IMG = TPL_CAPG.getprevious()
TPL_LABEL = P('a. Antarmuka Sisi Pembeli')
def body_par(t): return clone(TPL_BODY, t)
def bullet(t): return clone(TPL_BULLET, '• ' + t)
def label_par(t): return clone(TPL_LABEL, t)
def caption(num, title):
    c = clone(TPL_CAPG)
    runs = [r for r in c.iter(W+'r') if r.find(W+'t') is not None]
    runs[0].find(W+'t').text = f'Gambar {num} '; runs[1].find(W+'t').text = title
    for r in runs[2:]: r.getparent().remove(r)
    return c
def placeholder(t):
    p = clone(TPL_BODY, t)
    ppr = p.find(W+'pPr')
    for x in ppr.findall(W+'ind'): ppr.remove(x)
    jc = ppr.find(W+'jc'); jc.set(W+'val', 'center')
    shd = etree.SubElement(ppr, W+'shd'); shd.set(W+'val', 'clear'); shd.set(W+'color', 'auto'); shd.set(W+'fill', 'EDEDED')
    r = next(p.iter(W+'r')); rpr = r.find(W+'rPr')
    if rpr is None: rpr = etree.SubElement(r, W+'rPr'); r.insert(0, rpr)
    etree.SubElement(rpr, W+'i'); col = etree.SubElement(rpr, W+'color'); col.set(W+'val', '666666')
    return p

# =====================================================================
# 8. REFERENSI LANDASAN TEORI (2.2.4, 2.2.8, 2.2.9, 2.2.10, 2.2.11)
# =====================================================================
p = P('Wikimedia Commons merupakan repositori media bebas')
R(p, 'sehingga dapat digunakan kembali dengan tetap mencantumkan atribusi sesuai lisensinya.',
     'sehingga dapat digunakan kembali dengan tetap mencantumkan atribusi sesuai lisensinya (Kelly, 2019).')
R(p, 'mengembalikan data dalam format JSON.', 'mengembalikan data dalam format JSON; pola komunikasi RESTful API seperti ini memungkinkan klien mengambil data dari server melalui permintaan HTTP standar tanpa bergantung pada platform tertentu (Wijaya et al., 2025).')
p2 = P('Dalam aplikasi Bloemen, Wikimedia Commons API dimanfaatkan')
after(p2, body_par('Selain memilih gambar dari galeri, pembeli juga dapat mengunggah foto referensi miliknya sendiri. Foto disimpan pada Supabase Storage dan datanya dicatat pada tabel design_references, sehingga dapat dipakai ulang melalui bagian "Referensi Saya". Referensi dikirim ke toko tujuan dalam bentuk kartu referensi berisi foto, judul, catatan, dan perkiraan budget, dan daftar toko tujuan hanya menampilkan toko yang menyediakan kategori yang sesuai dengan referensi tersebut.'))

p = P('React.js merupakan pustaka JavaScript yang dikembangkan oleh Meta')
R(p, 'bersifat dinamis dan interaktif.', 'bersifat dinamis dan interaktif (Setiawan et al., 2024).')
R(p, 'serta kemampuannya dalam membangun aplikasi yang responsif dan mudah dikembangkan.', 'serta kemampuannya dalam membangun aplikasi yang responsif dan mudah dikembangkan (Dermawan et al., 2024).')
p = P('Dalam pengembangan aplikasi Bloemen, React digunakan sebagai teknologi utama')
R(p, 'dikembangkan menggunakan React.Penggunaan React', 'dikembangkan menggunakan React. Penggunaan React')
R(p, 'komponen produk, komponen keranjang, komponen pesanan, dan komponen autentikasi', 'komponen produk, komponen chat, komponen pesanan, dan komponen autentikasi')
R(p, 'tanpa memengaruhi keseluruhan sistem.', 'tanpa memengaruhi keseluruhan sistem. Hal ini sejalan dengan penelitian Dermawan et al. (2024) yang memadukan ReactJS dengan metode Rapid Application Development untuk mempercepat pengembangan antarmuka secara bertahap.')

p = P('Tailwind CSS merupakan utility-first CSS framework')
R(p, 'cepat, konsisten, dan responsif.', 'cepat, konsisten, dan responsif (Azhariyah & Mukhlis, 2024).')
R(p, 'menjaga konsistensi desain.Dalam pengembangan', 'menjaga konsistensi desain. Dalam pengembangan')
R(p, 'halaman detail produk, keranjang belanja, serta halaman pemesanan', 'halaman detail produk, chat, serta halaman pemesanan')
p = P('Penggunaan Tailwind CSS memungkinkan pengembang')
R(p, 'tanpa perlu menulis stylesheet yang kompleks.', 'tanpa perlu menulis stylesheet yang kompleks (Rifandi et al., 2022).')
p = P('Selain itu, Tailwind CSS mendukung pengembangan antarmuka yang responsif')
R(p, 'resolusi layar berbeda.', 'resolusi layar berbeda. Penelitian Deo Eka Putra et al. (2025) juga menunjukkan bahwa Tailwind CSS menghasilkan ukuran berkas CSS yang lebih kecil dan kustomisasi tampilan yang lebih fleksibel dibandingkan framework CSS berbasis komponen.')

p = P('Android Studio adalah Integrated Development Environment (IDE) resmi dari Google')
R(p, 'pada perangkat fisik maupun virtual.', 'pada perangkat fisik maupun virtual (Setiawan et al., 2020).')
R(p, 'menguji, dan membuild aplikasi Android', 'menguji, dan melakukan build aplikasi Android')
R(p, 'serta alat pengujian seperti logcat dan black box testing', 'serta alat pemantauan seperti Logcat yang membantu pengujian black-box')

p = P('Supabase adalah platform Backend as a Service (BaaS) open-source')
R(p, 'serta API real-time.', 'serta API real-time (Ghani Adhipramana et al., 2026).')
R(p, 'proyek-proyek berskala kecil hingga menengah.', 'proyek-proyek berskala kecil hingga menengah (Azizah et al., 2025).')
p = P('Dalam proyek aplikasi Bloemen, Supabase berperan sebagai backend utama')
R(p, 'yang ditampilkan pada antarmuka aplikasi.', 'yang ditampilkan pada antarmuka aplikasi serta foto referensi desain yang diunggah pembeli. Fitur Realtime Supabase dimanfaatkan untuk chat, kartu penawaran, dan notifikasi yang tampil tanpa memuat ulang halaman.')

# Daftar Pustaka — sisipkan sesuai urutan abjad (DOI diverifikasi via Crossref)
DP = {
 'Azhariyah': 'Azhariyah, S., & Mukhlis, M. (2024). Framework CSS: Tailwind CSS untuk Front-End Website Store PT. XYZ. Jurnal Informatika, 3(1), 30–36. https://doi.org/10.57094/ji.v3i1.1601',
 'Azizah': 'Azizah, I., Ananta, M. R. A. B., Ma’ruf, A. U. L., Romdoni, L. F., Iqbal, M., & Pramono, S. (2025). Rancang Bangun Website Ngompas untuk Manajemen Kepatuhan Minum Obat Berbasis Backend Terpusat dan Supabase Menggunakan Metode Agile. JATI (Jurnal Mahasiswa Teknik Informatika), 9(6), 10190–10198. https://doi.org/10.36040/jati.v9i6.16372',
 'Deo': 'Deo Eka Putra, R., Lestari, A., & Kristianti, N. (2025). Analisis Perbandingan CSS Framework Tailwind CSS dan Bootstrap dalam Pengembangan Landing Page Website POS Digitaliz. Journal of Information Technology and Computer Science, 5(1), 63–75. https://doi.org/10.47111/jointecoms.v5i1.19807',
 'Dermawan': 'Dermawan, M. D., Suroyo, H., Wijaya, A., & Jemakmun. (2024). Pengembangan Web Admin Aplikasi Pulsa dengan ReactJS Menggunakan Metode Rapid Application Development. Jurnal Teknologi dan Sistem Informasi Bisnis, 6(2), 300–309. https://doi.org/10.47233/jteksis.v6i2.1337',
 'Ghani': 'Ghani Adhipramana, B., Nursanto, G. A., & Trinata, C. (2026). Perancangan Sistem Informasi Pelaporan Event Internasional Berbasis Website pada Kantor Imigrasi Kelas I TPI Yogyakarta Menggunakan Metode Prototyping dan Supabase sebagai Backend as a Service. JATI (Jurnal Mahasiswa Teknik Informatika), 10(5), 9097–9103. https://doi.org/10.36040/jati.v10i5.19184',
 'Kelly': 'Kelly, E. J. (2019). Reuse of Wikimedia Commons Cultural Heritage Images on the Wider Web. Evidence Based Library and Information Practice, 14(3), 28–51. https://doi.org/10.18438/eblip29575',
 'Rifandi': 'Rifandi, F., Adriansyah, T. V., & Kurniawati, R. (2022). Website Gallery Development Using Tailwind CSS Framework. Jurnal E-Komtek (Elektro-Komputer-Teknik), 6(2), 205–214. https://doi.org/10.37339/e-komtek.v6i2.937',
 'Setiawan2020': 'Setiawan, Y. P., Pranoto, Y. A., & Santi W., F. (2020). Rancang Bangun Aplikasi Media Pembelajaran Bahasa Korea Sederhana Menggunakan Android Studio. JATI (Jurnal Mahasiswa Teknik Informatika), 4(2), 298–305. https://doi.org/10.36040/jati.v4i2.2660',
 'Setiawan2024': 'Setiawan, L. O. M. I., Gunawan, & Tenriawaru, A. (2024). Rancang Bangun Sistem Informasi Monitoring Bimbingan Tugas Akhir Berbasis Web Menggunakan Framework ReactJS. AnoaTIK: Jurnal Teknologi Informasi dan Komputer, 2(1), 39–50. https://doi.org/10.33772/anoatik.v2i1.25',
 'Wijaya': 'Wijaya, A., Yahya, A., Alam, R. G. G., Imanullah, M., & Gunawan. (2025). Pengembangan Aplikasi Backend Web Service Berbasis RESTful API untuk Aplikasi DermaScan Menggunakan Node.js. Decode: Jurnal Pendidikan Teknologi Informasi, 5(3), 826–838. https://doi.org/10.51454/decode.v5i3.1196',
}
dp_head = P('DAFTAR PUSTAKA')
entries = []
e = dp_head.getnext()
while e is not None and e.tag == W+'p' and ptext(e).strip():
    entries.append(e); e = e.getnext()
tpl_dp = entries[0]
def sortkey(s): return re.sub(r'[^a-z]', '', s.lower())
for k, txt in DP.items():
    node = clone(tpl_dp, txt)
    ins = None
    for en in entries:
        if sortkey(ptext(en)) > sortkey(txt): ins = en; break
    if ins is None: entries[-1].addnext(node)
    else: ins.addprevious(node)
    entries = []
    e = dp_head.getnext()
    while e is not None and e.tag == W+'p' and ptext(e).strip():
        entries.append(e); e = e.getnext()

# =====================================================================
# BAB III
# =====================================================================
# --- Tabel 3.5: kolom Kebutuhan & Aktor tertukar/terpotong; FR-15 diperluas
tb = T('Tabel 3.5 Daftar Kebutuhan Fungsional Sistem')
for tr in tb.findall(W+'tr')[1:]:
    c = row_cells(tr)
    req = ptext(c[2]).strip(); act = ptext(c[3]).strip()
    m = re.search(r'\s*((?:Pembeli|Penjual|Sistem),?)\s*$', req)
    if m:
        req = req[:m.start()].strip()
        act = (m.group(1) + (' ' + act if act else '')).strip()
    if ptext(c[1]).strip() == 'FR-15':
        req = 'Pembeli dapat mengakses referensi desain bunga (Wikimedia Commons dan foto produk toko), mengunggah foto referensi sendiri, serta mengirimkannya ke toko tujuan yang menyediakan kategori sesuai referensi'
    cell_set(c[2], req); cell_set(c[3], act)

# --- Tabel 3.4: + design_references
R(P('Berdasarkan model konseptual, logical model aplikasi Bloemen mendefinisikan'), '10 entitas', '11 entitas')
tb = T('Tabel 3.4 Logical Model')
rows = tb.findall(W+'tr')
for tr in rows:
    if ptext(row_cells(tr)[1]).strip() == 'messages':
        cell_set(row_cells(tr)[2], 'id (PK), conversation_id (FK), sender_id, receiver_id, is_read, image_url, message_type, metadata')
nr = clone(rows[-1]); row_set(nr, ['11', 'design_references', 'id (PK), user_id (FK→users), image_url, title, description, source', 'Banyak design_references → 1 user; referensi dikirim ke chat sebagai kartu referensi'])
rows[-1].addnext(nr)
R(P('• Penawaran Kustom (Custom Quote):'), 'untuk pesanan di luar katalog standar.', 'untuk pesanan di luar katalog standar.')
after(P('• Penawaran Kustom (Custom Quote):'), bullet('Referensi Desain (Design Reference): Foto inspirasi yang dipilih dari galeri atau diunggah sendiri oleh Pembeli, lalu dikirim ke Toko tujuan sebagai dasar Penawaran Kustom.'))

# --- ERD & Arsitektur diperbarui (tabel design_references)
replace_image(P('Gambar 3.3 Entity Relationship Diagram').getprevious(), f'{DIAG}/g3_3_erd_v2.png')
replace_image(P('Gambar 3.4 Diagram Arsitektur Sistem').getprevious(), f'{DIAG}/g3_4_arsitektur_v2.png')
R(P('3. Lapisan Backend (Supabase BaaS):'), 'Storage (bucket penyimpanan gambar produk dan toko)', 'Storage (bucket penyimpanan gambar produk, toko, dan foto referensi desain unggahan pembeli)')

# --- UC-09
tb = T('Tabel 3.15 Deskripsi Use Case UC-09')
for tr in tb.findall(W+'tr'):
    c = row_cells(tr); k = ptext(c[0]).strip()
    if k == 'Deskripsi':
        cell_set(c[1], 'Pengguna dapat menelusuri galeri gambar referensi desain bunga yang diambil dari Wikimedia Commons API dan produk toko yang terdaftar di aplikasi, berdasarkan kata kunci dan kategori. Pembeli juga dapat mengunggah foto referensi sendiri (disimpan di bagian "Referensi Saya"), kemudian mengirim referensi beserta judul, catatan, dan budget ke toko tujuan yang menyediakan kategori sesuai referensi.')
    if k == 'Alur Utama':
        R(c[1], 'daftar toko bunga, ', 'baris pilihan kategori, bagian "Referensi Saya", ', need=False)
    if k == 'Pasca-kondisi':
        cell_set(c[1], 'Referensi tampil sebagai kartu referensi di ruang chat toko tujuan dan tersimpan pada data percakapan; foto unggahan tersimpan di tabel design_references. Penjual dapat langsung membuat penawaran harga dari kartu tersebut, dan jika pembeli melanjutkan ke pre-order, referensi desain ikut tersimpan pada pesanan.')

# --- 3.6.4 Analisis Proses Bisnis (baru) — disisipkan sebelum 3.7
h37 = P('3.7 Perancangan Use Case')
anchor = h37.getprevious()
h = clone(TPL_H3, '3.6.4 Analisis Proses Bisnis')
blk = [h,
  body_par('Analisis proses bisnis dilakukan untuk memahami alur kerja jual-beli produk bunga yang berjalan saat ini (as-is) berdasarkan hasil observasi dan wawancara, kemudian merumuskan alur kerja usulan (to-be) setelah aplikasi Bloemen digunakan. Perbandingan keduanya menjadi dasar penentuan kebutuhan fungsional pada Tabel 3.5.'),
  label_par('a. Proses Bisnis yang Berjalan'),
  body_par('Proses bisnis yang berjalan pada toko bunga di Kota Manado ditunjukkan pada Gambar 3.N1. Pembeli mencari toko dan inspirasi model melalui media sosial, lalu menghubungi toko lewat WhatsApp atau pesan langsung. Penjual membalas satu per satu, menjelaskan model dan harga, mencatat pesanan secara manual setelah pembayaran diterima, merangkai bunga, mengabari pembeli, dan merekap penjualan secara manual di akhir periode.'),
  new_image_par(TPL_IMG, f'{DIAG}/g3_bp_asis.png', 13.2), caption('3.N1', 'Proses Bisnis yang Berjalan (As-Is)'),
  body_par('Dari alur tersebut teridentifikasi tiga permasalahan utama, yaitu (1) pesan dan pesanan tersebar di beberapa aplikasi sehingga rawan terlewat, (2) pembeli tidak dapat memantau status pesanan tanpa bertanya, dan (3) pencatatan serta rekap penjualan dilakukan manual sehingga memakan waktu dan rawan salah.'),
  label_par('b. Proses Bisnis yang Diusulkan'),
  body_par('Proses bisnis usulan dengan aplikasi Bloemen ditunjukkan pada Gambar 3.N2. Setiap langkah diberi nomor sesuai urutan pelaksanaannya. Pembeli dapat langsung memesan produk dari katalog (jalur "ya"), atau, jika menginginkan desain khusus, mengunggah/memilih referensi dan mengirimkannya ke toko (jalur "tidak"). Penjual membalas dengan kartu penawaran harga di dalam chat; setelah penawaran diterima, pembeli mengisi formulir pre-order. Sistem menyimpan pesanan dengan nomor unik, mengirim notifikasi real-time kepada penjual dan pembeli pada setiap perubahan status, memperbarui rating toko setelah ulasan, serta menyusun rekap penjualan yang dapat diunduh dalam format Excel.'),
  new_image_par(TPL_IMG, f'{DIAG}/g3_bp_tobe.png', 14.0), caption('3.N2', 'Proses Bisnis yang Diusulkan (To-Be) dengan Aplikasi Bloemen'),
  body_par('Dengan proses usulan tersebut, ketiga permasalahan pada proses berjalan terjawab: komunikasi, referensi, dan penawaran terpusat dalam satu ruang chat per toko; status pesanan dapat dipantau melalui riwayat pesanan dan notifikasi; serta pencatatan dan rekap penjualan dilakukan otomatis oleh sistem.'),
]
after(anchor, *blk)

# --- 3.8 Activity diagram: gambar diperjelas + narasi langkah bernomor
R(P('Activity diagram menggambarkan alur aktivitas'), 'Activity diagram menggambarkan alur aktivitas yang terjadi dalam use case tertentu, termasuk decision points dan alur paralel yang mungkin terjadi.',
  'Activity diagram menggambarkan alur aktivitas yang terjadi dalam use case tertentu. Setiap diagram dibagi ke dalam swimlane sesuai pelaku (Pengguna/Pembeli, Sistem, dan Penjual), setiap aktivitas diberi nomor sesuai urutan, dan setiap titik keputusan (belah ketupat) diberi label "ya"/"tidak" agar alur maju maupun alur kembali (perulangan) dapat dibaca dengan jelas. Alur dimulai dari simbol lingkaran hitam dan berakhir pada simbol lingkaran bergaris tepi.')
ACT = [
 ('Gambar 3.6 ', 'g3_6_act_registrasi_v2.png', 'Gambar 3.6 menunjukkan alur registrasi akun. Pengguna memilih menu "Daftar" (1), sistem menampilkan form (2), lalu pengguna memilih peran dan mengisi data (3). Sistem memvalidasi data (4); jika tidak valid, pengguna melihat pesan kesalahan dan kembali ke langkah 3 (5). Jika valid, sistem membuat akun dan menyimpan profil (6), lalu memeriksa peran. Penjual diarahkan untuk mengisi registrasi toko (7) yang disimpan ke tabel shops (8), sedangkan pembeli langsung diteruskan ke langkah 9, yaitu pengarahan ke halaman sesuai peran.'),
 ('Gambar 3.7 ', 'g3_7_act_preorder_v2.png', 'Gambar 3.7 menunjukkan alur pemesanan pre-order. Pembeli memilih produk dan ukuran (1), menekan "Pre-Order Sekarang" (2), lalu sistem menampilkan formulir (3). Pembeli mengisi jumlah, metode ambil sendiri/kirim, tanggal dan jam, alamat, serta catatan (4). Sistem memvalidasi tanggal dan isian wajib (5); jika tidak valid, pembeli memperbaiki isian dan kembali ke langkah 4 (6). Jika valid, pesanan disimpan beserta nomor unik (7), notifikasi dibuat (8) dan diterima penjual (9). Pembeli memilih metode pembayaran dan melihat pesanan berstatus pending (10), sedangkan penjual meninjau pesanan pada halaman Manajemen Pesanan (11).'),
 ('Gambar 3.8 ', 'g3_8_act_chat_v2.png', 'Gambar 3.8 menunjukkan alur chat real-time yang juga memuat pengiriman referensi dan penawaran harga. Pembeli menekan "Chat Toko" (1), sistem mencari atau membuat percakapan (2) dan membuka ruang chat langsung pada pesan terbaru (3). Pembeli menulis pesan atau mengirim referensi desain berupa foto, judul, catatan, dan budget (4); sistem menyimpannya sebagai pesan teks atau kartu referensi dan menyiarkannya melalui Supabase Realtime (5) sehingga diterima penjual seketika (6). Jika pembeli membutuhkan harga khusus, penjual mengirim kartu penawaran (7); jika tidak, penjual cukup membalas teks. Balasan atau kartu penawaran ditampilkan berurutan waktu di sela chat (8). Bila pembeli menerima penawaran, kartu "Deal" muncul beserta tombol "Pesan Sekarang" (9); bila tidak, percakapan berlanjut ke langkah 4 untuk negosiasi.'),
 ('Gambar 3.9 ', 'g3_9_act_status_v2.png', 'Gambar 3.9 menunjukkan alur manajemen status pesanan oleh penjual. Penjual membuka pesanan (1) dan sistem menampilkan detailnya (2). Jika pesanan ditolak, status diubah menjadi cancelled (3) dan pembeli tetap menerima notifikasi melalui langkah 7. Jika diterima, penjual mengonfirmasi pesanan dan pembayaran (4), lalu memilih status berikutnya (5) yang disimpan sistem (6). Setiap perubahan status menghasilkan notifikasi (7) yang diterima pembeli (8). Langkah 5–8 diulang hingga status delivered; setelah itu pembeli dapat memberi ulasan (9) dan rating toko diperbarui otomatis (10).'),
]
for capstart, png, narr in ACT:
    cap = P(capstart)
    replace_image(cap.getprevious(), f'{DIAG}/{png}', 13.8)
    after(cap, body_par(narr))

# =====================================================================
# BAB IV — 4.3 Iterasi 1: wireframe disesuaikan dengan Tabel 4.1
# =====================================================================
p = P('Wireframe dirancang untuk 17 halaman utama aplikasi')
after(p, body_par('Empat wireframe yang menjadi fokus evaluasi iterasi pertama disajikan pada Gambar 4.1 sampai Gambar 4.4. Gambar tersebut menggambarkan rancangan v01.0 sebelum diperbaiki. Bagian yang mendapat temuan dari responden diberi penanda bernomor merah (1 sampai 5) yang sama dengan nomor temuan pada Tabel 4.1, sedangkan hasil perbaikannya ditunjukkan oleh tangkapan layar aplikasi yang dirujuk pada kolom Bukti Implementasi. Pada v01.0, navigasi bawah pembeli terdiri atas tab Beranda, Toko, Pesanan, Chat, dan Profil, karena tab Referensi baru ditambahkan pada iterasi ketiga. Sidebar penjual v01.0 (Gambar 4.4) juga belum memuat menu Dashboard dan Rekap Penjualan, karena kedua fitur tersebut merupakan hasil evaluasi iterasi kedua (Tabel 4.3); pada iterasi ini sidebar penjual tidak mendapat temuan perubahan.'))
for num, png, wcm in (('4.1', 'g4_1.png', 8.0), ('4.2', 'g4_2.png', 11.5), ('4.3', 'g4_3.png', 14.5), ('4.4', 'g4_4.png', 9.0)):
    cap = P(f'Gambar {num} Wireframe')
    replace_image(cap.getprevious(), f'{DIAG}/{png}', wcm)
    runs = [r for r in cap.iter(W+'r') if r.find(W+'t') is not None]
    runs[-1].find(W+'t').text = runs[-1].find(W+'t').text.rstrip() + ' (v01.0)'
R(P('Setelah wireframe selesai, penulis melakukan sesi evaluasi dengan 2 responden'), 'pendapat yang muncul..', 'pendapat yang muncul.')

tb = T('Tabel 4.1 Hasil Evaluasi dan Tabel Perubahan Prototipe v01.0')
grid = tb.find(W+'tblGrid'); cols = grid.findall(W+'gridCol')
total = sum(int(c.get(W+'w')) for c in cols)
newcol = copy.deepcopy(cols[3]); cols[3].addnext(newcol)
fr = [0.06, 0.27, 0.29, 0.14, 0.14, 0.10]
for c, f in zip(grid.findall(W+'gridCol'), fr): c.set(W+'w', str(int(total * f)))
T41 = [
 ['No', 'Temuan Responden (Acuan Wireframe)', 'Perubahan yang Dilakukan', 'Halaman Terdampak', 'Bukti Implementasi', 'Status'],
 ['1', 'Kategori pada beranda hanya berupa ikon tanpa teks sehingga tidak jelas bahwa ikon tersebut membuka filter produk (Gambar 4.1, penanda 1)', 'Setiap kategori ditampilkan sebagai kartu persegi berisi ikon besar dan label teks di bawahnya, dilengkapi tautan "Lihat Semua"', 'Home.tsx, Categories.tsx', 'Gambar 4.13', '✓'],
 ['2', 'Tombol "Pre-Order" dan "Chat Penjual" berdampingan tanpa jarak dengan ukuran sama sehingga mudah salah tekan (Gambar 4.3 bagian 2, penanda 2)', 'Kedua tombol dipindahkan ke bar bawah yang tetap (sticky): Chat menjadi tombol ikon ber-outline di sisi kiri, Pre-Order Sekarang menjadi tombol lebar berwarna di sisi kanan dengan jarak antartombol', 'ProductDetail.tsx', 'Gambar 4.14', '✓'],
 ['3', 'Form registrasi toko memuat seluruh isian dalam satu halaman panjang sehingga terasa melelahkan (Gambar 4.2 bagian 2, penanda 3)', 'Form dibagi menjadi dua bagian berurutan: (1) Info Dasar dan Pilihan Kategori, (2) Lokasi Peta dan Jam Operasional', 'ShopRegister.tsx', 'Gambar 4.10 dan Gambar 4.11', '✓'],
 ['4', 'Kartu toko tidak menampilkan apakah toko sedang buka atau tutup (Gambar 4.1, penanda 4)', 'Ditambahkan badge hijau "Buka" atau merah "Tutup" yang dihitung otomatis dari jam operasional toko pada kartu Daftar Toko dan halaman Detail Toko', 'Shops.tsx, ShopDetail.tsx', 'Gambar 4.34', '✓'],
 ['5', 'Halaman detail toko hanya menampilkan alamat dalam bentuk teks sehingga lokasi toko sulit dibayangkan (Gambar 4.3 bagian 1, penanda 5)', 'Ditambahkan peta lokasi toko dan tombol "Lihat Peta & Rute" yang membuka halaman peta penuh beserta jarak dari posisi pembeli', 'ShopDetail.tsx, ShopMap.tsx', 'Gambar 4.35', '✓'],
]
for tr, vals in zip(tb.findall(W+'tr'), T41):
    tcs = row_cells(tr); nc = strip_ids(copy.deepcopy(tcs[3])); tcs[3].addnext(nc)
    for tc, f in zip(row_cells(tr), fr):
        w = tc.find(f'{W}tcPr/{W}tcW')
        if w is not None: w.set(W+'w', str(int(total * f))); w.set(W+'type', 'dxa')
    row_set(tr, vals)
R(P('Berdasarkan hasil evaluasi v01.0, penulis mencatat lima poin perubahan'), 'Seluruh perubahan ini diintegrasikan ke dalam desain akhir yang kemudian menjadi acuan pembangunan prototipe v02.0.',
  'Setiap poin dapat ditelusuri mulai dari penanda pada wireframe (Gambar 4.1 sampai Gambar 4.3) hingga tangkapan layar hasil implementasinya pada kolom Bukti Implementasi, dan seluruh perubahan ini menjadi acuan pembangunan prototipe v02.0.')

# 4.4.3 bottom navigation v02.0 vs final
R(P('Komponen BottomNavigation.tsx dibuat sebagai navigasi utama'), 'dengan 5 tab: Beranda, Toko, Referensi, Chat, dan Profil.',
  'dengan 5 tab. Pada prototipe v02.0 kelima tab tersebut adalah Beranda, Toko, Pesanan, Chat, dan Profil. Pada iterasi ketiga (v03.0) tab Pesanan digantikan oleh tab Referensi seiring ditambahkannya fitur Referensi Desain, sedangkan riwayat pesanan dipindahkan ke ikon tas belanja pada header Beranda. Gambar 4.6 menampilkan bottom navigation pada versi final.')
# 4.4.8 sesuaikan dengan Tabel 4.1 (kategori berlabel, bar tombol)
p = P('Halaman Home.tsx dibangun dengan tata letak yang mengikuti wireframe')
R(p, 'chip kategori tersusun dalam baris horizontal yang dapat di-scroll.', 'kategori ditampilkan sebagai kartu persegi berisi ikon dan label teks (perbaikan temuan nomor 1 pada Tabel 4.1).')
R(P('Halaman ProductDetail.tsx dibangun sebagai halaman pembelian lengkap'), "Di bagian bawah terdapat dua tombol aksi besar: 'Pre-Order' dan 'Chat dengan Penjual'.",
  "Di bagian bawah terdapat bar tombol tetap (sticky) berisi tombol ikon Chat ber-outline di sisi kiri dan tombol lebar 'Pre-Order Sekarang'/'Beli Sekarang' di sisi kanan (perbaikan temuan nomor 2 pada Tabel 4.1). Untuk produk bunga hidup ditampilkan pula panduan daya tahan dan cara penyimpanan bunga.")
R(P('Halaman Shops.tsx menampilkan daftar lengkap toko aktif'), 'dan indikator Buka/Tutup berdasarkan jam saat ini.', 'dan indikator Buka/Tutup berdasarkan jam operasional saat ini (perbaikan temuan nomor 4 pada Tabel 4.1). Daftar toko diurutkan dari yang terdekat dengan posisi pembeli dan dapat dicari berdasarkan nama, alamat, atau kota.')
R(P('Komponen InteractiveMap.tsx dan ReadOnlyMap.tsx dibangun'), 'untuk pembeli yang ingin melihat lokasi toko.', 'untuk pembeli yang ingin melihat lokasi toko; pada halaman ShopDetail tersedia tombol "Lihat Peta & Rute" menuju halaman ShopMap (perbaikan temuan nomor 5 pada Tabel 4.1).')

# =====================================================================
# 6. TABEL 4.2 — diperiksa dan disesuaikan dengan kode/patch sebenarnya
# =====================================================================
tb = T('Tabel 4.2 Daftar Error dan Penyelesaian pada Iterasi v02.0')
T42 = [
 ['No', 'Error / Kode', 'Penyebab', 'Dampak', 'Solusi'],
 ['1', 'RLS 42501 (insert profil)', 'Policy RLS tabel users belum mengizinkan INSERT oleh pengguna yang baru mendaftar', 'Registrasi akun gagal karena profil tidak tersimpan ke tabel users', 'Menambahkan policy "Users can insert own profile" (WITH CHECK auth.uid() = id) pada berkas 002_rls_policies.sql'],
 ['2', 'TypeScript TS2339', "Interface Product belum memiliki properti 'sizes' setelah kolom JSONB sizes ditambahkan", "Kompilasi gagal: Property 'sizes' does not exist on type 'Product'", "Menambahkan properti sizes?: Record<string, number> | null pada interface Product di api.ts"],
 ['3', 'Nomor pesanan duplikat', 'Fungsi trigger generate_order_number menghitung nomor urut harian tanpa penguncian, sehingga dua transaksi bersamaan dapat membaca nilai maksimum yang sama', 'Dua pesanan pada waktu bersamaan mendapat nomor yang sama (ORD-YYYYMMDD-####) dan insert kedua gagal', 'Fungsi trigger ditulis ulang dengan pg_advisory_xact_lock sebelum menghitung nomor urut, sehingga pembuatan nomor berjalan bergiliran (berkas FIX_ORDER_NUMBER_DUPLICATE.sql)'],
 ['4', 'Realtime tidak menerima event', 'Tabel messages dan conversations belum terdaftar pada publication supabase_realtime', 'Pesan baru tidak muncul otomatis; halaman harus dimuat ulang', 'Menjalankan ALTER PUBLICATION supabase_realtime ADD TABLE untuk tabel messages, conversations, dan custom_order_quotes (berkas FIX_CHAT_RECEIVER.sql)'],
 ['5', 'Foto produk gagal ditampilkan', 'Bucket images sempat dihapus dan dibuat ulang saat pengujian sehingga berkas lama ikut terhapus, sementara URL lama masih tersimpan di database', 'Gambar produk menampilkan placeholder (broken image)', 'Bucket images tidak dibuat ulang setelah berisi data; foto diunggah ulang dan kolom image_url diperbarui. Komponen ImageWithFallback menampilkan gambar pengganti bila URL tidak valid'],
]
for tr, vals in zip(tb.findall(W+'tr'), T42): row_set(tr, vals)
R(P('Trigger khusus generate_order_number juga dibuat pada langkah ini'), 'format ORD-YYYYMMDD#### yang unik', 'format ORD-YYYYMMDD-#### yang unik')

# 4.4.12 — kalimat "jauh lebih banyak" tidak cocok (2 responden = sama dengan iterasi 1)
R(P('Setelah seluruh fitur inti berhasil dibangun dan error diselesaikan'), 'Sesi evaluasi dilakukan dengan 2 responden (1 calon penjual dan 1 calon pembeli), jauh lebih banyak dari iterasi pertama karena kini ada fungsionalitas nyata yang dapat dicoba.',
  'Sesi evaluasi dilakukan dengan 2 responden (1 calon penjual dan 1 calon pembeli) yang sama dengan iterasi pertama, sehingga perbandingan pengalaman sebelum dan sesudah tersedia fungsionalitas nyata dapat dilakukan secara langsung.')
R(P('Sesi evaluasi dilakukan dengan 2 responden (1 calon penjual dan 1 calon pembeli) yang sama', contains=True),
  'yang sama dengan iterasi pertama, sehingga perbandingan pengalaman sebelum dan sesudah tersedia fungsionalitas nyata dapat dilakukan secara langsung.',
  'yang mencoba langsung fungsionalitas nyata aplikasi pada perangkat Android.')

# =====================================================================
# 4.5 Iterasi 3 — sinkron dengan aplikasi final + fitur unggah referensi
# =====================================================================
p = P("Langkah 3 — Komponen CustomOrderQuote.tsx.")
set_text(p, "Langkah 3 — Komponen CustomOrderQuote.tsx. Dalam ruang chat, penjual menekan tombol 'Tawarkan' (atau 'Buat Penawaran' pada kartu referensi) yang membuka form berisi nama produk, deskripsi, dan harga. Kolom harga memakai input Rupiah berbasis teks dengan pemisah ribuan sehingga nilai seperti 150.000 tersimpan utuh sebagai 150000. Bila dibuka dari kartu referensi, form terisi otomatis dari judul, catatan, dan budget referensi, serta gambar referensi ikut terlampir. Penawaran yang terkirim muncul sebagai kartu khusus di sela-sela pesan dan diurutkan berdasarkan waktu, sehingga penawaran terbaru selalu berada di bagian bawah chat.")
p = P("Dari sisi pembeli, kartu penawaran menampilkan nama produk")
set_text(p, "Dari sisi pembeli, kartu penawaran menampilkan gambar referensi, nama produk, deskripsi, harga dalam format Rupiah, serta tombol 'Terima' dan 'Tolak' yang aktif selama status masih pending. Saat penawaran diterima, kartu 'Deal disepakati' langsung muncul di sela chat beserta tombol 'Pesan Sekarang', dan bar ringkas di atas kolom ketik tetap menampilkan deal tersebut agar pembeli tidak perlu menggulir. Penawaran yang ditolak ditampilkan memudar dengan label 'Ditolak'.")

p = P('Langkah 2 — Membangun halaman DesignReference.tsx.')
R(p, ', serta daftar Toko Bunga Terdekat.', ', serta baris pilihan kategori (Bouquet Bunga, Bunga Duka, Bunga Wedding, dan lainnya) dan bagian "Referensi Saya".')
R(P('Gambar 4.25 Halaman Referensi Desain pada Oppo A3X'), '(a) Pencarian dan Toko Bunga Terdekat', '(a) Pencarian dan Pilihan Kategori')
p = P('Langkah 5 — Mengirim referensi ke toko.')
R(p, 'Pembeli memilih toko tujuan, dan sistem', 'Dialog menampilkan kategori referensi yang ditentukan otomatis dari kategori produk, kategori yang sedang dipilih, atau kata kunci pencarian, dan daftar toko tujuan hanya memuat toko yang menyediakan kategori tersebut. Setelah pembeli memilih toko, sistem')
R(p, 'sebagai pesan kepada penjual.', 'sebagai kartu referensi di dalam chat penjual.')
# Gambar 4.26: ukuran gambar terlalu kecil (0,8 cm) → disamakan dengan tangkapan layar lain
cap = P('Gambar 4.26 Dialog Kirim Referensi Desain ke Toko')
e = cap.getprevious()
while e is not None and not list(e.iter(A+'blip')): e = e.getprevious()
for inl in e.iter(WP+'inline'):
    ex = inl.find(WP+'extent'); cx, cy = int(ex.get('cx')), int(ex.get('cy'))
    ncx = int(2.7 * EMU); ncy = int(ncx * cy / cx)
    ex.set('cx', str(ncx)); ex.set('cy', str(ncy))
    for x in inl.iter(A+'ext'):
        if x.getparent().tag == A+'xfrm': x.set('cx', str(ncx)); x.set('cy', str(ncy))
# Langkah 6 — fitur baru unggah referensi + 2 gambar (placeholder tangkapan layar)
cap427 = P('Gambar 4.27 Referensi Desain Terlampir')
after(cap427,
  body_par('Langkah 6 — Menambahkan fitur unggah referensi desain. Fitur ini dibangun karena pembeli sering sudah memiliki foto contoh sendiri. Basis data diperluas melalui berkas ADD_UPLOAD_REFERENCE.sql yang membuat tabel design_references (id, user_id, image_url, title, description, source, created_at) dengan Row Level Security sehingga setiap pembeli hanya dapat melihat dan menghapus referensinya sendiri, menambahkan kolom image_url, message_type, dan metadata pada tabel messages, serta mengatur policy unggah pada bucket images. Modul designReferences.ts menangani unggah berkas (maksimal 5 MB) ke folder references/{user_id} dan penyimpanan datanya.'),
  body_par('Pembeli dapat mengunggah referensi dari tiga tempat, yaitu bagian "Referensi Saya" pada halaman Referensi Desain, tombol "Kirim Referensi" pada halaman Detail Toko dan kartu Daftar Toko, serta tombol "Referensi" di samping kolom ketik pada ruang chat. Ketiganya memakai komponen SendReferenceToShop.tsx yang berisi pemilihan foto (baru atau dari Referensi Saya), judul, catatan, dan budget. Referensi yang dikirim tampil sebagai kartu referensi pada chat toko tujuan, dan penjual dapat langsung menekan "Buat Penawaran" sehingga form penawaran terisi otomatis. Tampilan fitur ini disajikan pada Gambar 4.U1 dan Gambar 4.U2.'),
  placeholder('[ TEMPAT TANGKAPAN LAYAR — tangkapan layar bagian "Referensi Saya" dan dialog Kirim Referensi Desain (foto, judul, catatan, budget) ]'),
  caption('4.U1', 'Bagian Referensi Saya dan Dialog Unggah Referensi Desain'),
  placeholder('[ TEMPAT TANGKAPAN LAYAR — tangkapan layar chat: kartu referensi dari pembeli, tombol "Buat Penawaran", dan kartu penawaran/Deal di sela chat ]'),
  caption('4.U2', 'Kartu Referensi dan Kartu Penawaran Harga di Sela Chat'),
)
R(P('Komponen SellerLayout.tsx dibangun sebagai layout pembungkus untuk seluruh halaman seller.'), 'Dashboard, Produk, Pesanan, Chat, Pengaturan Toko, Ulasan, dan Rekap Penjualan.', 'Dashboard, Produk, Pesanan, Rekap Penjualan, Chat, dan Pengaturan Toko. Halaman Ulasan dapat dibuka melalui kartu Rating Toko pada dashboard.')

# Tabel 4.5 — typo + galat yang ditemukan pada penyempurnaan akhir
tb = T('Tabel 4.5 Daftar Error dan Penyelesaian pada Iterasi v03.0')
R(tb, 'terpotong di cena kanan', 'terpotong di sisi kanan'); R(tb, 'tanpa cenari pesan', 'tanpa riwayat pesan')
R(tb, 'Patch terdokumentasi di file FIXED_CHAT_SELLER.md', 'Rute chat penjual /seller/chat/:shopId dan /chat/:shopId/:conversationId membaca conversationId dari useParams')
rows = tb.findall(W+'tr'); last = rows[-1]
NEW45 = [
 ['6', 'Harga penawaran tersimpan tanpa tiga angka terakhir', 'Kolom harga memakai input type="number"; teks "150.000" dibaca sebagai 150 karena titik dianggap pemisah desimal', 'Penawaran Rp150.000 tercatat Rp150 di database dan di kartu penawaran', 'Kolom harga dan budget diganti input teks numerik (money.ts): hanya digit yang disimpan, tampilan diformat "150.000"'],
 ['7', 'Penawaran terbaru muncul di atas, terpisah dari chat', 'Penawaran diambil berurutan menurun (created_at desc) dan dirender di atas daftar pesan', 'Pembeli harus menggulir ke atas untuk melihat penawaran baru', 'Pesan, penawaran, dan kartu Deal digabung dalam satu timeline berurutan waktu; chat dibuka langsung pada pesan terbaru'],
 ['8', 'Tombol kembali harus ditekan berkali-kali', 'Setiap pindah tab dan perubahan filter menambah entri riwayat navigasi', 'Pengguna kembali melewati halaman satu per satu', 'Navigasi tab, filter, dan pengalihan memakai replace; tombol Kembali memakai hook useGoBack (navigation.ts)'],
]
for vals in NEW45:
    nr = clone(last); row_set(nr, vals); last.addnext(nr); last = nr

# =====================================================================
# 5. PENGUJIAN ALPHA & BETA (UAT) — koreksi ketidakcocokan
# =====================================================================
for el in body:
    R(el, 'perangkat dan cenari API', 'perangkat dan versi API', need=False)
    R(el, 'seperti satu cena penuh', 'seperti satu layar penuh', need=False)
    R(el, 'ketiga cenari tersebut', 'ketiga tingkat tersebut', need=False)
    R(el, 'menjalankan cenario pada', 'menjalankan skenario pada', need=False)
    R(el, 'berbasis cenario,', 'berbasis skenario,', need=False)
    R(el, 'endto-end', 'end-to-end', need=False)
R(P('Gambar 4.41 menampilkan log ketika skenario pemesanan'), 'pesanan tersimpan ke tabel orders,', 'pesanan tersimpan ke tabel preorders,')
# Duplikat: "Gambar 4.40 Tampilan Beranda pada Oppo A3X" memakai berkas gambar grafik rekap (sama dengan grafik rekap)
dup = None
for e in body:
    if e.tag == W+'p' and ptext(e).strip().startswith('Gambar 4.40 Tampilan Beranda Aplikasi pada Oppo A3X'): dup = e
img = dup.getprevious(); body.remove(img); body.remove(dup)
R(P('Pengujian kompatibilitas dilakukan pada satu perangkat Android fisik'), 'disajikan pada Gambar 4.40,', 'disajikan pada Gambar 4.33,')
# grafik rekap memakai nomor ganda 4.41 → label sementara
capr = P('Gambar 4.41 Rekapitulasi Hasil Pengujian Alpha')
R(capr, 'Gambar 4.41 ', 'Gambar 4.41b ')
R(P('Rekapitulasi hasil pengujian alpha berdasarkan jenis pengujian disajikan'), 'Gambar 4.41.', 'Gambar 4.41b.')
# Tabel 4.13: A-04 & A-05 disesuaikan dengan antarmuka final
tb = T('Tabel 4.13 Hasil Pengujian Aksesibilitas')
R(tb, 'Tombol Pre-Order (solid) dan Chat (outline) dipisah secara vertikal (perbaikan temuan v01.0 nomor 2)', 'Bar bawah tetap: tombol ikon Chat (outline) di kiri dan tombol Pre-Order Sekarang (solid, lebar) di kanan dengan jarak antartombol (perbaikan temuan nomor 2 pada Tabel 4.1)')
R(tb, '(perbaikan v135)', '(perbaikan Tabel 4.5 nomor 2)')
R(tb, '(perbaikan temuan v01.0 nomor 1)', '(perbaikan temuan nomor 1 pada Tabel 4.1)')
R(tb, '360– 414 px', '360–414 px', need=False)

# --- Skenario baru #37 dan #38 (fitur unggah referensi)
tb = T('Tabel 4.9 Hasil Pengujian Black-Box')
rows = tb.findall(W+'tr'); last = rows[-1]
for vals in (
  ['37', 'Referensi', 'Unggah foto referensi (judul, catatan, budget Rp150.000) dari Detail Toko lalu tekan "Kirim"', 'Foto tersimpan di Referensi Saya (tabel design_references) dan muncul sebagai kartu referensi di chat toko tujuan', 'M', '✓Valid'],
  ['38', 'Referensi', 'Penjual menekan "Buat Penawaran" pada kartu referensi dan mengirim harga Rp150.000; pada dialog Pilih Toko hanya toko berkategori sesuai yang tampil', 'Form penawaran terisi otomatis; harga tersimpan utuh Rp150.000; kartu penawaran muncul di bawah kartu referensi', 'M', '✓Valid'],
):
    nr = clone(last); row_set(nr, vals); last.addnext(nr); last = nr
R(P('Tabel 4.9 Hasil Pengujian Black-Box'), '(36 Skenario)', '(38 Skenario)')
p = P('Pengujian fungsional dilakukan untuk memvalidasi')
R(p, 'Pengujian mencakup 36 skenario black-box', 'Pengujian mencakup 38 skenario black-box')
R(p, 'serta unduh rekap penjualan Excel.', 'serta unduh rekap penjualan Excel, sedangkan skenario nomor 37 dan 38 menguji fitur unggah referensi desain ke toko tujuan beserta penawaran harga dari kartu referensi.')
R(T('Tabel 4.6 Rancangan Pengujian Alpha'), 'Black-box 36 skenario', 'Black-box 38 skenario')
tb = T('Tabel 4.10 Hasil Pengujian End-to-End')
R(tb, 'Buka Referensi, cari kata kunci, ketuk gambar, kirim ke toko,', 'Buka Referensi, pilih kategori atau cari kata kunci, ketuk gambar atau unggah foto referensi sendiri, kirim ke toko yang sesuai kategori,')
tb = T('Tabel 4.11 Keterlacakan Kebutuhan Fungsional')
R(tb, '#15, #16, #33, #34, #35, E2E-03', '#15, #16, #33–#35, #37, #38, E2E-03')
R(tb, 'Referensi desain bunga (Wikimedia Commons dan foto produk toko) dan pengiriman ke toko', 'Referensi desain bunga (Wikimedia Commons, foto produk toko, dan unggahan pembeli) serta pengiriman ke toko tujuan')
R(P('Hasil pengujian fungsional menunjukkan seluruh 39 skenario'), '39 skenario (36 skenario black-box', '41 skenario (38 skenario black-box')
tb = T('Tabel 4.12 Hasil Pengujian Performa'); R(tb, 'Seluruh 39 skenario selesai', 'Seluruh 41 skenario selesai')
tb = T('Tabel 4.15 Rekapitulasi Hasil Pengujian Alpha')
rows = tb.findall(W+'tr'); row_set(rows[1], [None, None, '41', '41', None, None, None]); row_set(rows[-1], [None, None, '59', '57', None, None, '96,6%'])
tb = T('Tabel 4.16 Rekapitulasi Skenario Fungsional')
rows = tb.findall(W+'tr'); row_set(rows[2], [None, None, '27', '#1, #3, #5, #6, #7, #11, #15–#18, #20–#28, #30–#33, #35–#38', None]); row_set(rows[-1], [None, None, '41', None, None])
R(P('Dari 57 butir pengujian, 55 butir (96,5%)'), 'Dari 57 butir pengujian, 55 butir (96,5%)', 'Dari 59 butir pengujian, 57 butir (96,6%)')
tb = T('Tabel 4.30 Ringkasan Capaian Akhir Sistem Bloemen')
R(tb, 'Fungsional 39 skenario valid', 'Fungsional 41 skenario valid')
R(tb, '10 tabel: users, shops, products, preorders, order_items, conversations, messages, reviews, notifications, custom_order_quotes', '11 tabel: users, shops, products, preorders, order_items, conversations, messages, reviews, notifications, custom_order_quotes, design_references')
R(tb, 'Referensi Desain (Wikimedia Commons dan foto produk toko)', 'Referensi Desain (Wikimedia Commons, foto produk toko, dan unggahan referensi pembeli)')
tb = T('Tabel 4.31 Keterkaitan Hasil Penelitian')
R(tb, 'Fungsional 39/39 valid', 'Fungsional 41/41 valid')
R(tb, 'Skenario #15, #16, #33–#35 dan E2E-03 valid', 'Skenario #15, #16, #33–#35, #37, #38 dan E2E-03 valid')
R(tb, 'dengan pengiriman referensi ke toko', 'dengan unggahan referensi pembeli dan pengiriman referensi ke toko yang sesuai kategori')
for start in ('Sulawesi Utara merupakan salah satu daerah', '4. Stabilitas Teknis dan Kelayakan Sistem'):
    R(P(start), '39 skenario fungsional (36 skenario black-box', '41 skenario fungsional (38 skenario black-box')
R(P('Manado City has a high frequency'), '39 functional scenarios (36 black-box', '41 functional scenarios (38 black-box')
R(P('2. Fitur Referensi Desain Bunga:'), 'gambar terpilih dapat dikirim langsung ke toko', 'pembeli juga dapat mengunggah foto referensi sendiri; gambar terpilih dapat dikirim langsung ke toko yang menyediakan kategori sesuai')

# --- UAT: baris rata-rata yang menyatu dengan baris terakhir dipisah
def split_last(tbcap, a_vals, b_vals):
    tb = T(tbcap); last = tb.findall(W+'tr')[-1]
    nr = clone(last); row_set(last, a_vals); row_set(nr, b_vals); last.addnext(nr)
split_last('Tabel 4.21 Rekapitulasi Skor dan Indeks Penerimaan UAT Sisi Penjual',
  ['14', 'Puas & bersedia merekomendasikan', '15', '1', '0', '0', '0', '79', '80', '98,75%', 'Sangat Baik'],
  ['', 'Rata-rata indeks penerimaan', '', '', '', '', '', '1.079', '1.120', '96,34%', 'Sangat Baik'])
split_last('Tabel 4.22 Indeks Penerimaan UAT Sisi Penjual per Aspek',
  ['4', 'Manfaat & kepuasan', '13–14', '2', '155', '160', '96,88%', 'Sangat Baik'],
  ['', 'Keseluruhan', '1–14', '14', '1.079', '1.120', '96,34%', 'Sangat Baik'])
split_last('Tabel 4.28 Rekapitulasi Skor dan Indeks Penerimaan Pengguna Sisi Pembeli',
  ['6', 'Niat menggunakan aplikasi apabila telah tersedia', '16', '12', '0', '0', '0', '128', '140', '91,4%', 'Sangat Baik'],
  ['', 'Rata-rata indeks penerimaan', '', '', '', '', '', '', '', '84,1%', 'Sangat Baik'])
# Tabel 4.27: teks menyebut 6 fitur, tabel hanya 5 baris
tb = T('Tabel 4.27 Prioritas Fitur Menurut Responden'); last = tb.findall(W+'tr')[-1]
nr = clone(last); row_set(nr, ['6', 'Informasi jadwal wisuda atau acara', '6', '21,4%', 'Belum diimplementasikan — direkomendasikan sebagai pengembangan lanjutan']); last.addnext(nr)
R(P('Lima fitur dengan prioritas tertinggi seluruhnya telah diimplementasikan'), 'mencapai 5 dari 6 fitur atau 83,3%.', 'mencapai 5 dari 6 fitur atau 83,3% (Tabel 4.27).')
# butir 2 kuesioner pembeli: label keterangan tidak sama dengan nama butir
R(P('Keterangan: jumlah responden pembeli adalah 28 orang'), 'Pada butir 2 (kesulitan menemukan lokasi toko)', 'Pada butir 2 (kepentingan fitur lokasi toko)')
tb = T('Tabel 4.29 Pemetaan Temuan UAT'); R(tb, 'Halaman Referensi Desain (Wikimedia Commons dan foto produk toko)', 'Halaman Referensi Desain (Wikimedia Commons, foto produk toko, dan unggahan referensi pembeli)')
# Gambar 4.5: caption tanpa style CaptionGambar (tidak masuk Daftar Gambar)
c = P('Gambar 4.5 Output Terminal'); ppr = c.find(W+'pPr')
st = etree.Element(W+'pStyle'); st.set(W+'val', 'CaptionGambar'); ppr.insert(0, st)
for x in ppr.findall(W+'ind'): ppr.remove(x)

R(P('Gambar 4.34 Tampilan Daftar Toko'), 'Tampilan Daftar Toko', 'Tampilan Daftar Toko dengan Indikator Status Buka/Tutup')
R(P('Gambar 4.35 Tampilan Halaman Detail Toko'), 'Tampilan Halaman Detail Toko', 'Tampilan Halaman Detail Toko dengan Peta Lokasi dan Tombol Lihat Peta')
# =====================================================================
# Penomoran ulang gambar Bab III & IV (sisipan 3.N*, 4.U*, duplikat 4.41b)
# =====================================================================
CAPRE = re.compile(r'^\s*Gambar (\d)\.([0-9]+b?|N\d|U\d)\b')
mapping = {}; cnt = {}
for e in body:
    if e.tag != W+'p': continue
    st = e.find(f'{W}pPr/{W}pStyle')
    if st is None or st.get(W+'val') != 'CaptionGambar': continue
    m = CAPRE.match(ptext(e))
    if not m or m.group(1) not in ('3', '4'): continue
    ch = m.group(1); cnt[ch] = cnt.get(ch, 0) + 1
    old = f'{ch}.{m.group(2)}'
    if old in mapping: log.append('DUP caption ' + old)
    mapping[old] = f'{ch}.{cnt[ch]}'
REF = re.compile(r'Gambar (\d)\.([0-9]+b?|N\d|U\d)(?![0-9])')
def fix(m):
    k = f'{m.group(1)}.{m.group(2)}'
    return 'Gambar ' + mapping[k] if k in mapping else m.group(0)
nref = 0
for e in body:
    if e.tag == W+'sdt': continue
    for p in ([e] if e.tag == W+'p' else list(e.iter(W+'p'))):
        nref += rsub(p, REF, fix)
changed = {k: v for k, v in mapping.items() if k != v}
log.append(f'renumber: {len(changed)} caption berubah, {nref} rujukan diperiksa: ' + ', '.join(f'{k}→{v}' for k, v in list(changed.items())))

# Word memperbarui Daftar Isi / Tabel / Gambar saat dokumen dibuka
sp = OUT + '/word/settings.xml'; st = etree.parse(sp); sr = st.getroot()
if sr.find(W+'updateFields') is None:
    uf = etree.Element(W+'updateFields'); uf.set(W+'val', 'true'); sr.insert(0, uf)
st.write(sp, xml_declaration=True, encoding='UTF-8', standalone=True)

tree.write(docp, xml_declaration=True, encoding='UTF-8', standalone=True)
rels.write(rels_p, xml_declaration=True, encoding='UTF-8', standalone=True)
import zipfile
dst = '/workspaces/default/code/docs/LAPORAN_SEMINAR_HASIL_NATALIA_PANGEMANAN_REVISI.docx'
os.makedirs(os.path.dirname(dst), exist_ok=True)
src_zip = zipfile.ZipFile('/workspaces/default/code/src/imports/LAPORAN_SEMINAR_HASIL_NATALIA_PANGEMANAN__1_.docx')
with zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as z:
    names = []
    for info in src_zip.infolist():
        names.append(info.filename)
    # [Content_Types].xml harus pertama
    for root_, _, files in os.walk(OUT):
        for f in files:
            full = os.path.join(root_, f); arc = os.path.relpath(full, OUT)
            if arc not in names: names.append(arc)
    for arc in sorted(set(names), key=lambda n: (n != '[Content_Types].xml', names.index(n))):
        full = os.path.join(OUT, arc)
        if os.path.exists(full): z.write(full, arc)
print('\n'.join(log)); print('OK', dst)
