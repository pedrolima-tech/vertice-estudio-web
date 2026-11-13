"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { benefits } from "@/content/benefits";
import { SplitText } from "@/components/ui/SplitText";
import { TiltCard } from "@/components/ui/TiltCard";
import { benefitVisuals } from "@/components/visuals/BenefitVisuals";

const spans: Record<string, string> = {
  wide: "md:col-span-2",
  tall: "md:row-span-2",
};

export function Benefits() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-benefit]", {
        y: 64,
        opacity: 0,
        scale: 0.96,
        stagger: { each: 0.08, from: "start" },
        duration: 1.4,
        scrollTrigger: { trigger: "[data-bento]", start: "top 80%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="diferenciais" ref={root} aria-labelledby="diferenciais-title" className="relative py-24 md:py-32 lg:py-48">
      <div className="container-x relative z-10">
        <div className="mb-16 flex flex-col gap-8 md:mb-24">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-primary">(05)</span>
            <p className="eyebrow">Diferenciais</p>
          </div>
          <SplitText id="diferenciais-title" text="O que você ganha | com um projeto *nosso*." className="max-w-5xl text-giant font-semibold" />
        </div>

        <ul data-bento className="grid auto-rows-[minmax(16rem,auto)] gap-4 md:grid-cols-3 md:gap-6">
          {benefits.map((b) => {
            const Visual = benefitVisuals[b.visual];
            return (
              <li key={b.title} data-benefit className={b.span ? spans[b.span] : ""}>
                <TiltCard max={4} className="group/card h-full rounded-2xl border border-border bg-card/80 backdrop-blur-md">
                  <div className="flex h-full flex-col justify-between gap-8 p-6 md:p-8">
                    <div className="flex min-h-20 items-center">
                      <Visual />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-semibold leading-normal tracking-tight md:text-2xl">{b.title}</h3>
                      <p className="max-w-md text-sm leading-normal text-muted-foreground md:text-base md:leading-relaxed">{b.text}</p>
                    </div>
                  </div>
                </TiltCard>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
