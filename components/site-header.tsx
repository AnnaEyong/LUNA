"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCart } from "@/store/cart-context";

export function SiteHeader() {
  const { language, setLanguage, t } = useLanguage();
  const { hydrated, itemCount } = useCart();

  return (
    <>
      <div className="announcement-bar">{t.announcement}</div>
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="wordmark" href="/" aria-label="LUNA home">
            LUNA<span aria-hidden="true">.</span>
          </Link>
          <nav aria-label="Main navigation" className="main-navigation">
            <Link href="/">{t.shop}</Link>
          </nav>
          <div className="header-actions">
            <div className="language-switch" role="group" aria-label="Language">
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
            <Link className="bag-link" href="/cart" aria-label={t.bag} title={t.bag}>
              <ShoppingBag size={18} aria-hidden="true" />
              <span>{t.bag}</span>
              {hydrated && itemCount > 0 && <span className="bag-count">{itemCount}</span>}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}