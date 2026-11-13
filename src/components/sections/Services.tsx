"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { services, type Service } from "@/content/services";
import { SplitText } from "@/components/ui/SplitText";
import { TiltCard } from "@/components/ui/TiltCard";
import { Button } from "@/components/ui/Button";
import { LandingVisual, SiteVisual, SystemVisual } from "@/components/visuals/ServiceVisuals";

const visuals = { site: SiteVisual, landing: LandingVisual, system: SystemVisual };

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true">
      <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ServiceCard({ s }: { s: Service }) {
  const Visual = visuals[s.visual];
  return (
    <TiltCard as="article" className="group/card h-full rounded-2xl border border-border bg-card/80 backdrop-blur-md">
      <div className="flex h-full flex-col gap-8 p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <span className="font-mono text-xs text-muted-foreground">{s.index}</span>
          <span className="rounded-full border border-border-strong px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {s.kicker}
          </span>
        </div>
        <div className="flex min-h-56 items-center [transform:translateZ(40px)]">
          <Visual />
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <h3 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{s.title}</h3>
          <p className="text-base leading-relaxed text-muted-foreground">{s.description}</p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {s.items.map((it) => (
              <li key={it} className="flex gap-2 text-sm leading-normal text-foreground/90">
                <Check />
                {it}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </TiltCard>
  );
}

export function Services() {
  const root = useRef<HTMLElement>(null);
  const [site, landing, system] = services;

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-service]").forEach((el, i) => {
        gsap.from(el, {
          y: 96,
          opacity: 0,
          rotateX: -12,
          transformPerspective: 1200,
          duration: 1.6,
          delay: (i % 2) * 0.12,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="servicos" ref={root} aria-labelledby="servicos-title" className="relative py-24 md:py-32 lg:py-48">
      <div className="container-x relative z-10">
        <div className="mb-16 grid gap-8 md:mb-24 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="mb-8 flex items-center gap-4">
              <span className="font-mono text-xs text-primary">(02)</span>
              <p className="eyebrow">Serviços</p>
            </div>
            <SplitText id="servicos-title" text="Feito sob *medida*, | do primeiro rascunho ao ar." className="text-giant font-semibold" />
          </div>
          <p className="max-w-md text-lead text-muted-foreground md:col-span-5 md:justify-self-end">
            Nosso foco é criar sites e landing pages que representam o seu negócio e trabalham por ele todos os dias.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div data-service><ServiceCard s={site} /></div>
          <div data-service><ServiceCard s={landing} /></div>
        </div>

        {/* Serviço complementar: aparece como uma faixa à parte, sem competir com os principais */}
        <div data-service className="mt-6">
          <TiltCard as="article" max={3} className="group/card rounded-2xl border border-border bg-gradient-to-br from-card via-card to-accent/10 backdrop-blur-md">
            <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-12 lg:items-center lg:gap-12">
              <div className="flex flex-col gap-4 lg:col-span-5">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-muted-foreground">{system.index}</span>
                  <span className="eyebrow !text-primary">{system.kicker}</span>
                </div>
                <h3 className="text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{system.title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground">{system.description}</p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {system.items.map((it) => (
                    <li key={it} className="flex gap-2 text-sm leading-normal text-foreground/90">
                      <Check />
                      {it}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <Button href="#briefing" variant="ghost" arrow>Conte o seu desafio</Button>
                </div>
              </div>
              <div className="lg:col-span-7 [transform:translateZ(32px)]">
                <SystemVisual />
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
