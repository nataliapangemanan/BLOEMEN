import { supabase } from './supabase';

/**
 * Referensi desain yang diunggah sendiri oleh pembeli.
 * Disimpan di tabel `public.design_references` (lihat supabase/ADD_UPLOAD_REFERENCE.sql)
 * dan file gambarnya di Supabase Storage bucket `images/references/{userId}/...`.
 */
export interface UserDesignReference {
  id: string;
  user_id: string;
  image_url: string;
  title: string;
  description: string | null;
  source: 'upload' | 'wikimedia' | 'product';
  created_at: string;
}

const BUCKET = 'images';
export const MAX_REFERENCE_MB = 5;

/** Unggah file gambar ke storage, kembalikan public URL. */
export async function uploadReferenceFile(file: File, userId: string): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('File harus berupa gambar');
  if (file.size > MAX_REFERENCE_MB * 1024 * 1024) {
    console.warn(`[BLOEMEN] Unggah referensi ditolak: ${(file.size / 1024 / 1024).toFixed(1)} MB > ${MAX_REFERENCE_MB} MB`);
    throw new Error(`Ukuran maksimal ${MAX_REFERENCE_MB}MB`);
  }
  const { data: sess } = await supabase.auth.getSession();
  if (!sess?.session) throw new Error('Sesi login tidak valid. Silakan login ulang.');

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `references/${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
  if (error) {
    const msg = error.message || '';
    if (msg.includes('Bucket not found')) throw new Error(`Bucket "${BUCKET}" belum dibuat. Jalankan ADD_UPLOAD_REFERENCE.sql`);
    if (msg.toLowerCase().includes('row-level security')) throw new Error('Akses upload ditolak (RLS storage). Jalankan ADD_UPLOAD_REFERENCE.sql');
    throw error;
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  console.log(`[BLOEMEN] Referensi diunggah ke storage: ${path}`);
  return data.publicUrl;
}

/** Simpan baris referensi ke database. */
export async function saveDesignReference(input: {
  userId: string;
  imageUrl: string;
  title?: string;
  description?: string;
  source?: UserDesignReference['source'];
}): Promise<UserDesignReference> {
  const { data, error } = await supabase
    .from('design_references')
    .insert({
      user_id: input.userId,
      image_url: input.imageUrl,
      title: input.title?.trim() || 'Referensi Saya',
      description: input.description?.trim() || null,
      source: input.source ?? 'upload',
    })
    .select()
    .single();
  if (error) {
    if (error.code === '42P01' || error.message?.includes('design_references')) {
      throw new Error('Tabel design_references belum ada. Jalankan ADD_UPLOAD_REFERENCE.sql');
    }
    throw error;
  }
  console.log(`[BLOEMEN] Referensi tersimpan di database (id: ${data.id})`);
  return data as UserDesignReference;
}

/** Unggah + simpan sekaligus. */
export async function uploadDesignReference(
  file: File,
  userId: string,
  meta: { title?: string; description?: string } = {},
): Promise<UserDesignReference> {
  const url = await uploadReferenceFile(file, userId);
  return saveDesignReference({ userId, imageUrl: url, ...meta, source: 'upload' });
}

export async function getMyDesignReferences(userId: string): Promise<UserDesignReference[]> {
  const { data, error } = await supabase
    .from('design_references')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('design_references belum tersedia:', error.message);
    return [];
  }
  return (data || []) as UserDesignReference[];
}

export async function deleteDesignReference(id: string): Promise<void> {
  const { error } = await supabase.from('design_references').delete().eq('id', id);
  if (error) throw error;
}
