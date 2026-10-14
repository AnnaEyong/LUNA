import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Your bag",
  description: "Review and update your LUNA shopping bag.",
};

export default function CartPage() {
  return <CartView />;
}