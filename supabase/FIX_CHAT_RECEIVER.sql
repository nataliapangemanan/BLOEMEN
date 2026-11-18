-- ============================================
-- FIX CHAT: pembeli tidak menerima pesan dari penjual
-- Jalankan di Supabase → SQL Editor
-- ============================================

-- 1) Pulihkan pesan lama yang receiver_id-nya salah (penjual kirim ke dirinya sendiri)
UPDATE public.messages m
SET receiver_id = CASE WHEN c.user1_id = m.sender_id THEN c.user2_id ELSE c.user1_id END
FROM public.conversations c
WHERE m.conversation_id = c.id
  AND m.receiver_id = m.sender_id;

-- 2) RLS SELECT berbasis keanggotaan percakapan (juga berlaku untuk Realtime)
DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
CREATE POLICY "Users can view messages in their conversations"
  ON public.messages FOR SELECT
  USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id OR EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    )
  );

-- 3) Penerima boleh menandai pesan sebagai dibaca
DROP POLICY IF EXISTS "Receivers can mark messages as read" ON public.messages;
CREATE POLICY "Receivers can mark messages as read"
  ON public.messages FOR UPDATE
  USING (auth.uid() = receiver_id);

-- 4) Pastikan tabel masuk publikasi Realtime
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables
                 WHERE pubname = 'supabase_realtime' AND tablename = 'messages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables
                 WHERE pubname = 'supabase_realtime' AND tablename = 'custom_order_quotes') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.custom_order_quotes;
  END IF;
END $$;
