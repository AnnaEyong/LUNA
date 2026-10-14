import productData from "@/data/products.json";

export const productCategories = ["necklace", "earring", "top"] as const;

export type ProductCategory = (typeof productCategories)[number];

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  colors: string[];
  price: number;
  image: string;
  inStock: boolean;
};

export const products = productData as Product[];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductColors(): string[] {
  return [...new Set(products.flatMap((product) => product.colors))].sort();
}