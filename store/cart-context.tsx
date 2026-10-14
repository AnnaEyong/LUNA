"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { products } from "@/lib/products";

export type CartLine = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  hydrated: boolean;
  itemCount: number;
  addItem: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const productIds = new Set(products.map((product) => product.id));

function subscribeToCart(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("luna-cart-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("luna-cart-change", onChange);
  };
}

function getCartSnapshot() {
  try {
    return window.localStorage.getItem("luna-cart") ?? "[]";
  } catch {
    return "[]";
  }
}

function getServerCartSnapshot() {
  return "[]";
}

function subscribeToHydration() {
  return () => {};
}

function getHydrationSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.productId === "string" &&
    productIds.has(line.productId) &&
    typeof line.quantity === "number" &&
    Number.isInteger(line.quantity) &&
    line.quantity > 0
  );
}

function parseCart(snapshot: string): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) ? parsed.filter(isCartLine) : [];
  } catch {
    return [];
  }
}

function writeCart(update: (currentItems: CartLine[]) => CartLine[]) {
  try {
    window.localStorage.setItem("luna-cart", JSON.stringify(update(parseCart(getCartSnapshot()))));
    window.dispatchEvent(new Event("luna-cart-change"));
  } catch {
    return;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribeToCart, getCartSnapshot, getServerCartSnapshot);
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const items = parseCart(snapshot);

  function addItem(productId: string, quantity = 1) {
    const product = products.find((item) => item.id === productId);
    if (!product?.inStock || !Number.isInteger(quantity) || quantity < 1) return;

    writeCart((currentItems) => {
      const existing = currentItems.find((item) => item.productId === productId);
      return existing
        ? currentItems.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
          )
          : [...currentItems, { productId, quantity }];
    });
  }

  function updateQuantity(productId: string, quantity: number) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      removeItem(productId);
      return;
    }
    writeCart((currentItems) =>
      currentItems.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    );
  }

  function removeItem(productId: string) {
    writeCart((currentItems) => currentItems.filter((item) => item.productId !== productId));
  }

  function clearCart() {
    writeCart(() => []);
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, hydrated, itemCount, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}