"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef(null);
  const infoRef = useRef(null);
  const formRef = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  useGSAP(
    () => {
      const section = sectionRef.current;
      const info = infoRef.current;
      const form = formRef.current;

      if (!section || !info || !form) {
        return undefined;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set([info, form], {
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
          info,
          {
            autoAlpha: 0,
            y: 32,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.65",
        )
        .fromTo(
          form,
          {
            autoAlpha: 0,
            y: 32,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
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
    <section id="contact" ref={sectionRef} className="bg-[#f6f1e8] text-[#1e1e1e]">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="max-w-2xl rounded-[40px] border border-[#c9a15d]/15 bg-white p-10 shadow-[0_28px_80px_rgba(30,30,30,0.06)]" ref={infoRef} data-section-item>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-[#c9a15d]">
              Contact
            </p>
            <h2 className="text-4xl font-serif font-normal leading-tight sm:text-5xl">
              Let’s start your next project.
            </h2>
            <p className="mt-6 text-base leading-8 text-[#1e1e1e]/80">
              Tell us about your project and we’ll take care of the planning,
              delivery and handover with clarity at every step.
            </p>

            <div className="mt-10 space-y-6 text-sm text-[#1e1e1e]/80">
              <div>
                <p className="font-semibold uppercase tracking-[0.12em] text-[#1e1e1e]/80">
                  Phone
                </p>
                <a href="tel:+971544339700" className="mt-2 inline-block text-base font-medium text-[#1e1e1e] hover:text-[#c9a15d]">
                  +971 54 433 9700
                </a>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.12em] text-[#1e1e1e]/80">
                  Email
                </p>
                <a href="mailto:info@leosproject.ae" className="mt-2 inline-block text-base font-medium text-[#1e1e1e] hover:text-[#c9a15d]">
                  info@leosproject.ae
                </a>
              </div>
              <div>
                <p className="font-semibold uppercase tracking-[0.12em] text-[#1e1e1e]/80">
                  Location
                </p>
                <p className="mt-2 text-base font-medium text-[#1e1e1e]">Ajman, United Arab Emirates</p>
              </div>
            </div>
          </div>

          <div ref={formRef} className="rounded-[40px] border border-[#c9a15d]/15 bg-[#fff7e8] p-10 shadow-[0_28px_80px_rgba(30,30,30,0.06)]" data-section-item>
            <p className="mb-5 text-sm uppercase tracking-[0.32em] text-[#c9a15d]">
              Request Consultation
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block text-sm font-semibold text-[#1e1e1e]">
                Name
                <input
                  type="text"
                  required
                  className="mt-3 w-full rounded-[32px] border border-[#c9a15d]/15 bg-white px-5 py-4 text-sm outline-none focus:border-[#c9a15d] focus:ring-2 focus:ring-[#c9a15d]/10"
                />
              </label>

              <label className="block text-sm font-semibold text-[#1e1e1e]">
                Email
                <input
                  type="email"
                  required
                  className="mt-3 w-full rounded-[32px] border border-[#c9a15d]/15 bg-white px-5 py-4 text-sm outline-none focus:border-[#c9a15d] focus:ring-2 focus:ring-[#c9a15d]/10"
                />
              </label>

              <label className="block text-sm font-semibold text-[#1e1e1e]">
                Message
                <textarea
                  required
                  rows={5}
                  className="mt-3 w-full rounded-[32px] border border-[#c9a15d]/15 bg-white px-5 py-4 text-sm outline-none focus:border-[#c9a15d] focus:ring-2 focus:ring-[#c9a15d]/10"
                />
              </label>

              <button
                type="submit"
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-[32px] border border-[#1e1e1e] bg-[#1e1e1e] px-6 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#c9a15d] hover:bg-[#c9a15d] hover:text-[#1e1e1e]"
              >
                Send Message
              </button>

              {submitted && (
                <p className="rounded-[32px] bg-[#1e1e1e] px-5 py-4 text-sm text-white">
                  Thank you! Your request has been received. We’ll be in touch
                  shortly.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
