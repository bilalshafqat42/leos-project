import AboutStory from "@/components/about/AboutStory";
import Process from "@/components/process/Process";
import Breather from "@/components/breather/Breather";
import PageBanner from "@/components/page-banner/PageBanner";

export const metadata = {
  title: "About Us",
  description:
    "LEOS Project Management brings renovation, fit-out, construction and project management together under one accountable team across the UAE.",
};

export default function AboutPage() {
  return (
    <>
      <PageBanner
        eyebrow="About LEOS"
        heading="Built On Accountability, Not Just Ambition."
        lead="One team, one point of contact, from the first site visit to the final handover."
      />

      <AboutStory />

      <Process />

      <Breather
        eyebrow="Craftsmanship"
        heading="Every Detail, Considered."
        description="From the first strike of a hammer to the final finish, our site teams treat every renovation as if it were their own home."
        image="/images/hero.avif"
        imagePosition="45% 40%"
        imageAlt="LEOS renovation site under way"
      />
    </>
  );
}
