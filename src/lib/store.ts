"use client";

import { useMemo, useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { productById } from "@/data/catalog";
import type { Review } from "@/data/types";
import { getTotals, priceLines, type CartLine, type Totals } from "./pricing";

/*
 * The mock has no backend: cart, login, orders and reviews live in this browser.
 * Components should only use the hooks exported here, so an API can replace it later.
 */

export interface Customer {
  firstName: string;
  lastName: string;
  mobile: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  note: string;
}

export interface OrderItem extends CartLine {
  slug: string;
  name: string;
  image: string;
  optionLabel: string;
  unit: number;
  total: number;
}

export interface Order {
  id: string;
  createdAt: number;
  status: "pending" | "paid" | "failed";
  customer: Customer;
  shippingName: string;
  items: OrderItem[];
  totals: Omit<Totals, "coupon"> & { couponCode: string | null };
  reference?: string;
}

interface ShopState {
  cart: CartLine[];
  coupon: string | null;
  wishlist: number[];
  compare: number[];
  recent: number[];
  user: { mobile: string } | null;
  customer: Customer | null;
  orders: Order[];
  reviews: Record<string, Review[]>;
  /** Returns how many units fitted within stock. */
  add: (id: number, option: string, qty?: number) => number;
  setQty: (id: number, option: string, qty: number) => void;
  remove: (id: number, option: string) => void;
  restore: (line: CartLine, index: number) => void;
  clear: () => void;
  setCoupon: (code: string | null) => void;
  toggleWish: (id: number) => void;
  /** False when four products are already being compared. */
  toggleCompare: (id: number) => boolean;
  view: (id: number) => void;
  login: (mobile: string) => void;
  logout: () => void;
  placeOrder: (order: Order) => void;
  settleOrder: (id: string, success: boolean, reference?: string) => void;
  addReview: (productId: number, review: Review) => void;
}

const reservedElsewhere = (cart: CartLine[], id: number, option: string) =>
  cart.reduce((sum, l) => (l.id === id && l.option !== option ? sum + l.qty : sum), 0);

// Private windows and blocked site data must not break the shop.
const safeStorage: StateStorage = {
  getItem(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // storage unavailable: the session continues in memory
    }
  },
  removeItem(key) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // storage unavailable
    }
  },
};

export const STORAGE_KEY = "kamangiri-shop-v1";

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      coupon: null,
      wishlist: [],
      compare: [],
      recent: [],
      user: null,
      customer: null,
      orders: [],
      reviews: {},

      add(id, option, qty = 1) {
        const { cart } = get();
        const stock = productById.get(id)?.stock ?? 0;
        const current = cart.find((l) => l.id === id && l.option === option);
        const before = current?.qty ?? 0;
        const next = Math.min(before + qty, stock - reservedElsewhere(cart, id, option));
        if (next <= before) return 0;
        set({ cart: current ? cart.map((l) => (l === current ? { ...l, qty: next } : l)) : [...cart, { id, option, qty: next }] });
        return next - before;
      },
      setQty(id, option, qty) {
        const { cart } = get();
        const limit = (productById.get(id)?.stock ?? 0) - reservedElsewhere(cart, id, option);
        const next = Math.max(1, Math.min(Math.floor(qty) || 1, limit));
        set({ cart: cart.map((l) => (l.id === id && l.option === option ? { ...l, qty: next } : l)) });
      },
      remove: (id, option) => set((s) => ({ cart: s.cart.filter((l) => l.id !== id || l.option !== option) })),
      restore: (line, index) =>
        set((s) => {
          if (s.cart.some((l) => l.id === line.id && l.option === line.option)) return s;
          const cart = [...s.cart];
          cart.splice(index, 0, line);
          return { cart };
        }),
      clear: () => set({ cart: [], coupon: null }),
      setCoupon: (coupon) => set({ coupon }),
      toggleWish: (id) => set((s) => ({ wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [id, ...s.wishlist] })),
      toggleCompare(id) {
        const { compare } = get();
        if (!compare.includes(id) && compare.length >= 4) return false;
        set({ compare: compare.includes(id) ? compare.filter((x) => x !== id) : [...compare, id] });
        return true;
      },
      view: (id) => set((s) => (s.recent[0] === id ? s : { recent: [id, ...s.recent.filter((x) => x !== id)].slice(0, 12) })),
      login: (mobile) => set({ user: { mobile } }),
      // signing out on a shared device should not leave the previous address or orders behind
      logout: () => set({ user: null, customer: null, orders: [] }),
      placeOrder: (order) => set((s) => ({ orders: [order, ...s.orders], customer: order.customer })),
      settleOrder: (id, success, reference) =>
        set((s) => {
          const order = s.orders.find((o) => o.id === id);
          if (!order || order.status === "paid") return s;
          const orders = s.orders.map((o) => (o.id === id ? { ...o, status: success ? ("paid" as const) : ("failed" as const), reference } : o));
          if (!success) return { orders };
          // only remove what was paid for; anything added afterwards stays in the cart
          const cart = s.cart.flatMap((line) => {
            const bought = order.items.find((i) => i.id === line.id && i.option === line.option);
            const left = line.qty - (bought?.qty ?? 0);
            return left > 0 ? [{ ...line, qty: left }] : [];
          });
          return { orders, cart, coupon: null };
        }),
      addReview: (productId, review) => set((s) => ({ reviews: { ...s.reviews, [productId]: [review, ...(s.reviews[productId] ?? [])] } })),
    }),
    { name: STORAGE_KEY, version: 1, skipHydration: true, storage: createJSONStorage(() => safeStorage) },
  ),
);

/** False on the server and until the browser's saved state has loaded. */
export function useReady() {
  return useSyncExternalStore(
    (notify) => useShop.persist.onFinishHydration(notify),
    () => useShop.persist.hasHydrated(),
    () => false,
  );
}

export function useCart() {
  const ready = useReady();
  const cart = useShop((s) => s.cart);
  const coupon = useShop((s) => s.coupon);
  return useMemo(() => {
    const lines = priceLines(cart);
    return { ready, lines, totals: getTotals(lines, coupon) };
  }, [ready, cart, coupon]);
}
