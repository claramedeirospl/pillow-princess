import { create } from "zustand";

interface ToastState {
  message: string | null;
  type: "success" | "error";
  show: (msg: string, type?: "success" | "error") => void;
  hide: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: "success",

  show(msg, type = "success") {
    set({ message: msg, type });
    setTimeout(() => set({ message: null }), 2500);
  },

  hide() {
    set({ message: null });
  },
}));
