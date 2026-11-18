import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router';
import { ArrowLeft, Package, X, Search } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { FLOWER_PLACEHOLDER } from '../lib/placeholder';
import { getAllProducts } from '../lib/api';
import { isNetworkError } from '../lib/networkError';
import { PRODUCT_CATEGORIES, getProductCategoryById } from '../lib/productCategories';
import { searchProducts } from '../lib/productSearch';
import { useGoBack } from '../lib/navigation';

export default function ProductList() {
  const navigate = useNavigate();
  const goBack = useGoBack('/');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  const queryParam = searchParams.get('q') || '';
  const [searchText, setSearchText] = useState(queryParam);

  // Sinkronkan input bila URL berubah (mis. dari pencarian di Beranda)
  useEffect(() => setSearchText(queryParam), [queryParam]);

  // Live search: perbarui URL (replace → tidak menumpuk riwayat) 300 ms setelah berhenti mengetik
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchText.trim() === queryParam.trim()) return;
      updateParams({ q: searchText.trim() || null });
    }, 300);
    return () => clearTimeout(t);
  }, [searchText]);

  const updateParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setSearchParams(next, { replace: true });
  };
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [networkDown, setNetworkDown] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts((data || []).filter((p: any) => p.is_available));
      } catch (error: any) {
        if (isNetworkError(error)) setNetworkDown(true);
        else console.error('Error fetching products:', error?.message || error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setCategoryFilter = (id: string | null) => {
    updateParams({ category: id });
  };

  const filtered = useMemo(() => {
    let list = activeCategory
      ? products.filter((p) => (p.category || '').toLowerCase() === activeCategory.toLowerCase())
      : products;
    // Pencarian bersinonim (mis. "pernikahan" juga cocok dengan kategori Wedding)
    return searchProducts(list, queryParam).items;
  }, [products, activeCategory, queryParam]);

  const activeLabel = activeCategory
    ? getProductCategoryById(activeCategory)?.label ?? activeCategory
    : null;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-40 px-4 py-4 border-b border-border bg-background"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => goBack()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-1">
          {queryParam ? `Hasil "${queryParam}"` : activeLabel ? `Produk: ${activeLabel}` : 'Semua Produk'}
        </h1>
        <p className="text-sm text-muted-foreground mb-3">
          {loading ? 'Memuat produk...' : `${filtered.length} produk ditemukan${queryParam && activeLabel ? ` di ${activeLabel}` : ''}`}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateParams({ q: searchText.trim() || null });
            (document.activeElement as HTMLElement | null)?.blur();
          }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="search"
            enterKeyHint="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Cari mawar, buket wisuda, nama toko…"
            className="w-full pl-12 pr-10 py-3 rounded-2xl bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 [&::-webkit-search-cancel-button]:hidden"
          />
          {searchText && (
            <button
              type="button"
              onClick={() => {
                setSearchText('');
                updateParams({ q: null });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:bg-secondary"
              aria-label="Hapus pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </motion.header>

      {/* Category chips */}
      <div className="px-4 pt-3">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          <button
            onClick={() => setCategoryFilter(null)}
            className={`shrink-0 px-3 py-1.5 text-xs rounded-full border transition-colors ${
              !activeCategory
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-secondary/50 text-muted-foreground border-border'
            }`}
          >
            Semua
          </button>
          {PRODUCT_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`shrink-0 px-3 py-1.5 text-xs rounded-full border transition-colors ${
                activeCategory === c.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary/50 text-muted-foreground border-border'
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
        {activeCategory && (
          <button
            onClick={() => setCategoryFilter(null)}
            className="inline-flex items-center gap-1 mt-1 px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/30"
          >
            <span>Filter: {activeLabel}</span>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {networkDown ? (
          <p className="text-center text-muted-foreground py-20">
            Koneksi bermasalah. Coba lagi nanti.
          </p>
        ) : loading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-2xl bg-secondary/60 mb-2" />
                <div className="h-3 w-2/3 bg-secondary/60 rounded mb-1" />
                <div className="h-3 w-1/3 bg-secondary/60 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Package className="w-20 h-20 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Tidak Ada Produk</h3>
            <p className="text-muted-foreground mb-6">
              {queryParam
                ? `Tidak ada produk yang cocok dengan "${queryParam}". Coba kata kunci lain.`
                : activeLabel
                ? `Belum ada produk pada kategori "${activeLabel}". Coba kategori lain.`
                : 'Belum ada produk tersedia saat ini.'}
            </p>
            {(activeCategory || queryParam) && (
              <button
                onClick={() => {
                  setSearchText('');
                  updateParams({ q: null, category: null });
                }}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
              >
                Lihat Semua Produk
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filtered.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                onClick={() => navigate(`/products/${product.id}`)}
                className="cursor-pointer"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary mb-2">
                  <ImageWithFallback
                    src={product.image_url || FLOWER_PLACEHOLDER}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full">
                    <span
                      className={`text-xs font-medium ${
                        product.is_pre_order
                          ? 'bg-purple-500/90 text-white'
                          : 'bg-green-500/90 text-white'
                      } px-2 py-0.5 rounded-full`}
                    >
                      {product.is_pre_order ? '📅 Pre-Order' : '✓ Ready'}
                    </span>
                  </div>
                </div>
                <div className="space-y-0.5 px-1">
                  <p className="text-xs text-muted-foreground">{product.category || 'Bunga'}</p>
                  <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                  {product.is_on_discount && product.discount_price ? (
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-muted-foreground line-through text-xs">
                        Rp {product.price?.toLocaleString('id-ID')}
                      </span>
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        Rp {product.discount_price.toLocaleString('id-ID')}
                      </span>
                    </div>
                  ) : (
                    <p className="font-semibold text-primary">
                      Rp {product.price?.toLocaleString('id-ID')}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
