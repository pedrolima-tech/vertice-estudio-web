"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";
import { steps } from "@/content/process";
import { sceneState } from "@/lib/scene/state";

const forms = ["Ideias dispersas", "Núcleo", "Estrutura", "Construção", "Lapidado"];

/**
 * Storytelling do processo: a seção fica fixa enquanto a rolagem avança
 * pelas cinco etapas. O objeto 3D evolui junto (morph 0 → 4).
 */
export function Process() {
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(true);
  const activeRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setPinned(false);
      return;
    }
    const el = pin.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: () => `+=${window.innerHeight * steps.length * 0.9}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onEnter: () => gsap.killTweensOf(sceneState, "morph"),
        onEnterBack: () => gsap.killTweensOf(sceneState, "morph"),
        onUpdate: (self) => {
          const p = self.progress;
          sceneState.morph = p * 4;
          gsap.set("[data-process-bar]", { scaleX: p });
          const idx = Math.min(steps.length - 1, Math.floor(p * steps.length));
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
          }
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // Transição entre etapas: a anterior sobe, a nova entra de baixo
  useEffect(() => {
    if (!pinned || prefersReducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        `[data-step="${active}"] [data-step-anim]`,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, stagger: 0.06, ease: "expo.out", overwrite: true },
      );
    }, root);
    return () => ctx.revert();
  }, [active, pinned]);

  if (!pinned) {
    // Versão estática (movimento reduzido): lista completa e legível
    return (
      <section id="processo" ref={root} aria-labelledby="processo-title" className="relative py-24 md:py-32">
        <div className="container-x relative z-10">
          <ProcessHeading />
          <ol className="mt-16 grid gap-12 md:max-w-2xl">
            {steps.map((s) => (
              <li key={s.index} className="flex flex-col gap-2 border-t border-border pt-6">
                <span className="font-mono text-xs text-primary">{s.index} · {s.verb}</span>
                <h3 className="text-2xl font-semibold leading-snug tracking-tight">{s.title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground">{s.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section id="processo" ref={root} aria-labelledby="processo-title" className="relative">
      <div ref={pin} className="relative flex h-svh flex-col overflow-hidden pb-8 pt-24 md:pb-12 md:pt-32">
        <div className="container-x relative z-10 flex h-full flex-col">
          <ProcessHeading />

          <ol className="relative mt-auto md:max-w-[52%]">
            {steps.map((s, i) => (
              <li
                key={s.index}
                data-step={i}
                aria-current={i === active ? "step" : undefined}
                className={`flex flex-col gap-4 ${i === active ? "relative" : "pointer-events-none absolute inset-x-0 bottom-0 opacity-0"}`}
                {...(i !== active ? { "aria-hidden": true } : {})}
              >
                <div className="overflow-hidden">
                  <p data-step-anim className="flex items-baseline gap-4">
                    <span className="font-mono text-sm text-primary">{s.index}</span>
                    <span className="text-giant font-semibold">{s.verb}</span>
                  </p>
                </div>
                <div className="overflow-hidden">
                  <h3 data-step-anim className="text-2xl font-semibold leading-snug tracking-tight md:text-3xl">{s.title}</h3>
                </div>
                <div className="overflow-hidden">
                  <p data-step-anim className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">{s.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <ol className="flex gap-2" aria-hidden="true">
                {steps.map((s, i) => (
                  <li
                    key={s.index}
                    className={`font-mono text-xs transition-colors duration-500 ${i <= active ? "text-foreground" : "text-subtle-foreground"}`}
                  >
                    {s.index}
                  </li>
                ))}
              </ol>
              <p className="eyebrow hidden sm:block" aria-hidden="true">
                Forma atual: <span className="text-primary">{forms[active]}</span>
              </p>
            </div>
            <div className="h-px w-full bg-border">
              <div data-process-bar className="h-px w-full origin-left scale-x-0 bg-aurora" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessHeading() {
  return (
    <div className="flex flex-col gap-6 md:max-w-xl">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-primary">(03)</span>
        <p className="eyebrow">Nosso processo</p>
      </div>
      <h2 id="processo-title" className="text-headline font-semibold">
        Da sua necessidade a uma solução <span className="font-serif font-normal italic text-aurora">lapidada</span>.
      </h2>
    </div>
  );
}
