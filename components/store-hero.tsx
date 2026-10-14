"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export function StoreHero() {
  const { t } = useLanguage();

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">{t.heroEyebrow}</p>
        <h1 className="display-heading" id="hero-title">
          {t.heroTitle}
        </h1>
        <p className="hero-description">{t.heroDescription}</p>
        <Link className="primary-button" href="#products">
          {t.discoverCollection}
          <span aria-hidden="true">↘</span>
        </Link>
      </div>
      <div className="hero-art">
        <div className="hero-image-frame">
          <Image
            src="/hero1.png"
            alt="Model portrait for the LUNA accessories collection"
            fill
            unoptimized
            preload
            sizes="(max-width: 760px) 80vw, 44vw"
            className="hero-image"
          />
        </div>
      </div>
    </section>
  );
}