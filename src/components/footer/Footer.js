"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { services } from "@/data/services";
import { gsap, useGSAP } from "@/lib/gsap";
import { useBookingModal } from "@/components/booking-modal/booking-modal-context";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/services#projects" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const signoffRef = useRef(null);
  const { open: openBookingModal } = useBookingModal();

  useGSAP(
    () => {
      const signoff = signoffRef.current;

      if (!signoff) return undefined;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(signoff, { autoAlpha: 1, y: 0 });
        return undefined;
      }

      const reveal = gsap.fromTo(
        signoff,
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: signoff,
            start: "top 85%",
          },
        },
      );

      return () => reveal.kill();
    },
    { scope: signoffRef },
  );

  return (
    <footer className="border-t border-[#C9A15D]/25 bg-[#1F1F1F] text-white">
      <div
        ref={signoffRef}
        className="border-b border-[#C9A15D]/20 px-5 py-16 text-center sm:px-8 sm:py-20 lg:px-12 lg:py-24 lg:text-left"
      >
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[length:var(--type-label)] font-semibold uppercase tracking-[var(--ls-label)] text-[#C9A15D]">
            Renovation · Fit-Out · Construction · Project Management
          </p>

          <h2 className="mt-6 font-serif text-[length:var(--type-wordmark)] leading-[var(--lh-display)] tracking-[var(--ls-display)] text-white">
            LEOS
          </h2>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_0.9fr_1.2fr] lg:gap-10">
          <div>
            <Image
              src="/logos/leos-logo-gold.svg"
              alt="LEOS Project Management"
              width={165}
              height={70}
              className="h-auto w-[150px]"
            />

            <p className="mt-6 max-w-sm text-[length:var(--type-body-sm)] leading-[var(--lh-body)] text-white/60">
              Professional renovation, fit-out, construction and project
              management solutions across the UAE.
            </p>

            <div className="mt-7 flex gap-3">
              <SocialLink href="#" label="Instagram">
                <InstagramIcon />
              </SocialLink>

              <SocialLink href="#" label="Facebook">
                <FacebookIcon />
              </SocialLink>

              <SocialLink href="#" label="LinkedIn">
                <LinkedInIcon />
              </SocialLink>

              <SocialLink href="#" label="YouTube">
                <YouTubeIcon />
              </SocialLink>
            </div>
          </div>

          <FooterColumn title="Quick Links">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-[#C9A15D]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Services">
            {services.map((service) => (
              <li key={service.number}>
                <Link
                  href="/services"
                  className="transition-colors hover:text-[#C9A15D]"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <div>
            <p className="text-[length:var(--type-label)] font-semibold uppercase tracking-[var(--ls-label)] text-white">
              Get In Touch
            </p>

            <div className="mt-6 space-y-5 text-[length:var(--type-body-sm)] text-white/65">
              <ContactItem title="Phone">
                <a
                  href="tel:+971544339700"
                  className="transition-colors hover:text-[#C9A15D]"
                >
                  +971 54 433 9700
                </a>
              </ContactItem>

              <ContactItem title="Email">
                <a
                  href="mailto:info@leosproject.ae"
                  className="break-all transition-colors hover:text-[#C9A15D]"
                >
                  info@leosproject.ae
                </a>
              </ContactItem>

              <ContactItem title="Ajman Office">
                Office # AMC-BL-B.C-6010961, AMC-Boulevard-A Building, Ajman
                Media City District, Ajman Corniche, Ajman, UAE
              </ContactItem>

              <ContactItem title="Dubai Office">
                Al Braha Building, Deira, Dubai, UAE
              </ContactItem>

              <ContactItem title="Working Hours">
                Monday–Saturday, 9:00 AM–6:00 PM
              </ContactItem>
            </div>

            <button
              type="button"
              onClick={openBookingModal}
              className="mt-8 inline-flex min-h-12 items-center justify-center border border-[#C9A15D] px-6 text-[length:var(--type-label)] font-semibold uppercase tracking-[var(--ls-label)] transition-all duration-300 hover:bg-[#C9A15D] hover:text-[#1F1F1F]"
            >
              Request Consultation
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-6 text-[length:var(--type-body-sm)] text-white/40 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <p>
            © {new Date().getFullYear()} LEOS Project Management. All rights
            reserved.
          </p>

          <div className="flex gap-6">
            <Link href="#" className="hover:text-[#C9A15D]">
              Privacy Policy
            </Link>

            <Link href="#" className="hover:text-[#C9A15D]">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <p className="text-[length:var(--type-label)] font-semibold uppercase tracking-[var(--ls-label)] text-white">
        {title}
      </p>

      <ul className="mt-6 space-y-3 text-[length:var(--type-body-sm)] text-white/60">
        {children}
      </ul>
    </div>
  );
}

function ContactItem({ title, children }) {
  return (
    <div>
      <p className="mb-1 text-[length:var(--type-label-sm)] font-semibold uppercase tracking-[var(--ls-label-sm)] text-[#C9A15D]">
        {title}
      </p>

      <div>{children}</div>
    </div>
  );
}

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={`Follow LEOS on ${label}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A15D] hover:bg-[#C9A15D] hover:text-[#1F1F1F] focus-visible:-translate-y-0.5 focus-visible:border-[#C9A15D] focus-visible:bg-[#C9A15D] focus-visible:text-[#1F1F1F]"
    >
      <span className="h-[18px] w-[18px]" aria-hidden="true">
        {children}
      </span>
    </a>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17" cy="7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M13.5 21v-8.2h2.75l.41-3.2H13.5V7.55c0-.93.26-1.55 1.6-1.55h1.7V3.14C16.5 3.1 15.55 3 14.44 3 12.12 3 10.5 4.41 10.5 7.24v2.36H7.75v3.2h2.75V21h3z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M7.1 9.1H4V20h3.1V9.1zM5.55 4C4.48 4 3.7 4.78 3.7 5.78c0 .97.76 1.78 1.83 1.78h.02c1.1 0 1.83-.81 1.83-1.78C7.36 4.78 6.65 4 5.55 4zM20.3 13.9c0-3.05-1.63-4.47-3.8-4.47-1.75 0-2.54 1-2.98 1.68V9.1H10.4c.04.9 0 10.9 0 10.9h3.12v-6.1c0-.33.02-.65.12-.89.27-.65.87-1.34 1.9-1.34 1.34 0 1.87 1.04 1.87 2.56V20h3.12l-.23-6.1z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
    >
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
      <path d="M10.2 9.7v4.6l4.1-2.3z" fill="currentColor" stroke="none" />
    </svg>
  );
}