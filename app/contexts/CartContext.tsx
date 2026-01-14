"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  color?: string;
  size?: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string, variantKey?: string) => void;
  updateQty: (id: string, quantity: number, variantKey?: string) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const storageKey = "men-store-cart";

function variantKeyOf(item: CartItem) {
  return `${item.id}:${item.color ?? ""}:${item.size ?? ""}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  function addItem(item: Omit<CartItem, "quantity"> & { quantity?: number }) {
    const qty = item.quantity ?? 1;
    setItems((prev) => {
      const key = variantKeyOf({ ...item, quantity: qty });
      const existingIndex = prev.findIndex((p) => variantKeyOf(p) === key);
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex].quantity += qty;
        return copy;
      }
      return [...prev, { ...item, quantity: qty }];
    });
  }

  function removeItem(id: string, variantKey?: string) {
    setItems((prev) =>
      prev.filter((p) => {
        const key = variantKeyOf(p);
        return variantKey ? key !== variantKey : p.id !== id;
      })
    );
  }

  function updateQty(id: string, quantity: number, variantKey?: string) {
    setItems((prev) =>
      prev.map((p) => {
        const key = variantKeyOf(p);
        if ((variantKey && key === variantKey) || (!variantKey && p.id === id)) {
          return { ...p, quantity: Math.max(1, quantity) };
        }
        return p;
      })
    );
  }

  function clear() {
    setItems([]);
  }

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.count += item.quantity;
        acc.total += item.price * item.quantity;
        return acc;
      },
      { count: 0, total: 0 }
    );
  }, [items]);

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQty,
    clear,
    count: totals.count,
    total: totals.total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
