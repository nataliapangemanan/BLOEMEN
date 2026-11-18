import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Store, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createOrUpdateShop } from '../lib/api';
import InteractiveMap from '../components/InteractiveMap';
import OpeningHoursPicker from '../components/OpeningHoursPicker';
import { ShopCategoryPicker } from '../components/ShopCategoryPicker';
import { useGoBack } from '../lib/navigation';

export default function ShopRegister() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [openingHours, setOpeningHours] = useState('Senin - Sabtu: 08:00 - 20:00');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const goBack = useGoBack('/');

  useEffect(() => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLocationChange = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !address || !phone) {
      toast.error('Nama toko, alamat, dan nomor telepon harus diisi');
      return;
    }

    if (categories.length === 0) {
      toast.error('Pilih minimal satu kategori spesialisasi toko');
      return;
    }

    if (!user || !accessToken) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Create shop via API
      await createOrUpdateShop({
        name,
        description,
        address,
        phone,
        latitude,
        longitude,
        city: '',
        email: user.email || '',
        openingHours,
        imageUrl: '',
        categories,
      });

      toast.success('Toko berhasil didaftarkan!');
      toast.info('Silakan lengkapi informasi toko di Pengaturan Toko');

      // Navigate to seller dashboard if user is seller
      if (user.userType === 'seller') {
        navigate('/seller/shop-settings', { replace: true });
      } else {
        navigate('/profile', { replace: true });
      }
    } catch (error: any) {
      console.error('Shop registration error:', error);

      // Provide helpful error messages
      if (error?.code === '23503') {
        toast.error('Error: User profile belum dibuat. Silakan logout dan login kembali.');
      } else if (error?.message?.includes('Shop not found')) {
        toast.error('Gagal membuat toko. Silakan coba lagi.');
      } else if (error?.code === 'PGRST205') {
        toast.error('Database belum disetup. Silakan jalankan migrations di Supabase Dashboard.');
        console.warn('📖 Lihat DOCUMENTATION.md section 3 untuk setup database');
      } else if (error?.code === 'PGRST204') {
        // Column not found error
        const missingColumn = error?.message?.match(/'([^']+)' column/)?.[1];
        toast.error(`Database error: Kolom "${missingColumn || 'unknown'}" tidak ditemukan.`);
        toast.error('Silakan jalankan SQL migration terbaru dari DOCUMENTATION.md');
        console.error('❌ PGRST204 Error:', error?.message);
        console.warn('📖 Lihat DOCUMENTATION.md section 3.3 untuk SQL migration lengkap');
        if (missingColumn === 'opening_hours') {
          console.warn('💡 Quick fix: ALTER TABLE shops RENAME COLUMN operating_hours TO opening_hours;');
        }
      } else {
        toast.error(error.message || 'Pendaftaran toko gagal. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="px-4 py-4 border-b border-border"
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

      {/* Form */}
      <div className="p-4 pb-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center mb-8 mt-4">
            <div className="text-5xl mb-4">🏪</div>
            <h1 className="text-2xl font-bold mb-2">Daftarkan Toko Bunga</h1>
            <p className="text-muted-foreground">Mulai jual bunga kreativitas Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nama Toko <span className="text-destructive">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Toko Bunga Indah"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Deskripsi Toko
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ceritakan tentang toko bunga Anda..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-2">
                Alamat Lengkap <span className="text-destructive">*</span>
              </label>
              <textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Contoh No. 123, Kecamatan, Kota, Provinsi"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Nomor Telepon <span className="text-destructive">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Lokasi Toko (Opsional)
              </label>
              <div className="space-y-3">
                <InteractiveMap
                  latitude={latitude}
                  longitude={longitude}
                  onLocationChange={handleLocationChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Kategori Toko <span className="text-destructive">*</span>
              </label>
              <ShopCategoryPicker
                value={categories}
                onChange={setCategories}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Jam Buka Toko
              </label>
              <OpeningHoursPicker
                value={openingHours}
                onChange={setOpeningHours}
              />
            </div>

            <div className="pt-4">
              <motion.button
                type="submit"
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2"
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mendaftarkan...
                  </>
                ) : (
                  <>
                    <Store className="w-5 h-5" />
                    Daftarkan Toko
                  </>
                )}
              </motion.button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              ℹ️ Setelah toko didaftarkan, Anda dapat menambahkan produk dan menerima pre-order dari pelanggan.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}