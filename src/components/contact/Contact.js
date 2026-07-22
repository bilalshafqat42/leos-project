"use client";

import { useRef, useState } from "react";

import { services } from "@/data/services";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "@/styles/sections.module.css";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const panels = section.querySelectorAll("[data-contact-panel]");
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(panels, { autoAlpha: 1, y: 0 });
        return undefined;
      }

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 78%" },
      });

      timeline.fromTo(
        panels,
        { autoAlpha: 0, y: 44 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          stagger: 0.14,
          ease: "power3.out",
        },
      );

      return () => timeline.kill();
    },
    { scope: sectionRef },
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
    <section id="contact" ref={sectionRef} className={styles.contact}>
      <div className={`${styles.container} ${styles.contactGrid}`}>
        <div className={styles.contactIntro} data-contact-panel>
          <p className={styles.eyebrow}>Start A Conversation</p>
          <h2>Let’s Build Something Worth Keeping.</h2>
          <p>
            Share the outline of your project and our team will arrange a free
            initial site visit.
          </p>

          <div className={styles.contactDetails}>
            <a href="tel:+971544339700">
              <span>Call</span>
              <strong>+971 54 433 9700</strong>
            </a>
            <a href="mailto:info@leosproject.ae">
              <span>Email</span>
              <strong>info@leosproject.ae</strong>
            </a>
            <div>
              <span>Location</span>
              <strong>Ajman, United Arab Emirates</strong>
            </div>
          </div>
        </div>

        <div id="contact-form" className={styles.formPanel} data-contact-panel>
          <div className={styles.formTopline}>
            <span>Free Site Visit</span>
            <span>Usually replies within one business day</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <label>
              <span>Your name</span>
              <input name="name" type="text" autoComplete="name" required />
            </label>

            <label>
              <span>Phone or email</span>
              <input name="contact" type="text" autoComplete="email" required />
            </label>

            <label>
              <span>Project type</span>
              <select name="projectType" defaultValue="" required>
                <option value="" disabled>
                  Select a service
                </option>
                {services.map((service) => (
                  <option key={service.number}>{service.title}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Tell us about the project</span>
              <textarea name="message" rows={4} required />
            </label>

            <button type="submit" disabled={submitting}>
              <span>{submitting ? "Sending…" : "Request Consultation"}</span>
              <span aria-hidden="true">↗</span>
            </button>

            <p className={styles.formNote}>
              By submitting, you agree to be contacted about your enquiry.
            </p>

            {error && (
              <p className={styles.formError} role="alert">
                {error}
              </p>
            )}

            {submitted && (
              <p className={styles.success} role="status" aria-live="polite">
                Thank you. Your enquiry has been recorded and the LEOS team
                will be in touch shortly.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
