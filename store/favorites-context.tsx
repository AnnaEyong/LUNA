"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { products } from "@/lib/products";

type FavoritesContextValue = {
  favoriteIds: string[];
  favoriteCount: number;
  hydrated: boolean;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const productIds = new Set(products.map((product) => product.id));

function subscribeToFavorites(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("luna-favorites-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("luna-favorites-change", onChange);
  };
}

function getFavoritesSnapshot() {
  try {
    return window.localStorage.getItem("luna-favorites") ?? "[]";
  } catch {
    return "[]";
  }
}

function getServerFavoritesSnapshot() {
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

function parseFavorites(snapshot: string) {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (!Array.isArray(parsed)) return [];

    return [...new Set(parsed.filter((id): id is string => typeof id === "string" && productIds.has(id)))];
  } catch {
    return [];
  }
}

function writeFavorites(update: (currentIds: string[]) => string[]) {
  try {
    window.localStorage.setItem("luna-favorites", JSON.stringify(update(parseFavorites(getFavoritesSnapshot()))));
    window.dispatchEvent(new Event("luna-favorites-change"));
  } catch {
    return;
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribeToFavorites,
    getFavoritesSnapshot,
    getServerFavoritesSnapshot,
  );
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const favoriteIds = parseFavorites(snapshot);

  function isFavorite(productId: string) {
    return favoriteIds.includes(productId);
  }

  function toggleFavorite(productId: string) {
    if (!productIds.has(productId)) return;
    writeFavorites((currentIds) =>
      currentIds.includes(productId)
        ? currentIds.filter((id) => id !== productId)
        : [...currentIds, productId],
    );
  }

  function removeFavorite(productId: string) {
    writeFavorites((currentIds) => currentIds.filter((id) => id !== productId));
  }

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, favoriteCount: favoriteIds.length, hydrated, isFavorite, toggleFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }
  return context;
}