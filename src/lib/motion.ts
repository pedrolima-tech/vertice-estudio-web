"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "expo.out", duration: 1.2 });
}

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const hasFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* Instância única do Lenis, registrada pelo SmoothScroll */
let lenisInstance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => (lenisInstance = l);
export const getLenis = () => lenisInstance;

/** Rolagem suave até um seletor/âncora, com fallback nativo. */
export function scrollToTarget(target: string) {
  const el = document.querySelector<HTMLElement>(target);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.6, force: true });
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
  // Move o foco para a seção, para quem navega por teclado
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}
