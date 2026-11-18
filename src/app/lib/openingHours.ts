/**
 * Status Buka/Tutup toko dari string jam operasional.
 * Format dari OpeningHoursPicker: "Senin - Sabtu: 08:00 - 20:00".
 */
const DAY_INDEX: Record<string, number> = {
  minggu: 0, senin: 1, selasa: 2, rabu: 3, kamis: 4, jumat: 5, "jum'at": 5, sabtu: 6,
};

export type OpenStatus = { known: boolean; open: boolean; label: string };

export function getOpenStatus(hours?: string | null, now: Date = new Date()): OpenStatus {
  if (!hours) return { known: false, open: false, label: 'Jam belum diatur' };
  const m = hours.match(/([A-Za-z']+)\s*-\s*([A-Za-z']+)\s*:\s*(\d{1,2})[:.](\d{2})\s*-\s*(\d{1,2})[:.](\d{2})/);
  if (!m) return { known: false, open: false, label: hours };
  const [, d1, d2, h1, m1, h2, m2] = m;
  const s = DAY_INDEX[d1.toLowerCase()];
  const e = DAY_INDEX[d2.toLowerCase()];
  if (s == null || e == null) return { known: false, open: false, label: hours };

  const today = now.getDay();
  const dayOk = s <= e ? today >= s && today <= e : today >= s || today <= e;
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = +h1 * 60 + +m1;
  const close = +h2 * 60 + +m2;
  const timeOk = open <= close ? mins >= open && mins < close : mins >= open || mins < close;
  const isOpen = dayOk && timeOk;
  return {
    known: true,
    open: isOpen,
    label: isOpen ? `Buka · tutup ${h2.padStart(2, '0')}:${m2}` : `Tutup · buka ${h1.padStart(2, '0')}:${m1}`,
  };
}
