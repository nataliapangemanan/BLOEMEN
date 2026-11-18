export function isNetworkError(error: unknown): boolean {
  if (!error) return false;
  const msg = (error as any)?.message || String(error);
  return /failed to fetch|networkerror|load failed|fetch error/i.test(msg);
}

export function describeError(error: unknown): string {
  if (isNetworkError(error)) {
    return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda atau coba lagi nanti.';
  }
  return (error as any)?.message || 'Terjadi kesalahan';
}
