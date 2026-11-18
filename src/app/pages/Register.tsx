import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, UserPlus, Loader2, MapPin, Store, Phone, Home } from 'lucide-react';
import { toast } from 'sonner';
import { createOrUpdateShop } from '../lib/api';
import InteractiveMap from '../components/InteractiveMap';
import Logo from '../components/Logo';
import { ImageUpload } from '../components/ImageUpload';
import OpeningHoursPicker from '../components/OpeningHoursPicker';
import { useGoBack } from '../lib/navigation';

export default function Register() {
  // Basic info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'customer' | 'seller'>('customer');

  // Address info (for both buyer & seller)
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  // Shop info (only for seller)
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [shopImageUrl, setShopImageUrl] = useState('');
  const [openingHours, setOpeningHours] = useState('Senin - Sabtu: 08:00 - 20:00');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const goBack = useGoBack('/');

  const handleLocationChange = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trim and clean inputs
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanAddress = address.trim();
    const cleanCity = city.trim();

    // Basic validation
    if (!cleanName || !cleanEmail || !cleanPassword || !confirmPassword) {
      toast.error('Semua field wajib harus diisi');
      return;
    }

    if (!cleanPhone || !cleanAddress || !cleanCity) {
      toast.error('Nomor telepon, alamat, dan kota harus diisi');
      return;
    }

    if (cleanPassword !== confirmPassword.trim()) {
      toast.error('Password tidak cocok');
      return;
    }

    if (cleanPassword.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    // Seller-specific validation
    if (userType === 'seller') {
      const cleanShopName = shopName.trim();
      const cleanShopDescription = shopDescription.trim();
      
      if (!cleanShopName || !cleanShopDescription) {
        toast.error('Nama toko dan deskripsi harus diisi');
        return;
      }
    }

    setLoading(true);
    try {
      // Sign up user with auth
      await signUp(cleanEmail, cleanPassword, cleanName, userType, cleanPhone);

      // If seller, create shop immediately
      if (userType === 'seller') {
        try {
          await createOrUpdateShop({
            name: shopName.trim(),
            description: shopDescription.trim(),
            address: cleanAddress,
            city: cleanCity,
            phone: cleanPhone,
            email: cleanEmail,
            openingHours: openingHours.trim() || 'Senin - Sabtu: 08:00 - 20:00',
            imageUrl: shopImageUrl.trim() || '',
            latitude: latitude,
            longitude: longitude
          });
          toast.success('Toko berhasil didaftarkan!');
        } catch (shopError) {
          console.error('Shop creation error:', shopError);
          toast.warning('Akun berhasil dibuat, tapi ada masalah dengan toko. Silakan lengkapi di Pengaturan Toko.');
        }
      }

      toast.success('Pendaftaran berhasil! Selamat datang!');

      // Redirect based on user type
      if (userType === 'seller') {
        navigate('/seller', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      console.error('Register error:', error);
      
      // Better error messages
      if (error.message.includes('User already registered')) {
        toast.error('Email sudah terdaftar. Silakan login atau gunakan email lain.');
      } else if (error.message.includes('konfirmasi email')) {
        toast.warning(error.message, { duration: 8000 });
      } else {
        toast.error(error.message || 'Pendaftaran gagal');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 px-4 py-4 border-b border-border bg-background/95 backdrop-blur-md"
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

      {/* Register Form */}
      <div className="flex-1 p-4 py-6 overflow-y-auto">
        <motion.div
          className="w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <Logo size={80} />
            </div>
            <h1 className="text-2xl font-bold mb-1">Buat Akun Baru</h1>
            <p className="text-sm text-muted-foreground">
              {userType === 'seller' ? 'Mulai jual bunga Anda' : 'Bergabunglah dengan kami'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipe Akun - Moved to top */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tipe Akun <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('customer')}
                  className={`py-3 px-4 rounded-xl border-2 transition-all ${
                    userType === 'customer'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-secondary/50'
                  }`}
                  disabled={loading}
                >
                  <div className="text-2xl mb-1">🛍️</div>
                  <div className="font-medium text-sm">Pembeli</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('seller')}
                  className={`py-3 px-4 rounded-xl border-2 transition-all ${
                    userType === 'seller'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-secondary/50'
                  }`}
                  disabled={loading}
                >
                  <div className="text-2xl mb-1">🏪</div>
                  <div className="font-medium text-sm">Penjual</div>
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="pt-2">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Informasi Akun
              </h3>

              <div className="space-y-3">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nama Lengkap <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Nomor Telepon <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081234567890"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                      Password <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 karakter"
                      className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                      Konfirmasi <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password"
                      className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div className="pt-2">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Home className="w-4 h-4" />
                Alamat
              </h3>

              <div className="space-y-3">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1">
                    Alamat Lengkap <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan"
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none"
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-1">
                    Kota <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Jakarta"
                    className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Seller-specific fields */}
            <AnimatePresence>
              {userType === 'seller' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-2 overflow-hidden"
                >
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    Informasi Toko
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label htmlFor="shopName" className="block text-sm font-medium mb-1">
                        Nama Toko <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="shopName"
                        type="text"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="Toko Bunga Indah"
                        className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label htmlFor="shopDescription" className="block text-sm font-medium mb-1">
                        Deskripsi Toko <span className="text-destructive">*</span>
                      </label>
                      <textarea
                        id="shopDescription"
                        value={shopDescription}
                        onChange={(e) => setShopDescription(e.target.value)}
                        placeholder="Menjual berbagai macam bunga segar..."
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label htmlFor="openingHours" className="block text-sm font-medium mb-1">
                        Jam Buka (Opsional)
                      </label>
                      <OpeningHoursPicker
                        value={openingHours}
                        onChange={setOpeningHours}
                        disabled={loading}
                      />
                    </div>

                    <ImageUpload
                      label="Foto Toko (Opsional)"
                      folder="shops"
                      value={shopImageUrl}
                      onChange={setShopImageUrl}
                      disabled={loading}
                    />

                    {/* Location Picker */}
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        Lokasi Toko (Opsional)
                      </label>

                      <InteractiveMap
                        latitude={latitude}
                        longitude={longitude}
                        onLocationChange={handleLocationChange}
                        disabled={loading}
                        height="250px"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2"
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Daftar
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary font-medium">
                Masuk
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}