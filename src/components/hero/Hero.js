"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Hero() {
  const heroRef = useRef(null);

  useGSAP(
    () => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .from("[data-hero-eyebrow]", {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
        })
        .from(
          "[data-hero-title]",
          {
            autoAlpha: 0,
            y: 50,
            duration: 1,
          },
          "-=0.35",
        )
        .from(
          "[data-hero-description]",
          {
            autoAlpha: 0,
            y: 25,
            duration: 0.75,
          },
          "-=0.5",
        )
        .from(
          "[data-hero-actions]",
          {
            autoAlpha: 0,
            y: 20,
            duration: 0.65,
          },
          "-=0.4",
        );

      return () => timeline.kill();
    },
    {
      scope: heroRef,
    },
  );

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1E1E1E] px-5 pt-[86px] text-center text-white"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,161,93,0.14),transparent_58%)]"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <p
          data-hero-eyebrow
          className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C9A15D] sm:text-xs"
        >
          LEOS Project Management
        </p>

        <h1
          data-hero-title
          className="mx-auto mt-6 max-w-5xl font-serif text-[clamp(3.4rem,8vw,8rem)] leading-[0.9]"
        >
          Building Better Spaces.
          <span className="mt-2 block text-[#C9A15D]">
            Delivering Every Detail.
          </span>
        </h1>

        <p
          data-hero-description
          className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-white/60 sm:text-base"
        >
          Renovation, fit-out, construction and professional project management
          services across the UAE.
        </p>

        <div
          data-hero-actions
          className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
        >
          <a
            href="#contact"
            className="inline-flex min-h-13 items-center justify-center bg-[#C9A15D] px-8 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1E1E1E] transition-colors duration-300 hover:bg-white"
          >
            Book Free Site Visit
          </a>

          <a
            href="#services"
            className="inline-flex min-h-13 items-center justify-center border border-white/30 px-8 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:border-[#C9A15D] hover:text-[#C9A15D]"
          >
            View Our Services
          </a>
        </div>
      </div>
    </section>
  );
}
