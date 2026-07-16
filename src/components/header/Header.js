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

const HEADER_HEIGHT = 88;

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

  /*
   * Header background after scrolling.
   */
  useEffect(() => {
    const handleScroll = () => {
      const nextScrolledState = window.scrollY > 50;

      setScrolled((currentState) =>
        currentState === nextScrolledState
          ? currentState
          : nextScrolledState,
      );
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /*
   * Smooth section navigation.
   */
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

      const currentHeaderHeight =
        headerRef.current?.getBoundingClientRect().height ??
        HEADER_HEIGHT;

      const destination =
        target.getBoundingClientRect().top +
        window.scrollY -
        currentHeaderHeight;

      window.scrollTo({
        top: Math.max(0, destination),
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

  /*
   * Initial header entrance.
   */
  useGSAP(
    () => {
      if (!headerRef.current) {
        return undefined;
      }

      const reduceMotion = prefersReducedMotion();

      const headerItems = gsap.utils.toArray(
        headerRef.current.querySelectorAll("[data-header-item]"),
      );

      const headerLine =
        headerRef.current.querySelector("[data-header-line]");

      if (reduceMotion) {
        gsap.set(headerItems, {
          autoAlpha: 1,
          y: 0,
        });

        gsap.set(headerLine, {
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
        .fromTo(
          headerItems,
          {
            autoAlpha: 0,
            y: -18,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.08,
          },
        )
        .fromTo(
          headerLine,
          {
            scaleX: 0,
            transformOrigin: "left center",
          },
          {
            scaleX: 1,
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

  /*
   * Establish the closed menu state once.
   */
  useGSAP(
    () => {
      const menu = menuRef.current;

      if (!menu) {
        return undefined;
      }

      const menuTop = gsap.utils.toArray(
        menu.querySelectorAll("[data-menu-top]"),
      );

      const menuLinks = gsap.utils.toArray(
        menu.querySelectorAll("[data-menu-link]"),
      );

      const menuFooter = gsap.utils.toArray(
        menu.querySelectorAll("[data-menu-footer]"),
      );

      gsap.set(menu, {
        autoAlpha: 0,
        visibility: "hidden",
        pointerEvents: "none",
        clipPath: "inset(0 100% 0 0)",
      });

      gsap.set([...menuTop, ...menuLinks, ...menuFooter], {
        autoAlpha: 1,
        x: 0,
        y: 0,
      });

      return () => {
        menuTimelineRef.current?.kill();
        menuTimelineRef.current = null;
      };
    },
    {
      scope: menuRef,
    },
  );

  /*
   * Open full-screen navigation.
   */
  const openMenu = useCallback(() => {
    const menu = menuRef.current;

    if (!menu || menuOpen) {
      return;
    }

    const reduceMotion = prefersReducedMotion();

    const menuTop = gsap.utils.toArray(
      menu.querySelectorAll("[data-menu-top]"),
    );

    const menuLinks = gsap.utils.toArray(
      menu.querySelectorAll("[data-menu-link]"),
    );

    const menuFooter = gsap.utils.toArray(
      menu.querySelectorAll("[data-menu-footer]"),
    );

    menuTimelineRef.current?.kill();

    setMenuOpen(true);
    document.body.style.overflow = "hidden";

    gsap.set(menu, {
      autoAlpha: 1,
      visibility: "visible",
      pointerEvents: "auto",
      clipPath: "inset(0 100% 0 0)",
    });

    if (reduceMotion) {
      gsap.set([...menuTop, ...menuLinks, ...menuFooter], {
        autoAlpha: 1,
        x: 0,
        y: 0,
      });
    } else {
      gsap.set(menuTop, {
        autoAlpha: 0,
        y: -20,
      });

      gsap.set(menuLinks, {
        autoAlpha: 0,
        x: -32,
      });

      gsap.set(menuFooter, {
        autoAlpha: 0,
        y: 18,
      });
    }

    const timeline = gsap.timeline({
      defaults: {
        overwrite: "auto",
      },

      onComplete: () => {
        closeButtonRef.current?.focus({
          preventScroll: true,
        });
      },
    });

    timeline.to(menu, {
      clipPath: "inset(0 0% 0 0)",
      duration: reduceMotion ? 0.01 : 1,
      ease: reduceMotion ? "none" : "power4.inOut",
    });

    if (!reduceMotion) {
      timeline
        .to(
          menuTop,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          0.38,
        )
        .to(
          menuLinks,
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.65,
            stagger: 0.07,
            ease: "power3.out",
          },
          0.42,
        )
        .to(
          menuFooter,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          0.65,
        );
    }

    menuTimelineRef.current = timeline;
  }, [menuOpen, prefersReducedMotion]);

  /*
   * Close full-screen navigation.
   */
  const closeMenu = useCallback(
    (afterClose) => {
      const menu = menuRef.current;

      if (!menu) {
        document.body.style.overflow = "";
        setMenuOpen(false);

        if (typeof afterClose === "function") {
          afterClose();
        }

        return;
      }

      const reduceMotion = prefersReducedMotion();

      const menuTop = gsap.utils.toArray(
        menu.querySelectorAll("[data-menu-top]"),
      );

      const menuLinks = gsap.utils.toArray(
        menu.querySelectorAll("[data-menu-link]"),
      );

      const menuFooter = gsap.utils.toArray(
        menu.querySelectorAll("[data-menu-footer]"),
      );

      menuTimelineRef.current?.kill();

      const completeClose = () => {
        gsap.set(menu, {
          autoAlpha: 0,
          visibility: "hidden",
          pointerEvents: "none",
          clipPath: "inset(0 100% 0 0)",
        });

        gsap.set([...menuTop, ...menuLinks, ...menuFooter], {
          autoAlpha: 1,
          x: 0,
          y: 0,
        });

        document.body.style.overflow = "";
        setMenuOpen(false);

        if (typeof afterClose === "function") {
          afterClose();
        } else {
          menuButtonRef.current?.focus({
            preventScroll: true,
          });
        }
      };

      if (reduceMotion) {
        completeClose();
        return;
      }

      const timeline = gsap.timeline({
        onComplete: completeClose,
      });

      timeline
        .to(
          menuLinks,
          {
            autoAlpha: 0,
            x: -18,
            duration: 0.22,
            stagger: {
              each: 0.025,
              from: "end",
            },
            ease: "power2.in",
          },
          0,
        )
        .to(
          menuTop,
          {
            autoAlpha: 0,
            y: -10,
            duration: 0.22,
            ease: "power2.in",
          },
          0.05,
        )
        .to(
          menuFooter,
          {
            autoAlpha: 0,
            y: 10,
            duration: 0.2,
            ease: "power2.in",
          },
          0.05,
        )
        .to(
          menu,
          {
            clipPath: "inset(0 100% 0 0)",
            duration: 0.75,
            ease: "power4.inOut",
          },
          0.14,
        );

      menuTimelineRef.current = timeline;
    },
    [prefersReducedMotion],
  );

  const handleMenuNavigation = useCallback(
    (event, href) => {
      event.preventDefault();

      closeMenu(() => {
        window.requestAnimationFrame(() => {
          scrollToSection(href);
        });
      });
    },
    [closeMenu, scrollToSection],
  );

  /*
   * Escape key closes navigation.
   */
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

  /*
   * Restore page scrolling on unmount.
   */
  useEffect(() => {
    return () => {
      menuTimelineRef.current?.kill();
      document.body.style.overflow = "";
    };
  }, []);

  const headerClassName = scrolled
    ? "fixed inset-x-0 top-0 z-[100] border-b border-[#C9A15D]/25 bg-[#1E1E1E]/92 text-white shadow-[0_12px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl transition-all duration-500"
    : "fixed inset-x-0 top-0 z-[100] border-b border-white/15 bg-[#1E1E1E]/45 text-white backdrop-blur-md transition-all duration-500";

  return (
    <>
      <header ref={headerRef} className={headerClassName}>
        <div className="mx-auto grid h-[88px] w-full max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
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
              className="group flex min-h-11 shrink-0 items-center gap-3 border-0 bg-transparent p-0 text-white outline-none focus-visible:ring-1 focus-visible:ring-[#C9A15D]"
            >
              <span
                aria-hidden="true"
                className="flex w-7 flex-col gap-[6px]"
              >
                <span className="h-px w-7 bg-[#C9A15D] transition-transform duration-300 group-hover:translate-x-1" />
                <span className="h-px w-5 bg-[#C9A15D] transition-all duration-300 group-hover:w-7" />
              </span>

              <span className="hidden text-[12px] font-medium uppercase tracking-[0.16em] sm:inline">
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
            className="flex items-center justify-center justify-self-center outline-none focus-visible:ring-1 focus-visible:ring-[#C9A15D]"
          >
            <Image
              src="/logos/leos-logo-gold.svg"
              alt="LEOS Project Management"
              width={64}
              height={64}
              priority
              className="h-[48px] w-[48px] object-contain sm:h-[52px] sm:w-[52px] lg:h-[58px] lg:w-[58px]"
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
              onClick={(event) =>
                handleNavigation(event, "#contact")
              }
              className="inline-flex min-h-11 shrink-0 items-center justify-center bg-[#C9A15D] px-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1E1E1E] transition-all duration-300 hover:bg-white sm:px-6 sm:text-[12px] xl:min-h-12 xl:px-7"
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
        className="fixed inset-0 z-[1000] grid h-dvh grid-cols-1 overflow-hidden text-white lg:grid-cols-2"
      >
        <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#1E1E1E] px-6 pb-7 pt-6 sm:px-10 sm:pb-9 sm:pt-8 lg:px-14 lg:pb-10 lg:pt-10 xl:px-20">
          <div
            data-menu-top
            className="flex shrink-0 items-start justify-between"
          >
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close navigation menu"
              onClick={() => closeMenu()}
              tabIndex={menuOpen ? 0 : -1}
              className="group relative flex h-12 w-12 items-center justify-center border border-white/20 bg-transparent text-white transition-colors duration-300 hover:border-[#C9A15D] hover:text-[#C9A15D]"
            >
              <span
                aria-hidden="true"
                className="relative h-6 w-6"
              >
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 rotate-45 bg-current transition-transform duration-500 group-hover:rotate-[135deg]" />
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 -rotate-45 bg-current transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </button>

            <Image
              src="/logos/leos-logo-white.svg"
              alt="LEOS Project Management"
              width={72}
              height={72}
              className="h-[58px] w-[58px] object-contain sm:h-[62px] sm:w-[62px]"
            />
          </div>

          <nav
            aria-label="Full navigation"
            className="flex min-h-0 flex-1 items-center py-5 sm:py-7 lg:py-8"
          >
            <ul className="m-0 flex list-none flex-col gap-2 p-0 sm:gap-3">
              {menuNavigation.map((item, index) => (
                <li key={item.href} data-menu-link>
                  <a
                    href={item.href}
                    onClick={(event) =>
                      handleMenuNavigation(event, item.href)
                    }
                    tabIndex={menuOpen ? 0 : -1}
                    className="group flex items-center gap-4 font-serif text-[clamp(2rem,4.4vw,4.35rem)] leading-[1.02] text-white/75 transition-all duration-500 hover:translate-x-2 hover:text-[#C9A15D] focus-visible:text-white focus-visible:outline-none"
                  >
                    <span className="w-0 overflow-hidden text-[11px] font-semibold tracking-[0.16em] text-[#C9A15D] opacity-0 transition-all duration-500 group-hover:w-9 group-hover:opacity-100">
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
            className="flex shrink-0 flex-col gap-3 border-t border-white/15 pt-5 text-[11px] uppercase tracking-[0.14em] text-white/45 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>Renovation · Fit-Out · Construction</span>
            <span>Across the UAE</span>
          </div>
        </div>

        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => closeMenu()}
          tabIndex={menuOpen ? 0 : -1}
          className="relative hidden h-full border-0 bg-[#151515] bg-[linear-gradient(rgba(0,0,0,0.15),rgba(0,0,0,0.68)),url('/images/menu-construction.jpg')] bg-cover bg-center p-0 lg:block"
        >
          <span className="absolute inset-x-12 bottom-14 border-l border-[#C9A15D] pl-6 text-left">
            <span className="block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#C9A15D]">
              LEOS Project Management
            </span>

            <span className="mt-4 block max-w-lg font-serif text-4xl leading-[1.15] text-white xl:text-5xl">
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
      onClick={(event) =>
        onNavigate(event, item.href)
      }
      className="group relative whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.13em] text-white transition-colors duration-300 hover:text-[#C9A15D] 2xl:text-[13px]"
    >
      {item.label}

      <span
        aria-hidden="true"
        className="absolute -bottom-2 left-0 h-px w-full origin-right scale-x-0 bg-[#C9A15D] transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100"
      />
    </Link>
  );
}