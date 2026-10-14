"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { FavoriteButton } from "@/components/favorite-button";
import { formatPrice } from "@/lib/format-price";
import { products } from "@/lib/products";
import { useFavorites } from "@/store/favorites-context";

export function FavoritesView() {
  const { language, t } = useLanguage();
  const { favoriteIds, hydrated } = useFavorites();
  const favoriteProducts = favoriteIds
    .map((productId) => products.find((product) => product.id === productId))
    .filter((product) => product !== undefined);

  if (!hydrated) {
    return (
      <main className="cart-page" aria-busy="true">
        <p className="cart-loading">{t.loading}</p>
      </main>
    );
  }

  return (
    <main className="cart-page favorites-page">
      <div className="cart-heading">
        <p className="eyebrow">LUNA</p>
        <h1 className="display-heading">{t.favoritesTitle}</h1>
        <p>{t.favoritesNote}</p>
      </div>

      {favoriteProducts.length === 0 ? (
        <section className="cart-empty" role="status">
          <h2 className="display-heading">{t.favoritesEmptyTitle}</h2>
          <p>{t.favoritesEmptyNote}</p>
          <Link className="primary-button" href="/#products">
            {t.continueShopping}
          </Link>
        </section>
      ) : (
        <div className="favorite-grid">
          {favoriteProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image-wrap">
                <Link href={`/products/${product.id}`} aria-label={product.name}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="product-image"
                  />
                </Link>
                <FavoriteButton
                  productId={product.id}
                  className="product-favorite-button"
                />
              </div>
              <div className="product-card-details">
                <div>
                  <p className="product-category">{t.categories[product.category]}</p>
                  <Link className="product-name-link" href={`/products/${product.id}`}>
                    <h2>{product.name}</h2>
                  </Link>
                </div>
                <p className="product-price">{formatPrice(product.price, language)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}