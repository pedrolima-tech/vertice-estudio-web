"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";
import { sceneState, type SceneState } from "@/lib/scene/state";

type Shot = Partial<Omit<SceneState, "intro">>;

/**
 * Direção de cena: cada seção define onde o objeto 3D fica e quão presente
 * ele é. O progresso da forma (morph) dentro do Processo é controlado pela
 * própria seção Processo.
 */
const shots: Record<string, { desktop: Shot; mobile: Shot }> = {
  inicio: { desktop: { morph: 4, x: 0.31, y: 0.08, scale: 0.9, dim: 0 }, mobile: { morph: 4, x: 0, y: 0.22, scale: 0.9, dim: 0.1 } },
  sobre: { desktop: { morph: 0, x: 0.1, y: 0, scale: 1.1, dim: 0.3 }, mobile: { morph: 0, x: 0, y: 0, scale: 1, dim: 0.6 } },
  servicos: { desktop: { morph: 0.6, x: 0.3, y: 0.1, scale: 0.9, dim: 1 }, mobile: { morph: 0.6, x: 0, y: 0, scale: 0.9, dim: 1 } },
  processo: { desktop: { x: 0.22, y: 0, scale: 1.05, dim: 0 }, mobile: { x: 0, y: 0.14, scale: 0.95, dim: 0.15 } },
  projetos: { desktop: { morph: 4, x: 0.42, y: -0.32, scale: 0.6, dim: 1 }, mobile: { morph: 4, x: 0, y: 0, scale: 0.8, dim: 1 } },
  diferenciais: { desktop: { morph: 4, x: -0.42, y: 0.3, scale: 0.6, dim: 1 }, mobile: { morph: 4, x: 0, y: 0, scale: 0.8, dim: 1 } },
  duvidas: { desktop: { morph: 4, x: -0.32, y: -0.22, scale: 0.75, dim: 0.6 }, mobile: { morph: 4, x: 0, y: 0, scale: 0.8, dim: 1 } },
  contato: { desktop: { morph: 4, x: 0, y: 0.12, scale: 1.05, dim: 0.4 }, mobile: { morph: 4, x: 0, y: 0.16, scale: 1, dim: 0.35 } },
  briefing: { desktop: { morph: 4, x: 0.3, y: 0, scale: 0.85, dim: 0.75 }, mobile: { morph: 4, x: 0, y: 0, scale: 0.8, dim: 1 } },
};

export function SceneDirector() {
  useEffect(() => {
    // Abertura: a gema se constrói diante do visitante (a promessa final),
    // depois se dissolve em ideias soltas e é reconstruída no Processo.
    const atTop = window.scrollY < window.innerHeight * 0.5;
    const opening = atTop && !prefersReducedMotion();
    if (opening) sceneState.morph = 1.6;
    const onReady = () => {
      sceneState.intro = 1;
      if (opening && window.scrollY < window.innerHeight * 0.5) {
        gsap.to(sceneState, { morph: 4, duration: 3.4, delay: 0.3, ease: "power2.inOut", overwrite: "auto" });
      }
    };
    window.addEventListener("scene-ready", onReady, { once: true });

    const mm = gsap.matchMedia();
    mm.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" }, (ctx) => {
      const variant = ctx.conditions?.desktop ? "desktop" : "mobile";
      Object.entries(shots).forEach(([id, shot]) => {
        const el = document.getElementById(id);
        if (!el) return;
        const go = (back: boolean) => {
          const target = { ...shot[variant] };
          // Na primeira entrada do topo, a forma fica por conta da abertura
          if (id === "inicio" && !back) delete target.morph;
          gsap.to(sceneState, { ...target, duration: 1.6, ease: "power3.out", overwrite: "auto" });
        };
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => go(false),
          onEnterBack: () => go(true),
        });
      });
      // Estado inicial correto ao recarregar no meio da página
      ScrollTrigger.refresh();
    });

    return () => {
      window.removeEventListener("scene-ready", onReady);
      mm.revert();
    };
  }, []);

  return null;
}
