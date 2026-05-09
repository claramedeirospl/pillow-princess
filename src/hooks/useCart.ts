import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import { useNavigationStore } from "@/store/navigationStore";
import type { Product } from "@/@types";

export function useCart() {
  const store = useCartStore();
  const show = useToastStore((s) => s.show);
  const navigate = useNavigationStore((s) => s.navigate);

  function addToCart(product: Product, size: string, color: string, qty = 1) {
    store.addItem(product, size, color, qty);
    show("Adicionado ao carrinho! 🛍️");
  }

  function addAndGoToCart(product: Product, size: string, color: string, qty = 1) {
    store.addItem(product, size, color, qty);
    show("Adicionado ao carrinho! 🛍️");
    navigate("cart");
  }

  return {
    items: store.items,
    count: store.count(),
    total: store.total(),
    shippingCost: store.shippingCost(),
    grandTotal: store.grandTotal(),
    addToCart,
    addAndGoToCart,
    removeItem: store.removeItem,
    updateQty: store.updateQty,
    clear: store.clear,
  };
}
