"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { projects, type Project } from "@/content/projects";
import { SplitText } from "@/components/ui/SplitText";
import { TiltCard } from "@/components/ui/TiltCard";
import { Button } from "@/components/ui/Button";

function ProjectCase({ p, index }: { p: Project; index: number }) {
  const Wrapper = p.url ? "a" : "div";
  return (
    <article data-case className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
      <Wrapper
        {...(p.url ? { href: p.url, target: "_blank", rel: "noopener noreferrer", "aria-label": `Abrir o site ${p.client} em nova aba` } : {})}
        data-cursor={p.url ? "Visitar" : p.client}
        className="group/case block lg:col-span-7"
      >
        <TiltCard max={4} className="rounded-2xl border border-border bg-card p-2 md:p-4" >
          <div
            className="pointer-events-none absolute -inset-px -z-10 rounded-2xl opacity-40 blur-3xl transition-opacity duration-700 group-hover/case:opacity-70"
            style={{ background: `radial-gradient(60% 60% at 50% 60%, ${p.accent}, transparent 70%)` }}
          />
          <div className="mb-2 flex h-6 items-center gap-2 px-2 md:mb-4">
            <span className="h-2 w-2 rounded-full bg-border-strong" />
            <span className="h-2 w-2 rounded-full bg-border-strong" />
            <span className="h-2 w-2 rounded-full bg-border-strong" />
            <span className="ml-2 font-mono text-xs text-subtle-foreground">{p.client.toLowerCase().replace(/\s+/g, "")}</span>
          </div>
          <div data-case-media className="relative overflow-hidden rounded-lg">
            <div data-case-parallax className="scale-110">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.image.src}
              alt={p.image.alt}
              width={p.image.width}
              height={p.image.height}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover/case:scale-[1.04]"
            />
            </div>
          </div>
        </TiltCard>
      </Wrapper>

      <div className="flex flex-col gap-6 lg:col-span-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
          {[p.type, p.segment, p.location, p.year].filter(Boolean).map((tag) => (
            <span key={tag} className="rounded-full border border-border-strong px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-headline font-semibold">{p.client}</h3>
        <p className="text-lead text-muted-foreground">{p.summary}</p>
        <div className="border-t border-border pt-6">
          <p className="eyebrow mb-4">O que foi entregue</p>
          <ul className="grid gap-3">
            {p.delivered.map((d) => (
              <li key={d} className="flex gap-3 text-base leading-relaxed">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export function Work() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-case-media]").forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(18% 8% 18% 8% round 8px)" }, {
          clipPath: "inset(0% 0% 0% 0% round 8px)",
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 95%", end: "center 55%", scrub: 0.8 },
        });
        const layer = el.querySelector("[data-case-parallax]");
        if (layer) gsap.fromTo(layer, { yPercent: -4 }, {
          yPercent: 4,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      gsap.from("[data-next]", { y: 64, opacity: 0, duration: 1.4, scrollTrigger: { trigger: "[data-next]", start: "top 90%", once: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="projetos" ref={root} aria-labelledby="projetos-title" className="relative py-24 md:py-32 lg:py-48">
      <div className="container-x relative z-10">
        <div className="mb-16 flex flex-col gap-8 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-8 flex items-center gap-4">
              <span className="font-mono text-xs text-primary">(04)</span>
              <p className="eyebrow">Projetos</p>
            </div>
            <SplitText id="projetos-title" text="Trabalho que *fala* | por si." className="text-giant font-semibold" />
          </div>
          <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
            Projetos reais, apresentados como foram entregues.
          </p>
        </div>

        <div className="flex flex-col gap-24 md:gap-32">
          {projects.map((p, i) => <ProjectCase key={p.slug} p={p} index={i} />)}

          {/* Espaço reservado para os próximos cases */}
          <div data-next className="relative overflow-hidden rounded-2xl border border-dashed border-border-strong p-8 md:p-12">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-4">
                <span className="font-mono text-xs text-muted-foreground">{String(projects.length + 1).padStart(2, "0")} · Próximo case</span>
                <p className="max-w-xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                  O seu projeto pode ser o <span className="font-serif font-normal italic text-aurora">próximo</span> desta lista.
                </p>
              </div>
              <Button href="#briefing" size="lg" arrow>Quero o meu</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
