import { create } from "zustand";
import type { CartItem, Product } from "@/@types";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string, qty?: number) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
  shippingCost: () => number;
  grandTotal: () => number;
}

const FREE_SHIPPING_THRESHOLD = 199;
const SHIPPING_COST = 18.9;

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem(product, size, color, qty = 1) {
    const key = `${product.id}-${size}-${color}`;
    set((state) => {
      const existing = state.items.find((i) => i.key === key);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.key === key ? { ...i, qty: i.qty + qty } : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            key,
            productId: product.id,
            name: product.name,
            price: product.price,
            emoji: product.emoji,
            size,
            color,
            qty,
          },
        ],
      };
    });
  },

  removeItem(key) {
    set((state) => ({ items: state.items.filter((i) => i.key !== key) }));
  },

  updateQty(key, qty) {
    if (qty < 1) {
      get().removeItem(key);
      return;
    }
    set((state) => ({
      items: state.items.map((i) => (i.key === key ? { ...i, qty } : i)),
    }));
  },

  clear() {
    set({ items: [] });
  },

  total() {
    return get().items.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  count() {
    return get().items.reduce((sum, i) => sum + i.qty, 0);
  },

  shippingCost() {
    return get().total() >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  },

  grandTotal() {
    return get().total() + get().shippingCost();
  },
}));
