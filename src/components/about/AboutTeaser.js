"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./AboutTeaser.module.css";

export default function AboutTeaser() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const media = section.querySelector("[data-teaser-media]");
      const content = section.querySelector("[data-teaser-content]");
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set([media, content], { autoAlpha: 1, y: 0 });
        return undefined;
      }

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 75%" },
      });

      timeline
        .fromTo(
          content,
          { autoAlpha: 0, y: 34 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" },
        )
        .fromTo(
          media,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.95, ease: "power3.out" },
          "-=0.65",
        );

      return () => timeline.kill();
    },
    { scope: sectionRef },
  );

  return (
    <section id="about" ref={sectionRef} className={styles.teaser}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.content} data-teaser-content>
            <p className={styles.eyebrow}>About LEOS</p>

            <h2 className={styles.heading}>
              We Turn Ambitious Ideas Into Spaces Built To Last.
            </h2>

            <p className={styles.description}>
              LEOS brings planning, construction and project management
              together under one accountable team. From the first site visit
              to the final handover, every detail is managed with clarity and
              care.
            </p>

            <Link href="/about" className={styles.link}>
              <span>Our Story</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className={styles.media} data-teaser-media>
            <Image
              src="/images/about.avif"
              alt="LEOS construction and project management team at work"
              fill
              quality={88}
              sizes="(max-width: 900px) 100vw, 50vw"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
