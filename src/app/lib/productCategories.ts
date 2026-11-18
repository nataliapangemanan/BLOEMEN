/**
 * Kategori PRODUK — sumber tunggal yang dipakai bersama oleh:
 *  - Form tambah/edit produk penjual (ProductsManagement)
 *  - Kategori di dashboard pembeli (Home) & halaman Kategori
 *  - Halaman daftar produk per kategori (ProductList)
 *
 * `id` sengaja dibuat SAMA dengan nilai yang disimpan pada kolom
 * `products.category`, sehingga pemilihan kategori bisa langsung
 * mencocokkan produk yang tersedia.
 */

export interface ProductCategory {
  id: string;
  label: string;
  emoji: string;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { id: 'Bouquet', label: 'Bouquet', emoji: '💐' },
  { id: 'Hand Bouquet', label: 'Hand Bouquet', emoji: '🌷' },
  { id: 'Vas Bunga', label: 'Vas Bunga', emoji: '🏺' },
  { id: 'Bunga Meja', label: 'Bunga Meja', emoji: '🌼' },
  { id: 'Wedding', label: 'Wedding', emoji: '💒' },
  { id: 'Papan Bunga', label: 'Papan Bunga', emoji: '🎉' },
  { id: 'Bunga Duka', label: 'Bunga Duka', emoji: '🥀' },
  { id: 'Lainnya', label: 'Lainnya', emoji: '🌸' },
];

export const getProductCategoryById = (id: string): ProductCategory | undefined =>
  PRODUCT_CATEGORIES.find((c) => c.id === id);
