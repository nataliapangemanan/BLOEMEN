 EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-generate order number
CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.preorders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_order_number();

-- Trigger to calculate discount price
CREATE TRIGGER calculate_product_discount
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION calculate_discount_price();

-- Trigger to update conversation on new message
CREATE TRIGGER update_conversation_on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_on_message();

-- Trigger to update shop rating
CREATE TRIGGER update_shop_rating_on_review
  AFTER INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_shop_rating();

-- ============================================
-- PART 6: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preorders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- USERS POLICIES
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- SHOPS POLICIES
CREATE POLICY "Anyone can read active shops"
  ON public.shops FOR SELECT
  USING (is_active = true);

CREATE POLICY "Sellers can read own shop"
  ON public.shops FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Sellers can create own shop"
  ON public.shops FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND user_type = 'seller'
    )
  );

CREATE POLICY "Sellers can update own shop"
  ON public.shops FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sellers can delete own shop"
  ON public.shops FOR DELETE
  USING (auth.uid() = user_id);

-- PRODUCTS POLICIES
CREATE POLICY "Anyone can read available products"
  ON public.products FOR SELECT
  USING (
    is_available = true
    AND EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = products.shop_id
      AND shops.is_active = true
    )
  );

CREATE POLICY "Sellers can read own products"
  ON public.products FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Sellers can create products"
  ON public.products FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = products.shop_id
      AND shops.user_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can update own products"
  ON public.products FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sellers can delete own products"
  ON public.products FOR DELETE
  USING (auth.uid() = user_id);

-- PREORDERS POLICIES
CREATE POLICY "Customers can read own orders"
  ON public.preorders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Sellers can read shop orders"
  ON public.preorders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = preorders.shop_id
      AND shops.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create orders"
  ON public.preorders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Customers can update own pending orders"
  ON public.preorders FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sellers can update shop order status"
  ON public.preorders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = preorders.shop_id
      AND shops.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = preorders.shop_id
      AND shops.user_id = auth.uid()
    )
  );

-- ORDER_ITEMS POLICIES
CREATE POLICY "Customers can read own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.preorders
      WHERE preorders.id = order_items.preorder_id
      AND preorders.user_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can read shop order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.preorders
      JOIN public.shops ON shops.id = preorders.shop_id
      WHERE preorders.id = order_items.preorder_id
      AND shops.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.preorders
      WHERE preorders.id = order_items.preorder_id
      AND preorders.user_id = auth.uid()
    )
  );

-- REVIEWS POLICIES
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

-- MESSAGES POLICIES
CREATE POLICY "Users can view their own messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = sender_id);

-- CONVERSATIONS POLICIES
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
-- PART 7: VIEWS
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
JOIN public.preorders o ON r.order_id = o.id
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
-- PART 8: GRANT PERMISSIONS
-- ============================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shops TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.preorders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
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
  RAISE NOTICE '✅ FULL MIGRATION COMPLETED!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '1. users';
  RAISE NOTICE '2. shops';
  RAISE NOTICE '3. products';
  RAISE NOTICE '4. preorders';
  RAISE NOTICE '5. order_items';
  RAISE NOTICE '6. reviews';
  RAISE NOTICE '7. messages';
  RAISE NOTICE '8. conversations';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Features enabled:';
  RAISE NOTICE '✅ User Management';
  RAISE NOTICE '✅ Shop Management';
  RAISE NOTICE '✅ Product Management';
  RAISE NOTICE '✅ Order Management';
  RAISE NOTICE '✅ Review System';
  RAISE NOTICE '✅ Messaging/Chat';
  RAISE NOTICE '✅ Product Discounts';
  RAISE NOTICE '✅ Flower Details (PO & Lifetime)';
  RAISE NOTICE '✅ Excel Export Ready';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Database is ready! 🎉';
  RAISE NOTICE '========================================';
END $$;
