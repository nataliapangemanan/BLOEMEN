import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  hint?: string;
  aspect?: 'video' | 'square';
  disabled?: boolean;
  required?: boolean;
}

const BUCKET = 'images';

export function ImageUpload({
  value,
  onChange,
  folder = 'uploads',
  label = 'Gambar',
  hint,
  aspect = 'video',
  disabled,
  required,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      console.warn(`[BLOEMEN] Unggah ditolak: ukuran ${(file.size / 1024 / 1024).toFixed(1)} MB melebihi batas 5 MB`);
      setError('Ukuran maksimal 5MB');
      return;
    }
    setUploading(true);
    try {
      // Verify Supabase auth session exists — RLS policy requires `authenticated` role.
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        console.error('Upload blocked: no Supabase auth session. User must log in.');
        throw new Error('Sesi login tidak valid. Silakan logout dan login ulang sebelum upload.');
      }
      console.log('Upload sebagai user:', sessionData.session.user.id);

      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { cacheControl: '3600', upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e: any) {
      console.error('Upload error:', e);
      const msg = e?.message || '';
      if (msg.includes('Bucket not found')) {
        setError(`Bucket "${BUCKET}" belum dibuat di Supabase Storage`);
      } else if (msg.toLowerCase().includes('row-level security') || msg.toLowerCase().includes('rls')) {
        setError('Akses ditolak. Pastikan Anda sudah login, lalu coba lagi. Jika masih gagal, logout dan login ulang.');
      } else {
        setError(msg || 'Gagal mengupload gambar');
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const clear = () => {
    onChange('');
    setError(null);
  };

  const aspectCls = aspect === 'square' ? 'aspect-square' : 'aspect-video';

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onPick}
        disabled={disabled || uploading}
      />

      {value ? (
        <div className={`relative ${aspectCls} rounded-lg overflow-hidden bg-secondary group`}>
          <ImageWithFallback src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || uploading}
              className="px-3 py-1.5 rounded-md bg-white text-black text-sm hover:bg-gray-100"
            >
              Ganti
            </button>
            <button
              type="button"
              onClick={clear}
              disabled={disabled || uploading}
              className="px-3 py-1.5 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Hapus
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
          className={`w-full ${aspectCls} rounded-lg border-2 border-dashed border-border bg-secondary/30 hover:bg-secondary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground disabled:opacity-50`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm">Mengupload...</span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6" />
              <span className="text-sm">Klik untuk pilih gambar</span>
              <span className="text-xs">PNG, JPG · maks. 5MB</span>
            </>
          )}
        </button>
      )}

      {hint && !error && <p className="text-xs text-muted-foreground mt-2">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
}
