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

// =============== Gambar 2.1 Tahapan RAD ===============
{
  let s = "";
  const W = 1000, H = 420;
  s += box("p", 120, 200, 170, 80, "<b>Requirements<br>Planning</b>", { fill: C.roseL, stroke: C.rose, size: 15 });
  s += `<rect x="280" y="40" width="430" height="330" rx="18" fill="${C.sand}" stroke="${C.rose}" stroke-dasharray="7 5" stroke-width="1.4"/>`;
  s += text(280, 46, 430, 26, "Siklus iteratif (3 iterasi: v01.0 → v02.0 → v03.0)", { size: 13, italic: true, color: C.rose });
  s += box("ud", 400, 200, 170, 80, "<b>User Design</b>", { fill: C.blue, stroke: C.blueD, size: 15 });
  s += box("rc", 600, 200, 170, 80, "<b>Rapid<br>Construction</b>", { fill: C.blue, stroke: C.blueD, size: 15 });
  s += box("c", 870, 200, 170, 80, "<b>Cutover</b>", { fill: C.green, stroke: C.greenD, size: 15 });
  s += edge("p", "ud");
  s += edge("ud", "rc", { pts: [[485, 170 - 10]], from: "r", to: "l" }).replace(/M[^ ]+ L[^ ]+ L/, (m) => m);
  s = s.replace(/<path d="M485,200 L485,160 L515,200"[^>]*\/>/, "");
  s += `<path d="M485,180 C510,150 490,150 515,180" fill="none"/>`;
  s += `<path d="M400,160 C430,95 570,95 600,160" fill="none" stroke="${C.line}" stroke-width="1.5" marker-end="url(#ar)"/>`;
  s += `<path d="M600,240 C570,305 430,305 400,240" fill="none" stroke="${C.line}" stroke-width="1.5" marker-end="url(#ar)"/>`;
  s += text(420, 88, 160, 22, "Bangun prototipe", { size: 12, italic: true, color: C.rose });
  s += text(390, 300, 220, 50, "Evaluasi bersama responden<br>&amp; perbaikan", { size: 12, italic: true, color: C.rose });
  s += edge("rc", "c");
  s += text(30, 250, 180, 60, "Identifikasi kebutuhan (observasi, kuesioner, wawancara)", { size: 11.5, color: "#555" });
  s += text(780, 250, 180, 60, "Pengujian alpha &amp; UAT, build APK final", { size: 11.5, color: "#555" });
  shot("g2_1_rad", W, H, s);
}

// =============== Gambar 3.1 Kerangka Pikir ===============
{
  let s = "";
  const W = 900, H = 1060, cx = 450;
  const steps = [
    ["m", "<b>Identifikasi Masalah</b><br>Penjual bunga di Sulawesi Utara belum memiliki kanal digital terpusat; pembeli sulit menemukan toko terdekat, referensi desain, dan memesan pada waktu mepet", C.roseL, C.rose, 110],
    ["s", "<b>Solusi</b><br>Aplikasi mobile marketplace kreativitas bunga <b>Bloemen</b> (React + TypeScript, Supabase, Capacitor Android)", C.blue, C.blueD, 90],
    ["r1", "<b>Iterasi 1 — v01.0</b>: Requirements Planning &amp; User Design (wireframe) → evaluasi responden", "#fff", C.blueD, 70],
    ["r2", "<b>Iterasi 2 — v02.0</b>: Rapid Construction prototipe fungsional → evaluasi responden", "#fff", C.blueD, 70],
    ["r3", "<b>Iterasi 3 — v03.0</b>: fitur lanjutan (notifikasi, penawaran kustom, ulasan, diskon, referensi desain, rekap Excel) &amp; Cutover", "#fff", C.blueD, 80],
    ["t", "<b>Pengujian</b><br>Black-box: 39 skenario fungsional valid (36 skenario black-box + 3 alur end-to-end) · kompatibel pada Oppo A3X (Android 15) · UAT penjual &amp; pembeli", C.green, C.greenD, 100],
    ["h", "<b>Hasil</b><br>Aplikasi Bloemen siap digunakan penjual dan pembeli bunga di Sulawesi Utara", C.green, C.greenD, 80],
  ];
  let y = 70;
  s += start("st", cx, 30);
  let prev = "st";
  for (const [id, lab, fill, stroke, h] of steps) {
    s += box(id, cx, y + h / 2, 600, h, lab, { fill, stroke, size: 14 });
    s += edge(prev, id);
    prev = id; y += h + 42;
  }
  s += `<rect x="110" y="${N.r1.cy - 55}" width="680" height="${N.r3.cy + 60 - (N.r1.cy - 55)}" rx="16" fill="none" stroke="${C.rose}" stroke-dasharray="7 5"/>`;
  s += text(110, N.r1.cy - 55, 200, 22, "Metode RAD", { size: 13, bold: true, color: C.rose });
  s += end("en", cx, y + 6);
  s += edge(prev, "en");
  shot("g3_1_kerangka", W, y + 30, s);
}

// =============== Gambar 3.2 Model Konseptual ===============
{
  let s = "";
  const W = 1000, H = 560;
  s += actor("pb", 90, 200, "Pembeli");
  s += actor("pj", 910, 200, "Penjual");
  s += box("app", 500, 210, 460, 250, "", { fill: C.roseL, stroke: C.rose, r: 18 });
  s += text(270, 92, 460, 30, "<b>Aplikasi Bloemen (Android)</b>", { size: 16, color: C.rose });
  const mods = [["Katalog &amp; Toko Terdekat", 395, 160], ["Pre-Order &amp; Pesanan", 605, 160], ["Chat &amp; Penawaran Kustom", 395, 215], ["Ulasan &amp; Notifikasi", 605, 215], ["Referensi Desain", 395, 270], ["Dashboard &amp; Rekap Excel", 605, 270]];
  mods.forEach(([l, x, y], i) => (s += box("m" + i, x, y, 190, 42, l, { fill: "#fff", stroke: C.rose, size: 12.5, r: 8 })));
  s += box("sb", 360, 470, 300, 90, "<b>Supabase</b><br>Auth · PostgreSQL (RLS) · Realtime · Storage", { fill: C.blue, stroke: C.blueD, size: 13 });
  s += box("wk", 700, 470, 260, 90, "<b>Wikimedia Commons API</b><br>(REST API, tanpa API key)", { fill: C.green, stroke: C.greenD, size: 13 });
  s += edge("pb", "app", { from: "r", to: "l", label: "cari, pesan, chat" , lpos:[200,180]});
  s += edge("pj", "app", { from: "l", to: "r", label: "kelola toko & pesanan", lpos: [800, 180] });
  s += `<path d="M360,335 V425" stroke="${C.line}" stroke-width="1.5" marker-end="url(#ar)" marker-start="url(#ar)"/><path d="M700,335 V425" stroke="${C.line}" stroke-width="1.5" marker-end="url(#ar)"/>`;
  s += text(370, 360, 200, 24, "data &amp; real-time", { size: 12, italic: true, color: C.rose, align: "left" }) + text(710, 360, 220, 24, "gambar inspirasi (HTTPS GET)", { size: 12, italic: true, color: C.rose, align: "left" });
  shot("g3_2_konseptual", W, H, s);
}

// =============== Gambar 3.3 ERD ===============
{
  let s = "";
  const W = 1420, H = 1000;
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
    ["messages", 1140, 560, "messages", ["PK id", "FK conversation_id", "FK sender_id", "FK receiver_id", "message, is_read"]],
    ["quotes", 1140, 760, "custom_order_quotes", ["PK id", "FK conversation_id", "FK shop_id", "FK seller_id, buyer_id", "product_name, price", "status, expires_at"]],
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
  s += rel("conversations", "quotes", "1", "N", { from: "r", to: "r", pts: [[1395, N.conversations.cy], [1395, N.quotes.cy]] });
  s += text(30, 955, 1300, 30, "Keterangan: PK = Primary Key, FK = Foreign Key; 1 dan N menunjukkan kardinalitas relasi (satu ke banyak). Seluruh tabel berada pada skema public Supabase PostgreSQL dengan Row Level Security.", { size: 12.5, align: "left", color: "#555" });
  shot("g3_3_erd", W, H, s);
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
  [["Auth", "Sesi & JWT, multi-peran"], ["PostgreSQL", "10 tabel + RLS"], ["Realtime", "Chat & notifikasi"], ["Storage", "Bucket images"]].forEach(([a, b], i) => (s += box("s" + i, 115 + i * 163, 460, 145, 110, `<b>${a}</b><br><span style="font-size:12px">${b}</span>`, { fill: "#fff", stroke: C.blueD, size: 14, r: 8 })));
  s += box("wk", 850, 440, 260, 230, "<b>LAYANAN EKSTERNAL</b><br><br><b>Wikimedia Commons API<br>(REST API)</b><br><span style='font-size:12px'>MediaWiki api.php · JSON · tanpa API key</span>", { fill: C.green, stroke: C.greenD, size: 14, r: 16 });
  s += `<path d="M360,172 V322" stroke="${C.line}" stroke-width="2" marker-end="url(#ar)" marker-start="url(#ar)"/>`;
  s += `<path d="M850,172 V322" stroke="${C.line}" stroke-width="2" marker-end="url(#ar)" marker-start="url(#ar)"/>`;
  s += text(370, 215, 330, 60, "HTTPS REST &amp; WebSocket<br>(@supabase/supabase-js, JWT)", { size: 12.5, italic: true, color: C.rose, align: "left" });
  s += text(860, 225, 140, 50, "HTTPS GET<br>(REST, JSON)", { size: 12.5, italic: true, color: C.rose, align: "left" });
  shot("g3_4_arsitektur", W, H, s);
}

// =============== Gambar 3.5 Use Case ===============
{
  let s = "";
  const W = 1000, H = 860;
  s += `<rect x="230" y="20" width="540" height="820" rx="12" fill="${C.sand}" stroke="${C.line}" stroke-width="1.5"/>`;
  s += text(230, 24, 540, 30, "<b>Sistem Aplikasi Bloemen</b>", { size: 16 });
  const ucs = ["UC-01 Registrasi Akun", "UC-02 Login Sistem", "UC-09 Lihat Referensi Desain Bunga", "UC-05 Buat Pesanan Pre-Order", "UC-06 Chat Real-time", "UC-08 Beri Ulasan dan Rating", "UC-03 Kelola Profil Toko", "UC-04 Kelola Produk", "UC-07 Kelola Pesanan Masuk", "UC-10 Lihat Dashboard &amp; Unduh Rekap Excel"];
  ucs.forEach((u, i) => (s += box("u" + i, 500, 95 + i * 73, 330, 54, u, { shape: "ellipse", fill: i < 2 || i === 4 ? "#fff" : i < 6 ? C.roseL : C.blue, stroke: i < 6 ? C.rose : C.blueD, size: 13 })));
  s += actor("pg", 100, 180, "Pengunjung");
  s += actor("pb", 100, 470, "Pembeli");
  s += actor("pj", 900, 480, "Penjual");
  s += `<path d="M100,425 V245" stroke="${C.line}" stroke-width="1.5" fill="none" marker-end="url(#ao)"/>`;
  s += `<text x="108" y="345" font-family="Arial" font-size="11" font-style="italic" fill="#555">generalisasi</text>`;
  const ln = (a, u) => `<line x1="${N[a].cx + (N[a].cx < 500 ? 22 : -22)}" y1="${N[a].cy - 8}" x2="${N["u" + u].cx + (N[a].cx < 500 ? -165 : 165) * Math.sqrt(Math.max(0, 1 - 0))}" y2="${N["u" + u].cy}" stroke="${C.line}" stroke-width="1.2"/>`;
  [2].forEach((u) => (s += ln("pg", u)));
  [0, 1, 3, 4, 5].forEach((u) => (s += ln("pb", u)));
  [0, 1, 4, 6, 7, 8, 9].forEach((u) => (s += ln("pj", u)));
  s += text(240, 790, 520, 40, "Pengunjung dapat melihat Referensi Desain tanpa login; login diperlukan saat \"Kirim ke Toko\".", { size: 11.5, italic: true, color: "#555" });
  shot("g3_5_usecase", W, H, s);
}

// =============== Activity diagrams ===============
function lanes(names, W, H) {
  const lw = W / names.length;
  let s = `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="#fff" stroke="${C.ink}" stroke-width="1.5"/>`;
  names.forEach((n, i) => {
    s += `<rect x="${i * lw + 1}" y="1" width="${lw - 2}" height="44" fill="${[C.roseL, C.blue, C.green][i]}"/>`;
    if (i) s += `<line x1="${i * lw}" y1="1" x2="${i * lw}" y2="${H}" stroke="${C.ink}" stroke-width="1.2"/>`;
    s += text(i * lw, 1, lw, 44, `<b>${n}</b>`, { size: 15 });
  });
  s += `<line x1="0" y1="45" x2="${W}" y2="45" stroke="${C.ink}" stroke-width="1.2"/>`;
  return [s, (i) => i * lw + lw / 2];
}
const A = (id, x, y, l, w = 230, h = 50) => box(id, x, y, w, h, l, { size: 12.5, r: 16, fill: "#fff" });
const Dm = (id, x, y, l) => box(id, x, y, 150, 74, l, { shape: "diamond", size: 11.5, fill: C.sand });

{ // 3.6 Registrasi
  const W = 760, H = 900;
  let [s, X] = lanes(["Pengguna", "Sistem"], W, H);
  s += start("s", X(0), 80);
  s += A("a1", X(0), 150, "Membuka aplikasi dan memilih \"Daftar\"");
  s += A("a2", X(1), 150, "Menampilkan form registrasi dengan toggle peran");
  s += A("a3", X(0), 250, "Memilih peran (Pembeli/Penjual) dan mengisi data akun");
  s += A("a4", X(1), 250, "Memvalidasi data (email, kata sandi minimal 6 karakter)");
  s += Dm("d1", X(1), 360, "Data valid?");
  s += A("a5", X(0), 360, "Melihat pesan kesalahan", 200);
  s += A("a6", X(1), 470, "Membuat akun di Supabase Auth dan menyimpan profil ke tabel users");
  s += Dm("d2", X(1), 580, "Peran?");
  s += A("a7", X(0), 690, "Mengisi registrasi toko (khusus Penjual)");
  s += A("a8", X(1), 690, "Mengarahkan ke Beranda / Dashboard sesuai peran");
  s += end("e", X(1), 800);
  s += edge("s", "a1") + edge("a1", "a2") + edge("a2", "a3", { from: "b", to: "r", pts: [[X(1), 200], [X(0) + 150, 200], [X(0) + 150, 250]] });
  s = s.replace(/<path d="M570,175 L570,200 L340,200 L340,250 L305,250"/, `<path d="M570,175 L570,200 L${X(0)},200 L${X(0)},225"`);
  s += edge("a3", "a4") + edge("a4", "d1");
  s += edge("d1", "a5", { from: "l", to: "r", label: "tidak", lpos: [X(0) + 155, 350] });
  s += edge("a5", "a3", { from: "t", to: "b" });
  s += edge("d1", "a6", { label: "ya", lpos: [X(1) + 20, 415] }) + edge("a6", "d2");
  s += edge("d2", "a7", { from: "l", to: "t", label: "Penjual", lpos: [X(0) + 60, 570] });
  s += edge("d2", "a8", { label: "Pembeli", lpos: [X(1) + 35, 635] });
  s += edge("a7", "a8") + edge("a8", "e");
  shot("g3_6_act_registrasi", W, 860, s);
}
{ // 3.7 Pre-Order
  const W = 960, H = 1000;
  let [s, X] = lanes(["Pembeli", "Sistem", "Penjual"], W, H);
  s += start("s", X(0), 80);
  s += A("a1", X(0), 150, "Memilih produk dan ukuran", 220);
  s += A("a2", X(0), 240, "Menekan tombol \"Pre-Order\"", 220);
  s += A("a3", X(1), 240, "Menampilkan formulir pre-order", 220);
  s += A("a4", X(0), 340, "Mengisi jumlah, metode (ambil sendiri/kirim), tanggal, alamat, catatan", 240, 64);
  s += A("a5", X(1), 340, "Memvalidasi tanggal: minimal hari ini + durasi pengerjaan produk", 240, 64);
  s += Dm("d1", X(1), 450, "Valid?");
  s += A("a6", X(0), 450, "Melihat pesan kesalahan", 200);
  s += A("a7", X(1), 560, "Menyimpan ke tabel preorders &amp; order_items (order_number otomatis)", 240, 64);
  s += A("a8", X(1), 670, "Membuat notifikasi pesanan baru", 220);
  s += A("a9", X(2), 670, "Menerima notifikasi pesanan baru (real-time)", 230);
  s += A("a10", X(0), 780, "Melihat pesanan berstatus pending di Riwayat Pesanan", 240, 64);
  s += A("a11", X(2), 780, "Meninjau pesanan di Manajemen Pesanan", 230);
  s += end("e", X(1), 900);
  s += edge("s", "a1") + edge("a1", "a2") + edge("a2", "a3") + edge("a3", "a4", { from: "b", to: "r", pts: [[X(1), 290], [X(0) + 150, 290], [X(0) + 150, 340]] });
  s = s.replace(/<path d="M480,265 L480,290 L310,290 L310,340 L280,340"/, `<path d="M480,265 L480,290 L${X(0)},290 L${X(0)},308"`);
  s += edge("a4", "a5") + edge("a5", "d1");
  s += edge("d1", "a6", { from: "l", to: "r", label: "tidak", lpos: [X(0) + 160, 440] });
  s += edge("a6", "a4", { from: "t", to: "b" });
  s += edge("d1", "a7", { label: "ya", lpos: [X(1) + 18, 505] }) + edge("a7", "a8") + edge("a8", "a9");
  s += edge("a8", "a10", { from: "b", to: "t", my: 735 });
  s += edge("a9", "a11");
  s += edge("a10", "e", { from: "b", to: "l", pts: [[X(0), 900]] }) + edge("a11", "e", { from: "b", to: "r", pts: [[X(2), 900]] });
  shot("g3_7_act_preorder", W, H, s);
}
{ // 3.8 Chat
  const W = 960, H = 940;
  let [s, X] = lanes(["Pembeli", "Sistem", "Penjual"], W, H);
  s += start("s", X(0), 80);
  s += A("a1", X(0), 150, "Membuka detail toko/produk lalu menekan \"Chat\"", 240, 60);
  s += A("a2", X(1), 150, "Mencari atau membuat percakapan (conversations)", 240, 60);
  s += A("a3", X(1), 250, "Menampilkan ruang chat (ChatRoom)", 230);
  s += A("a4", X(0), 250, "Menulis pesan / melampirkan referensi desain", 240, 60);
  s += A("a5", X(1), 360, "Menyimpan ke tabel messages dan menyiarkan via Supabase Realtime", 250, 64);
  s += A("a6", X(1), 470, "Membuat notifikasi pesan baru", 230);
  s += A("a7", X(2), 470, "Menerima pesan secara real-time", 220);
  s += Dm("d1", X(2), 580, "Perlu harga khusus?");
  s += A("a8", X(2), 700, "Mengirim kartu penawaran harga kustom", 230, 60);
  s += A("a9", X(2), 580 + 0, "", 0, 0);
  s += A("a10", X(1), 790, "Menampilkan balasan / penawaran ke pembeli", 240, 60);
  s += A("a11", X(0), 790, "Membaca balasan; menerima atau menolak penawaran", 240, 60);
  s += end("e", X(0), 890);
  s += edge("s", "a1") + edge("a1", "a2") + edge("a2", "a3") + edge("a3", "a4") + edge("a4", "a5", { from: "b", to: "l", pts: [[X(0), 360]] });
  s += edge("a5", "a6") + edge("a6", "a7") + edge("a7", "d1");
  s += edge("d1", "a8", { label: "ya", lpos: [X(2) + 18, 640] });
  s += edge("d1", "a10", { from: "l", to: "t", pts: [[X(1) + 60, 580], [X(1) + 60, 760]], label: "tidak (balas teks)", lpos: [X(1) + 110, 560] });
  s += edge("a8", "a10", { from: "b", to: "r", pts: [[X(2), 790]] });
  s += edge("a10", "a11") + edge("a11", "e");
  shot("g3_8_act_chat", W, H, s);
}
{ // 3.9 Status pesanan
  const W = 960, H = 980;
  let [s, X] = lanes(["Penjual", "Sistem", "Pembeli"], W, H);
  s += start("s", X(0), 80);
  s += A("a1", X(0), 150, "Membuka Manajemen Pesanan dan memilih pesanan", 240, 60);
  s += A("a2", X(1), 150, "Menampilkan detail pesanan (status pending)", 240, 60);
  s += Dm("d1", X(0), 270, "Terima pesanan?");
  s += A("a3", X(1), 270, "Mengubah status ke cancelled", 220);
  s += A("a4", X(0), 390, "Mengonfirmasi pesanan", 220);
  s += A("a5", X(1), 390, "Mengubah status ke confirmed", 220);
  s += A("a6", X(0), 500, "Memperbarui status berikutnya (processing → ready → delivered)", 250, 64);
  s += A("a7", X(1), 500, "Menyimpan status ke tabel preorders", 230);
  s += A("a8", X(1), 610, "Membuat notifikasi perubahan status", 230);
  s += A("a9", X(2), 610, "Menerima notifikasi status pesanan", 230);
  s += Dm("d2", X(1), 730, "Status delivered?");
  s += A("a10", X(2), 840, "Dapat memberikan ulasan dan rating", 230);
  s += end("e", X(1), 920);
  s += edge("s", "a1") + edge("a1", "a2") + edge("a2", "d1", { from: "b", to: "r", pts: [[X(1), 215], [X(0) + 120, 215], [X(0) + 120, 270]] });
  s = s.replace(/<path d="M480,180 L480,215 L280,215 L280,270 L235,270"/, `<path d="M480,180 L480,215 L${X(0)},215 L${X(0)},233"`);
  s += edge("d1", "a3", { from: "r", to: "l", label: "tidak", lpos: [X(0) + 125, 260] });
  s += edge("d1", "a4", { label: "ya", lpos: [X(0) + 15, 340] });
  s += edge("a4", "a5") + edge("a5", "a6", { from: "b", to: "r", pts: [[X(1), 440], [X(0) + 150, 440], [X(0) + 150, 500]] });
  s = s.replace(/<path d="M480,415 L480,440 L310,440 L310,500 L285,500"/, `<path d="M480,415 L480,440 L${X(0)},440 L${X(0)},468"`);
  s += edge("a6", "a7") + edge("a7", "a8") + edge("a8", "a9") + edge("a8", "d2");
  s += edge("d2", "a6", { from: "l", to: "b", pts: [[X(0), 730]], label: "belum", lpos: [X(0) + 130, 720] });
  s += edge("d2", "a10", { from: "r", to: "t", label: "ya", lpos: [X(1) + 110, 720] });
  s += edge("a3", "a8", { from: "r", to: "r", pts: [[X(1) + 140, 270], [X(1) + 140, 610]] });
  s += edge("a10", "e", { from: "b", to: "r", pts: [[X(2), 920]] });
  shot("g3_9_act_status", W, H, s);
}
