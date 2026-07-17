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
    </>
  );
}
