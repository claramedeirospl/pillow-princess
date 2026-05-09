// ─── Domain Types ─────────────────────────────────────────────────────────────

export type ProductCategory = "pijamas" | "lingerie";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice: number | null;
  sizes: string[];
  colors: string[];
  emoji: string;
  tag: string | null;
  description: string;
  images: string[];
  stock: number;
}

export type UserRole = "admin" | "user";

export interface Address {
  label: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

export type PaymentType = "credit" | "debit" | "pix" | "boleto";

export interface Payment {
  type: PaymentType;
  label: string;
  last4?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
  addresses?: Address[];
  payments?: Payment[];
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  price: number;
  emoji: string;
  size: string;
  color: string;
  qty: number;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "confirmado"
  | "pagamento"
  | "preparando"
  | "enviado"
  | "entregue";

export interface OrderTimeline {
  status: OrderStatus;
  label: string;
  time: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  address: Address;
  payment: Payment;
  status: OrderStatus;
  timeline: OrderTimeline[];
  createdAt: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export type Screen =
  | "login"
  | "register"
  | "home"
  | "products"
  | "product-detail"
  | "cart"
  | "checkout"
  | "order-tracking"
  | "orders"
  | "profile"
  | "add-address"
  | "add-payment"
  | "admin"
  | "admin-product";

// ─── NativeWind ───────────────────────────────────────────────────────────────

/// <reference types="nativewind/types" />
