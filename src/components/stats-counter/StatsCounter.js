"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./StatsCounter.module.css";

const stats = [
  { value: 500, suffix: "+", label: "Projects Delivered" },
  { value: 10, suffix: "+", label: "Years In The UAE" },
  { value: 100, suffix: "%", label: "Client Satisfaction" },
  { value: 7, suffix: "", label: "Core Services" },
];

/*
 * Big animated stat callouts, inspired by the bold count-up figures
 * ("150K sq. ft.", "24/7") used on the Elyse Residence reference site.
 */
export default function StatsCounter() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const items = gsap.utils.toArray(
        section.querySelectorAll("[data-stat-item]"),
      );
      const numbers = gsap.utils.toArray(
        section.querySelectorAll("[data-stat-number]"),
      );
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        numbers.forEach((el, index) => {
          el.textContent = `${stats[index].value}${stats[index].suffix}`;
        });
        return undefined;
      }

      const entrance = gsap.fromTo(
        items,
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 78%" },
        },
      );

      const countTweens = numbers.map((el, index) => {
        const stat = stats[index];
        const proxy = { value: 0 };

        return gsap.to(proxy, {
          value: stat.value,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = `${Math.round(proxy.value)}${stat.suffix}`;
          },
        });
      });

      return () => {
        entrance.kill();
        countTweens.forEach((tween) => tween.kill());
      };
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.stats}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.grid}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat} data-stat-item>
              <span className={styles.number} data-stat-number>
                0{stat.suffix}
              </span>
              <span className={styles.label}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
