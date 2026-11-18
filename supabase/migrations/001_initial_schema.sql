-- BUNGA KREATIVITAS DATABASE SCHEMA
-- Migration: Initial Schema
-- Description: Tables untuk aplikasi marketplace bunga

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLES
-- =============================================

-- 1. USERS TABLE (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('customer', 'seller')),
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SHOPS TABLE
CREATE TABLE public.shops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  opening_hours TEXT,
  image_url TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id) -- One shop per user
);

-- 3. PRODUCTS TABLE
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_available BOOLEAN DEFAULT true,
  is_pre_order BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PREORDERS TABLE
CREATE TABLE public.preorders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  delivery_date DATE NOT NULL,
  delivery_address TEXT NOT NULL,
  special_requests TEXT,
  total_amount DECIMAL(12, 2) NOT NULL CHECK (total_amount >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'ready', 'delivered', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  design_reference_url TEXT,
  design_reference_title TEXT,
  design_reference_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ORDER_ITEMS TABLE
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  preorder_id UUID NOT NULL REFERENCES public.preorders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price DECIMAL(12, 2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_user_type ON public.users(user_type);

-- Shops indexes
CREATE INDEX idx_shops_user_id ON public.shops(user_id);
CREATE INDEX idx_shops_is_active ON public.shops(is_active);
CREATE INDEX idx_shops_city ON public.shops(city);
CREATE INDEX idx_shops_location ON public.shops(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Products indexes
CREATE INDEX idx_products_shop_id ON public.products(shop_id);
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_products_is_available ON public.products(is_available);
CREATE INDEX idx_products_is_pre_order ON public.products(is_pre_order);
CREATE INDEX idx_products_category ON public.products(category);

-- Preorders indexes
CREATE INDEX idx_preorders_user_id ON public.preorders(user_id);
CREATE INDEX idx_preorders_shop_id ON public.preorders(shop_id);
CREATE INDEX idx_preorders_status ON public.preorders(status);
CREATE INDEX idx_preorders_payment_status ON public.preorders(payment_status);
CREATE INDEX idx_preorders_delivery_date ON public.preorders(delivery_date);

-- Order items indexes
CREATE INDEX idx_order_items_preorder_id ON public.order_items(preorder_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_order_number TEXT;
  counter INTEGER := 1;
BEGIN
  LOOP
    new_order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 4, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.preorders WHERE order_number = new_order_number);
    counter := counter + 1;
  END LOOP;
  RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger for users updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for shops updated_at
CREATE TRIGGER update_shops_updated_at
  BEFORE UPDATE ON public.shops
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for products updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for preorders updated_at
CREATE TRIGGER update_preorders_updated_at
  BEFORE UPDATE ON public.preorders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-generate order number
CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.preorders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_order_number();

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE public.users IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.shops IS 'Flower shop information';
COMMENT ON TABLE public.products IS 'Products (flowers) available in shops';
COMMENT ON TABLE public.preorders IS 'Customer pre-orders';
COMMENT ON TABLE public.order_items IS 'Items in each pre-order';
