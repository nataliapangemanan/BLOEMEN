import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Phone, Clock, Star, ShoppingCart, Package, MessageCircle, ImagePlus } from 'lucide-react';
import { SendReferenceToShop } from '../components/SendReferenceToShop';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { FLOWER_PLACEHOLDER } from '../lib/placeholder';
import ReadOnlyMap from '../components/ReadOnlyMap';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { getShopById as getShopByIdAPI, getProductsByShopId as getProductsByShopIdAPI } from '../lib/api';
import { getShopById as getLocalShopById, getProductsByShopId as getLocalProductsByShopId } from '../lib/localStorage';
import { useAuth } from '../contexts/AuthContext';
import { ReviewDisplay } from '../components/ReviewDisplay';
import { supabase } from '../lib/supabase';
import { getShopCategoryLabels } from '../lib/shopCategories';
import { getOpenStatus } from '../lib/openingHours';
import { useGoBack } from '../lib/navigation';

interface Shop {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  latitude: number | null;
  longitude: number | null;
  imageUrl?: string;
  images?: string[];
  email?: string;
  city?: string;
  openingHours?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  isPreOrder: boolean;
  isAvailable: boolean;
  category: string;
  averageRating?: number;
  totalReviews?: number;
  isOnDiscount?: boolean;
  discountPercentage?: number;
  discountPrice?: number;
  sizes?: Record<string, number> | null;
}

export default function ShopDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const goBack = useGoBack('/shops');
  const { user } = useAuth();
  const [showSendRef, setShowSendRef] = useState(false);
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchShop(id);
      fetchShopProducts(id);
    }
  }, [id]);

  const fetchShop = async (shopId: string) => {
    try {
      // Try Supabase API first
      const shopData = await getShopByIdAPI(shopId);

      // Convert snake_case to camelCase for frontend
      const formattedShop = {
        id: shopData.id,
        name: shopData.name,
        description: shopData.description || '',
        address: shopData.address || '',
        phone: shopData.phone || '',
        latitude: shopData.latitude,
        longitude: shopData.longitude,
        imageUrl: shopData.image_url,
        email: shopData.email,
        city: shopData.city,
        openingHours: shopData.opening_hours
      };

      setShop(formattedShop);
      setLoading(false);
    } catch (error) {
      console.log('API error, using localStorage:', error);

      // Fallback to localStorage
      const localShop = getLocalShopById(shopId);
      setShop(localShop);
      setLoading(false);
    }
  };

  const fetchShopProducts = async (shopId: string) => {
    try {
      // Try Supabase API first
      const productsData = await getProductsByShopIdAPI(shopId);

      console.log('Products fetched for shop:', shopId, 'Count:', productsData.length);

      // Convert snake_case to camelCase for frontend
      const formattedProducts = await Promise.all(
        productsData.map(async (product: any) => {
          // Fetch average rating for each product
          const { data: reviewData } = await supabase
            .from('reviews')
            .select('rating')
            .eq('product_id', product.id);

          const ratings = reviewData || [];
          const averageRating = ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 0;

          return {
            id: product.id,
            name: product.name,
            description: product.description || '',
            price: product.price,
            imageUrl: product.image_url,
            stock: product.stock,
            isPreOrder: product.is_pre_order,
            isAvailable: product.is_available,
            category: product.category,
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: ratings.length,
            isOnDiscount: product.is_on_discount,
            discountPercentage: product.discount_percentage,
            discountPrice: product.discount_price,
            sizes: product.sizes
          };
        })
      );

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);

      // Fallback to localStorage
      const localProducts = getLocalProductsByShopId(shopId);
      console.log('Using localStorage products:', localProducts.length);
      setProducts(localProducts);
    }
  };

  const handleBuyNow = (product: Product) => {
    const selectedSize = selectedSizes[product.id];
    const sizePrice = selectedSize && product.sizes ? product.sizes[selectedSize] : null;
    const basePrice = sizePrice ?? product.price;
    const effectivePrice =
      product.isOnDiscount && product.discountPercentage
        ? Math.round(basePrice * (1 - product.discountPercentage / 100))
        : basePrice;
    navigate(`/preorder/${shop?.id}`, {
      state: {
        selectedProduct: {
          id: product.id,
          name: selectedSize ? `${product.name} (Ukuran ${selectedSize})` : product.name,
          description: product.description,
          price: effectivePrice,
          originalPrice: basePrice,
          isOnDiscount: product.isOnDiscount,
          discountPercentage: product.discountPercentage,
          size: selectedSize || null,
          imageUrl: product.imageUrl,
          isPreOrder: product.isPreOrder,
          stock: product.stock
        }
      }
    });
  };

  const SizePicker = ({ product }: { product: Product }) => {
    if (!product.sizes || Object.keys(product.sizes).length === 0) return null;
    const order = ['S', 'M', 'L', 'XL'];
    const available = order.filter((s) => product.sizes![s] != null);
    return (
      <div className="mb-2">
        <p className="text-[10px] text-muted-foreground mb-1">Pilih ukuran:</p>
        <div className="flex gap-1 flex-wrap">
          {available.map((s) => (
            <button
              key={s}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSizes((prev) => ({ ...prev, [product.id]: s }));
              }}
              className={`px-2 py-1 text-xs rounded-md border ${
                selectedSizes[product.id] === s
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const PriceDisplay = ({ product }: { product: Product }) => {
    const hasSizes = !!(product.sizes && Object.keys(product.sizes).length > 0);
    const selectedSize = selectedSizes[product.id];
    const basePrice =
      selectedSize && product.sizes && product.sizes[selectedSize] != null
        ? product.sizes[selectedSize]
        : hasSizes
          ? Math.min(...Object.values(product.sizes!))
          : product.price;
    const prefix = hasSizes && !selectedSize ? 'Mulai dari ' : '';
    const onDiscount = !!(product.isOnDiscount && product.discountPercentage);
    const discounted = onDiscount ? Math.round(basePrice * (1 - product.discountPercentage! / 100)) : null;

    if (onDiscount && discounted != null) {
      return (
        <div className="mb-3">
          <div className="inline-flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold mb-1">
            🏷️ Diskon -{product.discountPercentage}%
          </div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-muted-foreground line-through text-xs">
              Rp {basePrice.toLocaleString('id-ID')}
            </span>
            <span className="text-red-600 dark:text-red-400 font-bold">
              Rp {discounted.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      );
    }
    return (
      <p className="text-primary font-bold mb-3">
        {prefix}Rp {basePrice.toLocaleString('id-ID')}
      </p>
    );
  };

  const readyStockProducts = products.filter(p => !p.isPreOrder && p.stock > 0 && p.isAvailable);
  const preOrderProducts = products.filter(p => p.isPreOrder && p.isAvailable);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🌺</div>
          <p className="text-muted-foreground">Memuat toko...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Toko tidak ditemukan</h2>
          <button
            onClick={() => navigate('/shops')}
            className="text-primary"
          >
            Kembali ke daftar toko
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Image */}
      <div className="relative">
        <div className="aspect-[16/10] relative">
          <ImageWithFallback
            src={shop.imageUrl || shop.images?.[0] || FLOWER_PLACEHOLDER}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <button
          onClick={() => goBack()}
          className="absolute top-4 left-4 p-2 bg-background/80 backdrop-blur-sm rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {(() => {
          const st = getOpenStatus(shop.openingHours);
          if (!st.known) return null;
          return (
            <div className={`absolute top-4 right-4 px-3 py-1.5 text-white rounded-full text-sm font-medium ${st.open ? 'bg-green-600' : 'bg-red-600'}`}>
              {st.open ? '● Buka' : '● Tutup'}
            </div>
          );
        })()}
      </div>

      {/* Shop Info */}
      <div className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-2xl font-bold flex-1">{shop.name}</h1>
            <div className="flex items-center gap-1 bg-yellow-500/10 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">4.8</span>
            </div>
          </div>

          <p className="text-muted-foreground mb-3">{shop.description}</p>

          {Array.isArray((shop as any).categories) && (shop as any).categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {getShopCategoryLabels((shop as any).categories).map((label) => (
                <span
                  key={label}
                  className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium"
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-xl">
              <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium mb-1">Alamat</p>
                <p className="text-sm text-muted-foreground">{shop.address}</p>
              </div>
            </div>

            {/* Interactive Map - Show if coordinates are available */}
            {shop.latitude && shop.longitude ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-secondary/30 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <p className="font-medium">Lokasi Toko</p>
                </div>
                <ReadOnlyMap
                  latitude={shop.latitude}
                  longitude={shop.longitude}
                  shopName={shop.name}
                  height="250px"
                />
                <button
                  onClick={() => navigate(`/shops/map/${shop.id}`)}
                  className="mt-3 w-full py-2.5 rounded-xl border-2 border-primary/40 text-primary text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Lihat Peta &amp; Rute
                </button>
              </motion.div>
            ) : (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-primary underline px-1"
              >
                Buka alamat di Google Maps
              </a>
            )}

            <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-xl">
              <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Telepon</p>
                <a href={`tel:${shop.phone}`} className="text-sm text-primary">
                  {shop.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-xl">
              <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Jam Operasional</p>
                <p className="text-sm text-muted-foreground">{shop.openingHours || 'Belum diatur oleh penjual'}</p>
              </div>
            </div>
          </div>

          {/* Chat + Upload Referensi langsung ke toko ini */}
          {(() => {
            const isOwnShop = !!user && (shop as any).user_id === user.id;
            const requireLogin = (fn: () => void) => () => {
              if (!user) {
                toast.error('Silakan login terlebih dahulu');
                navigate('/login');
              } else fn();
            };
            return (
              <div className={`grid gap-2 mb-6 ${isOwnShop ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <motion.button
                  onClick={requireLogin(() => navigate(`/chat/${shop.id}`))}
                  className="py-3 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg hover:bg-primary/90 transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat Toko
                </motion.button>
                {!isOwnShop && (
                  <motion.button
                    onClick={requireLogin(() => setShowSendRef(true))}
                    className="py-3 bg-background text-primary border-2 border-primary/40 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
                    whileTap={{ scale: 0.98 }}
                  >
                    <ImagePlus className="w-5 h-5" />
                    Kirim Referensi
                  </motion.button>
                )}
              </div>
            );
          })()}
          <SendReferenceToShop
            shopId={shop.id}
            shopName={shop.name}
            open={showSendRef}
            onOpenChange={setShowSendRef}
          />

          {/* Products Tabs */}
          <Tabs defaultValue="ready" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="ready" className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Beli Langsung</span>
                <span className="sm:hidden">Langsung</span>
                <span className="ml-1">({readyStockProducts.length})</span>
              </TabsTrigger>
              <TabsTrigger value="preorder" className="gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Pre-Order</span>
                <span className="sm:hidden">PO</span>
                <span className="ml-1">({preOrderProducts.length})</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2">
                <Star className="w-4 h-4" />
                Review
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ready">
              {readyStockProducts.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Belum ada produk ready stock</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {readyStockProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                    >
                      <div className="relative aspect-square">
                        <ImageWithFallback
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full font-semibold">
                          Stock: {product.stock}
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{product.description}</p>

                        {/* Rating */}
                        {product.totalReviews && product.totalReviews > 0 ? (
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-semibold">{product.averageRating}</span>
                            <span className="text-xs text-muted-foreground">({product.totalReviews})</span>
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground mb-2">Belum ada review</div>
                        )}

                        <SizePicker product={product} />
                        <PriceDisplay product={product} />
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBuyNow(product); }}
                          className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
                        >
                          Beli Sekarang
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="preorder">
              {preOrderProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Belum ada produk pre-order</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {preOrderProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                    >
                      <div className="relative aspect-square">
                        <ImageWithFallback
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-orange-500 text-white text-xs rounded-full font-semibold">
                          Pre-Order
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{product.description}</p>

                        {/* Rating */}
                        {product.totalReviews && product.totalReviews > 0 ? (
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-semibold">{product.averageRating}</span>
                            <span className="text-xs text-muted-foreground">({product.totalReviews})</span>
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground mb-2">Belum ada review</div>
                        )}

                        <SizePicker product={product} />
                        <PriceDisplay product={product} />
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBuyNow(product); }}
                          className="w-full py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold"
                        >
                          Pre-Order
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewDisplay shopId={shop.id} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}