export type ProductStatus = "active" | "inactive";
export type MappingStatus = "mapped" | "unmapped";

export interface ProductVariantItem {
  id: string;
  marketplace: string;
  productName: string;
  marketplaceVariant: string;
  marketplaceSku: string;
  internalSku?: string;
  mappingStatus: MappingStatus;
  mappingDate?: string;
  suggestedSku?: string;
}

export interface ProductItem {
  id: string;
  marketplace: string;
  productName: string;
  status: ProductStatus;
  variations: ProductVariantItem[];
}

export interface SyncHistoryItem {
  id: string;
  synchronizedAt: string;
  marketplace: string;
  totalProducts: number;
  successCount: number;
  failedCount: number;
}

export const productCatalog: ProductItem[] = [
  {
    id: "p1",
    marketplace: "Shopee",
    productName: "Kaos Oversize Premium",
    status: "active",
    variations: [
      {
        id: "v1",
        marketplace: "Shopee",
        productName: "Kaos Oversize Premium",
        marketplaceVariant: "Hitam L",
        marketplaceSku: "SP-001",
        internalSku: "INT-KAOS-HL",
        mappingStatus: "mapped",
        mappingDate: "2026-07-05",
      },
      {
        id: "v2",
        marketplace: "Shopee",
        productName: "Kaos Oversize Premium",
        marketplaceVariant: "hitam l",
        marketplaceSku: "SP-002",
        internalSku: "INT-KAOS-HL",
        mappingStatus: "mapped",
        mappingDate: "2026-07-05",
      },
      {
        id: "v3",
        marketplace: "Shopee",
        productName: "Kaos Oversize Premium",
        marketplaceVariant: "Putih-M",
        marketplaceSku: "SP-003",
        internalSku: "INT-KAOS-PM",
        mappingStatus: "mapped",
        mappingDate: "2026-07-05",
      },
      {
        id: "v4",
        marketplace: "Shopee",
        productName: "Kaos Oversize Premium",
        marketplaceVariant: "Merah / XL",
        marketplaceSku: "SP-004",
        mappingStatus: "unmapped",
        suggestedSku: "INT-KAOS-MXL",
      },
    ],
  },
  {
    id: "p2",
    marketplace: "Tokopedia",
    productName: "Hoodie Premium",
    status: "inactive",
    variations: [
      {
        id: "v5",
        marketplace: "Tokopedia",
        productName: "Hoodie Premium",
        marketplaceVariant: "Hitam-L",
        marketplaceSku: "TD-001",
        internalSku: "INT-HOODIE-HL",
        mappingStatus: "mapped",
        mappingDate: "2026-07-04",
      },
      {
        id: "v6",
        marketplace: "Tokopedia",
        productName: "Hoodie Premium",
        marketplaceVariant: "Abu / M",
        marketplaceSku: "TD-002",
        mappingStatus: "unmapped",
        suggestedSku: "INT-HOODIE-AM",
      },
    ],
  },
  {
    id: "p3",
    marketplace: "TikTok Shop",
    productName: "Celana Cargo",
    status: "active",
    variations: [
      {
        id: "v7",
        marketplace: "TikTok Shop",
        productName: "Celana Cargo",
        marketplaceVariant: "Coklat S",
        marketplaceSku: "TT-001",
        internalSku: "INT-CARGO-CS",
        mappingStatus: "mapped",
        mappingDate: "2026-07-06",
      },
      {
        id: "v8",
        marketplace: "TikTok Shop",
        productName: "Celana Cargo",
        marketplaceVariant: "Hitam_L",
        marketplaceSku: "TT-002",
        internalSku: "INT-CARGO-HL",
        mappingStatus: "mapped",
        mappingDate: "2026-07-06",
      },
    ],
  },
  {
    id: "p4",
    marketplace: "Lazada",
    productName: "Tas Wanita",
    status: "active",
    variations: [
      {
        id: "v9",
        marketplace: "Lazada",
        productName: "Tas Wanita",
        marketplaceVariant: "Merah XL",
        marketplaceSku: "LZ-001",
        mappingStatus: "unmapped",
        suggestedSku: "INT-TAS-MXL",
      },
    ],
  },
];

export const syncHistory: SyncHistoryItem[] = [
  { id: "h1", synchronizedAt: "2026-07-07 09:15", marketplace: "Shopee", totalProducts: 42, successCount: 38, failedCount: 4 },
  { id: "h2", synchronizedAt: "2026-07-06 21:10", marketplace: "TikTok Shop", totalProducts: 28, successCount: 26, failedCount: 2 },
  { id: "h3", synchronizedAt: "2026-07-05 18:45", marketplace: "Tokopedia", totalProducts: 31, successCount: 29, failedCount: 2 },
  { id: "h4", synchronizedAt: "2026-07-04 16:20", marketplace: "Lazada", totalProducts: 17, successCount: 15, failedCount: 2 },
];

export const internalSkuOptions = [
  "INT-KAOS-HL",
  "INT-KAOS-PM",
  "INT-KAOS-MXL",
  "INT-HOODIE-HL",
  "INT-HOODIE-AM",
  "INT-CARGO-CS",
  "INT-CARGO-HL",
  "INT-TAS-MXL",
];
