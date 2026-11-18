import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Star, Package, ShoppingCart, Store, MessageCircle, Sprout, Calendar, Clock, Leaf } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { FLOWER_PLACEHOLDER } from '../lib/placeholder';
import { getProductById } from '../lib/api';
import { ReviewDisplay } from '../components/ReviewDisplay';
import { FreshFlowerGuide } from '../components/FreshFlowerGuide';
import { supabase } from '../lib/supabase';
import { isNetworkError, describeError } from '../lib/networkError';
import { useGoBack } from '../lib/navigation';

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  is_pre_order: boolean;
  is_available: boolean;
  category: string;
  is_on_discount?: boolean;
  discount_percentage?: number;
  discount_price?: number;
  sizes?: Record<string, number> | null;
  flower_type?: 'live' | 'artificial' | 'mixed' | null;
  po_duration_days?: number | null;
  flower_lifetime_days?: number | null;
  care_instructions?: string | null;
  shop_id: string;
  shops?: { id: string; name: string; address: string; phone: string; image_url: string };
}

const FLOWER_TYPE_LABELS: Record<string, { emoji: string; label: string }> = {
  live: { emoji: '🌺', label: 'Bunga Hidup' },
  artificial: { emoji: '🌼', label: 'Bunga Artificial' },
  mixed: { emoji: '🌻', label: 'Campuran' },
};

const SIZE_ORDER = ['S', 'M', 'L', 'XL'];

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const goBack = useGoBack('/products');
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    if (!productId) return;
    (async () => {
      try {
        const data = await getProductById(productId);
        setProduct(data as ProductData);
        // auto-pick first size if any
        if (data?.sizes) {
          const first = SIZE_ORDER.find((s) => (data.sizes as any)[s] != null);
          if (first) setSelectedSize(first);
        }
        const { data: reviews } = await supabase
          .from('reviews')
          .select('rating')
          .eq('product_id', productId);
        const r = reviews || [];
        setTotalReviews(r.length);
        setAvgRating(r.length ? Math.round((r.reduce((s, x) => s + x.rating, 0) / r.length) * 10) / 10 : 0);
      } catch (e) {
        if (isNetworkError(e)) {
          console.warn('Network unreachable when fetching product');
        } else {
          console.error('Error fetching product:', (e as any)?.message || e);
        }
        setErrorMsg(describeError(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-4xl animate-bounce mb-3">🌺</div>
          <p className="text-muted-foreground">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-3">{errorMsg ? '🔌' : '🌸'}</div>
          <h2 className="text-xl font-bold mb-2">
            {errorMsg ? 'Gagal Memuat Produk' : 'Produk tidak ditemukan'}
          </h2>
          {errorMsg && <p className="text-sm text-muted-foreground mb-4">{errorMsg}</p>}
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => goBack()}
              className="px-4 py-2 rounded-lg border border-border text-sm"
            >
              Kembali
            </button>
            {errorMsg && (
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
              >
                Coba Lagi
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const sizes = product.sizes || null;
  const availableSizes = sizes ? SIZE_ORDER.filter((s) => sizes[s] != null) : [];
  const basePrice =
    selectedSize && sizes && sizes[selectedSize] != null ? sizes[selectedSize] : product.price;
  const onDiscount = !!(product.is_on_discount && product.discount_percentage);
  const finalPrice = onDiscount
    ? Math.round(basePrice * (1 - product.discount_percentage! / 100))
    : basePrice;

  const handleBuy = () => {
    if (availableSizes.length > 0 && !selectedSize) {
      return;
    }
    navigate(`/preorder/${product.shop_id}`, {
      state: {
        selectedProduct: {
          id: product.id,
          name: selectedSize ? `${product.name} (Ukuran ${selectedSize})` : product.name,
          description: product.description,
          price: finalPrice,
          originalPrice: basePrice,
          isOnDiscount: product.is_on_discount,
          discountPercentage: product.discount_percentage,
          size: selectedSize,
          imageUrl: product.image_url,
          isPreOrder: product.is_pre_order,
          stock: product.stock,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="relative">
        <div className="aspect-square relative bg-secondary">
          <ImageWithFallback
            src={product.image_url || FLOWER_PLACEHOLDER}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <button
          onClick={() => goBack()}
          className="absolute top-4 left-4 p-2 bg-background/80 backdrop-blur-sm rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute top-4 right-4 px-3 py-1.5 backdrop-blur-sm rounded-full text-xs font-semibold">
          {product.is_pre_order ? (
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full">📅 Pre-Order</span>
          ) : (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full">✓ Ready Stock</span>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-5"
      >
        <p className="text-xs text-muted-foreground mb-1">{product.category || 'Bunga'}</p>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

        <div className="flex items-center gap-3 mb-4">
          {totalReviews > 0 ? (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-sm">{avgRating}</span>
              <span className="text-xs text-muted-foreground">({totalReviews} ulasan)</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Belum ada ulasan</span>
          )}
          {!product.is_pre_order && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Package className="w-3.5 h-3.5" />
              Stok: {product.stock}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mb-5 p-4 bg-secondary/30 rounded-2xl">
          {availableSizes.length > 0 && !selectedSize && (
            <p className="text-xs text-muted-foreground mb-1">Mulai dari</p>
          )}
          {availableSizes.length > 0 && selectedSize && (
            <p className="text-xs text-muted-foreground mb-1">Ukuran {selectedSize}</p>
          )}
          {onDiscount ? (
            <div>
              <div className="inline-flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold mb-1">
                🏷️ Diskon -{product.discount_percentage}%
              </div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-muted-foreground line-through text-sm">
                  Rp {basePrice.toLocaleString('id-ID')}
                </span>
                <span className="text-red-600 dark:text-red-400 font-bold text-2xl">
                  Rp {finalPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-primary font-bold text-2xl">
              Rp {basePrice.toLocaleString('id-ID')}
            </p>
          )}
        </div>

        {/* Size Picker */}
        {availableSizes.length > 0 && (
          <div className="mb-5">
            <p className="font-semibold text-sm mb-2">Pilih Ukuran</p>
            <div className="flex gap-2 flex-wrap">
              {availableSizes.map((s) => {
                const active = selectedSize === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[64px] px-4 py-2.5 rounded-xl border-2 transition-colors ${
                      active
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background'
                    }`}
                  >
                    <div className="font-bold">{s}</div>
                    <div className="text-[10px] opacity-80">
                      Rp {sizes![s].toLocaleString('id-ID')}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Setiap ukuran memiliki harga berbeda yang ditentukan oleh penjual.
            </p>
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <p className="font-semibold text-sm mb-2">Deskripsi Produk</p>
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {product.description || 'Tidak ada deskripsi.'}
          </p>
        </div>

        {/* Detail Bunga */}
        {(product.flower_type || product.po_duration_days || product.flower_lifetime_days || product.care_instructions) && (
          <div className="mb-6 p-4 bg-secondary/30 rounded-2xl space-y-3">
            <p className="font-semibold text-sm">🌸 Detail Bunga</p>

            {product.flower_type && FLOWER_TYPE_LABELS[product.flower_type] && (
              <div className="flex items-start gap-3">
                <Sprout className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Tipe Bunga</p>
                  <p className="text-sm font-medium">
                    {FLOWER_TYPE_LABELS[product.flower_type].emoji} {FLOWER_TYPE_LABELS[product.flower_type].label}
                  </p>
                </div>
              </div>
            )}

            {product.po_duration_days != null && product.po_duration_days > 0 && (
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Durasi Pre-Order</p>
                  <p className="text-sm font-medium">{product.po_duration_days} hari persiapan</p>
                </div>
              </div>
            )}

            {product.flower_type !== 'live' && product.flower_type !== 'mixed' && product.flower_lifetime_days != null && product.flower_lifetime_days > 0 && (
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Ketahanan Bunga</p>
                  <p className="text-sm font-medium">±{product.flower_lifetime_days} hari</p>
                </div>
              </div>
            )}

            {product.care_instructions && product.flower_type !== 'live' && product.flower_type !== 'mixed' && (
              <div className="flex items-start gap-3">
                <Leaf className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Cara Perawatan</p>
                  <p className="text-sm whitespace-pre-line">{product.care_instructions}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Panduan Bunga Hidup: daya tahan + cara penyimpanan */}
        {(product.flower_type === 'live' || product.flower_type === 'mixed') && (
          <div className="mb-6">
            <FreshFlowerGuide
              text={`${product.name} ${product.description || ''} ${product.category || ''}`}
              sellerLifetimeDays={product.flower_lifetime_days}
              sellerCare={product.care_instructions}
              mixed={product.flower_type === 'mixed'}
            />
          </div>
        )}

        {/* Shop Card */}
        {product.shops && (
          <button
            onClick={() => navigate(`/shops/${product.shop_id}`)}
            className="w-full flex items-center gap-3 p-3 bg-secondary/40 rounded-2xl mb-6 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
              {product.shops.image_url ? (
                <ImageWithFallback src={product.shops.image_url} alt={product.shops.name} className="w-full h-full object-cover" />
              ) : (
                <Store className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm line-clamp-1">{product.shops.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{product.shops.address}</p>
            </div>
            <span className="text-xs text-primary font-medium">Lihat Toko</span>
          </button>
        )}

        {/* Reviews */}
        <div>
          <p className="font-semibold text-sm mb-3">Ulasan Produk</p>
          <ReviewDisplay shopId={product.shop_id} />
        </div>
      </motion.div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border p-3 flex gap-2">
        <button
          onClick={() => navigate(`/chat/${product.shop_id}`)}
          className="p-3 rounded-xl border border-border"
          aria-label="Chat toko"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
        <button
          onClick={handleBuy}
          disabled={availableSizes.length > 0 && !selectedSize}
          className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
            product.is_pre_order
              ? 'bg-orange-500 text-white'
              : 'bg-primary text-primary-foreground'
          } disabled:opacity-50`}
        >
          <ShoppingCart className="w-4 h-4" />
          {product.is_pre_order ? 'Pre-Order Sekarang' : 'Beli Sekarang'}
        </button>
      </div>
    </div>
  );
}
