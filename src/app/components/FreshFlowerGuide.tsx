import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, ChevronDown, Hourglass, Thermometer, Leaf } from 'lucide-react';
import {
  detectFlowers,
  estimateLifetime,
  formatLifetime,
  STORAGE_STEPS,
  PICKUP_NOTE,
} from '../lib/flowerCare';

interface FreshFlowerGuideProps {
  /** Nama + deskripsi produk, dipakai untuk mendeteksi jenis bunga. */
  text: string;
  /** Ketahanan yang diisi penjual (hari). Diprioritaskan bila ada. */
  sellerLifetimeDays?: number | null;
  /** Cara perawatan khusus dari penjual. */
  sellerCare?: string | null;
  /** Tampilan ringkas (untuk pre-order / chat). */
  compact?: boolean;
  /** Produk campuran: sebagian hidup, sebagian artifisial. */
  mixed?: boolean;
}

export function FreshFlowerGuide({ text, sellerLifetimeDays, sellerCare, compact, mixed }: FreshFlowerGuideProps) {
  const [open, setOpen] = useState(!compact);
  const life = estimateLifetime(text, sellerLifetimeDays);
  const flowers = detectFlowers(text);
  // Skala 0–21 hari untuk bar visual
  const pctMin = Math.min(100, (life.min / 21) * 100);
  const pctMax = Math.min(100, (life.max / 21) * 100);

  return (
    <div className="rounded-2xl border border-emerald-600/20 bg-emerald-50/60 dark:bg-emerald-950/20 overflow-hidden">
      {/* Ringkasan ketahanan */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Hourglass className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
            {mixed ? 'Bagian Bunga Hidup' : 'Bunga Hidup'} · Daya Tahan
          </p>
        </div>

        <div className="flex items-end justify-between gap-3 mb-2">
          <p className="text-3xl font-bold tracking-tight text-emerald-800 dark:text-emerald-300 tabular-nums">
            {formatLifetime(life)}
          </p>
          <p className="text-[11px] text-right text-muted-foreground leading-tight max-w-[55%]">
            {life.fromSeller ? 'Ditentukan oleh penjual' : 'Estimasi umum di vas, suhu ruang'}
          </p>
        </div>

        {/* bar umur */}
        <div className="relative h-2 rounded-full bg-emerald-900/10 dark:bg-emerald-200/10">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-emerald-600/80"
            style={{ width: `${pctMin}%` }}
          />
          {pctMax > pctMin && (
            <div
              className="absolute inset-y-0 rounded-full bg-emerald-600/30"
              style={{ left: `${pctMin}%`, width: `${pctMax - pctMin}%` }}
            />
          )}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1 tabular-nums">
          <span>Hari 0</span>
          <span>1 minggu</span>
          <span>2 minggu</span>
          <span>3 minggu</span>
        </div>

        {flowers.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {flowers.map((f) => (
              <span
                key={f.key}
                className="px-2 py-0.5 rounded-full text-[11px] bg-background/80 border border-emerald-600/20 text-emerald-900 dark:text-emerald-200"
              >
                {f.name}: {f.minDays}–{f.maxDays} hr
              </span>
            ))}
          </div>
        )}

        <p className="mt-3 text-xs text-emerald-900/80 dark:text-emerald-200/80 leading-relaxed">{PICKUP_NOTE}</p>
      </div>

      {/* Cara penyimpanan */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 border-t border-emerald-600/15 text-sm font-semibold text-emerald-900 dark:text-emerald-200"
      >
        <span className="flex items-center gap-2">
          <Droplets className="w-4 h-4" />
          Cara Penyimpanan
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {sellerCare && (
                <div className="p-3 rounded-xl bg-background/80 border border-emerald-600/20">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> Pesan dari penjual
                  </p>
                  <p className="text-sm whitespace-pre-line">{sellerCare}</p>
                </div>
              )}

              <ol className="space-y-2.5">
                {STORAGE_STEPS.map((s, i) => (
                  <li key={s.title} className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 tabular-nums">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{s.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {flowers.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {flowers.map((f) => (
                    <p key={f.key} className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{f.name}:</span> {f.tip}
                    </p>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
                <Thermometer className="w-3.5 h-3.5" />
                Suhu ideal 18–25°C · hindari matahari langsung &amp; hembusan AC
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
