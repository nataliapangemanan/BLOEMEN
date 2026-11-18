-- BUNGA KREATIVITAS RLS POLICIES
-- Migration: Row Level Security Policies
-- Description: Security policies untuk semua tables

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preorders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USERS TABLE POLICIES
-- =============================================

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to insert their own profile (during signup)
CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =============================================
-- SHOPS TABLE POLICIES
-- =============================================

-- Anyone can read active shops (for browsing)
CREATE POLICY "Anyone can read active shops"
  ON public.shops
  FOR SELECT
  USING (is_active = true);

-- Sellers can read their own shop (even if not active)
CREATE POLICY "Sellers can read own shop"
  ON public.shops
  FOR SELECT
  USING (auth.uid() = user_id);

-- Sellers can insert their own shop
CREATE POLICY "Sellers can create own shop"
  ON public.shops
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND user_type = 'seller'
    )
  );

-- Sellers can update their own shop
CREATE POLICY "Sellers can update own shop"
  ON public.shops
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Sellers can delete their own shop
CREATE POLICY "Sellers can delete own shop"
  ON public.shops
  FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- PRODUCTS TABLE POLICIES
-- =============================================

-- Anyone can read available products
CREATE POLICY "Anyone can read available products"
  ON public.products
  FOR SELECT
  USING (
    is_available = true
    AND EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = products.shop_id
      AND shops.is_active = true
    )
  );

-- Sellers can read all their own products
CREATE POLICY "Sellers can read own products"
  ON public.products
  FOR SELECT
  USING (auth.uid() = user_id);

-- Sellers can insert products for their shop
CREATE POLICY "Sellers can create products"
  ON public.products
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = products.shop_id
      AND shops.user_id = auth.uid()
    )
  );

-- Sellers can update their own products
CREATE POLICY "Sellers can update own products"
  ON public.products
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Sellers can delete their own products
CREATE POLICY "Sellers can delete own products"
  ON public.products
  FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- PREORDERS TABLE POLICIES
-- =============================================

-- Customers can read their own orders
CREATE POLICY "Customers can read own orders"
  ON public.preorders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Sellers can read orders for their shop
CREATE POLICY "Sellers can read shop orders"
  ON public.preorders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = preorders.shop_id
      AND shops.user_id = auth.uid()
    )
  );

-- Customers can create orders
CREATE POLICY "Customers can create orders"
  ON public.preorders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Customers can update their own pending orders
CREATE POLICY "Customers can update own pending orders"
  ON public.preorders
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

-- Sellers can update order status for their shop
CREATE POLICY "Sellers can update shop order status"
  ON public.preorders
  FOR UPDATE
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

-- =============================================
-- ORDER_ITEMS TABLE POLICIES
-- =============================================

-- Customers can read items from their orders
CREATE POLICY "Customers can read own order items"
  ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.preorders
      WHERE preorders.id = order_items.preorder_id
      AND preorders.user_id = auth.uid()
    )
  );

-- Sellers can read items from orders in their shop
CREATE POLICY "Sellers can read shop order items"
  ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.preorders
      JOIN public.shops ON shops.id = preorders.shop_id
      WHERE preorders.id = order_items.preorder_id
      AND shops.user_id = auth.uid()
    )
  );

-- Customers can insert items when creating orders
CREATE POLICY "Customers can create order items"
  ON public.order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.preorders
      WHERE preorders.id = order_items.preorder_id
      AND preorders.user_id = auth.uid()
    )
  );

-- =============================================
-- ADDITIONAL SECURITY FUNCTIONS
-- =============================================

-- Function to check if user is seller
CREATE OR REPLACE FUNCTION is_seller()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND user_type = 'seller'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user owns shop
CREATE OR REPLACE FUNCTION owns_shop(shop_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.shops
    WHERE id = shop_uuid
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON POLICY "Anyone can read active shops" ON public.shops IS 'Public can browse active flower shops';
COMMENT ON POLICY "Sellers can read own shop" ON public.shops IS 'Sellers can view their own shop details';
COMMENT ON POLICY "Anyone can read available products" ON public.products IS 'Public can browse available products';
COMMENT ON POLICY "Customers can read own orders" ON public.preorders IS 'Customers can view their order history';
COMMENT ON POLICY "Sellers can read shop orders" ON public.preorders IS 'Sellers can view orders for their shop';
