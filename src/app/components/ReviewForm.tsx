import { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Loader2, Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface ReviewFormProps {
  orderId: string;
  shopId: string;
  productId?: string | null; // Optional - if reviewing specific product
  productName?: string; // To show what product is being reviewed
  onSuccess?: () => void;
}

export function ReviewForm({ orderId, shopId, productId, productName, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Pilih rating bintang terlebih dahulu');
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Anda harus login untuk memberikan review');
        return;
      }

      // Insert review (with optional product_id)
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          order_id: orderId,
          shop_id: shopId,
          user_id: user.id,
          product_id: productId || null,
          rating,
          comment: comment.trim() || null
        });

      if (reviewError) throw reviewError;

      // Update order has_review flag (use preorders table)
      const { error: orderError } = await supabase
        .from('preorders')
        .update({ has_review: true })
        .eq('id', orderId);

      if (orderError) throw orderError;

      toast.success('Review berhasil dikirim!');

      // Reset form
      setRating(0);
      setComment('');

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error submitting review:', error);

      if (error.code === '23505') {
        toast.error('Anda sudah memberikan review untuk pesanan ini');
      } else {
        toast.error('Gagal mengirim review. Coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-background border border-border rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <h3 className="font-bold text-lg">Berikan Review</h3>
        {productName && (
          <p className="text-sm text-muted-foreground mt-1">
            untuk produk: <span className="font-medium text-foreground">{productName}</span>
          </p>
        )}
      </div>

      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Rating <span className="text-destructive">*</span>
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              whileTap={{ scale: 0.9 }}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                }`}
              />
            </motion.button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {rating === 5 && '⭐ Excellent!'}
            {rating === 4 && '⭐ Sangat Baik'}
            {rating === 3 && '⭐ Baik'}
            {rating === 2 && '⭐ Cukup'}
            {rating === 1 && '⭐ Kurang'}
          </p>
        )}
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Komentar (Opsional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ceritakan pengalaman Anda dengan toko ini..."
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px] resize-none"
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {comment.length}/500 karakter
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Mengirim...
          </>
        ) : (
          <>Kirim Review</>
        )}
      </button>
    </motion.form>
  );
}
