import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Package, ShoppingCart, DollarSign, TrendingUp, Eye, Heart, Star, AlertCircle, Store } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { getMyProducts, getShopOrders, getMyShop } from "../../lib/api";

function formatOrderDate(value?: string | null): string {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '-';
  const datePart = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const timePart = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  return `${datePart}, ${timePart}`;
}

export default function SellerDashboard() {
  const { user, accessToken, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    views: 0,
    rating: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasShop, setHasShop] = useState(true);

  useEffect(() => {
    // Tunggu AuthContext selesai memulihkan sesi sebelum memutuskan redirect,
    // agar tidak terlempar ke halaman utama saat refresh halaman.
    if (authLoading) return;

    if (!user || user.userType !== 'seller') {
      navigate('/', { replace: true });
      return;
    }

    fetchDashboardData();
  }, [user, accessToken, authLoading]);

  const fetchDashboardData = async () => {
    try {
      // Check if seller has shop
      const shop = await getMyShop();
      setHasShop(!!shop);

      if (!shop) {
        console.warn('⚠️ Seller has not created shop yet');
        console.info('💡 To create a shop, navigate to: Profile → Daftarkan Toko Bunga');
        console.info('📖 Or go directly to: /shop-register');
        setLoading(false);
        return;
      }

      // Fetch products from Supabase API
      const products = await getMyProducts();

      setStats(prev => ({
        ...prev,
        totalProducts: products.length
      }));

      // Fetch orders for this shop
      const orders = await getShopOrders();

      const pendingCount = orders.filter((o: any) => o.status === 'pending').length;
      const completedOrders = orders.filter((o: any) => o.status === 'completed' || o.status === 'delivered');
      const totalRevenue = completedOrders.reduce((sum: number, o: any) => {
        return sum + (parseFloat(o.total_amount || 0));
      }, 0);

      setRecentOrders(orders.slice(0, 5));
      setStats(prev => ({
        ...prev,
        totalOrders: orders.length,
        pendingOrders: pendingCount,
        totalRevenue: totalRevenue
      }));
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      
      // Check for specific error codes
      if (error?.code === 'PGRST205' || error?.message?.includes('table')) {
        console.warn('⚠️ Database belum disetup. Silakan jalankan migrations di Supabase Dashboard.');
        console.warn('📖 Lihat dokumentasi di DOCUMENTATION.md section 3 untuk panduan lengkap.');
      } else if (error?.code === 'PGRST204' || error?.message?.includes('column')) {
        console.error('❌ Database column not found:', error?.message);
        console.warn('📖 Pastikan Anda menjalankan SQL migration terbaru dari DOCUMENTATION.md');
        console.warn('💡 Atau jalankan: ALTER TABLE shops RENAME COLUMN operating_hours TO opening_hours;');
      }
      
      // Set empty states on error (graceful degradation)
      setStats(prev => ({ ...prev, totalProducts: 0, totalOrders: 0, pendingOrders: 0, totalRevenue: 0 }));
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    // Empty data - seller needs to add their own products and receive orders
    setRecentOrders([]);
    setStats({
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      views: 0,
      rating: 0
    });
  };

  const statCards = [
    {
      title: "Total Produk",
      value: stats.totalProducts,
      icon: Package,
      color: "from-slate-500 to-slate-600",
      bgColor: "bg-violet-50 dark:bg-violet-950/20"
    },
    {
      title: "Total Pesanan",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "Total Pendapatan",
      value: `Rp ${stats.totalRevenue.toLocaleString('id-ID')}`,
      icon: DollarSign,
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20"
    },
    {
      title: "Pesanan Pending",
      value: stats.pendingOrders,
      icon: AlertCircle,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat dashboard...</p>
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
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
          Dashboard Penjual
        </h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, {user?.name}! 🌸
        </p>
      </motion.div>

      {/* Shop Not Created Alert */}
      {!hasShop && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-orange-500/50 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-500 rounded-full flex-shrink-0">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 text-orange-900 dark:text-orange-100">
                    Toko Belum Dibuat
                  </h3>
                  <p className="text-sm text-orange-800 dark:text-orange-200 mb-4">
                    Anda belum membuat toko. Silakan lengkapi informasi toko Anda terlebih dahulu untuk mulai berjualan.
                  </p>
                  <motion.button
                    onClick={() => navigate('/shop-register')}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold shadow-lg transition-all"
                    whileTap={{ scale: 0.95 }}
                  >
                    Buat Toko Sekarang →
                  </motion.button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={`${stat.bgColor} border-none shadow-lg hover:shadow-xl transition-all duration-300`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Pesanan Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada pesanan</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order: any, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">
                        {order.order_number || order.order_items?.[0]?.product_name || 'Pesanan'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Tanggal: {formatOrderDate(order.delivery_date || order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary mb-1">
                        Rp {Number(order.total_amount || 0).toLocaleString('id-ID')}
                      </p>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                        'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
      >
        <motion.button
          onClick={() => navigate('/seller/products')}
          className="p-6 rounded-2xl bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all"
          whileTap={{ scale: 0.95 }}
        >
          <Package className="w-8 h-8 mb-2 mx-auto" />
          <p className="font-semibold">Kelola Produk</p>
        </motion.button>

        <motion.button
          onClick={() => navigate('/seller/orders')}
          className="p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all"
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingCart className="w-8 h-8 mb-2 mx-auto" />
          <p className="font-semibold">Kelola Pesanan</p>
        </motion.button>

        <motion.button
          onClick={() => navigate('/seller/shop-settings')}
          className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-lg hover:shadow-xl transition-all"
          whileTap={{ scale: 0.95 }}
        >
          <TrendingUp className="w-8 h-8 mb-2 mx-auto" />
          <p className="font-semibold">Pengaturan Toko</p>
        </motion.button>

        <motion.button
          onClick={() => navigate('/seller/reviews')}
          className="p-6 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg hover:shadow-xl transition-all"
          whileTap={{ scale: 0.95 }}
        >
          <Star className="w-8 h-8 mb-2 mx-auto" />
          <p className="font-semibold">Ulasan</p>
        </motion.button>
      </motion.div>
    </div>
  );
}