"use client";

import { useLanguage } from "@/components/language-provider";

export default function Loading() {
  const { t } = useLanguage();

  return (
    <main className="route-loading" aria-busy="true" aria-live="polite">
      <span className="loading-mark" aria-hidden="true" />
      <p>{t.loading}</p>
    </main>
  );
}