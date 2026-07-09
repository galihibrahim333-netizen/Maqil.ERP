import { useEffect, useMemo, useState } from "react";
import { PageShell } from "../../components/common/PageShell";
import {
  internalSkuOptions,
  productCatalog,
  syncHistory,
  warehouseCatalog,
  type ProductRow,
  type ProductVariantItem,
} from "./mockData";
import { matchVariantName } from "./skuUtils";

type ViewMode = "all" | "active" | "inactive" | "unmapped" | "mapped" | "history";

const tabItems: Array<{ key: ViewMode; label: string }> = [
  { key: "all", label: "Semua Produk" },
  { key: "active", label: "Produk Aktif" },
  { key: "inactive", label: "Produk Nonaktif" },
  { key: "unmapped", label: "Belum Mapping SKU" },
  { key: "mapped", label: "Sudah Mapping SKU" },
  { key: "history", label: "Riwayat Sinkronisasi" },
];

const normalizeSearchValue = (value: string) => value.trim().toLowerCase();

const formatPrice = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export function ProductsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [selectedSkuById, setSelectedSkuById] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(normalizeSearchValue(searchTerm));
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchTerm]);

  const allProducts = useMemo(() => productCatalog, []);

  const allRows = useMemo<ProductRow[]>(() => {
    return allProducts.flatMap((product) =>
      product.variations.map((variation) => {
        const warehouse = variation.internalSku ? warehouseCatalog[variation.internalSku] : undefined;

        return {
          ...variation,
          productId: product.id,
          productStatus: product.status,
          marketplace: product.marketplace,
          productName: product.productName,
          price: warehouse?.price ?? 0,
          stock: warehouse?.stock ?? 0,
          warehouseCode: warehouse?.code ?? variation.internalSku ?? "-",
        };
      })
    );
  }, [allProducts]);

  const filteredRows = useMemo(() => {
    let rows = allRows;

    if (viewMode === "active") {
      rows = rows.filter((row) => row.productStatus === "active");
    } else if (viewMode === "inactive") {
      rows = rows.filter((row) => row.productStatus === "inactive");
    } else if (viewMode === "unmapped") {
      rows = rows.filter((row) => row.mappingStatus === "unmapped");
    } else if (viewMode === "mapped") {
      rows = rows.filter((row) => row.mappingStatus === "mapped");
    }

    if (!debouncedSearch) {
      return rows;
    }

    return rows.filter((row) => {
      const haystack = [
        row.productName,
        row.marketplace,
        row.marketplaceVariant,
        row.marketplaceSku,
        row.internalSku ?? "",
        row.barcode ?? "",
        row.warehouseCode,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(debouncedSearch);
    });
  }, [allRows, debouncedSearch, viewMode]);

  const groupedProducts = useMemo(() => {
    const groups = new Map<string, { id: string; marketplace: string; productName: string; status: "active" | "inactive"; variations: ProductRow[] }>();

    filteredRows.forEach((row) => {
      const existing = groups.get(row.productId);
      if (existing) {
        existing.variations.push(row);
        return;
      }

      groups.set(row.productId, {
        id: row.productId,
        marketplace: row.marketplace,
        productName: row.productName,
        status: row.productStatus,
        variations: [row],
      });
    });

    return Array.from(groups.values());
  }, [filteredRows]);

  const saveMapping = (variant: ProductVariantItem) => {
    const selectedSku = selectedSkuById[variant.id] || variant.suggestedSku || internalSkuOptions[0];
    if (!selectedSku) {
      return;
    }

    setSelectedSkuById((prev) => ({ ...prev, [variant.id]: selectedSku }));
    window.alert(`Mapping tersimpan untuk ${variant.marketplaceVariant} → ${selectedSku}`);
  };

  const renderProductList = () => {
    if (viewMode === "history") {
      return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Tanggal Sinkronisasi</th>
                <th className="p-3 text-left">Marketplace</th>
                <th className="p-3 text-left">Jumlah Produk</th>
                <th className="p-3 text-left">Berhasil</th>
                <th className="p-3 text-left">Gagal</th>
              </tr>
            </thead>
            <tbody>
              {syncHistory.map((item) => (
                <tr key={item.id} className="border-t border-slate-200">
                  <td className="p-3">{item.synchronizedAt}</td>
                  <td className="p-3">{item.marketplace}</td>
                  <td className="p-3">{item.totalProducts}</td>
                  <td className="p-3">{item.successCount}</td>
                  <td className="p-3">{item.failedCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {groupedProducts.map((product) => (
          <div key={product.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{product.productName}</h3>
                <p className="text-sm text-slate-500">{product.marketplace}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${product.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {product.status === "active" ? "Aktif" : "Nonaktif"}
              </span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-left">Variasi Marketplace</th>
                    <th className="p-3 text-left">SKU Marketplace</th>
                    <th className="p-3 text-left">SKU Internal</th>
                    <th className="p-3 text-left">Harga</th>
                    <th className="p-3 text-left">Stock Gudang</th>
                    <th className="p-3 text-left">Status Mapping</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variations.map((variation) => {
                    const isAutoMatched = matchVariantName(variation.marketplaceVariant, variation.suggestedSku?.replace(/^INT-[A-Z0-9-]+-?/i, "") || "");
                    const selectedSku = selectedSkuById[variation.id] || variation.suggestedSku || internalSkuOptions[0];
                    const showMappingControl = viewMode === "unmapped";

                    return (
                      <tr key={variation.id} className="border-t border-slate-200">
                        <td className="p-3">{variation.marketplaceVariant}</td>
                        <td className="p-3">{variation.marketplaceSku}</td>
                        <td className="p-3">{variation.internalSku || "-"}</td>
                        <td className="p-3">{variation.internalSku ? formatPrice(variation.price) : "-"}</td>
                        <td className="p-3">{variation.internalSku ? variation.stock : "-"}</td>
                        <td className="p-3">
                          {showMappingControl ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <select
                                value={selectedSku}
                                onChange={(event) => setSelectedSkuById((prev) => ({ ...prev, [variation.id]: event.target.value }))}
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              >
                                {internalSkuOptions.map((sku) => (
                                  <option key={sku} value={sku}>{sku}</option>
                                ))}
                              </select>
                              <button
                                type="button"
                                onClick={() => saveMapping(variation)}
                                className="rounded-lg border border-cyan-500 bg-cyan-500 px-3 py-2 text-sm font-medium text-white"
                              >
                                Simpan Mapping
                              </button>
                              <span className="text-xs text-slate-500">{isAutoMatched ? "Auto Match" : "Manual"}</span>
                            </div>
                          ) : (
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${variation.mappingStatus === "mapped" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                              {variation.mappingStatus === "mapped" ? "🟢 Sudah Mapping" : "🟡 Belum Mapping"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <PageShell
      title="Produk"
      description="Pusat sinkronisasi produk marketplace dengan workflow auto mapping SKU per variasi."
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {tabItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setViewMode(item.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${viewMode === item.key ? "bg-cyan-600 text-white" : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-100"}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="w-full">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Cari Nama Produk, SKU Marketplace, SKU Internal, Barcode atau Variasi..."
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none ring-0 transition focus:border-cyan-500"
          />
        </div>

        {renderProductList()}
      </div>
    </PageShell>
  );
}
