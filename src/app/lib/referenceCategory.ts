import { SHOP_CATEGORIES } from './shopCategories';

/**
 * Menentukan kategori toko (shop category) dari sebuah referensi desain,
 * supaya dialog "Pilih Toko Tujuan" hanya menampilkan toko yang menyediakan
 * kategori tersebut.
 */

/** Kategori produk (products.category) → kategori toko (shops.categories). */
const PRODUCT_TO_SHOP: Record<string, string> = {
  'Bouquet': 'bouquet',
  'Hand Bouquet': 'bouquet',
  'Vas Bunga': 'vas',
  'Bunga Meja': 'vas',
  'Wedding': 'wedding',
  'Papan Bunga': 'papan_bunga',
  'Bunga Duka': 'bunga_duka',
};

export function productCategoryToShopCategory(cat?: string | null): string | null {
  if (!cat) return null;
  return PRODUCT_TO_SHOP[cat] ?? null;
}

/** Urutan penting: yang lebih spesifik dicek lebih dulu. */
const KEYWORDS: [string, string[]][] = [
  ['bunga_duka', ['duka', 'krans', 'funeral', 'sympathy', 'wreath', 'belasungkawa', 'kematian']],
  ['bunga_uang', ['bunga uang', 'money', 'uang', 'cash']],
  ['papan_bunga', ['papan', 'standing', 'grand opening', 'congratulation', 'ucapan selamat']],
  ['wedding', ['wedding', 'pernikahan', 'nikah', 'pengantin', 'bride', 'bridal', 'lamaran']],
  ['vas', ['vas', 'vase', 'meja', 'table', 'centerpiece']],
  ['gift', ['ulang tahun', 'birthday', 'hadiah', 'gift', 'anniversary', 'wisuda', 'graduation', 'kado']],
  ['bunga_hidup', ['pot', 'potted', 'tanaman', 'plant', 'bunga hidup', 'kaktus', 'sukulen']],
  ['bouquet', ['buket', 'bouquet', 'hand bouquet', 'karangan', 'mawar', 'rose', 'tulip', 'lily', 'anggrek', 'orchid', 'matahari', 'sunflower']],
];

export function detectShopCategory(text: string): string | null {
  const hay = (text || '').toLowerCase();
  for (const [id, words] of KEYWORDS) {
    if (words.some((w) => hay.includes(w))) return id;
  }
  return null;
}

export function isValidShopCategory(id: string | null | undefined): id is string {
  return !!id && SHOP_CATEGORIES.some((c) => c.id === id);
}
