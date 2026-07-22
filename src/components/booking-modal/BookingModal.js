"use client";

import { useEffect, useRef, useState } from "react";

import { services } from "@/data/services";
import { gsap } from "@/lib/gsap";
import { useBookingModal } from "./booking-modal-context";
import styles from "./BookingModal.module.css";
import formStyles from "@/styles/sections.module.css";

export default function BookingModal() {
  const { isOpen, close } = useBookingModal();
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const firstFieldRef = useRef(null);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleClose() {
    setSubmitted(false);
    setError("");
    close();
  }

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    const focusTimer = window.setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(focusTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;

    if (!overlay || !panel) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (isOpen) {
      if (reduceMotion) {
        gsap.set(overlay, { autoAlpha: 1 });
        gsap.set(panel, { y: 0, scale: 1 });
        return undefined;
      }

      gsap.set(overlay, { autoAlpha: 0 });
      gsap.set(panel, { y: 24, scale: 0.98 });

      const timeline = gsap.timeline();

      timeline
        .to(overlay, { autoAlpha: 1, duration: 0.35, ease: "power2.out" })
        .to(
          panel,
          { y: 0, scale: 1, duration: 0.45, ease: "power3.out" },
          "-=0.2",
        );

      return () => timeline.kill();
    }

    return undefined;
  }, [isOpen]);

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) handleClose();
  }

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
    <div
      ref={overlayRef}
      className={styles.overlay}
      data-open={isOpen}
      role="presentation"
      onMouseDown={handleBackdropClick}
      aria-hidden={!isOpen}
    >
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        inert={!isOpen ? "" : undefined}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close booking form"
          className={styles.closeButton}
        >
          ×
        </button>

        <p className={styles.eyebrow}>Free Site Visit</p>
        <h2 id="booking-modal-title" className={styles.heading}>
          Let&rsquo;s Talk About Your Project.
        </h2>
        <p className={styles.lead}>
          Share a few details and our team will arrange a free initial site
          visit—usually within one business day.
        </p>

        <form
          onSubmit={handleSubmit}
          className={formStyles.form}
          style={{ marginTop: 28 }}
        >
          <label>
            <span>Your name</span>
            <input
              ref={firstFieldRef}
              name="name"
              type="text"
              autoComplete="name"
              required
            />
          </label>

          <label>
            <span>Phone or email</span>
            <input name="contact" type="text" autoComplete="email" required />
          </label>

          <label style={{ gridColumn: "1 / -1" }}>
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

          <label style={{ gridColumn: "1 / -1" }}>
            <span>Tell us about the project</span>
            <textarea name="message" rows={3} required />
          </label>

          <button type="submit" disabled={submitting}>
            <span>{submitting ? "Sending…" : "Request Consultation"}</span>
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
            <p className={formStyles.success} role="status" aria-live="polite">
              Thank you. Your enquiry has been recorded and the LEOS team will
              be in touch shortly.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
