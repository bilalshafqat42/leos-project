"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { gsap, useGSAP } from "@/lib/gsap";
import CompareSlider from "@/components/projects/CompareSlider";
import CtaBanner from "@/components/cta-banner/CtaBanner";
import styles from "./ServiceDetail.module.css";
import formStyles from "@/styles/sections.module.css";

export default function ServiceDetail({ service }) {
  const rootRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const index = services.findIndex((item) => item.slug === service.slug);
  const previous = services[(index - 1 + services.length) % services.length];
  const next = services[(index + 1) % services.length];
  const relatedProjects = projects.filter(
    (project) => project.category === service.title,
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return undefined;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const heroItems = root.querySelectorAll("[data-hero-item]");
      const revealGroups = gsap.utils.toArray(
        root.querySelectorAll("[data-reveal]"),
      );

      if (reduceMotion) {
        gsap.set([...heroItems, ...revealGroups], { autoAlpha: 1, y: 0 });
        return undefined;
      }

      const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTimeline.fromTo(
        heroItems,
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.1 },
      );

      const scrollTweens = revealGroups.map((el) =>
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        ),
      );

      return () => {
        heroTimeline.kill();
        scrollTweens.forEach((tween) => tween.kill());
      };
    },
    { scope: rootRef, dependencies: [service.slug] },
  );

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      contact: formData.get("contact"),
      projectType: formData.get("projectType"),
      message: formData.get("message"),
      pageUrl: window.location.href,
    };

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      setSubmitted(true);
      form.reset();
    } catch (submitError) {
      setError(
        submitError.message ||
          "We couldn't send your enquiry. Please call or email us directly.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div ref={rootRef}>
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <Image
            src={service.image}
            alt={`${service.title} by LEOS Project Management`}
            fill
            priority
            quality={88}
            sizes="100vw"
            className={styles.image}
            style={{ objectPosition: service.imagePosition }}
          />
        </div>

        <div className={styles.overlay} aria-hidden="true" />

        <div className={styles.heroContent}>
          <Link href="/services" className={styles.breadcrumb} data-hero-item>
            <span aria-hidden="true">←</span>
            <span>All Services</span>
          </Link>

          <p className={styles.eyebrow} data-hero-item>
            Service {service.number} / {String(services.length).padStart(2, "0")}
          </p>

          <h1 className={styles.heading} data-hero-item>
            {service.title}
          </h1>

          <p className={styles.scope} data-hero-item>
            {service.scope}
          </p>
        </div>
      </section>

      <section className={styles.overview}>
        <div className={styles.overviewGrid}>
          <div className={styles.copy} data-reveal>
            <p className={styles.label}>Overview</p>
            {service.overview.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <div className={styles.highlights} data-reveal>
            <p className={styles.label}>What&rsquo;s Included</p>
            <ul>
              {service.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {relatedProjects.length > 0 ? (
        <section className={styles.related}>
          <div className={styles.relatedHead} data-reveal>
            <p className={styles.label}>Recent Work</p>
            <h2>{service.title} Projects</h2>
          </div>

          <div className={styles.relatedGrid}>
            {relatedProjects.map((project) => (
              <div
                key={project.number}
                className={styles.relatedCard}
                data-reveal
              >
                <div className={styles.relatedMedia}>
                  <CompareSlider
                    project={project}
                    imageClassName={styles.relatedImage}
                    sizes="(max-width: 900px) 100vw, 50vw"
                  />
                </div>
                <p className={styles.relatedCaption}>{project.location}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className={formStyles.contact} id="enquire">
        <div className={`${formStyles.container} ${formStyles.contactGrid}`}>
          <div className={formStyles.contactIntro} data-reveal>
            <p className={formStyles.eyebrow}>Ask A Question</p>
            <h2>Enquire About {service.title}.</h2>
            <p>
              Share a few details about your project and our team will get
              back to you, usually within one business day.
            </p>
          </div>

          <div className={formStyles.formPanel} data-reveal>
            <div className={formStyles.formTopline}>
              <span>Quick Enquiry</span>
              <span>Usually replies within one business day</span>
            </div>

            <form onSubmit={handleSubmit} className={formStyles.form}>
              <label>
                <span>Your name</span>
                <input name="name" type="text" autoComplete="name" required />
              </label>

              <label>
                <span>Phone or email</span>
                <input
                  name="contact"
                  type="text"
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                <span>Service</span>
                <select
                  name="projectType"
                  defaultValue={service.title}
                  required
                >
                  {services.map((item) => (
                    <option key={item.number} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Tell us about the project</span>
                <textarea name="message" rows={4} required />
              </label>

              <button type="submit" disabled={submitting}>
                <span>{submitting ? "Sending…" : "Send Enquiry"}</span>
                <span aria-hidden="true">↗</span>
              </button>

              <p className={formStyles.formNote}>
                By submitting, you agree to be contacted about your enquiry.
              </p>

              {error && (
                <p className={formStyles.formError} role="alert">
                  {error}
                </p>
              )}

              {submitted && (
                <p
                  className={formStyles.success}
                  role="status"
                  aria-live="polite"
                >
                  Thank you. Your enquiry has been recorded and the LEOS team
                  will be in touch shortly.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <nav className={styles.pager} aria-label="Other services">
        <Link
          href={`/services/${previous.slug}`}
          className={styles.pagerLink}
        >
          <span className={styles.pagerDirection}>← Previous</span>
          <span className={styles.pagerTitle}>{previous.title}</span>
        </Link>

        <Link href="/services" className={styles.pagerAll}>
          All Services
        </Link>

        <Link
          href={`/services/${next.slug}`}
          className={`${styles.pagerLink} ${styles.pagerLinkNext}`}
        >
          <span className={styles.pagerDirection}>Next →</span>
          <span className={styles.pagerTitle}>{next.title}</span>
        </Link>
      </nav>

      <CtaBanner
        heading={`Ready To Talk About Your ${service.title}?`}
        lead="Book a free site visit and our team will walk you through scope, timeline and next steps."
      />
    </div>
  );
}
