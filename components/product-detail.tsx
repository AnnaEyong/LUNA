"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Minus, Plus, Star } from "lucide-react";
import { useState } from "react";
import { FavoriteButton } from "@/components/favorite-button";
import { useLanguage } from "@/components/language-provider";
import { formatPrice } from "@/lib/format-price";
import { products, type Product } from "@/lib/products";
import { useCart } from "@/store/cart-context";

const detailTabs = ["description", "details", "shipping"] as const;

export function ProductDetail({ product }: { product: Product }) {
  const { language, t } = useLanguage();
  const { addItem, hydrated } = useCart();
  const [activeColor, setActiveColor] = useState(product.colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<(typeof detailTabs)[number]>("description");
  const [added, setAdded] = useState(false);

  const relatedProducts = products.filter((item) => item.id !== product.id).slice(0, 4);

  function addToBag() {
    addItem(product.id, quantity);
    setAdded(true);
  }

  return (
    <main className="detail-page">
      <nav className="product-breadcrumb" aria-label={t.breadcrumb}>
        <Link href="/">{t.home}</Link>
        <ChevronRight size={13} aria-hidden="true" />
        <Link href="/#products">{t.categories[product.category]}</Link>
        <ChevronRight size={13} aria-hidden="true" />
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className="detail-layout">
        <section className="product-gallery" aria-label={t.productGallery}>
          <div className="detail-image-wrap">
            <Image
              src={product.image}
              alt={product.name}
              fill
              unoptimized
              sizes="(max-width: 760px) 55vw, 42vw"
              className="detail-image"
              priority
            />
            <FavoriteButton
              productId={product.id}
              className="product-favorite-button detail-favorite-button"
            />
          </div>
        </section>

        <section className="detail-copy" aria-labelledby="product-title">
          <h1 className="display-heading" id="product-title">
            {product.name}
          </h1>
          <p className="eyebrow">{t.categories[product.category]}</p>
          <p className="detail-price">{formatPrice(product.price, language)}</p>
          <div className="product-rating" aria-label={`${t.rating}: 4.8 ${t.outOfFive}`}>
            <span className="rating-stars" aria-hidden="true">
              {Array.from({ length: 5 }, (_, index) => (
                <Star key={index} size={13} fill="currentColor" aria-hidden="true" />
              ))}
            </span>
            <span>4.8</span>
            <span className="rating-separator">|</span>
            <span>124 {t.reviews}</span>
          </div>
          <div className="detail-purchase-stack">
            <p className={product.inStock ? "availability is-available" : "availability is-sold-out"}>
              <span aria-hidden="true" />
              {product.inStock ? t.inStock : t.outOfStock}
            </p>
            <div className="detail-colors">
              <h2>{t.colorChoices}</h2>
              <div className="detail-color-options" role="group" aria-label={t.selectColor}>
                {product.colors.map((color) => (
                  <button
                    className={activeColor === color ? "detail-color-option is-selected" : "detail-color-option"}
                    type="button"
                    key={color}
                    aria-label={color.charAt(0).toUpperCase() + color.slice(1)}
                    aria-pressed={activeColor === color}
                    onClick={() => setActiveColor(color)}
                  >
                    <span className={`detail-swatch swatch-${color}`} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>

            <div className="detail-purchase-row">
              <div className="quantity-control" aria-label={t.quantity}>
                <button
                  type="button"
                  aria-label={t.decreaseQuantity}
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                >
                  <Minus size={13} aria-hidden="true" />
                </button>
                <span aria-live="polite">{quantity}</span>
                <button
                  type="button"
                  aria-label={t.increaseQuantity}
                  onClick={() => setQuantity((current) => Math.min(99, current + 1))}
                >
                  <Plus size={13} aria-hidden="true" />
                </button>
              </div>
              <button
                className="primary-button add-to-bag"
                type="button"
                disabled={!product.inStock || !hydrated}
                onClick={addToBag}
              >
                {added ? t.addedToBag : t.addToBag}
              </button>
            </div>

            <p className="add-status" aria-live="polite">
              {added ? t.addedToBag : ""}
            </p>
          </div>
        </section>
      </div>

      <section className="product-information" aria-label={t.productInformation}>
        <div className="detail-tabs" role="tablist" aria-label={t.productInformation}>
          {detailTabs.map((tab) => (
            <button
              className={activeTab === tab ? "detail-tab is-active" : "detail-tab"}
              id={`product-tab-${tab}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls="product-tab-panel"
              key={tab}
              onClick={() => setActiveTab(tab)}
            >
              {t[`${tab}Tab`]}
            </button>
          ))}
        </div>
        <div
          className="detail-tab-panel"
          id="product-tab-panel"
          role="tabpanel"
          aria-labelledby={`product-tab-${activeTab}`}
        >
          {activeTab === "description" && <p>{t.productDescription}</p>}
          {activeTab === "details" && (
            <p>{t.productDetails}: {t.categories[product.category]} · {product.colors.join(", ")}</p>
          )}
          {activeTab === "shipping" && <p>{t.shippingDescription}</p>}
        </div>
      </section>

      <section className="related-products-section" aria-labelledby="related-products-title">
        <h2 className="display-heading" id="related-products-title">
          {t.relatedProducts}
        </h2>
        <div className="related-products-grid">
          {relatedProducts.map((item) => (
            <article className="related-product-card" key={item.id}>
              <div className="related-product-image">
                <Link href={`/products/${item.id}`} aria-label={item.name}>
                  <Image src={item.image} alt={item.name} fill unoptimized sizes="(max-width: 640px) 44vw, 20vw" />
                </Link>
                <FavoriteButton productId={item.id} className="related-favorite-button" />
              </div>
              <Link className="related-product-name" href={`/products/${item.id}`}>
                {item.name}
              </Link>
              <p>{formatPrice(item.price, language)}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}