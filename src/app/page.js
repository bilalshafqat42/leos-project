import Hero from "@/components/hero/Hero";
import BrandStatement from "@/components/brand-statement/BrandStatement";
import AboutTeaser from "@/components/about/AboutTeaser";
import StatsCounter from "@/components/stats-counter/StatsCounter";
import ServicesTeaser from "@/components/services/ServicesTeaser";
import FeaturedProjects from "@/components/projects/FeaturedProjects";
import Breather from "@/components/breather/Breather";
import CtaBanner from "@/components/cta-banner/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />

      <BrandStatement />

      <AboutTeaser />

      <StatsCounter />

      <ServicesTeaser />

      <FeaturedProjects />

      <Breather
        eyebrow="Craftsmanship"
        heading="Every Detail, Considered."
        description="From the first strike of a hammer to the final finish, our site teams treat every renovation as if it were their own home."
        image="/images/hero.avif"
        imagePosition="30% 55%"
        imageAlt="Close-up of a LEOS renovation site under way"
      />

      <CtaBanner
        heading="Let's Build Something Worth Keeping."
        lead="Share the outline of your project and our team will arrange a free initial site visit—usually within one business day."
      />
    </>
  );
}
