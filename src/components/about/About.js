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
              <strong>UAE</strong>
              <span>Project delivery</span>
            </div>
            <div>
              <strong>360°</strong>
              <span>Management</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel} data-about-right>
        <div className={styles.mediaVisual} data-about-media-visual>
          <span className={styles.mediaIndex}>01 / LEOS</span>

          <Image
            src="/logos/leos-logo-gold.svg"
            alt=""
            width={556}
            height={631}
            className={styles.watermark}
          />

          <div className={styles.blueprint} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className={styles.mediaCaption}>
            <span>Project photography</span>
            <strong>Reserved for your imagery</strong>
          </div>
        </div>
      </div>
    </section>
  );
});

About.displayName = "About";

export default About;
