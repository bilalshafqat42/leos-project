"use client";

import { useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Process.module.css";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We align on your vision, priorities, site conditions and investment range.",
  },
  {
    number: "02",
    title: "Define",
    description:
      "Scope, programme, materials and responsibilities are documented before work begins.",
  },
  {
    number: "03",
    title: "Deliver",
    description:
      "Our team coordinates trades, procurement, quality and communication on site.",
  },
  {
    number: "04",
    title: "Handover",
    description:
      "Every detail is reviewed, documented and completed before the keys are yours.",
  },
];

/*
 * Pinned, numbered crossfade — inspired by the Elyse Residence
 * reference's numbered feature list that fades through as you scroll,
 * applied to LEOS's four-stage process.
 */
export default function Process() {
  const sectionRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const stepEls = gsap.utils.toArray(
        section.querySelectorAll("[data-process-step]"),
      );
      const progressFill = section.querySelector("[data-progress-fill]");
      const media = gsap.matchMedia();

      media.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, reduceMotion } = context.conditions ?? {};

          if (reduceMotion || !desktop) {
            gsap.set(stepEls, { autoAlpha: 1, y: 0 });
            gsap.set(progressFill, { scaleX: 1 });
            return undefined;
          }

          gsap.set(stepEls, { autoAlpha: 0, y: 26 });
          gsap.set(stepEls[0], { autoAlpha: 1, y: 0 });
          gsap.set(progressFill, { scaleX: 0, transformOrigin: "left center" });

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.7,
              invalidateOnRefresh: true,
              snap: {
                snapTo: 1 / (stepEls.length - 1),
                duration: { min: 0.2, max: 0.5 },
                delay: 0.1,
                ease: "power2.inOut",
              },
              onUpdate: (self) => {
                const index = Math.min(
                  stepEls.length - 1,
                  Math.round(self.progress * (stepEls.length - 1)),
                );
                setActiveStep((current) =>
                  current === index ? current : index,
                );
              },
            },
          });

          timeline.to(progressFill, {
            scaleX: 1,
            duration: stepEls.length - 1,
          });

          for (let index = 1; index < stepEls.length; index += 1) {
            const position = index - 1;
            const previous = stepEls[index - 1];
            const next = stepEls[index];

            timeline
              .to(
                previous,
                { autoAlpha: 0, y: -26, duration: 0.32, ease: "power2.in" },
                position + 0.55,
              )
              .to(
                next,
                { autoAlpha: 1, y: 0, duration: 0.32, ease: "power2.out" },
                position + 0.68,
              );
          }

          return () => timeline.kill();
        },
      );

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="process"
      ref={sectionRef}
      className={styles.process}
      style={{ "--step-count": steps.length }}
    >
      <div className={styles.stickyViewport}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>How We Work</p>
          <h2 className={styles.heading}>A Clear Route From Brief To Built.</h2>
          <p className={styles.lead}>
            A disciplined process reduces uncertainty, protects quality and
            gives you visibility at every stage.
          </p>

          <div className={styles.progress} aria-hidden="true">
            <span className={styles.progressCount}>
              {String(activeStep + 1).padStart(2, "0")}
              <span> / {String(steps.length).padStart(2, "0")}</span>
            </span>
            <span className={styles.progressTrack}>
              <span className={styles.progressFill} data-progress-fill />
            </span>
          </div>
        </div>

        <div className={styles.stage}>
          {steps.map((step) => (
            <article
              key={step.number}
              className={styles.step}
              data-process-step
            >
              <span className={styles.stepNumber}>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
