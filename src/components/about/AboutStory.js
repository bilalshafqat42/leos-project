"use client";

import Image from "next/image";
import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./AboutStory.module.css";

export default function AboutStory() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const media = section.querySelector("[data-story-media]");
      const content = section.querySelector("[data-story-content]");
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set([media, content], { autoAlpha: 1, x: 0, y: 0 });
        return undefined;
      }

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 72%" },
      });

      timeline
        .fromTo(
          content,
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 1, y: 0, duration: 0.95, ease: "power3.out" },
        )
        .fromTo(
          media,
          { autoAlpha: 0, y: 44 },
          { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" },
          "-=0.7",
        );

      return () => timeline.kill();
    },
    { scope: sectionRef },
  );

  return (
    <section id="story" ref={sectionRef} className={styles.story}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.content} data-story-content>
            <p className={styles.eyebrow}>Who We Are</p>

            <h2 className={styles.heading}>
              A Single, Accountable Team From Brief To Handover.
            </h2>

            <p className={styles.description}>
              LEOS Project Management was built around one idea: renovation
              and construction shouldn&rsquo;t require juggling separate
              contractors, designers and supervisors. We bring planning,
              trades, procurement and quality control together under one
              roof, so every decision is coordinated and every commitment is
              ours to keep.
            </p>

            <p className={styles.description}>
              From villas and apartments to offices and commercial fit-outs
              across the UAE, our approach stays the same: listen carefully,
              plan thoroughly, and communicate clearly at every stage—so
              there are no surprises between the first site visit and the
              day you get your keys back.
            </p>

            <div className={styles.metrics} aria-label="LEOS service highlights">
              <div>
                <strong>500+</strong>
                <span>Projects Delivered</span>
              </div>
              <div>
                <strong>10+</strong>
                <span>Years in UAE</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Satisfaction</span>
              </div>
            </div>
          </div>

          <div className={styles.media} data-story-media>
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
