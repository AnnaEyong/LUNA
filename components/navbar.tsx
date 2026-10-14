"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCart } from "@/store/cart-context";
import { useFavorites } from "@/store/favorites-context";

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { hydrated, itemCount } = useCart();
  const { favoriteCount, hydrated: favoritesHydrated } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    function syncSearch(event: Event) {
      setSearch((event as CustomEvent<string>).detail);
    }

    window.addEventListener("luna-search-change", syncSearch);
    return () => window.removeEventListener("luna-search-change", syncSearch);
  }, []);

  const links = [
    { href: "/", label: t.home },
    { href: "/#products", label: t.categories.necklace },
    { href: "/#products", label: t.categories.earring },
    { href: "/#products", label: t.categories.top },
  ];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="wordmark" href="/" aria-label="LUNA home">
          LUNA
        </Link>

        <nav aria-label="Main navigation" className="main-navigation">
          {links.map((link) => (
            <Link href={link.href} key={link.label}>
              {link.label}
            </Link>
          ))}
        </nav>

        <label className="nav-search">
          <Search size={15} aria-hidden="true" />
          <span className="visually-hidden">{t.searchLabel}</span>
          <input
            type="search"
            value={search}
            placeholder={t.navSearchPlaceholder}
            onChange={(event) => {
              setSearch(event.target.value);
              window.dispatchEvent(
                new CustomEvent("luna-search-change", { detail: event.target.value }),
              );
            }}
          />
        </label>

        <div className="header-actions">
          <details className="nav-settings">
            <summary className="nav-icon-button" aria-label={t.preferences} title={t.preferences}>
              <UserRound size={16} aria-hidden="true" />
            </summary>
            <div className="nav-preferences">
              <div className="language-switch" role="group" aria-label={t.language}>
                {(["en", "fr"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={language === option}
                    onClick={() => setLanguage(option)}
                  >
                    {option.toUpperCase()}
                  </button>
                ))}
              </div>
              <ThemeToggle />
            </div>
          </details>

          <Link
            className="bag-link nav-icon-button"
            href="/favorites"
            aria-label={favoritesHydrated && favoriteCount > 0 ? `${t.favorites}: ${favoriteCount}` : t.favorites}
            title={t.favorites}
          >
            <Heart size={16} aria-hidden="true" />
            {favoritesHydrated && favoriteCount > 0 && (
              <span className="bag-count">{favoriteCount}</span>
            )}
          </Link>

          <Link className="bag-link nav-icon-button" href="/cart" aria-label={t.bag} title={t.bag}>
            <ShoppingBag size={16} aria-hidden="true" />
            {hydrated && itemCount > 0 && <span className="bag-count">{itemCount}</span>}
          </Link>

          <button
            className="nav-icon-button mobile-nav-button"
            type="button"
            aria-label={mobileMenuOpen ? t.closeMenu : t.openMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={17} aria-hidden="true" /> : <Menu size={17} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav aria-label="Mobile navigation" className="mobile-navigation" id="mobile-navigation">
          {links.map((link) => (
            <Link href={link.href} key={link.label} onClick={() => setMobileMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}