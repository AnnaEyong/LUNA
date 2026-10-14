import type { Metadata } from "next";
import { FavoritesView } from "@/components/favorites-view";

export const metadata: Metadata = {
  title: "Favorites",
  description: "Your saved pieces from LUNA.",
};

export default function FavoritesPage() {
  return <FavoritesView />;
}