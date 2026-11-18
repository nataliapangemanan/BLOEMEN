import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ShoppingCart, Search, Filter, Eye, CheckCircle, XCircle, Clock, Package, ArrowRight, Truck } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { toast } from "sonner";
import { getShopOrders, updateOrderStatus } from "../../lib/api";

// Membersihkan tag metode pengambilan yang dulu keliru disisipkan ke catatan
// pelanggan (mis. "[Metode: Ambil Sendiri]") agar catatan hanya menampilkan
// permintaan khusus asli dari pelanggan — juga untuk pesanan lama.
function stripDeliveryTag(notes?: string | null): string {
  if (!notes) return '';
  return notes.replace(/\[Metode:[^\]]*\]\s*/gi, '').trim();
}

// Format tanggal + jam. `long` untuk tampilan detail (nama bulan lengkap).
function formatDateTime(value?: string | null, long = false): string {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '-';
  const datePart = d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: long ? 'long' : 'short',
    year: 'numeric',
  });
  const timePart = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  return `${datePart}, ${timePart}`;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  flowerType: string;
  quantity: number;
  totalPrice: number;
  deliveryDate: string;
  deliveryAddress: string;
  status: 'pending' | 'confirmed' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  paymentMethod?: string;
  paymentStatus?: string;
}

export default function OrdersManagement() {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!user || user.userType !== 'seller') {
      navigate('/', { replace: true });
      return;
    }

    fetchOrders();
  }, [user, accessToken]);

  const fetchOrders = async () => {
    try {
      const ordersData = await getShopOrders();

      // Convert snake_case to camelCase for frontend
      const formattedOrders = ordersData.map((order: any) => ({
        id: order.id,
        orderNumber: order.order_number || `ORD-${order.id.slice(0, 8)}`,
        customerName: order.users?.name || 'Unknown',
        customerPhone: order.users?.phone || '-',
        flowerType: order.order_items?.[0]?.product_name || 'Mixed',
        quantity: order.order_items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 1,
        totalPrice: order.total_amount,
        deliveryDate: order.delivery_date,
        deliveryAddress: order.delivery_address,
        status: order.status,
        notes: stripDeliveryTag(order.special_requests),
        createdAt: order.created_at,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailDialog(true);
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    const statusFlow: Record<Order['status'], Order['status'] | null> = {
      'pending': 'confirmed',
      'confirmed': 'processing',
      'processing': 'ready',
      'ready': 'delivered',
      'delivered': null,
      'cancelled': null
    };
    return statusFlow[currentStatus];
  };

  const getNextStatusLabel = (currentStatus: Order['status']): string => {
    const labels: Record<Order['status'], string> = {
      'pending': 'Konfirmasi Pesanan',
      'confirmed': 'Mulai Proses',
      'processing': 'Siap Kirim',
      'ready': 'Tandai Terkirim',
      'delivered': '',
      'cancelled': ''
    };
    return labels[currentStatus] || '';
  };

  // Non-tunai wajib lunas sebelum diproses; tunai (COD) dibayar saat diterima
  const isPaymentReady = (order: Order) =>
    order.paymentStatus === 'paid' || order.paymentMethod === 'cash';

  const needsPaymentFor = (status: Order['status']) =>
    status === 'processing' || status === 'ready' || status === 'delivered';

  const handleAdvanceStatus = async (orderId: string, currentStatus: Order['status']) => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return;

    await handleUpdateStatus(orderId, nextStatus);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    const target = orders.find(o => o.id === orderId);
    if (target && needsPaymentFor(newStatus) && !isPaymentReady(target)) {
      toast.error('Pembeli belum menyelesaikan pembayaran');
      return;
    }
    try {
      await updateOrderStatus(orderId, newStatus);

      setOrders(orders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus, paymentStatus: newStatus === 'delivered' ? 'paid' : order.paymentStatus }
          : order
      ));

      toast.success('Status pesanan berhasil diperbarui');

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: newStatus,
          paymentStatus: newStatus === 'delivered' ? 'paid' : selectedOrder.paymentStatus
        });
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Gagal memperbarui status');
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { label: 'Menunggu', className: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' },
      confirmed: { label: 'Dikonfirmasi', className: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300' },
      processing: { label: 'Diproses', className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
      ready: { label: 'Siap Kirim', className: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
      delivered: { label: 'Terkirim', className: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' },
      cancelled: { label: 'Dibatalkan', className: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' }
    };

    const config = statusConfig[status];
    return <span className={`text-xs px-3 py-1 rounded-full font-medium ${config.className}`}>{config.label}</span>;
  };

  const getPaymentBadge = (order: Order) => {
    if (order.paymentStatus === 'paid') {
      return <span className="text-xs px-3 py-1 rounded-full font-medium bg-green-500/10 text-green-700 border-green-500/20">Sudah Dibayar</span>;
    }
    if (order.paymentStatus === 'refunded') {
      return <span className="text-xs px-3 py-1 rounded-full font-medium bg-secondary text-muted-foreground">Dikembalikan</span>;
    }
    if (order.paymentMethod === 'cash') {
      return <span className="text-xs px-3 py-1 rounded-full font-medium bg-amber-500/10 text-amber-700 border-amber-500/20">COD</span>;
    }
    return <span className="text-xs px-3 py-1 rounded-full font-medium bg-red-500/10 text-red-700 border-red-500/20">Belum Dibayar</span>;
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-orange-500" />;
      case 'confirmed': return <CheckCircle className="w-5 h-5 text-cyan-500" />;
      case 'processing': return <Package className="w-5 h-5 text-blue-500" />;
      case 'ready': return <CheckCircle className="w-5 h-5 text-purple-500" />;
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.flowerType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const ordersByStatus = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat pesanan...</p>
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
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              Kelola Pesanan
            </h1>
            <p className="text-muted-foreground">
              Pantau dan kelola semua pesanan pelanggan
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari pesanan, nama pelanggan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 rounded-2xl bg-white dark:bg-secondary/50"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[200px] py-6 rounded-2xl">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua ({ordersByStatus.all})</SelectItem>
              <SelectItem value="pending">Pending ({ordersByStatus.pending})</SelectItem>
              <SelectItem value="processing">Diproses ({ordersByStatus.processing})</SelectItem>
              <SelectItem value="ready">Siap Kirim ({ordersByStatus.ready})</SelectItem>
              <SelectItem value="delivered">Selesai ({ordersByStatus.delivered})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Pesanan', value: ordersByStatus.all, color: 'from-blue-500 to-cyan-500' },
          { label: 'Pending', value: ordersByStatus.pending, color: 'from-orange-500 to-amber-500' },
          { label: 'Diproses', value: ordersByStatus.processing, color: 'from-slate-500 to-slate-600' },
          { label: 'Selesai', value: ordersByStatus.delivered, color: 'from-green-500 to-emerald-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card className={`bg-gradient-to-br ${stat.color} text-white border-none shadow-lg`}>
              <CardContent className="p-4">
                <p className="text-sm opacity-90 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <ShoppingCart className="w-20 h-20 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Tidak Ada Pesanan</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Tidak ada pesanan yang cocok dengan pencarian' : 'Belum ada pesanan masuk'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Pelanggan</p>
                          <p className="font-semibold">{order.customerName}</p>
                          <p className="text-sm">{order.customerPhone}</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">Produk</p>
                          <p className="font-semibold">{order.flowerType}</p>
                          <p className="text-sm">Qty: {order.quantity}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 flex-wrap">
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-xl font-bold text-primary">
                            Rp {order.totalPrice.toLocaleString('id-ID')}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground">Pengiriman</p>
                          <p className="font-medium">
                            {formatDateTime(order.deliveryDate)}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {getStatusBadge(order.status)}
                          {getPaymentBadge(order)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-auto md:shrink-0">
                      <Button
                        onClick={() => handleViewDetail(order)}
                        variant="outline"
                        className="w-full md:w-[180px] rounded-xl"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Detail
                      </Button>

                      {/* Progressive Status Button */}
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (() => {
                        const next = getNextStatus(order.status);
                        const blocked = !!next && needsPaymentFor(next) && !isPaymentReady(order);
                        return (
                          <Button
                            onClick={() => handleAdvanceStatus(order.id, order.status)}
                            disabled={blocked}
                            className="w-full md:w-[180px] rounded-xl bg-primary hover:bg-primary/90"
                          >
                            <ArrowRight className="w-4 h-4 mr-2 shrink-0" />
                            <span className="truncate">
                              {blocked ? 'Menunggu Pembayaran' : getNextStatusLabel(order.status)}
                            </span>
                          </Button>
                        );
                      })()}

                      {/* Cancel Button - only for pending/confirmed */}
                      {(order.status === 'pending' || order.status === 'confirmed') && (
                        <Button
                          onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                          variant="destructive"
                          className="w-full md:w-[180px] rounded-xl"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Batalkan
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Pesanan</DialogTitle>
            <DialogDescription>
              Informasi lengkap pesanan dari pelanggan
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-muted-foreground">Nomor Pesanan</Label>
                  <p className="font-bold text-lg">{selectedOrder.orderNumber}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div className="mt-2">{getPaymentBadge(selectedOrder)}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Informasi Pelanggan</h4>
                <div className="space-y-2">
                  <div>
                    <Label className="text-muted-foreground">Nama</Label>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">No. Telepon</Label>
                    <p className="font-medium">{selectedOrder.customerPhone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Alamat Pengiriman</Label>
                    <p className="font-medium">{selectedOrder.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Detail Produk</h4>
                <div className="space-y-2">
                  <div>
                    <Label className="text-muted-foreground">Produk</Label>
                    <p className="font-medium">{selectedOrder.flowerType}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Jumlah</Label>
                      <p className="font-medium">{selectedOrder.quantity} pcs</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Total Harga</Label>
                      <p className="font-bold text-primary text-lg">
                        Rp {selectedOrder.totalPrice.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Tanggal &amp; Jam Pengiriman</Label>
                    <p className="font-medium">
                      {formatDateTime(selectedOrder.deliveryDate, true)}
                    </p>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="border-t pt-4">
                  <Label className="text-muted-foreground">Catatan Pelanggan</Label>
                  <p className="mt-2 p-3 bg-secondary/50 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}

              {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                <div className="border-t pt-4">
                  <Label className="mb-3 block">Update Status Pesanan</Label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => handleUpdateStatus(selectedOrder.id, value as Order['status'])}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Menunggu</SelectItem>
                      <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
                      <SelectItem value="processing">Diproses</SelectItem>
                      <SelectItem value="ready">Siap Kirim</SelectItem>
                      <SelectItem value="delivered">Terkirim</SelectItem>
                      <SelectItem value="cancelled">Batalkan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
