import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, ShoppingBag, Heart, User, Home as HomeIcon, Grid3x3, Bell, MapPin, Palette, Store, MessageCircle } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { FLOWER_PLACEHOLDER } from "../lib/placeholder";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router";
import { getMyOrders, getRecommendedProducts as getRecommendedProductsAPI } from "../lib/api";
import { getRecommendedProducts as getLocalRecommendedProducts } from "../lib/localStorage";
import { getAllProducts } from "../lib/api";
import { NotificationBell } from "../components/NotificationBell";
import { PRODUCT_CATEGORIES } from "../lib/productCategories";
import { isNetworkError } from "../lib/networkError";
import Logo from "../components/Logo";

export default function Home() {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [orderCount, setOrderCount] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [networkDown, setNetworkDown] = useState(false);
  const [homeSearch, setHomeSearch] = useState('');

  useEffect(() => {
    fetchRecommendedProducts();
  }, []);

  const fetchRecommendedProducts = async () => {
    try {
      setLoadingProducts(true);
      const products = await getAllProducts();

      console.log('📦 Fetched products:', products.length);
      if (products.length > 0) {
        console.log('📦 Sample product:', products[0]);
      }

      // Get random 6 products
      const shuffled = products
        .filter((p: any) => p.is_available)
        .sort(() => 0.5 - Math.random())
        .slice(0, 6);

      console.log('✅ Recommended products:', shuffled.length);
      setRecommendedProducts(shuffled);
    } catch (error: any) {
      if (isNetworkError(error)) {
        console.warn('Network unreachable — showing empty state');
        setNetworkDown(true);
      } else {
        console.error('Error fetching products:', error?.message || error);
        if (error?.code === 'PGRST205') {
          console.error('⚠️ DATABASE NOT SETUP — run SQL migration in Supabase Dashboard');
        }
      }
      setRecommendedProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const categories = PRODUCT_CATEGORIES.map((c) => ({
    id: c.id,
    name: c.label,
    icon: c.emoji,
  }));

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <motion.div
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Logo size={40} />
              </motion.div>
              <div>
                <h1 className="font-semibold text-sm">Bloemen</h1>
                <p className="text-xs text-muted-foreground">
                  {user ? `Halo, ${user.name}` : 'Marketplace Bunga'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user && user.userType !== 'seller' && (
                <motion.button
                  onClick={() => navigate('/my-orders')}
                  className="relative p-2 rounded-full hover:bg-secondary/50 transition-colors"
                  whileTap={{ scale: 0.9 }}
                  aria-label="Pesanan Saya"
                >
                  <ShoppingBag className="w-5 h-5 text-foreground" />
                  {orderCount > 0 && (
                    <span className="absolute top-0 right-0 bg-destructive text-white text-xs min-w-[16px] h-4 rounded-full flex items-center justify-center font-semibold px-1">
                      {orderCount > 99 ? '99+' : orderCount}
                    </span>
                  )}
                </motion.button>
              )}
              <NotificationBell />
            </div>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = homeSearch.trim();
                navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
              }}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="search"
                enterKeyHint="search"
                value={homeSearch}
                onChange={(e) => setHomeSearch(e.target.value)}
                placeholder="Cari bunga favorit..."
                className="w-full pl-12 pr-20 py-3 rounded-2xl bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 [&::-webkit-search-cancel-button]:hidden"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
              >
                Cari
              </button>
            </form>
          </motion.div>
        </div>
      </motion.header>

      {networkDown && (
        <div className="mt-[140px] mx-4 mb-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-800 dark:text-yellow-300">
          ⚠️ Tidak dapat terhubung ke server. Periksa koneksi internet Anda — beberapa data mungkin tidak tampil.
        </div>
      )}

      {/* Hero Banner - Mobile Optimized */}
      <section className={`relative ${networkDown ? 'mt-2' : 'mt-[140px]'} mx-4 rounded-3xl overflow-hidden h-[280px]`}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <ImageWithFallback
            src={FLOWER_PLACEHOLDER}
            alt="Beautiful flower bouquet"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </motion.div>

        <div className="relative h-full flex flex-col justify-end p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
              Bunga Segar<br />Setiap Hari
            </h2>
            <p className="text-white/90 text-sm mb-4">
              Kreasi bunga terbaik sesuai kebutuhan Anda
            </p>
            <motion.button
              onClick={() => navigate('/shops')}
              className="px-6 py-2.5 bg-white text-foreground rounded-full font-medium text-sm"
              whileTap={{ scale: 0.95 }}
            >
              Belanja Sekarang
            </motion.button>
          </motion.div>
        </div>
      </section>

      {user?.userType === 'seller' && (
        <section className="px-4 py-6">
          <motion.button
            onClick={() => navigate('/seller')}
            className="w-full flex items-center gap-3 p-5 bg-primary rounded-2xl shadow-lg"
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
              <Store className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="text-left flex-1">
              <p className="font-bold text-primary-foreground text-base">Dashboard Penjual</p>
              <p className="text-xs text-primary-foreground/80">Kelola toko dan produk Anda</p>
            </div>
          </motion.button>
        </section>
      )}

      {/* Categories */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Kategori</h2>
          <button
            onClick={() => navigate('/products')}
            className="text-sm text-primary"
          >
            Lihat Semua
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {categories.slice(0, 4).map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => navigate(`/products?category=${encodeURIComponent(category.id)}`)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-secondary/40 active:bg-secondary/60 transition-colors text-center"
            >
              <div className="text-3xl">{category.icon}</div>
              <span className="text-xs font-medium leading-tight">{category.name}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Recommended Products */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-lg">Rekomendasi Produk</h2>
            <p className="text-xs text-muted-foreground">Produk bunga pilihan untuk Anda</p>
          </div>
          {recommendedProducts.length > 0 && (
            <button
              onClick={() => navigate('/products')}
              className="text-sm text-primary font-medium"
            >
              Lihat Semua
            </button>
          )}
        </div>

        {loadingProducts ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat produk...</p>
          </div>
        ) : recommendedProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-3xl border border-border"
          >
            <div className="text-6xl mb-4">🌸</div>
            <h3 className="text-xl font-bold mb-2">Belum Ada Produk</h3>
            <p className="text-muted-foreground mb-6 px-4">
              Segera hadir! Toko bunga akan menambahkan produk pilihan mereka
            </p>
            <motion.button
              onClick={() => navigate('/shops')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
              whileTap={{ scale: 0.95 }}
            >
              Jelajahi Toko Bunga
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {recommendedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/products/${product.id}`)}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl mb-2 aspect-[3/4] bg-secondary/20">
                  <ImageWithFallback
                    src={product.image_url || FLOWER_PLACEHOLDER}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Badge Pre-Order atau Ready Stock */}
                  <div className="absolute top-2 left-2 px-2.5 py-1 backdrop-blur-sm rounded-full">
                    <span className={`text-xs font-medium ${
                      product.is_pre_order
                        ? 'bg-purple-500/90 text-white'
                        : 'bg-green-500/90 text-white'
                    }`}>
                      {product.is_pre_order ? '📅 Pre-Order' : '✓ Ready'}
                    </span>
                  </div>

                  <motion.div
                    className="absolute bottom-2 left-2 right-2"
                  >
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${product.id}`);
                      }}
                      className="w-full bg-white/95 backdrop-blur-sm text-foreground py-2.5 rounded-xl font-medium text-sm shadow-lg"
                      whileTap={{ scale: 0.95 }}
                    >
                      Lihat Produk
                    </motion.button>
                  </motion.div>
                </div>

                <div className="space-y-0.5 px-1">
                  <p className="text-xs text-muted-foreground">{product.category || 'Bunga'}</p>
                  <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                  {product.is_on_discount && product.discount_price ? (
                    <div>
                      <span className="inline-block bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold mr-1">
                        Diskon -{product.discount_percentage}%
                      </span>
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="text-muted-foreground line-through text-xs">
                          Rp {product.price?.toLocaleString('id-ID')}
                        </span>
                        <span className="font-semibold text-red-600 dark:text-red-400">
                          Rp {product.discount_price.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="font-semibold text-primary">Rp {product.price?.toLocaleString('id-ID')}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Navigation */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center justify-around px-2 py-3">
          <motion.button
            className="flex flex-col items-center gap-1 text-primary"
            whileTap={{ scale: 0.9 }}
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-xs font-medium">Beranda</span>
          </motion.button>

          <motion.button
            onClick={() => navigate('/shops')}
            className="flex flex-col items-center gap-1 text-muted-foreground"
            whileTap={{ scale: 0.9 }}
          >
            <Grid3x3 className="w-5 h-5" />
            <span className="text-xs">Toko</span>
          </motion.button>

          <motion.button
            onClick={() => navigate('/design-reference')}
            className="flex flex-col items-center gap-1 text-muted-foreground"
            whileTap={{ scale: 0.9 }}
          >
            <Palette className="w-5 h-5" />
            <span className="text-xs">Referensi</span>
          </motion.button>

          <motion.button
            onClick={() => user ? navigate('/messages') : navigate('/login')}
            className="flex flex-col items-center gap-1 text-muted-foreground relative"
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">Chat</span>
          </motion.button>

          <motion.button
            onClick={() => user ? navigate('/profile') : navigate('/login')}
            className="flex flex-col items-center gap-1 text-muted-foreground"
            whileTap={{ scale: 0.9 }}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Profil</span>
          </motion.button>
        </div>
      </motion.nav>
    </div>
  );
}