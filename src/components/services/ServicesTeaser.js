"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { services } from "@/data/services";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./ServicesTeaser.module.css";

export default function ServicesTeaser() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const sticky = stickyRef.current;
      const track = trackRef.current;
      if (!section || !sticky || !track) return undefined;

      const items = section.querySelectorAll("[data-teaser-item]");
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        return undefined;
      }

      const entrance = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 75%" },
      });

      entrance.fromTo(
        items,
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" },
      );

      /*
       * Desktop only: pin the section and translate the card track
       * horizontally so all 7 services scroll past like a filmstrip
       * before the page continues scrolling to the next section.
       */
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const getMaxScroll = () =>
          Math.max(0, track.scrollWidth - sticky.clientWidth);

        const scrollTween = gsap.to(track, {
          x: () => -getMaxScroll(),
          ease: "none",
          scrollTrigger: {
            trigger: sticky,
            start: "top top",
            end: () => `+=${getMaxScroll()}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          scrollTween.scrollTrigger?.kill();
          scrollTween.kill();
        };
      });

      return () => {
        entrance.kill();
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section id="services" ref={sectionRef} className={styles.teaser}>
      <div ref={stickyRef} className={styles.stickyViewport}>
        <div className={styles.container}>
          <div className={styles.head}>
            <div>
              <p className={styles.eyebrow} data-teaser-item>
                Our Services
              </p>
              <h2 data-teaser-item>Renovation, Handled Start To Finish.</h2>
            </div>

            <div className={styles.headCopy} data-teaser-item>
              <p>
                Villas, bathrooms, kitchens and apartments—plus project
                management, office renovation and fit-out for commercial
                spaces.
              </p>
              <Link href="/services" className={styles.link}>
                <span>View All Services</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <div ref={trackRef} className={styles.track}>
            {services.map((service) => (
              <Link
                key={service.number}
                href="/services"
                className={styles.card}
                data-teaser-item
              >
                <Image
                  src={service.image}
                  alt={`${service.title} by LEOS Project Management`}
                  fill
                  quality={85}
                  sizes="(max-width: 767px) 50vw, 27vw"
                  className={styles.cardImage}
                  style={{ objectPosition: service.imagePosition }}
                />

                <div className={styles.cardOverlay} aria-hidden="true" />

                <div className={styles.cardBody}>
                  <span className={styles.cardNumber}>{service.number}</span>
                  <h3>{service.title}</h3>
                  <p className={styles.cardScope}>{service.scope}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
