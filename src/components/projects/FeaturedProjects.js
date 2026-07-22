"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { projects } from "@/data/projects";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./FeaturedProjects.module.css";

/*
 * Condensed, static proof-of-work strip for the Home page. The full
 * drag-to-reveal before/after gallery lives on /services.
 */
export default function FeaturedProjects() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const items = section.querySelectorAll("[data-featured-item]");
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        return undefined;
      }

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 75%" },
      });

      timeline.fromTo(
        items,
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" },
      );

      return () => timeline.kill();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.featured}>
      <div className={styles.container}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow} data-featured-item>
              Selected Transformations
            </p>
            <h2 data-featured-item>Built Again. Better Than Before.</h2>
          </div>

          <div className={styles.headCopy} data-featured-item>
            <p>
              A look at recent renovations, delivered from first site review
              to finishing detail.
            </p>
            <Link href="/services#projects" className={styles.link}>
              <span>View All Projects</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <div className={styles.grid}>
          {projects.map((project) => (
            <Link
              key={project.number}
              href="/services#projects"
              className={styles.card}
              data-featured-item
            >
              <div className={styles.cardMedia}>
                <Image
                  src={project.after}
                  alt={`${project.title} after renovation`}
                  fill
                  quality={85}
                  sizes="(max-width: 900px) 100vw, 33vw"
                  className={styles.cardImage}
                  style={{ objectPosition: project.afterPosition }}
                />
              </div>

              <div className={styles.cardCopy}>
                <span>{project.category}</span>
                <h3>{project.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
