import { motion } from "motion/react";
import { estimateLifetime, STORAGE_STEPS } from '../../lib/flowerCare';
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Package, Search, Image as ImageIcon, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { ImageUpload } from "../../components/ImageUpload";
import { getMyProducts, createProduct, updateProduct, deleteProduct as deleteProductAPI } from "../../lib/api";
import { PRODUCT_CATEGORIES } from "../../lib/productCategories";
import { getProductsByUserId, saveProduct, deleteProduct as deleteLocalProduct } from "../../lib/localStorage";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  isAvailable: boolean;
  isPreOrder: boolean;
  discountPercentage?: number;
  discountPrice?: number;
  isOnDiscount?: boolean;
  flowerType?: 'live' | 'artificial' | 'mixed';
  poDurationDays?: number;
  flowerLifetimeDays?: number;
  careInstructions?: string;
  sizes?: Record<string, number> | null;
}

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL'] as const;
type SizeKey = typeof SIZE_OPTIONS[number];

export default function ProductsManagement() {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    stock: "",
    isAvailable: true,
    isPreOrder: false,
    discountPercentage: "",
    isOnDiscount: false,
    flowerType: "" as 'live' | 'artificial' | 'mixed' | "",
    poDurationDays: "",
    flowerLifetimeDays: "",
    careInstructions: "",
    useSizes: false,
    sizes: { S: "", M: "", L: "", XL: "" } as Record<SizeKey, string>
  });

  useEffect(() => {
    if (!user || user.userType !== 'seller') {
      navigate('/', { replace: true });
      return;
    }

    fetchProducts();
  }, [user, accessToken]);

  const fetchProducts = async () => {
    try {
      // Try Supabase API first
      const products = await getMyProducts();
      // Convert snake_case to camelCase for frontend
      const formattedProducts = products.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        imageUrl: p.image_url,
        stock: p.stock,
        isAvailable: p.is_available,
        isPreOrder: p.is_pre_order,
        discountPercentage: p.discount_percentage,
        discountPrice: p.discount_price,
        isOnDiscount: p.is_on_discount,
        flowerType: p.flower_type,
        poDurationDays: p.po_duration_days,
        flowerLifetimeDays: p.flower_lifetime_days,
        careInstructions: p.care_instructions,
        sizes: p.sizes
      }));
      setProducts(formattedProducts);
      setLoading(false);
      return;
    } catch (error) {
      console.log('API error, using localStorage');
    }

    // Fallback to localStorage
    if (user?.id) {
      const localProducts = getProductsByUserId(user.id);
      setProducts(localProducts);
    }

    setLoading(false);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
      stock: "",
      isAvailable: true,
      isPreOrder: false,
      discountPercentage: "",
      isOnDiscount: false,
      flowerType: "",
      poDurationDays: "",
      flowerLifetimeDays: "",
      careInstructions: "",
      useSizes: false,
      sizes: { S: "", M: "", L: "", XL: "" }
    });
    setShowAddDialog(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      imageUrl: product.imageUrl,
      stock: product.stock.toString(),
      isAvailable: product.isAvailable,
      isPreOrder: product.isPreOrder,
      discountPercentage: product.discountPercentage?.toString() || "",
      isOnDiscount: product.isOnDiscount || false,
      flowerType: product.flowerType || "",
      poDurationDays: product.poDurationDays?.toString() || "",
      flowerLifetimeDays: product.flowerLifetimeDays?.toString() || "",
      careInstructions: product.careInstructions || "",
      useSizes: !!(product.sizes && Object.keys(product.sizes).length > 0),
      sizes: {
        S: product.sizes?.S?.toString() || "",
        M: product.sizes?.M?.toString() || "",
        L: product.sizes?.L?.toString() || "",
        XL: product.sizes?.XL?.toString() || ""
      }
    });
    setShowAddDialog(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        // Try Supabase first
        await deleteProductAPI(productId);
        setProducts(products.filter(p => p.id !== productId));
        toast.success('Produk berhasil dihapus');
        return;
      } catch (error: any) {
        console.log('API error:', error.message);
      }

      // Fallback to localStorage
      deleteLocalProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Produk berhasil dihapus (mode offline)');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sizesFilled = formData.useSizes
      ? SIZE_OPTIONS.reduce((acc, s) => {
          const v = parseFloat(formData.sizes[s]);
          if (!isNaN(v) && v > 0) acc[s] = v;
          return acc;
        }, {} as Record<string, number>)
      : {};
    const useSizesMode = formData.useSizes && Object.keys(sizesFilled).length > 0;
    if (formData.useSizes && Object.keys(sizesFilled).length === 0) {
      toast.error('Isi minimal satu harga ukuran');
      return;
    }
    const effectivePrice = useSizesMode
      ? Math.min(...Object.values(sizesFilled))
      : parseFloat(formData.price);

    const productData = {
      name: formData.name,
      description: formData.description,
      price: effectivePrice,
      // Pre-order products are made on demand and don't have inventory.
      // Use 999 as a sentinel so they remain "in stock" for filtering.
      stock: formData.isPreOrder ? 999 : parseInt(formData.stock || '0'),
      category: formData.category,
      imageUrl: formData.imageUrl,
      isAvailable: formData.isAvailable,
      isPreOrder: formData.isPreOrder,
      discountPercentage: formData.discountPercentage ? parseInt(formData.discountPercentage) : 0,
      isOnDiscount: formData.isOnDiscount,
      flowerType: formData.flowerType || null,
      poDurationDays: formData.poDurationDays ? parseInt(formData.poDurationDays) : null,
      flowerLifetimeDays: formData.flowerLifetimeDays ? parseInt(formData.flowerLifetimeDays) : null,
      careInstructions: formData.careInstructions || null,
      sizes: useSizesMode ? sizesFilled : null
    };

    try {
      const mapRow = (r: any): Product => ({
        id: r.id,
        name: r.name,
        description: r.description,
        price: r.price,
        category: r.category,
        imageUrl: r.image_url,
        stock: r.stock,
        isAvailable: r.is_available,
        isPreOrder: r.is_pre_order,
        discountPercentage: r.discount_percentage,
        discountPrice: r.discount_price,
        isOnDiscount: r.is_on_discount,
        flowerType: r.flower_type,
        poDurationDays: r.po_duration_days,
        flowerLifetimeDays: r.flower_lifetime_days,
        careInstructions: r.care_instructions,
        sizes: r.sizes
      });

      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, productData);
        setProducts(products.map(p => p.id === editingProduct.id ? mapRow(updated) : p));
        toast.success('Produk berhasil diperbarui');
        setShowAddDialog(false);
        return;
      } else {
        const newProduct = await createProduct(productData);
        setProducts([mapRow(newProduct), ...products]);
        toast.success('Produk berhasil ditambahkan');
        setShowAddDialog(false);
        return;
      }
    } catch (error: any) {
      console.error('API error:', error);
      const msg = error?.message || 'Terjadi kesalahan menyimpan produk';
      const hint = msg.toLowerCase().includes('sizes') || msg.toLowerCase().includes('column')
        ? ' — Kolom database mungkin belum ada. Jalankan migrasi SQL (lihat catatan di bawah).'
        : '';
      toast.error(msg + hint);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              Kelola Produk
            </h1>
            <p className="text-muted-foreground">
              Tambah, edit, dan kelola produk bunga Anda
            </p>
          </div>

          <motion.button
            onClick={handleAddProduct}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            Tambah Produk
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 rounded-2xl bg-white dark:bg-secondary/50"
          />
        </div>
      </motion.div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <Package className="w-20 h-20 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Belum Ada Produk</h3>
          <p className="text-muted-foreground mb-6">
            Mulai tambahkan produk bunga Anda untuk dijual
          </p>
          <Button onClick={handleAddProduct} size="lg" className="rounded-full">
            <Plus className="w-5 h-5 mr-2" />
            Tambah Produk Pertama
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[4/3] bg-secondary/20">
                  <ImageWithFallback
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />

                  {!product.isAvailable && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="px-4 py-2 bg-destructive text-white rounded-full font-semibold">
                        Tidak Tersedia
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex gap-2">
                    <motion.button
                      onClick={() => handleEditProduct(product)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white"
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 bg-destructive/90 backdrop-blur-sm text-white rounded-full shadow-lg hover:bg-destructive"
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <CardContent className="p-5">
                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full">
                      {product.category}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      product.isPreOrder
                        ? 'bg-secondary text-foreground'
                        : 'bg-green-500/10 text-green-700 dark:text-green-400'
                    }`}>
                      {product.isPreOrder ? '📅 Pre-Order' : '✓ Ready Stock'}
                    </span>
                    {product.isOnDiscount && (
                      <span className="text-xs px-2.5 py-1 bg-red-500/10 text-red-700 dark:text-red-400 rounded-full font-bold">
                        🏷️ -{product.discountPercentage}%
                      </span>
                    )}
                    {product.flowerType === 'live' && (
                      <span className="text-xs px-2.5 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full">
                        🌺 Bunga Hidup
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div>
                      {product.isOnDiscount && product.discountPrice ? (
                        <div>
                          <p className="text-sm text-muted-foreground line-through">
                            Rp {product.price.toLocaleString('id-ID')}
                          </p>
                          <p className="text-2xl font-bold text-primary">
                            Rp {product.discountPrice.toLocaleString('id-ID')}
                          </p>
                        </div>
                      ) : (
                        <p className="text-2xl font-bold text-primary">
                          Rp {product.price.toLocaleString('id-ID')}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {product.isPreOrder ? 'Made-to-order' : `Stok: ${product.stock} pcs`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Perbarui informasi produk bunga Anda' : 'Tambahkan produk bunga baru ke toko Anda'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Nama Produk</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Bouquet Mawar Merah"
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsikan produk Anda..."
                rows={4}
                required
                className="mt-2"
              />
            </div>

            <div className="space-y-3 p-4 bg-secondary/30 border border-border rounded-xl">
              <Label className="font-semibold block">💰 Jenis Harga</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, useSizes: false })}
                  className={`p-3 rounded-xl border-2 text-sm transition-all ${
                    !formData.useSizes
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background'
                  }`}
                >
                  <div className="font-semibold">Satu Harga</div>
                  <div className="text-xs text-muted-foreground mt-1">Produk hanya 1 ukuran</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, useSizes: true })}
                  className={`p-3 rounded-xl border-2 text-sm transition-all ${
                    formData.useSizes
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background'
                  }`}
                >
                  <div className="font-semibold">Per Ukuran (S–XL)</div>
                  <div className="text-xs text-muted-foreground mt-1">Tiap ukuran beda harga</div>
                </button>
              </div>

              {!formData.useSizes ? (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <Label htmlFor="price">Harga (Rp)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="250000"
                      required
                      className="mt-2"
                    />
                  </div>
                  {!formData.isPreOrder && (
                    <div>
                      <Label htmlFor="stock">Stok</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        placeholder="10"
                        required
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-muted-foreground">
                    Isi harga untuk ukuran yang Anda sediakan. Kosongkan ukuran yang tidak dijual.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {SIZE_OPTIONS.map((s) => (
                      <div key={s} className="flex items-center gap-2">
                        <span className="w-10 text-center font-semibold bg-background border border-border rounded-md py-1.5 text-sm">{s}</span>
                        <Input
                          type="number"
                          placeholder="Harga (Rp)"
                          value={formData.sizes[s]}
                          onChange={(e) => setFormData({
                            ...formData,
                            sizes: { ...formData.sizes, [s]: e.target.value }
                          })}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                  {!formData.isPreOrder && (
                    <div>
                      <Label htmlFor="stock">Stok Total</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        placeholder="10"
                        required
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="category">Kategori</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="mt-2 w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Pilih kategori...</option>
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>

            <ImageUpload
              label="Gambar Produk"
              folder="products"
              required
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            />

            {/* Discount Section */}
            <div className="space-y-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <input
                  id="isOnDiscount"
                  type="checkbox"
                  checked={formData.isOnDiscount}
                  onChange={(e) => setFormData({ ...formData, isOnDiscount: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isOnDiscount" className="font-semibold">🏷️ Aktifkan Diskon</Label>
              </div>

              {formData.isOnDiscount && (
                <div>
                  <Label htmlFor="discountPercentage">Persentase Diskon (%)</Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                    placeholder="10"
                    className="mt-2"
                  />
                  {formData.discountPercentage && formData.price && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Harga setelah diskon: <span className="font-bold text-primary">
                        Rp {((parseFloat(formData.price) * (1 - parseInt(formData.discountPercentage) / 100))).toLocaleString('id-ID')}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Flower Details Section */}
            <div className="space-y-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <Label className="font-semibold block">🌸 Detail Bunga</Label>

              <div>
                <Label htmlFor="flowerType">Tipe Bunga</Label>
                <select
                  id="flowerType"
                  value={formData.flowerType}
                  onChange={(e) => setFormData({ ...formData, flowerType: e.target.value as any })}
                  className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="">Pilih tipe bunga</option>
                  <option value="live">🌺 Bunga Hidup</option>
                  <option value="artificial">🌼 Bunga Artificial</option>
                  <option value="mixed">🌻 Campuran</option>
                </select>
              </div>

              {(formData.flowerType === 'live' || formData.flowerType === 'mixed') && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="poDurationDays">Durasi PO (hari)</Label>
                      <Input
                        id="poDurationDays"
                        type="number"
                        min="0"
                        value={formData.poDurationDays}
                        onChange={(e) => setFormData({ ...formData, poDurationDays: e.target.value })}
                        placeholder="3"
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Berapa hari perlu disiapkan
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="flowerLifetimeDays">Ketahanan (hari)</Label>
                      <Input
                        id="flowerLifetimeDays"
                        type="number"
                        min="0"
                        value={formData.flowerLifetimeDays}
                        onChange={(e) => setFormData({ ...formData, flowerLifetimeDays: e.target.value })}
                        placeholder="7"
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Berapa hari bunga bertahan
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <Label htmlFor="careInstructions">Cara Perawatan</Label>
                      <button
                        type="button"
                        onClick={() => {
                          const est = estimateLifetime(`${formData.name} ${formData.description}`);
                          setFormData({
                            ...formData,
                            flowerLifetimeDays: formData.flowerLifetimeDays || String(est.min),
                            careInstructions: STORAGE_STEPS.map((s, i) => `${i + 1}. ${s.title}: ${s.body}`).join('\n'),
                          });
                        }}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Isi otomatis
                      </button>
                    </div>
                    <Textarea
                      id="careInstructions"
                      value={formData.careInstructions}
                      onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                      placeholder="Contoh: Ganti air setiap hari, potong batang 1cm, hindari sinar matahari langsung"
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4 p-4 bg-secondary/30 rounded-xl">
              <div>
                <Label className="font-semibold mb-3 block">Tipe Produk</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPreOrder: false })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      !formData.isPreOrder
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-border bg-background'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">✓</div>
                      <p className="font-semibold text-sm">Ready Stock</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tersedia langsung
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPreOrder: true })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.isPreOrder
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">📅</div>
                      <p className="font-semibold text-sm">Pre-Order</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pesan terlebih dahulu
                      </p>
                    </div>
                  </button>
                </div>
                {formData.isPreOrder && (
                  <div className="mt-3 p-3 bg-secondary border border-border rounded-lg">
                    <p className="text-xs text-purple-700 dark:text-purple-400">
                      ℹ️ Produk pre-order memerlukan pembeli memilih tanggal pengiriman saat memesan
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="isAvailable"
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isAvailable">Produk tersedia untuk dijual</Label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button type="submit" className="flex-1">
                {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
