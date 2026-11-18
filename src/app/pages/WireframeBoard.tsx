import { useState } from "react";
import type { ReactNode } from "react";
import { AppScreensSection, APP_SCREEN_COUNT } from "./AppScreensBoard";

/**
 * Papan wireframe low-fidelity Bloemen v01.0 (17 halaman).
 * Buka /wireframe di preview Figma Make → Edit › Copy designs › Whole page,
 * lalu paste di file Figma Design untuk mendapatkan layer yang bisa diedit.
 *
 * Gaya sengaja hitam-putih (lo-fi): kotak abu-abu, placeholder gambar bersilang,
 * tanpa warna merek. Kondisi yang digambar adalah v01.0 SEBELUM evaluasi,
 * sesuai temuan pada Tabel 4.1 (penanda ①–⑤ dapat ditampilkan/disembunyikan).
 */

let SHOW_MARKERS = false;

/* ---------------- primitives ---------------- */
function Marker({ n }: { n: number }) {
  if (!SHOW_MARKERS) return null;
  return (
    <span className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[#7A3B4E] text-white text-[13px] font-bold flex items-center justify-center shadow">
      {n}
    </span>
  );
}

function Frame({ no, title, group, children, nav, navActive = 0 }: { no: number; title: string; group: string; children: ReactNode; nav?: boolean; navActive?: number }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2 px-1">
        <span className="text-[13px] font-semibold text-neutral-400 tabular-nums">{String(no).padStart(2, "0")}</span>
        <h3 className="text-[15px] font-semibold text-neutral-900">{title}</h3>
        <span className="text-[12px] text-neutral-400">· {group}</span>
      </div>
      <div className="relative w-[390px] h-[844px] rounded-[44px] border-[3px] border-neutral-900 bg-white overflow-hidden flex flex-col shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="h-11 shrink-0 flex items-center justify-between px-7 text-[12px] font-semibold text-neutral-800">
          <span>9:41</span>
          <span className="w-24 h-6 rounded-full bg-neutral-900" />
          <span className="flex gap-1">
            <span className="w-4 h-2.5 rounded-sm bg-neutral-800" />
            <span className="w-5 h-2.5 rounded-sm border border-neutral-800" />
          </span>
        </div>
        <div className="flex-1 min-h-0 flex flex-col gap-3 px-5 pb-4 overflow-hidden">{children}</div>
        {nav && <BottomNav active={navActive} />}
      </div>
    </section>
  );
}

function BottomNav({ active }: { active: number }) {
  const items = ["Beranda", "Toko", "Pesanan", "Chat", "Profil"];
  return (
    <div className="h-[76px] shrink-0 border-t border-neutral-300 flex items-start justify-around pt-3">
      {items.map((n, i) => (
        <div key={n} className="flex flex-col items-center gap-1">
          <span className={`w-6 h-6 rounded-md ${i === active ? "bg-neutral-900" : "bg-neutral-300"}`} />
          <span className={`text-[11px] ${i === active ? "font-semibold text-neutral-900" : "text-neutral-500"}`}>{n}</span>
        </div>
      ))}
    </div>
  );
}

function Header({ title, back, right }: { title: string; back?: boolean; right?: ReactNode }) {
  return (
    <div className="h-12 shrink-0 flex items-center gap-3 border-b border-neutral-200 -mx-5 px-5">
      {back && <span className="text-[20px] leading-none text-neutral-800">‹</span>}
      <span className="flex-1 text-[17px] font-semibold text-neutral-900">{title}</span>
      {right}
    </div>
  );
}

function Img({ h, label, className = "" }: { h: number; label?: string; className?: string }) {
  return (
    <div className={`relative shrink-0 rounded-xl bg-neutral-100 border border-neutral-300 overflow-hidden ${className}`} style={{ height: h }}>
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <line x1="0" y1="0" x2="100" y2="100" stroke="#D4D4D4" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="#D4D4D4" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
      </svg>
      {label && <span className="absolute inset-0 flex items-center justify-center text-[13px] text-neutral-500">{label}</span>}
    </div>
  );
}

function Input({ label, ph, h = 44 }: { label?: string; ph?: string; h?: number }) {
  return (
    <div className="flex flex-col gap-1.5 shrink-0">
      {label && <span className="text-[13px] text-neutral-600">{label}</span>}
      <div className="rounded-xl border border-neutral-400 px-3.5 flex items-start pt-3 text-[13px] text-neutral-400" style={{ height: h }}>
        {ph}
      </div>
    </div>
  );
}

function Btn({ label, outline, small, className = "" }: { label: string; outline?: boolean; small?: boolean; className?: string }) {
  return (
    <div className={`shrink-0 rounded-xl flex items-center justify-center font-semibold ${small ? "h-10 text-[13px]" : "h-12 text-[15px]"} ${outline ? "border-2 border-neutral-900 text-neutral-900" : "bg-neutral-900 text-white"} ${className}`}>
      {label}
    </div>
  );
}

function Chips({ items, active = -1 }: { items: string[]; active?: number }) {
  return (
    <div className="flex gap-2 flex-wrap shrink-0">
      {items.map((c, i) => (
        <span key={c} className={`h-8 px-3.5 rounded-full border text-[12px] flex items-center ${i === active ? "bg-neutral-900 border-neutral-900 text-white" : "border-neutral-400 text-neutral-700"}`}>
          {c}
        </span>
      ))}
    </div>
  );
}

function Lines({ n = 2, w = ["100%", "70%"] }: { n?: number; w?: string[] }) {
  return (
    <div className="flex flex-col gap-2 shrink-0">
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className="h-2.5 rounded-full bg-neutral-200" style={{ width: w[i % w.length] }} />
      ))}
    </div>
  );
}

function Title({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div className="flex items-center justify-between shrink-0">
      <span className="text-[15px] font-semibold text-neutral-900">{children}</span>
      {sub && <span className="text-[12px] text-neutral-500 underline">{sub}</span>}
    </div>
  );
}

function Row({ title, meta, right, thumb = true }: { title: string; meta?: string; right?: ReactNode; thumb?: boolean }) {
  return (
    <div className="shrink-0 flex items-center gap-3 rounded-xl border border-neutral-300 p-3">
      {thumb && <span className="w-14 h-14 rounded-lg bg-neutral-100 border border-neutral-300 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-neutral-900 truncate">{title}</p>
        {meta && <p className="text-[12px] text-neutral-500 truncate">{meta}</p>}
      </div>
      {right}
    </div>
  );
}

function ProductCard() {
  return (
    <div className="flex flex-col gap-2">
      <Img h={128} />
      <span className="h-2.5 w-4/5 rounded-full bg-neutral-300" />
      <span className="h-2.5 w-1/2 rounded-full bg-neutral-200" />
    </div>
  );
}

function Search({ ph }: { ph: string }) {
  return (
    <div className="h-11 shrink-0 rounded-xl border border-neutral-400 px-3.5 flex items-center gap-2 text-[13px] text-neutral-400">
      <span className="w-4 h-4 rounded-full border-2 border-neutral-400" />
      {ph}
    </div>
  );
}

/* ---------------- screens ---------------- */
const SCREENS: { title: string; group: string; nav?: boolean; navActive?: number; body: ReactNode }[] = [
  {
    title: "Login", group: "Umum",
    body: (
      <>
        <div className="flex-1 flex flex-col justify-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-neutral-200 border border-neutral-300 self-center" />
          <p className="text-center text-[22px] font-semibold">Bloemen</p>
          <p className="text-center text-[13px] text-neutral-500 -mt-2">Masuk untuk melanjutkan</p>
          <Input label="Email" ph="nama@email.com" />
          <Input label="Kata sandi" ph="••••••••" />
          <Btn label="Masuk" />
          <p className="text-center text-[13px] text-neutral-500">Belum punya akun? <span className="underline text-neutral-900">Daftar</span></p>
        </div>
      </>
    ),
  },
  {
    title: "Daftar Akun", group: "Umum",
    body: (
      <>
        <Header title="Daftar Akun" back />
        <span className="text-[13px] text-neutral-600">Daftar sebagai</span>
        <div className="grid grid-cols-2 gap-2 shrink-0">
          <Btn label="Pembeli" outline small />
          <Btn label="Penjual" small />
        </div>
        <Input label="Nama lengkap" />
        <Input label="Email" />
        <Input label="Nomor telepon" />
        <Input label="Kata sandi" />
        <Input label="Konfirmasi kata sandi" />
        <div className="flex-1" />
        <Btn label="Daftar" />
      </>
    ),
  },
  {
    title: "Beranda", group: "Pembeli", nav: true, navActive: 0,
    body: (
      <>
        <div className="flex items-center gap-3 shrink-0 pt-1">
          <span className="w-10 h-10 rounded-xl bg-neutral-200" />
          <div className="flex-1"><p className="text-[15px] font-semibold">Bloemen</p><p className="text-[12px] text-neutral-500">Halo, Pembeli</p></div>
          <span className="w-9 h-9 rounded-full border border-neutral-400" />
        </div>
        <Search ph="Cari bunga atau toko…" />
        <Img h={150} label="Banner promo" />
        <Title sub="Lihat semua">Kategori</Title>
        <div className="relative grid grid-cols-4 gap-2.5 shrink-0">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[68px] rounded-2xl border border-neutral-400 flex items-center justify-center">
              <span className="w-7 h-7 rounded-full bg-neutral-300" />
            </div>
          ))}
          <Marker n={1} />
        </div>
        <Title sub="Lihat semua">Toko Terdekat</Title>
        <div className="relative grid grid-cols-2 gap-3 shrink-0">
          <ProductCard /><ProductCard />
          <Marker n={4} />
        </div>
      </>
    ),
  },
  {
    title: "Daftar Produk", group: "Pembeli", nav: true, navActive: 0,
    body: (
      <>
        <Header title="Semua Produk" back />
        <Search ph="Cari produk…" />
        <Chips items={["Semua", "Bouquet", "Papan", "Duka", "Wedding"]} active={0} />
        <div className="grid grid-cols-2 gap-3 shrink-0">
          <ProductCard /><ProductCard /><ProductCard /><ProductCard />
        </div>
      </>
    ),
  },
  {
    title: "Detail Produk", group: "Pembeli",
    body: (
      <>
        <Header title="Detail Produk" back />
        <Img h={290} label="Foto produk" />
        <span className="text-[12px] text-neutral-500">Bouquet</span>
        <p className="text-[20px] font-semibold -mt-2">Buket Mawar Merah</p>
        <p className="text-[18px] font-semibold">Rp 250.000</p>
        <span className="text-[13px] text-neutral-600">Ukuran</span>
        <Chips items={["S", "M", "L", "XL"]} active={1} />
        <Lines n={3} w={["100%", "95%", "60%"]} />
        <div className="flex-1" />
        <div className="relative grid grid-cols-2 gap-0.5 shrink-0">
          <Btn label="Pre-Order" small className="rounded-r-none" />
          <Btn label="Chat Penjual" outline small className="rounded-l-none" />
          <Marker n={2} />
        </div>
      </>
    ),
  },
  {
    title: "Daftar Toko", group: "Pembeli", nav: true, navActive: 1,
    body: (
      <>
        <Header title="Toko Bunga" />
        <Search ph="Cari toko…" />
        <div className="relative flex flex-col gap-3 shrink-0">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-neutral-300 overflow-hidden">
              <Img h={96} className="rounded-none border-0 border-b" />
              <div className="p-3 flex flex-col gap-1.5">
                <p className="text-[14px] font-semibold">Nama Toko Bunga</p>
                <Lines n={2} w={["80%", "55%"]} />
              </div>
            </div>
          ))}
          <Marker n={4} />
        </div>
      </>
    ),
  },
  {
    title: "Detail Toko", group: "Pembeli",
    body: (
      <>
        <Header title="Detail Toko" back />
        <Img h={180} label="Foto toko" />
        <p className="text-[18px] font-semibold">Toko Bunga Melati</p>
        <p className="text-[13px] text-neutral-500 -mt-2">★ 4,8 · 120 ulasan</p>
        <div className="relative rounded-xl border border-neutral-300 p-3 shrink-0">
          <p className="text-[12px] text-neutral-500">Alamat</p>
          <p className="text-[13px]">Jl. Sam Ratulangi No. 12, Manado</p>
          <Marker n={5} />
        </div>
        <div className="rounded-xl border border-neutral-300 p-3 shrink-0">
          <p className="text-[12px] text-neutral-500">Jam operasional</p>
          <p className="text-[13px]">Senin – Sabtu · 08.00 – 20.00</p>
        </div>
        <Btn label="Chat Toko" small />
        <Title>Produk</Title>
        <div className="grid grid-cols-2 gap-3 shrink-0"><ProductCard /><ProductCard /></div>
      </>
    ),
  },
  {
    title: "Formulir Pre-Order", group: "Pembeli",
    body: (
      <>
        <Header title="Pre-Order" back />
        <Row title="Buket Mawar Merah · M" meta="Rp 250.000" />
        <Input label="Jumlah" ph="1" />
        <span className="text-[13px] text-neutral-600">Metode pengambilan</span>
        <div className="grid grid-cols-2 gap-2 shrink-0"><Btn label="Ambil sendiri" small /><Btn label="Kirim" outline small /></div>
        <div className="grid grid-cols-2 gap-2 shrink-0"><Input label="Tanggal" ph="dd/mm/yyyy" /><Input label="Jam" ph="--:--" /></div>
        <Input label="Catatan" h={84} ph="Permintaan khusus…" />
        <div className="flex-1" />
        <div className="flex justify-between text-[14px] shrink-0"><span className="text-neutral-500">Total</span><span className="font-semibold">Rp 250.000</span></div>
        <Btn label="Lanjut ke Pembayaran" />
      </>
    ),
  },
  {
    title: "Pembayaran", group: "Pembeli",
    body: (
      <>
        <Header title="Pembayaran" back />
        <div className="rounded-2xl border border-neutral-300 p-4 shrink-0">
          <p className="text-[12px] text-neutral-500">Total pembayaran</p>
          <p className="text-[24px] font-semibold">Rp 250.000</p>
        </div>
        <span className="text-[13px] text-neutral-600">Metode pembayaran</span>
        {["Tunai (Cash)", "Transfer Bank", "E-Wallet", "Kartu Kredit"].map((m, i) => (
          <Row key={m} title={m} thumb={false} right={<span className={`w-5 h-5 rounded-full border-2 ${i === 1 ? "border-neutral-900 bg-neutral-900" : "border-neutral-400"}`} />} />
        ))}
        <div className="flex-1" />
        <Btn label="Bayar Sekarang" />
      </>
    ),
  },
  {
    title: "Riwayat Pesanan", group: "Pembeli", nav: true, navActive: 2,
    body: (
      <>
        <Header title="Pesanan Saya" />
        <Chips items={["Semua", "Pending", "Diproses", "Selesai"]} active={0} />
        {["ORD-0001 · Pending", "ORD-0002 · Diproses", "ORD-0003 · Siap diambil", "ORD-0004 · Selesai"].map((t) => (
          <Row key={t} title="Buket Mawar Merah" meta={t} right={<span className="text-[12px] underline">Detail</span>} />
        ))}
      </>
    ),
  },
  {
    title: "Ruang Chat", group: "Pembeli & Penjual",
    body: (
      <>
        <Header title="Toko Bunga Melati" back />
        <div className="flex-1 flex flex-col gap-3 justify-end">
          <div className="self-start max-w-[75%] rounded-2xl rounded-bl-md bg-neutral-100 px-4 py-3"><Lines n={2} w={["180px", "120px"]} /></div>
          <div className="self-end max-w-[75%] rounded-2xl rounded-br-md bg-neutral-800 px-4 py-3"><span className="block h-2.5 w-40 rounded-full bg-neutral-500" /></div>
          <div className="self-start max-w-[75%] rounded-2xl rounded-bl-md bg-neutral-100 px-4 py-3"><Lines n={3} w={["200px", "170px", "90px"]} /></div>
          <div className="self-end max-w-[75%] rounded-2xl rounded-br-md bg-neutral-800 px-4 py-3"><span className="block h-2.5 w-28 rounded-full bg-neutral-500" /></div>
        </div>
        <div className="flex gap-2 shrink-0">
          <div className="flex-1 h-12 rounded-full border border-neutral-400 px-4 flex items-center text-[13px] text-neutral-400">Ketik pesan…</div>
          <span className="w-12 h-12 rounded-full bg-neutral-900" />
        </div>
      </>
    ),
  },
  {
    title: "Profil", group: "Pembeli", nav: true, navActive: 4,
    body: (
      <>
        <Header title="Profil" />
        <div className="flex items-center gap-4 shrink-0 py-2">
          <span className="w-16 h-16 rounded-full bg-neutral-200 border border-neutral-300" />
          <div><p className="text-[16px] font-semibold">Nama Pengguna</p><p className="text-[13px] text-neutral-500">user@email.com</p></div>
        </div>
        {["Pesanan Saya", "Edit Profil", "Daftarkan Toko", "Bantuan"].map((t) => (
          <Row key={t} title={t} thumb={false} right={<span className="text-neutral-400">›</span>} />
        ))}
        <div className="flex-1" />
        <Btn label="Keluar" outline />
      </>
    ),
  },
  {
    title: "Registrasi Toko", group: "Penjual",
    body: (
      <>
        <Header title="Registrasi Toko" back />
        <div className="relative shrink-0"><Img h={88} label="Foto banner toko" /><Marker n={3} /></div>
        <Input label="Nama toko" />
        <Input label="Deskripsi" h={64} />
        <span className="text-[13px] text-neutral-600">Kategori</span>
        <Chips items={["Bouquet", "Papan", "Duka", "Wedding"]} />
        <Img h={110} label="Peta (pilih titik lokasi)" />
        <Input label="Alamat lengkap" />
        <Input label="Jam buka – tutup" ph="08.00 – 20.00" />
        <p className="text-center text-[11px] text-neutral-400 -mt-1">⋮ form berlanjut (perlu scroll panjang)</p>
      </>
    ),
  },
  {
    title: "Sidebar & Produk", group: "Penjual",
    body: (
      <div className="relative -mx-5 -mb-4 flex-1 flex">
        <div className="w-[230px] bg-neutral-100 border-r border-neutral-300 p-4 flex flex-col gap-2">
          <p className="text-[15px] font-semibold mb-2">Bloemen Seller</p>
          {["Produk", "Pesanan", "Chat", "Pengaturan Toko", "Keluar"].map((m, i) => (
            <span key={m} className={`h-11 rounded-xl px-3 flex items-center text-[14px] ${i === 0 ? "bg-neutral-900 text-white" : "bg-white border border-neutral-300"}`}>{m}</span>
          ))}
        </div>
        <div className="flex-1 bg-neutral-200/60 p-3 flex flex-col gap-2">
          {[0, 1, 2, 3, 4].map((i) => <div key={i} className="h-14 rounded-lg bg-white border border-neutral-300" />)}
        </div>
      </div>
    ),
  },
  {
    title: "Tambah Produk", group: "Penjual",
    body: (
      <>
        <Header title="Tambah Produk" back />
        <Img h={120} label="Foto produk" />
        <Input label="Nama produk" />
        <Input label="Deskripsi" h={64} />
        <span className="text-[13px] text-neutral-600">Harga per ukuran</span>
        <div className="grid grid-cols-2 gap-2 shrink-0">
          {["S", "M", "L", "XL"].map((s) => <Input key={s} ph={`${s} · Rp`} />)}
        </div>
        <div className="flex items-center justify-between shrink-0 rounded-xl border border-neutral-300 p-3">
          <span className="text-[14px]">Pre-Order</span><span className="w-11 h-6 rounded-full bg-neutral-900" />
        </div>
        <div className="flex-1" />
        <Btn label="Simpan Produk" />
      </>
    ),
  },
  {
    title: "Manajemen Pesanan", group: "Penjual",
    body: (
      <>
        <Header title="Pesanan Masuk" back />
        <Chips items={["Pending", "Dikonfirmasi", "Diproses", "Siap", "Selesai"]} active={0} />
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-neutral-300 p-3 flex flex-col gap-2 shrink-0">
            <div className="flex justify-between text-[13px]"><span className="font-semibold">ORD-000{i + 1}</span><span className="text-neutral-500">Pending</span></div>
            <Lines n={2} w={["75%", "50%"]} />
            <div className="grid grid-cols-2 gap-2"><Btn label="Tolak" outline small /><Btn label="Konfirmasi" small /></div>
          </div>
        ))}
      </>
    ),
  },
  {
    title: "Pengaturan Toko", group: "Penjual",
    body: (
      <>
        <Header title="Pengaturan Toko" back />
        <Img h={110} label="Foto toko" />
        <Input label="Nama toko" />
        <Input label="Nomor telepon" />
        <Input label="Alamat" />
        <Input label="Jam operasional" ph="Senin – Sabtu · 08.00 – 20.00" />
        <div className="flex-1" />
        <Btn label="Simpan Perubahan" />
      </>
    ),
  },
];

export default function WireframeBoard() {
  const [markers, setMarkers] = useState(false);
  const [view, setView] = useState<"semua" | "wireframe" | "akhir">("semua");
  SHOW_MARKERS = markers;
  const groups = ["Umum", "Pembeli", "Pembeli & Penjual", "Penjual"];
  let n = 0;

  const SectionTitle = ({ kicker, title, sub }: { kicker: string; title: string; sub: string }) => (
    <div className="px-16 pt-14 pb-8">
      <p className="text-[12px] uppercase tracking-[0.18em] text-neutral-500">{kicker}</p>
      <h1 className="text-[34px] font-semibold tracking-tight">{title}</h1>
      <p className="text-[14px] text-neutral-500 mt-1">{sub}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-neutral-900" style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
      {/* Kontrol (tidak perlu ikut disalin ke Figma) */}
      <div className="sticky top-0 z-50 bg-[#F4F4F2]/90 backdrop-blur border-b border-neutral-300 px-16 py-3 flex flex-wrap items-center gap-6">
        <span className="text-[14px] font-semibold">Bloemen · Papan Desain</span>
        <div className="flex rounded-full bg-white border border-neutral-300 p-1 text-[13px]">
          {([["semua", "Semua"], ["wireframe", "Wireframe v01.0"], ["akhir", "Tampilan Akhir v03.0"]] as const).map(([k, l]) => (
            <button key={k} onClick={() => setView(k)} className={`px-4 py-1.5 rounded-full ${view === k ? "bg-neutral-900 text-white" : "text-neutral-600"}`}>{l}</button>
          ))}
        </div>
        {view !== "akhir" && (
          <label className="flex items-center gap-2 text-[13px] cursor-pointer select-none">
            <input type="checkbox" checked={markers} onChange={(e) => setMarkers(e.target.checked)} className="w-4 h-4 accent-neutral-900" />
            Penanda temuan Tabel 4.1
          </label>
        )}
        <span className="text-[12px] text-neutral-500 ml-auto">Edit › Copy designs › Whole page → paste di Figma Design</span>
      </div>

      {view !== "akhir" && (
        <>
          <SectionTitle kicker="Bloemen · Iterasi 1" title="Wireframe Low-Fidelity v01.0" sub="17 halaman · frame 390 × 844 px · kondisi sebelum evaluasi responden" />
          {groups.map((g) => {
            const items = SCREENS.filter((s) => s.group === g);
            if (!items.length) return null;
            return (
              <div key={g} className="px-16 pb-16">
                <h2 className="text-[13px] uppercase tracking-[0.16em] text-neutral-500 mb-6 border-b border-neutral-300 pb-2">{g}</h2>
                <div className="flex flex-wrap gap-x-14 gap-y-12">
                  {items.map((s) => {
                    n += 1;
                    return (
                      <Frame key={s.title} no={n} title={s.title} group={s.group} nav={s.nav} navActive={s.navActive}>
                        {s.body}
                      </Frame>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}

      {view !== "wireframe" && (
        <>
          <SectionTitle kicker="Bloemen · Versi Final" title="Tampilan Akhir Aplikasi v03.0" sub={`${APP_SCREEN_COUNT} layar · frame 390 × 844 px · data contoh`} />
          <AppScreensSection />
        </>
      )}
    </div>
  );
}
