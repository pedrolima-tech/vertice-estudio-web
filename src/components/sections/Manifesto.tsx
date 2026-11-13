"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { manifesto, manifestoHighlights, principles } from "@/content/about";
import { SplitText } from "@/components/ui/SplitText";

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      // As palavras acendem conforme a leitura avança
      gsap.fromTo(
        "[data-word]",
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: "[data-statement]", start: "top 75%", end: "bottom 45%", scrub: 0.6 },
        },
      );
      gsap.from("[data-principle]", {
        y: 48,
        opacity: 0,
        stagger: 0.12,
        duration: 1.4,
        scrollTrigger: { trigger: "[data-principles]", start: "top 85%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="sobre" ref={root} aria-labelledby="sobre-title" className="relative py-24 md:py-32 lg:py-48">
      <div className="container-x relative z-10">
        <div className="mb-12 flex items-center gap-4 md:mb-16">
          <span className="font-mono text-xs text-primary">(01)</span>
          <h2 id="sobre-title" className="eyebrow">Quem somos</h2>
        </div>

        <p data-statement className="max-w-6xl text-headline font-medium">
          {manifesto.split(" ").map((w, i) => (
            <span key={i} data-word className={manifestoHighlights.includes(w) ? "font-serif font-normal italic text-aurora" : undefined}>
              {w}{" "}
            </span>
          ))}
        </p>

        <div data-principles className="mt-24 grid gap-8 border-t border-border pt-12 md:mt-32 md:grid-cols-3 md:gap-12">
          {principles.map((p, i) => (
            <div key={p.title} data-principle className="flex flex-col gap-4">
              <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              <h3 className="text-xl font-semibold leading-normal tracking-tight">{p.title}</h3>
              <p className="max-w-sm text-base leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>

        <SplitText
          as="p"
          text="Uma agência digital para quem não quer *parecer* com mais ninguém."
          className="mt-24 max-w-3xl text-2xl font-semibold leading-snug tracking-tight md:mt-32 md:text-3xl"
        />
      </div>
    </section>
  );
}
