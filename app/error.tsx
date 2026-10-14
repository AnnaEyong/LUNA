"use client";

import { useLanguage } from "@/components/language-provider";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const { t } = useLanguage();

  return (
    <main className="not-found-page" role="alert">
      <p className="eyebrow">LUNA</p>
      <h1 className="display-heading">{t.errorTitle}</h1>
      <p>{t.errorDescription}</p>
      <button className="primary-button" type="button" onClick={() => reset()}>
        {t.retry}
      </button>
    </main>
  );
}