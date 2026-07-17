"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import styles from "@/styles/sections.module.css";

const projects = [
  {
    number: "01",
    title: "Luxury Villa Renovation",
    location: "United Arab Emirates",
    category: "Residential · Renovation",
  },
  {
    number: "02",
    title: "Contemporary Office Fit-Out",
    location: "United Arab Emirates",
    category: "Commercial · Fit-Out",
  },
  {
    number: "03",
    title: "Boutique Retail Interior",
    location: "United Arab Emirates",
    category: "Retail · Interior Delivery",
  },
];

export default function Projects() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const headings = section.querySelectorAll("[data-project-intro]");
      const cards = section.querySelectorAll("[data-project-card]");
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set([...headings, ...cards], { autoAlpha: 1, y: 0 });
        return undefined;
      }

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 76%" },
      });

      timeline
        .fromTo(
          headings,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.1,
            ease: "power3.out",
          },
        )
        .fromTo(
          cards,
          { autoAlpha: 0, y: 48 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            stagger: 0.14,
            ease: "power3.out",
          },
          "-=0.45",
        );

      return () => timeline.kill();
    },
    { scope: sectionRef },
  );

  return (
    <section id="projects" ref={sectionRef} className={styles.projects}>
      <div className={styles.container}>
        <div className={styles.projectsHead}>
          <div>
            <p className={styles.eyebrow} data-project-intro>
              Selected Work
            </p>
            <h2 className={styles.sectionTitleLight} data-project-intro>
              Spaces Defined By Detail.
            </h2>
          </div>
          <p data-project-intro>
            Final project photography can be added here without changing the
            layout or animation system.
          </p>
        </div>

        <div className={styles.projectGrid}>
          {projects.map((project, index) => (
            <article
              key={project.number}
              className={styles.projectCard}
              data-project-card
              data-project-tone={index + 1}
            >
              <div className={styles.projectMedia}>
                <span className={styles.projectIndex}>{project.number}</span>
                <div className={styles.projectLines} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span className={styles.imageNote}>Image to be added</span>
              </div>
              <div className={styles.projectCopy}>
                <p>{project.category}</p>
                <h3>{project.title}</h3>
                <span>{project.location}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
