import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Home, Package, ShoppingCart, Settings, Menu, X, LogOut, BarChart3, MessageCircle, FileText } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { NotificationBell } from "./NotificationBell";
import Logo from "./Logo";

export default function SellerLayout() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not logged in or not a seller
  useEffect(() => {
    if (!auth.loading && !auth.user) {
      console.warn(`[BLOEMEN] Akses ${location.pathname} tanpa login -> redirect ke /login`);
      navigate('/login');
    } else if (!auth.loading && auth.user && auth.user.userType !== 'seller') {
      console.warn(`[BLOEMEN] Akses ditolak: role ${auth.user.userType} membuka ${location.pathname} -> redirect ke /`);
      navigate('/');
    }
  }, [auth.loading, auth.user, navigate]);

  // Show loading state while auth is initializing
  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌺</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render (will redirect in useEffect)
  if (!auth.user) {
    return null;
  }

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/seller' },
    { icon: Package, label: 'Produk', path: '/seller/products' },
    { icon: ShoppingCart, label: 'Pesanan', path: '/seller/orders' },
    { icon: FileText, label: 'Rekap Penjualan', path: '/seller/sales-report' },
    { icon: MessageCircle, label: 'Chat', path: '/messages' },
    { icon: Settings, label: 'Pengaturan Toko', path: '/seller/shop-settings' }
  ];

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path: string) => {
    if (path === '/seller') {
      return location.pathname === '/seller';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <motion.header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div>
              <h1 className="font-bold text-lg">Seller Dashboard</h1>
              <p className="text-xs text-muted-foreground">{auth.user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell />
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              Ke Toko
            </button>
          </div>
        </div>
      </motion.header>

      {/* Sidebar - Desktop */}
      <motion.aside
        className={`fixed top-0 left-0 h-full w-72 bg-background border-r border-border z-40 lg:block ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-2">
              <Logo size={48} />
              <div>
                <h2 className="font-bold text-xl">Seller Panel</h2>
                <p className="text-xs text-muted-foreground">Bloemen</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                {auth.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{auth.user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{auth.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const active = isActive(item.path);
                return (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => {
                        navigate(item.path, { replace: true });
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        active
                          ? 'bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg'
                          : 'text-foreground hover:bg-accent'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-border space-y-2">
            <Button
              onClick={() => {
                navigate('/');
                setSidebarOpen(false);
              }}
              variant="outline"
              className="w-full justify-start"
            >
              <Home className="w-5 h-5 mr-3" />
              Kembali ke Toko
            </Button>

            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full justify-start"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Keluar
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <motion.div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-72 pt-20 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}