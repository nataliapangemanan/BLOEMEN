import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ImagePlus, Loader2, Send, Check, Store } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../contexts/AuthContext';
import {
  uploadDesignReference,
  getMyDesignReferences,
  MAX_REFERENCE_MB,
  type UserDesignReference,
} from '../lib/designReferences';
import { formatRupiahInput, parseRupiah, digitsOnly } from '../lib/money';

export interface ReferencePayload {
  referenceId: string;
  url: string;
  title: string;
  note: string;
  budget: number | null;
}

interface SendReferenceToShopProps {
  shopId: string;
  shopName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Jika diisi (dipakai di ChatRoom), referensi langsung dikirim lewat callback ini
   * sebagai kartu referensi di chat. Jika tidak, chat toko dibuka lalu dikirim otomatis.
   */
  onSend?: (payload: ReferencePayload) => Promise<void>;
}

/**
 * Upload referensi desain langsung ke satu toko tujuan.
 * Alur: pilih foto (baru / dari "Referensi Saya") → judul & catatan → Kirim.
 * Foto disimpan ke tabel design_references lalu chat toko dibuka dan
 * foto otomatis terkirim sebagai pesan bergambar.
 */
export function SendReferenceToShop({ shopId, shopName, open, onOpenChange, onSend }: SendReferenceToShopProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [savedPick, setSavedPick] = useState<UserDesignReference | null>(null);
  const [myRefs, setMyRefs] = useState<UserDesignReference[]>([]);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [budget, setBudget] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open && user?.id) getMyDesignReferences(user.id).then(setMyRefs);
    if (!open) reset();
  }, [open, user?.id]);

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setSavedPick(null);
    setTitle('');
    setNote('');
    setBudget('');
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (inputRef.current) inputRef.current.value = '';
    if (!f) return;
    if (!f.type.startsWith('image/')) return toast.error('File harus berupa gambar');
    if (f.size > MAX_REFERENCE_MB * 1024 * 1024) return toast.error(`Ukuran maksimal ${MAX_REFERENCE_MB}MB`);
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setSavedPick(null);
  };

  const pickSaved = (r: UserDesignReference) => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setSavedPick(r);
    setTitle(r.title);
    setNote(r.description || '');
  };

  const shownImage = preview || savedPick?.image_url || null;

  const handleSend = async () => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }
    if (!file && !savedPick) return toast.error('Pilih foto referensi dulu');
    if (!title.trim()) return toast.error('Isi judul referensi');
    const budgetNum = budget ? parseRupiah(budget) : null;
    if (budgetNum != null && (isNaN(budgetNum) || budgetNum < 0)) return toast.error('Budget tidak valid');

    setSending(true);
    try {
      let ref = savedPick;
      if (file) {
        ref = await uploadDesignReference(file, user.id, {
          title: title || 'Referensi Saya',
          description: note,
        });
      }
      if (!ref) throw new Error('Referensi tidak tersedia');
      const payload: ReferencePayload = {
        referenceId: ref.id,
        url: ref.image_url,
        title: title.trim() || ref.title,
        note: note.trim(),
        budget: budgetNum,
      };
      console.log(`[BLOEMEN] Referensi dikirim langsung ke toko ${shopName} (ref: ${ref.id})`);

      if (onSend) {
        await onSend(payload);
        onOpenChange(false);
        return;
      }

      toast.success(`Mengirim referensi ke ${shopName}…`);
      onOpenChange(false);
      navigate(`/chat/${shopId}`, {
        state: {
          designReference: {
            id: ref.id,
            url: payload.url,
            title: payload.title,
            description: payload.note || 'Referensi unggahan pembeli',
            note: payload.note,
            budget: payload.budget,
            referenceId: ref.id,
            postAsMessage: true,
          },
        },
      });
    } catch (err: any) {
      console.error('Send reference error:', err);
      toast.error(err?.message || 'Gagal mengirim referensi');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !sending && onOpenChange(o)}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kirim Referensi Desain</DialogTitle>
          <DialogDescription className="flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5" /> Tujuan: <span className="font-semibold text-foreground">{shopName}</span>
          </DialogDescription>
        </DialogHeader>

        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPick} />

        <div className="space-y-4">
          {/* Area foto */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={sending}
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-dashed border-border bg-secondary/40 flex flex-col items-center justify-center gap-1.5 text-muted-foreground"
          >
            {shownImage ? (
              <>
                <ImageWithFallback src={shownImage} alt="Referensi" className="absolute inset-0 w-full h-full object-cover" />
                <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs">Ganti foto</span>
              </>
            ) : (
              <>
                <ImagePlus className="w-8 h-8" />
                <span className="text-sm font-medium">Ambil / pilih foto dari galeri</span>
                <span className="text-[11px]">JPG/PNG · maks. {MAX_REFERENCE_MB}MB</span>
              </>
            )}
          </button>

          {/* Pilih dari referensi tersimpan */}
          {myRefs.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Atau pilih dari Referensi Saya</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {myRefs.map((r) => {
                  const active = savedPick?.id === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => pickSaved(r)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ${active ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                    >
                      <ImageWithFallback src={r.image_url} alt={r.title} className="w-full h-full object-cover" />
                      {active && (
                        <span className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <label className="block text-sm font-medium -mb-2">
            Judul Referensi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul, mis. Buket mawar pink wisuda"
            className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Catatan untuk toko: warna, ukuran, budget, tanggal acara…"
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
          <div>
            <label className="block text-sm font-medium mb-2">Budget (Rp) <span className="text-muted-foreground font-normal">· opsional</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                value={formatRupiahInput(budget)}
                onChange={(e) => setBudget(digitsOnly(e.target.value))}
                placeholder="150.000"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 tabular-nums"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={sending || (!file && !savedPick) || !title.trim()}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {sending ? 'Mengunggah…' : `Kirim ke ${shopName}`}
          </button>
          <p className="text-[11px] text-center text-muted-foreground">
            Foto tersimpan di Referensi Saya dan muncul sebagai kartu referensi di chat — toko bisa langsung membalas dengan penawaran harga.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
