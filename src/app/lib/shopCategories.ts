/**
 * Kategori spesialisasi toko bunga.
 * Sebuah toko dapat memilih beberapa kategori, karena ada toko yang
 * hanya menjual bunga hidup, hanya krans / bunga duka, atau hanya bunga uang.
 *
 * Field `searchQuery` dipakai oleh halaman Referensi Desain (Wikimedia Commons)
 * untuk mengambil foto inspirasi yang relevan.
 */

export interface ShopCategory {
  id: string;
  label: string;
  emoji: string;
  description: string;
  searchQuery: string;
}

export const SHOP_CATEGORIES: ShopCategory[] = [
  {
    id: 'bunga_hidup',
    label: 'Bunga Hidup',
    emoji: '🌱',
    description: 'Tanaman & bunga hidup dalam pot',
    searchQuery: 'potted plant living flower',
  },
  {
    id: 'bouquet',
    label: 'Bouquet Bunga',
    emoji: '💐',
    description: 'Hand bouquet & buket pernikahan',
    searchQuery: 'hand bouquet flowers',
  },
  {
    id: 'bunga_duka',
    label: 'Bunga Duka (Krans)',
    emoji: '🥀',
    description: 'Krans, papan bunga duka, standing flower duka',
    searchQuery: 'sympathy funeral wreath flowers',
  },
  {
    id: 'bunga_uang',
    label: 'Bunga Uang',
    emoji: '💵',
    description: 'Rangkaian bunga dari uang kertas',
    searchQuery: 'money bouquet flower cash',
  },
  {
    id: 'papan_bunga',
    label: 'Papan Bunga',
    emoji: '🎉',
    description: 'Papan ucapan selamat / grand opening',
    searchQuery: 'congratulation flower board standing',
  },
  {
    id: 'wedding',
    label: 'Bunga Wedding',
    emoji: '💒',
    description: 'Dekorasi & rangkaian pernikahan',
    searchQuery: 'wedding flower arrangement',
  },
  {
    id: 'vas',
    label: 'Bunga Vas',
    emoji: '🏺',
    description: 'Rangkaian bunga dalam vas',
    searchQuery: 'flower vase arrangement',
  },
  {
    id: 'gift',
    label: 'Hadiah Bunga',
    emoji: '🎁',
    description: 'Hadiah ulang tahun, anniversary, dll',
    searchQuery: 'birthday gift flower',
  },
];

export const getShopCategoryById = (id: string): ShopCategory | undefined =>
  SHOP_CATEGORIES.find((c) => c.id === id);

export const getShopCategoryLabels = (ids: string[] = []): string[] =>
  ids.map((id) => getShopCategoryById(id)?.label ?? id);
