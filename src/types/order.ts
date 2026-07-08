export type OrderStatus = "new" | "ready" | "pickup" | "completed";

export interface Order {
  id: number;
  marketplace: string;
  orderNumber: string;
  buyer: string;
  courier: string;
  trackingNumber: string;
  orderTime: string;
  productName: string;
  productImage: string;
  printed: boolean;
  status: OrderStatus;
}