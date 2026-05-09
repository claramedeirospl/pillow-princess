import { create } from "zustand";
import type { Address, Payment } from "@/@types";

interface CheckoutState {
  step: 0 | 1 | 2;
  selectedAddress: Address | null;
  selectedPayment: Payment | null;
  setStep: (s: 0 | 1 | 2) => void;
  setSelectedAddress: (a: Address | null) => void;
  setSelectedPayment: (p: Payment | null) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  step: 0,
  selectedAddress: null,
  selectedPayment: null,
  setStep: (step) => set({ step }),
  setSelectedAddress: (selectedAddress) => set({ selectedAddress }),
  setSelectedPayment: (selectedPayment) => set({ selectedPayment }),
  reset: () => set({ step: 0, selectedAddress: null, selectedPayment: null }),
}));
