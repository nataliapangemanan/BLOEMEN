import { useCallback } from 'react';
import { useNavigate } from 'react-router';

/**
 * Tombol "Kembali" yang langsung kembali ke halaman sebelumnya.
 * - Jika ada riwayat di dalam aplikasi → mundur satu halaman.
 * - Jika halaman dibuka langsung (dari notifikasi / link / setelah refresh)
 *   → langsung ke halaman induk (fallback) tanpa menumpuk riwayat.
 *
 * Perubahan filter, tab bawah, dan alur form (pre-order → pembayaran)
 * memakai `replace`, sehingga riwayat tidak menumpuk dan tombol kembali
 * tidak perlu ditekan berkali-kali.
 */
export function useGoBack(fallback: string = '/') {
  const navigate = useNavigate();
  return useCallback(() => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate(fallback, { replace: true });
  }, [navigate, fallback]);
}
