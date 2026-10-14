"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { formatPrice } from "@/lib/format-price";
import { products } from "@/lib/products";
import { useCart } from "@/store/cart-context";

export function CartView() {
  const { language, t } = useLanguage();
  const { items, hydrated, updateQuantity, removeItem, clearCart } = useCart();
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const lines = items.flatMap((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return product ? [{ ...item, product }] : [];
  });
  const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  if (!hydrated) {
    return (
      <main className="cart-page" aria-busy="true">
        <p className="cart-loading">{t.loadingCart}</p>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-heading">
          <p className="eyebrow">LUNA</p>
          <h1 className="display-heading">{t.cartTitle}</h1>
          <p>{t.cartNote}</p>
        </div>
        <section className="cart-empty" aria-live="polite">
          <div className="empty-bag-icon" aria-hidden="true">
            <X size={26} />
          </div>
          <h2 className="display-heading">
            {checkoutComplete ? t.checkoutComplete : t.emptyCart}
          </h2>
          {!checkoutComplete && <p>{t.emptyCartNote}</p>}
          <Link className="primary-button" href="/">
            {t.continueShopping}
            <span aria-hidden="true">↘</span>
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-heading">
        <p className="eyebrow">LUNA</p>
        <h1 className="display-heading">{t.cartTitle}</h1>
        <p>{t.cartNote}</p>
      </div>
      <div className="cart-layout">
        <ul className="cart-lines">
          {lines.map(({ product, quantity }) => (
            <li className="cart-line" key={product.id}>
              <Link className="cart-line-image" href={`/products/${product.id}`}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  unoptimized
                  sizes="120px"
                />
              </Link>
              <div className="cart-line-info">
                <p className="product-category">{t.categories[product.category]}</p>
                <Link className="cart-product-name" href={`/products/${product.id}`}>
                  {product.name}
                </Link>
                <p>{formatPrice(product.price, language)}</p>
                <div className="quantity-control" aria-label={`${t.quantity}: ${product.name}`}>
                  <button
                    type="button"
                    aria-label={`${t.quantity} − ${product.name}`}
                    disabled={quantity <= 1}
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                  >
                    <Minus size={14} aria-hidden="true" />
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    aria-label={`${t.quantity} + ${product.name}`}
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                  >
                    <Plus size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="cart-line-end">
                <p>{formatPrice(product.price * quantity, language)}</p>
                <button
                  className="remove-button"
                  type="button"
                  aria-label={`${t.remove} ${product.name}`}
                  onClick={() => removeItem(product.id)}
                >
                  <X size={16} aria-hidden="true" />
                  <span>{t.remove}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>

        <aside className="order-summary" aria-labelledby="summary-title">
          <h2 id="summary-title" className="display-heading">
            {t.total}
          </h2>
          <div className="summary-row">
            <span>{t.subtotal}</span>
            <span>{formatPrice(total, language)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>{t.total}</span>
            <span>{formatPrice(total, language)}</span>
          </div>
          <button
            className="primary-button checkout-button"
            type="button"
            onClick={() => {
              clearCart();
              setCheckoutComplete(true);
            }}
          >
            {t.checkout}
            <span aria-hidden="true">↗</span>
          </button>
        </aside>
      </div>
    </main>
  );
}