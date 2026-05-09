import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useOrdersStore } from "@/store/ordersStore";
import { useNavigationStore } from "@/store/navigationStore";
import { useToastStore } from "@/store/toastStore";
import type { Address, Payment, Order } from "@/@types";

export function useCheckout() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

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

  function nextStep() {
    setStep((s) => Math.min(s + 1, 2) as 0 | 1 | 2);
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
    show("Pedido realizado com sucesso! 🎉");
    navigate("order-tracking");
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
