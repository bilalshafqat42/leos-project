"use client";

import Image from "next/image";
import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Breather.module.css";

/*
 * Full-bleed emotive "breather" section: a single photograph with a
 * short line of copy, used to break up the denser informational
 * sections (Services, Process) the way springs.estate paces its
 * scroll with quiet, image-only beats.
 */
export default function Breather({
  eyebrow,
  heading,
  description,
  image,
  imagePosition = "center",
  imageAlt = "",
}) {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const imageEl = imageRef.current;
      const content = contentRef.current;

      if (!section || !imageEl || !content) return undefined;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(imageEl, { scale: 1, yPercent: 0 });
        gsap.set(content, { autoAlpha: 1, y: 0 });
        return undefined;
      }

      const entrance = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
        },
      });

      entrance.fromTo(
        content,
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" },
      );

      const parallax = gsap.fromTo(
        imageEl,
        { scale: 1.16, yPercent: -3 },
        {
          scale: 1,
          yPercent: 3,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      );

      return () => {
        entrance.kill();
        parallax.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.breather}>
      <div ref={imageRef} className={styles.imageWrapper}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          quality={85}
          sizes="100vw"
          className={styles.image}
          style={{ objectPosition: imagePosition }}
        />
      </div>

      <div className={styles.overlay} aria-hidden="true" />

      <div ref={contentRef} className={styles.content}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.heading}>{heading}</h2>
        {description ? (
          <p className={styles.description}>{description}</p>
        ) : null}
      </div>
    </section>
  );
}
