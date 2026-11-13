"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Canvas 3D fixo atrás de todo o conteúdo. O Three.js é carregado sob
 * demanda, depois do conteúdo principal, para não atrasar a primeira pintura.
 */
export function Scene() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supportsWebGL()) {
      setFallback(true);
      window.dispatchEvent(new Event("scene-ready"));
      return;
    }
    let exp: { start(): void; dispose(): void } | null = null;
    let cancelled = false;

    const boot = async () => {
      const { Experience } = await import("@/lib/scene/Experience");
      if (cancelled || !canvas.current) return;
      try {
        exp = new Experience(canvas.current, {
          reducedMotion: prefersReducedMotion(),
          mobile: window.matchMedia("(max-width: 767px), (pointer: coarse)").matches,
        });
        exp.start();
        setReady(true);
        window.dispatchEvent(new Event("scene-ready"));
      } catch {
        setFallback(true);
      }
    };

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
    idle(() => void boot());

    return () => {
      cancelled = true;
      exp?.dispose();
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      {/* Halo de base: aparece mesmo sem WebGL e dá profundidade ao fundo */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_40%,color-mix(in_oklab,var(--color-accent)_14%,transparent),transparent_70%),radial-gradient(40%_40%_at_20%_80%,color-mix(in_oklab,var(--color-primary)_8%,transparent),transparent_70%)]" />
      {fallback ? (
        <div className="absolute right-[8%] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-aurora opacity-40 blur-3xl md:h-96 md:w-96" />
      ) : (
        <canvas
          ref={canvas}
          className={`absolute inset-0 h-full w-full transition-opacity duration-[1500ms] ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {/* Vinheta para manter o texto legível nas bordas */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_55%,var(--color-background)_100%)]" />
    </div>
  );
}
