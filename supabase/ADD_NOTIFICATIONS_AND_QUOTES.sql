-- ============================================
-- NOTIFICATIONS & CUSTOM ORDER QUOTES SYSTEM
-- ============================================
-- Real-time notifications between buyer & seller
-- Custom order quotes via chat
-- ============================================

-- 1. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'new_order',           -- Seller: pesanan baru masuk
    'order_status',        -- Buyer: status pesanan berubah
    'order_confirmed',     -- Buyer: pesanan dikonfirmasi
    'order_ready',         -- Buyer: pesanan siap kirim
    'order_delivered',     -- Seller: buyer konfirmasi terima
    'new_message',         -- Both: pesan chat baru
    'new_review',          -- Seller: review baru
    'quote_received',      -- Buyer: dapat penawaran harga
    'quote_accepted',      -- Seller: penawaran diterima
    'quote_rejected'       -- Seller: penawaran ditolak
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,               -- URL to navigate when clicked
  is_read BOOLEAN DEFAULT FALSE,

  -- Related entities
  order_id UUID REFERENCES preorders(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  quote_id UUID,           -- Will reference custom_order_quotes

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CUSTOM ORDER QUOTES TABLE
CREATE TABLE IF NOT EXISTS public.custom_order_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Quote details
  product_name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL CHECK (price >= 0),

  -- Design reference (from Pinterest/Unsplash)
  design_reference_url TEXT,
  design_reference_title TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),

  -- Timestamps
  expires_at TIMESTAMPTZ,   -- Quote validity
  responded_at TIMESTAMPTZ, -- When buyer responded
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INDEXES
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

CREATE INDEX idx_custom_order_quotes_conversation_id ON public.custom_order_quotes(conversation_id);
CREATE INDEX idx_custom_order_quotes_buyer_id ON public.custom_order_quotes(buyer_id);
CREATE INDEX idx_custom_order_quotes_seller_id ON public.custom_order_quotes(seller_id);
CREATE INDEX idx_custom_order_quotes_status ON public.custom_order_quotes(status);

-- 4. ROW LEVEL SECURITY
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_order_quotes ENABLE ROW LEVEL SECURITY;

-- Notifications: users can only see their own
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true); -- Notifications created by triggers

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Custom Order Quotes: buyer and seller can view
CREATE POLICY "Buyers and sellers can view quotes"
  ON public.custom_order_quotes FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Sellers can create quotes"
  ON public.custom_order_quotes FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Participants can update quotes"
  ON public.custom_order_quotes FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- 5. FUNCTIONS

-- Function: Create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_link TEXT DEFAULT NULL,
  p_order_id UUID DEFAULT NULL,
  p_shop_id UUID DEFAULT NULL,
  p_conversation_id UUID DEFAULT NULL,
  p_quote_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id, type, title, message, link,
    order_id, shop_id, conversation_id, quote_id
  ) VALUES (
    p_user_id, p_type, p_title, p_message, p_link,
    p_order_id, p_shop_id, p_conversation_id, p_quote_id
  )
  RETURNING id INTO notification_id;

  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update updated_at on custom_order_quotes
CREATE OR REPLACE FUNCTION update_custom_quote_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_custom_order_quotes_updated_at
  BEFORE UPDATE ON public.custom_order_quotes
  FOR EACH ROW EXECUTE FUNCTION update_custom_quote_updated_at();

-- 6. NOTIFICATION TRIGGERS

-- Trigger: New order notification to seller
CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS TRIGGER AS $$
DECLARE
  shop_owner_id UUID;
BEGIN
  -- Get shop owner
  SELECT user_id INTO shop_owner_id
  FROM public.shops
  WHERE id = NEW.shop_id;

  IF shop_owner_id IS NOT NULL THEN
    PERFORM create_notification(
      shop_owner_id,
      'new_order',
      '🛍️ Pesanan Baru!',
      'Anda mendapat pesanan baru dengan nomor ' || NEW.order_number,
      '/seller/orders',
      NEW.id,
      NEW.shop_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_new_order
  AFTER INSERT ON public.preorders
  FOR EACH ROW EXECUTE FUNCTION notify_new_order();

-- Trigger: Order status change notification to buyer
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
  notification_type TEXT;
  notification_title TEXT;
  notification_message TEXT;
BEGIN
  -- Only notify if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    CASE NEW.status
      WHEN 'confirmed' THEN
        notification_type := 'order_confirmed';
        notification_title := '✅ Pesanan Dikonfirmasi';
        notification_message := 'Pesanan ' || NEW.order_number || ' telah dikonfirmasi oleh toko';
      WHEN 'processing' THEN
        notification_type := 'order_status';
        notification_title := '⚙️ Pesanan Diproses';
        notification_message := 'Pesanan ' || NEW.order_number || ' sedang disiapkan';
      WHEN 'ready' THEN
        notification_type := 'order_ready';
        notification_title := '📦 Pesanan Siap Kirim';
        notification_message := 'Pesanan ' || NEW.order_number || ' siap dikirim. Konfirmasi jika sudah diterima!';
      WHEN 'delivered' THEN
        notification_type := 'order_delivered';
        notification_title := '🎉 Pesanan Selesai';
        notification_message := 'Pesanan ' || NEW.order_number || ' telah dikonfirmasi diterima';
      WHEN 'cancelled' THEN
        notification_type := 'order_status';
        notification_title := '❌ Pesanan Dibatalkan';
        notification_message := 'Pesanan ' || NEW.order_number || ' telah dibatalkan';
      ELSE
        RETURN NEW; -- Don't notify for other statuses
    END CASE;

    -- Notify buyer
    PERFORM create_notification(
      NEW.user_id,
      notification_type,
      notification_title,
      notification_message,
      '/my-orders',
      NEW.id,
      NEW.shop_id
    );

    -- If delivered, also notify seller
    IF NEW.status = 'delivered' THEN
      DECLARE
        shop_owner_id UUID;
      BEGIN
        SELECT user_id INTO shop_owner_id FROM public.shops WHERE id = NEW.shop_id;
        IF shop_owner_id IS NOT NULL THEN
          PERFORM create_notification(
            shop_owner_id,
            'order_delivered',
            '✅ Pesanan Dikonfirmasi Diterima',
            'Pembeli telah konfirmasi terima pesanan ' || NEW.order_number,
            '/seller/orders',
            NEW.id,
            NEW.shop_id
          );
        END IF;
      END;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_order_status_change
  AFTER UPDATE ON public.preorders
  FOR EACH ROW EXECUTE FUNCTION notify_order_status_change();

-- Trigger: New review notification to seller
CREATE OR REPLACE FUNCTION notify_new_review()
RETURNS TRIGGER AS $$
DECLARE
  shop_owner_id UUID;
BEGIN
  -- Get shop owner
  SELECT user_id INTO shop_owner_id
  FROM public.shops
  WHERE id = NEW.shop_id;

  IF shop_owner_id IS NOT NULL THEN
    PERFORM create_notification(
      shop_owner_id,
      'new_review',
      '⭐ Review Baru',
      'Anda mendapat review ' || NEW.rating || ' bintang',
      '/seller',
      NULL,
      NEW.shop_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_new_review
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION notify_new_review();

-- Trigger: Custom quote notifications
CREATE OR REPLACE FUNCTION notify_custom_quote_event()
RETURNS TRIGGER AS $$
BEGIN
  -- New quote created (notify buyer)
  IF TG_OP = 'INSERT' THEN
    PERFORM create_notification(
      NEW.buyer_id,
      'quote_received',
      '💰 Penawaran Harga Diterima',
      'Toko mengirim penawaran harga Rp ' || TO_CHAR(NEW.price, 'FM999,999,999'),
      '/chat/' || (SELECT shop_id FROM conversations WHERE id = NEW.conversation_id),
      NULL,
      NEW.shop_id,
      NEW.conversation_id,
      NEW.id
    );
  END IF;

  -- Quote accepted/rejected (notify seller)
  IF TG_OP = 'UPDATE' AND OLD.status = 'pending' AND NEW.status IN ('accepted', 'rejected') THEN
    DECLARE
      notif_title TEXT;
      notif_message TEXT;
      notif_type TEXT;
    BEGIN
      IF NEW.status = 'accepted' THEN
        notif_type := 'quote_accepted';
        notif_title := '✅ Penawaran Diterima';
        notif_message := 'Pembeli menerima penawaran Anda untuk ' || NEW.product_name;
      ELSE
        notif_type := 'quote_rejected';
        notif_title := '❌ Penawaran Ditolak';
        notif_message := 'Pembeli menolak penawaran untuk ' || NEW.product_name;
      END IF;

      PERFORM create_notification(
        NEW.seller_id,
        notif_type,
        notif_title,
        notif_message,
        '/messages',
        NULL,
        NEW.shop_id,
        NEW.conversation_id,
        NEW.id
      );
    END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_custom_quote_event
  AFTER INSERT OR UPDATE ON public.custom_order_quotes
  FOR EACH ROW EXECUTE FUNCTION notify_custom_quote_event();

-- 7. GRANT PERMISSIONS
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.custom_order_quotes TO authenticated;

-- ============================================
-- DONE!
-- ============================================

SELECT 'Notifications & Custom Order Quotes system created!' as status;
