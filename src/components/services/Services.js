"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const services = [
  {
    title: "Renovation & Fit-Out",
    description:
      "From villas to apartments and offices, we coordinate every detail to deliver a seamless renovation experience.",
  },
  {
    title: "Project Management",
    description:
      "Professional site supervision, budget oversight and schedule control that keeps projects on track.",
  },
  {
    title: "Interior Delivery",
    description:
      "Design-led finishes, furniture coordination and technical handover for spaces that feel polished and complete.",
  },
];

export default function Services() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const cards = cardRefs.current;

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
            y: 28,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.14,
            ease: "power3.out",
          },
        )
        .fromTo(
          cards,
          {
            autoAlpha: 0,
            y: 24,
            scale: 0.98,
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.6",
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
      id="services"
      ref={sectionRef}
      className="bg-[#f6f1e8] text-[#1e1e1e]"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12">
        <div className="max-w-3xl" data-section-item>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-[#c9a15d]">
            Our Services
          </p>
          <h2 className="text-4xl font-serif font-normal leading-tight sm:text-5xl">
            Built around your goals, delivered with precision.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#1e1e1e]/75">
            We provide clear planning, experienced execution and transparent
            communication across every renovation, fit-out and construction
            project.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {services.map((service, index) => (
            <article
              key={service.title}
              ref={(element) => {
                if (element) cardRefs.current[index] = element;
              }}
              className="rounded-[40px] border border-[#1e1e1e]/10 bg-white/95 p-8 shadow-[0_32px_80px_rgba(30,30,30,0.08)]"
            >
              <h3 className="text-xl font-semibold tracking-tight text-[#1e1e1e]">
                {service.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#1e1e1e]/75">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
