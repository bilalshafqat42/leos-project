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
            We Turn Ambitious Ideas Into Spaces Built To Last.
          </h2>

          <p className={styles.description}>
            LEOS brings planning, construction and project management together
            under one accountable team. From the first site visit to the final
            handover, every detail is managed with clarity and care.
          </p>

          <a href="#services" className={styles.link}>
            <span>Explore Our Expertise</span>
            <span aria-hidden="true">↗</span>
          </a>

          <div className={styles.metrics} aria-label="LEOS service highlights">
            <div>
              <strong>500+</strong>
              <span>Projects Delivered</span>
            </div>
            <div>
              <strong>10+</strong>
              <span>Years in UAE</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Satisfaction</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel} data-about-right>
        <div className={styles.mediaVisual} data-about-media-visual>
          <Image
            src="/images/about.avif"
            alt="LEOS construction and project management team at work"
            fill
            quality={88}
            sizes="(max-width: 767px) 100vw, 50vw"
            className={styles.aboutImage}
          />
        </div>
      </div>
    </section>
  );
});

About.displayName = "About";

export default About;
