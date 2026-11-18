-- =====================================================================
-- BLOEMEN — Fitur Upload Referensi Desain (pembeli)
-- Jalankan SEKALI di Supabase SQL Editor. Aman dijalankan ulang (idempotent).
--
-- Isi:
--  1. Tabel public.design_references  -> galeri referensi milik pembeli
--  2. Kolom messages.image_url        -> gambar bisa tampil di sela chat
--  3. Bucket storage "images" + policy upload folder references/
--  4. Realtime untuk tabel baru
-- =====================================================================

-- 1. TABEL REFERENSI DESAIN MILIK PEMBELI ------------------------------
CREATE TABLE IF NOT EXISTS public.design_references (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  title       TEXT NOT NULL DEFAULT 'Referensi Saya',
  description TEXT,
  source      TEXT NOT NULL DEFAULT 'upload' CHECK (source IN ('upload', 'wikimedia', 'product')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_design_references_user
  ON public.design_references(user_id, created_at DESC);

ALTER TABLE public.design_references ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Owner can view own references"   ON public.design_references;
DROP POLICY IF EXISTS "Owner can insert own references" ON public.design_references;
DROP POLICY IF EXISTS "Owner can update own references" ON public.design_references;
DROP POLICY IF EXISTS "Owner can delete own references" ON public.design_references;

CREATE POLICY "Owner can view own references"
  ON public.design_references FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Owner can insert own references"
  ON public.design_references FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner can update own references"
  ON public.design_references FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Owner can delete own references"
  ON public.design_references FOR DELETE
  USING (auth.uid() = user_id);

-- 2. GAMBAR DI DALAM PESAN CHAT ---------------------------------------
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 3. STORAGE BUCKET "images" (public read) -----------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read images bucket"         ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Owner delete images bucket"        ON storage.objects;

CREATE POLICY "Public read images bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated upload images bucket"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Owner delete images bucket"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'images' AND owner = auth.uid());

-- 4. REALTIME ----------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'design_references'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.design_references;
  END IF;
END $$;

-- Cek hasil:
-- SELECT * FROM public.design_references ORDER BY created_at DESC LIMIT 10;
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'image_url';

-- 5. KARTU REFERENSI DI CHAT (seperti kartu penawaran) -------------------
--    message_type: 'text' | 'image' | 'reference'
--    metadata    : { title, note, budget, reference_id }
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS message_type TEXT NOT NULL DEFAULT 'text';
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS metadata JSONB;
