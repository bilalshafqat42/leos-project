"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

const leftNavigation = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
];

const rightNavigation = [
  { label: "Projects", href: "#projects" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

const menuNavigation = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const menuTimelineRef = useRef(null);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const prefersReducedMotion = useCallback(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = useCallback(
    (href) => {
      const reduceMotion = prefersReducedMotion();

      if (href === "#home") {
        window.scrollTo({
          top: 0,
          behavior: reduceMotion ? "auto" : "smooth",
        });

        return;
      }

      const target = document.querySelector(href);

      if (!target) {
        return;
      }

      const headerHeight =
        headerRef.current?.getBoundingClientRect().height ?? 88;

      const targetTop =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    },
    [prefersReducedMotion],
  );

  const handleNavigation = useCallback(
    (event, href) => {
      event.preventDefault();
      scrollToSection(href);
    },
    [scrollToSection],
  );

  useGSAP(
    () => {
      if (!headerRef.current) {
        return undefined;
      }

      const reduceMotion = prefersReducedMotion();

      if (reduceMotion) {
        gsap.set("[data-header-item]", {
          autoAlpha: 1,
          y: 0,
        });

        gsap.set("[data-header-line]", {
          scaleX: 1,
        });

        return undefined;
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .from("[data-header-item]", {
          autoAlpha: 0,
          y: -18,
          duration: 0.8,
          stagger: 0.08,
        })
        .from(
          "[data-header-line]",
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1,
          },
          "-=0.45",
        );

      return () => {
        timeline.kill();
      };
    },
    {
      scope: headerRef,
      dependencies: [prefersReducedMotion],
    },
  );

  useGSAP(
    () => {
      const menu = menuRef.current;

      if (!menu) {
        return undefined;
      }

      const reduceMotion = prefersReducedMotion();

      gsap.set(menu, {
        clipPath: "inset(0 100% 0 0)",
        autoAlpha: 0,
        pointerEvents: "none",
      });

      const timeline = gsap.timeline({
        paused: true,

        onStart: () => {
          gsap.set(menu, {
            autoAlpha: 1,
            pointerEvents: "auto",
          });
        },

        onComplete: () => {
          closeButtonRef.current?.focus({
            preventScroll: true,
          });
        },

        onReverseComplete: () => {
          gsap.set(menu, {
            autoAlpha: 0,
            pointerEvents: "none",
          });

          document.body.style.overflow = "";
          setMenuOpen(false);

          menuButtonRef.current?.focus({
            preventScroll: true,
          });
        },
      });

      timeline
        .to(menu, {
          clipPath: "inset(0 0% 0 0)",
          duration: reduceMotion ? 0.01 : 1,
          ease: reduceMotion ? "none" : "power4.inOut",
        })
        .from(
          "[data-menu-top]",
          {
            autoAlpha: 0,
            y: reduceMotion ? 0 : -20,
            duration: reduceMotion ? 0.01 : 0.6,
            ease: reduceMotion ? "none" : "power3.out",
          },
          reduceMotion ? 0 : 0.4,
        )
        .from(
          "[data-menu-link]",
          {
            autoAlpha: 0,
            x: reduceMotion ? 0 : -30,
            duration: reduceMotion ? 0.01 : 0.65,
            stagger: reduceMotion ? 0 : 0.07,
            ease: reduceMotion ? "none" : "power3.out",
          },
          reduceMotion ? 0 : 0.45,
        )
        .from(
          "[data-menu-footer]",
          {
            autoAlpha: 0,
            y: reduceMotion ? 0 : 18,
            duration: reduceMotion ? 0.01 : 0.55,
            ease: reduceMotion ? "none" : "power3.out",
          },
          reduceMotion ? 0 : 0.68,
        );

      menuTimelineRef.current = timeline;

      return () => {
        timeline.kill();
        menuTimelineRef.current = null;
      };
    },
    {
      scope: menuRef,
      dependencies: [prefersReducedMotion],
    },
  );

  const openMenu = useCallback(() => {
    if (menuOpen) {
      return;
    }

    setMenuOpen(true);
    document.body.style.overflow = "hidden";

    menuTimelineRef.current?.restart();
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    const timeline = menuTimelineRef.current;

    if (!timeline) {
      document.body.style.overflow = "";
      setMenuOpen(false);
      return;
    }

    timeline.reverse();
  }, []);

  const handleMenuNavigation = useCallback(
    (event, href) => {
      event.preventDefault();

      const timeline = menuTimelineRef.current;

      if (!timeline) {
        document.body.style.overflow = "";
        setMenuOpen(false);
        scrollToSection(href);
        return;
      }

      timeline.eventCallback("onReverseComplete", () => {
        gsap.set(menuRef.current, {
          autoAlpha: 0,
          pointerEvents: "none",
        });

        document.body.style.overflow = "";
        setMenuOpen(false);

        window.requestAnimationFrame(() => {
          scrollToSection(href);
        });

        timeline.eventCallback("onReverseComplete", () => {
          gsap.set(menuRef.current, {
            autoAlpha: 0,
            pointerEvents: "none",
          });

          document.body.style.overflow = "";
          setMenuOpen(false);
        });
      });

      timeline.reverse();
    },
    [scrollToSection],
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && menuOpen) {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, menuOpen]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={`
          fixed inset-x-0 top-0 z-[100]
          border-b text-white
          transition-all duration-500
          ${
            scrolled
              ? "border-[#C9A15D]/25 bg-[#1E1E1E]/92 shadow-[0_12px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl"
              : "border-white/15 bg-[#1E1E1E]/45 backdrop-blur-md"
          }
        `}
      >
        <div
          className="
            mx-auto grid h-[88px] w-full max-w-[1600px]
            grid-cols-[1fr_auto_1fr]
            items-center gap-4 px-4
            sm:px-6
            lg:px-8
            xl:px-10
            2xl:px-12
          "
        >
          <div
            data-header-item
            className="flex min-w-0 items-center gap-6 xl:gap-8"
          >
            <button
              ref={menuButtonRef}
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="leos-navigation-menu"
              onClick={openMenu}
              className="
                group flex min-h-11 shrink-0 items-center gap-3
                border-0 bg-transparent p-0 text-white
                outline-none
                focus-visible:ring-1
                focus-visible:ring-[#C9A15D]
              "
            >
              <span
                aria-hidden="true"
                className="flex w-7 flex-col gap-[6px]"
              >
                <span className="h-px w-7 bg-[#C9A15D] transition-transform duration-300 group-hover:translate-x-1" />

                <span className="h-px w-5 bg-[#C9A15D] transition-all duration-300 group-hover:w-7" />
              </span>

              <span
                className="
                  hidden text-[12px] font-medium uppercase
                  tracking-[0.16em] sm:inline
                "
              >
                Menu
              </span>
            </button>

            <nav
              aria-label="Left navigation"
              className="hidden items-center gap-6 xl:flex 2xl:gap-9"
            >
              {leftNavigation.map((item) => (
                <HeaderLink
                  key={item.href}
                  item={item}
                  onNavigate={handleNavigation}
                />
              ))}
            </nav>
          </div>

          <Link
            data-header-item
            href="#home"
            aria-label="LEOS Project Management home"
            onClick={(event) => handleNavigation(event, "#home")}
            className="
              flex items-center justify-center
              justify-self-center outline-none
              focus-visible:ring-1
              focus-visible:ring-[#C9A15D]
            "
          >
            <Image
              src="/logos/leos-logo-gold.svg"
              alt="LEOS Project Management"
              width={64}
              height={64}
              priority
              className="
                h-[48px] w-[48px] object-contain
                sm:h-[52px] sm:w-[52px]
                lg:h-[58px] lg:w-[58px]
              "
            />
          </Link>

          <div
            data-header-item
            className="flex min-w-0 items-center justify-end gap-6 xl:gap-8"
          >
            <nav
              aria-label="Right navigation"
              className="hidden items-center gap-6 xl:flex 2xl:gap-9"
            >
              {rightNavigation.map((item) => (
                <HeaderLink
                  key={item.href}
                  item={item}
                  onNavigate={handleNavigation}
                />
              ))}
            </nav>

            <Link
              href="#contact"
              onClick={(event) => handleNavigation(event, "#contact")}
              className="
                inline-flex min-h-11 shrink-0
                items-center justify-center
                bg-[#C9A15D] px-5
                text-[11px] font-semibold uppercase
                tracking-[0.12em] text-[#1E1E1E]
                transition-all duration-300
                hover:bg-white
                sm:px-6 sm:text-[12px]
                xl:min-h-12 xl:px-7
              "
            >
              <span className="hidden sm:inline">
                Book Free Site Visit
              </span>

              <span className="sm:hidden">Contact</span>
            </Link>
          </div>
        </div>

        <div
          data-header-line
          aria-hidden="true"
          className="h-px w-full bg-[#C9A15D]/25"
        />
      </header>

      <div
        ref={menuRef}
        id="leos-navigation-menu"
        aria-hidden={!menuOpen}
        className="
          invisible fixed inset-0 z-[1000]
          grid h-dvh grid-cols-1
          overflow-hidden text-white
          lg:grid-cols-2
        "
      >
        <div
          className="
            flex h-full flex-col bg-[#1E1E1E]
            px-6 pb-8 pt-6
            sm:px-10 sm:pb-10 sm:pt-8
            lg:px-14 lg:pb-12 lg:pt-10
            xl:px-20
          "
        >
          <div data-menu-top className="flex items-start justify-between">
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close navigation menu"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
              className="
                group relative flex h-12 w-12
                items-center justify-center
                border border-white/20
                bg-transparent text-white
                transition-colors duration-300
                hover:border-[#C9A15D]
                hover:text-[#C9A15D]
              "
            >
              <span aria-hidden="true" className="relative h-6 w-6">
                <span
                  className="
                    absolute left-0 top-1/2 h-px w-full
                    -translate-y-1/2 rotate-45 bg-current
                    transition-transform duration-500
                    group-hover:rotate-[135deg]
                  "
                />

                <span
                  className="
                    absolute left-0 top-1/2 h-px w-full
                    -translate-y-1/2 -rotate-45 bg-current
                    transition-transform duration-500
                    group-hover:rotate-45
                  "
                />
              </span>
            </button>

            <Image
              src="/logos/leos-logo-white.svg"
              alt="LEOS Project Management"
              width={72}
              height={72}
              className="h-[62px] w-[62px] object-contain"
            />
          </div>

          <nav
            aria-label="Full navigation"
            className="flex flex-1 items-center py-8 sm:py-10"
          >
            <ul className="m-0 flex list-none flex-col gap-3 p-0 sm:gap-4">
              {menuNavigation.map((item, index) => (
                <li key={item.href} data-menu-link>
                  <a
                    href={item.href}
                    onClick={(event) =>
                      handleMenuNavigation(event, item.href)
                    }
                    tabIndex={menuOpen ? 0 : -1}
                    className="
                      group flex items-center gap-4
                      font-serif
                      text-[clamp(2.4rem,5vw,4.6rem)]
                      leading-[1.05]
                      text-white/30
                      transition-all duration-500
                      hover:translate-x-2
                      hover:text-white
                    "
                  >
                    <span
                      className="
                        w-0 overflow-hidden
                        text-[11px] font-semibold
                        tracking-[0.16em]
                        text-[#C9A15D]
                        opacity-0
                        transition-all duration-500
                        group-hover:w-9
                        group-hover:opacity-100
                      "
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div
            data-menu-footer
            className="
              flex flex-col gap-3
              border-t border-white/15 pt-5
              text-[11px] uppercase
              tracking-[0.14em]
              text-white/45
              sm:flex-row sm:items-center
              sm:justify-between
            "
          >
            <span>Renovation · Fit-Out · Construction</span>
            <span>Across the UAE</span>
          </div>
        </div>

        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMenu}
          tabIndex={menuOpen ? 0 : -1}
          className="
            relative hidden h-full border-0
            bg-[#151515]
            bg-[linear-gradient(rgba(0,0,0,0.15),rgba(0,0,0,0.68)),url('/images/menu-construction.jpg')]
            bg-cover bg-center p-0
            lg:block
          "
        >
          <span
            className="
              absolute inset-x-12 bottom-14
              border-l border-[#C9A15D]
              pl-6 text-left
            "
          >
            <span
              className="
                block text-[12px] font-semibold uppercase
                tracking-[0.16em] text-[#C9A15D]
              "
            >
              LEOS Project Management
            </span>

            <span
              className="
                mt-4 block max-w-lg
                font-serif text-4xl
                leading-[1.15] text-white
                xl:text-5xl
              "
            >
              Building spaces with precision, quality and confidence.
            </span>
          </span>
        </button>
      </div>
    </>
  );
}

function HeaderLink({ item, onNavigate }) {
  return (
    <Link
      href={item.href}
      onClick={(event) => onNavigate(event, item.href)}
      className="
        group relative whitespace-nowrap
        text-[12px] font-medium uppercase
        tracking-[0.13em] text-white
        transition-colors duration-300
        hover:text-[#C9A15D]
        2xl:text-[13px]
      "
    >
      {item.label}

      <span
        aria-hidden="true"
        className="
          absolute -bottom-2 left-0
          h-px w-full origin-right
          scale-x-0 bg-[#C9A15D]
          transition-transform duration-300
          group-hover:origin-left
          group-hover:scale-x-100
        "
      />
    </Link>
  );
}