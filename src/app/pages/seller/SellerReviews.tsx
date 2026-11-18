import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Loader2, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getMyShop } from '../../lib/api';
import { ReviewList } from '../../components/ReviewList';
import { useGoBack } from '../../lib/navigation';

export default function SellerReviews() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const goBack = useGoBack('/seller');
  const [shopId, setShopId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.userType !== 'seller') {
      navigate('/', { replace: true });
      return;
    }
    (async () => {
      try {
        const shop = await getMyShop();
        setShopId(shop?.id ?? null);
      } catch (err) {
        console.error('Gagal memuat toko:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <motion.header
        className="px-4 py-4 border-b border-border bg-background sticky top-0 z-40 flex items-center gap-3"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button
          onClick={() => goBack()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-orange-500" />
          <h1 className="font-semibold">Ulasan Toko</h1>
        </div>
      </motion.header>

      <div className="p-4 max-w-2xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : shopId ? (
          <ReviewList shopId={shopId} />
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p>Toko belum terdaftar. Silakan daftarkan toko terlebih dahulu.</p>
          </div>
        )}
      </div>
    </div>
  );
}
