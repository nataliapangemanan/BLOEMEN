import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Calendar, MapPin, Loader2, ShoppingBag, MessageSquare, Image as ImageIcon, Store, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { createPreorder } from '../lib/api';
import { PICKUP_NOTE } from '../lib/flowerCare';
import { useGoBack } from '../lib/navigation';

export default function PreOrder() {
  const { shopId } = useParams<{ shopId: string }>();
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const goBack = useGoBack('/');
  const location = useLocation();

  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('10:00');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [designReference, setDesignReference] = useState<any>(null);

  useEffect(() => {
    // Get data from navigation state
    const state = location.state as any;

    if (state?.quoteId) {
      // Order from accepted quote
      setDesignReference(state.designReference || null);

      let specialReq = '';
      if (state.description) {
        specialReq += state.description;
      }
      if (state.designReference) {
        specialReq += specialReq ? `\n\nReferensi desain: ${state.designReference.title}` : `Referensi desain: ${state.designReference.title}`;
      }
      setSpecialRequests(specialReq);

      setSelectedItems([
        {
          name: state.productName || 'Rangkaian Custom',
          quantity: 1,
          price: state.price || 0
        }
      ]);
    } else if (state?.designReference) {
      setDesignReference(state.designReference);
      setSpecialRequests(`Referensi desain: ${state.designReference.title} - ${state.designReference.description}`);
      // Set default item for design reference
      setSelectedItems([
        { name: `Rangkaian Custom (${state.designReference.title})`, quantity: 1, price: 350000 }
      ]);
    } else if (state?.selectedProduct) {
      setSelectedItems([
        {
          name: state.selectedProduct.name,
          quantity: 1,
          price: state.selectedProduct.price,
          productId: state.selectedProduct.id,
          isPreOrder: state.selectedProduct.isPreOrder
        }
      ]);
    } else {
      // Default item
      setSelectedItems([
        { name: 'Bouquet Premium', quantity: 1, price: 150000 }
      ]);
    }
  }, [location.state]);

  const totalAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !accessToken) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }

    if (!deliveryDate) {
      toast.error('Tanggal pengiriman/pengambilan harus diisi');
      return;
    }

    if (!deliveryTime) {
      toast.error('Jam pengiriman/pengambilan harus diisi');
      return;
    }

    if (deliveryMethod === 'delivery' && !deliveryAddress.trim()) {
      toast.error('Alamat pengiriman harus diisi');
      return;
    }

    const deliveryDateObj = new Date(deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (deliveryDateObj < today) {
      toast.error('Tanggal pengiriman tidak boleh di masa lalu');
      return;
    }

    setLoading(true);
    try {
      const finalAddress = deliveryMethod === 'pickup' ? 'Ambil sendiri di toko' : deliveryAddress;
      // Catatan pelanggan (special_requests) hanya berisi permintaan khusus pelanggan.
      // Metode pengambilan tidak lagi disisipkan ke sini — sudah tercermin dari alamat pengiriman.
      const finalSpecialRequests = specialRequests.trim();

      // Gabungkan tanggal + jam menjadi satu nilai waktu (ISO) agar jam ikut tersimpan.
      const deliveryDateTime = `${deliveryDate}T${deliveryTime}:00`;

      const orderData = {
        shopId: shopId!,
        items: selectedItems,
        deliveryDate: deliveryDateTime,
        deliveryAddress: finalAddress,
        deliveryMethod,
        specialRequests: finalSpecialRequests,
        totalAmount,
        designReference: designReference ? {
          title: designReference.title,
          description: designReference.description,
          url: designReference.url
        } : null
      };

      const createdOrder = await createPreorder(orderData);

      toast.success('Pre-order berhasil dibuat!');
      navigate(`/payment/${createdOrder.id}`, {
        replace: true,
        state: {
          orderDetails: {
            items: selectedItems,
            deliveryDate,
            deliveryAddress,
            specialRequests,
            totalAmount,
            designReference
          }
        }
      });
    } catch (error: any) {
      console.error('Pre-order error:', error);

      // Handle specific error codes
      if (error?.code === 'PGRST204') {
        const missingColumn = error?.message?.match(/'([^']+)' column/)?.[1];
        toast.error(`Database error: Kolom "${missingColumn || 'unknown'}" tidak ditemukan.`);
        toast.error('Silakan jalankan SQL migration terbaru dari DOCUMENTATION.md');
        console.error('❌ PGRST204 Error:', error?.message);
        console.warn('📖 Lihat DOCUMENTATION.md section 3.3 untuk SQL migration lengkap');
        console.warn('⚡ Quick fix: Jalankan file FIX_COLUMN_NAME.sql di Supabase SQL Editor');

        if (missingColumn === 'special_requests') {
          console.warn('💡 Quick fix SQL:');
          console.warn('   ALTER TABLE preorders RENAME COLUMN special_request TO special_requests;');
        }
      } else if (error?.code === 'PGRST205') {
        toast.error('Database belum disetup. Silakan jalankan migrations di Supabase Dashboard.');
        console.warn('📖 Lihat DOCUMENTATION.md section 3 untuk setup database');
      } else {
        toast.error(error.message || 'Pre-order gagal. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

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

      {/* Form */}
      <div className="p-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center mb-8 mt-4">
            <div className="text-5xl mb-4">🌺</div>
            <h1 className="text-2xl font-bold mb-2">Pre-Order Bunga</h1>
            <p className="text-muted-foreground">Pesan bunga sesuai kebutuhan Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Design Reference */}
            {designReference && (
              <div>
                <h2 className="font-semibold mb-3 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Referensi Desain
                </h2>
                <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl p-4">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={designReference.url}
                        alt={designReference.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">{designReference.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{designReference.description}</p>
                      <p className="text-xs text-primary">
                        💡 Toko akan membuat rangkaian sesuai referensi ini
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div>
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Pesanan Anda
              </h2>
              <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
                {selectedItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                ))}
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex items-center justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">Rp {totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                Metode Pengambilan <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  disabled={loading}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-secondary/30'
                  }`}
                >
                  <Store className={`w-6 h-6 ${deliveryMethod === 'pickup' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`font-medium ${deliveryMethod === 'pickup' ? 'text-primary' : ''}`}>Ambil Sendiri</span>
                  <span className="text-xs text-muted-foreground">Pickup di toko</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  disabled={loading}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    deliveryMethod === 'delivery'
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-secondary/30'
                  }`}
                >
                  <Truck className={`w-6 h-6 ${deliveryMethod === 'delivery' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`font-medium ${deliveryMethod === 'delivery' ? 'text-primary' : ''}`}>Kirim</span>
                  <span className="text-xs text-muted-foreground">Diantar ke alamat</span>
                </button>
              </div>
            </div>

            {/* Delivery Date */}
            <div>
              <label htmlFor="deliveryDate" className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {deliveryMethod === 'pickup' ? 'Tanggal & Jam Pengambilan' : 'Tanggal & Jam Pengiriman'} <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="deliveryDate"
                  type="date"
                  min={minDate}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                  disabled={loading}
                />
                <input
                  id="deliveryTime"
                  type="time"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  aria-label={deliveryMethod === 'pickup' ? 'Jam Pengambilan' : 'Jam Pengiriman'}
                  className="sm:w-40 px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Minimal pemesanan 1 hari sebelumnya. Sertakan juga jam {deliveryMethod === 'pickup' ? 'pengambilan' : 'pengiriman'}.
              </p>
              <p className="text-xs mt-2 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
                🌿 {PICKUP_NOTE}
              </p>
            </div>

            {/* Delivery Address — only for delivery method */}
            {deliveryMethod === 'delivery' && (
              <div>
                <label htmlFor="deliveryAddress" className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Alamat Pengiriman <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="deliveryAddress"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Jl. Contoh No. 123, Kecamatan, Kota"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  disabled={loading}
                />
              </div>
            )}

            {/* Special Requests */}
            <div>
              <label htmlFor="specialRequests" className="block text-sm font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Permintaan Khusus (Opsional)
              </label>
              <textarea
                id="specialRequests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Contoh: Tolong tambahkan kartu ucapan dengan tulisan..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
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
                  Lanjut ke Pembayaran
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              ℹ️ Pre-order akan dikonfirmasi oleh toko dalam 24 jam. Anda akan menerima notifikasi setelah pesanan dikonfirmasi.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
