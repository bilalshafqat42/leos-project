export default function HomePage() {
  return (
    <>
      <section
        id="home"
        className="flex min-h-screen items-center justify-center bg-[#1E1E1E] px-5 pt-[90px] text-center text-white"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C9A15D]">
            LEOS Project Management
          </p>

          <h1 className="mx-auto mt-5 max-w-4xl font-serif text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
            Building Better Spaces.
            <span className="block text-[#C9A15D]">
              Delivering Every Detail.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            Renovation, fit-out, construction and professional project
            management services across the UAE.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex min-h-13 items-center justify-center bg-[#C9A15D] px-8 text-xs font-semibold uppercase tracking-[0.15em] text-[#1E1E1E]"
            >
              Book Free Site Visit
            </a>

            <a
              href="#services"
              className="inline-flex min-h-13 items-center justify-center border border-white/30 px-8 text-xs font-semibold uppercase tracking-[0.15em] text-white"
            >
              View Our Services
            </a>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="flex min-h-[70vh] items-center justify-center bg-[#F6F1E8] px-5 text-center"
      >
        <div>
          <p className="leos-eyebrow">About LEOS</p>

          <h2 className="mt-4 font-serif text-5xl">
            About section will come next.
          </h2>
        </div>
      </section>

      <section
        id="services"
        className="flex min-h-[70vh] items-center justify-center bg-white px-5 text-center"
      >
        <div>
          <p className="leos-eyebrow">Our Services</p>

          <h2 className="mt-4 font-serif text-5xl">
            Services section will come next.
          </h2>
        </div>
      </section>

      <section
        id="projects"
        className="flex min-h-[70vh] items-center justify-center bg-[#1E1E1E] px-5 text-center text-white"
      >
        <div>
          <p className="leos-eyebrow">Our Work</p>

          <h2 className="mt-4 font-serif text-5xl">
            Projects section will come next.
          </h2>
        </div>
      </section>

      <section
        id="process"
        className="flex min-h-[70vh] items-center justify-center bg-[#F6F1E8] px-5 text-center"
      >
        <div>
          <p className="leos-eyebrow">Our Process</p>

          <h2 className="mt-4 font-serif text-5xl">
            Process section will come next.
          </h2>
        </div>
      </section>
    </>
  );
}
