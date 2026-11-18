-- ============================================
-- FIX DUPLICATE ORDER NUMBER ERROR
-- ============================================
-- Race condition fix: Use trigger function instead
-- Add LOCK to prevent concurrent duplicate numbers
-- ============================================

-- Drop old function and trigger
DROP TRIGGER IF EXISTS set_order_number ON public.preorders;
DROP FUNCTION IF EXISTS generate_order_number();

-- Create new trigger function with proper locking
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  new_order_number TEXT;
  counter INTEGER;
  date_part TEXT;
BEGIN
  -- Only generate if order_number is NULL
  IF NEW.order_number IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Use advisory lock to prevent race conditions
  PERFORM pg_advisory_xact_lock(hashtext('order_number_generation'));

  -- Get current date part
  date_part := TO_CHAR(NOW(), 'YYYYMMDD');

  -- Find the highest counter for today
  SELECT COALESCE(MAX(
    CASE
      WHEN order_number LIKE 'ORD-' || date_part || '-%'
      THEN CAST(SUBSTRING(order_number FROM 'ORD-[0-9]{8}-([0-9]+)') AS INTEGER)
      ELSE 0
    END
  ), 0) + 1 INTO counter
  FROM public.preorders
  WHERE order_number LIKE 'ORD-' || date_part || '-%';

  -- Generate new order number
  new_order_number := 'ORD-' || date_part || '-' || LPAD(counter::TEXT, 4, '0');

  -- Set the order number
  NEW.order_number := new_order_number;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.preorders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_order_number();

-- ============================================
-- ALTERNATIVE: If above doesn't work, use sequence-based approach
-- ============================================

-- Uncomment below if you still get duplicates:

-- CREATE SEQUENCE IF NOT EXISTS order_number_seq;
--
-- CREATE OR REPLACE FUNCTION generate_order_number_seq()
-- RETURNS TRIGGER AS $$
-- DECLARE
--   seq_num INTEGER;
--   date_part TEXT;
-- BEGIN
--   IF NEW.order_number IS NOT NULL THEN
--     RETURN NEW;
--   END IF;
--
--   date_part := TO_CHAR(NOW(), 'YYYYMMDD');
--   seq_num := nextval('order_number_seq');
--
--   NEW.order_number := 'ORD-' || date_part || '-' || LPAD(seq_num::TEXT, 4, '0');
--
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- DROP TRIGGER IF EXISTS set_order_number ON public.preorders;
-- CREATE TRIGGER set_order_number
--   BEFORE INSERT ON public.preorders
--   FOR EACH ROW
--   WHEN (NEW.order_number IS NULL)
--   EXECUTE FUNCTION generate_order_number_seq();

-- ============================================
-- DONE!
-- ============================================

SELECT 'Order number generation fixed!' as status;
