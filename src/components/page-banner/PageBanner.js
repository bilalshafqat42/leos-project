"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./PageBanner.module.css";

/*
 * Shared intro banner for interior pages (About, Services, Contact) so
 * each page opens with a consistent, on-brand moment under the fixed
 * header instead of jumping straight into dense content.
 */
export default function PageBanner({ eyebrow, heading, lead }) {
  const bannerRef = useRef(null);

  useGSAP(
    () => {
      const banner = bannerRef.current;
      if (!banner) return undefined;

      const items = banner.querySelectorAll("[data-banner-item]");
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        return undefined;
      }

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      timeline.fromTo(
        items,
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.1 },
      );

      return () => timeline.kill();
    },
    { scope: bannerRef },
  );

  return (
    <section ref={bannerRef} className={styles.banner}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.container}>
        <p className={styles.eyebrow} data-banner-item>
          {eyebrow}
        </p>
        <h1 className={styles.heading} data-banner-item>
          {heading}
        </h1>
        {lead ? (
          <p className={styles.lead} data-banner-item>
            {lead}
          </p>
        ) : null}
      </div>
    </section>
  );
}
