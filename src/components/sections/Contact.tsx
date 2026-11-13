"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { SplitText } from "@/components/ui/SplitText";
import { Button } from "@/components/ui/Button";
import { Briefing } from "@/components/forms/Briefing";

export function Contact() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-cta-scale]", { scale: 0.86 }, {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: "[data-cta-scale]", start: "top bottom", end: "center center", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="contato-title" className="relative">
      <div id="contato" className="relative flex min-h-svh items-center py-24">
        <div data-cta-scale className="container-x relative z-10 flex flex-col items-center gap-12 text-center">
          <p className="eyebrow">(07) Vamos conversar</p>
          <SplitText
            id="contato-title"
            text="Vamos dar *forma* | à sua ideia?"
            className="text-mega font-semibold"
            stagger={0.07}
          />
          <p className="max-w-xl text-lead text-muted-foreground">
            Conte o que você precisa. Respondemos com perguntas, ideias e uma proposta pensada para o seu negócio.
          </p>
          <Button href="#briefing" size="lg" variant="light" arrow>
            Solicitar orçamento
          </Button>
        </div>
      </div>

      <div id="briefing" className="relative pb-24 md:pb-32">
        <div className="container-x relative z-10 grid gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <p className="eyebrow">Briefing rápido</p>
            <h2 className="text-headline font-semibold">
              Comece pelo <span className="font-serif font-normal italic text-aurora">essencial</span>.
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Quatro perguntas rápidas. No final, a mensagem chega pronta no nosso WhatsApp, e você só precisa enviar.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-xl md:p-8 lg:col-span-8 lg:p-12">
            <Briefing />
          </div>
        </div>
      </div>
    </section>
  );
}
