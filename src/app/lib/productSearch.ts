import { getProductCategoryById } from './productCategories';
import { productCategoryToShopCategory, detectShopCategory } from './referenceCategory';

/**
 * Pencarian produk toko yang memahami sinonim Indonesia/Inggris.
 * Dipakai di halaman Referensi Desain ("Dari Toko di Bloemen") dan Daftar Produk,
 * sehingga hasil produk toko selalu sesuai dengan kata yang dicari pembeli.
 *
 *  - Kata umum (bunga, yang, untuk, …) diabaikan.
 *  - Setiap kata dicocokkan beserta sinonimnya, mis. "pernikahan" juga cocok
 *    dengan kategori "Wedding", "duka" cocok dengan "Bunga Duka"/"krans".
 *  - Semua kata harus cocok (AND). Bila tidak ada yang cocok sempurna,
 *    ditampilkan produk yang paling mendekati (ditandai exact = false).
 */

const GROUPS: string[][] = [
  ['pernikahan', 'nikah', 'wedding', 'pengantin', 'bride', 'bridal', 'lamaran'],
  ['duka', 'dukacita', 'duka cita', 'belasungkawa', 'kematian', 'krans', 'funeral', 'sympathy'],
  ['ulang tahun', 'ultah', 'birthday', 'hadiah', 'kado', 'gift'],
  ['wisuda', 'graduation', 'kelulusan'],
  ['papan', 'papan bunga', 'standing', 'grand opening', 'ucapan selamat', 'congratulation'],
  ['vas', 'vase', 'meja', 'bunga meja', 'table'],
  ['buket', 'bouquet', 'hand bouquet', 'buket tangan', 'karangan'],
  ['uang', 'bunga uang', 'money'],
  ['mawar', 'rose', 'roses'],
  ['anggrek', 'orchid'],
  ['matahari', 'bunga matahari', 'sunflower'],
  ['lili', 'lily', 'bakung'],
  ['tulip'],
  ['krisan', 'chrysanthemum', 'seruni'],
  ['anyelir', 'carnation'],
  ['melati', 'jasmine'],
  ['baby breath', "baby's breath", 'gypsophila'],
  ['hidup', 'bunga hidup', 'segar', 'fresh', 'live'],
  ['artificial', 'artifisial', 'palsu', 'plastik'],
  ['merah', 'red'], ['putih', 'white'], ['pink', 'merah muda'], ['kuning', 'yellow'],
  ['ungu', 'purple', 'lavender'], ['biru', 'blue'], ['oranye', 'jingga', 'orange'], ['pastel'],
];
const STOP = new Set(['bunga', 'flower', 'flowers', 'yang', 'untuk', 'dan', 'di', 'ke', 'dengan', 'buat', 'mau', 'cari', 'model', 'desain', 'design', 'inspirasi', 'acara', 'the', 'of']);

export interface ProductSearchResult<T> { items: T[]; exact: boolean; terms: string[] }

/** Pecah kueri menjadi kelompok alternatif (frasa lebih dulu, lalu kata). */
export function parseQuery(query: string): string[][] {
  let q = ` ${query.toLowerCase().replace(/[^a-z0-9' ]+/g, ' ')} `;
  const groups: string[][] = [];
  const phrases = GROUPS.flatMap((g) => g.filter((t) => t.includes(' ')).map((t) => ({ t, g }))).sort((a, b) => b.t.length - a.t.length);
  for (const { t, g } of phrases) {
    if (q.includes(` ${t} `)) { groups.push(g); q = q.replace(` ${t} `, ' '); }
  }
  for (const w of q.split(/\s+/).filter(Boolean)) {
    if (STOP.has(w) || w.length < 3) continue;
    const g = GROUPS.find((gr) => gr.includes(w));
    groups.push(g ?? [w]);
  }
  // hilangkan kelompok duplikat
  const seen = new Set<string>();
  return groups.filter((g) => (seen.has(g[0]) ? false : (seen.add(g[0]), true)));
}

const FLOWER_TYPE: Record<string, string> = { live: 'bunga hidup segar fresh', artificial: 'artificial artifisial', mixed: 'campuran bunga hidup artificial' };

export function searchProducts<T extends Record<string, any>>(products: T[], query: string, shopCategory?: string | null): ProductSearchResult<T> {
  let pool = products;
  if (shopCategory) {
    pool = pool.filter((p) => (productCategoryToShopCategory(p.category) ?? detectShopCategory(`${p.name} ${p.description ?? ''}`)) === shopCategory);
  }
  const groups = parseQuery(query);
  if (groups.length === 0) return { items: pool, exact: true, terms: [] };

  const scored = pool.map((p) => {
    const name = String(p.name ?? '').toLowerCase();
    const cat = `${p.category ?? ''} ${getProductCategoryById(p.category)?.label ?? ''}`.toLowerCase();
    const desc = `${p.description ?? ''} ${p.care_instructions ?? ''} ${FLOWER_TYPE[p.flower_type] ?? ''}`.toLowerCase();
    const shop = String(p.shops?.name ?? '').toLowerCase();
    let score = 0, hit = 0;
    for (const g of groups) {
      const has = (s: string) => g.some((t) => new RegExp(`(^|[^a-z])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(s));
      // Nama toko hanya menambah skor, tidak dihitung sebagai "cocok" —
      // agar toko bernama "Rose House" tidak membuat semua produknya cocok dengan "mawar".
      const s = (has(name) ? 3 : 0) + (has(cat) ? 3 : 0) + (has(desc) ? 1 : 0);
      if (s > 0) hit++;
      score += s + (has(shop) ? 1 : 0);
    }
    return { p, score, hit };
  });
  const all = scored.filter((x) => x.hit === groups.length).sort((a, b) => b.score - a.score);
  if (all.length) return { items: all.map((x) => x.p), exact: true, terms: groups.map((g) => g[0]) };
  const some = scored.filter((x) => x.hit > 0).sort((a, b) => b.hit - a.hit || b.score - a.score);
  return { items: some.map((x) => x.p), exact: false, terms: groups.map((g) => g[0]) };
}
