import { motion } from 'motion/react';
import { Check, X, Clock, ShoppingBag, Tag, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { format } from 'date-fns';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export interface Quote {
  id: string;
  product_name: string;
  description: string | null;
  price: number;
  design_reference_url: string | null;
  design_reference_title: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  seller_id: string;
  buyer_id: string;
  expires_at: string | null;
  responded_at?: string | null;
  updated_at?: string | null;
  created_at: string;
}

interface CustomOrderQuoteProps {
  quote: Quote;
  currentUserId: string;
  onStatusChange?: () => void;
}

const rupiah = (n: number) => `Rp ${Number(n).toLocaleString('id-ID')}`;

/**
 * Kartu penawaran harga yang tampil sebagai bubble di sela-sela chat
 * (dikirim oleh penjual → rata kanan untuk penjual, rata kiri untuk pembeli).
 */
export function CustomOrderQuote({ quote, currentUserId, onStatusChange }: CustomOrderQuoteProps) {
  const [updating, setUpdating] = useState(false);
  const isBuyer = currentUserId === quote.buyer_id;
  const isMine = currentUserId === quote.seller_id;

  const respond = async (status: 'accepted' | 'rejected') => {
    if (updating) return;
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('custom_order_quotes')
        .update({ status, responded_at: new Date().toISOString() })
        .eq('id', quote.id);
      if (error) throw error;
      if (status === 'accepted') {
        console.log(`[BLOEMEN] Penawaran diterima pembeli (id: ${quote.id}, status: accepted)`);
        toast.success('Deal! Penawaran diterima');
      } else {
        toast.success('Penawaran ditolak');
      }
      onStatusChange?.();
    } catch (error) {
      console.error('Error responding quote:', error);
      toast.error('Gagal memperbarui penawaran');
    } finally {
      setUpdating(false);
    }
  };

  const status = {
    pending: { label: 'Menunggu', cls: 'text-amber-700 bg-amber-500/15', icon: <Clock className="w-3 h-3" /> },
    accepted: { label: 'Deal', cls: 'text-emerald-700 bg-emerald-500/15', icon: <Check className="w-3 h-3" /> },
    rejected: { label: 'Ditolak', cls: 'text-red-600 bg-red-500/10', icon: <X className="w-3 h-3" /> },
    expired: { label: 'Kadaluarsa', cls: 'text-muted-foreground bg-secondary', icon: <Clock className="w-3 h-3" /> },
  }[quote.status];

  const faded = quote.status === 'rejected' || quote.status === 'expired';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`w-[82%] max-w-sm rounded-2xl border bg-background shadow-sm overflow-hidden ${
          isMine ? 'rounded-br-md' : 'rounded-bl-md'
        } ${faded ? 'opacity-60' : ''} ${quote.status === 'pending' ? 'border-primary/40' : 'border-border'}`}
      >
        <div className="flex items-center justify-between px-3 py-2 bg-primary/5 border-b border-border">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
            <Tag className="w-3.5 h-3.5" /> Penawaran Harga
          </span>
          <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${status.cls}`}>
            {status.icon}
            {status.label}
          </span>
        </div>

        <div className="p-3 flex gap-3">
          {quote.design_reference_url && (
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
              <ImageWithFallback
                src={quote.design_reference_url}
                alt={quote.design_reference_title || 'Referensi'}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-sm leading-snug ${faded ? 'line-through' : ''}`}>{quote.product_name}</p>
            {quote.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{quote.description}</p>
            )}
            <p className="text-lg font-bold text-primary mt-1 tabular-nums">{rupiah(quote.price)}</p>
          </div>
        </div>

        {isBuyer && quote.status === 'pending' && (
          <div className="grid grid-cols-2 gap-2 px-3 pb-3">
            <motion.button
              onClick={() => respond('rejected')}
              disabled={updating}
              whileTap={{ scale: 0.96 }}
              className="py-2 rounded-xl bg-secondary text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <X className="w-4 h-4" /> Tolak
            </motion.button>
            <motion.button
              onClick={() => respond('accepted')}
              disabled={updating}
              whileTap={{ scale: 0.96 }}
              className="py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" /> Terima
            </motion.button>
          </div>
        )}

        {isMine && quote.status === 'pending' && (
          <p className="px-3 pb-3 text-[11px] text-muted-foreground">Menunggu pembeli merespons…</p>
        )}

        <p className="px-3 pb-2 text-[10px] text-muted-foreground text-right tabular-nums">
          {format(new Date(quote.created_at), 'HH:mm')}
        </p>
      </div>
    </motion.div>
  );
}

interface QuoteDealEventProps {
  quote: Quote;
  isBuyer: boolean;
  orderPlaced: boolean;
  onOrder: () => void;
}

/** Event "Deal" yang muncul di sela chat tepat saat penawaran disetujui. */
export function QuoteDealEvent({ quote, isBuyer, orderPlaced, onOrder }: QuoteDealEventProps) {
  const at = quote.responded_at || quote.updated_at || quote.created_at;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center">
      <div className="w-[88%] max-w-sm rounded-2xl border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/30 p-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">Deal disepakati</p>
            <p className="text-xs text-emerald-900/70 dark:text-emerald-200/70 truncate">
              {quote.product_name} · <span className="font-semibold tabular-nums">{rupiah(quote.price)}</span>
            </p>
          </div>
          <span className="text-[10px] text-muted-foreground tabular-nums">{format(new Date(at), 'HH:mm')}</span>
        </div>
        {isBuyer && (
          orderPlaced ? (
            <p className="mt-2 text-xs text-emerald-800 dark:text-emerald-300">✓ Pesanan sudah dibuat. Cek di Pesanan Saya.</p>
          ) : (
            <motion.button
              onClick={onOrder}
              whileTap={{ scale: 0.97 }}
              className="mt-3 w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Pesan Sekarang
            </motion.button>
          )
        )}
        {!isBuyer && (
          <p className="mt-2 text-xs text-emerald-900/70 dark:text-emerald-200/70">Pembeli dapat langsung membuat pesanan dari penawaran ini.</p>
        )}
      </div>
    </motion.div>
  );
}

export interface ReferenceMeta {
  title?: string;
  note?: string;
  budget?: number | null;
  reference_id?: string;
}

interface ReferenceCardProps {
  imageUrl: string;
  meta: ReferenceMeta;
  createdAt: string;
  /** Kartu dikirim oleh user saat ini (rata kanan). */
  isMine: boolean;
  /** User saat ini penjual → tampilkan tombol "Buat Penawaran". */
  isSeller: boolean;
  /** Sudah ada penawaran untuk referensi ini. */
  quoted?: boolean;
  onMakeQuote?: () => void;
  onPreview?: () => void;
}

/**
 * Kartu referensi desain dari pembeli — tampil di sela chat dengan gaya
 * yang sama seperti kartu Penawaran Harga.
 */
export function ReferenceCard({ imageUrl, meta, createdAt, isMine, isSeller, quoted, onMakeQuote, onPreview }: ReferenceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`w-[78%] max-w-[300px] rounded-2xl border bg-background shadow-sm overflow-hidden ${
          isMine ? 'rounded-br-md' : 'rounded-bl-md'
        } ${quoted ? 'border-border' : 'border-primary/40'}`}
      >
        <div className="flex items-center justify-between px-3 py-2 bg-primary/5 border-b border-border">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
            <ImageIcon className="w-3.5 h-3.5" /> Referensi Desain
          </span>
          <span
            className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              quoted ? 'text-emerald-700 bg-emerald-500/15' : 'text-amber-700 bg-amber-500/15'
            }`}
          >
            {quoted ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {quoted ? 'Sudah ditawar' : 'Menunggu penawaran'}
          </span>
        </div>

        <button
          type="button"
          onClick={onPreview}
          className="block w-full aspect-[4/3] bg-secondary overflow-hidden"
          aria-label="Lihat gambar referensi"
        >
          <ImageWithFallback src={imageUrl} alt={meta.title || 'Referensi'} className="w-full h-full object-cover" />
        </button>
        <div className="p-3 space-y-1">
          <p className="font-semibold text-sm leading-snug">{meta.title || 'Referensi desain'}</p>
          {meta.note && <p className="text-xs text-muted-foreground line-clamp-3 whitespace-pre-line">{meta.note}</p>}
          {meta.budget != null && meta.budget > 0 && (
            <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t border-border">
              <span className="text-xs text-muted-foreground">Budget</span>
              <span className="text-sm font-bold text-primary tabular-nums">{rupiah(meta.budget)}</span>
            </div>
          )}
        </div>

        {isSeller && (
          <div className="px-3 pb-3">
            <motion.button
              onClick={onMakeQuote}
              whileTap={{ scale: 0.96 }}
              className={`w-full py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 ${
                quoted ? 'bg-secondary text-foreground' : 'bg-primary text-primary-foreground'
              }`}
            >
              <Tag className="w-4 h-4" />
              {quoted ? 'Kirim Penawaran Baru' : 'Buat Penawaran'}
            </motion.button>
          </div>
        )}
        {isMine && !quoted && (
          <p className="px-3 pb-3 text-[11px] text-muted-foreground">Menunggu toko mengirim penawaran harga…</p>
        )}

        <p className="px-3 pb-2 text-[10px] text-muted-foreground text-right tabular-nums">
          {format(new Date(createdAt), 'HH:mm')}
        </p>
      </div>
    </motion.div>
  );
}
