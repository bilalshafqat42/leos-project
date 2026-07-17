"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import styles from "@/styles/sections.module.css";

const steps = [
  ["01", "Discover", "We align on your vision, priorities, site conditions and investment range."],
  ["02", "Define", "Scope, programme, materials and responsibilities are documented before work begins."],
  ["03", "Deliver", "Our team coordinates trades, procurement, quality and communication on site."],
  ["04", "Handover", "Every detail is reviewed, documented and completed before the keys are yours."],
];

export default function Process() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const intro = section.querySelectorAll("[data-process-intro]");
      const items = section.querySelectorAll("[data-process-step]");
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set([...intro, ...items], { autoAlpha: 1, y: 0 });
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
            stagger: 0.12,
            ease: "power3.out",
          },
        )
        .fromTo(
          items,
          { autoAlpha: 0, x: 36 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.13,
            ease: "power3.out",
          },
          "-=0.5",
        );

      return () => timeline.kill();
    },
    { scope: sectionRef },
  );

  return (
    <section id="process" ref={sectionRef} className={styles.process}>
      <div className={`${styles.container} ${styles.processGrid}`}>
        <div className={styles.processIntro}>
          <p className={styles.eyebrow} data-process-intro>
            How We Work
          </p>
          <h2 className={styles.sectionTitle} data-process-intro>
            A Clear Route From Brief To Built.
          </h2>
          <p className={styles.sectionLead} data-process-intro>
            A disciplined process reduces uncertainty, protects quality and
            gives you visibility at every stage.
          </p>
        </div>

        <div className={styles.processSteps}>
          {steps.map(([number, title, description]) => (
            <article key={number} className={styles.processStep} data-process-step>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
