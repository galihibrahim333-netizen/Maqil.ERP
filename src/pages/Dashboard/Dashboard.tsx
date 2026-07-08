import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell } from "../../components/common/PageShell";
import { useOrders } from "../../contexts/OrdersContext";
import { buildDashboardData } from "./mockData";

type RangeKey = "7d" | "30d";

const rangeOptions: Array<{ key: RangeKey; label: string }> = [
  { key: "7d", label: "7 Hari Terakhir" },
  { key: "30d", label: "30 Hari Terakhir" },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export function DashboardPage() {
  const { orders } = useOrders();
  const navigate = useNavigate();
  const [range, setRange] = useState<RangeKey>("7d");

  const data = useMemo(() => buildDashboardData(orders, range), [orders, range]);

  const handleSummaryClick = (label: string) => {
    const routes: Record<string, string> = {
      "Total Order Hari Ini": "/orders",
      "Pesanan Baru": "/orders/new",
      "Siap Dicetak": "/orders/ready",
      "Menunggu Pickup": "/orders/pickup",
      Selesai: "/orders/completed",
    };

    const target = routes[label];
    if (target) {
      navigate(target);
    }
  };

  const handleMarketplaceClick = (marketplaceName: string) => {
    navigate("/orders/new", { state: { selectedMarketplace: marketplaceName } });
  };

  return (
    <PageShell
      title="Beranda"
      description="Pusat monitoring operasional ERP maqil.ERP dengan ringkasan bisnis, traffic order, marketplace, toko, omzet, dan aktivitas gudang."
    >
      <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {data.orderSummary.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleSummaryClick(item.label)}
            className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:shadow-md"
          >
            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent} text-lg text-white`}>
              {item.icon}
            </div>
            <p className="text-sm font-medium text-slate-600">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
          </button>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Grafik Traffic Order</h2>
              <p className="text-sm text-slate-500">Performa order harian dari sumber marketplace.</p>
            </div>
            <div className="flex rounded-full border border-slate-200 bg-slate-50 p-1">
              {rangeOptions.map((option) => {
                const isActive = range === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setRange(option.key)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                      isActive ? "bg-cyan-600 text-white" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-3">
            {data.traffic.map((point) => (
              <div key={point.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                <div className="mb-3 h-24 rounded-lg bg-gradient-to-t from-cyan-500/20 to-cyan-100 p-2">
                  <div className="h-full rounded-md bg-cyan-500/80" style={{ height: `${Math.max(18, point.value)}%` }} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{point.label}</p>
                <p className="text-sm font-semibold text-slate-900">{point.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Ringkasan Omzet</h2>
          <div className="mt-4 space-y-3">
            {data.revenue.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-600">{item.label}</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{formatCurrency(item.amount)}</p>
                <p className="mt-1 text-sm text-slate-500">{item.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Ringkasan Marketplace</h2>
          <div className="mt-4 space-y-3">
            {data.marketplaces.map((marketplace) => (
              <button
                key={marketplace.name}
                type="button"
                onClick={() => handleMarketplaceClick(marketplace.name)}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left transition hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${marketplace.accent} text-lg text-white`}>
                    {marketplace.icon}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{marketplace.name}</p>
                    <p className="text-sm text-slate-500">Order aktif</p>
                  </div>
                </div>
                <span className="text-lg font-semibold text-slate-900">{marketplace.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Ringkasan Toko</h2>
          <div className="mt-4 space-y-3">
            {data.stores.map((store) => (
              <div key={store.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                <div>
                  <p className="font-medium text-slate-800">{store.name}</p>
                  <p className="text-sm text-slate-500">{store.region}</p>
                </div>
                <span className="text-lg font-semibold text-slate-900">{store.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Aktivitas Gudang</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {data.warehouseActivities.map((activity) => (
              <div key={activity.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${activity.accent} text-lg text-white`}>
                  {activity.icon}
                </div>
                <p className="text-sm font-medium text-slate-600">{activity.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{activity.count}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Aktivitas Terbaru</h2>
          <div className="mt-4 space-y-3">
            {data.recentActivities.map((activity) => (
              <div key={activity.title} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-lg">
                  {activity.icon}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{activity.title}</p>
                  <p className="text-sm text-slate-500">{activity.description}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-cyan-600">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>
    </PageShell>
  );
}
