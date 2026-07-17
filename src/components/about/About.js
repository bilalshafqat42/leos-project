"use client";

import Image from "next/image";
import { forwardRef } from "react";

import styles from "./About.module.css";

const About = forwardRef(function About({ className = "" }, ref) {
  return (
    <section
      ref={ref}
      id="about"
      className={`${styles.about} ${className}`}
      aria-labelledby="about-title"
    >
      <div className={styles.leftPanel} data-about-left>
        <div className={styles.content} data-about-content>
          <p className={styles.eyebrow}>About LEOS</p>

          <h2 id="about-title" className={styles.title}>
            From Vision To A Space Built Better.
          </h2>

          <p className={styles.description}>
            We manage renovation, fit-out and construction projects with clear
            planning, skilled execution and attention to every detail.
          </p>

          <a href="#services" className={styles.link}>
            <span>Explore Our Services</span>
          </a>
        </div>
      </div>

      <div
        className={styles.rightPanel}
        data-about-right
        data-about-media
      >
        <Image
          src="/images/about/leos-about.jpg"
          alt="Modern interior renovation managed by LEOS Project Management"
          fill
          quality={92}
          sizes="(max-width: 767px) 100vw, 50vw"
          className={styles.image}
        />

        <div className={styles.imageOverlay} aria-hidden="true" />

        <div className={styles.imageCaption} data-about-caption>
          <span className={styles.captionNumber}>01</span>

          <div>
            <p className={styles.captionTitle}>Thoughtful Planning</p>
            <p className={styles.captionText}>
              From concept through completion.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

About.displayName = "About";

export default About;