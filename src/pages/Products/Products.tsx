import { useMemo, useState } from "react";
import { PageShell } from "../../components/common/PageShell";
import { internalSkuOptions, productCatalog, syncHistory, type ProductVariantItem } from "./mockData";
import { matchVariantName } from "./skuUtils";

type ViewMode = "all" | "active" | "inactive" | "unmapped" | "mapped" | "history";

export function ProductsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [selectedSkuById, setSelectedSkuById] = useState<Record<string, string>>({});

  const allProducts = useMemo(() => productCatalog, []);

  const filteredProducts = useMemo(() => {
    if (viewMode === "all") {
      return allProducts;
    }

    if (viewMode === "active") {
      return allProducts.filter((product) => product.status === "active");
    }

    if (viewMode === "inactive") {
      return allProducts.filter((product) => product.status === "inactive");
    }

    if (viewMode === "unmapped") {
      return allProducts.filter((product) => product.variations.some((variant) => variant.mappingStatus === "unmapped"));
    }

    if (viewMode === "mapped") {
      return allProducts.filter((product) => product.variations.some((variant) => variant.mappingStatus === "mapped"));
    }

    return allProducts;
  }, [allProducts, viewMode]);

  const unmappedVariants = useMemo(() => {
    return allProducts.flatMap((product) =>
      product.variations
        .filter((variant) => variant.mappingStatus === "unmapped")
        .map((variant) => ({ ...variant, productName: product.productName, productStatus: product.status }))
    );
  }, [allProducts]);

  const mappedVariants = useMemo(() => {
    return allProducts.flatMap((product) =>
      product.variations
        .filter((variant) => variant.mappingStatus === "mapped")
        .map((variant) => ({ ...variant, productName: product.productName, productStatus: product.status }))
    );
  }, [allProducts]);

  const saveMapping = (variant: ProductVariantItem) => {
    const selectedSku = selectedSkuById[variant.id] || variant.suggestedSku || internalSkuOptions[0];
    if (!selectedSku) {
      return;
    }

    setSelectedSkuById((prev) => ({ ...prev, [variant.id]: selectedSku }));
    window.alert(`Mapping tersimpan untuk ${variant.marketplaceVariant} → ${selectedSku}`);
  };

  const autoMappedCount = useMemo(() => {
    return mappedVariants.length;
  }, [mappedVariants]);

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

    if (viewMode === "unmapped") {
      return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Marketplace</th>
                <th className="p-3 text-left">Nama Produk</th>
                <th className="p-3 text-left">Variasi Marketplace</th>
                <th className="p-3 text-left">SKU Marketplace</th>
                <th className="p-3 text-left">Saran SKU</th>
                <th className="p-3 text-left">Aksi Mapping</th>
              </tr>
            </thead>
            <tbody>
              {unmappedVariants.map((variant) => {
                const isAutoMatched = matchVariantName(variant.marketplaceVariant, variant.suggestedSku?.replace(/^INT-[A-Z0-9-]+-?/i, "") || "");
                const selectedSku = selectedSkuById[variant.id] || variant.suggestedSku || internalSkuOptions[0];

                return (
                  <tr key={variant.id} className="border-t border-slate-200">
                    <td className="p-3">{variant.marketplace}</td>
                    <td className="p-3">{variant.productName}</td>
                    <td className="p-3">{variant.marketplaceVariant}</td>
                    <td className="p-3">{variant.marketplaceSku}</td>
                    <td className="p-3">{variant.suggestedSku || "-"}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={selectedSku}
                          onChange={(event) => setSelectedSkuById((prev) => ({ ...prev, [variant.id]: event.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        >
                          {internalSkuOptions.map((sku) => (
                            <option key={sku} value={sku}>{sku}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => saveMapping(variant)}
                          className="rounded-lg border border-cyan-500 bg-cyan-500 px-3 py-2 text-sm font-medium text-white"
                        >
                          Simpan Mapping
                        </button>
                        <span className="text-xs text-slate-500">{isAutoMatched ? "Auto Match" : "Manual"}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    if (viewMode === "mapped") {
      return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Marketplace</th>
                <th className="p-3 text-left">Produk</th>
                <th className="p-3 text-left">Variasi Marketplace</th>
                <th className="p-3 text-left">SKU Marketplace</th>
                <th className="p-3 text-left">SKU Internal</th>
                <th className="p-3 text-left">Status Mapping</th>
                <th className="p-3 text-left">Tanggal Mapping</th>
              </tr>
            </thead>
            <tbody>
              {mappedVariants.map((variant) => (
                <tr key={variant.id} className="border-t border-slate-200">
                  <td className="p-3">{variant.marketplace}</td>
                  <td className="p-3">{variant.productName}</td>
                  <td className="p-3">{variant.marketplaceVariant}</td>
                  <td className="p-3">{variant.marketplaceSku}</td>
                  <td className="p-3">{variant.internalSku || "-"}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      🟢 Sudah Mapping
                    </span>
                  </td>
                  <td className="p-3">{variant.mappingDate || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredProducts.map((product) => (
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
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variations.map((variation) => (
                    <tr key={variation.id} className="border-t border-slate-200">
                      <td className="p-3">{variation.marketplaceVariant}</td>
                      <td className="p-3">{variation.marketplaceSku}</td>
                      <td className="p-3">{variation.internalSku || "-"}</td>
                      <td className="p-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${variation.mappingStatus === "mapped" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {variation.mappingStatus === "mapped" ? "🟢 Sudah Mapping" : "🟡 Belum Mapping"}
                        </span>
                      </td>
                    </tr>
                  ))}
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
          {[
            { key: "all", label: "Semua Produk" },
            { key: "active", label: "Produk Aktif" },
            { key: "inactive", label: "Produk Nonaktif" },
            { key: "unmapped", label: "Belum Mapping SKU" },
            { key: "mapped", label: "Sudah Mapping SKU" },
            { key: "history", label: "Riwayat Sinkronisasi" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setViewMode(item.key as ViewMode)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${viewMode === item.key ? "bg-cyan-600 text-white" : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-100"}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Total Produk</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{allProducts.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Sudah Mapping</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{autoMappedCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Belum Mapping</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{unmappedVariants.length}</p>
          </div>
        </div>

        {renderProductList()}
      </div>
    </PageShell>
  );
}
