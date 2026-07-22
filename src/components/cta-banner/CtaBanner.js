"use client";

import Link from "next/link";
import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { useBookingModal } from "@/components/booking-modal/booking-modal-context";
import styles from "./CtaBanner.module.css";

export default function CtaBanner({
  eyebrow = "Ready When You Are",
  heading,
  lead,
}) {
  const sectionRef = useRef(null);
  const { open: openBookingModal } = useBookingModal();

  useGSAP(
    () => {
      const section = sectionRef.current;
      const container = section?.querySelector("[data-cta-container]");
      if (!section || !container) return undefined;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(container, { autoAlpha: 1, y: 0 });
        return undefined;
      }

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 80%" },
      });

      timeline.fromTo(
        container,
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" },
      );

      return () => timeline.kill();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.cta}>
      <div className={styles.container} data-cta-container>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.heading}>{heading}</h2>
        {lead ? <p className={styles.lead}>{lead}</p> : null}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={openBookingModal}
            className={styles.primary}
          >
            <span>Book a Free Site Visit</span>
            <span aria-hidden="true">↗</span>
          </button>

          <Link href="/contact" className={styles.secondary}>
            <span>Contact Us</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
