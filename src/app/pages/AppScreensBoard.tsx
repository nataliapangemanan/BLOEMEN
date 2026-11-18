import type { ReactNode } from "react";
import {
  Bell, ShoppingBag, Search, Home as HomeIcon, Grid3x3, Palette, MessageCircle, User, ArrowLeft, Star, MapPin,
  Clock, Phone, Store, ImagePlus, Send, Tag, Check, X, CheckCircle2, ChevronRight, ShoppingCart, Hourglass,
  Droplets, ChevronDown, Navigation, Upload, Image as ImageIcon, Package, FileText, Settings, LayoutDashboard,
  Menu, Plus, Edit, Trash2, Download, TrendingUp, Calendar, Truck, Banknote, Building2, Wallet, CreditCard,
  LogOut, Heart, Filter,
} from "lucide-react";

/**
 * Tampilan akhir aplikasi Bloemen (v03.0) dalam frame 390 × 844 px,
 * meniru gaya komponen aplikasi asli (primary hitam, kartu rounded-2xl,
 * ikon Lucide) dengan data contoh, agar dapat disalin ke Figma Design
 * melalui Edit › Copy designs › Whole page.
 */

const IMG = {
  roses: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=70",
  pinkWhite: "https://images.unsplash.com/photo-1523693916903-027d144a2b7d?auto=format&fit=crop&w=800&q=70",
  mixed: "https://images.unsplash.com/photo-1556712691-5c39e0e32a8e?auto=format&fit=crop&w=800&q=70",
  redWhite: "https://images.unsplash.com/photo-1599791095997-5cf38bb5ff69?auto=format&fit=crop&w=800&q=70",
  pinkTilt: "https://images.unsplash.com/photo-1604154148015-67f46007e553?auto=format&fit=crop&w=800&q=70",
  table: "https://images.unsplash.com/photo-1608027790251-5e0c80d043d9?auto=format&fit=crop&w=800&q=70",
  red: "https://images.unsplash.com/photo-1512056495345-913a0c261dc8?auto=format&fit=crop&w=800&q=70",
  pink: "https://images.unsplash.com/photo-1553578622-34d24027ce18?auto=format&fit=crop&w=800&q=70",
  shop1: "https://images.unsplash.com/photo-1775743093104-d8e53e5ed250?auto=format&fit=crop&w=800&q=70",
  shop2: "https://images.unsplash.com/photo-1762424361024-766d1a44f54e?auto=format&fit=crop&w=800&q=70",
  shop3: "https://images.unsplash.com/photo-1775137589950-861862c3c6de?auto=format&fit=crop&w=800&q=70",
};

/* ---------------- frame & shared ---------------- */
function Frame({ no, title, group, children, nav, active = 0, dim }: { no: number; title: string; group: string; children: ReactNode; nav?: boolean; active?: number; dim?: boolean }) {
  return (
    <section className="flex flex-col [&>*]:shrink-0 gap-3">
      <div className="flex items-baseline gap-2 px-1">
        <span className="text-[13px] font-semibold text-neutral-400 tabular-nums">{String(no).padStart(2, "0")}</span>
        <h3 className="text-[15px] font-semibold text-neutral-900">{title}</h3>
        <span className="text-[12px] text-neutral-400">· {group}</span>
      </div>
      <div className="relative w-[390px] h-[844px] rounded-[44px] border-[8px] border-neutral-900 bg-white overflow-hidden flex flex-col [&>*]:shrink-0 shadow-xl">
        <div className={`h-10 shrink-0 flex items-center justify-between px-6 text-[12px] font-semibold ${dim ? "bg-black/50 text-white" : "text-neutral-900"}`}>
          <span>9:41</span>
          <span className="w-24 h-6 rounded-full bg-neutral-900" />
          <span className="flex gap-1 items-center"><span className="w-4 h-2.5 rounded-[2px] bg-current" /><span className="w-5 h-2.5 rounded-[3px] border border-current" /></span>
        </div>
        <div className="flex-1 min-h-0 relative flex flex-col [&>*]:shrink-0 overflow-hidden">{children}</div>
        {nav && <BottomNav active={active} />}
      </div>
    </section>
  );
}

function BottomNav({ active }: { active: number }) {
  const items = [[HomeIcon, "Beranda"], [Grid3x3, "Toko"], [Palette, "Referensi"], [MessageCircle, "Chat"], [User, "Profil"]] as const;
  return (
    <div className="shrink-0 bg-white/95 border-t border-black/10 flex items-center justify-around px-2 pt-3 pb-5">
      {items.map(([Icon, l], i) => (
        <div key={l} className={`flex flex-col [&>*]:shrink-0 items-center gap-1 ${i === active ? "text-[#030213]" : "text-[#717182]"}`}>
          <Icon className="w-5 h-5" strokeWidth={i === active ? 2.4 : 2} />
          <span className="text-[11px]">{l}</span>
        </div>
      ))}
    </div>
  );
}

function TopBar({ title, sub, right, back = true }: { title?: string; sub?: string; right?: ReactNode; back?: boolean }) {
  return (
    <div className="shrink-0 px-4 py-3 border-b border-black/10 flex items-center gap-3">
      {back && <ArrowLeft className="w-5 h-5 text-[#717182]" />}
      <div className="flex-1 min-w-0">
        {title && <p className="font-bold text-[16px] truncate">{title}</p>}
        {sub && <p className="text-[12px] text-[#717182]">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

const Photo = ({ src, className = "" }: { src: string; className?: string }) => <img src={src} alt="" className={`object-cover ${className}`} />;

function Field({ label, value, ph, h = 44, prefix }: { label?: string; value?: string; ph?: string; h?: number; prefix?: string }) {
  return (
    <div className="flex flex-col [&>*]:shrink-0 gap-1.5 shrink-0">
      {label && <span className="text-[13px] font-medium">{label}</span>}
      <div className="rounded-xl bg-[#f3f3f5] border border-black/10 px-4 flex items-start pt-3 text-[13px]" style={{ height: h }}>
        {prefix && <span className="text-[#717182] mr-2">{prefix}</span>}
        <span className={value ? "text-neutral-900" : "text-[#717182]"}>{value || ph}</span>
      </div>
    </div>
  );
}

function PrimaryBtn({ children, className = "", tone = "dark" }: { children: ReactNode; className?: string; tone?: "dark" | "green" | "orange" | "outline" | "soft" }) {
  const t = { dark: "bg-[#030213] text-white", green: "bg-emerald-600 text-white", orange: "bg-orange-500 text-white", outline: "border-2 border-[#030213]/30 text-[#030213] bg-white", soft: "bg-[#030213]/10 text-[#030213] border border-[#030213]/30" }[tone];
  return <div className={`h-12 rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 shrink-0 ${t} ${className}`}>{children}</div>;
}

function Chip({ children, on }: { children: ReactNode; on?: boolean }) {
  return <span className={`shrink-0 px-3 py-1.5 rounded-full border text-[12px] ${on ? "bg-[#030213] text-white border-[#030213]" : "bg-[#ececf0]/60 border-black/10 text-[#3a3a48]"}`}>{children}</span>;
}

function ProductTile({ src, name, price, cat = "Bouquet", po, disc }: { src: string; name: string; price: string; cat?: string; po?: boolean; disc?: string }) {
  return (
    <div className="flex flex-col [&>*]:shrink-0 gap-1.5">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#ececf0]">
        <Photo src={src} className="w-full h-full" />
        <span className={`absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-full text-white ${po ? "bg-purple-500/90" : "bg-green-500/90"}`}>{po ? "📅 Pre-Order" : "✓ Ready"}</span>
        {disc && <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">{disc}</span>}
      </div>
      <p className="text-[11px] text-[#717182] px-0.5">{cat}</p>
      <p className="text-[13px] font-medium leading-tight px-0.5 -mt-1 truncate">{name}</p>
      <p className="text-[13px] font-semibold px-0.5 -mt-0.5">{price}</p>
    </div>
  );
}

function Badge({ open = true, label }: { open?: boolean; label?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${open ? "bg-green-500/15 text-green-700" : "bg-red-500/15 text-red-700"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${open ? "bg-green-600" : "bg-red-600"}`} />
      {label || (open ? "Buka · tutup 20:00" : "Tutup · buka 08:00")}
    </span>
  );
}

function Sheet({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="absolute inset-0 bg-black/50 z-10" />
      <div className="absolute inset-x-3 bottom-3 top-14 z-20 rounded-2xl bg-white shadow-2xl p-5 flex flex-col [&>*]:shrink-0 gap-3 overflow-hidden">{children}</div>
    </>
  );
}

function SellerHead({ title }: { title: string }) {
  return (
    <div className="shrink-0 px-4 py-3 border-b border-black/10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Menu className="w-6 h-6" />
        <div><p className="font-bold text-[16px]">{title}</p><p className="text-[11px] text-[#717182]">Toko Bunga Melati</p></div>
      </div>
      <Bell className="w-5 h-5" />
    </div>
  );
}

/* ---------------- screens ---------------- */
type S = { title: string; group: string; nav?: boolean; active?: number; dim?: boolean; body: ReactNode };

const SCREENS: S[] = [
  /* ---------- Umum ---------- */
  {
    title: "Login", group: "Umum",
    body: (
      <div className="flex-1 flex flex-col [&>*]:shrink-0 justify-center px-6 gap-4">
        <div className="w-20 h-20 rounded-3xl bg-[#030213] text-white text-3xl flex items-center justify-center self-center">🌸</div>
        <div className="text-center"><p className="text-[26px] font-bold">Bloemen</p><p className="text-[13px] text-[#717182]">Marketplace kreativitas bunga Sulawesi Utara</p></div>
        <Field label="Email" value="natalia@email.com" />
        <Field label="Kata sandi" value="••••••••" />
        <PrimaryBtn>Masuk</PrimaryBtn>
        <p className="text-center text-[13px] text-[#717182]">Belum punya akun? <span className="font-semibold text-[#030213]">Daftar</span></p>
      </div>
    ),
  },
  {
    title: "Daftar Akun", group: "Umum",
    body: (
      <>
        <TopBar title="Buat Akun" />
        <div className="px-5 py-4 flex flex-col [&>*]:shrink-0 gap-3">
          <span className="text-[13px] font-medium">Daftar sebagai</span>
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#ececf0]">
            <div className="h-11 rounded-xl bg-white shadow-sm flex items-center justify-center gap-2 text-[13px] font-semibold"><ShoppingBag className="w-4 h-4" /> Pembeli</div>
            <div className="h-11 rounded-xl flex items-center justify-center gap-2 text-[13px] text-[#717182]"><Store className="w-4 h-4" /> Penjual</div>
          </div>
          <Field label="Nama lengkap" value="Natalia Pangemanan" />
          <Field label="Email" value="natalia@email.com" />
          <Field label="Nomor telepon" value="0812 4567 8910" />
          <Field label="Kata sandi" value="••••••••" />
          <Field label="Konfirmasi kata sandi" value="••••••••" />
          <PrimaryBtn className="mt-2">Daftar</PrimaryBtn>
        </div>
      </>
    ),
  },
  /* ---------- Pembeli ---------- */
  {
    title: "Beranda", group: "Pembeli", nav: true, active: 0,
    body: (
      <div className="flex flex-col [&>*]:shrink-0">
        <div className="px-4 pt-2 pb-3 border-b border-black/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><div className="w-10 h-10 rounded-xl bg-[#030213] text-white flex items-center justify-center">🌸</div><div><p className="font-semibold text-[14px]">Bloemen</p><p className="text-[12px] text-[#717182]">Halo, Natalia</p></div></div>
            <div className="flex gap-2"><ShoppingBag className="w-5 h-5" /><Bell className="w-5 h-5" /></div>
          </div>
          <div className="relative h-12 rounded-2xl bg-[#ececf0]/70 flex items-center pl-11 text-[13px] text-[#717182]"><Search className="absolute left-4 w-5 h-5" />Cari bunga favorit...<span className="absolute right-1.5 px-3 py-2 rounded-xl bg-[#030213] text-white text-[12px] font-semibold">Cari</span></div>
        </div>
        <div className="relative mx-4 mt-3 h-[190px] rounded-3xl overflow-hidden">
          <Photo src={IMG.pinkWhite} className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-5 text-white"><p className="text-[24px] font-bold leading-tight">Bunga Segar<br />Setiap Hari</p><span className="inline-block mt-2 px-4 py-1.5 bg-white text-neutral-900 rounded-full text-[12px] font-medium">Belanja Sekarang</span></div>
        </div>
        <div className="px-4 pt-4">
          <div className="flex justify-between mb-3"><p className="font-semibold">Kategori</p><span className="text-[13px] text-[#717182]">Lihat Semua</span></div>
          <div className="grid grid-cols-4 gap-2.5">
            {[["💐", "Bouquet"], ["🌷", "Hand Bouquet"], ["🏺", "Vas Bunga"], ["🎉", "Papan Bunga"]].map(([e, l]) => (
              <div key={l} className="flex flex-col [&>*]:shrink-0 items-center gap-1.5 p-2.5 rounded-2xl bg-[#ececf0]/50"><span className="text-[24px]">{e}</span><span className="text-[10px] text-center leading-tight">{l}</span></div>
            ))}
          </div>
          <div className="flex justify-between mt-4 mb-3"><p className="font-semibold">Rekomendasi</p><span className="text-[13px] text-[#717182]">Lihat Semua</span></div>
          <div className="grid grid-cols-2 gap-3">
            <ProductTile src={IMG.roses} name="Buket Mawar Pink" price="Rp 250.000" />
            <ProductTile src={IMG.mixed} name="Bouquet Pastel" price="Rp 320.000" po />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Semua Produk + Pencarian", group: "Pembeli",
    body: (
      <>
        <div className="shrink-0 px-4 py-3 border-b border-black/10">
          <div className="flex items-center gap-2 text-[#717182] mb-2"><ArrowLeft className="w-5 h-5" /><span className="text-[14px]">Kembali</span></div>
          <p className="text-[22px] font-bold">Hasil "mawar"</p>
          <p className="text-[13px] text-[#717182] mb-3">4 produk ditemukan</p>
          <div className="relative h-11 rounded-2xl bg-[#ececf0]/70 flex items-center pl-11 text-[13px]"><Search className="absolute left-4 w-5 h-5 text-[#717182]" />mawar<X className="absolute right-3 w-4 h-4 text-[#717182]" /></div>
        </div>
        <div className="flex gap-2 px-4 pt-3 overflow-hidden"><Chip on>Semua</Chip><Chip>💐 Bouquet</Chip><Chip>🌷 Hand Bouquet</Chip><Chip>💒 Wedding</Chip></div>
        <div className="grid grid-cols-2 gap-3 p-4">
          <ProductTile src={IMG.roses} name="Buket Mawar Pink" price="Rp 250.000" />
          <ProductTile src={IMG.redWhite} name="Mawar Merah Putih" price="Rp 280.000" disc="-20%" />
          <ProductTile src={IMG.red} name="Mawar Merah Klasik" price="Rp 199.000" po cat="Hand Bouquet" />
          <ProductTile src={IMG.pink} name="Mawar Pink Wisuda" price="Rp 175.000" cat="Hand Bouquet" />
        </div>
      </>
    ),
  },
  {
    title: "Detail Produk", group: "Pembeli",
    body: (
      <>
        <div className="relative h-[300px] shrink-0">
          <Photo src={IMG.roses} className="w-full h-full" />
          <span className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"><ArrowLeft className="w-5 h-5" /></span>
          <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center"><Heart className="w-5 h-5" /></span>
        </div>
        <div className="flex-1 overflow-hidden px-4 py-4 flex flex-col [&>*]:shrink-0 gap-3">
          <div className="flex gap-2 text-[11px]"><span className="bg-orange-500 text-white px-2 py-1 rounded-full">📅 Pre-Order</span><span className="bg-[#ececf0] px-2 py-1 rounded-full">Bouquet</span></div>
          <div><p className="text-[20px] font-bold">Buket Mawar Pink</p><p className="text-[12px] text-[#717182] flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> 4,8 · 24 ulasan</p></div>
          <p className="text-[22px] font-bold">Rp 250.000</p>
          <div><p className="text-[13px] font-semibold mb-2">Pilih Ukuran</p><div className="grid grid-cols-4 gap-2">{["S", "M", "L", "XL"].map((s, i) => <div key={s} className={`rounded-xl border-2 py-1.5 text-center ${i === 1 ? "border-[#030213] bg-[#030213]/5" : "border-black/10"}`}><p className="text-[13px] font-semibold">{s}</p><p className="text-[9px] text-[#717182]">{["150rb", "250rb", "350rb", "450rb"][i]}</p></div>)}</div></div>
          <div className="rounded-2xl border border-emerald-600/20 bg-emerald-50/70 p-3.5">
            <p className="text-[13px] font-semibold text-emerald-900 flex items-center gap-2"><Hourglass className="w-4 h-4" /> Bunga Hidup · Daya Tahan</p>
            <div className="flex items-end justify-between mt-1"><p className="text-[24px] font-bold text-emerald-800">5–7 hari</p><p className="text-[10px] text-[#717182]">Estimasi di vas, suhu ruang</p></div>
            <div className="h-1.5 rounded-full bg-emerald-900/10 mt-1.5"><div className="h-full w-1/3 rounded-full bg-emerald-600/80" /></div>
            <p className="mt-2 text-[12px] font-semibold text-emerald-900 flex items-center justify-between"><span className="flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5" /> Cara Penyimpanan</span><ChevronDown className="w-4 h-4" /></p>
          </div>
        </div>
        <div className="shrink-0 border-t border-black/10 p-3 flex gap-2 bg-white">
          <span className="p-3 rounded-xl border border-black/10"><MessageCircle className="w-5 h-5" /></span>
          <PrimaryBtn tone="orange" className="flex-1"><ShoppingCart className="w-4 h-4" /> Pre-Order Sekarang</PrimaryBtn>
        </div>
      </>
    ),
  },
  {
    title: "Daftar Toko (terdekat)", group: "Pembeli", nav: true, active: 1,
    body: (
      <>
        <div className="shrink-0 px-4 py-3 border-b border-black/10 text-center">
          <div className="flex items-center gap-2 text-[#717182]"><ArrowLeft className="w-5 h-5" /><span className="text-[14px]">Kembali</span></div>
          <p className="text-[22px] font-bold mt-1">Toko Bunga</p>
          <p className="text-[12px] text-[#717182]">Ditemukan 12 toko di sekitar Anda</p>
          <p className="text-[11px] text-[#030213] flex items-center justify-center gap-1 mt-1"><Navigation className="w-3 h-3" /> Diurutkan dari yang terdekat</p>
          <div className="relative h-11 mt-3 rounded-2xl bg-[#ececf0]/70 flex items-center pl-11 text-[13px] text-[#717182] text-left"><Search className="absolute left-4 w-5 h-5" />Cari nama toko, alamat, kota…</div>
        </div>
        <div className="p-4 flex flex-col [&>*]:shrink-0 gap-4 overflow-hidden">
          {[[IMG.shop1, "Toko Bunga Melati", "0,8 km", true], [IMG.shop2, "Manado Bouquet", "1,6 km", false]].map(([src, name, d, open]) => (
            <div key={name as string} className="rounded-2xl border border-black/10 overflow-hidden shadow-lg bg-white">
              <div className="relative h-[120px]"><Photo src={src as string} className="w-full h-full" /><span className="absolute top-3 right-3 px-2.5 py-1 bg-white rounded-full text-[12px] font-semibold flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />4,8</span><span className="absolute top-3 left-3 px-2.5 py-1 bg-[#030213] text-white rounded-full text-[11px] font-semibold flex items-center gap-1"><MapPin className="w-3 h-3" />{d as string}</span></div>
              <div className="p-4">
                <Badge open={open as boolean} />
                <p className="font-bold text-[15px] mt-2">{name as string}</p>
                <p className="text-[12px] text-[#717182] flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" /> Jl. Sam Ratulangi, Manado</p>
                <div className="grid grid-cols-[1fr_auto] gap-2 mt-3"><PrimaryBtn className="h-10">Lihat Detail</PrimaryBtn><PrimaryBtn tone="outline" className="h-10 px-3 text-[12px]"><ImagePlus className="w-4 h-4" />Referensi</PrimaryBtn></div>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    title: "Detail Toko", group: "Pembeli",
    body: (
      <>
        <div className="relative h-[180px] shrink-0"><Photo src={IMG.shop1} className="w-full h-full" /><div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" /><span className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center"><ArrowLeft className="w-5 h-5" /></span><span className="absolute top-3 right-3 px-3 py-1.5 bg-green-600 text-white rounded-full text-[12px] font-medium">● Buka</span></div>
        <div className="px-4 py-4 flex flex-col [&>*]:shrink-0 gap-3 overflow-hidden">
          <div><p className="text-[22px] font-bold">Toko Bunga Melati</p><p className="text-[12px] text-[#717182] flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />4,8 (120 ulasan)</p></div>
          <div className="flex gap-1.5"><Chip>💐 Bouquet Bunga</Chip><Chip>💒 Bunga Wedding</Chip></div>
          <div className="rounded-xl bg-[#ececf0]/50 p-3">
            <p className="text-[13px] font-medium flex items-center gap-2 mb-2"><MapPin className="w-4 h-4" /> Lokasi Toko</p>
            <div className="relative h-[100px] rounded-lg overflow-hidden bg-[#dfe9e1]">
              <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "linear-gradient(90deg,#fff 1px,transparent 1px),linear-gradient(#fff 1px,transparent 1px)", backgroundSize: "26px 26px" }} />
              <MapPin className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full w-7 h-7 text-red-600 fill-red-200" />
            </div>
            <PrimaryBtn tone="outline" className="h-10 mt-2 text-[13px]"><MapPin className="w-4 h-4" />Lihat Peta &amp; Rute</PrimaryBtn>
          </div>
          <div className="rounded-xl bg-[#ececf0]/50 p-3 flex gap-3"><Clock className="w-5 h-5" /><div><p className="text-[13px] font-medium">Jam Operasional</p><p className="text-[12px] text-[#717182]">Senin - Sabtu: 08:00 - 20:00</p></div></div>
          <div className="grid grid-cols-2 gap-2"><PrimaryBtn><MessageCircle className="w-5 h-5" />Chat Toko</PrimaryBtn><PrimaryBtn tone="outline"><ImagePlus className="w-5 h-5" />Kirim Referensi</PrimaryBtn></div>
        </div>
      </>
    ),
  },
  {
    title: "Peta & Rute Toko", group: "Pembeli",
    body: (
      <>
        <TopBar title="Lokasi Toko" sub="Toko Bunga Melati" />
        <div className="relative flex-1 bg-[#e6eee7]">
          <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "linear-gradient(90deg,#fff 2px,transparent 2px),linear-gradient(#fff 2px,transparent 2px)", backgroundSize: "48px 48px" }} />
          <div className="absolute left-[30%] top-0 bottom-0 w-3 bg-white" /><div className="absolute top-[45%] left-0 right-0 h-3 bg-white" />
          <MapPin className="absolute left-[30%] top-[45%] -translate-x-1/2 -translate-y-full w-10 h-10 text-red-600 fill-red-200" />
          <span className="absolute left-[62%] top-[68%] w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-300/60" />
        </div>
        <div className="shrink-0 p-4 rounded-t-3xl -mt-6 bg-white relative shadow-[0_-8px_24px_rgba(0,0,0,0.08)] flex flex-col [&>*]:shrink-0 gap-3">
          <p className="font-bold text-[16px]">Toko Bunga Melati</p>
          <p className="text-[12px] text-[#717182] flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />Jl. Sam Ratulangi No. 12, Manado</p>
          <div className="flex gap-3 text-[13px]"><span className="px-3 py-1.5 rounded-full bg-[#ececf0] font-semibold">0,8 km dari Anda</span><span className="px-3 py-1.5 rounded-full bg-[#ececf0] flex items-center gap-1"><Phone className="w-3.5 h-3.5" />0431 123456</span></div>
          <PrimaryBtn><Navigation className="w-4 h-4" />Buka Rute di Google Maps</PrimaryBtn>
        </div>
      </>
    ),
  },
  {
    title: "Referensi Desain", group: "Pembeli", nav: true, active: 2,
    body: (
      <div className="px-4 overflow-hidden flex flex-col [&>*]:shrink-0 gap-3 pt-2">
        <div className="text-center"><p className="text-[32px]">🎨</p><p className="text-[20px] font-bold">Referensi Desain Bunga</p><p className="text-[12px] text-[#717182]">Temukan inspirasi untuk rangkaian bunga Anda</p></div>
        <div className="relative h-12 rounded-2xl bg-[#ececf0]/70 flex items-center pl-11 text-[13px] text-[#717182]"><Search className="absolute left-4 w-5 h-5" />Cari inspirasi: pernikahan, wisuda…</div>
        <div className="rounded-2xl border border-black/10 p-3">
          <div className="flex items-center justify-between"><div><p className="font-bold text-[14px] flex items-center gap-1.5"><ImagePlus className="w-4 h-4" />Referensi Saya</p><p className="text-[11px] text-[#717182]">Unggah foto contoh, lalu kirim ke toko</p></div><span className="px-3 py-2 rounded-xl bg-[#030213] text-white text-[12px] font-semibold flex items-center gap-1"><Upload className="w-3.5 h-3.5" />Upload</span></div>
          <div className="flex gap-2 mt-2.5">{[IMG.table, IMG.pinkTilt, IMG.red].map((s) => <Photo key={s} src={s} className="w-[72px] h-[92px] rounded-xl" />)}</div>
        </div>
        <div className="flex gap-2 overflow-hidden"><Chip on>Semua</Chip><Chip>💐 Bouquet Bunga</Chip><Chip>🥀 Bunga Duka</Chip><Chip>💒 Wedding</Chip></div>
        <div className="grid grid-cols-2 gap-3">
          {[[IMG.mixed, true], [IMG.pinkWhite, false]].map(([s, p]) => (
            <div key={s as string} className={`relative aspect-[3/4] rounded-2xl overflow-hidden ${p ? "ring-2 ring-[#030213]/60" : ""}`}><Photo src={s as string} className="w-full h-full" />{p && <span className="absolute top-2 left-2 px-2 py-1 bg-[#030213] text-white rounded-full text-[10px] font-semibold flex items-center gap-1"><Store className="w-3 h-3" />Produk Toko</span>}</div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Dialog Unggah Referensi", group: "Pembeli", dim: true,
    body: (
      <>
        <div className="p-4 opacity-40"><p className="text-[20px] font-bold">Toko Bunga Melati</p></div>
        <Sheet>
          <div className="flex items-start justify-between"><div><p className="font-bold text-[17px]">Kirim Referensi Desain</p><p className="text-[12px] text-[#717182] flex items-center gap-1"><Store className="w-3.5 h-3.5" />Tujuan: <b className="text-neutral-900">Toko Bunga Melati</b></p></div><X className="w-5 h-5 text-[#717182]" /></div>
          <div className="relative h-[180px] rounded-2xl overflow-hidden"><Photo src={IMG.table} className="w-full h-full" /><span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px]">Ganti foto</span></div>
          <p className="text-[11px] font-semibold text-[#717182]">Atau pilih dari Referensi Saya</p>
          <div className="flex gap-2">{[IMG.pinkTilt, IMG.red, IMG.pink].map((s, i) => <Photo key={s} src={s} className={`w-14 h-14 rounded-xl ${i === 0 ? "ring-2 ring-[#030213] ring-offset-2" : ""}`} />)}</div>
          <Field label="Judul Referensi *" value="Buket mawar pink wisuda" />
          <Field h={62} value="Warna pink pastel, ukuran sedang, untuk 20 Okt" />
          <Field label="Budget (Rp) · opsional" prefix="Rp" value="150.000" />
          <PrimaryBtn><Send className="w-5 h-5" />Kirim ke Toko Bunga Melati</PrimaryBtn>
        </Sheet>
      </>
    ),
  },
  {
    title: "Pilih Toko Tujuan (sesuai kategori)", group: "Pembeli", dim: true,
    body: (
      <Sheet>
        <div className="flex items-start justify-between"><div><p className="font-bold text-[17px]">Kirim Referensi Desain</p><p className="text-[12px] text-[#717182]">Pilih toko bunga tujuan</p></div><X className="w-5 h-5 text-[#717182]" /></div>
        <Photo src={IMG.mixed} className="h-[150px] w-full rounded-xl" />
        <div><p className="font-bold text-[14px]">Bouquet Pastel</p><p className="text-[12px] text-[#717182]">Bouquet • Rp 320.000</p></div>
        <div className="border-t border-black/10 pt-3">
          <p className="text-[13px] font-semibold mb-2">Kategori Referensi:</p>
          <div className="flex gap-1.5 overflow-hidden"><Chip>🌱 Bunga Hidup</Chip><Chip on>💐 Bouquet Bunga</Chip><Chip>🥀 Duka</Chip></div>
          <p className="text-[13px] font-semibold mt-3 mb-2">Pilih Toko Tujuan · 3 toko Bouquet Bunga:</p>
          <div className="flex flex-col [&>*]:shrink-0 gap-2">
            {[["Toko Bunga Melati", "0,8 km"], ["Manado Bouquet", "1,6 km"], ["Velvet Petals", "3,2 km"]].map(([n, d]) => (
              <div key={n} className="flex items-center justify-between p-3 rounded-xl bg-[#ececf0]/60"><div><p className="text-[13px] font-semibold">{n}</p><p className="text-[11px] text-[#717182]">Jl. Sam Ratulangi, Manado</p></div><div className="flex items-center gap-3"><div className="text-right"><p className="text-[10px] text-[#717182]">Jarak</p><p className="text-[13px] font-bold">{d}</p></div><Send className="w-5 h-5" /></div></div>
            ))}
          </div>
        </div>
      </Sheet>
    ),
  },
  {
    title: "Ruang Chat (referensi & penawaran)", group: "Pembeli & Penjual",
    body: (
      <>
        <div className="shrink-0 px-4 py-3 border-b border-black/10 flex items-center gap-3"><ArrowLeft className="w-5 h-5 text-[#717182]" /><span className="w-10 h-10 rounded-full bg-[#030213]/10 flex items-center justify-center"><Store className="w-5 h-5" /></span><div><p className="font-bold">Toko Bunga Melati</p><p className="text-[12px] text-[#717182]">Online</p></div></div>
        <div className="flex-1 overflow-hidden p-3 flex flex-col [&>*]:shrink-0 gap-2.5 justify-end">
          <div className="flex justify-end">
            <div className="w-[70%] rounded-2xl rounded-br-md border border-[#030213]/40 bg-white overflow-hidden">
              <div className="px-3 py-1.5 bg-[#030213]/5 border-b border-black/10 flex justify-between text-[10px] font-semibold"><span className="flex items-center gap-1 uppercase"><ImageIcon className="w-3 h-3" />Referensi Desain</span><span className="px-1.5 rounded-full bg-emerald-500/15 text-emerald-700">✓ Sudah ditawar</span></div>
              <Photo src={IMG.table} className="w-full h-[90px]" />
              <div className="p-2.5"><p className="text-[12px] font-semibold">Buket mawar pink wisuda</p><p className="text-[11px] text-[#717182]">Pink pastel, ukuran sedang</p><p className="text-[11px] mt-1 flex justify-between border-t border-black/10 pt-1"><span className="text-[#717182]">Budget</span><b>Rp 150.000</b></p></div>
            </div>
          </div>
          <div className="self-start max-w-[75%] px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-[#ececf0] text-[13px]">Bisa kak, ini penawarannya ya 🌸<p className="text-[10px] text-[#717182] mt-0.5">10:14</p></div>
          <div className="self-start w-[75%] rounded-2xl rounded-bl-md border border-black/10 bg-white overflow-hidden">
            <div className="px-3 py-1.5 bg-[#030213]/5 border-b border-black/10 flex justify-between text-[10px] font-semibold"><span className="flex items-center gap-1 uppercase"><Tag className="w-3 h-3" />Penawaran Harga</span><span className="px-1.5 rounded-full bg-emerald-500/15 text-emerald-700">✓ Deal</span></div>
            <div className="p-2.5 flex gap-2.5"><Photo src={IMG.table} className="w-12 h-12 rounded-lg" /><div><p className="text-[12px] font-semibold">Buket Mawar Pink Wisuda</p><p className="text-[16px] font-bold">Rp 150.000</p></div></div>
          </div>
          <div className="self-center w-[85%] rounded-2xl border border-emerald-600/30 bg-emerald-50 p-2.5">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /><div className="flex-1"><p className="text-[12px] font-semibold text-emerald-900">Deal disepakati</p><p className="text-[11px] text-emerald-900/70">Buket Mawar Pink Wisuda · Rp 150.000</p></div></div>
            <PrimaryBtn tone="green" className="h-9 mt-2 text-[12px]"><ShoppingBag className="w-4 h-4" />Pesan Sekarang</PrimaryBtn>
          </div>
        </div>
        <div className="shrink-0 p-3 border-t border-black/10 flex flex-col [&>*]:shrink-0 gap-2">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-emerald-600 text-white"><ShoppingBag className="w-5 h-5" /><div className="flex-1"><p className="text-[10px] opacity-80">Deal · Buket Mawar Pink Wisuda</p><p className="text-[13px] font-bold">Rp 150.000</p></div><span className="text-[13px] font-semibold flex items-center">Pesan<ChevronRight className="w-4 h-4" /></span></div>
          <div className="flex gap-2 items-center"><span className="h-11 px-3 rounded-full bg-[#030213]/10 border border-[#030213]/30 text-[12px] font-semibold flex items-center gap-1"><ImageIcon className="w-4 h-4" />Referensi</span><span className="flex-1 h-11 rounded-full bg-[#ececf0] border border-black/10 px-4 flex items-center text-[13px] text-[#717182]">Ketik pesan...</span><span className="w-11 h-11 rounded-full bg-[#030213] text-white flex items-center justify-center"><Send className="w-4 h-4" /></span></div>
        </div>
      </>
    ),
  },
  {
    title: "Formulir Pre-Order", group: "Pembeli",
    body: (
      <>
        <TopBar title="Formulir Pre-Order" sub="Toko Bunga Melati" />
        <div className="p-4 flex flex-col [&>*]:shrink-0 gap-3 overflow-hidden">
          <div className="flex gap-3 p-3 rounded-2xl bg-[#ececf0]/60"><Photo src={IMG.table} className="w-16 h-16 rounded-xl" /><div className="flex-1"><p className="text-[13px] font-semibold">Buket Mawar Pink Wisuda</p><p className="text-[11px] text-[#717182]">Dari penawaran · 1 item</p><p className="text-[14px] font-bold mt-1">Rp 150.000</p></div></div>
          <span className="text-[13px] font-medium">Metode Pengambilan</span>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-[72px] rounded-xl border-2 border-[#030213] bg-[#030213]/5 flex flex-col [&>*]:shrink-0 items-center justify-center gap-1 text-[13px] font-medium"><Store className="w-5 h-5" />Ambil Sendiri</div>
            <div className="h-[72px] rounded-xl border-2 border-black/10 flex flex-col [&>*]:shrink-0 items-center justify-center gap-1 text-[13px] text-[#717182]"><Truck className="w-5 h-5" />Kirim</div>
          </div>
          <span className="text-[13px] font-medium">Tanggal &amp; Jam Pengambilan *</span>
          <div className="grid grid-cols-2 gap-2"><Field value="20/10/2026" /><Field value="10:00" /></div>
          <p className="text-[11px] text-[#717182] -mt-1">Minimal pemesanan 1 hari sebelumnya.</p>
          <p className="text-[11px] px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-800">🌿 Bunga hidup dirangkai mendekati jadwal pengambilan. Usahakan ambil tepat waktu.</p>
          <Field label="Permintaan Khusus" h={64} value="Tambahkan kartu ucapan wisuda" />
          <div className="flex justify-between text-[14px] pt-1"><span className="text-[#717182]">Total</span><b>Rp 150.000</b></div>
          <PrimaryBtn>Lanjut ke Pembayaran</PrimaryBtn>
        </div>
      </>
    ),
  },
  {
    title: "Pembayaran", group: "Pembeli",
    body: (
      <>
        <TopBar title="Pembayaran" sub="ORD-20261020-0007" />
        <div className="p-4 flex flex-col [&>*]:shrink-0 gap-3">
          <div className="rounded-2xl bg-[#030213] text-white p-5"><p className="text-[12px] opacity-70">Total Pembayaran</p><p className="text-[28px] font-bold">Rp 150.000</p></div>
          <p className="text-[13px] font-semibold">Metode Pembayaran</p>
          {[[Banknote, "Tunai (Cash)", "Bayar langsung saat barang diterima"], [Building2, "Transfer Bank", "BCA, Mandiri, BNI"], [Wallet, "E-Wallet", "GoPay, OVO, Dana"], [CreditCard, "Kartu Kredit", "Visa, Mastercard"]].map(([I, n, d], i) => {
            const Icon = I as typeof Banknote;
            return (
              <div key={n as string} className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 ${i === 1 ? "border-[#030213] bg-[#030213]/5" : "border-black/10"}`}><span className="w-11 h-11 rounded-xl bg-[#ececf0] flex items-center justify-center"><Icon className="w-5 h-5" /></span><div className="flex-1"><p className="text-[14px] font-semibold">{n as string}</p><p className="text-[11px] text-[#717182]">{d as string}</p></div><span className={`w-5 h-5 rounded-full border-2 ${i === 1 ? "border-[#030213] bg-[#030213]" : "border-black/20"}`} /></div>
            );
          })}
          <PrimaryBtn className="mt-2">Bayar Sekarang</PrimaryBtn>
        </div>
      </>
    ),
  },
  {
    title: "Pesanan Saya", group: "Pembeli",
    body: (
      <>
        <TopBar title="Pesanan Saya" />
        <div className="flex gap-2 px-4 pt-3 overflow-hidden"><Chip on>Semua</Chip><Chip>Pending</Chip><Chip>Diproses</Chip><Chip>Selesai</Chip></div>
        <div className="p-4 flex flex-col [&>*]:shrink-0 gap-3">
          {[["ORD-20261020-0007", "Pending", "bg-yellow-500/15 text-yellow-700", IMG.table], ["ORD-20261012-0003", "Diproses", "bg-blue-500/15 text-blue-700", IMG.roses], ["ORD-20260930-0001", "Selesai", "bg-green-500/15 text-green-700", IMG.redWhite]].map(([o, s, c, img]) => (
            <div key={o} className="rounded-2xl border border-black/10 p-3.5 flex flex-col [&>*]:shrink-0 gap-2.5">
              <div className="flex justify-between items-center"><span className="text-[12px] font-semibold">{o}</span><span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${c}`}>{s}</span></div>
              <div className="flex gap-3"><Photo src={img} className="w-14 h-14 rounded-xl" /><div className="flex-1"><p className="text-[13px] font-medium">Buket Mawar Pink</p><p className="text-[11px] text-[#717182]">Toko Bunga Melati · Ambil 20 Okt, 10:00</p><p className="text-[13px] font-bold mt-0.5">Rp 150.000</p></div></div>
              <div className="grid grid-cols-2 gap-2"><PrimaryBtn tone="outline" className="h-9 text-[12px]"><MessageCircle className="w-4 h-4" />Chat</PrimaryBtn><PrimaryBtn className="h-9 text-[12px]">{s === "Selesai" ? "Beri Ulasan" : "Detail"}</PrimaryBtn></div>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    title: "Daftar Chat", group: "Pembeli", nav: true, active: 3,
    body: (
      <>
        <TopBar title="Pesan" back={false} />
        <div className="flex flex-col [&>*]:shrink-0">
          {[["Toko Bunga Melati", "Deal disepakati · Rp 150.000", "10:16", 2], ["Manado Bouquet", "🎨 Referensi desain: Buket wisuda", "Kemarin", 0], ["Velvet Petals", "Siap diambil besok pagi ya kak", "Sen", 0]].map(([n, m, t, u]) => (
            <div key={n as string} className="flex items-center gap-3 px-4 py-3.5 border-b border-black/5"><span className="w-12 h-12 rounded-full bg-[#030213]/10 flex items-center justify-center"><Store className="w-5 h-5" /></span><div className="flex-1 min-w-0"><p className="text-[14px] font-semibold">{n as string}</p><p className="text-[12px] text-[#717182] truncate">{m as string}</p></div><div className="flex flex-col [&>*]:shrink-0 items-end gap-1"><span className="text-[11px] text-[#717182]">{t as string}</span>{(u as number) > 0 && <span className="min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-semibold flex items-center justify-center">{u as number}</span>}</div></div>
          ))}
        </div>
      </>
    ),
  },
  {
    title: "Notifikasi", group: "Pembeli & Penjual", dim: true,
    body: (
      <>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-x-2 top-12 rounded-2xl bg-white shadow-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-black/10 flex justify-between items-center"><p className="font-bold">Notifikasi</p><span className="text-[12px] text-[#030213] font-medium">Tandai semua dibaca</span></div>
          {[[Tag, "Penawaran baru", "Toko Bunga Melati mengirim penawaran Rp 150.000", "2 mnt"], [CheckCircle2, "Status pesanan", "ORD-20261012-0003 sedang diproses", "1 jam"], [MessageCircle, "Pesan baru", "Manado Bouquet: Bisa kak, warnanya…", "3 jam"], [Star, "Ulasan", "Terima kasih atas ulasan Anda", "Kemarin"]].map(([I, t, m, w], i) => {
            const Icon = I as typeof Tag;
            return (<div key={t as string} className={`flex gap-3 px-4 py-3 border-b border-black/5 ${i < 2 ? "bg-[#030213]/[0.03]" : ""}`}><span className="w-9 h-9 rounded-full bg-[#ececf0] flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></span><div className="flex-1 min-w-0"><p className="text-[13px] font-semibold">{t as string}</p><p className="text-[12px] text-[#717182] line-clamp-2">{m as string}</p></div><span className="text-[10px] text-[#717182]">{w as string}</span></div>);
          })}
        </div>
      </>
    ),
  },
  {
    title: "Profil", group: "Pembeli", nav: true, active: 4,
    body: (
      <>
        <div className="px-5 pt-6 pb-5 flex items-center gap-4 border-b border-black/10"><span className="w-16 h-16 rounded-full bg-[#030213] text-white text-[22px] font-bold flex items-center justify-center">N</span><div><p className="text-[18px] font-bold">Natalia Pangemanan</p><p className="text-[13px] text-[#717182]">natalia@email.com</p><span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-[#ececf0]">Pembeli</span></div></div>
        <div className="p-4 flex flex-col [&>*]:shrink-0 gap-2">
          {[[ShoppingBag, "Pesanan Saya"], [ImagePlus, "Referensi Saya"], [Grid3x3, "Jelajahi Toko"], [Store, "Daftarkan Toko Anda"], [Settings, "Pengaturan Akun"]].map(([I, t]) => {
            const Icon = I as typeof Store;
            return (<div key={t as string} className="flex items-center gap-3 p-4 rounded-2xl bg-[#ececf0]/50"><Icon className="w-5 h-5" /><span className="flex-1 text-[14px] font-medium">{t as string}</span><ChevronRight className="w-4 h-4 text-[#717182]" /></div>);
          })}
          <PrimaryBtn tone="outline" className="mt-3 text-red-600 border-red-200"><LogOut className="w-4 h-4" />Keluar</PrimaryBtn>
        </div>
      </>
    ),
  },
  /* ---------- Penjual ---------- */
  {
    title: "Dashboard Penjual", group: "Penjual",
    body: (
      <>
        <SellerHead title="Seller Dashboard" />
        <div className="p-4 flex flex-col [&>*]:shrink-0 gap-3 overflow-hidden">
          <div><p className="text-[22px] font-bold">Selamat datang 👋</p><p className="text-[13px] text-[#717182]">Ringkasan toko hari ini</p></div>
          {[[TrendingUp, "Total Pendapatan", "Rp 4.850.000", "bg-emerald-500/10 text-emerald-700"], [Clock, "Pesanan Menunggu", "5", "bg-yellow-500/10 text-yellow-700"], [Package, "Total Produk Aktif", "18", "bg-blue-500/10 text-blue-700"], [Star, "Rating Toko", "4,8 (120)", "bg-purple-500/10 text-purple-700"]].map(([I, l, v, c]) => {
            const Icon = I as typeof Star;
            return (<div key={l as string} className="flex items-center gap-4 p-4 rounded-2xl border border-black/10 shadow-sm"><span className={`w-12 h-12 rounded-xl flex items-center justify-center ${c as string}`}><Icon className="w-6 h-6" /></span><div><p className="text-[12px] text-[#717182]">{l as string}</p><p className="text-[20px] font-bold">{v as string}</p></div></div>);
          })}
          <div className="grid grid-cols-2 gap-2.5">{[[Package, "Kelola Produk"], [ShoppingBag, "Pesanan"], [Star, "Ulasan"], [Settings, "Pengaturan"]].map(([I, l]) => { const Icon = I as typeof Star; return <div key={l as string} className="p-4 rounded-2xl bg-[#ececf0]/50 flex flex-col [&>*]:shrink-0 gap-2"><Icon className="w-5 h-5" /><span className="text-[13px] font-medium">{l as string}</span></div>; })}</div>
        </div>
      </>
    ),
  },
  {
    title: "Sidebar Penjual", group: "Penjual",
    body: (
      <>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-y-0 left-0 w-[290px] bg-white flex flex-col [&>*]:shrink-0">
          <div className="p-6 border-b border-black/10 flex items-center gap-3"><span className="w-11 h-11 rounded-xl bg-[#030213] text-white flex items-center justify-center">🌸</span><div><p className="font-bold text-[18px]">Seller Panel</p><p className="text-[12px] text-[#717182]">Bloemen</p></div></div>
          <div className="p-4 flex flex-col [&>*]:shrink-0 gap-1.5">
            {[[LayoutDashboard, "Dashboard"], [Package, "Produk"], [ShoppingCart, "Pesanan"], [FileText, "Rekap Penjualan"], [MessageCircle, "Chat"], [Settings, "Pengaturan Toko"]].map(([I, l], i) => { const Icon = I as typeof Star; return <div key={l as string} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] ${i === 0 ? "bg-[#030213] text-white font-semibold" : "text-neutral-800"}`}><Icon className="w-5 h-5" />{l as string}</div>; })}
          </div>
          <div className="mt-auto p-4 border-t border-black/10 flex flex-col [&>*]:shrink-0 gap-2"><div className="flex items-center gap-3 px-2"><span className="w-9 h-9 rounded-full bg-[#ececf0] flex items-center justify-center text-[13px] font-semibold">M</span><div><p className="text-[13px] font-semibold">Toko Bunga Melati</p><p className="text-[11px] text-[#717182]">melati@email.com</p></div></div><PrimaryBtn tone="outline" className="h-10 text-[13px]"><HomeIcon className="w-4 h-4" />Kembali ke Toko</PrimaryBtn></div>
        </div>
      </>
    ),
  },
  {
    title: "Manajemen Produk", group: "Penjual",
    body: (
      <>
        <SellerHead title="Produk" />
        <div className="p-4 flex flex-col [&>*]:shrink-0 gap-3 overflow-hidden">
          <div className="flex gap-2"><div className="relative flex-1 h-11 rounded-xl bg-[#f3f3f5] border border-black/10 flex items-center pl-10 text-[13px] text-[#717182]"><Search className="absolute left-3 w-4 h-4" />Cari produk...</div><span className="h-11 px-3 rounded-xl bg-[#030213] text-white text-[13px] font-semibold flex items-center gap-1"><Plus className="w-4 h-4" />Tambah</span></div>
          {[[IMG.roses, "Buket Mawar Pink", "Rp 150rb – 450rb", "Pre-Order", true], [IMG.mixed, "Bouquet Pastel", "Rp 320.000", "Ready", false], [IMG.redWhite, "Mawar Merah Putih", "Rp 280.000 → 224.000", "Diskon 20%", false]].map(([s, n, p, b, live]) => (
            <div key={n as string} className="flex gap-3 p-3 rounded-2xl border border-black/10"><Photo src={s as string} className="w-20 h-20 rounded-xl" /><div className="flex-1 min-w-0"><p className="text-[14px] font-semibold truncate">{n as string}</p><p className="text-[12px] text-[#717182]">{p as string}</p><div className="flex gap-1.5 mt-1.5"><span className={`text-[10px] px-2 py-0.5 rounded-full ${b === "Diskon 20%" ? "bg-red-500/10 text-red-600" : b === "Ready" ? "bg-green-500/10 text-green-700" : "bg-purple-500/10 text-purple-700"}`}>{b as string}</span>{live && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-700">🌺 Bunga Hidup</span>}</div></div><div className="flex flex-col [&>*]:shrink-0 gap-2"><Edit className="w-4 h-4 text-[#717182]" /><Trash2 className="w-4 h-4 text-red-500" /></div></div>
          ))}
        </div>
      </>
    ),
  },
  {
    title: "Tambah Produk", group: "Penjual", dim: true,
    body: (
      <Sheet>
        <div className="flex items-start justify-between"><div><p className="font-bold text-[17px]">Tambah Produk</p><p className="text-[12px] text-[#717182]">Lengkapi informasi produk</p></div><X className="w-5 h-5 text-[#717182]" /></div>
        <Photo src={IMG.roses} className="h-[110px] w-full rounded-xl" />
        <Field label="Nama Produk" value="Buket Mawar Pink" />
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#ececf0]/60"><span className="text-[13px] font-medium">Gunakan variasi ukuran</span><span className="w-10 h-6 rounded-full bg-[#030213] relative"><span className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white" /></span></div>
        <div className="grid grid-cols-4 gap-1.5">{[["S", "150.000"], ["M", "250.000"], ["L", "350.000"], ["XL", "450.000"]].map(([s, v]) => <div key={s} className="rounded-lg bg-[#f3f3f5] border border-black/10 p-1.5"><p className="text-[10px] text-[#717182]">{s}</p><p className="text-[11px] font-semibold">{v}</p></div>)}</div>
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex flex-col [&>*]:shrink-0 gap-2">
          <p className="text-[13px] font-semibold">🌸 Detail Bunga</p>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]"><div className="rounded-lg bg-white p-1.5"><p className="text-[#717182]">Tipe</p><p className="font-semibold">🌺 Hidup</p></div><div className="rounded-lg bg-white p-1.5"><p className="text-[#717182]">Durasi PO</p><p className="font-semibold">3 hari</p></div><div className="rounded-lg bg-white p-1.5"><p className="text-[#717182]">Ketahanan</p><p className="font-semibold">5 hari</p></div></div>
          <p className="text-[11px] text-[#030213] font-medium text-right">Isi otomatis cara perawatan</p>
        </div>
        <PrimaryBtn className="mt-auto">Simpan Produk</PrimaryBtn>
      </Sheet>
    ),
  },
  {
    title: "Manajemen Pesanan", group: "Penjual",
    body: (
      <>
        <SellerHead title="Pesanan" />
        <div className="flex gap-2 px-4 pt-3 overflow-hidden"><Chip on>Pending (5)</Chip><Chip>Dikonfirmasi</Chip><Chip>Diproses</Chip><Chip>Siap</Chip></div>
        <div className="p-4 flex flex-col [&>*]:shrink-0 gap-3">
          {[["ORD-20261020-0007", "Natalia P.", "Ambil sendiri · 20 Okt, 10:00", "Rp 150.000", "Belum bayar"], ["ORD-20261020-0006", "Kevin R.", "Kirim · 21 Okt, 08:00", "Rp 320.000", "Lunas"]].map(([o, c, m, t, pay]) => (
            <div key={o} className="rounded-2xl border border-black/10 p-4 flex flex-col [&>*]:shrink-0 gap-2.5 shadow-sm">
              <div className="flex justify-between"><span className="text-[13px] font-bold">{o}</span><span className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-700 font-semibold">Pending</span></div>
              <div className="text-[12px] text-[#717182] flex flex-col [&>*]:shrink-0 gap-1"><span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{c}</span><span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{m}</span></div>
              <div className="flex justify-between items-center"><b className="text-[15px]">{t}</b><span className={`text-[11px] px-2 py-0.5 rounded-full ${pay === "Lunas" ? "bg-green-500/10 text-green-700" : "bg-red-500/10 text-red-600"}`}>{pay}</span></div>
              <div className="grid grid-cols-2 gap-2"><PrimaryBtn tone="outline" className="h-10 text-[13px]">Tolak</PrimaryBtn><PrimaryBtn className="h-10 text-[13px]"><Check className="w-4 h-4" />Konfirmasi</PrimaryBtn></div>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    title: "Chat Penjual · Kirim Penawaran", group: "Penjual", dim: true,
    body: (
      <Sheet>
        <div className="flex items-start justify-between"><p className="font-bold text-[17px]">Kirim Penawaran Harga</p><X className="w-5 h-5 text-[#717182]" /></div>
        <div className="rounded-xl bg-[#ececf0]/60 p-3"><p className="text-[11px] font-semibold text-[#717182] flex items-center gap-1 mb-2"><ImageIcon className="w-3.5 h-3.5" />Referensi Desain</p><div className="flex gap-3"><Photo src={IMG.table} className="w-16 h-16 rounded-lg" /><div><p className="text-[13px] font-semibold">Buket mawar pink wisuda</p><p className="text-[11px] text-[#717182]">Pink pastel, ukuran sedang, untuk 20 Okt</p></div></div></div>
        <Field label="Nama Produk *" value="Buket Mawar Pink Wisuda" />
        <Field label="Deskripsi" h={80} value="Pink pastel, ukuran sedang, untuk 20 Okt" />
        <Field label="Harga (Rp) *" prefix="Rp" value="150.000" />
        <div className="grid grid-cols-2 gap-2 mt-auto"><PrimaryBtn tone="outline">Batal</PrimaryBtn><PrimaryBtn><Send className="w-4 h-4" />Kirim Penawaran</PrimaryBtn></div>
      </Sheet>
    ),
  },
  {
    title: "Rekap Penjualan", group: "Penjual",
    body: (
      <>
        <SellerHead title="Rekap Hasil Penjualan" />
        <div className="p-4 flex flex-col [&>*]:shrink-0 gap-3 overflow-hidden">
          <div className="rounded-2xl border border-black/10 p-3"><p className="text-[13px] font-semibold mb-2 flex items-center gap-1.5"><Filter className="w-4 h-4" />Filter Periode</p><div className="grid grid-cols-2 gap-2"><Field label="Tanggal Mulai" value="01/10/2026" /><Field label="Tanggal Selesai" value="31/10/2026" /></div></div>
          <div className="grid grid-cols-2 gap-2.5">{[["Total Penjualan", "Rp 4,85 jt"], ["Jumlah Transaksi", "27"], ["Produk Terjual", "41"], ["Rata-rata/Order", "Rp 179rb"]].map(([l, v]) => <div key={l} className="rounded-2xl bg-[#ececf0]/60 p-3"><p className="text-[11px] text-[#717182]">{l}</p><p className="text-[17px] font-bold">{v}</p></div>)}</div>
          <p className="text-[13px] font-semibold">Produk Terlaris</p>
          {[["Buket Mawar Pink", "12 terjual"], ["Bouquet Pastel", "9 terjual"], ["Papan Bunga Duka", "6 terjual"]].map(([n, q], i) => <div key={n} className="flex items-center gap-3 p-2.5 rounded-xl border border-black/10"><span className="w-7 h-7 rounded-full bg-[#030213] text-white text-[12px] font-bold flex items-center justify-center">{i + 1}</span><span className="flex-1 text-[13px]">{n}</span><span className="text-[12px] text-[#717182]">{q}</span></div>)}
          <PrimaryBtn tone="green"><Download className="w-4 h-4" />Unduh Laporan (.xlsx)</PrimaryBtn>
        </div>
      </>
    ),
  },
  {
    title: "Ulasan & Rating", group: "Penjual",
    body: (
      <>
        <SellerHead title="Ulasan Toko" />
        <div className="p-4 flex flex-col [&>*]:shrink-0 gap-3 overflow-hidden">
          <div className="rounded-2xl border border-black/10 p-4 flex gap-4 items-center"><div className="text-center"><p className="text-[36px] font-bold leading-none">4,8</p><div className="flex gap-0.5 mt-1">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}</div><p className="text-[11px] text-[#717182] mt-1">120 ulasan</p></div><div className="flex-1 flex flex-col [&>*]:shrink-0 gap-1">{[[5, 88], [4, 9], [3, 2], [2, 1], [1, 0]].map(([s, p]) => <div key={s} className="flex items-center gap-2 text-[11px]"><span className="w-3">{s}</span><div className="flex-1 h-1.5 rounded-full bg-[#ececf0]"><div className="h-full rounded-full bg-yellow-400" style={{ width: `${p}%` }} /></div></div>)}</div></div>
          {[["Natalia P.", 5, "Bunganya segar dan rapi, sesuai referensi yang saya kirim. Terima kasih!"], ["Kevin R.", 5, "Pengiriman tepat waktu, packing aman."], ["Grace M.", 4, "Bagus, warnanya sedikit lebih tua dari foto."]].map(([n, r, c]) => (
            <div key={n as string} className="rounded-2xl bg-[#ececf0]/40 p-3.5"><div className="flex justify-between"><p className="text-[13px] font-semibold">{n as string}</p><div className="flex gap-0.5">{Array.from({ length: r as number }).map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}</div></div><p className="text-[12px] text-[#3a3a48] mt-1">{c as string}</p></div>
          ))}
        </div>
      </>
    ),
  },
  {
    title: "Pengaturan Toko", group: "Penjual",
    body: (
      <>
        <SellerHead title="Pengaturan Toko" />
        <div className="p-4 flex flex-col [&>*]:shrink-0 gap-3 overflow-hidden">
          <div className="relative"><Photo src={IMG.shop3} className="h-[120px] w-full rounded-xl" /><span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-white text-[12px] font-medium">Ganti</span></div>
          <Field label="Nama Toko" value="Toko Bunga Melati" />
          <Field label="Nomor Telepon" value="0431 123456" />
          <Field label="Alamat" value="Jl. Sam Ratulangi No. 12, Manado" />
          <span className="text-[13px] font-medium">Kategori Spesialisasi</span>
          <div className="flex gap-1.5 flex-wrap"><Chip on>💐 Bouquet Bunga</Chip><Chip on>💒 Bunga Wedding</Chip><Chip>🥀 Bunga Duka</Chip></div>
          <span className="text-[13px] font-medium flex items-center gap-1.5"><Clock className="w-4 h-4" />Jam Operasional</span>
          <div className="grid grid-cols-4 gap-1.5 text-[12px]">{["Senin", "Sabtu", "08:00", "20:00"].map((v) => <div key={v} className="h-10 rounded-lg bg-[#f3f3f5] border border-black/10 flex items-center justify-center">{v}</div>)}</div>
          <PrimaryBtn className="mt-1">Simpan Perubahan</PrimaryBtn>
        </div>
      </>
    ),
  },
];

export function AppScreensSection({ startNo = 1 }: { startNo?: number }) {
  const groups = ["Umum", "Pembeli", "Pembeli & Penjual", "Penjual"];
  let n = startNo - 1;
  return (
    <>
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
                  <Frame key={s.title} no={n} title={s.title} group={s.group} nav={s.nav} active={s.active} dim={s.dim}>
                    {s.body}
                  </Frame>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

export const APP_SCREEN_COUNT = SCREENS.length;
