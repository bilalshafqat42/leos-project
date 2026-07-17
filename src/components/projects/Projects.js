"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const projects = [
  {
    title: "Luxury Villa Renovation",
    subtitle: "Premium finishes for a family residence.",
    detail: "Complete interior renewal with custom joinery, lighting and landscape coordination.",
  },
  {
    title: "Corporate Office Fit-Out",
    subtitle: "A workspace designed for collaboration.",
    detail: "From conceptual planning through FF&E delivery, we built a modern, efficient office environment.",
  },
  {
    title: "Boutique Retail Space",
    subtitle: "Brand-led retail interiors with experiential detail.",
    detail: "We managed all trade partners, finishes and handover for a premium retail launch.",
  },
];

export default function Projects() {
  const sectionRef = useRef(null);
  const projectRefs = useRef([]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const projectCards = projectRefs.current;

      if (!section || !projectCards.length) {
        return undefined;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set([...projectCards, section.querySelectorAll("[data-section-item]")], {
          autoAlpha: 1,
          y: 0,
        });

        return undefined;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
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
          projectCards,
          {
            autoAlpha: 0,
            y: 30,
            scale: 0.98,
          },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
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
    <section id="projects" ref={sectionRef} className="bg-[#f6f1e8] text-[#1e1e1e]">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12">
        <div className="max-w-3xl" data-section-item>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-[#c9a15d]">
            Selected Projects
          </p>
          <h2 className="text-4xl font-serif font-normal leading-tight sm:text-5xl">
            Projects that show our process in motion.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {projects.map((project, index) => (
            <article
              key={project.title}
              ref={(element) => {
                if (element) projectRefs.current[index] = element;
              }}
              className="group overflow-hidden rounded-[40px] border border-[#c9a15d]/15 bg-[#f9f4ea] p-8 shadow-[0_28px_70px_rgba(30,30,30,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(30,30,30,0.1)]"
            >
              <div className="mb-6 h-44 rounded-[28px] bg-[#ece6d7]" />
              <p className="text-xs uppercase tracking-[0.28em] text-[#c9a15d]">
                Featured Work
              </p>
              <h3 className="mt-3 text-2xl font-semibold leading-tight text-[#1e1e1e]">
                {project.title}
              </h3>
              <p className="mt-3 text-sm text-[#1e1e1e]/75">
                {project.subtitle}
              </p>
              <p className="mt-5 text-sm leading-7 text-[#1e1e1e]/70">
                {project.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
