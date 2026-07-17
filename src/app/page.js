"use client";

import { useRef } from "react";

import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Services from "@/components/services/Services";
import Projects from "@/components/projects/Projects";
import Process from "@/components/process/Process";
import Contact from "@/components/contact/Contact";
import { gsap, useGSAP } from "@/lib/gsap";

import styles from "./page.module.css";

export default function HomePage() {
  const sceneRef = useRef(null);
  const heroLayerRef = useRef(null);
  const aboutLayerRef = useRef(null);

  useGSAP(
    () => {
      const scene = sceneRef.current;
      const heroLayer = heroLayerRef.current;
      const aboutLayer = aboutLayerRef.current;

      if (!scene || !heroLayer || !aboutLayer) return undefined;

      const leftPanel = aboutLayer.querySelector("[data-about-left]");
      const rightPanel = aboutLayer.querySelector("[data-about-right]");
      const content = aboutLayer.querySelector("[data-about-content]");
      const visual = aboutLayer.querySelector("[data-about-media-visual]");

      if (!leftPanel || !rightPanel || !content || !visual) return undefined;

      const contentChildren = Array.from(content.children);
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
            gsap.set([leftPanel, rightPanel], { clipPath: "none" });
            gsap.set(contentChildren, { autoAlpha: 1, x: 0 });
            gsap.set([heroLayer, visual], { clearProps: "transform" });
            return undefined;
          }

          gsap.set(leftPanel, { clipPath: "inset(0% 100% 0% 0%)" });
          gsap.set(rightPanel, { clipPath: "inset(100% 0% 0% 0%)" });
          gsap.set(contentChildren, {
            autoAlpha: 0,
            x: mobile ? -22 : -40,
          });
          gsap.set(heroLayer, {
            scale: 1,
            transformOrigin: "center center",
          });
          gsap.set(visual, {
            scale: mobile ? 1.04 : 1.07,
            yPercent: mobile ? 4 : 7,
            transformOrigin: "center center",
          });

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: scene,
              start: "top top",
              end: "bottom bottom",
              scrub: mobile ? 0.5 : 0.8,
              invalidateOnRefresh: true,
              snap: {
                snapTo: (progress) => {
                  if (progress < 0.25) return 0;
                  if (progress < 0.75) return 0.5;
                  return 1;
                },
                duration: { min: 0.25, max: mobile ? 0.55 : 0.75 },
                delay: 0.1,
                ease: "power2.inOut",
                inertia: false,
              },
            },
          });

          timeline
            .to(leftPanel, {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 0.5,
            })
            .to(
              contentChildren,
              {
                autoAlpha: 1,
                x: 0,
                duration: 0.2,
                stagger: 0.045,
                ease: "power2.out",
              },
              0.26,
            )
            .to(
              heroLayer,
              {
                scale: desktop ? 1.012 : 1.006,
                duration: 0.5,
              },
              0,
            )
            .to(
              rightPanel,
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 0.5,
              },
              0.5,
            )
            .to(
              visual,
              {
                scale: 1,
                yPercent: 0,
                duration: 0.5,
              },
              0.5,
            );

          return undefined;
        },
      );

      return () => media.revert();
    },
    { scope: sceneRef },
  );

  return (
    <>
      <div ref={sceneRef} id="hero-about-scene" className={styles.heroAboutScene}>
        <div className={styles.stickyViewport}>
          <div ref={heroLayerRef} className={styles.heroLayer}>
            <Hero />
          </div>

          <div ref={aboutLayerRef} className={styles.aboutLayer}>
            <About />
          </div>
        </div>
      </div>

      <Services />
      <Projects />
      <Process />
      <Contact />
    </>
  );
}
