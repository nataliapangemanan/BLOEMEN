import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Store, MapPin, Phone, Mail, Clock, Image as ImageIcon, Save } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { ImageUpload } from "../../components/ImageUpload";
import { getMyShop, createOrUpdateShop } from "../../lib/api";
import { getUserShop, saveShop } from "../../lib/localStorage";
import InteractiveMap from "../../components/InteractiveMap";
import OpeningHoursPicker from "../../components/OpeningHoursPicker";
import { ShopCategoryPicker } from "../../components/ShopCategoryPicker";
import { Tags } from "lucide-react";

export default function ShopSettings() {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    shopName: "",
    description: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    openingHours: "",
    imageUrl: "",
    latitude: "",
    longitude: ""
  });
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!user || user.userType !== 'seller') {
      navigate('/', { replace: true });
      return;
    }

    fetchShopData();
  }, [user, accessToken]);

  const fetchShopData = async () => {
    try {
      // Try Supabase API first
      const shop = await getMyShop();
      if (shop) {
        setFormData({
          shopName: shop.name || "",
          description: shop.description || "",
          address: shop.address || "",
          city: shop.city || "",
          phone: shop.phone || "",
          email: shop.email || "",
          openingHours: shop.opening_hours || "",
          imageUrl: shop.image_url || "",
          latitude: shop.latitude?.toString() || "",
          longitude: shop.longitude?.toString() || ""
        });
        setCategories(Array.isArray(shop.categories) ? shop.categories : []);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log('API error, trying localStorage');
    }

    // Fallback to localStorage
    if (user?.id) {
      const localShop = getUserShop(user.id);
      if (localShop) {
        setFormData({
          shopName: localShop.name || "",
          description: localShop.description || "",
          address: localShop.address || "",
          city: localShop.city || "",
          phone: localShop.phone || "",
          email: localShop.email || "",
          openingHours: localShop.openingHours || localShop.opening_hours || "",
          imageUrl: localShop.imageUrl || localShop.image_url || "",
          latitude: localShop.latitude?.toString() || "",
          longitude: localShop.longitude?.toString() || ""
        });
      }
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (categories.length === 0) {
      toast.error('Pilih minimal satu kategori spesialisasi toko');
      setSaving(false);
      return;
    }

    const shopData = {
      name: formData.shopName,
      description: formData.description,
      address: formData.address,
      city: formData.city,
      phone: formData.phone,
      email: formData.email,
      openingHours: formData.openingHours,
      imageUrl: formData.imageUrl,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      categories,
    };

    try {
      // Try Supabase API first
      await createOrUpdateShop(shopData);
      toast.success('Pengaturan toko berhasil disimpan');
      setSaving(false);
      return;
    } catch (error: any) {
      console.log('API error, saving to localStorage:', error.message);
    }

    // Fallback to localStorage
    if (user?.id) {
      saveShop(user.id, shopData);
      toast.success('Pengaturan toko berhasil disimpan (mode offline)');
    }

    setSaving(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat data toko...</p>
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
        <h1 className="text-3xl font-bold mb-2 text-foreground">
          Pengaturan Toko
        </h1>
        <p className="text-muted-foreground">
          Kelola informasi dan profil toko Anda
        </p>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    Informasi Dasar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="shopName">Nama Toko</Label>
                    <Input
                      id="shopName"
                      value={formData.shopName}
                      onChange={(e) => handleChange('shopName', e.target.value)}
                      placeholder="Nama toko Anda"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Deskripsi Toko</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Ceritakan tentang toko Anda..."
                      rows={4}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="email@example.com"
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">No. Telepon</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="081234567890"
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Lokasi Toko
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Alamat Lengkap</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="Jl. Contoh No. 123"
                      rows={3}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">Kota</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="Jakarta"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Pilih Lokasi pada Peta</Label>
                    <div className="mt-2">
                      <InteractiveMap
                        latitude={formData.latitude ? parseFloat(formData.latitude) : null}
                        longitude={formData.longitude ? parseFloat(formData.longitude) : null}
                        onLocationChange={(lat, lng) => {
                          handleChange('latitude', lat.toString());
                          handleChange('longitude', lng.toString());
                        }}
                        height="350px"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tags className="w-5 h-5" />
                    Kategori Spesialisasi Toko
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ShopCategoryPicker
                    value={categories}
                    onChange={setCategories}
                    disabled={saving}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Operating Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Jam Operasional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="openingHours">Jam Buka</Label>
                    <div className="mt-2">
                      <OpeningHoursPicker
                        value={formData.openingHours || 'Senin - Sabtu: 08:00 - 20:00'}
                        onChange={(value) => handleChange('openingHours', value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar - Shop Image */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Foto Toko
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ImageUpload
                    label="Foto Toko"
                    folder="shops"
                    value={formData.imageUrl}
                    onChange={(url) => handleChange('imageUrl', url)}
                    hint="Upload foto toko Anda. Rasio 16:9 ideal."
                  />

                  <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg text-sm text-purple-700 dark:text-purple-300">
                    <p className="font-medium mb-1">📸 Rekomendasi:</p>
                    <p>Gunakan foto berkualitas tinggi yang menampilkan toko atau produk terbaik Anda. Rasio 16:9 ideal untuk tampilan.</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                type="submit"
                disabled={saving}
                className="w-full py-6 text-lg rounded-2xl bg-primary hover:bg-primary/90"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  );
}