"use client";

import Image from "next/image";
import { useRef } from "react";

import { services } from "@/data/services";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Services.module.css";

export default function Services() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const copies = gsap.utils.toArray(
        section.querySelectorAll("[data-service-copy]"),
      );
      const mediaPanels = gsap.utils.toArray(
        section.querySelectorAll("[data-service-media]"),
      );
      const images = gsap.utils.toArray(
        section.querySelectorAll("[data-service-image]"),
      );
      const progressFill = section.querySelector("[data-progress-fill]");

      if (
        copies.length !== services.length ||
        mediaPanels.length !== services.length ||
        images.length !== services.length ||
        !progressFill
      ) {
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
          const { desktop, mobile, reduceMotion } = context.conditions ?? {};

          if (reduceMotion) {
            gsap.set([...copies, ...mediaPanels, ...images], {
              clearProps: "all",
              autoAlpha: 1,
              x: 0,
              y: 0,
              yPercent: 0,
              scale: 1,
              clipPath: "none",
            });

            return undefined;
          }

          if (mobile) {
            const entranceTweens = copies.map((copy) =>
              gsap.fromTo(
                copy,
                { autoAlpha: 0, y: 44 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.9,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: copy,
                    start: "top 84%",
                    toggleActions: "play none none reverse",
                  },
                },
              ),
            );

            return () => entranceTweens.forEach((tween) => tween.kill());
          }

          if (!desktop) return undefined;

          gsap.set(copies, { autoAlpha: 0, y: 58 });
          gsap.set(copies[0], { autoAlpha: 1, y: 0 });

          gsap.set(mediaPanels, {
            autoAlpha: 1,
            clipPath: "inset(100% 0% 0% 0%)",
          });
          gsap.set(mediaPanels[0], { clipPath: "inset(0% 0% 0% 0%)" });

          gsap.set(images, {
            scale: 1.1,
            yPercent: 6,
            transformOrigin: "center center",
          });
          gsap.set(images[0], { scale: 1.035, yPercent: 0 });

          gsap.set(progressFill, {
            scaleY: 0,
            transformOrigin: "top center",
          });

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.9,
              invalidateOnRefresh: true,
              snap: {
                snapTo: 1 / (services.length - 1),
                duration: { min: 0.25, max: 0.55 },
                delay: 0.12,
                ease: "power2.inOut",
                inertia: false,
              },
            },
          });

          timeline.to(
            progressFill,
            {
              scaleY: 1,
              duration: services.length - 1,
            },
            0,
          );

          for (let index = 1; index < services.length; index += 1) {
            const position = index - 1;
            const mediaStart = position + 0.18;
            const copyExit = position + 0.56;
            const copyEnter = position + 0.64;
            const previousCopy = copies[index - 1];
            const nextCopy = copies[index];
            const previousImage = images[index - 1];
            const nextImage = images[index];
            const nextPanel = mediaPanels[index];

            timeline
              .to(
                previousCopy,
                {
                  autoAlpha: 0,
                  y: -48,
                  duration: 0.22,
                  ease: "power2.in",
                },
                copyExit,
              )
              .to(
                nextPanel,
                {
                  clipPath: "inset(0% 0% 0% 0%)",
                  duration: 0.7,
                  ease: "power3.inOut",
                },
                mediaStart,
              )
              .to(
                previousImage,
                {
                  scale: 1.075,
                  yPercent: -5,
                  duration: 0.76,
                },
                mediaStart,
              )
              .to(
                nextImage,
                {
                  scale: 1.02,
                  yPercent: 0,
                  duration: 0.82,
                  ease: "power2.out",
                },
                mediaStart,
              )
              .to(
                nextCopy,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.28,
                  ease: "power3.out",
                },
                copyEnter,
              );
          }

          return () => timeline.kill();
        },
      );

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="services"
      ref={sectionRef}
      className={styles.services}
      style={{ "--service-count": services.length }}
    >
      <div className={styles.stickyViewport}>
        {services.map((service, index) => (
          <article
            key={service.number}
            className={styles.serviceSlide}
            aria-label={`${service.number}: ${service.title}`}
          >
            <div className={styles.copyColumn}>
              <div className={styles.copy} data-service-copy>
                <p className={styles.eyebrow}>
                  <span>{service.number}</span>
                  Our Services
                </p>

                <h2>{service.title}</h2>

                <p className={styles.description}>{service.description}</p>

                <p className={styles.scope}>{service.scope}</p>
              </div>
            </div>

            <div
              className={styles.mediaColumn}
              data-service-media
              style={{ zIndex: index + 1 }}
            >
              <Image
                src={service.image}
                alt={`${service.title} by LEOS Project Management`}
                fill
                quality={88}
                sizes="(max-width: 767px) 100vw, 60vw"
                className={styles.image}
                style={{ objectPosition: service.imagePosition }}
                data-service-image
              />
            </div>
          </article>
        ))}

        <div className={styles.progress} aria-hidden="true">
          <span>01</span>
          <i>
            <b data-progress-fill />
          </i>
          <span>{services[services.length - 1].number}</span>
        </div>
      </div>
    </section>
  );
}
