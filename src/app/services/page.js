import Services from "@/components/services/Services";
import Projects from "@/components/projects/Projects";
import ConsultancyServices from "@/components/services/ConsultancyServices";
import Breather from "@/components/breather/Breather";
import PageBanner from "@/components/page-banner/PageBanner";

export const metadata = {
  title: "Services",
  description:
    "Villa, bathroom, kitchen and apartment renovation, plus project management, office renovation and fit-out across the UAE.",
};

export default function ServicesPage() {
  return (
    <>
      <PageBanner
        eyebrow="What We Do"
        heading="Renovation And Construction, Managed End To End."
        lead="Scroll through each service below, then see recent projects in the gallery underneath."
      />

      <Services />

      <Projects />

      <ConsultancyServices />

      <Breather
        eyebrow="Handover"
        heading="Built To Last. Handed Over With Confidence."
        description="Every project closes with a full walkthrough, documentation and warranty—so the keys you receive come with total peace of mind."
        image="/images/about.avif"
        imagePosition="55% 45%"
        imageAlt="Completed LEOS renovation ready for handover"
      />
    </>
  );
}
