import { create } from "zustand";
import type { Order, Product, Screen } from "@/@types";

interface NavigationState {
  screen: Screen;
  prevScreen: Screen | null;
  selectedProduct: Product | null;
  selectedOrder: Order | null;
  navigate: (to: Screen, opts?: { product?: Product; order?: Order }) => void;
  goBack: () => void;
  setSelectedOrder: (order: Order | null) => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  screen: "login",
  prevScreen: null,
  selectedProduct: null,
  selectedOrder: null,

  navigate(to, opts = {}) {
    set((state) => ({
      prevScreen: state.screen,
      screen: to,
      selectedProduct: opts.product ?? state.selectedProduct,
      selectedOrder: opts.order ?? state.selectedOrder,
    }));
  },

  goBack() {
    const { prevScreen } = get();
    set({ screen: prevScreen ?? "home", prevScreen: null });
  },

  setSelectedOrder(order) {
    set({ selectedOrder: order });
  },
}));
