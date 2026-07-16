import Hero from "@/components/hero/Hero";

export default function HomePage() {
  return (
    <>
      <Hero />

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
