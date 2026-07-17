"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import styles from "@/styles/sections.module.css";

const services = [
  {
    number: "01",
    title: "Renovation & Fit-Out",
    description:
      "Complete transformations for villas, apartments, offices and retail environments—from strip-out to final styling.",
    scope: "Residential · Commercial · Retail",
  },
  {
    number: "02",
    title: "Construction",
    description:
      "Disciplined site delivery with experienced trades, transparent coordination and uncompromising quality control.",
    scope: "Civil Works · MEP · Finishes",
  },
  {
    number: "03",
    title: "Project Management",
    description:
      "One accountable team managing scope, schedule, procurement, budget and communication from concept to handover.",
    scope: "Planning · Supervision · Handover",
  },
  {
    number: "04",
    title: "Interior Delivery",
    description:
      "Design-led material, joinery, lighting and furniture coordination for spaces that feel resolved and ready to use.",
    scope: "Design Support · FF&E · Styling",
  },
];

export default function Services() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const intro = section.querySelectorAll("[data-section-intro]");
      const rows = section.querySelectorAll("[data-service-row]");
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set([...intro, ...rows], { autoAlpha: 1, y: 0 });
        return undefined;
      }

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 76%" },
      });

      timeline
        .fromTo(
          intro,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
          },
        )
        .fromTo(
          rows,
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.11,
            ease: "power3.out",
          },
          "-=0.5",
        );

      return () => timeline.kill();
    },
    { scope: sectionRef },
  );

  return (
    <section id="services" ref={sectionRef} className={styles.services}>
      <div className={styles.container}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow} data-section-intro>
            Our Expertise
          </p>
          <h2 className={styles.sectionTitle} data-section-intro>
            One Team. Every Detail. Complete Delivery.
          </h2>
          <p className={styles.sectionLead} data-section-intro>
            Integrated services shaped around your brief, with clear ownership
            from the first decision to the final finish.
          </p>
        </div>

        <div className={styles.serviceList}>
          {services.map((service) => (
            <article
              key={service.number}
              className={styles.serviceRow}
              data-service-row
            >
              <span className={styles.serviceNumber}>{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className={styles.serviceScope}>{service.scope}</span>
              <span className={styles.serviceArrow} aria-hidden="true">
                ↗
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
