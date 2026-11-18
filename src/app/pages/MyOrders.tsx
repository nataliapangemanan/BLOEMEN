import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Package, Calendar, MapPin, CreditCard, Loader2, MessageCircle, Star, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { getMyOrders } from '../lib/api';
import { ReviewForm } from '../components/ReviewForm';
import { supabase } from '../lib/supabase';
import { useGoBack } from '../lib/navigation';

interface PreOrder {
  id: string;
  shopId: string;
  items: any[];
  deliveryDate: string;
  deliveryAddress: string;
  specialRequests: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  createdAt: string;
  hasReview: boolean;
  shop?: any;
}

export default function MyOrders() {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const goBack = useGoBack('/');
  const [orders, setOrders] = useState<PreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingOrder, setReviewingOrder] = useState<string | null>(null);
  const [confirmingOrder, setConfirmingOrder] = useState<string | null>(null);

  // Helper function to safely format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Tanggal tidak valid';
      }
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Tanggal tidak valid';
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Tanggal tidak valid';
      const datePart = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      const timePart = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      return `${datePart}, ${timePart}`;
    } catch (error) {
      return 'Tanggal tidak valid';
    }
  };

  useEffect(() => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      console.warn('[BLOEMEN] Akses /my-orders tanpa login -> redirect ke /login');
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const ordersData = await getMyOrders();

      // Convert snake_case to camelCase for frontend
      const formattedOrders = ordersData.map((order: any) => {
        // Parse totalAmount safely
        let totalAmount = 0;
        if (order.total_amount !== null && order.total_amount !== undefined) {
          const parsed = typeof order.total_amount === 'string'
            ? parseFloat(order.total_amount.replace(/,/g, ''))
            : parseFloat(order.total_amount);
          totalAmount = isNaN(parsed) ? 0 : parsed;
        }

        // Parse dates safely
        const deliveryDate = order.delivery_date || new Date().toISOString();
        const createdAt = order.created_at || new Date().toISOString();

        return {
          id: order.id,
          shopId: order.shop_id,
          items: (order.order_items || []).map((item: any) => {
            let itemPrice = 0;
            if (item.product_price !== null && item.product_price !== undefined) {
              const parsed = typeof item.product_price === 'string'
                ? parseFloat(item.product_price.replace(/,/g, ''))
                : parseFloat(item.product_price);
              itemPrice = isNaN(parsed) ? 0 : parsed;
            } else if (item.price !== null && item.price !== undefined) {
              const parsed = typeof item.price === 'string'
                ? parseFloat(item.price.replace(/,/g, ''))
                : parseFloat(item.price);
              itemPrice = isNaN(parsed) ? 0 : parsed;
            }

            return {
              productId: item.product_id || null,
              name: item.product_name || item.name || 'Produk',
              quantity: parseInt(item.quantity) || 1,
              price: itemPrice,
              subtotal: parseFloat(item.subtotal || 0)
            };
          }),
          deliveryDate: deliveryDate,
          deliveryAddress: order.delivery_address || 'Alamat tidak tersedia',
          specialRequests: (order.special_requests || '').replace(/\[Metode:[^\]]*\]\s*/gi, '').trim(),
          totalAmount: totalAmount,
          status: order.status || 'pending',
          paymentStatus: order.payment_status || 'unpaid',
          paymentMethod: order.payment_method || undefined,
          createdAt: createdAt,
          hasReview: order.has_review || false,
          shop: order.shops
        };
      });

      console.log('✅ Fetched orders:', formattedOrders.length);
      if (formattedOrders.length > 0) {
        console.log('📦 Sample order:', formattedOrders[0]);
      }

      setOrders(formattedOrders);
    } catch (error) {
      console.log('Error fetching orders:', error);
      // Silently set empty orders - this is expected in demo mode
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
      confirmed: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
      processing: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
      preparing: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
      ready: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
      delivered: 'bg-green-600/10 text-green-800 dark:text-green-500 border-green-600/20',
      cancelled: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      pending: 'Menunggu Konfirmasi',
      confirmed: 'Dikonfirmasi',
      processing: 'Sedang Diproses',
      preparing: 'Sedang Disiapkan',
      ready: 'Siap Dikirim',
      delivered: 'Terkirim',
      cancelled: 'Dibatalkan'
    };
    return texts[status] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    return status === 'paid' 
      ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
      : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
  };

  const getPaymentStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      unpaid: 'Belum Dibayar',
      paid: 'Sudah Dibayar',
      refunded: 'Dikembalikan'
    };
    return texts[status] || status;
  };

  const handleConfirmDelivered = async (orderId: string) => {
    setConfirmingOrder(orderId);
    try {
      const { error } = await supabase
        .from('preorders')
        .update({
          status: 'delivered',
          payment_status: 'paid',
          completed_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      toast.success('Pesanan dikonfirmasi selesai!');
      fetchOrders();
    } catch (error) {
      console.error('Error confirming delivery:', error);
      toast.error('Gagal mengkonfirmasi pesanan');
    } finally {
      setConfirmingOrder(null);
    }
  };

  const handleReviewSuccess = () => {
    setReviewingOrder(null);
    fetchOrders();
    toast.success('Review berhasil dikirim!');
  };

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
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Pesanan Saya</h1>
          <p className="text-muted-foreground">Riwayat pre-order bunga Anda</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Memuat pesanan...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-bold mb-2">Belum Ada Pesanan</h2>
            <p className="text-muted-foreground mb-6">Mulai pre-order bunga favorit Anda</p>
            <button
              onClick={() => navigate('/shops')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
            >
              Jelajahi Toko Bunga
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <div className="p-4">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-primary" />
                        <span className="font-mono text-sm text-muted-foreground">
                          #{order.id.slice(0, 8)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4 p-3 bg-secondary/30 rounded-xl">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between mb-2 last:mb-0">
                          <div>
                            <p className="font-medium text-sm">{item.name || 'Produk'}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity || 1}</p>
                          </div>
                          <p className="font-semibold text-sm">
                            Rp {(item.price || 0).toLocaleString('id-ID')}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        Detail item tidak tersedia
                      </p>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground">Pengiriman:</p>
                        <p className="font-medium">
                          {formatDateTime(order.deliveryDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground">Alamat:</p>
                        <p className="font-medium">{order.deliveryAddress}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <CreditCard className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Pembayaran:</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus === 'unpaid' && order.paymentMethod === 'cash'
                            ? 'Bayar di Tempat (COD)'
                            : getPaymentStatusText(order.paymentStatus)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-border pt-3 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-lg text-primary">
                        Rp {(order.totalAmount || 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    {order.paymentStatus === 'unpaid' && !order.paymentMethod &&
                      order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <button
                        onClick={() => navigate(`/payment/${order.id}`)}
                        className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium"
                      >
                        Bayar Sekarang
                      </button>
                    )}

                    {/* Confirm Delivered Button - show for 'ready' status */}
                    {order.status === 'ready' && (order.paymentStatus === 'paid' || order.paymentMethod === 'cash') && (
                      <button
                        onClick={() => handleConfirmDelivered(order.id)}
                        disabled={confirmingOrder === order.id}
                        className="w-full py-2.5 bg-green-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        {confirmingOrder === order.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Konfirmasi Pesanan Diterima
                      </button>
                    )}

                    {/* Review Button - show for delivered orders without review */}
                    {order.status === 'delivered' && !order.hasReview && (
                      <>
                        {reviewingOrder === order.id ? (
                          <div className="p-4 bg-secondary/30 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold">Beri Rating</h3>
                              <button
                                onClick={() => setReviewingOrder(null)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <ReviewForm
                              orderId={order.id}
                              shopId={order.shopId}
                              productId={order.items && order.items.length > 0 && order.items[0].productId ? order.items[0].productId : null}
                              productName={order.items && order.items.length > 0 ? order.items[0].name : undefined}
                              onSuccess={handleReviewSuccess}
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => setReviewingOrder(order.id)}
                            className="w-full py-2.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 dark:text-yellow-400 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-yellow-500/20 transition-colors"
                          >
                            <Star className="w-4 h-4" />
                            Beri Rating & Review
                          </button>
                        )}
                      </>
                    )}

                    {/* Already Reviewed */}
                    {order.status === 'delivered' && order.hasReview && (
                      <div className="w-full py-2.5 bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 rounded-xl font-medium flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Review Sudah Diberikan
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/chat/${order.shopId}`)}
                      className="w-full py-2.5 bg-secondary border border-border text-foreground rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-accent transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat dengan Toko
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}