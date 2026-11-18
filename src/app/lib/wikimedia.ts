/**
 * Wikimedia Commons API integration untuk inspirasi desain bunga.
 *
 * Wikimedia Commons adalah repositori media bebas milik yayasan Wikimedia
 * (bagian dari ekosistem Wikipedia/Wikidata). API-nya:
 *  - Gratis dan TANPA API key.
 *  - Mendukung CORS via parameter `origin=*` sehingga bisa dipanggil
 *    langsung dari browser/aplikasi.
 *  - Mengembalikan foto asli beserta metadata (deskripsi, pembuat, lisensi).
 *
 * Endpoint: https://commons.wikimedia.org/w/api.php
 * Dokumentasi: https://www.mediawiki.org/wiki/API:Search
 */

const API_BASE = 'https://commons.wikimedia.org/w/api.php';

/**
 * Ambil JSON dengan cara yang andal di semua platform:
 *  - Di perangkat native (Android/iOS via Capacitor): pakai CapacitorHttp yang
 *    melakukan request secara NATIVE sehingga BEBAS dari batasan CORS/webview.
 *    Inilah kunci agar Wikimedia berhasil dimuat di HP asli.
 *  - Di browser/web: pakai fetch biasa dengan timeout agar tidak menggantung.
 */
async function fetchJson(url: string, timeoutMs = 12000): Promise<any> {
  const { Capacitor } = await import('@capacitor/core');

  if (Capacitor.isNativePlatform()) {
    const { CapacitorHttp } = await import('@capacitor/core');
    const res = await CapacitorHttp.get({
      url,
      headers: { Accept: 'application/json', 'Api-User-Agent': 'BloemenApp/1.0 (skripsi; Universitas Sam Ratulangi)' },
      // batas waktu koneksi (milidetik) — didukung plugin http native
      connectTimeout: timeoutMs,
      readTimeout: timeoutMs,
    } as any);
    if (res.status < 200 || res.status >= 300) {
      throw new Error(`Wikimedia Commons API ${res.status}`);
    }
    // CapacitorHttp otomatis mem-parse JSON bila content-type sesuai;
    // jika berupa string, parse manual.
    return typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
  }

  // Web: fetch dengan timeout via AbortController.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json', 'Api-User-Agent': 'BloemenApp/1.0 (skripsi; Universitas Sam Ratulangi)' } });
    if (!res.ok) throw new Error(`Wikimedia Commons API ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export interface WikimediaImage {
  id: string;
  url: string;
  title: string;
  description: string;
  link: string;
  source: 'wikimedia';
  authorName?: string;
  authorLink?: string;
}

// Alias supaya kode lama yang mengimpor `DesignImage` tetap kompatibel.
export type DesignImage = WikimediaImage;

interface CommonsImageInfo {
  url: string;
  thumburl?: string;
  descriptionurl: string;
  extmetadata?: Record<string, { value: string } | undefined>;
}

interface CommonsPage {
  pageid: number;
  title: string;
  imageinfo?: CommonsImageInfo[];
}

/** Menghapus tag HTML dan merapikan whitespace dari nilai metadata Commons. */
function stripHtml(input?: string): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Membuang prefix "File:" dan ekstensi berkas agar judul lebih rapi. */
function cleanTitle(rawTitle: string): string {
  return rawTitle
    .replace(/^File:/i, '')
    .replace(/\.(jpe?g|png|gif|webp|tiff?)$/i, '')
    .replace(/[_-]+/g, ' ')
    .trim();
}

function transform(page: CommonsPage): WikimediaImage | null {
  const info = page.imageinfo?.[0];
  if (!info) return null;
  // Utamakan thumbnail (lebih ringan); jika tidak ada, pakai URL asli.
  const imageUrl = info.thumburl || info.url;
  if (!imageUrl) return null;

  const meta = info.extmetadata || {};
  const rawTitle = cleanTitle(page.title);
  const description = stripHtml(meta.ImageDescription?.value) || rawTitle || 'Inspirasi rangkaian bunga';
  const author = stripHtml(meta.Artist?.value);

  return {
    id: `commons-${page.pageid}`,
    url: imageUrl,
    title: rawTitle || 'Inspirasi Bunga',
    description,
    link: info.descriptionurl,
    source: 'wikimedia',
    authorName: author || undefined,
    authorLink: info.descriptionurl,
  };
}

/**
 * Cadangan (fallback) inspirasi bunga.
 * Dipakai bila Wikimedia Commons tidak dapat dijangkau (mis. jaringan diblokir,
 * CORS, atau "Failed to fetch"). Sumber: Unsplash (bebas dipakai).
 * Setiap item diberi `tags` untuk mendukung pencarian sederhana secara lokal.
 */
interface FallbackFlower {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string;
}

const U = (id: string) => `https://images.unsplash.com/photo-${id}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800`;

const FALLBACK_FLOWERS: FallbackFlower[] = [
  // Umum / campuran
  { id: 'fb-1', url: U('1523693916903-027d144a2b7d'), title: 'Buket Mawar Pink & Putih', description: 'Rangkaian buket mawar pink dan putih', tags: 'flower bouquet rose pink white wedding romantic' },
  { id: 'fb-2', url: U('1572454591674-2739f30d8c40'), title: 'Bunga dalam Vas Kaca', description: 'Bunga pink, krem, dan merah dalam vas kaca', tags: 'flower vase arrangement pink red table meja' },
  { id: 'fb-6', url: U('1685613858397-64f79a0f3603'), title: 'Mawar, Lili & Daisy', description: 'Mawar merah, lili pink, dan daisy putih', tags: 'flower rose lily daisy red pink white florist campuran' },
  { id: 'fb-7', url: U('1531120364508-a6b656c3e78d'), title: 'Aneka Bunga Warna-warni', description: 'Bunga warna-warni di atas kayu', tags: 'flower colorful arrangement florist campuran' },
  { id: 'fb-5', url: U('1567696153798-9111f9cd3d0d'), title: 'Buket Bunga Segar', description: 'Seseorang memegang buket bunga', tags: 'flower bouquet fresh birthday congratulations selamat' },
  // Wedding / putih
  { id: 'fb-w1', url: U('1560238786-aa5717f6ba63'), title: 'Bunga Putih Pernikahan', description: 'Bunga putih lembut untuk pernikahan', tags: 'flower white wedding bouquet elegant' },
  { id: 'fb-w2', url: U('1521520368710-3ab197656d60'), title: 'Buket Putih & Pink', description: 'Buket bunga putih dan pink untuk pernikahan', tags: 'flower white pink wedding bouquet' },
  { id: 'fb-w3', url: U('1700142611715-8a023c5eb8c5'), title: 'Buket Putih di Meja', description: 'Buket bunga putih di atas meja', tags: 'flower white wedding bouquet table elegant' },
  { id: 'fb-w4', url: U('1578534102052-70f4c14ee0e7'), title: 'Buket Bunga Putih', description: 'Buket bunga berkelopak putih', tags: 'flower white wedding bouquet hand' },
  { id: 'fb-w5', url: U('1484676681417-64a0ea3475fd'), title: 'Buket Putih Klasik', description: 'Buket bunga putih klasik', tags: 'flower white wedding bouquet elegant' },
  { id: 'fb-4', url: U('1523694576729-dc99e9c0f9b4'), title: 'Buket Tangan Krem', description: 'Buket tangan warna krem dan putih', tags: 'flower hand bouquet white cream wedding tangan' },
  // Mawar merah / romantis
  { id: 'fb-r1', url: U('1494972308805-463bc619d34e'), title: 'Bunga Mawar Merah', description: 'Bunga mawar merah segar', tags: 'flower rose red romantic valentine love' },
  { id: 'fb-r2', url: U('1518709779341-56cf4535e94b'), title: 'Mawar Merah', description: 'Rangkaian mawar merah', tags: 'flower rose red romantic valentine love' },
  { id: 'fb-r3', url: U('1559779080-6970e0186790'), title: 'Mawar Merah Tunggal', description: 'Bunga mawar merah', tags: 'flower rose red romantic valentine' },
  { id: 'fb-r4', url: U('1620346328449-f8fb90a40ad5'), title: 'Mawar Merah dalam Vas', description: 'Mawar merah dalam vas kaca', tags: 'flower rose red vase romantic table' },
  { id: 'fb-9', url: U('1512056495345-913a0c261dc8'), title: 'Buket Bunga Merah', description: 'Buket bunga merah', tags: 'flower bouquet red rose romantic valentine' },
  // Sunflower / kuning
  { id: 'fb-s1', url: U('1601884928885-92a922f7962f'), title: 'Buket Bunga Matahari', description: 'Buket bunga matahari kuning', tags: 'flower sunflower yellow bouquet cheerful' },
  { id: 'fb-s2', url: U('1560881088-30da8d6e1378'), title: 'Bunga Matahari dalam Vas', description: 'Bunga matahari oranye dalam vas', tags: 'flower sunflower yellow orange vase' },
  { id: 'fb-s3', url: U('1553141825-67a49964ab71'), title: 'Bunga Matahari Kuning', description: 'Empat bunga matahari dalam vas kaca', tags: 'flower sunflower yellow vase table' },
  // Anggrek
  { id: 'fb-o1', url: U('1610397648930-477b8c7f0943'), title: 'Anggrek Ungu', description: 'Bunga anggrek ungu mekar', tags: 'flower orchid purple elegant' },
  { id: 'fb-o2', url: U('1534885320675-b08aa131cc5e'), title: 'Anggrek Ungu Close-up', description: 'Bunga anggrek ungu', tags: 'flower orchid purple elegant' },
  { id: 'fb-o3', url: U('1542407242725-7d7f3d865665'), title: 'Anggrek Pink', description: 'Anggrek pink lembut', tags: 'flower orchid pink elegant' },
  // Duka / sympathy
  { id: 'fb-f1', url: U('1669240728303-305faaf6abf8'), title: 'Bunga Putih Duka', description: 'Rangkaian bunga putih untuk duka cita', tags: 'flower white sympathy funeral duka lily' },
  { id: 'fb-f2', url: U('1631407779166-86952be9dbd7'), title: 'Bunga Duka dalam Vas', description: 'Bunga putih untuk belasungkawa', tags: 'flower white sympathy funeral duka vase' },
  { id: 'fb-f3', url: U('1580595999172-787970a962d8'), title: 'Bunga Putih & Merah', description: 'Bunga putih dan merah', tags: 'flower white red sympathy lily' },
  // Tulip / warna-warni
  { id: 'fb-t1', url: U('1488928741225-2aaf732c96cc'), title: 'Aneka Bunga', description: 'Aneka bunga warna-warni', tags: 'flower colorful tulip mixed campuran' },
  { id: 'fb-t2', url: U('1586968295564-92fd7572718b'), title: 'Tulip Pink', description: 'Bunga tulip pink', tags: 'flower tulip pink colorful' },
  { id: 'fb-t3', url: U('1525898939552-346875c89d92'), title: 'Tulip Pink & Kuning', description: 'Bunga tulip pink dan kuning', tags: 'flower tulip pink yellow colorful' },
  { id: 'fb-t4', url: U('1518701005037-d53b1f67bb1c'), title: 'Tulip Merah & Pink', description: 'Bunga tulip merah dan pink', tags: 'flower tulip red pink colorful' },
  // Vas / meja
  { id: 'fb-8', url: U('1603178455924-ef33372953bb'), title: 'Bunga Oranye dalam Vas', description: 'Bunga oranye dalam vas kaca bening', tags: 'flower vase orange arrangement table meja' },
  { id: 'fb-10', url: U('1606101083393-bded314215cd'), title: 'Buket Ungu & Pink', description: 'Buket bunga ungu dan pink', tags: 'flower bouquet purple pink romantic' },
  { id: 'fb-11', url: U('1557925923-6885735abfb1'), title: 'Buket Mawar Putih', description: 'Buket bunga mawar putih dan krem', tags: 'flower bouquet rose white cream wedding' },
  { id: 'fb-3', url: U('1487530811176-3780de880c2d'), title: 'Buket Mawar', description: 'Buket bunga mawar segar', tags: 'flower bouquet rose red romantic wedding' },
];

function fallbackToImage(f: FallbackFlower): WikimediaImage {
  return {
    id: f.id,
    url: f.url,
    title: f.title,
    description: f.description,
    link: f.url,
    source: 'wikimedia',
  };
}

/** Ambil inspirasi cadangan; bila `query` diisi, saring berdasarkan tag. */
function getFallback(query: string, perPage: number, page: number): WikimediaImage[] {
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/).filter((w) => w.length > 2 && !/^flower$/.test(w));
  let pool = FALLBACK_FLOWERS;
  if (words.length > 0) {
    const matched = FALLBACK_FLOWERS.filter((f) => {
      const hay = `${f.tags} ${f.title} ${f.description}`.toLowerCase();
      return words.some((w) => hay.includes(w));
    });
    // Kalau ada yang cocok pakai itu; kalau tidak, tetap tampilkan semua bunga.
    if (matched.length > 0) pool = matched;
  }
  const start = Math.max(0, (Math.max(1, page) - 1) * perPage);
  return pool.slice(start, start + perPage).map(fallbackToImage);
}

interface CommonsSearchPage extends CommonsPage {
  categories?: { title: string }[];
  index?: number;
}

/**
 * Panggil pencarian Commons. Selain imageinfo, ikut diambil kategori berkas
 * (tanpa kategori tersembunyi/lisensi) dan MIME/ukuran gambar, agar hasil
 * bisa disaring berdasarkan konteks sebenarnya — bukan hanya judul.
 */
async function commonsSearch(query: string, perPage: number, page: number): Promise<{ img: WikimediaImage; cats: string; mime: string; width: number; rank: number }[]> {
  const limit = Math.min(Math.max(perPage, 1), 50);
  const offset = Math.max(0, (Math.max(1, page) - 1) * limit);

  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6', // namespace 6 = berkas (File)
    gsrlimit: String(limit),
    gsroffset: String(offset),
    prop: 'imageinfo|categories',
    iiprop: 'url|extmetadata|mime|size',
    iiurlwidth: '800',
    clshow: '!hidden',
    cllimit: 'max',
  });

  const data = await fetchJson(`${API_BASE}?${params.toString()}`);
  const pages: Record<string, CommonsSearchPage> = data?.query?.pages ?? {};
  return Object.values(pages)
    .map((pg) => {
      const img = transform(pg);
      const info: any = pg.imageinfo?.[0] ?? {};
      return img && {
        img,
        cats: (pg.categories ?? []).map((c) => c.title.replace(/^Category:/, '')).join(' | '),
        mime: String(info.mime ?? ''),
        width: Number(info.width ?? 0),
        rank: pg.index ?? 0,
      };
    })
    .filter((x): x is { img: WikimediaImage; cats: string; mime: string; width: number; rank: number } => !!x)
    .sort((a, b) => a.rank - b.rank);
}

/* -------------------------------------------------------------------------
 * PEMBATASAN KONTEKS (agar hasil tidak "out of context")
 *
 * Masalah: pencarian teks bebas di Commons mencocokkan kata di SELURUH
 * deskripsi berkas, sehingga kata "funeral" bisa menarik obituari koran,
 * scan buku, atau lukisan museum.
 *
 * Solusi berlapis:
 *  1. Batasi pencarian ke KATEGORI Commons yang memang berisi foto rangkaian
 *     bunga (incategory:), dipilih sesuai tema (duka, wedding, vas, dll.).
 *     Nama kategori sudah dicek keberadaannya di Commons.
 *  2. Hanya berkas foto: filetype:bitmap + MIME jpeg/png/webp + lebar ≥ 500 px.
 *  3. Kata kunci yang dikirim hanya jenis bunga & warna (mis. "red rose"),
 *     kata tema/umum dibuang karena tema sudah diwakili kategori.
 *  4. Saring ulang berdasarkan kategori berkas: buang lukisan, ilustrasi,
 *     koleksi museum, dokumen, peta, dll.
 *  5. Urutkan berdasarkan kecocokan kata kunci; bila hasil terlalu sedikit,
 *     longgarkan bertahap (kategori umum → teks bebas tersaring → cadangan).
 * ----------------------------------------------------------------------- */

const CAT_SETS: Record<string, string[]> = {
  umum: ['Flower_bouquets', 'Rose_bunches', 'Bouquets_of_tulips', 'Bouquets_of_peonies', 'Bouquets_of_chrysanthemums', 'Bridal_bouquets', 'Birthday_flowers', 'Flower_gifts', 'Flowers_in_vases', 'Arranging_flowers', 'Flower_arrangements', 'Flower_baskets', 'Roses_in_floristry', 'Tulips_in_floristry'],
  bouquet: ['Flower_bouquets', 'Rose_bunches', 'Bouquets_of_tulips', 'Bouquets_of_peonies', 'Bouquets_of_chrysanthemums', 'Roses_in_floristry', 'Flower_gifts'],
  wedding: ['Bridal_bouquets', 'Wedding_floristry', 'Corsages_(flowers)', 'Flower_garlands'],
  duka: ['Memorial_floristry', 'Artificial_funeral_wreaths', 'Funeral_wreaths', 'Memorial_wreaths', 'Flower_wreaths'],
  papan: ['Flower_stands', 'Flower_decorations', 'Floral_arches', 'Memorial_floristry'],
  vas: ['Flowers_in_vases', 'Tulips_in_vases', 'Arranging_flowers', 'Flower_arrangements'],
  hidup: ['Potted_plants', 'Orchids_in_pots'],
  hadiah: ['Birthday_flowers', 'Flower_gifts', 'Flower_baskets', 'Rose_bunches', 'Flower_bouquets'],
};

/** Tema ditentukan dari kata kunci (sudah diterjemahkan ke Inggris). */
function detectTheme(q: string): keyof typeof CAT_SETS {
  if (/funeral|sympathy|wreath|mourning|condolence/.test(q)) return 'duka';
  if (/congratulation|grand opening|stand\b|standing|board/.test(q)) return 'papan';
  if (/wedding|bridal|bride|marriage/.test(q)) return 'wedding';
  if (/vase|centerpiece|table/.test(q)) return 'vas';
  if (/potted|\bplant|\bpot\b|living flower/.test(q)) return 'hidup';
  if (/birthday|gift|graduation|anniversary|valentine|mothers day|money|cash/.test(q)) return 'hadiah';
  if (/bouquet|hand bouquet/.test(q)) return 'bouquet';
  return 'umum';
}

/** Hanya kata yang benar-benar membedakan isi foto: jenis bunga & warna. */
const KEEP_WORDS = /^(rose|roses|tulip|tulips|lily|lilies|orchid|orchids|sunflower|sunflowers|chrysanthemum|carnation|peony|peonies|jasmine|hydrangea|daisy|daisies|gypsophila|frangipani|tuberose|aster|lavender|red|white|yellow|pink|purple|blue|orange|green|cream|pastel)$/;
function contentWords(q: string): string[] {
  return Array.from(new Set(q.toLowerCase().split(/[^a-z]+/).filter((w) => KEEP_WORDS.test(w))));
}

/** Kategori/teks yang menandakan BUKAN foto rangkaian bunga. */
const OFF_CONTEXT = /navy|army|military|soldier|lance cpl|sergeant|actress|actor|first lady|bestanddeelnr|nationaal archief|bibliothek|vendor|market|vrouwen|\bwomen\b|\bwoman\b|\bgirl|\bboy\b|children|procession|funeral of|funeral rites|portrait|cemetery|friedhof|\bgrave\b|\bgrab\b|\btomb|church|kirche|kyrkje|cathedral|statue|stolperstein|monument|memorial service|\bflag\b|parade|festival|concert|exhibit|interior|hotel|library|people|ceremony|manneken|soldier|president|\bking\b|\bqueen\b|regele|politician|minister|painting|paintings|drawing|drawings|illustration|engraving|lithograph|watercolou?r|still life|museum|wellcome|rijksmuseum|metropolitan|national gallery|artworks?|sculpture|stained glass|textile|embroider|wallpaper|ceramic|porcelain|postcard|poster|book|manuscript|newspaper|obituar|document|map\b|maps\b|diagram|logo|coat of arms|heraldry|stamp|coin|banknote|biodiversity|herbarium|specimen|scanned|pdf|djvu|svg|icon|emblem|symbol|clip ?art|cartoon|screenshot|video|game/i;

const FLOWER_ANY_LANG = /flower|floral|bouquet|wreath|garland|corsage|\brose|roses|tulip|lily|lilies|orchid|peon|chrysanth|carnation|sunflower|daisy|daisies|hydrangea|gerbera|blumen|strau(ß|ss)|kranz|kränze|fleur|\bramo|\bflor|corona de|bunga|karangan|букет|цвет|kwiat|bukiet|wieniec|bloem|boeket|krans|fiori|mazzo|花/i;

function isOnContext(x: { img: WikimediaImage; cats: string; mime: string; width: number }): boolean {
  if (!/image\/(jpeg|png|webp)/.test(x.mime)) return false;
  if (x.width && x.width < 500) return false;
  const text = `${x.img.title} ${x.img.description} ${x.cats}`;
  if (OFF_CONTEXT.test(text) || JUNK_KEYWORDS.test(`${x.img.title} ${x.cats}`)) return false;
  // Judul/deskripsi harus menyebut bunga (multibahasa) — kategori saja tidak cukup.
  return FLOWER_ANY_LANG.test(`${x.img.title} ${x.img.description}`);
}

function rank(list: { img: WikimediaImage; cats: string }[], words: string[]): WikimediaImage[] {
  return list
    .map((x, i) => {
      const hay = `${x.img.title} ${x.img.description} ${x.cats}`.toLowerCase();
      const title = x.img.title.toLowerCase();
      const score = words.reduce((s, w) => s + (hay.includes(w) ? 2 : 0), 0) +
        (/bouquet|arrangement|vase|wreath|strau|boeket|bloemstuk|corsage|basket/.test(title) ? 1 : 0);
      return { img: x.img, score, i };
    })
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((x) => x.img);
}

/** Pencarian terbatas kategori; jumlah diambil berlebih lalu disaring. */
async function contextualSearch(translated: string, perPage: number, page: number): Promise<WikimediaImage[]> {
  const theme = detectTheme(translated);
  const words = contentWords(translated);
  const attempts: string[] = [];
  const cat = (set: string[]) => `incategory:${set.join('|')}`;
  // 1) tema + kata kunci  2) tema saja  3) kategori umum + kata kunci
  if (words.length) attempts.push(`${words.join(' ')} ${cat(CAT_SETS[theme])} filetype:bitmap`);
  attempts.push(`${cat(CAT_SETS[theme])} filetype:bitmap`);
  if (theme !== 'umum' && words.length) attempts.push(`${words.join(' ')} ${cat(CAT_SETS.umum)} filetype:bitmap`);
  // Tema dengan koleksi kecil diperkaya foto rangkaian bernuansa serupa.
  const HINT: Record<string, string> = { duka: 'white', papan: 'arrangement', hidup: 'orchid', wedding: 'bridal', vas: 'vase', hadiah: 'bouquet' };
  if (HINT[theme]) attempts.push(`${HINT[theme]} ${cat(CAT_SETS.umum)} filetype:bitmap`);

  const seen = new Set<string>();
  const out: WikimediaImage[] = [];
  for (const q of attempts) {
    let raw: Awaited<ReturnType<typeof commonsSearch>> = [];
    try {
      raw = await commonsSearch(q, Math.min(50, perPage * 2), page);
    } catch (e) {
      // Mis. 429 (terlalu banyak permintaan): pakai hasil yang sudah ada.
      if (out.length) break;
      throw e;
    }
    for (const img of rank(raw.filter(isOnContext), words)) {
      if (!seen.has(img.id)) { seen.add(img.id); out.push(img); }
    }
    if (out.length >= perPage) break;
  }
  return out.slice(0, perPage);
}

/**
 * Kamus terjemahan Indonesia → Inggris.
 * Wikimedia Commons sebagian besar diindeks dalam bahasa Inggris, sehingga
 * kata kunci bahasa Indonesia perlu diterjemahkan agar hasilnya relevan.
 * Pencocokan dilakukan per-kata (word boundary), tidak sensitif huruf besar/kecil.
 */
const ID_TO_EN: Record<string, string> = {
  // Jenis rangkaian
  'bunga': 'flower',
  'bunga-bunga': 'flowers',
  'buket': 'bouquet',
  'buket tangan': 'hand bouquet',
  'karangan': 'arrangement',
  'karangan bunga': 'flower arrangement',
  'rangkaian': 'arrangement',
  // Catatan: JANGAN pakai kata "board" — di Wikimedia itu menarik papan/dokumen,
  // bukan rangkaian bunga. Pakai istilah bunga yang aman.
  'papan bunga': 'flower stand congratulation',
  'papan': 'flower stand',
  'bunga papan': 'flower stand congratulation',
  'vas': 'vase',
  'vas bunga': 'flower vase',
  'bunga meja': 'table flower centerpiece',
  'mahkota': 'flower crown',
  'mahkota bunga': 'flower crown',
  'korsase': 'corsage',
  // Acara / tema
  'pernikahan': 'wedding',
  'nikah': 'wedding',
  'kawin': 'wedding',
  'ulang tahun': 'birthday',
  'ultah': 'birthday',
  'wisuda': 'graduation',
  'duka': 'sympathy funeral',
  'dukacita': 'sympathy funeral',
  'belasungkawa': 'sympathy funeral',
  'kematian': 'funeral',
  'selamat': 'congratulations',
  'cinta': 'romantic',
  'romantis': 'romantic',
  'valentine': 'valentine',
  'natal': 'christmas',
  'lebaran': 'celebration',
  'anniversary': 'anniversary',
  'hari ibu': 'mothers day',
  // Jenis bunga
  'mawar': 'rose',
  'melati': 'jasmine',
  'anggrek': 'orchid',
  'tulip': 'tulip',
  'matahari': 'sunflower',
  'bunga matahari': 'sunflower',
  'lili': 'lily',
  'bakung': 'lily',
  'krisan': 'chrysanthemum',
  'aster': 'aster',
  'anyelir': 'carnation',
  'sedap malam': 'tuberose',
  'kamboja': 'frangipani',
  'peoni': 'peony',
  'hydrangea': 'hydrangea',
  'baby breath': 'baby breath gypsophila',
  // Warna
  'merah': 'red',
  'putih': 'white',
  'kuning': 'yellow',
  'pink': 'pink',
  'ungu': 'purple',
  'biru': 'blue',
  'oranye': 'orange',
  'jingga': 'orange',
  'hijau': 'green',
  'warna-warni': 'colorful',
  // Deskriptor
  'cantik': 'beautiful',
  'indah': 'beautiful',
  'segar': 'fresh',
  'elegan': 'elegant',
  'sederhana': 'simple',
  'mewah': 'luxury',
};

/** Terjemahkan kata kunci Indonesia ke Inggris (per kata & per frasa). */
function translateQuery(query: string): string {
  let q = ` ${query.toLowerCase().trim()} `;
  // Frasa lebih dulu (yang mengandung spasi), agar "bunga matahari" tidak
  // keburu diganti oleh "bunga" saja.
  const phrases = Object.keys(ID_TO_EN)
    .filter((k) => k.includes(' '))
    .sort((a, b) => b.length - a.length);
  for (const phrase of phrases) {
    const re = new RegExp(`(?<=\\s)${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=\\s)`, 'gi');
    q = q.replace(re, ` ${ID_TO_EN[phrase]} `);
  }
  // Kata tunggal
  q = q
    .split(/\s+/)
    .map((word) => ID_TO_EN[word] ?? word)
    .join(' ');
  return q.replace(/\s+/g, ' ').trim();
}

// Kata kunci yang menandakan sebuah gambar benar-benar bertema bunga.
const FLOWER_KEYWORDS = /flower|floral|bouquet|blossom|bloom|rose|orchid|tulip|lily|lilies|sunflower|chrysanthemum|carnation|peony|peonies|jasmine|hydrangea|daisy|daisies|arrangement|florist|petal|gypsophila|frangipani/i;

/**
 * Daftar-blokir: kata yang menandakan gambar BUKAN foto bunga asli, melainkan
 * scan buku, ilustrasi botani kuno, herbarium, peta, dokumen arsip, dll.
 * Wikimedia Commons banyak berisi materi semacam ini (mis. Biodiversity
 * Heritage Library) yang metadatanya menyebut "flower" tapi gambarnya hanya
 * sampul buku / halaman kosong.
 */
const JUNK_KEYWORDS = /archive|biodiversity|heritage library|herbarium|specimen|manuscript|\bbook\b|libri|\bpage\b|title page|frontispiece|\bplate\b|engrav|lithograph|etching|woodcut|\bdrawing\b|illustration|\bsketch\b|diagram|\bmap\b|\bchart\b|stamp|postage|\bcoin\b|banknote|coat of arms|\bcover\b|\bscan(ned)?\b|\bbhl\b|catalogue|\bcatalog\b|journal|magazine|newspaper|botanical print|\bprinted\b|\bfossil\b|watercolor painting/i;

/**
 * Kata-kata yang dikecualikan langsung pada pencarian Wikimedia (sintaks `-kata`)
 * supaya buku/ilustrasi/arsip tidak ikut terambil sejak awal.
 */
const EXCLUDE_TERMS = '-book -herbarium -illustration -map -manuscript -engraving -diagram -stamp -document -archive';

/** Saring hasil agar hanya menyisakan FOTO bunga (bukan buku/ilustrasi/arsip). */
function keepFlowersOnly(images: WikimediaImage[]): WikimediaImage[] {
  return images.filter((img) => {
    const text = `${img.title} ${img.description} ${img.url}`;
    // 1) Buang materi non-foto (buku, arsip, ilustrasi, dsb.).
    if (JUNK_KEYWORDS.test(text)) return false;
    // 2) Sisakan hanya yang benar-benar bertema bunga.
    return FLOWER_KEYWORDS.test(img.title) || FLOWER_KEYWORDS.test(img.description);
  });
}

const CACHE = new Map<string, WikimediaImage[]>();

export async function searchWikimedia(query: string, perPage = 30, page = 1): Promise<WikimediaImage[]> {
  const translated = translateQuery(query);
  const key = `${translated}|${perPage}|${page}`;
  if (CACHE.has(key)) return CACHE.get(key)!;
  try {
    // 1) Utama: pencarian dibatasi kategori foto rangkaian bunga.
    let results = await contextualSearch(translated, perPage, page);
    // 2) Bila masih sangat sedikit, coba teks bebas yang tetap disaring ketat.
    if (results.length < Math.min(6, perPage)) {
      const base = /flower|floral|bouquet|blossom/i.test(translated) ? translated : `${translated} flower`;
      const raw = await commonsSearch(`${base} filetype:bitmap ${EXCLUDE_TERMS}`, perPage, page);
      const extra = keepFlowersOnly(raw.filter(isOnContext).map((x) => x.img));
      const ids = new Set(results.map((r) => r.id));
      results = results.concat(extra.filter((e) => !ids.has(e.id))).slice(0, perPage);
    }
    console.log(`[BLOEMEN] Wikimedia "${query}" → "${translated}" (tema ${detectTheme(translated)}): ${results.length} gambar relevan`);
    // 3) Tetap kosong → koleksi cadangan lokal.
    if (results.length > 0) { CACHE.set(key, results); return results; }
    return getFallback(translated, perPage, page);
  } catch (e) {
    console.warn('Wikimedia search gagal, memakai inspirasi cadangan:', e);
    return getFallback(translated, perPage, page);
  }
}

export async function getPopularFlowers(perPage = 30, page = 1): Promise<WikimediaImage[]> {
  try {
    const results = await contextualSearch('flower bouquet', perPage, page);
    return results.length > 0 ? results : getFallback('', perPage, page);
  } catch (e) {
    console.warn('Wikimedia populer gagal, memakai inspirasi cadangan:', e);
    return getFallback('', perPage, page);
  }
}

export function getPopularSearches(): string[] {
  return [
    'buket pernikahan',
    'bunga ulang tahun',
    'mawar merah',
    'bunga duka',
    'papan bunga',
    'buket tangan',
    'bunga matahari',
    'anggrek',
    'tulip',
    'bunga meja',
  ];
}
