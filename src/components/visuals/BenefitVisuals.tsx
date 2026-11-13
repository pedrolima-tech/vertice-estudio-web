"use client";

import { useEffect, useState, type JSX } from "react";
import type { Benefit } from "@/content/benefits";

/* ---------------------------------------------------------------------------
   Micro-visuais: cada diferencial demonstra a si mesmo
   --------------------------------------------------------------------------- */

function CustomVisual() {
  const lines = [
    ["<", "Projeto", " cliente", "=", "\"seu\"", " />"],
    ["identidade", ".", "aplicar", "(marca)"],
    ["layout", ".", "desenhar", "(objetivos)"],
  ];
  return (
    <pre className="overflow-hidden font-mono text-xs leading-loose text-muted-foreground md:text-sm" aria-hidden="true">
      {lines.map((l, i) => (
        <span key={i} className="block transition-transform duration-700 ease-[var(--ease-expo)] group-hover/card:translate-x-2" style={{ transitionDelay: `${i * 60}ms` }}>
          <span className="mr-4 text-subtle-foreground">{String(i + 1).padStart(2, "0")}</span>
          {l.map((tok, j) => (
            <span key={j} className={j === 1 || j === 2 ? "text-primary" : j === 4 ? "text-accent" : ""}>{tok}</span>
          ))}
        </span>
      ))}
    </pre>
  );
}

function IdentityVisual() {
  const swatches = ["bg-primary", "bg-accent", "bg-glow", "bg-foreground"];
  return (
    <div className="flex items-end gap-4" aria-hidden="true">
      <span className="font-serif text-6xl italic leading-none text-aurora transition-transform duration-700 ease-[var(--ease-expo)] group-hover/card:-rotate-6">Aa</span>
      <div className="flex -space-x-2">
        {swatches.map((c, i) => (
          <span
            key={c}
            className={`h-10 w-10 rounded-full border-2 border-card ${c} transition-transform duration-700 ease-[var(--ease-expo)] group-hover/card:-translate-y-2`}
            style={{ transitionDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function UxVisual() {
  return (
    <svg viewBox="0 0 200 80" className="h-20 w-full" aria-hidden="true">
      <path d="M8 64 C 60 64, 60 16, 100 16 S 150 56, 192 20" fill="none" stroke="var(--color-border-strong)" strokeWidth="1.5" strokeDasharray="3 5" />
      <path
        d="M8 64 C 60 64, 60 16, 100 16 S 150 56, 192 20"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="2"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        className="[stroke-dashoffset:1] transition-[stroke-dashoffset] duration-[1.4s] ease-[var(--ease-expo)] group-hover/card:[stroke-dashoffset:0]"
      />
      <circle cx="8" cy="64" r="4" fill="var(--color-foreground)" />
      <circle cx="192" cy="20" r="6" fill="var(--color-primary)" />
    </svg>
  );
}

function ResponsiveVisual() {
  return (
    <div className="flex h-40 items-end justify-center gap-3" aria-hidden="true">
      {[
        { w: "w-24", h: "h-16" },
        { w: "w-14", h: "h-20" },
        { w: "w-8", h: "h-14" },
      ].map((d, i) => (
        <div
          key={i}
          className={`${d.w} ${d.h} flex flex-col gap-1 rounded-md border border-border-strong bg-background/70 p-2 transition-transform duration-700 ease-[var(--ease-expo)] group-hover/card:-translate-y-3`}
          style={{ transitionDelay: `${i * 80}ms` }}
        >
          <span className="h-1 w-3/4 rounded-sm bg-foreground/70" />
          <span className="h-1 w-1/2 rounded-sm bg-aurora" />
          <span className="mt-auto h-2 w-full rounded-sm bg-muted" />
        </div>
      ))}
    </div>
  );
}

/** Mede o carregamento real desta página no aparelho do visitante. */
function PerformanceVisual() {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    const read = () => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (nav && nav.domContentLoadedEventEnd > 0) setMs(Math.round(nav.domContentLoadedEventEnd));
    };
    if (document.readyState === "complete") read();
    else window.addEventListener("load", read, { once: true });
  }, []);
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-5xl font-medium tracking-tight text-foreground tabular-nums">{ms === null ? "—" : (ms / 1000).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      <span className="font-mono text-sm text-muted-foreground">s até o conteúdo ficar pronto</span>
    </div>
  );
}

function GoalsVisual() {
  const goals = ["Vender", "Captar", "Informar", "Automatizar"];
  return (
    <div className="flex flex-wrap gap-2" aria-hidden="true">
      {goals.map((g, i) => (
        <span
          key={g}
          className="rounded-full border border-border-strong px-4 py-2 text-sm transition-colors duration-500 group-hover/card:border-primary/60 group-hover/card:text-primary"
          style={{ transitionDelay: `${i * 90}ms` }}
        >
          {g}
        </span>
      ))}
    </div>
  );
}

export const benefitVisuals: Record<Benefit["visual"], () => JSX.Element> = {
  custom: CustomVisual,
  identity: IdentityVisual,
  ux: UxVisual,
  responsive: ResponsiveVisual,
  performance: PerformanceVisual,
  goals: GoalsVisual,
};
