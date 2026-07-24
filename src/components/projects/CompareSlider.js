"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import styles from "./Projects.module.css";

/*
 * Draggable before/after comparison: the "before" photo sits clipped
 * on top of the full "after" photo, and the handle controls how much
 * of it shows. Drag or use the arrow keys.
 */
const DRAG_THRESHOLD = 4;

export default function CompareSlider({
  project,
  imageClassName,
  sizes = "(max-width: 767px) 100vw, 90vw",
}) {
  const containerRef = useRef(null);
  const draggingRef = useRef(false);
  const draggedRef = useRef(false);
  const startXRef = useRef(0);
  const [reveal, setReveal] = useState(project.reveal ?? 50);

  const applyFromClientX = useCallback((clientX) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;

    setReveal(Math.min(96, Math.max(4, percent)));
  }, []);

  const handlePointerDown = useCallback((event) => {
    draggingRef.current = true;
    draggedRef.current = false;
    startXRef.current = event.clientX;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (event) => {
      if (!draggingRef.current) return;

      if (
        draggedRef.current ||
        Math.abs(event.clientX - startXRef.current) > DRAG_THRESHOLD
      ) {
        // Some cards wrap this slider in a Link — once this is a real
        // drag (not just a tap), stop it from bubbling into a
        // navigation click.
        event.stopPropagation();
        draggedRef.current = true;
        applyFromClientX(event.clientX);
      }
    },
    [applyFromClientX],
  );

  const handlePointerUp = useCallback((event) => {
    draggingRef.current = false;
    if (draggedRef.current) {
      event.stopPropagation();
    }
  }, []);

  const handleClick = useCallback((event) => {
    if (draggedRef.current) {
      event.stopPropagation();
      event.preventDefault();
    }
  }, []);

  const handleKeyDown = useCallback((event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setReveal((current) => Math.max(4, current - 4));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setReveal((current) => Math.min(96, current + 4));
    }
  }, []);

  // Cards that wrap this slider in a <Link> sit inside an <a> tag, and
  // browsers natively try to "drag the link" when you drag an image
  // inside an anchor — that hijacks the gesture before our pointer
  // handlers ever see the move. Block the native drag entirely.
  const handleDragStart = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className={styles.compare}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
        onDragStart={handleDragStart}
      >
        <div className={styles.compareLayer}>
          <Image
            src={project.after}
            alt={`${project.title} after renovation`}
            fill
            quality={88}
            sizes={sizes}
            className={imageClassName ?? styles.image}
            style={{ objectPosition: project.afterPosition }}
            data-project-parallax
            draggable={false}
          />
        </div>

        <div
          className={styles.compareLayer}
          style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}
        >
          <Image
            src={project.before}
            alt={`${project.title} before renovation`}
            fill
            quality={88}
            sizes={sizes}
            className={imageClassName ?? styles.image}
            style={{ objectPosition: project.beforePosition }}
            draggable={false}
          />
        </div>
      </div>

      {/*
       * Rendered as a sibling of .compare (not nested inside it) so its
       * z-index actually wins against the .media-level scrim/caption —
       * a child can never out-stack elements outside its parent's own
       * stacking context, no matter how high its z-index is set.
       */}
      <div className={styles.compareControls}>
        <span className={`${styles.badge} ${styles.badgeBefore}`}>Before</span>
        <span className={`${styles.badge} ${styles.badgeAfter}`}>After</span>

        <div
          role="slider"
          tabIndex={0}
          aria-label={`Before and after comparison for ${project.title}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(reveal)}
          className={styles.handle}
          style={{ left: `${reveal}%` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onDragStart={handleDragStart}
        >
          <span className={styles.handleGrip} aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M4 3L1 7L4 11"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 3L13 7L10 11"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </>
  );
}
