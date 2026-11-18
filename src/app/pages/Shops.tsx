import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, MapPin, Phone, Store, Clock, Star, ImagePlus } from 'lucide-react';
import { SendReferenceToShop } from '../components/SendReferenceToShop';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getAllShops } from '../lib/api';
import { getShops as getLocalShops } from '../lib/localStorage';
import { getShopCategoryLabels, getShopCategoryById } from '../lib/shopCategories';
import { X, Navigation, Search } from 'lucide-react';
import { getCurrentPosition, haversineKm, formatDistance } from '../lib/geolocation';
import { getOpenStatus } from '../lib/openingHours';
import { useGoBack } from '../lib/navigation';

interface Shop {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  imageUrl?: string;
  openingHours?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  distance?: number | null;
}

export default function Shops() {
  const navigate = useNavigate();
  const goBack = useGoBack('/');
  const { user } = useAuth();
  const [refTarget, setRefTarget] = useState<{ id: string; name: string } | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'ok' | 'denied'>('loading');

  // Hitung jarak tiap toko dari posisi pembeli lalu urutkan terdekat dulu.
  // Toko tanpa koordinat ditaruh paling bawah.
  const shopsWithDistance = shops
    .map((s) => {
      const lat = s.latitude != null ? Number(s.latitude) : NaN;
      const lng = s.longitude != null ? Number(s.longitude) : NaN;
      const distance =
        userLocation && Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0)
          ? haversineKm(userLocation.lat, userLocation.lng, lat, lng)
          : null;
      return { ...s, distance };
    })
    .sort((a, b) => {
      if (a.distance == null && b.distance == null) return 0;
      if (a.distance == null) return 1;
      if (b.distance == null) return -1;
      return a.distance - b.distance;
    });

  const [shopQuery, setShopQuery] = useState('');
  const shopWords = shopQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);

  const filteredShops = shopsWithDistance
    .filter((s) => !activeCategory || (Array.isArray((s as any).categories) && (s as any).categories.includes(activeCategory)))
    .filter((s) => {
      if (shopWords.length === 0) return true;
      const cats = getShopCategoryLabels(((s as any).categories || []) as string[]).join(' ');
      const hay = `${s.name} ${s.address} ${s.city} ${s.description} ${cats}`.toLowerCase();
      return shopWords.every((w) => hay.includes(w));
    });

  const setCategoryFilter = (id: string | null) => {
    if (id) {
      setSearchParams({ category: id }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  useEffect(() => {
    fetchShops();
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    try {
      setLocationStatus('loading');
      const pos = await getCurrentPosition();
      setUserLocation({ lat: pos.latitude, lng: pos.longitude });
      setLocationStatus('ok');
      console.log('[BLOEMEN] Lokasi pembeli:', pos.latitude, pos.longitude);
    } catch (err) {
      console.log('[BLOEMEN] Gagal ambil lokasi:', err);
      setLocationStatus('denied');
      toast.error('Aktifkan izin lokasi agar toko terdekat tampil paling atas');
    }
  };

  const fetchShops = async () => {
    try {
      // Try Supabase API first
      const shopsData = await getAllShops();

      // Convert snake_case to camelCase for frontend
      const formattedShops = shopsData.map((shop: any) => ({
        id: shop.id,
        name: shop.name,
        description: shop.description || '',
        address: shop.address || '',
        city: shop.city || '',
        phone: shop.phone || '',
        imageUrl: shop.image_url,
        openingHours: shop.opening_hours,
        latitude: shop.latitude,
        longitude: shop.longitude,
        categories: Array.isArray(shop.categories) ? shop.categories : [],
        rating: 4.8 // Default rating
      }));

      setShops(formattedShops);
      setLoading(false);
    } catch (error) {
      console.log('API error, using localStorage:', error);

      // Fallback to localStorage
      const localShops = getLocalShops();
      setShops(localShops);
      setLoading(false);
    }
  };

  const handleShopClick = (shopId: string) => {
    navigate(`/shops/${shopId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat toko...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-40 px-4 py-4 border-b border-border bg-background/95 backdrop-blur-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => goBack()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold mb-1">Toko Bunga</h1>
          <p className="text-sm text-muted-foreground">
            {shopQuery.trim()
              ? `${filteredShops.length} toko cocok dengan "${shopQuery.trim()}"`
              : activeCategory
              ? `${filteredShops.length} toko untuk kategori "${getShopCategoryById(activeCategory)?.label ?? activeCategory}"`
              : `Ditemukan ${shops.length} toko di sekitar Anda`}
          </p>
          <div className="mt-2 text-xs">
            {locationStatus === 'loading' && (
              <span className="text-muted-foreground">Mendeteksi lokasi Anda…</span>
            )}
            {locationStatus === 'ok' && (
              <span className="inline-flex items-center gap-1 text-primary">
                <Navigation className="w-3 h-3" /> Diurutkan dari yang terdekat
              </span>
            )}
            {locationStatus === 'denied' && (
              <button onClick={fetchLocation} className="text-primary underline">
                Lokasi tidak aktif — ketuk untuk coba lagi
              </button>
            )}
          </div>
        </div>

        <div className="relative mt-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="search"
            enterKeyHint="search"
            value={shopQuery}
            onChange={(e) => setShopQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.currentTarget as HTMLInputElement).blur()}
            placeholder="Cari nama toko, alamat, kota…"
            className="w-full pl-12 pr-10 py-3 rounded-2xl bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 [&::-webkit-search-cancel-button]:hidden"
          />
          {shopQuery && (
            <button
              type="button"
              onClick={() => setShopQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:bg-secondary"
              aria-label="Hapus pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.header>

      {activeCategory && (
        <div className="px-4 pt-3">
          <button
            onClick={() => setCategoryFilter(null)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/30"
          >
            <span>{getShopCategoryById(activeCategory)?.emoji}</span>
            <span>Filter: {getShopCategoryById(activeCategory)?.label}</span>
            <X className="w-3 h-3 ml-1" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {filteredShops.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Store className="w-20 h-20 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">
              {shopQuery.trim() || activeCategory ? 'Tidak Ada Toko' : 'Belum Ada Toko'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {shopQuery.trim()
                ? `Tidak ada toko yang cocok dengan "${shopQuery.trim()}".`
                : activeCategory
                ? 'Belum ada toko yang menyediakan kategori ini. Coba pilih kategori lain.'
                : 'Toko bunga belum ada yang mendaftar. Tunggu penjual mendaftar atau jadilah penjual pertama!'}
            </p>
            {shopQuery.trim() || activeCategory ? (
              <button
                onClick={() => {
                  setShopQuery('');
                  setCategoryFilter(null);
                }}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
              >
                Lihat Semua Toko
              </button>
            ) : (
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
              >
                Daftar Sebagai Penjual
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredShops.map((shop, index) => (
              <motion.div
                key={shop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => handleShopClick(shop.id)}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                {shop.imageUrl && (
                  <div className="relative h-48 bg-secondary">
                    <ImageWithFallback
                      src={shop.imageUrl}
                      alt={shop.name}
                      className="w-full h-full object-cover"
                    />
                    {shop.rating && (
                      <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full flex items-center gap-1 shadow-lg">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-sm">{shop.rating}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-5">
                  {(() => {
                    const st = getOpenStatus(shop.openingHours);
                    if (!st.known) return null;
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          st.open ? 'bg-green-500/15 text-green-700 dark:text-green-400' : 'bg-red-500/15 text-red-700 dark:text-red-400'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${st.open ? 'bg-green-600' : 'bg-red-600'}`} />
                        {st.label}
                      </span>
                    );
                  })()}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                      <Store className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-lg">{shop.name}</h3>
                        {shop.distance != null && (
                          <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                            <Navigation className="w-3 h-3" />
                            {formatDistance(shop.distance)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {shop.description}
                      </p>
                      {Array.isArray((shop as any).categories) && (shop as any).categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {getShopCategoryLabels((shop as any).categories).map((label) => (
                            <span
                              key={label}
                              className="px-2 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-border">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{shop.address}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{shop.phone}</span>
                    </div>

                    {shop.openingHours && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{shop.openingHours}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShopClick(shop.id);
                      }}
                      className="py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
                      whileTap={{ scale: 0.98 }}
                    >
                      Lihat Detail
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!user) {
                          toast.error('Silakan login terlebih dahulu');
                          navigate('/login');
                          return;
                        }
                        setRefTarget({ id: shop.id, name: shop.name });
                      }}
                      className="px-4 py-3 border-2 border-primary/40 text-primary rounded-xl font-semibold flex items-center gap-1.5 text-sm"
                      whileTap={{ scale: 0.98 }}
                      aria-label={`Kirim referensi ke ${shop.name}`}
                    >
                      <ImagePlus className="w-4 h-4" />
                      Referensi
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      {refTarget && (
        <SendReferenceToShop
          shopId={refTarget.id}
          shopName={refTarget.name}
          open={!!refTarget}
          onOpenChange={(o) => !o && setRefTarget(null)}
        />
      )}
    </div>
  );
}
