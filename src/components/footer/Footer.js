import Image from "next/image";
import Link from "next/link";

const services = [
  "Villa Renovation",
  "Apartment Renovation",
  "Office Fit-Out",
  "Interior Design",
  "Construction",
  "Project Management",
];

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-[#C9A15D]/25 bg-[#1E1E1E] text-white"
    >
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

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
              Professional renovation, fit-out, construction and project
              management solutions across the UAE.
            </p>

            <div className="mt-7 flex gap-3">
              <SocialLink href="#" label="Instagram">
                IG
              </SocialLink>

              <SocialLink href="#" label="Facebook">
                FB
              </SocialLink>

              <SocialLink href="#" label="LinkedIn">
                IN
              </SocialLink>

              <SocialLink href="#" label="YouTube">
                YT
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
              <li key={service}>
                <Link
                  href="#services"
                  className="transition-colors hover:text-[#C9A15D]"
                >
                  {service}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <div>
            <p className="footer-heading">Get In Touch</p>

            <div className="mt-6 space-y-5 text-sm text-white/65">
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

              <ContactItem title="Location">
                Ajman, United Arab Emirates
              </ContactItem>

              <ContactItem title="Working Hours">
                Monday–Saturday, 9:00 AM–6:00 PM
              </ContactItem>
            </div>

            <Link
              href="#contact-form"
              className="mt-8 inline-flex min-h-12 items-center justify-center border border-[#C9A15D] px-6 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300 hover:bg-[#C9A15D] hover:text-[#1E1E1E]"
            >
              Request Consultation
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-6 text-xs text-white/40 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
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
      <p className="footer-heading">{title}</p>

      <ul className="mt-6 space-y-3 text-sm text-white/60">{children}</ul>
    </div>
  );
}

function ContactItem({ title, children }) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C9A15D]">
        {title}
      </p>

      <div>{children}</div>
    </div>
  );
}

function SocialLink({ href, label, children }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-[10px] font-semibold tracking-[0.08em] transition-all hover:border-[#C9A15D] hover:bg-[#C9A15D] hover:text-[#1E1E1E]"
    >
      {children}
    </Link>
  );
}