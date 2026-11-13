"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, hasFinePointer, prefersReducedMotion } from "@/lib/motion";

type Props = { children: ReactNode; className?: string; max?: number; as?: "div" | "article" | "li" };

/**
 * Card com inclinação 3D e luz que acompanha o cursor.
 * As variáveis --mx/--my alimentam o efeito .spotlight do CSS.
 */
export function TiltCard({ children, className = "", max = 6, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer()) return;
    const tilt = !prefersReducedMotion();
    const rx = tilt ? gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3" }) : null;
    const ry = tilt ? gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3" }) : null;
    gsap.set(el, { transformPerspective: 1200 });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      rx?.((0.5 - py) * max);
      ry?.((px - 0.5) * max);
    };
    const onLeave = () => { rx?.(0); ry?.(0); };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`spotlight will-change-transform [transform-style:preserve-3d] ${className}`}>
      {children}
    </Tag>
  );
}
