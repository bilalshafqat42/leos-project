"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const steps = [
  {
    label: "01",
    title: "Discover",
    description:
      "We begin with your brief, budget and vision to design a tailored project roadmap.",
  },
  {
    label: "02",
    title: "Plan",
    description:
      "Detailed schedules, procurement plans and trade coordination keep the project aligned.",
  },
  {
    label: "03",
    title: "Deliver",
    description:
      "On-site supervision and quality assurance ensure work is completed to the highest standard.",
  },
  {
    label: "04",
    title: "Handover",
    description:
      "We review every detail and provide a seamless handover so your space is ready to use.",
  },
];

export default function Process() {
  const sectionRef = useRef(null);
  const stepRefs = useRef([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const cards = stepRefs.current;

      if (!section || !cards.length) {
        return undefined;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(cards, {
          autoAlpha: 1,
          y: 0,
        });

        gsap.set(section.querySelectorAll("[data-section-item]"), {
          autoAlpha: 1,
          y: 0,
        });

        return undefined;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
        },
      });

      timeline
        .fromTo(
          section.querySelectorAll("[data-section-item]"),
          {
            autoAlpha: 0,
            y: 24,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
          },
        )
        .fromTo(
          cards,
          {
            autoAlpha: 0,
            y: 36,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.14,
            ease: "power3.out",
          },
          "-=0.55",
        );

      return () => {
        timeline.kill();
      };
    },
    {
      scope: sectionRef,
    },
  );

  return (
    <section
      id="process"
      ref={sectionRef}
      className="bg-[#f6f1e8] text-[#1e1e1e]"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12">
        <div className="max-w-3xl" data-section-item>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-[#c9a15d]">
            Our Process
          </p>
          <h2 className="text-4xl font-serif font-normal leading-tight sm:text-5xl">
            A simple, clear process for confident delivery.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#1e1e1e]/75">
            Every project follows a disciplined journey from concept to completion,
            so you always know what to expect.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {steps.map((step, index) => (
            <article
              key={step.title}
              ref={(element) => {
                if (element) stepRefs.current[index] = element;
              }}
              className="rounded-[40px] border border-[#c9a15d]/15 bg-white p-8 shadow-[0_28px_70px_rgba(30,30,30,0.06)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#c9a15d]">
                {step.label}
              </p>
              <h3 className="mt-4 text-2xl font-semibold leading-tight text-[#1e1e1e]">
                {step.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#1e1e1e]/75">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
