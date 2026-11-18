import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, Loader2, Heart, ExternalLink, MapPin, Send, X, Store, ImagePlus, Trash2, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  uploadDesignReference,
  getMyDesignReferences,
  deleteDesignReference,
  type UserDesignReference,
} from '../lib/designReferences';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { getAllShops, getAllProducts } from '../lib/api';
import { FLOWER_PLACEHOLDER } from '../lib/placeholder';
import { searchWikimedia, getPopularFlowers, getPopularSearches, type WikimediaImage } from '../lib/wikimedia';
import { getShopCategoryById, getShopCategoryLabels, SHOP_CATEGORIES } from '../lib/shopCategories';
import { detectShopCategory, productCategoryToShopCategory } from '../lib/referenceCategory';
import { searchProducts } from '../lib/productSearch';
import { useGoBack } from '../lib/navigation';

interface Shop {
  id: string;
  name: string;
  address: string;
  distance?: number;
  categories?: string[];
}

/**
 * Gambar referensi bisa berasal dari dua sumber:
 *  - Wikimedia Commons (inspirasi umum)
 *  - Produk nyata dari toko yang sudah terdaftar (diprioritaskan/disisipkan)
 */
type DesignImage = WikimediaImage & {
  isProduct?: boolean;
  price?: number;
  productId?: string;
  shopId?: string;
  shopName?: string;
  category?: string;
  isUpload?: boolean;
  /** Kategori toko (shops.categories) yang sesuai dengan referensi ini. */
  shopCategory?: string | null;
};

export default function DesignReference() {
  const navigate = useNavigate();
  const goBack = useGoBack('/');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<DesignImage | null>(null);
  const [showShopsDialog, setShowShopsDialog] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [nearbyShops, setNearbyShops] = useState<Shop[]>([]);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>('flower bouquet arrangement');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [inspirationImages, setInspirationImages] = useState<DesignImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  // Produk nyata dari toko + kata kunci yang sedang aktif (untuk mencocokkan produk).
  const [products, setProducts] = useState<any[]>([]);
  const [committedQuery, setCommittedQuery] = useState<string>('');

  // Referensi yang diunggah sendiri oleh pembeli (tabel design_references)
  const { user } = useAuth();
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [myRefs, setMyRefs] = useState<UserDesignReference[]>([]);
  const [uploadingRef, setUploadingRef] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [pendingTitle, setPendingTitle] = useState('');
  const [pendingNote, setPendingNote] = useState('');

  useEffect(() => {
    if (user?.id) getMyDesignReferences(user.id).then(setMyRefs);
  }, [user?.id]);

  const onPickReference = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (uploadInputRef.current) uploadInputRef.current.value = '';
    if (!f) return;
    if (!user) {
      toast.error('Login dulu untuk mengunggah referensi');
      navigate('/login');
      return;
    }
    setPendingFile(f);
    setPendingPreview(URL.createObjectURL(f));
    setPendingTitle('');
    setPendingNote('');
  };

  const closePending = () => {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(null);
    setPendingPreview(null);
  };

  const refToImage = (r: UserDesignReference): DesignImage => ({
    id: `upload-${r.id}`,
    url: r.image_url,
    title: r.title,
    description: r.description || 'Referensi unggahan saya',
    link: '',
    source: 'wikimedia',
    isUpload: true,
  });

  const savePendingReference = async (thenSend: boolean) => {
    if (!pendingFile || !user) return;
    setUploadingRef(true);
    try {
      const saved = await uploadDesignReference(pendingFile, user.id, {
        title: pendingTitle || 'Referensi Saya',
        description: pendingNote,
      });
      setMyRefs((prev) => [saved, ...prev]);
      toast.success('Referensi tersimpan');
      closePending();
      if (thenSend) handleSelectDesign(refToImage(saved));
    } catch (err: any) {
      console.error('Upload reference error:', err);
      toast.error(err?.message || 'Gagal mengunggah referensi');
    } finally {
      setUploadingRef(false);
    }
  };

  const removeReference = async (r: UserDesignReference) => {
    try {
      await deleteDesignReference(r.id);
      setMyRefs((prev) => prev.filter((x) => x.id !== r.id));
      toast.success('Referensi dihapus');
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus referensi');
    }
  };

  useEffect(() => {
    fetchNearbyShops();
    fetchProducts();
  }, []);

  useEffect(() => {
    // Refetch shops when user location is available
    if (userLocation) {
      fetchNearbyShops();
    }
  }, [userLocation]);

  const fetchNearbyShops = async () => {
    try {
      setShopsLoading(true);
      // Fetch shops from Supabase API
      const shopsData = await getAllShops();

      console.log('Shops fetched:', shopsData.length);

      // Calculate distance if user location is available
      if (userLocation && shopsData.length > 0) {
        const shopsWithDistance = shopsData.map((shop: any) => ({
          id: shop.id,
          name: shop.name,
          address: shop.address,
          categories: Array.isArray(shop.categories) ? shop.categories : [],
          distance: shop.latitude && shop.longitude
            ? calculateDistance(userLocation.lat, userLocation.lng, shop.latitude, shop.longitude)
            : null
        })).sort((a: any, b: any) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
        setNearbyShops(shopsWithDistance);
      } else {
        // Format shops without distance
        const formattedShops = shopsData.map((shop: any) => ({
          id: shop.id,
          name: shop.name,
          address: shop.address,
          categories: Array.isArray(shop.categories) ? shop.categories : [],
          distance: undefined
        }));
        setNearbyShops(formattedShops);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
      setNearbyShops([]);
    } finally {
      setShopsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      // Hanya produk yang punya foto yang berguna sebagai referensi visual.
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  /** Ubah sebuah produk menjadi objek gambar referensi. */
  const productToImage = (p: any): DesignImage => ({
    id: `product-${p.id}`,
    url: p.image_url || FLOWER_PLACEHOLDER,
    title: p.name,
    description:
      p.category && p.price
        ? `${p.category} • Rp ${Number(p.price).toLocaleString('id-ID')}`
        : p.description || 'Produk toko',
    link: '',
    source: 'wikimedia',
    isProduct: true,
    price: p.price,
    productId: p.id,
    shopId: p.shop_id ?? p.shops?.id,
    shopName: p.shops?.name,
    category: p.category,
  });

  /**
   * Cocokkan produk dengan kata kunci pencarian (Bahasa Indonesia).
   * Query kosong -> tampilkan semua produk. Query terisi -> cocokkan pada
   * nama, deskripsi, dan kategori produk.
   */
  const matchProducts = (rawInput: string): DesignImage[] => {
    const words = rawInput
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 2);
    const matched = products.filter((p) => {
      if (words.length === 0) return true;
      const hay = `${p.name ?? ''} ${p.description ?? ''} ${p.category ?? ''}`.toLowerCase();
      return words.some((w) => hay.includes(w));
    });
    return matched.map(productToImage);
  };

  /**
   * Sisipkan foto produk (utama) di sela-sela gambar Wikimedia, tersebar merata.
   * Produk muncul lebih dulu lalu berulang di antara gambar inspirasi.
   */
  const interleave = (mainItems: DesignImage[], fillers: DesignImage[]): DesignImage[] => {
    if (mainItems.length === 0) return fillers;
    if (fillers.length === 0) return mainItems;
    const gap = Math.max(2, Math.ceil(fillers.length / (mainItems.length + 1)));
    const result: DesignImage[] = [];
    let pi = 0;
    fillers.forEach((img, idx) => {
      if (pi < mainItems.length && idx % gap === 0) {
        result.push(mainItems[pi++]);
      }
      result.push(img);
    });
    while (pi < mainItems.length) result.push(mainItems[pi++]);
    return result;
  };

  // Produk toko yang sesuai kata kunci & kategori aktif — ditampilkan di seksi
  // tersendiri ("Dari Toko di Bloemen"); grid inspirasi berisi Wikimedia saja.
  const storeResult = useMemo(
    () => searchProducts(products, committedQuery, activeCategoryId),
    [products, committedQuery, activeCategoryId],
  );
  const displayImages = inspirationImages;
  void matchProducts; void interleave;

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  // Load initial inspiration images on mount
  useEffect(() => {
    loadPopularDesigns();
  }, []);

  const loadPopularDesigns = async () => {
    setIsLoadingImages(true);
    setCurrentQuery('flower bouquet arrangement');
    setCommittedQuery('');
    setCurrentPage(1);
    setHasMore(true);
    try {
      const designs = await getPopularFlowers(30, 1);
      setInspirationImages(designs);
      setHasMore(designs.length >= 30);
    } catch (error) {
      console.error('Error loading designs:', error);
      toast.error('Gagal memuat inspirasi desain');
    } finally {
      setIsLoadingImages(false);
    }
  };

  const buildEffectiveQuery = (userInput: string, categoryId: string | null): string => {
    const cat = categoryId ? getShopCategoryById(categoryId) : null;
    const parts: string[] = [];
    if (userInput.trim()) parts.push(userInput.trim());
    if (cat) parts.push(cat.searchQuery);
    if (parts.length === 0) return 'flower bouquet arrangement';
    return parts.join(' ');
  };

  const runSearch = async (query: string) => {
    setIsLoadingImages(true);
    setCurrentQuery(query);
    setCurrentPage(1);
    setHasMore(true);
    try {
      const designs = await searchWikimedia(query, 30, 1);
      setInspirationImages(designs);
      setHasMore(designs.length >= 30);
      if (designs.length === 0) {
        toast.info('Tidak ada hasil. Coba kata kunci lain.');
      }
    } catch (err) {
      console.error('Search error:', err);
      toast.error('Gagal mencari desain. Coba lagi.');
    } finally {
      setIsLoadingImages(false);
    }
  };

  const loadMoreDesigns = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const more = currentQuery === 'flower bouquet arrangement' && !activeCategoryId && !searchQuery.trim()
        ? await getPopularFlowers(30, nextPage)
        : await searchWikimedia(currentQuery, 30, nextPage);
      if (more.length === 0) {
        setHasMore(false);
        toast.info('Sudah tidak ada gambar lagi');
      } else {
        // De-dupe by id
        setInspirationImages((prev) => {
          const existing = new Set(prev.map((p) => p.id));
          return [...prev, ...more.filter((m) => !existing.has(m.id))];
        });
        setCurrentPage(nextPage);
        if (more.length < 30) setHasMore(false);
      }
    } catch (err) {
      console.error('Load more error:', err);
      toast.error('Gagal memuat gambar tambahan');
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      const { getCurrentPosition } = await import('../lib/geolocation');
      const pos = await getCurrentPosition();
      setUserLocation({ lat: pos.latitude, lng: pos.longitude });
    } catch (error) {
      console.log('Geolocation not available:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      toast.error('Masukkan kata kunci pencarian');
      return;
    }

    setLoading(true);
    try {
      setCommittedQuery(searchQuery);
      await runSearch(buildEffectiveQuery(searchQuery, activeCategoryId));
    } finally {
      setLoading(false);
    }
  };


  /**
   * Kategori referensi yang dipilih: kategori produk toko, kategori aktif di
   * halaman, atau terdeteksi dari kata kunci/judul gambar.
   */
  const [refCategory, setRefCategory] = useState<string | null>(null);

  const resolveCategory = (d: DesignImage): string | null =>
    d.shopCategory ??
    (d.isProduct ? productCategoryToShopCategory(d.category) : null) ??
    activeCategoryId ??
    detectShopCategory(`${committedQuery} ${d.title} ${d.description}`);

  // Hanya toko yang menyediakan kategori referensi. Toko pemilik produk selalu ikut.
  const filteredShops = refCategory
    ? nearbyShops.filter(
        (s) =>
          (Array.isArray(s.categories) && s.categories.includes(refCategory)) ||
          (selectedDesign?.isProduct && selectedDesign.shopId === s.id),
      )
    : nearbyShops;

  const handleSelectDesign = (design: DesignImage) => {
    setSelectedDesign(design);
    setRefCategory(resolveCategory(design));
    setShowShopsDialog(true);
  };

  const handleSendToShop = (shop: Shop) => {
    if (!selectedDesign) return;

    if (nearbyShops.length === 0) {
      toast.error('Belum ada toko yang tersedia');
      return;
    }

    toast.success(`Membuka chat dengan ${shop.name}...`);
    setShowShopsDialog(false);

    // Navigate to chat with design reference
    setTimeout(() => {
      navigate(`/chat/${shop.id}`, {
        state: {
          designReference: {
            ...selectedDesign,
            description: [
              refCategory ? `Kategori: ${getShopCategoryById(refCategory)?.label}` : '',
              selectedDesign.description,
            ].filter(Boolean).join(' · '),
            postAsMessage: true,
          }
        }
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <motion.header
        className="px-4 py-4 border-b border-border bg-background sticky top-0 z-40"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button
          onClick={() => goBack()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
      </motion.header>

      {/* Content */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Title */}
          <div className="text-center mb-8 mt-4">
            <div className="text-5xl mb-4">🎨</div>
            <h1 className="text-2xl font-bold mb-2">Referensi Desain Bunga</h1>
            <p className="text-muted-foreground">Temukan inspirasi untuk rangkaian bunga Anda</p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari inspirasi: bunga mawar, pernikahan, ulang tahun..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="mt-3 w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mencari...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Cari Inspirasi
                </>
              )}
            </button>
          </form>

          {/* Referensi Saya — upload foto sendiri */}
          <div className="mb-6 rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <h3 className="font-bold flex items-center gap-2">
                  <ImagePlus className="w-5 h-5 text-primary" />
                  Referensi Saya
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Punya foto contoh sendiri? Unggah, simpan, lalu kirim ke toko.
                </p>
              </div>
              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5 flex-shrink-0"
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
              <input ref={uploadInputRef} type="file" accept="image/*" className="hidden" onChange={onPickReference} />
            </div>

            {myRefs.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto px-4 pb-4 snap-x">
                {myRefs.map((r) => (
                  <div key={r.id} className="relative w-28 flex-shrink-0 snap-start">
                    <button
                      type="button"
                      onClick={() => handleSelectDesign(refToImage(r))}
                      className="block w-full aspect-[3/4] rounded-xl overflow-hidden bg-secondary"
                    >
                      <ImageWithFallback src={r.image_url} alt={r.title} className="w-full h-full object-cover" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeReference(r)}
                      className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-black/55 text-white"
                      aria-label="Hapus referensi"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <p className="text-[11px] font-medium mt-1 truncate">{r.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => uploadInputRef.current?.click()}
                className="mx-4 mb-4 w-[calc(100%-2rem)] py-6 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground flex flex-col items-center gap-1"
              >
                <ImagePlus className="w-6 h-6" />
                Belum ada referensi · ketuk untuk unggah
                <span className="text-[11px]">JPG/PNG · maks. 5MB</span>
              </button>
            )}
          </div>

          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              💡 <strong>Cara Menggunakan:</strong> Pilih kategori, tap desain yang Anda suka, lalu pilih toko yang menyediakan kategori tersebut untuk mendapat penawaran harga sesuai referensi Anda!
            </p>
          </div>

          {/* Kategori referensi */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Kategori:</p>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              <button
                onClick={() => {
                  setActiveCategoryId(null);
                  if (searchQuery.trim()) runSearch(buildEffectiveQuery(searchQuery, null));
                  else loadPopularDesigns();
                }}
                className={`shrink-0 px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  !activeCategoryId ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary/50 border-border'
                }`}
              >
                Semua
              </button>
              {SHOP_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveCategoryId(c.id);
                    runSearch(buildEffectiveQuery(searchQuery, c.id));
                  }}
                  className={`shrink-0 px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    activeCategoryId === c.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary/50 border-border'
                  }`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Pencarian Populer:</p>
            <div className="flex flex-wrap gap-2">
              {getPopularSearches().slice(0, 6).map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    setCommittedQuery(term);
                    runSearch(buildEffectiveQuery(term, activeCategoryId));
                  }}
                  className="px-3 py-1.5 bg-secondary/50 hover:bg-secondary text-sm rounded-full transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Dari Toko di Bloemen — produk nyata yang sesuai pencarian */}
          <div className="mb-8">
            <div className="flex items-end justify-between gap-3 mb-1">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Store className="w-5 h-5" />
                Dari Toko di Bloemen
              </h2>
              <span className="text-xs text-muted-foreground shrink-0">{storeResult.items.length} produk</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {committedQuery || activeCategoryId
                ? storeResult.exact
                  ? `Produk toko yang sesuai dengan ${committedQuery ? `"${committedQuery}"` : ''}${committedQuery && activeCategoryId ? ' · ' : ''}${activeCategoryId ? getShopCategoryById(activeCategoryId)?.label ?? '' : ''}`
                  : `Belum ada yang persis cocok dengan "${committedQuery}" — menampilkan produk yang paling mendekati`
                : 'Bunga yang tersedia di toko — ketik kata kunci untuk mencari yang sesuai'}
            </p>
            {storeResult.items.length === 0 ? (
              <div className="py-8 text-center rounded-2xl bg-secondary/30">
                <p className="text-sm font-medium">Belum ada produk toko untuk {committedQuery ? `"${committedQuery}"` : 'kategori ini'}</p>
                <p className="text-xs text-muted-foreground mt-1">Pilih inspirasi di bawah lalu kirim ke toko untuk meminta penawaran harga.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {storeResult.items.slice(0, 6).map((p: any) => {
                    const disc = p.is_on_discount && p.discount_price;
                    return (
                      <div key={p.id} className="rounded-2xl border border-border overflow-hidden bg-background">
                        <button type="button" onClick={() => navigate(`/products/${p.id}`)} className="relative block w-full aspect-square bg-secondary">
                          <ImageWithFallback src={p.image_url || FLOWER_PLACEHOLDER} alt={p.name} className="w-full h-full object-cover" />
                          <span className={`absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-full text-white ${p.is_pre_order ? 'bg-purple-500/90' : 'bg-green-500/90'}`}>
                            {p.is_pre_order ? '📅 Pre-Order' : '✓ Ready'}
                          </span>
                          {disc && (
                            <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">-{p.discount_percentage}%</span>
                          )}
                        </button>
                        <div className="p-2.5">
                          <p className="text-[11px] text-muted-foreground truncate">{p.shops?.name || 'Toko'}</p>
                          <p className="text-sm font-medium leading-tight truncate">{p.name}</p>
                          <p className="text-sm font-semibold mt-0.5">Rp {Number(disc ? p.discount_price : p.price).toLocaleString('id-ID')}</p>
                          <button
                            type="button"
                            onClick={() => handleSelectDesign(productToImage(p))}
                            className="mt-2 w-full py-1.5 rounded-lg border border-primary/30 text-primary text-xs font-semibold flex items-center justify-center gap-1"
                          >
                            <Send className="w-3 h-3" /> Kirim ke Toko
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {storeResult.items.length > 6 && (
                  <button
                    type="button"
                    onClick={() => navigate(committedQuery ? `/products?q=${encodeURIComponent(committedQuery)}` : '/products')}
                    className="mt-3 w-full py-2.5 rounded-xl bg-secondary/60 text-sm font-medium"
                  >
                    Lihat semua {storeResult.items.length} produk toko
                  </button>
                )}
              </>
            )}
          </div>

          {/* Inspiration Grid */}
          <div>
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 flex-wrap">
              Inspirasi {searchQuery ? `"${searchQuery}"` : 'Populer'}
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Wikimedia Commons</span>
            </h2>

            {isLoadingImages ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Memuat inspirasi desain...</p>
              </div>
            ) : displayImages.length === 0 ? (
              <div className="text-center py-12 bg-secondary/30 rounded-2xl">
                <p className="text-muted-foreground mb-2">Tidak ada hasil ditemukan</p>
                <button
                  onClick={loadPopularDesigns}
                  className="text-primary hover:underline text-sm"
                >
                  Muat ulang inspirasi populer
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
              {displayImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(index, 8) * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectDesign(image)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                    image.isProduct ? 'ring-2 ring-primary/60' : ''
                  }`}
                >
                  <div className="aspect-[3/4] relative">
                    <ImageWithFallback
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {image.isProduct && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground rounded-full text-[10px] font-semibold flex items-center gap-1 shadow-lg">
                        <Store className="w-3 h-3" />
                        Produk Toko
                      </div>
                    )}

                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {image.link && (
                        <motion.a
                          href={image.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </motion.a>
                      )}
                      <motion.button
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success('Desain disimpan!');
                        }}
                      >
                        <Heart className="w-4 h-4" />
                      </motion.button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                      <h3 className="text-white font-semibold text-sm mb-1">{image.title}</h3>
                      <p className="text-white/80 text-xs mb-2">
                        {image.isProduct && image.shopName ? `🏪 ${image.shopName}` : image.description}
                      </p>
                      <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold flex items-center justify-center gap-1">
                        <Send className="w-3 h-3" />
                        Kirim ke Toko
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              </div>
            )}
          </div>

          {displayImages.length > 0 && (
            <div className="mt-4 flex flex-col items-center gap-2">
              {hasMore ? (
                <button
                  onClick={loadMoreDesigns}
                  disabled={loadingMore}
                  className="w-full max-w-xs py-3 rounded-xl bg-secondary/50 hover:bg-secondary text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Memuat...
                    </>
                  ) : (
                    <>Muat Lebih Banyak Gambar</>
                  )}
                </button>
              ) : (
                <p className="text-xs text-muted-foreground">Tidak ada gambar lagi untuk pencarian ini</p>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategoryId(null);
                  loadPopularDesigns();
                }}
                className="text-xs text-primary hover:underline"
              >
                Reset ke inspirasi populer
              </button>
            </div>
          )}

          {/* Action Button */}
          <motion.button
            onClick={() => navigate('/shops')}
            className="mt-8 w-full py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl font-semibold text-lg shadow-lg"
            whileTap={{ scale: 0.98 }}
          >
            Lihat Semua Toko Bunga
          </motion.button>
        </motion.div>
      </div>

      {/* Dialog konfirmasi upload referensi */}
      <Dialog open={!!pendingFile} onOpenChange={(o) => !o && !uploadingRef && closePending()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Simpan Referensi</DialogTitle>
            <DialogDescription>Foto akan disimpan di akun Anda dan bisa dikirim ke toko mana pun.</DialogDescription>
          </DialogHeader>
          {pendingPreview && (
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-secondary">
                <img src={pendingPreview} alt="Pratinjau" className="w-full h-full object-cover" />
              </div>
              <input
                type="text"
                value={pendingTitle}
                onChange={(e) => setPendingTitle(e.target.value)}
                placeholder="Judul, mis. Buket mawar pink wisuda"
                className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <textarea
                value={pendingNote}
                onChange={(e) => setPendingNote(e.target.value)}
                placeholder="Catatan untuk toko (warna, ukuran, budget)…"
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" disabled={uploadingRef} onClick={() => savePendingReference(false)}>
                  Simpan saja
                </Button>
                <Button disabled={uploadingRef} onClick={() => savePendingReference(true)}>
                  {uploadingRef ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                  Simpan &amp; Kirim
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Shop Selection Dialog */}
      <Dialog open={showShopsDialog} onOpenChange={setShowShopsDialog}>
        <DialogContent className="max-w-md max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Kirim Referensi Desain</DialogTitle>
            <DialogDescription>
              Pilih toko bunga tujuan untuk mengirim referensi desain Anda
            </DialogDescription>
          </DialogHeader>

          {selectedDesign && (
            <div className="space-y-4 flex-1 min-h-0 overflow-y-auto overscroll-contain -mx-1 px-1 pb-2" style={{ WebkitOverflowScrolling: "touch" }}>
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={selectedDesign.url}
                  alt={selectedDesign.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="font-bold mb-1">{selectedDesign.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedDesign.description}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-semibold mb-2">Kategori Referensi:</p>
                <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 -mx-1 px-1">
                  {SHOP_CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setRefCategory(c.id)}
                      className={`shrink-0 px-2.5 py-1 text-xs rounded-full border ${
                        refCategory === c.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary/50 border-border'
                      }`}
                    >
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
                {!refCategory && (
                  <p className="text-xs text-amber-700 bg-amber-500/10 rounded-lg px-3 py-2 mb-3">
                    Kategori belum terdeteksi — pilih kategori di atas agar hanya toko yang sesuai yang tampil.
                  </p>
                )}
                <p className="text-sm font-semibold mb-3">
                  Pilih Toko Tujuan{refCategory ? ` · ${filteredShops.length} toko ${getShopCategoryById(refCategory)?.label}` : ''}:
                </p>
                {nearbyShops.length === 0 ? (
                  <div className="text-center py-8 bg-secondary/30 rounded-xl">
                    <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-sm font-semibold mb-1">Belum Ada Toko</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Toko bunga belum ada yang mendaftar
                    </p>
                    <button
                      onClick={() => {
                        setShowShopsDialog(false);
                        navigate('/shops');
                      }}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
                    >
                      Jelajahi Toko
                    </button>
                  </div>
                ) : filteredShops.length === 0 ? (
                  <div className="text-center py-8 bg-secondary/30 rounded-xl">
                    <p className="text-sm text-muted-foreground">
                      Belum ada toko yang menyediakan kategori {refCategory ? getShopCategoryById(refCategory)?.label : 'ini'}.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Coba pilih kategori lain di atas.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredShops.map((shop) => (
                      <button
                        key={shop.id}
                        onClick={() => handleSendToShop(shop)}
                        className="w-full flex items-center justify-between p-4 bg-secondary/50 hover:bg-secondary/70 rounded-xl transition-colors"
                      >
                        <div className="text-left flex-1">
                          <p className="font-semibold text-sm">{shop.name}</p>
                          <p className="text-xs text-muted-foreground">{shop.address}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {shop.distance && (
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Jarak</p>
                              <p className="text-sm font-bold text-primary">{shop.distance} km</p>
                            </div>
                          )}
                          <Send className="w-5 h-5 text-primary" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}