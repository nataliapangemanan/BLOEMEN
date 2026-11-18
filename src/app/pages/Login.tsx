import { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, LogIn, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Logo from '../components/Logo';
import { useGoBack } from '../lib/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const goBack = useGoBack('/');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trim whitespace and convert email to lowercase
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      toast.error('Email dan password harus diisi');
      return;
    }

    setLoading(true);
    try {
      await signIn(cleanEmail, cleanPassword);

      // Get user data from Supabase to check userType
      const { supabase } = await import('../lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();

      const userType = session?.user?.user_metadata?.userType;

      toast.success('Login berhasil!');

      // Redirect based on user type
      if (userType === 'seller') {
        navigate('/seller', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Better error messages
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Email atau password salah. Pastikan Anda sudah registrasi dan gunakan email/password yang benar.', {
          duration: 5000
        });
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('Email belum dikonfirmasi. Cek inbox email Anda atau matikan konfirmasi email di Supabase.', {
          duration: 5000
        });
      } else {
        toast.error(error.message || 'Login gagal');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
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

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size={96} />
            </div>
            <h1 className="text-2xl font-bold mb-2">Selamat Datang</h1>
            <p className="text-muted-foreground">Masuk ke akun Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                disabled={loading}
              />
            </div>

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
                  <LogIn className="w-5 h-5" />
                  Masuk
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Belum punya akun?{' '}
              <Link to="/register" className="text-primary font-medium">
                Daftar Sekarang
              </Link>
            </p>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">
                  Atau
                </span>
              </div>
            </div>

            <Link
              to="/shop-register"
              className="block text-sm text-primary font-medium"
            >
              Daftarkan Toko Bunga Anda →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}