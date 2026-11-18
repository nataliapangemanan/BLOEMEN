import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { FileDown, TrendingUp, ShoppingBag, Users, Package, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { getShopOrders, getMyShop } from "../../lib/api";
import { exportOrdersToExcel } from "../../lib/excelExport";
import { describeError } from "../../lib/networkError";

type Order = any;

const fmtIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n || 0);

const todayISO = () => new Date().toISOString().slice(0, 10);
const daysAgoISO = (d: number) => {
  const t = new Date();
  t.setDate(t.getDate() - d);
  return t.toISOString().slice(0, 10);
};

export default function SalesReport() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(daysAgoISO(30));
  const [endDate, setEndDate] = useState(todayISO());
  const [preset, setPreset] = useState<"7d" | "30d" | "month" | "custom">("30d");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [s, o] = await Promise.all([getMyShop(), getShopOrders()]);
        setShop(s);
        setOrders(o || []);
      } catch (e) {
        setError(describeError(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const applyPreset = (p: typeof preset) => {
    setPreset(p);
    if (p === "7d") {
      setStartDate(daysAgoISO(7));
      setEndDate(todayISO());
    } else if (p === "30d") {
      setStartDate(daysAgoISO(30));
      setEndDate(todayISO());
    } else if (p === "month") {
      const d = new Date();
      const first = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
      setStartDate(first);
      setEndDate(todayISO());
    }
  };

  const filtered = useMemo(() => {
    const start = new Date(startDate + "T00:00:00").getTime();
    const end = new Date(endDate + "T23:59:59").getTime();
    return orders.filter((o) => {
      const t = new Date(o.created_at).getTime();
      if (isNaN(t) || t < start || t > end) return false;
      // Sertakan semua pesanan yang tidak dibatalkan agar rekap tidak kosong
      const s = (o.status || "").toLowerCase();
      return s !== "cancelled" && s !== "dibatalkan";
    });
  }, [orders, startDate, endDate]);

  const summary = useMemo(() => {
    const totalRevenue = filtered.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    const customers = new Set(filtered.map((o) => o.user_id)).size;
    const productMap = new Map<string, { name: string; qty: number; revenue: number }>();
    for (const o of filtered) {
      const items = o.order_items || [];
      for (const it of items) {
        const key = it.product_id || it.product_name || "unknown";
        const cur = productMap.get(key) || { name: it.product_name || "Produk", qty: 0, revenue: 0 };
        const qty = Number(it.quantity) || 0;
        const unitPrice = Number(it.product_price ?? it.price) || 0;
        const lineTotal = Number(it.subtotal) || unitPrice * qty;
        cur.qty += qty;
        cur.revenue += lineTotal;
        productMap.set(key, cur);
      }
    }
    const topProducts = [...productMap.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);
    return {
      totalOrders: filtered.length,
      totalRevenue,
      avgOrder: filtered.length ? totalRevenue / filtered.length : 0,
      customers,
      topProducts,
    };
  }, [filtered]);

  const [exporting, setExporting] = useState(false);

  const handleExportExcel = async () => {
    if (filtered.length === 0) {
      toast.error("Tidak ada transaksi pada periode ini untuk diunduh");
      return;
    }
    setExporting(true);
    try {
      // Ubah tiap pesanan ke format datar yang dibutuhkan exportOrdersToExcel
      const rows = filtered.map((o) => {
        const items = o.order_items || [];
        const qty = items.reduce((s: number, it: any) => s + (Number(it.quantity) || 0), 0) || 1;
        const total = Number(o.total_amount) || 0;
        const productNames = items.map((it: any) => it.product_name).filter(Boolean).join(", ") || "-";
        return {
          order_id: o.order_number || o.id,
          customer_name: o.users?.name || "Unknown",
          customer_email: o.users?.email || "-",
          product_name: productNames,
          quantity: qty,
          price: total / qty,
          total: total,
          status: o.status || "-",
          payment_method: o.payment_method || o.payment_status || "-",
          delivery_date: o.delivery_date || "",
          delivery_address: o.delivery_address || "-",
          special_requests: o.special_requests || "",
          created_at: o.created_at || new Date().toISOString(),
        };
      });

      const namePart = (shop?.name || "toko").replace(/\s+/g, "-").toLowerCase();
      const ok = await exportOrdersToExcel(rows as any, `laporan-penjualan_${namePart}_${startDate}_${endDate}`);
      if (ok) {
        toast.success("Laporan berhasil diunduh");
      } else {
        toast.error("Gagal mengunduh laporan");
      }
    } catch (e) {
      console.error("Export error:", e);
      toast.error("Gagal mengunduh laporan: " + describeError(e));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Rekap Hasil Penjualan</h1>
        <p className="text-sm text-muted-foreground">
          Pantau performa penjualan toko Anda dan unduh laporan dalam format Excel.
        </p>
      </motion.div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Filter Periode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {([
              ["7d", "7 Hari Terakhir"],
              ["30d", "30 Hari Terakhir"],
              ["month", "Bulan Ini"],
              ["custom", "Kustom"],
            ] as const).map(([k, label]) => (
              <Button
                key={k}
                variant={preset === k ? "default" : "outline"}
                size="sm"
                onClick={() => applyPreset(k)}
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Tanggal Mulai</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPreset("custom");
                }}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground">Tanggal Selesai</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPreset("custom");
                }}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleExportExcel} disabled={loading || !!error || exporting}>
                <FileDown className="w-4 h-4 mr-2" /> {exporting ? "Mengunduh..." : "Unduh Laporan"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <p className="text-center text-muted-foreground py-12">Memuat data penjualan...</p>
      )}

      {error && (
        <Card className="border-destructive/50 bg-destructive/5 mb-6">
          <CardContent className="py-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Gagal memuat data</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <SummaryCard icon={ShoppingBag} label="Total Pesanan" value={String(summary.totalOrders)} />
            <SummaryCard icon={TrendingUp} label="Total Pendapatan" value={fmtIDR(summary.totalRevenue)} />
            <SummaryCard icon={Package} label="Rata-rata/Pesanan" value={fmtIDR(summary.avgOrder)} />
            <SummaryCard icon={Users} label="Pelanggan Unik" value={String(summary.customers)} />
          </div>

          {summary.topProducts.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Produk Terlaris</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {summary.topProducts.map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                          {i + 1}
                        </div>
                        <span className="font-medium">{p.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{fmtIDR(p.revenue)}</p>
                        <p className="text-xs text-muted-foreground">{p.qty} pcs</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rincian Transaksi ({filtered.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filtered.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  Belum ada transaksi pada periode ini.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr className="text-left text-xs text-muted-foreground">
                        <th className="py-2 pr-3">Tanggal</th>
                        <th className="py-2 pr-3">ID</th>
                        <th className="py-2 pr-3">Pelanggan</th>
                        <th className="py-2 pr-3">Status</th>
                        <th className="py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((o) => (
                        <tr key={o.id} className="border-b border-border last:border-0">
                          <td className="py-2 pr-3">{new Date(o.created_at).toLocaleDateString("id-ID")}</td>
                          <td className="py-2 pr-3 font-mono text-xs">{String(o.id).slice(0, 8)}</td>
                          <td className="py-2 pr-3">{o.users?.name || "-"}</td>
                          <td className="py-2 pr-3">{o.status}</td>
                          <td className="py-2 text-right font-semibold">{fmtIDR(Number(o.total_amount) || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
          <Icon className="w-4 h-4" />
          {label}
        </div>
        <p className="font-bold text-lg">{value}</p>
      </CardContent>
    </Card>
  );
}
