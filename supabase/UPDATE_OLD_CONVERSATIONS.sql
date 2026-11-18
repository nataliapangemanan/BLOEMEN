-- ============================================
-- UPDATE OLD CONVERSATIONS WITH DESIGN REF
-- ============================================
-- Untuk conversation yang sudah ada sebelum update
-- Manual set design reference untuk testing
-- ============================================

-- GANTI VALUE INI SESUAI KEBUTUHAN:
-- 1. Cari conversation_id dari table conversations
-- 2. Set design_reference_url dengan URL gambar yang valid

-- Example: Update conversation tertentu
-- UPDATE public.conversations
-- SET
--   design_reference_url = 'https://images.unsplash.com/photo-example',
--   design_reference_title = 'Beautiful Flower Bouquet',
--   design_reference_description = 'Custom bouquet with roses and lilies'
-- WHERE id = 'YOUR_CONVERSATION_ID_HERE';

-- ============================================
-- ATAU UNTUK TESTING: Set sample design ref ke SEMUA conversations
-- ============================================

UPDATE public.conversations
SET
  design_reference_url = 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
  design_reference_title = 'Floral Design Sample',
  design_reference_description = 'Creative arrangement inspiration with mixed flowers'
WHERE design_reference_url IS NULL;

SELECT 'Old conversations updated with sample design reference!' as status;

-- ============================================
-- SETELAH RUN SQL INI:
-- ============================================
-- 1. Refresh browser (Ctrl+Shift+R)
-- 2. SELLER: Buka Messages → Klik conversation
-- 3. ✅ Banner design reference akan muncul!
-- 4. ✅ Tombol "Kirim Penawaran Harga" akan muncul!
