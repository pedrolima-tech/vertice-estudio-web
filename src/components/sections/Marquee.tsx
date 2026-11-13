"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";
import { marquee } from "@/content/marquee";

/** Faixa infinita que acelera e inverte com a velocidade da rolagem. */
export function Marquee() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el || prefersReducedMotion()) return;

    const tween = gsap.to(el, { xPercent: -50, repeat: -1, duration: 38, ease: "none" });
    // Folga para poder rodar ao contrário quando a rolagem sobe
    tween.totalTime(38 * 500);
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity() / 300;
        const dir = self.direction;
        gsap.to(tween, { timeScale: dir * Math.min(1 + Math.abs(v), 6), duration: 0.3, overwrite: true });
        gsap.to(tween, { timeScale: dir, duration: 1.2, delay: 0.3, overwrite: false });
      },
    });
    return () => {
      st.kill();
      tween.kill();
    };
  }, []);

  const items = [...marquee, ...marquee];

  return (
    <div aria-hidden="true" className="relative z-10 overflow-hidden py-8">
    <div className="-mx-8 -rotate-2 overflow-hidden border-y border-border bg-card/80 py-6 backdrop-blur-sm md:py-8">
      <div ref={track} className="flex w-max">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {items.map((t, i) => (
              <span key={`${k}-${i}`} className="flex items-center text-3xl font-semibold tracking-tight md:text-5xl">
                <span className={i % 2 ? "font-serif font-normal italic text-aurora" : ""}>{t}</span>
                <svg viewBox="0 0 24 24" className="mx-8 h-6 w-6 text-primary md:mx-12" aria-hidden="true">
                  <path d="M12 0 14.5 9.5 24 12 14.5 14.5 12 24 9.5 14.5 0 12 9.5 9.5Z" fill="currentColor" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
