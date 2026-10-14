import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { getProductById } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: `${product.name} from the LUNA collection. Shop thoughtfully chosen accessories and everyday pieces.`,
    openGraph: {
      title: `${product.name} | LUNA`,
      description: `Discover ${product.name}, available from LUNA.`,
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return <ProductDetail key={product.id} product={product} />;
}