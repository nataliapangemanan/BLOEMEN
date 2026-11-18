/**
 * Panduan ketahanan & penyimpanan bunga hidup.
 * Dipakai di detail produk, pre-order, dan penawaran di chat.
 * Nilai adalah estimasi umum (vas, suhu ruang ±25°C, perawatan rutin).
 */

export interface FlowerCareProfile {
  key: string;
  name: string;
  minDays: number;
  maxDays: number;
  tip: string;
}

export const FLOWER_CARE_PROFILES: FlowerCareProfile[] = [
  { key: 'mawar', name: 'Mawar', minDays: 5, maxDays: 7, tip: 'Buang daun yang terendam air dan kelopak luar yang layu.' },
  { key: 'krisan', name: 'Krisan', minDays: 10, maxDays: 14, tip: 'Sangat tahan lama; cukup ganti air tiap 2 hari.' },
  { key: 'lily', name: 'Lily', minDays: 7, maxDays: 10, tip: 'Cabut serbuk sari (benang kuning) agar kelopak tidak bernoda.' },
  { key: 'tulip', name: 'Tulip', minDays: 3, maxDays: 7, tip: 'Gunakan air dingin; tulip tetap tumbuh dan melengkung di vas.' },
  { key: 'baby', name: "Baby's Breath", minDays: 7, maxDays: 10, tip: 'Bisa dikeringkan dengan digantung terbalik setelah layu.' },
  { key: 'matahari', name: 'Bunga Matahari', minDays: 6, maxDays: 10, tip: 'Butuh banyak air — isi vas lebih tinggi dari biasanya.' },
  { key: 'anggrek', name: 'Anggrek', minDays: 14, maxDays: 21, tip: 'Semprot kelopak dengan sedikit air, hindari AC langsung.' },
  { key: 'gerbera', name: 'Gerbera', minDays: 5, maxDays: 7, tip: 'Isi air dangkal (±5 cm) agar batang tidak membusuk.' },
  { key: 'aster', name: 'Aster', minDays: 7, maxDays: 10, tip: 'Potong batang tiap 2 hari agar tetap menyerap air.' },
  { key: 'carnation', name: 'Anyelir / Carnation', minDays: 10, maxDays: 14, tip: 'Jauhkan dari buah yang matang (gas etilen).' },
  { key: 'hydrangea', name: 'Hydrangea', minDays: 5, maxDays: 9, tip: 'Rendam seluruh kepala bunga 30 menit bila mulai layu.' },
  { key: 'peony', name: 'Peony', minDays: 5, maxDays: 7, tip: 'Kuncup mekar dalam 1–2 hari; simpan dingin untuk memperlambat.' },
];

const KEYWORDS: Record<string, string[]> = {
  mawar: ['mawar', 'rose'],
  krisan: ['krisan', 'chrysant', 'seruni'],
  lily: ['lily', 'lili', 'bakung'],
  tulip: ['tulip'],
  baby: ['baby breath', "baby's breath", 'babybreath', 'gypsophila'],
  matahari: ['matahari', 'sunflower'],
  anggrek: ['anggrek', 'orchid', 'orkid'],
  gerbera: ['gerbera', 'herbras'],
  aster: ['aster'],
  carnation: ['anyelir', 'carnation'],
  hydrangea: ['hydrangea', 'hortensia'],
  peony: ['peony', 'peoni'],
};

/** Deteksi jenis bunga dari teks nama/deskripsi produk. */
export function detectFlowers(text: string): FlowerCareProfile[] {
  const hay = (text || '').toLowerCase();
  return FLOWER_CARE_PROFILES.filter((p) => KEYWORDS[p.key]?.some((k) => hay.includes(k)));
}

/** Estimasi rentang ketahanan; pakai nilai penjual bila tersedia. */
export function estimateLifetime(text: string, sellerDays?: number | null): { min: number; max: number; fromSeller: boolean } {
  if (sellerDays && sellerDays > 0) return { min: sellerDays, max: sellerDays, fromSeller: true };
  const found = detectFlowers(text);
  if (found.length === 0) return { min: 5, max: 7, fromSeller: false };
  // Rangkaian campuran: ketahanan mengikuti bunga yang paling cepat layu.
  return {
    min: Math.min(...found.map((f) => f.minDays)),
    max: Math.min(...found.map((f) => f.maxDays)),
    fromSeller: false,
  };
}

export function formatLifetime(r: { min: number; max: number }): string {
  return r.min === r.max ? `±${r.min} hari` : `${r.min}–${r.max} hari`;
}

/** Langkah penyimpanan umum bunga potong segar. */
export const STORAGE_STEPS: { title: string; body: string }[] = [
  { title: 'Begitu diterima', body: 'Buka plastik pembungkus, potong batang miring 1–2 cm memakai pisau tajam, lalu segera taruh di vas berisi air bersih.' },
  { title: 'Air vas', body: 'Isi ⅓–½ vas. Ganti air setiap 1–2 hari dan cuci vas agar bakteri tidak menyumbat batang.' },
  { title: 'Daun di bawah air', body: 'Buang daun yang terendam — daun busuk mempercepat layu.' },
  { title: 'Letak', body: 'Simpan di tempat sejuk (18–25°C), jauh dari sinar matahari langsung, kipas/AC, dan buah yang matang.' },
  { title: 'Malam hari', body: 'Untuk memperpanjang umur, pindahkan ke ruangan paling sejuk saat malam. Jangan simpan di freezer.' },
  { title: 'Bunga buket / spons', body: 'Jika memakai floral foam, siram spons sampai basah setiap hari tanpa membongkar rangkaian.' },
];

/** Waktu tunggu aman sebelum bunga hidup diambil / dikirim. */
export const PICKUP_NOTE =
  'Bunga hidup dirangkai mendekati jadwal pengambilan. Usahakan ambil tepat waktu — bunga yang menunggu lebih dari 4–6 jam tanpa air akan lebih cepat layu.';
