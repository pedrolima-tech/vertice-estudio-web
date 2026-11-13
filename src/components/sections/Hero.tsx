"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { SplitText } from "@/components/ui/SplitText";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  // Entrada coreografada dos elementos secundários
  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-fade]", { opacity: 0, y: 24, duration: 1.4, stagger: 0.1, delay: 0.9 });
      gsap.from("[data-hero-line]", { scaleX: 0, transformOrigin: "left", duration: 1.6, delay: 0.4, ease: "expo.inOut" });
    }, root);
    return () => ctx.revert();
  }, []);

  // Ao sair, o conteúdo sobe e desfoca levemente — transição para o manifesto
  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-hero-content]", {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="inicio"
      ref={root}
      aria-labelledby="hero-title"
      className="relative flex min-h-svh flex-col justify-end pb-8 pt-32 md:pb-12"
    >
      <div data-hero-content className="container-x relative z-10 flex flex-col gap-8 md:gap-12">
        <div className="flex items-center gap-4" data-hero-fade>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <p className="eyebrow">Estúdio de desenvolvimento web · Sites, landing pages e sistemas</p>
        </div>

        <SplitText
          id="hero-title"
          as="h1"
          trigger="load"
          delay={0.25}
          stagger={0.08}
          text="Sites que só | poderiam ser *seus*."
          className="max-w-[14ch] text-mega font-semibold"
        />

        <div data-hero-line className="h-px w-full bg-gradient-to-r from-border-strong via-border to-transparent" />

        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <p data-hero-fade className="max-w-xl text-lead text-muted-foreground md:col-span-6">
            Criamos <strong className="font-medium text-foreground">sites personalizados</strong>,{" "}
            <strong className="font-medium text-foreground">landing pages</strong> e{" "}
            <strong className="font-medium text-foreground">soluções tecnológicas</strong> sob medida: do entendimento do seu negócio ao último pixel, com design próprio e código rápido.
          </p>

          <div data-hero-fade className="flex flex-wrap items-center gap-4 md:col-span-6 md:justify-end">
            <Button href="#briefing" size="lg" arrow>
              Iniciar meu projeto
            </Button>
            <Button href="#servicos" size="lg" variant="ghost">
              Conhecer os serviços
            </Button>
          </div>
        </div>

        <div data-hero-fade className="hidden items-center justify-between md:flex">
          <p className="eyebrow flex items-center gap-4">
            <span className="relative block h-8 w-px overflow-hidden bg-border-strong">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2s_var(--ease-quint)_infinite] bg-primary" />
            </span>
            Role e veja uma ideia ganhar forma
          </p>
          <p className="eyebrow">Do bruto ao lapidado</p>
        </div>
      </div>
    </section>
  );
}
