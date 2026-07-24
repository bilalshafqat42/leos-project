"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import styles from "./Projects.module.css";

/*
 * Draggable before/after comparison: the "before" photo sits clipped
 * on top of the full "after" photo, and the handle controls how much
 * of it shows. Drag or use the arrow keys.
 */
export default function CompareSlider({
  project,
  imageClassName,
  sizes = "(max-width: 767px) 100vw, 90vw",
}) {
  const containerRef = useRef(null);
  const draggingRef = useRef(false);
  const [reveal, setReveal] = useState(project.reveal ?? 50);

  const applyFromClientX = useCallback((clientX) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;

    setReveal(Math.min(96, Math.max(4, percent)));
  }, []);

  const handlePointerDown = useCallback(
    (event) => {
      // Several cards wrap this slider in a Link — stop the drag from
      // bubbling into a navigation click.
      event.stopPropagation();
      draggingRef.current = true;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      applyFromClientX(event.clientX);
    },
    [applyFromClientX],
  );

  const handlePointerMove = useCallback(
    (event) => {
      if (!draggingRef.current) return;
      event.stopPropagation();
      applyFromClientX(event.clientX);
    },
    [applyFromClientX],
  );

  const handlePointerUp = useCallback((event) => {
    event.stopPropagation();
    draggingRef.current = false;
  }, []);

  const handleClick = useCallback((event) => {
    event.stopPropagation();
    event.preventDefault();
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

  return (
    <>
      <div ref={containerRef} className={styles.compare}>
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
