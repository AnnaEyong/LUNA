"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <main className="not-found-page">
      <p className="eyebrow">404</p>
      <h1 className="display-heading">{t.notFoundTitle}</h1>
      <p>{t.notFoundNote}</p>
      <Link className="primary-button" href="/">
        {t.backToShop}
        <span aria-hidden="true">↘</span>
      </Link>
    </main>
  );
}