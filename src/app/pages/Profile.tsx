import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, Mail, Store, ShoppingBag, LogOut, Settings, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useGoBack } from '../lib/navigation';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const goBack = useGoBack('/');

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logout berhasil');
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Logout gagal');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-5xl mb-4">🌺</div>
          <h2 className="text-xl font-bold mb-2">Belum Login</h2>
          <p className="text-muted-foreground mb-6">Silakan login terlebih dahulu</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
          >
            Login Sekarang
          </button>
        </motion.div>
      </div>
    );
  }

  const menuItems = [
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      label: 'Pesanan Saya',
      description: 'Lihat riwayat pre-order',
      onClick: () => navigate('/my-orders')
    },
    {
      icon: <Store className="w-5 h-5" />,
      label: 'Toko Bunga',
      description: 'Jelajahi toko terdekat',
      onClick: () => navigate('/shops')
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: 'Pengaturan',
      description: 'Kelola akun Anda',
      onClick: () => toast.info('Fitur pengaturan akan segera hadir')
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      label: 'Bantuan',
      description: 'FAQ dan dukungan',
      onClick: () => toast.info('Hubungi kami di support@bungakreativitas.com')
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <motion.header
        className="px-4 py-4 border-b border-border bg-background"
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

      {/* Profile Card */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-3xl p-6 mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{user.name || 'User'}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                {user.email}
              </div>
            </div>
          </div>

          {user.userType === 'seller' && (
            <div className="pt-4 border-t border-primary/20 space-y-2">
              <button
                onClick={() => navigate('/seller')}
                className="w-full py-3 bg-gradient-to-r from-primary to-purple-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg"
              >
                <Store className="w-5 h-5" />
                Dashboard Penjual
              </button>
              <button
                onClick={() => navigate('/shop-register')}
                className="w-full py-3 bg-primary/10 text-primary border border-primary/20 rounded-xl font-medium flex items-center justify-center gap-2"
              >
                <Store className="w-5 h-5" />
                Daftarkan Toko Bunga
              </button>
            </div>
          )}
        </motion.div>

        {/* Menu Items */}
        <div className="space-y-3 mb-6">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              onClick={item.onClick}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 bg-card border border-border rounded-2xl flex items-center gap-4 hover:bg-secondary/30 transition-colors"
            >
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                {item.icon}
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary mb-1">0</p>
            <p className="text-xs text-muted-foreground">Pesanan</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary mb-1">0</p>
            <p className="text-xs text-muted-foreground">Favorit</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary mb-1">0</p>
            <p className="text-xs text-muted-foreground">Review</p>
          </div>
        </motion.div>

        {/* Sign Out Button */}
        <motion.button
          onClick={handleSignOut}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Keluar
        </motion.button>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          <p>Bunga Kreativitas v1.0.0</p>
          <p className="mt-1">Marketplace Kreativitas Bunga</p>
        </motion.div>
      </div>
    </div>
  );
}
