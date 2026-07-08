import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { orders as initialOrders } from "../data/orders";
import type { Order, OrderStatus } from "../types/order";

interface OrdersContextValue {
  orders: Order[];
  updateOrderStatus: (orderIds: number[], status: OrderStatus) => void;
  updateOrderPrinted: (orderIds: number[], printed: boolean) => void;
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const updateOrderStatus = (orderIds: number[], status: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        orderIds.includes(order.id) ? { ...order, status } : order,
      ),
    );
  };

  const updateOrderPrinted = (orderIds: number[], printed: boolean) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        orderIds.includes(order.id) ? { ...order, printed } : order,
      ),
    );
  };

  const value = useMemo(
    () => ({ orders, updateOrderStatus, updateOrderPrinted }),
    [orders],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }

  return context;
}
