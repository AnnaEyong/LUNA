"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FavoriteButton } from "@/components/favorite-button";
import { useLanguage } from "@/components/language-provider";
import { formatPrice } from "@/lib/format-price";
import {
  productCategories,
  type Product,
  type ProductCategory,
} from "@/lib/products";

const colorValues: Record<string, string> = {
  blue: "#7297b3",
  brown: "#9b6946",
  gold: "#c4a456",
  silver: "#b8bdc0",
  white: "#f7f6f1",
};

export function ProductBrowser({ products }: { products: Product[] }) {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  useEffect(() => {
    function syncSearch(event: Event) {
      setSearch((event as CustomEvent<string>).detail);
    }

    window.addEventListener("luna-search-change", syncSearch);
    return () => window.removeEventListener("luna-search-change", syncSearch);
  }, []);

  const colors = [...new Set(products.flatMap((product) => product.colors))].sort();
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLocaleLowerCase(language).includes(search.trim().toLocaleLowerCase(language));
    const matchesCategory = categories.length === 0 || categories.includes(product.category);
    const matchesColor = selectedColors.length === 0 || product.colors.some((color) => selectedColors.includes(color));
    return matchesSearch && matchesCategory && matchesColor;
  });

  function clearFilters() {
    setSearch("");
    setCategories([]);
    setSelectedColors([]);
  }

  function toggleCategory(category: ProductCategory) {
    setCategories((current) =>
      current.includes(category)
        ? current.filter((selected) => selected !== category)
        : [...current, category],
    );
  }

  function toggleColor(color: string) {
    setSelectedColors((current) =>
      current.includes(color)
        ? current.filter((selected) => selected !== color)
        : [...current, color],
    );
  }

  return (
    <section className="collection-section" id="products" aria-labelledby="collection-title">
      <div className="collection-heading">
        <div>
          <p className="eyebrow">{t.collectionNote}</p>
          <h2 id="collection-title" className="display-heading collection-title">
            {t.collection}
          </h2>
        </div>
        <p className="result-count" aria-live="polite">
          {filteredProducts.length} {t.results}
        </p>
      </div>

      <div className="catalog-layout">
        <aside className="filter-sidebar" aria-label={t.filters}>
          <div className="filter-sidebar-heading">
            <h3>{t.filters}</h3>
            <button type="button" className="text-button" onClick={clearFilters}>
              {t.clearFilters}
            </button>
          </div>
          <fieldset className="filter-group">
            <legend>{t.categoryLabel}</legend>
            {productCategories.map((option) => (
              <label className="filter-option" key={option}>
                <input
                  type="checkbox"
                  checked={categories.includes(option)}
                  onChange={() => toggleCategory(option)}
                />
                <span>{t.categories[option]}</span>
                <span className="filter-count">
                  {products.filter((product) => product.category === option).length}
                </span>
              </label>
            ))}
          </fieldset>
          <fieldset className="filter-group color-options">
            <legend>{t.colorLabel}</legend>
            {colors.map((option) => (
              <label className="filter-option" key={option}>
                <input
                  type="checkbox"
                  checked={selectedColors.includes(option)}
                  onChange={() => toggleColor(option)}
                />
                <span
                  className="color-swatch"
                  style={{ backgroundColor: colorValues[option] ?? "#cccccc" }}
                  aria-hidden="true"
                />
                <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                <span className="filter-count">
                  {products.filter((product) => product.colors.includes(option)).length}
                </span>
              </label>
            ))}
          </fieldset>
        </aside>

        <div className="catalog-results">
          <label className="search-field">
            <Search size={18} aria-hidden="true" />
            <span className="visually-hidden">{t.searchLabel}</span>
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                window.dispatchEvent(
                  new CustomEvent("luna-search-change", { detail: event.target.value }),
                );
              }}
              placeholder={t.searchPlaceholder}
            />
            {search && (
              <button
                className="clear-search"
                type="button"
                aria-label={t.clearFilters}
                onClick={() => setSearch("")}
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </label>

          {filteredProducts.length === 0 ? (
            <div className="empty-results" role="status">
              <h3 className="display-heading">{t.noProducts}</h3>
              <p>{t.noProductsNote}</p>
              <button className="text-button" type="button" onClick={clearFilters}>
                {t.clearFilters}
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image-wrap">
                    <Link href={`/products/${product.id}`} aria-label={product.name}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw, (max-height: 640px) 50vh, 33vh"
                        className="product-image"
                      />
                    </Link>
                    {!product.inStock && <span className="stock-badge">{t.outOfStock}</span>}
                    <FavoriteButton
                      productId={product.id}
                      className="product-favorite-button"
                    />
                  </div>
                  <div className="product-card-details">
                    <div>
                      <p className="product-category">{t.categories[product.category]}</p>
                      <Link className="product-name-link" href={`/products/${product.id}`}>
                        <h3>{product.name}</h3>
                      </Link>
                    </div>
                    <p className="product-price">{formatPrice(product.price, language)}</p>
                  </div>
                  <div className="product-swatches" aria-label={product.colors.join(", ")}>
                    {product.colors.map((productColor) => (
                      <span
                        className="color-swatch"
                        key={productColor}
                        style={{ backgroundColor: colorValues[productColor] ?? "#cccccc" }}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}