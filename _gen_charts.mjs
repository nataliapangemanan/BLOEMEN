// Generates Bab IV charts (4.41–4.51) and wireframes (4.1–4.4) as PNG via headless Chromium
import fs from "fs";
import { execFileSync } from "child_process";

const OUT = "/workspaces/default/code/docs/diagrams";
fs.mkdirSync(OUT, { recursive: true });
const C = { ink: "#2B2B2B", mute: "#6B6B6B", grid: "#E6E0E2", rose: "#7A3B4E", roseL: "#F6E9ED", blue: "#2F5D8A", wf: "#9A9A9A", wfL: "#EDEDED", wfM: "#D6D6D6" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const F = `font-family="Arial, Helvetica, sans-serif"`;

function shot(name, W, H, body) {
  if (process.env.WF_ONLY && !/^g4_[1-4]$/.test(name)) return; // WF_ONLY=1 → hanya render wireframe
  const html = `${OUT}/${name}.html`, png = `${OUT}/${name}.png`;
  try { fs.unlinkSync(png); } catch {}
  fs.writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#fff}</style></head><body><svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#fff"/>${body}</svg></body></html>`);
  for (let t = 0; t < 8 && !fs.existsSync(png); t++) {
    try { fs.rmSync(`/tmp/chr_${name}`, { recursive: true, force: true }); execFileSync("chromium", ["--headless", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", `--window-size=${W},${H}`, "--force-device-scale-factor=2", "--virtual-time-budget=1500", `--user-data-dir=/tmp/chr_${name}`, `--screenshot=${png}`, `file://${html}`], { stdio: "ignore", timeout: 60000 }); } catch (e) {}
  }
  fs.unlinkSync(html);
  if (!fs.existsSync(png)) throw new Error("render failed " + name);
  console.log("ok", name);
}
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" ${F} font-size="${o.size || 13}" fill="${o.color || C.ink}" text-anchor="${o.anchor || "start"}" ${o.bold ? 'font-weight="700"' : ""}>${esc(s)}</text>`;

// horizontal bar panel; items: [label, value, shownText]
function hbar(x, y, w, title, items, { max = 100, color = C.rose, labelW = 200, rowH = 30, ref } = {}) {
  let s = T(x, y + 14, title, { size: 14, bold: true });
  const top = y + 30, bx = x + labelW, bw = w - labelW - 70, h = items.length * rowH;
  for (let g = 0; g <= 4; g++) { const gx = bx + (bw * g) / 4; s += `<line x1="${gx}" y1="${top}" x2="${gx}" y2="${top + h}" stroke="${C.grid}"/>` + T(gx, top + h + 16, Math.round((max * g) / 4) + (max === 100 ? "%" : ""), { size: 11, color: C.mute, anchor: "middle" }); }
  items.forEach(([l, v, txt], i) => {
    const cy = top + i * rowH + rowH / 2, bl = Math.max(2, (bw * v) / max);
    s += T(bx - 10, cy + 4.5, l, { size: 12.5, anchor: "end" });
    s += `<path d="M${bx},${cy - 9} H${bx + bl - 4} Q${bx + bl},${cy - 9} ${bx + bl},${cy - 5} V${cy + 5} Q${bx + bl},${cy + 9} ${bx + bl - 4},${cy + 9} H${bx} Z" fill="${color}"/>`;
    s += T(bx + bl + 8, cy + 4.5, txt, { size: 12.5, bold: true });
  });
  s += `<line x1="${bx}" y1="${top}" x2="${bx}" y2="${top + h}" stroke="${C.mute}"/>`;
  if (ref) { const rx = bx + (bw * ref[0]) / max; s += `<line x1="${rx}" y1="${top - 6}" x2="${rx}" y2="${top + h}" stroke="${C.blue}" stroke-width="1.5" stroke-dasharray="5 4"/>` + T(rx + 4, top - 8, ref[1], { size: 11, color: C.blue }); }
  return { s, h: 30 + h + 24 };
}
const pct = (n, tot) => [n, (n / tot) * 100];
const fmt = (v) => v.toFixed(1).replace(".", ",") + "%";

// 4.41
{
  const a = hbar(20, 20, 520, "(a) Keterpenuhan penuh per jenis pengujian", [["Fungsional (39 butir)", 100, "100,0%"], ["Performa (6 butir)", 83.3, "83,3%"], ["Aksesibilitas (8 butir)", 87.5, "87,5%"], ["Kompatibilitas (4 butir)", 100, "100,0%"], ["Total (57 butir)", 96.5, "96,5%"]], { labelW: 170, rowH: 34 });
  const b = hbar(580, 20, 420, "(b) Skenario fungsional per ruang lingkup", [["Small (unit)", 11, "11 valid"], ["Medium (integrasi)", 25, "25 valid"], ["Big (end-to-end)", 3, "3 valid"]], { max: 28, labelW: 140, rowH: 34, color: C.blue });
  shot("g4_41", 1020, 240, a.s + b.s);
}
// 4.42
{
  const r = [["R1 Yotsuba florist", 98.57], ["R2 Stemona Creations", 94.29], ["R3 @delas.flowers", 97.14], ["R4 Florist Manado", 97.14], ["R5 Mitra Florist and gift", 95.71], ["R6 Beyoutiful Florist", 92.86], ["R7 SJ_buckets", 98.57], ["R8 Bunaken Flower 25", 97.14], ["R9 Manado Bouquet", 95.71], ["R10 Manado Rose", 94.29], ["R11 Minahasa House", 95.71], ["R12 The Flower Atelier", 92.86], ["R13 Angelic Florist", 97.14], ["R14 Bloom Craft Studio", 97.14], ["R15 Velvet Petals", 100], ["R16 Rumah Mawar Boutique", 97.14]];
  const p = hbar(20, 20, 900, "Indeks penerimaan per responden penjual (n = 16)", r.map(([l, v]) => [l, v, v.toFixed(2).replace(".", ",") + "%"]), { labelW: 220, rowH: 28, ref: [81, "batas Sangat Baik (81%)"] });
  shot("g4_42", 940, p.h + 30, p.s);
}
// 4.43
{
  const r = [["1 Registrasi & login sesuai peran", 95], ["2 Chat real-time lancar", 93.75], ["3 Notifikasi real-time tepat waktu", 95], ["4 Manajemen produk & varian harga", 97.5], ["5 Respons penawaran kustom", 95], ["6 Dashboard & rekap Excel akurat", 96.25], ["7 Aplikasi dimuat cepat", 95], ["8 Tidak crash / error", 96.25], ["9 Pesan & notifikasi tanpa jeda", 97.5], ["10 Tampilan menarik & sesuai tema", 100], ["11 Navigasi mudah dipahami", 96.25], ["12 Teks & tombol nyaman", 97.5], ["13 Mempermudah jual-beli bunga", 95], ["14 Puas & bersedia merekomendasikan", 98.75]];
  const p = hbar(20, 20, 900, "Indeks penerimaan per butir pernyataan (n = 16)", r.map(([l, v]) => [l, v, v.toFixed(2).replace(".", ",") + "%"]), { labelW: 260, rowH: 28, ref: [81, "batas Sangat Baik (81%)"] });
  shot("g4_43", 940, p.h + 30, p.s);
}
// 4.44
{
  const p = hbar(20, 20, 820, "Indeks penerimaan per aspek (n = 16)", [["Fungsional (butir 1–6)", 95.42, "95,42%"], ["Performa & keandalan (7–9)", 96.25, "96,25%"], ["Tampilan & usability (10–12)", 97.92, "97,92%"], ["Manfaat & kepuasan (13–14)", 96.88, "96,88%"], ["Keseluruhan (1–14)", 96.34, "96,34%"]], { labelW: 230, rowH: 36, ref: [81, "batas Sangat Baik (81%)"] });
  shot("g4_44", 860, p.h + 30, p.s);
}
// 4.45
{
  const a = hbar(20, 20, 480, "(a) Distribusi 224 jawaban", [["5 (Sangat setuju)", 81.7, "183 (81,7%)"], ["4 (Setuju)", 18.3, "41 (18,3%)"], ["3 (Netral)", 0, "0"], ["2 (Tidak setuju)", 0, "0"], ["1 (Sangat tidak setuju)", 0, "0"]], { labelW: 160, rowH: 32 });
  const b = hbar(540, 20, 500, "(b) Kelompok saran responden (16 toko)", [["Transaksi & komunikasi lancar", 5, "5 toko"], ["Harap terus dikembangkan", 4, "4 toko"], ["Sangat baik & responsif", 3, "3 toko"], ["Puas dengan performa", 3, "3 toko"], ["Navigasi simpel & mudah", 1, "1 toko"]], { max: 8, labelW: 200, rowH: 32, color: C.blue });
  shot("g4_45", 1060, 250, a.s + b.s);
}
// 4.46
{
  const n = 28, m = (l, k) => [l, (k / n) * 100, `${k} (${fmt((k / n) * 100)})`];
  const a = hbar(20, 20, 330, "Jenis kelamin", [m("Perempuan", 24), m("Laki-laki", 4)], { labelW: 90 });
  const b = hbar(370, 20, 330, "Usia", [m("< 18 tahun", 3), m("18–22 tahun", 23), m("23–30 tahun", 2)], { labelW: 95 });
  const c = hbar(720, 20, 380, "Pekerjaan", [m("Pelajar/Mahasiswa", 23), m("Pegawai", 2), m("Lainnya", 2), m("Tidak diisi", 1)], { labelW: 130 });
  shot("g4_46", 1120, 210, a.s + b.s + c.s);
}
// 4.47
{
  const n = 28, m = (l, k) => [l, (k / n) * 100, `${k} (${fmt((k / n) * 100)})`];
  const a = hbar(20, 20, 360, "Jenis produk", [m("Buket Bunga", 23), m("Bunga Hias", 17), m("Bunga Hidup", 15), m("Krans Bunga", 13), m("Papan Bunga", 7)], { labelW: 100 });
  const b = hbar(400, 20, 360, "Momen pembelian", [m("Wisuda", 21), m("Ulang Tahun", 17), m("Duka Cita", 13), m("Hari Raya", 12), m("Pernikahan", 5), m("Lainnya", 5)], { labelW: 100 });
  const c = hbar(780, 20, 400, "Media pemesanan", [m("Instagram", 20), m("Datang ke toko", 19), m("WhatsApp", 13), m("Marketplace umum", 8)], { labelW: 130 });
  shot("g4_47", 1200, 270, a.s + b.s + c.s + T(20, 262, "Butir pilihan ganda (n = 28), sehingga total persentase dapat melebihi 100%.", { size: 11.5, color: C.mute }));
}
// 4.48
{
  const n = 28, m = (l, k) => [l, (k / n) * 100, `${k} (${fmt((k / n) * 100)})`];
  const a = hbar(20, 20, 560, "(a) Kendala pembelian bunga", [m("Sulit mencari toko terdekat", 18), m("Sulit mencari referensi desain", 11), m("Pilihan produk terbatas", 10), m("Sulit membandingkan toko", 7), m("Tidak ada katalog jelas", 6), m("Harga tidak transparan", 5), m("Proses pemesanan lama", 3)], { labelW: 210 });
  const b = hbar(620, 20, 440, "(b) Frekuensi kesulitan karena waktu mepet", [m("Tidak pernah", 3), m("Kadang-kadang", 13), m("Sering", 8), m("Sangat sering", 4)], { labelW: 120, color: C.blue });
  shot("g4_48", 1080, 300, a.s + b.s);
}
// 4.49
{
  const n = 28, m = (l, k) => [l, (k / n) * 100, `${k} (${fmt((k / n) * 100)})`];
  const p = hbar(20, 20, 820, "Fitur yang dinilai penting oleh responden pembeli (n = 28)", [m("Rekomendasi/referensi model bunga", 26), m("Chat dengan penjual", 23), m("Pencarian berdasarkan kategori", 20), m("Pelacakan status pesanan", 14), m("Pre-order", 10), m("Informasi jadwal wisuda/acara", 6)], { labelW: 250, rowH: 34 });
  shot("g4_49", 860, p.h + 30, p.s);
}
// 4.50
{
  const p = hbar(20, 20, 880, "Indeks penerimaan per butir sisi pembeli", [["1 Pemesanan bunga secara daring", 83.6, "83,6%"], ["2 Fitur lokasi toko (n = 27)*", 94.1, "94,1%"], ["3 Ketertarikan aplikasi khusus", 85.0, "85,0%"], ["4 Kebutuhan fitur pre-order", 72.9, "72,9%"], ["5 Informasi jadwal wisuda/acara", 77.9, "77,9%"], ["6 Niat menggunakan aplikasi", 91.4, "91,4%"], ["Rata-rata", 84.1, "84,1%"]], { labelW: 260, rowH: 34, ref: [81, "batas Sangat Baik (81%)"] });
  shot("g4_50", 920, p.h + 50, p.s + T(20, p.h + 40, "* satu responden tidak mengisi butir 2; butir lain dihitung dari 28 responden.", { size: 11.5, color: C.mute }));
}
// 4.51 stacked Likert
{
  const steps = ["#7A3B4E", "#A8667A", "#D3A5B3", "#E8D3DA", "#F5ECEF"], labs = ["Sangat tertarik/mungkin (5)", "Tertarik/mungkin (4)", "Netral (3)", "Kurang (2)", "Tidak (1)"];
  const rows = [["Ketertarikan terhadap aplikasi", [10, 15, 3, 0, 0]], ["Niat menggunakan aplikasi", [16, 12, 0, 0, 0]]];
  let s = T(20, 34, "Distribusi jawaban responden pembeli (n = 28)", { size: 14, bold: true });
  const bx = 240, bw = 600;
  rows.forEach(([l, v], i) => {
    const y = 60 + i * 56; let x = bx;
    s += T(bx - 10, y + 22, l, { size: 12.5, anchor: "end" });
    v.forEach((k, j) => { if (!k) return; const w = (bw * k) / 28; s += `<rect x="${x}" y="${y}" width="${w - 2}" height="34" fill="${steps[j]}"/>` + T(x + w / 2, y + 22, w < 90 ? `${k}` : `${k} (${fmt((k / 28) * 100)})`, { size: 12, anchor: "middle", color: j < 2 ? "#fff" : C.ink, bold: true }); x += w; });
  });
  labs.forEach((l, j) => { const x = 20 + j * 172 + (j > 0 ? 50 : 0); s += `<rect x="${x}" y="190" width="14" height="14" fill="${steps[j]}" stroke="#ccc"/>` + T(x + 20, 202, l, { size: 11.5 }); });
  shot("g4_51", 900, 220, s);
}

// ---------- wireframes ----------
function phone(x, y, title, els) {
  const W = 230, H = 460;
  let s = `<rect x="${x}" y="${y}" width="${W}" height="${H}" rx="26" fill="#fff" stroke="${C.ink}" stroke-width="2"/><rect x="${x + 85}" y="${y + 10}" width="60" height="8" rx="4" fill="${C.wfM}"/>`;
  s += T(x + W / 2, y + H + 24, title, { size: 13, bold: true, anchor: "middle" });
  const cx = x + 14, cw = W - 28; let cy = y + 30;
  for (const e of els) {
    const [k, a, b] = e;
    if (k === "bar") { s += `<rect x="${cx}" y="${cy}" width="${cw}" height="30" rx="4" fill="${C.wfL}"/>` + T(cx + 10, cy + 20, a, { size: 12, bold: true }); cy += 38; }
    else if (k === "in") { s += T(cx, cy + 10, a, { size: 10.5, color: C.mute }) + `<rect x="${cx}" y="${cy + 14}" width="${cw}" height="26" rx="5" fill="#fff" stroke="${C.wf}"/>` + T(cx + 8, cy + 31, b || "", { size: 10.5, color: C.wf }); cy += 46; }
    else if (k === "img") { s += `<rect x="${cx}" y="${cy}" width="${cw}" height="${a}" rx="6" fill="${C.wfL}" stroke="${C.wfM}"/><line x1="${cx}" y1="${cy}" x2="${cx + cw}" y2="${cy + a}" stroke="${C.wfM}"/><line x1="${cx + cw}" y1="${cy}" x2="${cx}" y2="${cy + a}" stroke="${C.wfM}"/>` + (b ? T(cx + cw / 2, cy + a / 2 + 4, b, { size: 11, anchor: "middle", color: C.mute }) : ""); cy += a + 8; }
    else if (k === "chips") { let xx = cx; a.forEach((c) => { const w = c.length * 6.4 + 16; s += `<rect x="${xx}" y="${cy}" width="${w}" height="22" rx="11" fill="#fff" stroke="${C.wf}"/>` + T(xx + w / 2, cy + 15, c, { size: 10, anchor: "middle" }); xx += w + 6; }); cy += 30; }
    else if (k === "grid") { const gw = (cw - 8) / 2; for (let i = 0; i < a; i++) { const gx = cx + (i % 2) * (gw + 8), gy = cy + Math.floor(i / 2) * 78; s += `<rect x="${gx}" y="${gy}" width="${gw}" height="70" rx="6" fill="${C.wfL}" stroke="${C.wfM}"/><rect x="${gx + 8}" y="${gy + 48}" width="${gw - 30}" height="7" rx="3" fill="${C.wf}"/><rect x="${gx + 8}" y="${gy + 59}" width="${gw / 2}" height="6" rx="3" fill="${C.wfM}"/>`; } cy += Math.ceil(a / 2) * 78; }
    else if (k === "btn") { s += `<rect x="${cx}" y="${cy}" width="${cw}" height="32" rx="6" fill="${b ? "#fff" : C.ink}" stroke="${C.ink}"/>` + T(cx + cw / 2, cy + 21, a, { size: 12, bold: true, anchor: "middle", color: b ? C.ink : "#fff" }); cy += 40; }
    else if (k === "txt") { s += T(cx, cy + 12, a, { size: b || 11, color: C.ink }); cy += 20; }
    else if (k === "lines") { for (let i = 0; i < a; i++) s += `<rect x="${cx}" y="${cy + i * 13}" width="${cw * (i === a - 1 ? 0.6 : 1)}" height="7" rx="3" fill="${C.wfM}"/>`; cy += a * 13 + 6; }
    else if (k === "nav") { const ny = y + H - 50; s += `<line x1="${x + 1}" y1="${ny}" x2="${x + W - 1}" y2="${ny}" stroke="${C.wf}"/>`; a.forEach((n, i) => { const nx = x + (W / a.length) * (i + 0.5); s += `<circle cx="${nx}" cy="${ny + 16}" r="7" fill="${i === 0 ? C.ink : C.wfM}"/>` + T(nx, ny + 38, n, { size: 9, anchor: "middle" }); }); }
    else if (k === "icons") { const n = a, gw = (cw - (n - 1) * 8) / n; for (let i = 0; i < n; i++) { const gx = cx + i * (gw + 8); s += `<rect x="${gx}" y="${cy}" width="${gw}" height="40" rx="8" fill="#fff" stroke="${C.wf}"/><circle cx="${gx + gw / 2}" cy="${cy + 20}" r="10" fill="${C.wfM}"/>`; } cy += 48; }
    else if (k === "btnrow") { const gw = (cw - 2) / 2; a.forEach((lb, i) => { const gx = cx + i * (gw + 2); s += `<rect x="${gx}" y="${cy}" width="${gw}" height="28" rx="4" fill="${i ? "#fff" : C.ink}" stroke="${C.ink}"/>` + T(gx + gw / 2, cy + 18, lb, { size: 10.5, bold: true, anchor: "middle", color: i ? C.ink : "#fff" }); }); cy += 36; }
    else if (k === "scroll") { s += `<rect x="${x + W - 11}" y="${y + 110}" width="4" height="${H - 150}" rx="2" fill="${C.wfL}"/><rect x="${x + W - 11}" y="${y + 110}" width="4" height="90" rx="2" fill="${C.wf}"/>` + T(x + W / 2, y + H - 14, "⋮ form berlanjut — perlu scroll panjang", { size: 9.5, anchor: "middle", color: C.mute }); }
    else if (k === "mark") { s += `<circle cx="${x + W - 4}" cy="${cy + 12}" r="11" fill="${C.rose}"/>` + T(x + W - 4, cy + 16.5, String(a), { size: 12, bold: true, anchor: "middle", color: "#fff" }) + `<line x1="${x + W - 15}" y1="${cy + 12}" x2="${x + W - 24}" y2="${cy + 12}" stroke="${C.rose}" stroke-width="2"/>`; }
    else if (k === "list") { for (let i = 0; i < a; i++) { s += `<rect x="${cx}" y="${cy}" width="${cw}" height="44" rx="6" fill="#fff" stroke="${C.wfM}"/><rect x="${cx + 6}" y="${cy + 6}" width="32" height="32" rx="4" fill="${C.wfL}"/><rect x="${cx + 46}" y="${cy + 12}" width="${cw * 0.5}" height="7" rx="3" fill="${C.wf}"/><rect x="${cx + 46}" y="${cy + 26}" width="${cw * 0.35}" height="6" rx="3" fill="${C.wfM}"/>`; cy += 50; } }
  }
  return s;
}
const arrow = (x, y) => `<path d="M${x},${y} h30" stroke="${C.ink}" stroke-width="2"/><path d="M${x + 30},${y - 6} l10,6 l-10,6 z" fill="${C.ink}"/>`;
// Wireframe v01.0 = kondisi SEBELUM evaluasi responden. Penanda bernomor (①–⑤)
// menunjuk ke nomor temuan pada Tabel 4.1, sehingga gambar dan tabel saling sesuai.
const NAV = ["Beranda", "Toko", "Pesanan", "Chat", "Profil"]; // v01.0 (tab Referensi baru ada di v03.0)
const LEG = (x, y) => T(x, y, "Penanda bernomor merah = nomor temuan responden pada Tabel 4.1", { size: 11, color: C.rose });
shot("g4_1", 440, 540, phone(105, 15, "Beranda Pembeli (v01.0)", [["bar", "Bloemen          🔔"], ["in", "", "Cari bunga atau toko…"], ["img", 70, "Banner promo"], ["txt", "Kategori", 12], ["mark", 1], ["icons", 4], ["txt", "Toko Terdekat", 12], ["mark", 4], ["grid", 2], ["nav", NAV]]) + LEG(12, 532).replace("font-size=\"11\"", "font-size=\"10.5\""));
shot("g4_2", 580, 540, phone(15, 15, "1. Daftar sebagai Penjual", [["bar", "Daftar Akun"], ["chips", ["Pembeli", "Penjual ✓"]], ["in", "Nama lengkap"], ["in", "Email"], ["in", "Nomor telepon"], ["in", "Kata sandi"], ["btn", "Daftar"]]) + arrow(255, 245) + phone(305, 15, "2. Registrasi Toko (satu halaman)", [["bar", "Registrasi Toko"], ["mark", 3], ["img", 44, "Foto banner"], ["in", "Nama toko"], ["in", "Deskripsi"], ["chips", ["Buket", "Papan", "Hias"]], ["img", 54, "Peta (pilih titik)"], ["in", "Alamat lengkap"], ["in", "Jam buka – tutup", "08.00 – 20.00"], ["scroll"]]) + LEG(15, 532));
shot("g4_3", 1135, 540,
  phone(15, 15, "1. Detail Toko", [["bar", "‹  Detail Toko"], ["img", 90, "Foto toko"], ["txt", "Toko Bunga Melati", 13], ["txt", "★ 4,8 · Jl. Sam Ratulangi, Manado"], ["mark", 5], ["lines", 2], ["txt", "Produk", 12], ["list", 2]]) + arrow(255, 245) +
  phone(305, 15, "2. Detail Produk", [["bar", "‹  Detail Produk"], ["img", 130, "Foto produk"], ["txt", "Buket Mawar Merah", 13], ["txt", "Rp 250.000"], ["chips", ["S", "M", "L", "XL"]], ["mark", 2], ["btnrow", ["Pre-Order", "Chat Penjual"]]]) + arrow(545, 245) +
  phone(595, 15, "3. Formulir Pre-Order", [["bar", "‹  Pre-Order"], ["in", "Jumlah", "1"], ["chips", ["Ambil sendiri", "Kirim ✓"]], ["in", "Tanggal & jam", "min. hari ini + durasi"], ["in", "Alamat lengkap"], ["in", "Catatan"], ["btn", "Kirim Pesanan"]]) + arrow(835, 245) +
  phone(885, 15, "4. Riwayat Pesanan", [["bar", "Pesanan Saya"], ["chips", ["Semua", "Pending", "Diproses"]], ["list", 4], ["nav", NAV]]) + LEG(15, 532));
{
  let s = `<rect x="15" y="15" width="460" height="460" rx="26" fill="#fff" stroke="${C.ink}" stroke-width="2"/>`;
  s += `<rect x="16" y="45" width="190" height="429" fill="${C.wfL}"/>` + T(30, 70, "Bloemen Seller", { size: 13, bold: true });
  ["Produk", "Pesanan", "Chat", "Pengaturan Toko", "Keluar"].forEach((m, i) => { s += `<rect x="28" y="${88 + i * 42}" width="166" height="32" rx="6" fill="${i === 0 ? C.ink : "#fff"}" stroke="${C.wfM}"/>` + T(42, 109 + i * 42, m, { size: 12, color: i === 0 ? "#fff" : C.ink }); });
  s += `<rect x="206" y="45" width="268" height="429" fill="#000" opacity="0.12"/>` + T(340, 80, "Halaman Produk", { size: 12, color: C.mute, anchor: "middle" });
  for (let i = 0; i < 5; i++) s += `<rect x="222" y="${100 + i * 56}" width="238" height="46" rx="6" fill="#fff" stroke="${C.wfM}"/><rect x="230" y="${108 + i * 56}" width="30" height="30" rx="4" fill="${C.wfL}"/><rect x="270" y="${114 + i * 56}" width="120" height="7" rx="3" fill="${C.wf}"/><rect x="270" y="${127 + i * 56}" width="80" height="6" rx="3" fill="${C.wfM}"/>`;
  s += T(245, 498, "Sidebar navigasi penjual v01.0 (drawer) di atas halaman Produk", { size: 13, bold: true, anchor: "middle" });
  shot("g4_4", 490, 515, s);
}
