-- ============================================
-- ADD DESIGN REFERENCE TO CONVERSATIONS
-- ============================================
-- Allows design reference to be stored in conversation
-- so both buyer and seller can see it
-- ============================================

-- Add design reference fields to conversations table
ALTER TABLE public.conversations
ADD COLUMN IF NOT EXISTS design_reference_url TEXT,
ADD COLUMN IF NOT EXISTS design_reference_title TEXT,
ADD COLUMN IF NOT EXISTS design_reference_description TEXT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_conversations_design_ref
ON public.conversations(design_reference_url)
WHERE design_reference_url IS NOT NULL;

-- ============================================
-- DONE!
-- ============================================

SELECT 'Design reference columns added to conversations!' as status;
