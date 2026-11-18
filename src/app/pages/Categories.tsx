import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../lib/productCategories';
import { useGoBack } from '../lib/navigation';

export default function Categories() {
  const navigate = useNavigate();
  const goBack = useGoBack('/');

  return (
    <div className="min-h-screen bg-background pb-20">
      <motion.header
        className="sticky top-0 z-40 px-4 py-4 border-b border-border bg-background/95 backdrop-blur-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => goBack()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Semua Kategori</h1>
            <p className="text-xs text-muted-foreground">Pilih kategori bunga favorit Anda</p>
          </div>
        </div>
      </motion.header>

      <div className="p-4 grid grid-cols-2 gap-3">
        {PRODUCT_CATEGORIES.map((category, index) => (
          <motion.button
            key={category.id}
            onClick={() => navigate(`/products?category=${encodeURIComponent(category.id)}`)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-secondary/40 active:bg-secondary/60 text-left border border-border"
          >
            <div className="text-4xl">{category.emoji}</div>
            <div>
              <p className="font-semibold text-sm">{category.label}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
