"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navigation = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full border-b transition-all duration-500 ${
          scrolled
            ? "border-white/10 bg-[#1E1E1E]/95 shadow-xl backdrop-blur-xl"
            : "border-white/10 bg-[#1E1E1E]/60 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-[82px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link
            href="#home"
            aria-label="LEOS Project Management home"
            className="relative z-50 flex items-center"
            onClick={closeMenu}
          >
            <Image
              src="/logos/leos-logo-gold.svg"
              alt="LEOS Project Management"
              width={145}
              height={58}
              priority
              className="h-auto w-[118px] sm:w-[138px]"
            />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex xl:gap-9">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group relative text-[12px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:text-[#C9A15D]"
              >
                {item.label}

                <span className="absolute -bottom-2 left-0 h-px w-0 bg-[#C9A15D] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link
              href="#contact"
              className="inline-flex min-h-11 items-center justify-center border border-[#C9A15D] px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-[#C9A15D] hover:text-[#1E1E1E]"
            >
              Book Free Site Visit
            </Link>
          </div>

          <button
            type="button"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
            className="relative z-50 flex h-11 w-11 items-center justify-center border border-white/20 text-white lg:hidden"
          >
            <span className="sr-only">
              {menuOpen ? "Close menu" : "Open menu"}
            </span>

            <span className="relative block h-5 w-6">
              <span
                className={`absolute left-0 top-1 block h-px w-6 bg-current transition-all duration-300 ${
                  menuOpen ? "translate-y-[6px] rotate-45" : ""
                }`}
              />

              <span
                className={`absolute left-0 top-[10px] block h-px w-6 bg-current transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />

              <span
                className={`absolute left-0 top-[16px] block h-px w-6 bg-current transition-all duration-300 ${
                  menuOpen ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-[#1E1E1E] transition-all duration-500 lg:hidden ${
          menuOpen
            ? "visible translate-x-0 opacity-100"
            : "invisible translate-x-full opacity-0"
        }`}
      >
        <div className="flex min-h-screen flex-col justify-between px-7 pb-10 pt-32">
          <nav className="flex flex-col">
            {navigation.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center justify-between border-b border-white/10 py-5"
              >
                <span className="font-serif text-3xl text-white">
                  {item.label}
                </span>

                <span className="text-xs tracking-[0.2em] text-[#C9A15D]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Link>
            ))}
          </nav>

          <div>
            <Link
              href="#contact"
              onClick={closeMenu}
              className="flex min-h-14 w-full items-center justify-center bg-[#C9A15D] px-6 text-sm font-semibold uppercase tracking-[0.14em] text-[#1E1E1E]"
            >
              Book Free Site Visit
            </Link>

            <p className="mt-6 text-center text-xs tracking-[0.12em] text-white/50">
              Renovation · Fit-Out · Construction
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
