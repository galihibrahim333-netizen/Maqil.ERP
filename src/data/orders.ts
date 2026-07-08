import type { Order } from "../types/order";

export const orders: Order[] = [
  {
    id: 1,
    marketplace: "Shopee",
    orderNumber: "260705U2A7VR2D",
    buyer: "Galih Ibrahim",
    courier: "SPX Standard",
    trackingNumber: "SPXID064575539347",
    orderTime: "05/07/2026 12:56",
    productName: "Kaos Oversize Hitam",
    productImage: "https://placehold.co/80x80",
    printed: false,
    status: "new",
  },
  {
    id: 2,
    marketplace: "TikTok Shop",
    orderNumber: "260705U2A8ABCD",
    buyer: "Budi",
    courier: "J&T Express",
    trackingNumber: "JTX123456789",
    orderTime: "05/07/2026 13:10",
    productName: "Hoodie Premium",
    productImage: "https://placehold.co/80x80",
    printed: true,
    status: "ready",
  },
];