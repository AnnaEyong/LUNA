import { ProductBrowser } from "@/components/product-browser";
import { StoreHero } from "@/components/store-hero";
import { products } from "@/lib/products";

export default function Home() {
  return (
    <main>
      <StoreHero />
      <ProductBrowser products={products} />
    </main>
  );
}
