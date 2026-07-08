import type { Order } from "../../types/order";

export type RangeKey = "7d" | "30d";

interface TrafficPoint {
  label: string;
  value: number;
}

export interface MarketplaceSummaryItem {
  name: string;
  icon: string;
  count: number;
  accent: string;
}

export interface StoreSummaryItem {
  name: string;
  count: number;
  region: string;
}

export interface RevenueSummaryItem {
  label: string;
  amount: number;
  hint: string;
}

export interface WarehouseActivityItem {
  label: string;
  count: number;
  icon: string;
  accent: string;
}

export interface RecentActivityItem {
  title: string;
  description: string;
  time: string;
  icon: string;
}

const trafficSeed: Record<RangeKey, TrafficPoint[]> = {
  "7d": [
    { label: "Sen", value: 22 },
    { label: "Sel", value: 28 },
    { label: "Rab", value: 19 },
    { label: "Kam", value: 34 },
    { label: "Jum", value: 26 },
    { label: "Sab", value: 31 },
    { label: "Min", value: 24 },
  ],
  "30d": [
    { label: "1", value: 20 },
    { label: "5", value: 24 },
    { label: "10", value: 18 },
    { label: "15", value: 30 },
    { label: "20", value: 27 },
    { label: "25", value: 35 },
    { label: "30", value: 29 },
  ],
};

const marketplaceSeed: MarketplaceSummaryItem[] = [
  { name: "Shopee", icon: "🛒", count: 18, accent: "from-emerald-500 to-teal-600" },
  { name: "TikTok Shop", icon: "🎥", count: 12, accent: "from-fuchsia-500 to-purple-600" },
  { name: "Tokopedia", icon: "🧺", count: 9, accent: "from-amber-500 to-orange-600" },
  { name: "Lazada", icon: "📦", count: 7, accent: "from-rose-500 to-pink-600" },
];

const storeSeed: StoreSummaryItem[] = [
  { name: "Maqil Official", count: 24, region: "Jakarta" },
  { name: "Maqil Fashion", count: 16, region: "Bandung" },
  { name: "Maqil Jakarta", count: 13, region: "Jakarta" },
  { name: "Maqil Bandung", count: 10, region: "Bandung" },
];

const revenueSeed: RevenueSummaryItem[] = [
  { label: "Omzet Hari Ini", amount: 18450000, hint: "Live dari order hari ini" },
  { label: "Omzet Minggu Ini", amount: 102450000, hint: "7 hari terakhir" },
  { label: "Omzet Bulan Ini", amount: 318900000, hint: "Perkiraan bulan berjalan" },
];

const warehouseSeed: WarehouseActivityItem[] = [
  { label: "Sedang Packing", count: 8, icon: "📦", accent: "from-cyan-500 to-blue-600" },
  { label: "Sudah Cetak Label", count: 14, icon: "🏷️", accent: "from-emerald-500 to-teal-600" },
  { label: "Menunggu Pickup", count: 6, icon: "🚚", accent: "from-amber-500 to-orange-600" },
  { label: "Sudah Pickup", count: 11, icon: "✅", accent: "from-slate-600 to-slate-700" },
];

const recentActivitiesSeed: RecentActivityItem[] = [
  { title: "Order baru dari Shopee", description: "1 pesanan masuk dan menunggu diproses.", time: "5 menit lalu", icon: "🛒" },
  { title: "Label berhasil dicetak", description: "3 label selesai dicetak untuk pesanan siap kirim.", time: "18 menit lalu", icon: "🖨️" },
  { title: "Order dipindahkan ke Menunggu Pickup", description: "2 transaksi dikirim ke tahap pickup.", time: "42 menit lalu", icon: "🚚" },
  { title: "Pickup berhasil", description: "1 paket selesai diproses dan ditutup.", time: "1 jam lalu", icon: "✅" },
];

export function buildDashboardData(orders: Order[], range: RangeKey = "7d") {
  const counts = orders.reduce<Record<string, number>>(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      acc[order.marketplace] = (acc[order.marketplace] || 0) + 1;
      return acc;
    },
    {},
  );

  const orderSummary = [
    { label: "Total Order Hari Ini", value: orders.length, icon: "📦", accent: "from-cyan-500 to-blue-600" },
    { label: "Pesanan Baru", value: counts.new || 0, icon: "🆕", accent: "from-emerald-500 to-teal-600" },
    { label: "Siap Dicetak", value: counts.ready || 0, icon: "🖨️", accent: "from-amber-500 to-orange-600" },
    { label: "Menunggu Pickup", value: counts.pickup || 0, icon: "🚚", accent: "from-fuchsia-500 to-purple-600" },
    { label: "Selesai", value: counts.completed || 0, icon: "✅", accent: "from-slate-600 to-slate-700" },
  ];

  const marketplaces = marketplaceSeed.map((item) => ({
    ...item,
    count: counts[item.name] || item.count,
  }));

  const stores = storeSeed.map((item) => ({ ...item }));
  const revenue = revenueSeed.map((item) => ({ ...item }));
  const warehouseActivities = warehouseSeed.map((item) => ({ ...item }));
  const recentActivities = recentActivitiesSeed.map((item) => ({ ...item }));
  const traffic = trafficSeed[range];

  return {
    orderSummary,
    traffic,
    marketplaces,
    stores,
    revenue,
    warehouseActivities,
    recentActivities,
  };
}
