import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, CreditCard, Wallet, Building2, Banknote, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { updatePaymentStatus } from '../lib/api';
import { useGoBack } from '../lib/navigation';

export default function Payment() {
  const { orderId } = useParams<{ orderId: string }>();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const goBack = useGoBack('/my-orders');
  const location = useLocation();

  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'bank_transfer' | 'e_wallet' | 'credit_card'>('bank_transfer');
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentInstructions, setPaymentInstructions] = useState<any>(null);
  const [orderAmount, setOrderAmount] = useState(150000);

  useEffect(() => {
    // Get order details from location state if available
    const state = location.state as any;
    if (state?.orderDetails) {
      setOrderAmount(state.orderDetails.totalAmount);
    }
  }, [location.state]);

  const paymentMethods = [
    {
      id: 'cash' as const,
      name: 'Tunai (Cash)',
      icon: <Banknote className="w-6 h-6" />,
      description: 'Bayar langsung saat barang diterima'
    },
    {
      id: 'bank_transfer' as const,
      name: 'Transfer Bank',
      icon: <Building2 className="w-6 h-6" />,
      description: 'BCA, Mandiri, BNI'
    },
    {
      id: 'e_wallet' as const,
      name: 'E-Wallet',
      icon: <Wallet className="w-6 h-6" />,
      description: 'GoPay, OVO, Dana'
    },
    {
      id: 'credit_card' as const,
      name: 'Kartu Kredit',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, Mastercard'
    }
  ];

  const handlePayment = async () => {
    if (!accessToken || !orderId) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Pembayaran tunai (cash) = bayar saat barang diterima → status belum lunas
      const paymentStatus = selectedMethod === 'cash' ? 'unpaid' : 'paid';

      // Update payment status + method in database
      // Jangan tampilkan "berhasil" bila DB gagal menyimpan
      await updatePaymentStatus(orderId, paymentStatus, selectedMethod);

      // Mock payment instructions based on method
      let instructions: any = {};

      if (selectedMethod === 'cash') {
        instructions = {
          instructions: 'Pembayaran tunai dilakukan langsung kepada penjual/kurir saat pesanan diterima (Cash on Delivery). Pastikan menyiapkan uang pas sesuai total pesanan.'
        };
      } else if (selectedMethod === 'bank_transfer') {
        instructions = {
          bank: 'Bank BCA',
          accountNumber: '1234567890',
          accountName: 'Bunga Kreativitas',
          instructions: 'Silakan transfer ke rekening di atas. Konfirmasi pembayaran akan dikirim setelah transfer diverifikasi (maks 1x24 jam).'
        };
      } else if (selectedMethod === 'e_wallet') {
        instructions = {
          provider: 'GoPay',
          number: '081234567890',
          instructions: 'Scan QR code atau transfer ke nomor di atas. Pembayaran akan otomatis terverifikasi.'
        };
      } else {
        instructions = {
          instructions: 'Pembayaran dengan kartu kredit akan diproses secara otomatis.'
        };
      }

      setPaymentInstructions(instructions);
      setPaymentSuccess(true);
      toast.success('Pembayaran berhasil dibuat!');
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Pembayaran gagal');
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess && paymentInstructions) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <motion.header
          className="px-4 py-4 border-b border-border bg-background"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <button
            onClick={() => navigate('/my-orders', { replace: true })}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Pesanan</span>
          </button>
        </motion.header>

        <div className="p-4 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Pembayaran Dibuat!</h1>
              <p className="text-muted-foreground">Silakan selesaikan pembayaran Anda</p>
            </div>

            {/* Payment Instructions */}
            <div className="bg-card border border-border rounded-2xl p-6 text-left space-y-4">
              <div>
                <h2 className="font-semibold mb-2">Instruksi Pembayaran</h2>
                {selectedMethod === 'cash' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Jumlah yang Dibayar Tunai</p>
                      <p className="font-bold text-2xl text-primary">Rp {orderAmount.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                )}

                {selectedMethod === 'bank_transfer' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-secondary/30 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Bank</p>
                      <p className="font-semibold">{paymentInstructions.bank}</p>
                    </div>
                    <div className="p-3 bg-secondary/30 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Nomor Rekening</p>
                      <p className="font-semibold font-mono text-lg">{paymentInstructions.accountNumber}</p>
                    </div>
                    <div className="p-3 bg-secondary/30 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Atas Nama</p>
                      <p className="font-semibold">{paymentInstructions.accountName}</p>
                    </div>
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Jumlah Transfer</p>
                      <p className="font-bold text-2xl text-primary">Rp {orderAmount.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                )}

                {selectedMethod === 'e_wallet' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-secondary/30 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Provider</p>
                      <p className="font-semibold">{paymentInstructions.provider}</p>
                    </div>
                    <div className="p-3 bg-secondary/30 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Nomor</p>
                      <p className="font-semibold font-mono text-lg">{paymentInstructions.number}</p>
                    </div>
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Jumlah Transfer</p>
                      <p className="font-bold text-2xl text-primary">Rp {orderAmount.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                )}

                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    ℹ️ {paymentInstructions.instructions}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/my-orders', { replace: true })}
              className="mt-6 w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium"
            >
              Lihat Pesanan Saya
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

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

      {/* Content */}
      <div className="p-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center mb-8 mt-4">
            <div className="text-5xl mb-4">💳</div>
            <h1 className="text-2xl font-bold mb-2">Pembayaran</h1>
            <p className="text-muted-foreground">Pilih metode pembayaran</p>
          </div>

          {/* Payment Amount */}
          <div className="mb-6 p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Pembayaran</p>
            <p className="text-4xl font-bold text-primary">Rp {orderAmount.toLocaleString('id-ID')}</p>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3 mb-6">
            <h2 className="font-semibold mb-3">Metode Pembayaran</h2>
            {paymentMethods.map((method) => (
              <motion.button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === method.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:bg-secondary/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    selectedMethod === method.id ? 'bg-primary/20' : 'bg-secondary/50'
                  }`}>
                    {method.icon}
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold">{method.name}</p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === method.id
                      ? 'border-primary'
                      : 'border-border'
                  }`}>
                    {selectedMethod === method.id && (
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Submit Button */}
          <motion.button
            onClick={handlePayment}
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
                Bayar Sekarang
              </>
            )}
          </motion.button>

          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              ⚠️ Selesaikan pembayaran dalam 24 jam untuk menghindari pembatalan otomatis.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
