"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Projects.module.css";

const projects = [
  {
    number: "01",
    category: "Villa Renovation",
    title: "A Home Reimagined Around Light.",
    description:
      "A complete residential transformation balancing contemporary detail, generous living spaces and a calm material palette.",
    location: "Dubai, UAE",
    scope: "Turnkey Renovation",
    before: "/images/hero.avif",
    after: "/images/about.avif",
    beforePosition: "42% center",
    afterPosition: "center",
    reveal: 58,
  },
  {
    number: "02",
    category: "Kitchen Renovation",
    title: "Better Flow. Beautifully Resolved.",
    description:
      "A brighter, more functional interior shaped through considered planning, custom joinery and carefully coordinated finishes.",
    location: "Ajman, UAE",
    scope: "Kitchen & Joinery",
    before: "/images/about.avif",
    after: "/images/hero.avif",
    beforePosition: "68% center",
    afterPosition: "58% center",
    reveal: 52,
  },
  {
    number: "03",
    category: "Office Fit-Out",
    title: "A Workplace Built For Momentum.",
    description:
      "An end-to-end fit-out bringing structure, services and refined interior details together in one accountable delivery.",
    location: "United Arab Emirates",
    scope: "Commercial Fit-Out",
    before: "/images/hero.avif",
    after: "/images/about.avif",
    beforePosition: "72% center",
    afterPosition: "54% center",
    reveal: 63,
  },
];

export default function Projects() {
  const sectionRef = useRef(null);
  const [revealPositions, setRevealPositions] = useState(() =>
    projects.map((project) => project.reveal),
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const introItems = gsap.utils.toArray(
        section.querySelectorAll("[data-project-intro]"),
      );
      const cards = gsap.utils.toArray(
        section.querySelectorAll("[data-project-card]"),
      );
      const media = gsap.matchMedia();

      media.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, mobile, reduceMotion } = context.conditions ?? {};

          if (reduceMotion) {
            gsap.set([...introItems, ...cards], {
              clearProps: "all",
              autoAlpha: 1,
              y: 0,
              scale: 1,
              filter: "none",
              clipPath: "none",
            });
            return undefined;
          }

          const introTween = gsap.fromTo(
            introItems,
            { autoAlpha: 0, y: 38 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.95,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 78%",
              },
            },
          );

          const cardTweens = cards.flatMap((card, index) => {
            const images = card.querySelectorAll("[data-project-image]");
            const entrance = gsap.fromTo(
              card,
              {
                autoAlpha: 0,
                y: mobile ? 58 : 110,
                clipPath: "inset(7% 3% 7% 3% round 24px)",
              },
              {
                autoAlpha: 1,
                y: 0,
                clipPath: "inset(0% 0% 0% 0% round 24px)",
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 91%",
                  end: "top 58%",
                  scrub: 0.7,
                },
              },
            );

            const imageMotion = gsap.fromTo(
              images,
              { scale: 1.075, yPercent: -2 },
              {
                scale: 1,
                yPercent: 2,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.9,
                },
              },
            );

            const tweens = [entrance, imageMotion];

            if (desktop && index < cards.length - 1) {
              const nextCard = cards[index + 1];
              const stackTween = gsap.to(card, {
                scale: 0.972,
                filter: "brightness(0.72)",
                ease: "none",
                scrollTrigger: {
                  trigger: nextCard,
                  start: "top 88%",
                  end: "top 20%",
                  scrub: 0.8,
                },
              });

              tweens.push(stackTween);
            }

            return tweens;
          });

          return () => {
            introTween.kill();
            cardTweens.forEach((tween) => tween.kill());
          };
        },
      );

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  function updateReveal(index, value) {
    setRevealPositions((current) =>
      current.map((position, itemIndex) =>
        itemIndex === index ? Number(value) : position,
      ),
    );
  }

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
              Move the gold line to explore each transformation. Every project
              is managed from the first site review to the finishing detail.
            </p>
            <span>Drag to reveal</span>
          </div>
        </div>

        <div className={styles.stories}>
          {projects.map((project, index) => (
            <article
              key={project.number}
              className={styles.story}
              data-project-card
              data-reverse={index % 2 === 1 ? "true" : "false"}
              style={{
                "--stack-offset": `${index * 18}px`,
                zIndex: index + 1,
              }}
            >
              <div className={styles.storyInfo}>
                <div className={styles.storyTopline}>
                  <span>{project.number}</span>
                  <span>{project.category}</span>
                </div>

                <h3>{project.title}</h3>
                <p className={styles.storyDescription}>{project.description}</p>

                <dl className={styles.projectFacts}>
                  <div>
                    <dt>Location</dt>
                    <dd>{project.location}</dd>
                  </div>
                  <div>
                    <dt>Scope</dt>
                    <dd>{project.scope}</dd>
                  </div>
                </dl>

                <p className={styles.dragNote}>
                  <span aria-hidden="true">↔</span>
                  Drag across the image
                </p>
              </div>

              <div
                className={styles.comparison}
                style={{ "--reveal": `${revealPositions[index]}%` }}
              >
                <Image
                  src={project.after}
                  alt={`${project.title} after renovation`}
                  fill
                  quality={88}
                  sizes="(max-width: 767px) 100vw, 64vw"
                  className={styles.projectImage}
                  style={{ objectPosition: project.afterPosition }}
                  data-project-image
                />

                <div className={styles.beforeLayer}>
                  <Image
                    src={project.before}
                    alt={`${project.title} before renovation`}
                    fill
                    quality={88}
                    sizes="(max-width: 767px) 100vw, 64vw"
                    className={styles.projectImage}
                    style={{ objectPosition: project.beforePosition }}
                    data-project-image
                  />
                </div>

                <span className={`${styles.imageLabel} ${styles.beforeLabel}`}>
                  Before
                </span>
                <span className={`${styles.imageLabel} ${styles.afterLabel}`}>
                  After
                </span>

                <div className={styles.revealLine} aria-hidden="true">
                  <span>↔</span>
                </div>

                <input
                  className={styles.revealControl}
                  type="range"
                  min="8"
                  max="92"
                  value={revealPositions[index]}
                  onChange={(event) => updateReveal(index, event.target.value)}
                  aria-label={`Reveal the before and after view for ${project.title}`}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
