import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SceneDirector } from "@/components/providers/SceneDirector";
import { Cursor } from "@/components/effects/Cursor";
import { Scene } from "@/components/effects/Scene";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Marquee } from "@/components/sections/Marquee";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Work } from "@/components/sections/Work";
import { Benefits } from "@/components/sections/Benefits";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Scene />
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <ScrollProgress />
      <Header />

      <main id="conteudo" className="relative z-10">
        <Hero />
        <Manifesto />
        <Marquee />
        <Services />
        <Process />
        <Work />
        <Benefits />
        <Faq />
        <Contact />
      </main>

      <Footer />
      <SceneDirector />
    </>
  );
}
