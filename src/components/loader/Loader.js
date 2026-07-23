"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Loader.module.css";

const SESSION_KEY = "leos-loader-shown";

export default function Loader() {
  const overlayRef = useRef(null);
  const logoRef = useRef(null);
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

    if (!overlay || !logo) return undefined;

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

    // Simple loading moment: logo fades in on black, holds, fades out.
    const timeline = gsap.timeline({ onComplete: finish });

    timeline
      .set(logo, { autoAlpha: 0 })
      .to(logo, { autoAlpha: 1, duration: 0.9, ease: "power2.out" })
      .to(logo, { autoAlpha: 0, duration: 0.9, ease: "power2.in" }, "+=0.5")
      .to(
        overlay,
        { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" },
        "-=0.15",
      );

    return () => timeline.kill();
  }, []);

  if (!visible) return null;

  return (
    <div ref={overlayRef} className={styles.overlay} aria-hidden="true">
      <Image
        ref={logoRef}
        src="/logos/leos-logo-gold.svg"
        alt=""
        width={300}
        height={300}
        priority
        className={styles.logo}
      />
    </div>
  );
}
