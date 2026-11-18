/**
 * Input harga Rupiah.
 * Input type="number" membaca "150.000" sebagai 150 (titik = desimal),
 * sehingga 3 angka terakhir hilang. Maka harga diketik sebagai teks,
 * hanya digit yang diambil, lalu ditampilkan dengan pemisah ribuan.
 */
export const digitsOnly = (v: string) => (v || '').replace(/[^\d]/g, '');

/** "150000" → "150.000" untuk ditampilkan di input. */
export const formatRupiahInput = (v: string | number | null | undefined) => {
  const d = digitsOnly(String(v ?? ''));
  return d ? Number(d).toLocaleString('id-ID') : '';
};

/** "Rp 150.000" / "150.000" / "150000" → 150000 (NaN jika kosong). */
export const parseRupiah = (v: string | number | null | undefined) => {
  if (typeof v === 'number') return v;
  const d = digitsOnly(String(v ?? ''));
  return d ? Number(d) : NaN;
};
