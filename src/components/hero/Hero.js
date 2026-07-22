"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { useBookingModal } from "@/components/booking-modal/booking-modal-context";
import styles from "./Hero.module.css";

/*
 * Opening collage: a scattered fan of project photos that flies in
 * and assembles on load, then clears to reveal the hero image.
 * Reusing the two placeholder photos at different crops/angles until
 * real project photography is available.
 */
const collageTiles = [
  {
    src: "/images/hero.avif",
    position: "40% 30%",
    top: "6%",
    left: "4%",
    width: "27%",
    aspect: "3 / 4",
    rotate: -7,
    fromX: -150,
    fromY: -90,
  },
  {
    src: "/images/about.avif",
    position: "55% 35%",
    top: "2%",
    left: "36%",
    width: "30%",
    aspect: "4 / 5",
    rotate: 3,
    fromX: 0,
    fromY: -170,
  },
  {
    src: "/images/hero.avif",
    position: "65% 55%",
    top: "8%",
    left: "70%",
    width: "26%",
    aspect: "3 / 4",
    rotate: 8,
    fromX: 150,
    fromY: -100,
  },
  {
    src: "/images/about.avif",
    position: "30% 60%",
    top: "46%",
    left: "12%",
    width: "29%",
    aspect: "5 / 4",
    rotate: -4,
    fromX: -160,
    fromY: 120,
  },
  {
    src: "/images/hero.avif",
    position: "50% 20%",
    top: "50%",
    left: "58%",
    width: "32%",
    aspect: "4 / 5",
    rotate: 5,
    fromX: 170,
    fromY: 140,
  },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const collageStageRef = useRef(null);
  const { open: openBookingModal } = useBookingModal();

  /*
   * Scroll smoothly to whatever section follows the hero.
   */
  const handleScrollDown = useCallback((event) => {
    event.preventDefault();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: window.innerHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const image = imageRef.current;
      const content = contentRef.current;
      const scrollIndicator = scrollIndicatorRef.current;

      if (!section || !image || !content) {
        return undefined;
      }

      const eyebrow = content.querySelector(`.${styles.eyebrow}`);

      const title = content.querySelector(`.${styles.title}`);

      const description = content.querySelector(`.${styles.description}`);

      const action = content.querySelector(`.${styles.action}`);

      if (!eyebrow || !title || !description || !action) {
        return undefined;
      }

      const media = gsap.matchMedia();

      media.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const {
            desktop = false,
            mobile = false,
            reduceMotion = false,
          } = context.conditions ?? {};

          const animatedContent = [
            eyebrow,
            title,
            description,
            action,
            scrollIndicator,
          ].filter(Boolean);

          const collageStage = collageStageRef.current;
          const collageTileEls = collageStage
            ? gsap.utils.toArray(
                collageStage.querySelectorAll("[data-collage-tile]"),
              )
            : [];

          if (reduceMotion) {
            gsap.set(image, {
              scale: 1,
              yPercent: 0,
            });

            gsap.set(animatedContent, {
              autoAlpha: 1,
              y: 0,
            });

            if (collageStage) {
              gsap.set(collageStage, { autoAlpha: 0 });
            }

            return undefined;
          }

          /*
           * Opening collage assembly (desktop/tablet only).
           */
          const collageTimeline = gsap.timeline();

          if (desktop && collageStage && collageTileEls.length) {
            gsap.set(collageStage, { autoAlpha: 1 });

            gsap.set(collageTileEls, {
              autoAlpha: 0,
              x: (index, el) => Number(el.dataset.fromX) || 0,
              y: (index, el) => Number(el.dataset.fromY) || 0,
            });

            collageTimeline
              .to(collageTileEls, {
                autoAlpha: 1,
                x: 0,
                y: 0,
                duration: 1.05,
                stagger: 0.09,
                ease: "power3.out",
              })
              .to(
                collageStage,
                {
                  autoAlpha: 0,
                  scale: 1.05,
                  duration: 0.85,
                  ease: "power2.inOut",
                },
                "+=0.4",
              );
          } else if (collageStage) {
            gsap.set(collageStage, { autoAlpha: 0 });
          }

          /*
           * Initial entrance.
           */
          const entranceTimeline = gsap.timeline({
            defaults: {
              ease: "power3.out",
            },
          });

          entranceTimeline
            .fromTo(
              image,
              {
                scale: mobile ? 1.035 : 1.055,
              },
              {
                scale: 1,
                duration: mobile ? 1.45 : 1.8,
                ease: "power2.out",
              },
              0,
            )
            .fromTo(
              eyebrow,
              {
                autoAlpha: 0,
                y: mobile ? 18 : 24,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.75,
              },
              0.35,
            )
            .fromTo(
              title,
              {
                autoAlpha: 0,
                y: mobile ? 28 : 42,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: mobile ? 0.95 : 1.1,
              },
              0.48,
            )
            .fromTo(
              description,
              {
                autoAlpha: 0,
                y: mobile ? 18 : 24,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
              },
              0.66,
            )
            .fromTo(
              action,
              {
                autoAlpha: 0,
                y: 16,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.75,
              },
              0.78,
            );

          if (scrollIndicator) {
            entranceTimeline.fromTo(
              scrollIndicator,
              {
                autoAlpha: 0,
                y: 14,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
              },
              0.92,
            );
          }

          const master = gsap.timeline();

          master
            .add(collageTimeline)
            .add(entranceTimeline, desktop && collageTileEls.length ? "-=0.55" : 0);

          /*
           * Subtle background parallax.
           */
          gsap.to(image, {
            yPercent: desktop ? 3 : 1.5,
            ease: "none",

            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: mobile ? 0.45 : 0.7,
              invalidateOnRefresh: true,
            },
          });

          return () => {
            master.kill();
          };
        },
      );

      return () => {
        media.revert();
      };
    },
    {
      scope: sectionRef,
    },
  );

  return (
    <section
      ref={sectionRef}
      id="home"
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div ref={imageRef} className={styles.imageWrapper}>
        <Image
          src="/images/hero.avif"
          alt="Premium renovation and construction project by LEOS Project Management"
          fill
          priority
          quality={92}
          sizes="100vw"
          className={styles.image}
        />
      </div>

      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.goldGlow} aria-hidden="true" />

      <div ref={collageStageRef} className={styles.collageStage} aria-hidden="true">
        <div className={styles.collageBackdrop} />

        <div className={styles.collageFrame}>
          {collageTiles.map((tile, index) => (
            <div
              key={index}
              data-collage-tile
              data-from-x={tile.fromX}
              data-from-y={tile.fromY}
              className={styles.collageTile}
              style={{
                top: tile.top,
                left: tile.left,
                width: tile.width,
                aspectRatio: tile.aspect,
                transform: `rotate(${tile.rotate}deg)`,
              }}
            >
              <Image
                src={tile.src}
                alt=""
                fill
                quality={80}
                sizes="30vw"
                className={styles.collageTileImage}
                style={{ objectPosition: tile.position }}
              />
            </div>
          ))}
        </div>
      </div>

      <div ref={contentRef} className={styles.content}>
        <p className={styles.eyebrow}>LEOS Project Management</p>

        <h1 id="hero-title" className={styles.title}>
          Building With Purpose.
          <span>Delivering With Precision.</span>
        </h1>

        <p className={styles.description}>
          Renovation, fit-out, construction and project management across the
          UAE—delivered through one trusted team.
        </p>

        <button
          type="button"
          onClick={openBookingModal}
          className={styles.action}
        >
          <span>Book a Free Site Visit</span>
        </button>
      </div>

      <a
        ref={scrollIndicatorRef}
        href="#"
        className={styles.scrollIndicator}
        aria-label="Scroll down to learn more about LEOS"
        onClick={handleScrollDown}
      >
        <span className={styles.scrollText}>Scroll Down</span>

        <span className={styles.scrollLine} aria-hidden="true" />
      </a>
    </section>
  );
}
