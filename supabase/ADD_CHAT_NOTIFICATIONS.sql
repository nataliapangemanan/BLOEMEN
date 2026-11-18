-- ============================================
-- ADD CHAT MESSAGE NOTIFICATIONS
-- ============================================
-- Create notifications when new message sent
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

  -- Get receiver user_id (the other person in conversation)
  SELECT receiver_id INTO receiver_user_id FROM public.messages WHERE id = NEW.id;

  -- Get shop name for context
  SELECT name INTO shop_name FROM public.shops WHERE id = NEW.shop_id;

  -- Create notification for receiver
  IF receiver_user_id IS NOT NULL THEN
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

SELECT 'Chat message notifications enabled!' as status;
