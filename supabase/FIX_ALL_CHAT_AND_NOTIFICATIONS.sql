-- ============================================
-- FIX ALL: CHAT, DESIGN REF, NOTIFICATIONS
-- ============================================
-- Run this ONCE to fix:
-- 1. Design reference not showing in seller
-- 2. Chat notifications for buyer & seller
-- ============================================

-- ============================================
-- PART 1: ADD DESIGN REFERENCE TO CONVERSATIONS
-- ============================================

ALTER TABLE public.conversations
ADD COLUMN IF NOT EXISTS design_reference_url TEXT,
ADD COLUMN IF NOT EXISTS design_reference_title TEXT,
ADD COLUMN IF NOT EXISTS design_reference_description TEXT;

CREATE INDEX IF NOT EXISTS idx_conversations_design_ref
ON public.conversations(design_reference_url)
WHERE design_reference_url IS NOT NULL;

-- ============================================
-- PART 2: CHAT MESSAGE NOTIFICATIONS
-- ============================================

-- Function: Notify new chat message
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
DECLARE
  sender_name TEXT;
  receiver_user_id UUID;
  shop_name TEXT;
BEGIN
  -- Get sender name
  SELECT name INTO sender_name FROM public.users WHERE id = NEW.sender_id;

  -- Receiver is already in the message record
  receiver_user_id := NEW.receiver_id;

  -- Get shop name for context
  SELECT name INTO shop_name FROM public.shops WHERE id = NEW.shop_id;

  -- Create notification for receiver
  IF receiver_user_id IS NOT NULL AND receiver_user_id != NEW.sender_id THEN
    PERFORM create_notification(
      receiver_user_id,
      'new_message',
      '💬 Pesan Baru dari ' || COALESCE(sender_name, 'Pengguna'),
      LEFT(NEW.message, 100),
      '/chat/' || NEW.shop_id,
      NULL,
      NEW.shop_id,
      NEW.conversation_id,
      NULL
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Fire on new message insert
DROP TRIGGER IF EXISTS trigger_notify_new_message ON public.messages;

CREATE TRIGGER trigger_notify_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION notify_new_message();

-- ============================================
-- DONE!
-- ============================================

SELECT 'All fixes applied successfully!' as status;
