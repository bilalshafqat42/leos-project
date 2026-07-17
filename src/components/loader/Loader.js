"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Loader.module.css";

const SESSION_KEY = "leos-loader-shown";

export default function Loader() {
  const overlayRef = useRef(null);
  const logoRef = useRef(null);
  const lineRef = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  useGSAP(() => {
    const overlay = overlayRef.current;
    const logo = logoRef.current;
    const line = lineRef.current;

    if (!overlay || !logo || !line) return undefined;

    const finish = () => {
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        // Storage may be unavailable; the loader can safely replay.
      }

      setVisible(false);
    };

    let alreadyShown = false;

    try {
      alreadyShown = sessionStorage.getItem(SESSION_KEY) === "true";
    } catch {
      alreadyShown = false;
    }

    if (
      alreadyShown ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      finish();
      return undefined;
    }

    const timeline = gsap.timeline({ onComplete: finish });

    timeline
      .fromTo(
        logo,
        { autoAlpha: 0, y: 18, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" },
      )
      .fromTo(
        line,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.05, ease: "power3.inOut" },
        0.2,
      )
      .to(logo, { autoAlpha: 0, y: -12, duration: 0.5, ease: "power2.in" }, 1.35)
      .to(
        overlay,
        { clipPath: "inset(0 0 100% 0)", duration: 0.85, ease: "power4.inOut" },
        1.5,
      );

    return () => timeline.kill();
  }, []);

  if (!visible) return null;

  return (
    <div ref={overlayRef} className={styles.overlay} aria-hidden="true">
      <div ref={logoRef} className={styles.logoWrap}>
        <Image
          src="/logos/leos-logo-gold.svg"
          alt=""
          width={556}
          height={631}
          priority
          className={styles.logo}
        />
        <span ref={lineRef} className={styles.line} />
      </div>
      <span className={styles.label}>Project Management · UAE</span>
    </div>
  );
}
