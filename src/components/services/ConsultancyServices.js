"use client";

import { useRef } from "react";

import { consultancyServices } from "@/data/consultancy-services";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "@/styles/sections.module.css";

/*
 * The formal consultancy / trading / engineering activities licensed
 * under the LEOS trade license, shown as a secondary services tier
 * beneath the consumer renovation offering.
 */
export default function ConsultancyServices() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const head = section.querySelectorAll("[data-consultancy-head]");
      const rows = section.querySelectorAll("[data-consultancy-row]");
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set([...head, ...rows], { autoAlpha: 1, y: 0 });
        return undefined;
      }

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 78%" },
      });

      timeline
        .fromTo(
          head,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.1, ease: "power3.out" },
        )
        .fromTo(
          rows,
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "power3.out" },
          "-=0.45",
        );

      return () => timeline.kill();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.services}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow} data-consultancy-head>
            Licensed Activities
          </p>
          <h2 className={styles.sectionTitle} data-consultancy-head>
            Consultancy &amp; Engineering Services
          </h2>
          <p className={styles.sectionLead} data-consultancy-head>
            Alongside renovation and fit-out, LEOS is licensed for the
            following consultancy, trading and engineering activities.
          </p>
        </div>

        <div className={styles.serviceList}>
          {consultancyServices.map((service) => (
            <div
              key={service.number}
              className={styles.serviceRow}
              data-consultancy-row
            >
              <span className={styles.serviceNumber}>{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className={styles.serviceScope}>{service.scope}</span>
              <span className={styles.serviceArrow} aria-hidden="true">
                ↗
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
