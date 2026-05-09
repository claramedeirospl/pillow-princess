import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useOrdersStore } from "@/store/ordersStore";
import { useNavigationStore } from "@/store/navigationStore";
import { useToastStore } from "@/store/toastStore";
import { useCheckoutStore } from "@/store/checkoutStore";
import type { Order } from "@/@types";

export function useCheckout() {
  const step = useCheckoutStore((s) => s.step);
  const setStep = useCheckoutStore((s) => s.setStep);
  const selectedAddress = useCheckoutStore((s) => s.selectedAddress);
  const setSelectedAddress = useCheckoutStore((s) => s.setSelectedAddress);
  const selectedPayment = useCheckoutStore((s) => s.selectedPayment);
  const setSelectedPayment = useCheckoutStore((s) => s.setSelectedPayment);
  const reset = useCheckoutStore((s) => s.reset);

  const user = useAuthStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const grandTotal = useCartStore((s) => s.grandTotal());
  const shippingCost = useCartStore((s) => s.shippingCost());
  const clearCart = useCartStore((s) => s.clear);
  const addOrder = useOrdersStore((s) => s.addOrder);
  const navigate = useNavigationStore((s) => s.navigate);
  const setSelectedOrder = useNavigationStore((s) => s.setSelectedOrder);
  const show = useToastStore((s) => s.show);

  const addresses = user?.addresses ?? [];
  const payments = user?.payments ?? [];

  // Auto-select the most recently added address/payment so the user
  // doesn't have to re-select after navigating to add-address / add-payment.
  useEffect(() => {
    if (!selectedAddress && addresses.length > 0) {
      setSelectedAddress(addresses[addresses.length - 1]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses.length]);

  useEffect(() => {
    if (!selectedPayment && payments.length > 0) {
      setSelectedPayment(payments[payments.length - 1]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payments.length]);

  function nextStep() {
    setStep(Math.min(step + 1, 2) as 0 | 1 | 2);
  }

  function goToStep(s: 0 | 1 | 2) {
    if (s < step) setStep(s);
  }

  function placeOrder() {
    if (!selectedAddress) { navigate("add-address"); return; }
    if (!selectedPayment) { navigate("add-payment"); return; }
    if (!user) return;

    const order: Order = {
      id: "PP" + Date.now().toString().slice(-6),
      userId: user.id,
      items,
      total: grandTotal,
      address: selectedAddress,
      payment: selectedPayment,
      status: "confirmado",
      timeline: [
        { status: "confirmado", label: "Pedido confirmado", time: new Date().toISOString() },
      ],
      createdAt: new Date().toISOString(),
    };

    addOrder(order);
    clearCart();
    setSelectedOrder(order);
    reset();
    show("Pedido realizado com sucesso! 🎉");
    navigate("order-success");
  }

  return {
    step,
    nextStep,
    goToStep,
    placeOrder,
    selectedAddress,
    setSelectedAddress,
    selectedPayment,
    setSelectedPayment,
    addresses,
    payments,
    subtotal: total,
    shippingCost,
    grandTotal,
    items,
  };
}
