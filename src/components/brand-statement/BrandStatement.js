"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./BrandStatement.module.css";

const SLIDE_DURATION = 6000;

/*
 * A "brand moment": a giant static wordmark anchored over a full-bleed
 * photo, inspired by the huge "ELYSE" treatment in the Elyse Residence
 * reference video, rebuilt in LEOS's own colors. The eyebrow, tagline
 * and photo now cycle through the three core capabilities.
 */
const slides = [
  {
    eyebrow: "Renovation",
    tagline: "Building with purpose. Delivering with precision.",
    image: "/images/hero.avif",
    imagePosition: "65% 40%",
  },
  {
    eyebrow: "Fit-Out",
    tagline: "Spaces shaped around how you live and work, start to finish.",
    image: "/images/about.avif",
    imagePosition: "50% 30%",
  },
  {
    eyebrow: "Construction",
    tagline: "Built on solid foundations, from structure to final finish.",
    image: "/images/hero.avif",
    imagePosition: "22% 62%",
  },
];

export default function BrandStatement() {
  const sectionRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const slideRefs = useRef([]);
  const eyebrowRef = useRef(null);
  const wordmarkRef = useRef(null);
  const taglineRef = useRef(null);
  const dotFillRefs = useRef([]);

  const indexRef = useRef(0);
  const timerRef = useRef(null);
  const hoverPausedRef = useRef(false);
  const hiddenPausedRef = useRef(false);
  const pausedRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const scheduleNextRef = useRef(() => {});

  const [activeIndex, setActiveIndex] = useState(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const playDotFill = useCallback((index) => {
    dotFillRefs.current.forEach((el) => {
      if (!el) return;
      gsap.killTweensOf(el);
      gsap.set(el, { scaleX: 0 });
    });

    const active = dotFillRefs.current[index];
    if (!active) return;

    gsap.to(active, {
      scaleX: 1,
      duration: SLIDE_DURATION / 1000,
      ease: "none",
    });
  }, []);

  const goTo = useCallback(
    (next) => {
      const prev = indexRef.current;
      if (next === prev) return;

      const prevSlide = slideRefs.current[prev];
      const nextSlide = slideRefs.current[next];
      const textEls = [eyebrowRef.current, taglineRef.current].filter(Boolean);

      const timeline = gsap.timeline();

      timeline
        .to(prevSlide, { autoAlpha: 0, duration: 1.1, ease: "power2.inOut" }, 0)
        .to(nextSlide, { autoAlpha: 1, duration: 1.1, ease: "power2.inOut" }, 0)
        .to(
          textEls,
          { autoAlpha: 0, y: -14, duration: 0.4, stagger: 0.05, ease: "power2.in" },
          0,
        )
        .call(() => {
          indexRef.current = next;
          setActiveIndex(next);
        })
        .fromTo(
          textEls,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
          },
          "+=0.05",
        );

      playDotFill(next);
    },
    [playDotFill],
  );

  const scheduleNext = useCallback(() => {
    clearTimer();

    if (reducedMotionRef.current) return;

    timerRef.current = setTimeout(() => {
      if (!pausedRef.current) {
        goTo((indexRef.current + 1) % slides.length);
      }

      scheduleNextRef.current();
    }, SLIDE_DURATION);
  }, [clearTimer, goTo]);

  useEffect(() => {
    scheduleNextRef.current = scheduleNext;
  }, [scheduleNext]);

  const handleDotClick = useCallback(
    (index) => {
      goTo(index);
      scheduleNext();
    },
    [goTo, scheduleNext],
  );

  const updatePaused = useCallback(() => {
    pausedRef.current = hoverPausedRef.current || hiddenPausedRef.current;
  }, []);

  const handlePauseStart = useCallback(() => {
    hoverPausedRef.current = true;
    updatePaused();
  }, [updatePaused]);

  const handlePauseEnd = useCallback(() => {
    hoverPausedRef.current = false;
    updatePaused();
  }, [updatePaused]);

  useEffect(() => {
    function handleVisibilityChange() {
      hiddenPausedRef.current = document.hidden;
      updatePaused();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [updatePaused]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      reducedMotionRef.current = reduceMotion;

      gsap.set(slideRefs.current, { autoAlpha: 0 });
      gsap.set(slideRefs.current[0], { autoAlpha: 1 });
      gsap.set(dotFillRefs.current, { scaleX: 0 });

      const textEls = [eyebrowRef.current, wordmarkRef.current, taglineRef.current].filter(
        Boolean,
      );

      if (reduceMotion) {
        gsap.set(textEls, { autoAlpha: 1, y: 0 });
        gsap.set(imageWrapperRef.current, { scale: 1 });
        return undefined;
      }

      gsap.set(textEls, { autoAlpha: 0, y: 32 });
      gsap.set(imageWrapperRef.current, { scale: 1.14 });

      const entrance = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 70%" },
        onComplete: () => {
          playDotFill(0);
          scheduleNext();
        },
      });

      entrance.to(textEls, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
      });

      const parallax = gsap.to(imageWrapperRef.current, {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        entrance.kill();
        parallax.kill();
        clearTimer();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.statement}
      onMouseEnter={handlePauseStart}
      onMouseLeave={handlePauseEnd}
      onFocus={handlePauseStart}
      onBlur={handlePauseEnd}
    >
      <div ref={imageWrapperRef} className={styles.imageWrapper}>
        {slides.map((slide, index) => (
          <div
            key={slide.eyebrow}
            ref={(el) => {
              slideRefs.current[index] = el;
            }}
            className={styles.slide}
            aria-hidden={index !== activeIndex}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              quality={85}
              sizes="100vw"
              className={styles.image}
              style={{ objectPosition: slide.imagePosition }}
            />
          </div>
        ))}
      </div>

      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.content}>
        <p ref={eyebrowRef} className={styles.eyebrow}>
          {slides[activeIndex].eyebrow}
        </p>

        <h2 ref={wordmarkRef} className={styles.wordmark}>
          LEOS
        </h2>

        <p ref={taglineRef} className={styles.tagline}>
          {slides[activeIndex].tagline}
        </p>
      </div>

      <div className={styles.dots} role="tablist" aria-label="Brand statement slides">
        {slides.map((slide, index) => (
          <button
            key={slide.eyebrow}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            aria-label={`Show slide ${index + 1}: ${slide.eyebrow}`}
            className={styles.dot}
            onClick={() => handleDotClick(index)}
          >
            <span className={styles.dotTrack}>
              <span
                ref={(el) => {
                  dotFillRefs.current[index] = el;
                }}
                className={styles.dotFill}
              />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
