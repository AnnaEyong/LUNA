"use client";

import { Heart } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useFavorites } from "@/store/favorites-context";

export function FavoriteButton({
  productId,
  className = "favorite-toggle",
  showLabel = false,
}: {
  productId: string;
  className?: string;
  showLabel?: boolean;
}) {
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const selected = isFavorite(productId);
  const label = selected ? t.removeFromFavorites : t.addToFavorites;

  return (
    <button
      className={className}
      type="button"
      aria-label={label}
      aria-pressed={selected}
      title={label}
      onClick={() => toggleFavorite(productId)}
    >
      <Heart size={16} fill={selected ? "currentColor" : "none"} aria-hidden="true" />
      {showLabel && <span>{label}</span>}
    </button>
  );
}