-- =====================================================================
-- FIX_PAYMENT_STATUS.sql — Bloemen
-- Bug: pesanan sudah dibayar & terkirim tapi masih "Belum Dibayar".
-- Penyebab: policy UPDATE pembeli hanya berlaku saat status = 'pending',
-- sehingga update payment_status setelah penjual konfirmasi ditolak RLS.
-- Jalankan sekali di Supabase SQL Editor.
-- =====================================================================

-- 0) Kolom metode pembayaran (sebelumnya tidak ada → update dari app gagal)
ALTER TABLE public.preorders ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- 1) Fungsi aman untuk pembeli membayar pesanannya sendiri (status apa pun
--    selain cancelled/delivered), tanpa melonggarkan RLS untuk kolom lain.
CREATE OR REPLACE FUNCTION public.pay_order(p_order_id UUID, p_method TEXT)
RETURNS public.preorders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.preorders;
BEGIN
  SELECT * INTO v_order FROM public.preorders
  WHERE id = p_order_id AND user_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pesanan tidak ditemukan';
  END IF;
  IF v_order.status = 'cancelled' THEN
    RAISE EXCEPTION 'Pesanan sudah dibatalkan';
  END IF;

  UPDATE public.preorders
  SET payment_method = p_method,
      -- Tunai (COD) dibayar saat barang diterima
      payment_status = CASE WHEN p_method = 'cash' THEN payment_status ELSE 'paid' END,
      updated_at = NOW()
  WHERE id = p_order_id
  RETURNING * INTO v_order;

  RETURN v_order;
END;
$$;

GRANT EXECUTE ON FUNCTION public.pay_order(UUID, TEXT) TO authenticated;

-- 2) Pembeli tetap boleh konfirmasi "pesanan diterima" saat status 'ready'.
DROP POLICY IF EXISTS "Customers can confirm received orders" ON public.preorders;
CREATE POLICY "Customers can confirm received orders"
  ON public.preorders FOR UPDATE
  USING (auth.uid() = user_id AND status = 'ready')
  WITH CHECK (auth.uid() = user_id);

-- 3) Trigger: pesanan yang selesai (delivered) otomatis lunas.
--    (COD dibayar saat diterima; non-tunai sudah dibayar sebelumnya.)
CREATE OR REPLACE FUNCTION public.mark_paid_on_delivered()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'delivered' AND NEW.payment_status = 'unpaid' THEN
    NEW.payment_status := 'paid';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_mark_paid_on_delivered ON public.preorders;
CREATE TRIGGER trg_mark_paid_on_delivered
  BEFORE UPDATE ON public.preorders
  FOR EACH ROW EXECUTE FUNCTION public.mark_paid_on_delivered();

-- 4) Pulihkan data lama: pesanan yang sudah terkirim → Sudah Dibayar
UPDATE public.preorders
SET payment_status = 'paid'
WHERE status = 'delivered' AND payment_status = 'unpaid';

-- 5) Pulihkan data lama: metode non-tunai sudah tercatat tapi masih unpaid
UPDATE public.preorders
SET payment_status = 'paid'
WHERE payment_method IS NOT NULL
  AND payment_method <> 'cash'
  AND payment_status = 'unpaid'
  AND status <> 'cancelled';
