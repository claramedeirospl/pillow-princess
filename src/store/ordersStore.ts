import { create } from "zustand";
import type { Order } from "@/@types";

interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrdersByUser: (userId: string) => Order[];
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],

  addOrder(order) {
    set((state) => ({ orders: [order, ...state.orders] }));
  },

  getOrdersByUser(userId) {
    return get().orders.filter((o) => o.userId === userId);
  },
}));
