import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Services from "@/components/services/Services";
import Projects from "@/components/projects/Projects";
import Process from "@/components/process/Process";
import Contact from "@/components/contact/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* <About /> */}
      <Services />
      <Projects />
      <Process />
      <Contact />
    </>
  );
}
