-- ============================================
-- ADD PRODUCT_ID TO REVIEWS TABLE
-- ============================================
-- This allows reviews to be linked to specific products
-- Reviews can be for products OR just for the shop in general
-- ============================================

-- Add product_id column (optional - null means shop review only)
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id) ON DELETE SET NULL;

-- Create index for product reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);

-- Update trigger to calculate shop rating from ALL reviews (product + shop)
-- This is already handled by existing trigger, no change needed

-- ============================================
-- DONE!
-- ============================================

SELECT 'Product ID added to reviews table!' as status;
