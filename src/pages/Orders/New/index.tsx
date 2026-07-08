import { useMemo, useState } from "react";
import OrdersTable from "../../../components/orders/OrdersTable";
import { useOrders } from "../../../contexts/OrdersContext";

const marketplaceCards = [
  { key: "all", label: "Semua Order", icon: "📦", accent: "from-cyan-500 to-blue-600" },
  { key: "Shopee", label: "Shopee", icon: "🛒", accent: "from-emerald-500 to-teal-600" },
  { key: "TikTok Shop", label: "TikTok Shop", icon: "🎥", accent: "from-fuchsia-500 to-purple-600" },
  { key: "Tokopedia", label: "Tokopedia", icon: "🧺", accent: "from-amber-500 to-orange-600" },
  { key: "Lazada", label: "Lazada", icon: "📦", accent: "from-rose-500 to-pink-600" },
];

const statusCards = [
  { key: "new", label: "Pesanan Baru", accent: "from-cyan-500 to-blue-600" },
  { key: "processing", label: "Sedang Diproses", accent: "from-violet-500 to-indigo-600" },
  { key: "ready", label: "Siap Dicetak", accent: "from-amber-500 to-orange-600" },
  { key: "pickup", label: "Menunggu Pickup", accent: "from-emerald-500 to-teal-600" },
  { key: "completed", label: "Selesai", accent: "from-slate-600 to-slate-700" },
];

export default function NewOrdersPage() {
  const [selectedMarketplace, setSelectedMarketplace] = useState("all");
  const { orders } = useOrders();

  const marketplaceSummary = useMemo(() => {
    const counts = orders.reduce<Record<string, number>>((acc, order) => {
      acc[order.marketplace] = (acc[order.marketplace] || 0) + 1;
      return acc;
    }, {});

    return marketplaceCards.map((card) => ({
      ...card,
      value: card.key === "all" ? orders.length : counts[card.key] || 0,
    }));
  }, []);

  const statusSummary = useMemo(() => {
    const counts = orders.reduce<Record<string, number>>((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    return statusCards.map((card) => ({
      ...card,
      value: counts[card.key] || 0,
    }));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pesanan Baru</h1>
        <p className="text-slate-500">
          Daftar pesanan yang baru masuk dari marketplace.
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Ringkasan Marketplace</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {marketplaceSummary.map((card) => {
            const isActive = selectedMarketplace === card.key;

            return (
              <button
                key={card.key}
                type="button"
                onClick={() => setSelectedMarketplace(card.key)}
                className={`rounded-2xl border p-4 text-left shadow-sm transition-all ${
                  isActive
                    ? "border-cyan-500 bg-cyan-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-cyan-200 hover:shadow-md"
                }`}
              >
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-lg text-white`}>
                  {card.icon}
                </div>
                <p className="text-sm font-medium text-slate-600">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Ringkasan Status</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {statusSummary.map((card) => (
            <div
              key={card.key}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className={`mb-3 h-2 rounded-full bg-gradient-to-r ${card.accent}`} />
              <p className="text-sm font-medium text-slate-600">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
            </div>
          ))}
        </div>
      </section>

      <OrdersTable status="new" selectedMarketplace={selectedMarketplace} />
    </div>
  );
}