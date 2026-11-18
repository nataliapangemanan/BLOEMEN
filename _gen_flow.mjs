// Generates report diagrams as PNG (SVG -> headless Chromium screenshot)
import fs from "fs";
import { execFileSync } from "child_process";

const OUT = "/workspaces/default/code/docs/diagrams";
fs.mkdirSync(OUT, { recursive: true });

const C = { ink: "#2B2B2B", line: "#5A4650", rose: "#7A3B4E", roseL: "#F6E9ED", roseM: "#E9CDD6", blue: "#DCE8F5", blueD: "#2F5D8A", green: "#E3F0DF", greenD: "#3D7A3A", sand: "#FBF6EE", grey: "#F3F3F3" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function svgDoc(W, H, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:#fff}
  .t{font-family:Arial,Helvetica,sans-serif;color:${C.ink};display:flex;align-items:center;justify-content:center;text-align:center;width:100%;height:100%;box-sizing:border-box;padding:4px 8px;line-height:1.25}
  </style></head><body><svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${C.line}"/></marker>
  <marker id="ao" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path d="M0,0 L10,5 L0,10" fill="none" stroke="${C.line}" stroke-width="1.4"/></marker></defs>
  <rect width="${W}" height="${H}" fill="#fff"/>${body}</svg></body></html>`;
}
function shot(name, W, H, body) {
  const html = `${OUT}/${name}.html`;
  try { fs.unlinkSync(`${OUT}/${name}.png`); } catch {}
  fs.writeFileSync(html, svgDoc(W, H, body));
  for (let t = 0; t < 8 && !fs.existsSync(`${OUT}/${name}.png`); t++) {
    try { fs.rmSync(`/tmp/chr_${name}`, { recursive: true, force: true }); execFileSync("chromium", ["--headless", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", `--window-size=${W},${H}`, "--force-device-scale-factor=2", "--virtual-time-budget=2000", `--user-data-dir=/tmp/chr_${name}`, `--screenshot=${OUT}/${name}.png`, `file://${html}`], { stdio: "ignore", timeout: 60000 }); } catch (e) {}
  }
  if (!fs.existsSync(`${OUT}/${name}.png`)) throw new Error("render failed " + name);
  fs.unlinkSync(html);
  console.log("ok", name, W, H);
}

// ---------- primitives ----------
const N = {};
function text(x, y, w, h, label, { size = 13, bold = false, color = C.ink, align = "center", italic = false } = {}) {
  return `<foreignObject x="${x}" y="${y}" width="${w}" height="${h}"><div xmlns="http://www.w3.org/1999/xhtml" class="t" style="font-size:${size}px;font-weight:${bold ? 700 : 400};color:${color};justify-content:${align === "left" ? "flex-start" : "center"};text-align:${align};font-style:${italic ? "italic" : "normal"}"><div>${label}</div></div></foreignObject>`;
}
function box(id, cx, cy, w, h, label, o = {}) {
  N[id] = { cx, cy, w, h, shape: o.shape || "box" };
  const x = cx - w / 2, y = cy - h / 2;
  const fill = o.fill || "#fff", stroke = o.stroke || C.line;
  let s = "";
  if (o.shape === "ellipse") s = `<ellipse cx="${cx}" cy="${cy}" rx="${w / 2}" ry="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="1.4"/>`;
  else if (o.shape === "diamond") s = `<polygon points="${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}" fill="${fill}" stroke="${stroke}" stroke-width="1.4"/>`;
  else s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r ?? 10}" fill="${fill}" stroke="${stroke}" stroke-width="${o.sw || 1.4}" ${o.dash ? 'stroke-dasharray="6 4"' : ""}/>`;
  return s + (label ? text(x + (o.shape === "diamond" ? w * 0.12 : 0), y, o.shape === "diamond" ? w * 0.76 : w, h, label, o) : "");
}
const start = (id, cx, cy) => { N[id] = { cx, cy, w: 22, h: 22 }; return `<circle cx="${cx}" cy="${cy}" r="11" fill="${C.ink}"/>`; };
const end = (id, cx, cy) => { N[id] = { cx, cy, w: 26, h: 26 }; return `<circle cx="${cx}" cy="${cy}" r="13" fill="#fff" stroke="${C.ink}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="8" fill="${C.ink}"/>`; };
function actor(id, cx, cy, label) {
  N[id] = { cx, cy, w: 40, h: 90 };
  return `<g stroke="${C.ink}" stroke-width="2" fill="none"><circle cx="${cx}" cy="${cy - 32}" r="11" fill="#fff"/><line x1="${cx}" y1="${cy - 21}" x2="${cx}" y2="${cy + 12}"/><line x1="${cx - 18}" y1="${cy - 8}" x2="${cx + 18}" y2="${cy - 8}"/><line x1="${cx}" y1="${cy + 12}" x2="${cx - 15}" y2="${cy + 36}"/><line x1="${cx}" y1="${cy + 12}" x2="${cx + 15}" y2="${cy + 36}"/></g>` + text(cx - 70, cy + 40, 140, 36, label, { size: 14, bold: true });
}
function side(n, s, off = 0) {
  const { cx, cy, w, h } = n;
  return { t: [cx + off, cy - h / 2], b: [cx + off, cy + h / 2], l: [cx - w / 2, cy + off], r: [cx + w / 2, cy + off] }[s];
}
// edge: route "v" (b->t elbow), "h" (r->l elbow), "s" straight; custom sides & waypoints
function edge(f, t, o = {}) {
  const a = N[f], b = N[t];
  let fs_ = o.from, ts = o.to;
  if (!fs_) {
    const dx = b.cx - a.cx, dy = b.cy - a.cy;
    if (Math.abs(dy) >= Math.abs(dx) * 0.6) { fs_ = dy > 0 ? "b" : "t"; ts = ts || (dy > 0 ? "t" : "b"); }
    else { fs_ = dx > 0 ? "r" : "l"; ts = ts || (dx > 0 ? "l" : "r"); }
  }
  ts = ts || "t";
  const p1 = side(a, fs_, o.fo || 0), p2 = side(b, ts, o.too || 0);
  let d;
  if (o.pts) d = `M${p1} ` + o.pts.map((p) => `L${p}`).join(" ") + ` L${p2}`;
  else if (o.straight) d = `M${p1} L${p2}`;
  else if ((fs_ === "b" || fs_ === "t") && (ts === "t" || ts === "b")) { const my = o.my ?? (p1[1] + p2[1]) / 2; d = `M${p1} V${my} H${p2[0]} V${p2[1]}`; }
  else if ((fs_ === "r" || fs_ === "l") && (ts === "l" || ts === "r")) { const mx = o.mx ?? (p1[0] + p2[0]) / 2; d = `M${p1} H${mx} V${p2[1]} H${p2[0]}`; }
  else if (fs_ === "r" || fs_ === "l") d = `M${p1} H${p2[0]} V${p2[1]}`;
  else d = `M${p1} V${p2[1]} H${p2[0]}`;
  let s = `<path d="${d}" fill="none" stroke="${C.line}" stroke-width="1.5" ${o.dash ? 'stroke-dasharray="6 4"' : ""} ${o.noArrow ? "" : `marker-end="url(#${o.open ? "ao" : "ar"})"`}/>`;
  if (o.label) {
    const [lx, ly] = o.lpos || [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    s += `<rect x="${lx - o.label.length * 3.6 - 6}" y="${ly - 10}" width="${o.label.length * 7.2 + 12}" height="20" rx="4" fill="#fff"/>` + `<text x="${lx}" y="${ly + 4.5}" text-anchor="middle" font-family="Arial" font-size="12" font-style="italic" fill="${C.rose}">${esc(o.label)}</text>`;
  }
  return s;
}
const title = (W, s) => ""; // captions are in the document

// =====================================================================
// REVISI BAB III — Proses Bisnis (berjalan & usulan) + Activity Diagram
// yang diperjelas (langkah bernomor, setiap keputusan berlabel, alur
// kembali/loop digambar terpisah agar tidak saling menimpa).
// Jalankan: node _gen_flow.mjs  → docs/diagrams/g3_bp_*.png, g3_act*_v2.png
// =====================================================================
function lanes(names, W, H, colors) {
  const lw = W / names.length;
  let s = `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="#fff" stroke="${C.ink}" stroke-width="1.5"/>`;
  names.forEach((n, i) => {
    s += `<rect x="${i * lw + 1}" y="1" width="${lw - 2}" height="46" fill="${(colors || [C.roseL, C.blue, C.green])[i]}"/>`;
    if (i) s += `<line x1="${i * lw}" y1="1" x2="${i * lw}" y2="${H}" stroke="${C.ink}" stroke-width="1.2"/>`;
    s += text(i * lw, 1, lw, 46, `<b>${n}</b>`, { size: 15 });
  });
  s += `<line x1="0" y1="47" x2="${W}" y2="47" stroke="${C.ink}" stroke-width="1.2"/>`;
  return [s, (i) => i * lw + lw / 2];
}
const num = (n, l) => `<b style="color:${C.rose}">${n}.</b> ${l}`;
const A = (id, x, y, n, l, w = 240, h = 54) => box(id, x, y, w, h, n ? num(n, l) : l, { size: 12.5, r: 16, fill: "#fff" });
const Dm = (id, x, y, l, w = 160) => box(id, x, y, w, 78, l, { shape: "diamond", size: 11.5, fill: C.sand });
const note = (x, y, w, h, l) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#FDECEC" stroke="#C0392B" stroke-dasharray="5 3"/>` + text(x, y, w, h, l, { size: 11, color: "#8E1F1F" });
const legend = (W, y, l) => `<rect x="12" y="${y}" width="${W - 24}" height="24" fill="#fff"/>` + text(10, y, W - 20, 24, l, { size: 11.5, italic: true, color: C.mute || "#666" });

const Y = (r) => 160 + r * 105; // baris: start di y=80, langkah pertama y=160

// ---------- Gambar: Proses Bisnis Berjalan (as-is) ----------
{
  const W = 900, H = Y(6) + 80;
  let [s, X] = lanes(["Pembeli", "Penjual (Toko Bunga)"], W, H, [C.roseL, C.green]);
  s += start("s", X(0), 80);
  s += A("a1", X(0), Y(0), 1, "Mencari toko dan inspirasi model bunga lewat Instagram / Google / datang langsung", 280, 64);
  s += A("a2", X(0), Y(1), 2, "Menghubungi toko via WhatsApp / DM dan mengirim foto contoh", 280, 64);
  s += A("a3", X(1), Y(1), 3, "Membalas chat satu per satu; menjelaskan model dan harga secara manual", 280, 64);
  s += Dm("d1", X(0), Y(2), "Model &amp; harga sepakat?", 170);
  s += A("a4", X(0), Y(3), 4, "Transfer DP / pelunasan, lalu mengirim foto bukti transfer", 280, 64);
  s += A("a5", X(1), Y(3), 5, "Mengecek mutasi rekening dan mencatat pesanan di buku / Excel", 280, 64);
  s += A("a6", X(1), Y(4), 6, "Merangkai bunga berdasarkan catatan dan riwayat chat", 280, 64);
  s += A("a7", X(1), Y(5), 7, "Mengabari pembeli bahwa pesanan siap (chat manual)", 280, 64);
  s += A("a8", X(0), Y(5), 8, "Mengambil pesanan di toko / menerima kiriman", 280, 64);
  s += A("a9", X(1), Y(6), 9, "Merekap penjualan secara manual di akhir periode", 280, 64);
  s += end("e", X(1) + 200, Y(6));
  s += edge("s", "a1") + edge("a1", "a2") + edge("a2", "a3") + edge("a3", "d1", { from: "b", to: "r", pts: [[X(1), Y(2)]] });
  s += edge("d1", "a2", { from: "l", to: "l", pts: [[30, Y(2)], [30, Y(1)]], label: "tidak", lpos: [66, Y(2) - 14] });
  s += edge("d1", "a4", { label: "ya", lpos: [X(0) + 18, Y(3) - 50] });
  s += edge("a4", "a5") + edge("a5", "a6") + edge("a6", "a7") + edge("a7", "a8") + edge("a7", "a9") + edge("a9", "e", { from: "r", to: "l" });
  s += note(W / 2 + 40, 62, 260, 46, "Masalah: pesan menumpuk di banyak aplikasi → pesanan rawan terlewat");
  s += note(20, Y(4) - 30, 300, 60, "Masalah: pembeli tidak dapat memantau status pesanan; harus bertanya lewat chat");
  s += note(20, Y(6) - 30, 300, 60, "Masalah: pencatatan &amp; rekap penjualan manual memakan waktu dan rawan salah");
  shot("g3_bp_asis", W, H, s);
}

// ---------- Gambar: Proses Bisnis Usulan (to-be) dengan Bloemen ----------
{
  const W = 1080, H = Y(7) + 90;
  let [s, X] = lanes(["Pembeli", "Aplikasi Bloemen", "Penjual"], W, H);
  const bw = 250;
  s += start("s", X(0), 80);
  s += A("a1", X(0), Y(0), 1, "Membuka Bloemen: mencari produk, toko terdekat, atau referensi desain", bw, 70);
  s += A("a2", X(1), Y(0), 2, "Menampilkan katalog, toko terurut jarak, dan galeri referensi", bw, 70);
  s += Dm("d1", X(0), Y(1), "Produk sesuai ada di katalog?", 180);
  s += A("a3", X(0), Y(2), 3, "Mengunggah / memilih referensi + judul, catatan, budget; kirim ke toko", bw, 74);
  s += A("a4", X(1), Y(2), 4, "Menyimpan referensi dan menampilkannya sebagai kartu di chat toko", bw, 74);
  s += A("a5", X(2), Y(2), 5, "Membuka kartu referensi lalu mengirim penawaran harga", bw, 74);
  s += Dm("d2", X(0), Y(3), "Terima penawaran?", 180);
  s += A("a6", X(0), Y(4), 6, "Mengisi formulir pre-order: jumlah, ambil/kirim, tanggal &amp; jam", bw, 70);
  s += A("a7", X(1), Y(4), 7, "Validasi tanggal, simpan pesanan + nomor unik, kirim notifikasi", bw, 70);
  s += A("a8", X(2), Y(4), 8, "Menerima notifikasi pesanan baru", bw, 70);
  s += A("a9", X(2), Y(5), 9, "Konfirmasi pembayaran &amp; ubah status: confirmed → processing → ready → delivered", bw, 84);
  s += A("a10", X(1), Y(5), 10, "Menyimpan status dan mengirim notifikasi real-time ke pembeli", bw, 70);
  s += A("a11", X(0), Y(6), 11, "Memantau status, mengambil / menerima pesanan, memberi ulasan", bw, 70);
  s += A("a12", X(1), Y(6), 12, "Memperbarui rating toko dan menyusun rekap penjualan otomatis", bw, 70);
  s += A("a13", X(2), Y(6), 13, "Melihat dashboard &amp; mengunduh rekap Excel", bw, 70);
  s += end("e", X(2), Y(7));
  s += edge("s", "a1") + edge("a1", "a2") + edge("a2", "d1", { from: "b", to: "r", pts: [[X(1), Y(1)]] });
  s += edge("d1", "a3", { label: "tidak", lpos: [X(0) + 26, Y(2) - 56] });
  s += edge("d1", "a6", { from: "l", to: "l", pts: [[22, Y(1)], [22, Y(4)]], label: "ya", lpos: [52, Y(1) - 14] });
  s += edge("a3", "a4") + edge("a4", "a5");
  s += edge("a5", "d2", { from: "b", to: "r", pts: [[X(2), Y(3)]], label: "kartu penawaran muncul di chat", lpos: [X(1) + 40, Y(3) - 14] });
  s += edge("d2", "a3", { from: "l", to: "l", pts: [[42, Y(3)], [42, Y(2)]], label: "tidak", lpos: [82, Y(3) + 16] });
  s += edge("d2", "a6", { label: "ya (Deal)", lpos: [X(0) + 46, Y(4) - 56] });
  s += edge("a6", "a7") + edge("a7", "a8") + edge("a8", "a9") + edge("a9", "a10") + edge("a10", "a11", { from: "b", to: "t", pts: [[X(1), Y(5) + 52], [X(0), Y(5) + 52]] });
  s += edge("a11", "a12") + edge("a12", "a13") + edge("a13", "e");
  s += legend(W, H - 36, "Keterangan: \"ya\" pada keputusan pertama = produk dipilih langsung dari katalog; \"tidak\" = pembeli meminta desain khusus melalui referensi.");
  shot("g3_bp_tobe", W, H, s);
}

// ---------- Activity: Registrasi (diperjelas) ----------
{
  const W = 860, H = Y(6) + 90;
  let [s, X] = lanes(["Pengguna", "Sistem"], W, H);
  s += start("s", X(0), 80);
  s += A("a1", X(0), Y(0), 1, "Membuka aplikasi dan memilih \"Daftar\"", 260);
  s += A("a2", X(1), Y(0), 2, "Menampilkan form registrasi + pilihan peran", 260);
  s += A("a3", X(0), Y(1), 3, "Memilih peran dan mengisi nama, email, telepon, kata sandi", 260, 64);
  s += A("a4", X(1), Y(1), 4, "Memvalidasi email, kata sandi minimal 6 karakter, dan konfirmasi sandi", 260, 70);
  s += Dm("d1", X(1), Y(2), "Data valid?");
  s += A("a5", X(0), Y(2), 5, "Melihat pesan kesalahan dan memperbaiki isian", 260);
  s += A("a6", X(1), Y(3), 6, "Membuat akun (Supabase Auth) dan menyimpan profil ke tabel users", 260, 70);
  s += Dm("d2", X(1), Y(4), "Peran Penjual?");
  s += A("a7", X(0), Y(5), 7, "Mengisi registrasi toko: info, kategori, peta, jam buka, foto", 260, 70);
  s += A("a8", X(1), Y(5), 8, "Menyimpan data toko ke tabel shops", 260);
  s += A("a9", X(1), Y(6), 9, "Mengarahkan ke halaman sesuai peran (Pembeli → Beranda, Penjual → Dashboard)", 270, 74);
  s += end("e", X(0), Y(6));
  s += edge("s", "a1") + edge("a1", "a2") + edge("a2", "a3", { from: "b", to: "t", pts: [[X(1), Y(0) + 52], [X(0), Y(0) + 52]] }) + edge("a3", "a4") + edge("a4", "d1");
  s += edge("d1", "a5", { label: "tidak", lpos: [X(0) + 175, Y(2) - 14] });
  s += edge("a5", "a3", { from: "t", to: "b" });
  s += edge("d1", "a6", { label: "ya", lpos: [X(1) + 16, Y(3) - 56] }) + edge("a6", "d2");
  s += edge("d2", "a7", { from: "l", to: "t", label: "ya", lpos: [X(0) + 22, Y(4) - 14] });
  s += edge("a7", "a8") + edge("a8", "a9");
  s += edge("d2", "a9", { from: "r", to: "r", pts: [[W - 26, Y(4)], [W - 26, Y(6)]], label: "tidak", lpos: [W - 26, Y(5) - 40] });
  s += edge("a9", "e", { from: "l", to: "r" });
  shot("g3_6_act_registrasi_v2", W, H, s);
}

// ---------- Activity: Pre-Order (diperjelas) ----------
{
  const W = 1020, H = Y(6) + 80;
  let [s, X] = lanes(["Pembeli", "Sistem", "Penjual"], W, H);
  s += start("s", X(0), 80);
  s += A("a1", X(0), Y(0), 1, "Membuka detail produk dan memilih ukuran", 250);
  s += A("a2", X(0), Y(1), 2, "Menekan \"Pre-Order Sekarang\"", 250);
  s += A("a3", X(1), Y(1), 3, "Menampilkan formulir pre-order", 250);
  s += A("a4", X(0), Y(2), 4, "Mengisi jumlah, ambil sendiri / kirim, tanggal &amp; jam, alamat, catatan", 260, 74);
  s += A("a5", X(1), Y(2), 5, "Memvalidasi tanggal (minimal hari ini + durasi pengerjaan) dan isian wajib", 260, 74);
  s += Dm("d1", X(1), Y(3), "Valid?");
  s += A("a6", X(0), Y(3), 6, "Melihat peringatan dan memperbaiki isian", 250);
  s += A("a7", X(1), Y(4), 7, "Menyimpan ke preorders &amp; order_items; nomor pesanan dibuat otomatis", 260, 74);
  s += A("a8", X(1), Y(5), 8, "Membuat notifikasi \"pesanan baru\"", 250);
  s += A("a9", X(2), Y(5), 9, "Menerima notifikasi pesanan baru (real-time)", 250, 64);
  s += A("a10", X(0), Y(6), 10, "Memilih metode bayar; pesanan tampil berstatus pending", 260, 64);
  s += A("a11", X(2), Y(6), 11, "Meninjau pesanan di Manajemen Pesanan", 250, 64);
  s += end("e", X(1), Y(6));
  s += edge("s", "a1") + edge("a1", "a2") + edge("a2", "a3") + edge("a3", "a4", { from: "b", to: "t", pts: [[X(1), Y(1) + 52], [X(0), Y(1) + 52]] });
  s += edge("a4", "a5") + edge("a5", "d1");
  s += edge("d1", "a6", { label: "tidak", lpos: [X(0) + 185, Y(3) - 14] });
  s += edge("a6", "a4", { from: "t", to: "b" });
  s += edge("d1", "a7", { label: "ya", lpos: [X(1) + 16, Y(4) - 58] }) + edge("a7", "a8") + edge("a8", "a9");
  s += edge("a8", "a10", { from: "b", to: "t", pts: [[X(1), Y(5) + 50], [X(0), Y(5) + 50]] });
  s += edge("a9", "a11");
  s += edge("a10", "e", { from: "r", to: "l" }) + edge("a11", "e", { from: "l", to: "r" });
  shot("g3_7_act_preorder_v2", W, H, s);
}

// ---------- Activity: Chat Real-time + Referensi + Penawaran (diperjelas) ----------
{
  const W = 1020, H = Y(6) + 80;
  let [s, X] = lanes(["Pembeli", "Sistem", "Penjual"], W, H);
  s += start("s", X(0), 80);
  s += A("a1", X(0), Y(0), 1, "Menekan \"Chat Toko\" pada detail toko / produk", 250, 64);
  s += A("a2", X(1), Y(0), 2, "Mencari atau membuat percakapan (conversations)", 250, 64);
  s += A("a3", X(1), Y(1), 3, "Membuka ChatRoom langsung pada pesan terbaru", 250, 64);
  s += A("a4", X(0), Y(2), 4, "Menulis pesan atau mengirim referensi desain (foto, judul, catatan, budget)", 260, 80);
  s += A("a5", X(1), Y(2), 5, "Menyimpan ke tabel messages (teks / kartu referensi) dan menyiarkan via Realtime", 260, 80);
  s += A("a6", X(2), Y(3), 6, "Menerima pesan / kartu referensi secara real-time", 250, 64);
  s += Dm("d1", X(2), Y(4), "Perlu harga khusus?", 170);
  s += A("a7", X(2), Y(5), 7, "Mengirim kartu penawaran harga", 250);
  s += A("a8", X(1), Y(5), 8, "Menampilkan balasan / kartu penawaran di sela chat", 250, 64);
  s += Dm("d2", X(0), Y(5), "Terima penawaran?", 170);
  s += A("a9", X(0), Y(6), 9, "Kartu \"Deal\" muncul; menekan \"Pesan Sekarang\"", 250, 64);
  s += end("e", X(1), Y(6));
  s += edge("s", "a1") + edge("a1", "a2") + edge("a2", "a3") + edge("a3", "a4", { from: "l", to: "t", pts: [[X(0), Y(1)]] });
  s += edge("a4", "a5") + edge("a5", "a6", { from: "b", to: "l", pts: [[X(1), Y(3)]] }) + edge("a6", "d1");
  s += edge("d1", "a7", { label: "ya", lpos: [X(2) + 16, Y(5) - 56] });
  s += edge("d1", "a8", { from: "l", to: "t", label: "tidak (balas teks)", lpos: [X(1) + 70, Y(4) - 14] });
  s += edge("a7", "a8") + edge("a8", "d2");
  s += edge("d2", "a9", { label: "ya", lpos: [X(0) + 16, Y(6) - 56] });
  s += edge("d2", "a4", { from: "l", to: "l", pts: [[24, Y(5)], [24, Y(2)]], label: "tidak", lpos: [46, Y(4)] });
  s += edge("a9", "e");
  shot("g3_8_act_chat_v2", W, H, s);
}

// ---------- Activity: Manajemen Status Pesanan (diperjelas) ----------
{
  const W = 1020, H = Y(7) + 80;
  let [s, X] = lanes(["Penjual", "Sistem", "Pembeli"], W, H);
  s += start("s", X(0), 80);
  s += A("a1", X(0), Y(0), 1, "Membuka Manajemen Pesanan dan memilih pesanan", 250, 64);
  s += A("a2", X(1), Y(0), 2, "Menampilkan detail pesanan (status pending)", 250, 64);
  s += Dm("d1", X(0), Y(1), "Terima pesanan?", 170);
  s += A("a3", X(1), Y(1), 3, "Mengubah status ke cancelled", 250);
  s += A("a4", X(0), Y(2), 4, "Mengonfirmasi pesanan dan pembayaran", 250);
  s += A("a5", X(0), Y(3), 5, "Memilih status berikutnya: processing → ready → delivered", 260, 70);
  s += A("a6", X(1), Y(3), 6, "Menyimpan status ke tabel preorders", 250);
  s += A("a7", X(1), Y(4), 7, "Membuat notifikasi perubahan status", 250);
  s += A("a8", X(2), Y(4), 8, "Menerima notifikasi status pesanan", 250);
  s += Dm("d2", X(1), Y(5), "Status delivered?", 170);
  s += A("a9", X(2), Y(6), 9, "Memberi ulasan dan rating", 250);
  s += A("a10", X(1), Y(7), 10, "Memperbarui rating toko (trigger update_shop_rating)", 260, 64);
  s += end("e", X(0), Y(7));
  s += edge("s", "a1") + edge("a1", "a2") + edge("a2", "d1", { from: "b", to: "t", pts: [[X(1), Y(0) + 52], [X(0), Y(0) + 52]] });
  s += edge("d1", "a3", { label: "tidak", lpos: [X(0) + 150, Y(1) - 14] });
  s += edge("d1", "a4", { label: "ya", lpos: [X(0) + 16, Y(2) - 54] });
  s += edge("a4", "a5") + edge("a5", "a6") + edge("a6", "a7") + edge("a7", "a8", { fo: 10, too: 10 }) + edge("a7", "d2");
  s += edge("a3", "a7", { from: "r", to: "r", too: -10, pts: [[X(1) + 155, Y(1)], [X(1) + 155, Y(4) - 10]] });
  s += edge("d2", "a5", { from: "l", to: "b", pts: [[X(0), Y(5)]], label: "belum", lpos: [X(0) + 150, Y(5) - 14] });
  s += edge("d2", "a9", { from: "r", to: "t", label: "ya", lpos: [X(1) + 120, Y(5) - 14] });
  s += edge("a9", "a10", { from: "b", to: "r", pts: [[X(2), Y(7)]] }) + edge("a10", "e", { from: "l", to: "r" });
  shot("g3_9_act_status_v2", W, H, s);
}

// ---------- ERD & Arsitektur v2: + tabel design_references (fitur unggah referensi) ----------
// =============== Gambar 3.3 ERD ===============
{
  let s = "";
  const W = 1420, H = 1040;
  const ent = (id, x, y, name, cols) => {
    const w = 230, rh = 19, h = 30 + cols.length * rh + 8;
    N[id] = { cx: x + w / 2, cy: y + h / 2, w, h };
    let r = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#fff" stroke="${C.rose}" stroke-width="1.5"/><path d="M${x},${y + 30} V${y + 6} Q${x},${y} ${x + 6},${y} H${x + w - 6} Q${x + w},${y} ${x + w},${y + 6} V${y + 30} Z" fill="${C.rose}"/>`;
    r += `<text x="${x + w / 2}" y="${y + 20}" text-anchor="middle" font-family="Arial" font-size="14" font-weight="700" fill="#fff">${name}</text>`;
    cols.forEach((c, i) => {
      const k = c.startsWith("PK ") ? "PK" : c.startsWith("FK ") ? "FK" : "";
      const nm = c.replace(/^(PK|FK) /, "");
      const yy = y + 30 + 16 + i * rh;
      if (i % 2) r += `<rect x="${x + 1}" y="${yy - 13}" width="${w - 2}" height="${rh}" fill="${C.roseL}"/>`;
      r += `<text x="${x + 10}" y="${yy}" font-family="Arial" font-size="11" font-weight="700" fill="${k === "PK" ? "#B26A00" : C.blueD}">${k}</text><text x="${x + 38}" y="${yy}" font-family="Arial" font-size="12" fill="${C.ink}" ${k === "PK" ? 'font-weight="700"' : ""}>${esc(nm)}</text>`;
    });
    return r;
  };
  const ents = [
    ["users", 400, 30, "users", ["PK id", "email", "name", "user_type (buyer/seller)", "phone", "avatar_url", "created_at"]],
    ["notif", 770, 30, "notifications", ["PK id", "FK user_id", "type", "title, message", "is_read", "FK order_id, quote_id"]],
    ["shops", 30, 330, "shops", ["PK id", "FK user_id", "name", "address, city", "latitude, longitude", "opening_hours", "image_url", "rating, total_reviews", "is_active"]],
    ["preorders", 400, 330, "preorders", ["PK id", "order_number", "FK user_id", "FK shop_id", "delivery_date", "delivery_address", "total_amount", "status", "design_reference_url"]],
    ["reviews", 770, 360, "reviews", ["PK id", "FK order_id", "FK shop_id", "FK user_id", "FK product_id", "rating, comment"]],
    ["conversations", 1140, 330, "conversations", ["PK id", "FK user1_id", "FK user2_id", "FK shop_id", "last_message", "unread_count_user1/2"]],
    ["products", 30, 640, "products", ["PK id", "FK shop_id", "FK user_id", "name, category", "price, sizes (JSONB)", "stock, is_available", "is_pre_order", "po_duration_days", "discount_percentage"]],
    ["order_items", 400, 660, "order_items", ["PK id", "FK preorder_id", "FK product_id", "product_name", "product_price", "quantity, subtotal"]],
    ["messages", 1140, 560, "messages", ["PK id", "FK conversation_id", "FK sender_id", "FK receiver_id", "message, is_read", "image_url, message_type", "metadata (JSONB)"]],
    ["refs", 770, 640, "design_references", ["PK id", "FK user_id", "image_url", "title, description", "source", "created_at"]],
    ["quotes", 1140, 790, "custom_order_quotes", ["PK id", "FK conversation_id", "FK shop_id", "FK seller_id, buyer_id", "product_name, price", "status, expires_at"]],
  ];
  ents.forEach((e) => (s += ent(...e)));
  const rel = (a, b, la, lb, o = {}) => {
    let p = edge(a, b, { ...o, noArrow: true });
    const A = side(N[a], o.from, o.fo || 0), B = side(N[b], o.to, o.too || 0);
    const off = (P, sd, l) => { const d = { t: [8, -8], b: [8, 18], l: [-16, -6], r: [6, -6] }[sd]; return l ? `<text x="${P[0] + d[0]}" y="${P[1] + d[1]}" font-family="Arial" font-size="13" font-weight="700" fill="${C.rose}">${l}</text>` : ""; };
    return p + off(A, o.from, la) + off(B, o.to, lb);
  };
  s += rel("users", "shops", "1", "N", { from: "l", to: "t", pts: [[N.shops.cx, N.users.cy]] });
  s += rel("users", "notif", "1", "N", { from: "r", to: "l", mx: 700 });
  s += rel("users", "preorders", "1", "N", { from: "b", to: "t", fo: -40, too: -40 });
  s += rel("users", "conversations", "1", "N", { from: "b", to: "t", fo: 60, my: 290 });
  s += rel("shops", "preorders", "1", "N", { from: "r", to: "l" });
  s += rel("shops", "products", "1", "N", { from: "b", to: "t" });
  s += rel("preorders", "order_items", "1", "N", { from: "b", to: "t" });
  s += rel("products", "order_items", "1", "N", { from: "r", to: "l" });
  s += rel("preorders", "reviews", "1", "1", { from: "r", to: "l", fo: 20, too: 20 - (N.reviews.cy - N.preorders.cy) });
  s += rel("conversations", "messages", "1", "N", { from: "b", to: "t" });
  s += rel("users", "refs", "1", "N", { from: "r", to: "l", fo: 40, pts: [[745, N.users.cy + 40], [745, N.refs.cy]] });
  s += rel("conversations", "quotes", "1", "N", { from: "r", to: "r", pts: [[1395, N.conversations.cy], [1395, N.quotes.cy]] });
  s += text(30, 995, 1300, 30, "Keterangan: PK = Primary Key, FK = Foreign Key; 1 dan N menunjukkan kardinalitas relasi (satu ke banyak). Seluruh tabel berada pada skema public Supabase PostgreSQL dengan Row Level Security.", { size: 12.5, align: "left", color: "#555" });
  shot("g3_3_erd_v2", W, H, s);
}

// =============== Gambar 3.4 Arsitektur ===============
{
  let s = "";
  const W = 1000, H = 600;
  s += box("cl", 500, 95, 920, 150, "", { fill: C.roseL, stroke: C.rose, r: 16 });
  s += text(40, 26, 920, 28, "<b>LAPISAN KLIEN — Aplikasi Android Bloemen (APK, Capacitor 6 WebView)</b>", { size: 15, color: C.rose });
  ["React 18 + TypeScript", "React Router", "Tailwind CSS v4 + shadcn/ui", "Plugin: Geolocation · Filesystem · Share · Browser"].forEach((l, i) => (s += box("c" + i, 145 + i * 237, 110, 215, 60, l, { fill: "#fff", stroke: C.rose, size: 13, r: 8 })));
  s += box("sb", 360, 440, 640, 230, "", { fill: C.blue, stroke: C.blueD, r: 16 });
  s += text(40, 335, 640, 28, "<b>BACKEND — Supabase (Backend as a Service)</b>", { size: 15, color: C.blueD });
  [["Auth", "Sesi & JWT, multi-peran"], ["PostgreSQL", "11 tabel + RLS"], ["Realtime", "Chat & notifikasi"], ["Storage", "Bucket images"]].forEach(([a, b], i) => (s += box("s" + i, 115 + i * 163, 460, 145, 110, `<b>${a}</b><br><span style="font-size:12px">${b}</span>`, { fill: "#fff", stroke: C.blueD, size: 14, r: 8 })));
  s += box("wk", 850, 440, 260, 230, "<b>LAYANAN EKSTERNAL</b><br><br><b>Wikimedia Commons API<br>(REST API)</b><br><span style='font-size:12px'>MediaWiki api.php · JSON · tanpa API key</span>", { fill: C.green, stroke: C.greenD, size: 14, r: 16 });
  s += `<path d="M360,172 V322" stroke="${C.line}" stroke-width="2" marker-end="url(#ar)" marker-start="url(#ar)"/>`;
  s += `<path d="M850,172 V322" stroke="${C.line}" stroke-width="2" marker-end="url(#ar)" marker-start="url(#ar)"/>`;
  s += text(370, 215, 330, 60, "HTTPS REST &amp; WebSocket<br>(@supabase/supabase-js, JWT)", { size: 12.5, italic: true, color: C.rose, align: "left" });
  s += text(860, 225, 140, 50, "HTTPS GET<br>(REST, JSON)", { size: 12.5, italic: true, color: C.rose, align: "left" });
  shot("g3_4_arsitektur_v2", W, H, s);
}

