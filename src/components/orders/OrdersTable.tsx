import { useEffect, useRef, useState } from "react";
import { useOrders } from "../../contexts/OrdersContext";
import type { OrderStatus } from "../../types/order";

interface OrdersTableProps {
  status: OrderStatus;
  selectedMarketplace?: string;
}

export default function OrdersTable({ status, selectedMarketplace = "all" }: OrdersTableProps) {
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [scanValue, setScanValue] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [scanHistory, setScanHistory] = useState<string[]>([]);
  const [successfulScans, setSuccessfulScans] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { orders, updateOrderStatus, updateOrderPrinted } = useOrders();

  const filteredOrders = orders.filter(
    (order) =>
      order.status === status &&
      (selectedMarketplace === "all" || order.marketplace === selectedMarketplace),
  );
  const isAllSelected =
    filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length;

  useEffect(() => {
    setSelectedOrderIds([]);
    setFeedback(null);
  }, [status, selectedMarketplace]);

  useEffect(() => {
    if (isScanModalOpen) {
      inputRef.current?.focus();
    }
  }, [isScanModalOpen, scanValue]);

  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedOrderIds([]);
      return;
    }

    setSelectedOrderIds(filteredOrders.map((order) => order.id));
  };

  const requireSelection = () => {
    if (selectedOrderIds.length === 0) {
      setFeedback({ type: "error", message: "Silakan pilih minimal 1 pesanan." });
      return false;
    }

    return true;
  };

  const handlePrimaryAction = () => {
    if (!requireSelection()) {
      return;
    }

    if (status === "new") {
      updateOrderStatus(selectedOrderIds, "ready");
      setSelectedOrderIds([]);
      setFeedback({ type: "success", message: "Pesanan berhasil dipindahkan ke Siap Dicetak." });
      return;
    }

    if (status === "ready") {
      updateOrderStatus(selectedOrderIds, "pickup");
      setSelectedOrderIds([]);
      setFeedback({ type: "success", message: "Pesanan berhasil dipindahkan ke Menunggu Pickup." });
    }
  };

  const handlePrintLabel = () => {
    if (!requireSelection()) {
      return;
    }

    updateOrderPrinted(selectedOrderIds, true);
    setFeedback({ type: "success", message: "Label dicetak untuk pesanan terpilih." });
  };

  const handleInvoice = () => {
    if (!requireSelection()) {
      return;
    }

    setFeedback({ type: "success", message: "Fitur cetak invoice akan dihubungkan pada tahap berikutnya." });
  };

  const handleRefresh = () => {
    setSelectedOrderIds([]);
    setFeedback({ type: "success", message: "Data berhasil dimuat ulang." });
  };

  const handlePlaceholderAction = (message: string) => {
    setFeedback({ type: "success", message });
  };

  const handleScanPickup = (value?: string) => {
    if (!requireSelection()) {
      return;
    }

    const trimmedValue = (value ?? scanValue).trim();

    if (!trimmedValue) {
      setFeedback({ type: "error", message: "Silakan masukkan nomor resi atau barcode." });
      return;
    }

    const normalizedValue = trimmedValue.toLowerCase();
    const matchedOrder = filteredOrders.find(
      (order) =>
        selectedOrderIds.includes(order.id) &&
        [order.trackingNumber, order.orderNumber].some((value) => value.toLowerCase() === normalizedValue),
    );

    if (!matchedOrder) {
      setFeedback({ type: "error", message: "Nomor resi tidak cocok dengan pesanan yang dipilih." });
      setScanHistory((prev) => [trimmedValue, ...prev].slice(0, 10));
      setScanValue("");
      return;
    }

    updateOrderStatus([matchedOrder.id], "pickup");
    setSelectedOrderIds((prev) => prev.filter((id) => id !== matchedOrder.id));
    setSuccessfulScans((prev) => prev + 1);
    setScanHistory((prev) => [`✓ ${trimmedValue}`, ...prev].slice(0, 10));
    setFeedback({ type: "success", message: "Berhasil dipindahkan" });
    setScanValue("");

    if (selectedOrderIds.length === 1) {
      setFeedback({ type: "success", message: "Semua pesanan berhasil dipindahkan." });
    }
  };

  return (
    <div className="space-y-3">
      {feedback && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">
            {selectedOrderIds.length}
          </span>{" "}
          pesanan dipilih
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex h-10 min-h-10 items-center justify-center whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            🔄 Refresh
          </button>

          {status === "new" && (
            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={selectedOrderIds.length === 0}
              className={`inline-flex h-10 min-h-10 items-center justify-center whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium transition ${
                selectedOrderIds.length === 0
                  ? "cursor-not-allowed border-slate-300 bg-slate-200 text-slate-500"
                  : "border-cyan-500 bg-cyan-500 text-white hover:bg-cyan-600"
              }`}
            >
              📦 Proses Pesanan
            </button>
          )}

          {status === "ready" && (
            <>
              <button
                type="button"
                onClick={handlePrintLabel}
                disabled={selectedOrderIds.length === 0}
                className={`inline-flex h-10 min-h-10 items-center justify-center whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  selectedOrderIds.length === 0
                    ? "cursor-not-allowed border-slate-300 bg-slate-200 text-slate-500"
                    : "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600"
                }`}
              >
                🖨 Cetak Label
              </button>
              <button
                type="button"
                onClick={handleInvoice}
                disabled={selectedOrderIds.length === 0}
                className={`inline-flex h-10 min-h-10 items-center justify-center whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  selectedOrderIds.length === 0
                    ? "cursor-not-allowed border-slate-300 bg-slate-200 text-slate-500"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                📄 Cetak Invoice
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedOrderIds.length === 0) {
                    setFeedback({ type: "error", message: "Silakan pilih minimal satu pesanan." });
                    return;
                  }
                  setIsScanModalOpen(true);
                  setFeedback(null);
                  setScanValue("");
                }}
                disabled={selectedOrderIds.length === 0}
                className={`inline-flex h-10 min-h-10 items-center justify-center whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  selectedOrderIds.length === 0
                    ? "cursor-not-allowed border-slate-300 bg-slate-200 text-slate-500"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                📷 Scan & Pickup
              </button>
              <button
                type="button"
                onClick={handlePrimaryAction}
                disabled={selectedOrderIds.length === 0}
                className={`inline-flex h-10 min-h-10 items-center justify-center whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  selectedOrderIds.length === 0
                    ? "cursor-not-allowed border-slate-300 bg-slate-200 text-slate-500"
                    : "border-cyan-500 bg-cyan-500 text-white hover:bg-cyan-600"
                }`}
              >
                🚚 Proses Pickup
              </button>
            </>
          )}

          {status === "pickup" && (
            <>
              <button
                type="button"
                onClick={() => handlePlaceholderAction("Fitur cetak manifest akan dikembangkan pada tahap berikutnya.")}
                className="inline-flex h-10 min-h-10 items-center justify-center whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                📄 Cetak Manifest (placeholder)
              </button>
              <button
                type="button"
                onClick={() => handlePlaceholderAction("Fitur penyelesaian pickup akan dikembangkan pada tahap berikutnya.")}
                className="inline-flex h-10 min-h-10 items-center justify-center whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                ✅ Selesaikan Pickup (placeholder)
              </button>
            </>
          )}

          {status === "completed" && (
            <>
              <button
                type="button"
                onClick={() => handlePlaceholderAction("Fitur cetak ulang label akan dikembangkan pada tahap berikutnya.")}
                className="inline-flex h-10 min-h-10 items-center justify-center whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                📄 Cetak Ulang Label (placeholder)
              </button>
              <button
                type="button"
                onClick={() => handlePlaceholderAction("Fitur cetak invoice akan dikembangkan pada tahap berikutnya.")}
                className="inline-flex h-10 min-h-10 items-center justify-center whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                📄 Cetak Invoice (placeholder)
              </button>
            </>
          )}
        </div>
      </div>

      {isScanModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Scan & Pickup</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Masukkan nomor resi atau barcode untuk simulasi pickup.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsScanModalOpen(false);
                  setScanValue("");
                  setFeedback(null);
                }}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Tutup
              </button>
            </div>

            <label className="mt-4 block text-sm font-medium text-slate-700" htmlFor="scan-input">
              Scan / Input Nomor Resi
            </label>
            <input
              id="scan-input"
              ref={inputRef}
              value={scanValue}
              onChange={(event) => setScanValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleScanPickup(scanValue);
                }
              }}
              placeholder="Contoh: SPXID064575539347"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-0 focus:border-cyan-500"
            />

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Berhasil Scan</span>
                <span className="font-semibold text-slate-900">{successfulScans} Paket</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-slate-700">Riwayat Scan</p>
              <div className="max-h-28 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                {scanHistory.length > 0 ? (
                  scanHistory.map((item, index) => <div key={`${item}-${index}`} className="py-1">{item}</div>)
                ) : (
                  <div className="py-1 text-slate-400">Belum ada scan.</div>
                )}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsScanModalOpen(false);
                  setScanValue("");
                  setFeedback(null);
                }}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="w-12 p-3 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                />
              </th>
              <th className="p-3 text-left">Marketplace</th>
              <th className="p-3 text-left">Produk</th>
              <th className="p-3 text-left">No. Pesanan</th>
              <th className="p-3 text-left">Pembeli</th>
              <th className="p-3 text-left">Jasa Kirim</th>
              <th className="p-3 text-left">No. Resi</th>
              <th className="p-3 text-left">Waktu Pesanan</th>
              <th className="p-3 text-center">Telah Dicetak</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => {
              const isSelected = selectedOrderIds.includes(order.id);

              return (
                <tr key={order.id} className="border-t">
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOrderSelection(order.id)}
                      className="h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                    />
                  </td>
                  <td className="p-3">{order.marketplace}</td>
                  <td className="p-3">{order.productName}</td>
                  <td className="p-3">{order.orderNumber}</td>
                  <td className="p-3">{order.buyer}</td>
                  <td className="p-3">{order.courier}</td>
                  <td className="p-3">{order.trackingNumber}</td>
                  <td className="p-3">{order.orderTime}</td>
                  <td className="p-3 text-center">{order.printed ? "✅" : ""}</td>
                </tr>
              );
            })}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={10} className="p-8 text-center text-slate-500">
                  Tidak ada pesanan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}