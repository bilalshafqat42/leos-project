"use client";

import Image from "next/image";
import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./BrandStatement.module.css";

/*
 * A single, quiet "brand moment": a giant overlapping wordmark laid
 * over a full-bleed photo, inspired by the huge "ELYSE" treatment in
 * the Elyse Residence reference video, rebuilt in LEOS's own colors.
 */
export default function BrandStatement() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const image = imageRef.current;
      if (!section || !image) return undefined;

      const eyebrow = section.querySelector("[data-brand-eyebrow]");
      const wordmark = section.querySelector("[data-brand-wordmark]");
      const tagline = section.querySelector("[data-brand-tagline]");
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set([eyebrow, wordmark, tagline], { autoAlpha: 1, y: 0 });
        gsap.set(image, { scale: 1 });
        return undefined;
      }

      gsap.set([eyebrow, wordmark, tagline], { autoAlpha: 0, y: 32 });
      gsap.set(image, { scale: 1.14 });

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 70%" },
      });

      timeline
        .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" })
        .to(
          wordmark,
          { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" },
          "-=0.5",
        )
        .to(
          tagline,
          { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.6",
        );

      const parallax = gsap.to(image, {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        timeline.kill();
        parallax.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.statement}>
      <div ref={imageRef} className={styles.imageWrapper}>
        <Image
          src="/images/hero.avif"
          alt=""
          fill
          quality={85}
          sizes="100vw"
          className={styles.image}
          style={{ objectPosition: "65% 40%" }}
        />
      </div>

      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.content}>
        <p className={styles.eyebrow} data-brand-eyebrow>
          Renovation · Fit-Out · Construction
        </p>

        <h2 className={styles.wordmark} data-brand-wordmark>
          LEOS
        </h2>

        <p className={styles.tagline} data-brand-tagline>
          Building with purpose. Delivering with precision.
        </p>
      </div>
    </section>
  );
}
