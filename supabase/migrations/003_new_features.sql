-- ============================================
-- Migration 003: New Features
-- ============================================
-- Features:
-- 1. Review System
-- 2. Messaging/Chat
-- 3. Product Discounts
-- 4. Product Details (PO duration, flower lifetime)
-- ============================================

-- 1. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[], -- Array of image URLs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(order_id) -- One review per order
);

CREATE INDEX idx_reviews_shop_id ON public.reviews(shop_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);

-- 2. MESSAGES TABLE (Chat/Messaging)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- 3. CONVERSATIONS TABLE (untuk grouping messages)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  unread_count_user1 INTEGER DEFAULT 0,
  unread_count_user2 INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user1_id, user2_id, shop_id)
);

CREATE INDEX idx_conversations_user1_id ON public.conversations(user1_id);
CREATE INDEX idx_conversations_user2_id ON public.conversations(user2_id);
CREATE INDEX idx_conversations_shop_id ON public.conversations(shop_id);

-- 4. Add discount columns to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
ADD COLUMN IF NOT EXISTS discount_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS discount_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS discount_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_on_discount BOOLEAN DEFAULT FALSE;

-- 5. Add flower details to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS flower_type TEXT CHECK (flower_type IN ('live', 'artificial', 'mixed')),
ADD COLUMN IF NOT EXISTS po_duration_days INTEGER, -- Pre-order duration in days
ADD COLUMN IF NOT EXISTS flower_lifetime_days INTEGER, -- How long live flower lasts
ADD COLUMN IF NOT EXISTS care_instructions TEXT;

-- 6. Update orders table to track review status
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS has_review BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Calculate discount price
CREATE OR REPLACE FUNCTION calculate_discount_price()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_on_discount AND NEW.discount_percentage > 0 THEN
    NEW.discount_price = NEW.price * (1 - NEW.discount_percentage / 100.0);
  ELSE
    NEW.discount_price = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_product_discount
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION calculate_discount_price();

-- Function: Update conversation on new message
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET
    last_message = NEW.message,
    last_message_at = NEW.created_at,
    unread_count_user1 = CASE
      WHEN user1_id = NEW.receiver_id THEN unread_count_user1 + 1
      ELSE unread_count_user1
    END,
    unread_count_user2 = CASE
      WHEN user2_id = NEW.receiver_id THEN unread_count_user2 + 1
      ELSE unread_count_user2
    END
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_on_message();

-- Function: Auto-calculate average rating for shop
CREATE OR REPLACE FUNCTION update_shop_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate average rating for the shop
  UPDATE public.shops
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM public.reviews
    WHERE shop_id = NEW.shop_id
  )
  WHERE id = NEW.shop_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add rating column to shops if not exists
ALTER TABLE public.shops
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

CREATE TRIGGER update_shop_rating_on_review
  AFTER INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_shop_rating();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Reviews Policies
CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews for their own orders"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Messages Policies
CREATE POLICY "Users can view their own messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = sender_id);

-- Conversations Policies
CREATE POLICY "Users can view their own conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update their conversations"
  ON public.conversations FOR UPDATE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_discount ON public.products(is_on_discount, discount_end_date)
  WHERE is_on_discount = TRUE;

CREATE INDEX IF NOT EXISTS idx_products_flower_type ON public.products(flower_type);

CREATE INDEX IF NOT EXISTS idx_orders_has_review ON public.orders(has_review, status);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample reviews (uncomment to use)
/*
INSERT INTO public.reviews (order_id, shop_id, user_id, rating, comment)
SELECT
  o.id,
  o.shop_id,
  o.user_id,
  4 + (random() * 1)::int, -- Random rating 4-5
  'Great service and beautiful flowers!'
FROM public.orders o
WHERE o.status = 'completed'
LIMIT 5;
*/

-- ============================================
-- VIEWS FOR EASY QUERYING
-- ============================================

-- View: Shop reviews with user details
CREATE OR REPLACE VIEW shop_reviews_view AS
SELECT
  r.id,
  r.shop_id,
  r.rating,
  r.comment,
  r.images,
  r.created_at,
  u.name as user_name,
  u.email as user_email,
  o.id as order_id
FROM public.reviews r
JOIN public.users u ON r.user_id = u.id
JOIN public.orders o ON r.order_id = o.id
ORDER BY r.created_at DESC;

-- View: Products with active discounts
CREATE OR REPLACE VIEW products_on_sale AS
SELECT
  p.*,
  s.name as shop_name,
  (p.price - p.discount_price) as savings_amount
FROM public.products p
JOIN public.shops s ON p.shop_id = s.id
WHERE p.is_on_discount = TRUE
  AND (p.discount_end_date IS NULL OR p.discount_end_date > NOW())
ORDER BY p.discount_percentage DESC;

-- View: Conversation list with details
CREATE OR REPLACE VIEW conversations_with_details AS
SELECT
  c.id,
  c.user1_id,
  c.user2_id,
  c.shop_id,
  c.last_message,
  c.last_message_at,
  c.unread_count_user1,
  c.unread_count_user2,
  u1.name as user1_name,
  u2.name as user2_name,
  s.name as shop_name
FROM public.conversations c
JOIN public.users u1 ON c.user1_id = u1.id
JOIN public.users u2 ON c.user2_id = u2.id
LEFT JOIN public.shops s ON c.shop_id = s.id
ORDER BY c.last_message_at DESC;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.conversations TO authenticated;

GRANT SELECT ON shop_reviews_view TO authenticated;
GRANT SELECT ON products_on_sale TO authenticated;
GRANT SELECT ON conversations_with_details TO authenticated;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Migration 003 completed successfully!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'New features added:';
  RAISE NOTICE '1. ✅ Review System';
  RAISE NOTICE '2. ✅ Messaging/Chat';
  RAISE NOTICE '3. ✅ Product Discounts';
  RAISE NOTICE '4. ✅ Flower Details (PO & Lifetime)';
  RAISE NOTICE '========================================';
END $$;
