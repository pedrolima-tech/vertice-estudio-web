"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, hasFinePointer, prefersReducedMotion } from "@/lib/motion";

/**
 * Cursor personalizado: ponto preciso + anel com inércia.
 * - Cresce sobre links e botões.
 * - Mostra um rótulo em elementos com [data-cursor="Texto"].
 * - Só existe em dispositivos com mouse; some sobre campos de texto.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!hasFinePointer()) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const reduce = prefersReducedMotion();
    const d = dot.current;
    const r = ring.current;
    gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dx = gsap.quickTo(d, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: reduce ? 0.01 : 0.45, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: reduce ? 0.01 : 0.45, ease: "power3" });

    let visible = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!visible) {
        visible = true;
        gsap.set([d, r], { x: e.clientX, y: e.clientY });
        gsap.to([d, r], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    };

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select")) {
        r.dataset.state = "hidden";
        setLabel("");
        return;
      }
      const labeled = t.closest<HTMLElement>("[data-cursor]");
      if (labeled) {
        r.dataset.state = "label";
        setLabel(labeled.dataset.cursor || "");
        return;
      }
      r.dataset.state = t.closest("a, button, [role='button'], label, summary") ? "hover" : "";
      setLabel("");
    };

    const onLeave = () => {
      visible = false;
      gsap.to([d, r], { opacity: 0, duration: 0.3 });
    };
    const onDown = () => (r.dataset.pressed = "true");
    const onUp = () => (r.dataset.pressed = "");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={dot}
        className="fixed left-0 top-0 h-2 w-2 rounded-full bg-foreground mix-blend-difference"
      />
      <div
        ref={ring}
        className="group fixed left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/40 transition-[width,height,background-color,border-color,opacity,scale] duration-500 ease-[var(--ease-expo)]
          data-[state=hover]:h-16 data-[state=hover]:w-16 data-[state=hover]:border-primary data-[state=hover]:bg-primary/10
          data-[state=label]:h-24 data-[state=label]:w-24 data-[state=label]:border-transparent data-[state=label]:bg-foreground
          data-[state=hidden]:scale-0 data-[pressed=true]:scale-90"
      >
        <span className="eyebrow !text-background opacity-0 transition-opacity duration-300 group-data-[state=label]:opacity-100">
          {label}
        </span>
      </div>
    </div>
  );
}
