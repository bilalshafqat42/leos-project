"use client";

import Image from "next/image";
import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { projects } from "@/data/projects";
import styles from "./Projects.module.css";

/*
 * Clean, editorial project gallery: one full-bleed "after" photo per
 * project with a small inset "before" chip, caption on the image,
 * and a slow parallax zoom. Replaces the earlier drag-to-reveal
 * comparison card design.
 */
export default function Projects() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const introItems = gsap.utils.toArray(
        section.querySelectorAll("[data-project-intro]"),
      );
      const stories = gsap.utils.toArray(
        section.querySelectorAll("[data-project-story]"),
      );
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set([...introItems, ...stories], {
          autoAlpha: 1,
          y: 0,
          scale: 1,
        });
        return undefined;
      }

      const introTween = gsap.fromTo(
        introItems,
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

      const storyTweens = stories.map((story) => {
        const media = story.querySelector("[data-project-media]");
        const chip = story.querySelector("[data-project-chip]");
        const details = story.querySelector("[data-project-details]");

        const entrance = gsap.fromTo(
          [media, details],
          { autoAlpha: 0, y: 50 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.95,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: story, start: "top 82%" },
          },
        );

        const chipTween = chip
          ? gsap.fromTo(
              chip,
              { autoAlpha: 0, y: 24 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: { trigger: story, start: "top 74%" },
              },
            )
          : null;

        const parallax = media
          ? gsap.fromTo(
              media.querySelector("img"),
              { scale: 1.15 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: story,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                },
              },
            )
          : null;

        return { entrance, chipTween, parallax };
      });

      return () => {
        introTween.kill();
        storyTweens.forEach(({ entrance, chipTween, parallax }) => {
          entrance.kill();
          chipTween?.kill();
          parallax?.kill();
        });
      };
    },
    { scope: sectionRef },
  );

  return (
    <section id="projects" ref={sectionRef} className={styles.projects}>
      <div className={styles.container}>
        <div className={styles.projectsHead}>
          <div>
            <p className={styles.eyebrow} data-project-intro>
              Selected Transformations
            </p>
            <h2 data-project-intro>Built Again. Better Than Before.</h2>
          </div>

          <div className={styles.introCopy} data-project-intro>
            <p>
              A look at recent renovations, delivered from the first site
              review to the finishing detail.
            </p>
          </div>
        </div>

        <div className={styles.stories}>
          {projects.map((project) => (
            <article
              key={project.number}
              className={styles.story}
              data-project-story
            >
              <div className={styles.media} data-project-media>
                <Image
                  src={project.after}
                  alt={`${project.title} after renovation`}
                  fill
                  quality={88}
                  sizes="(max-width: 767px) 100vw, 90vw"
                  className={styles.image}
                  style={{ objectPosition: project.afterPosition }}
                />

                <div className={styles.scrim} aria-hidden="true" />

                <div className={styles.caption}>
                  <div>
                    <p className={styles.captionTopline}>
                      <span>{project.number}</span>
                      <span>{project.category}</span>
                    </p>
                    <h3>{project.title}</h3>
                  </div>
                </div>

                <div className={styles.beforeChip} data-project-chip>
                  <Image
                    src={project.before}
                    alt={`${project.title} before renovation`}
                    fill
                    quality={70}
                    sizes="150px"
                    className={styles.image}
                    style={{ objectPosition: project.beforePosition }}
                  />
                </div>
              </div>

              <div className={styles.details} data-project-details>
                <p className={styles.description}>{project.description}</p>

                <dl className={styles.facts}>
                  <div>
                    <dt>Location</dt>
                    <dd>{project.location}</dd>
                  </div>
                  <div>
                    <dt>Scope</dt>
                    <dd>{project.scope}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
