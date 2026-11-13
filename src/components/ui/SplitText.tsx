"use client";

import { createElement, useRef, type ElementType } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** "scroll": revela ao entrar na tela · "load": revela ao montar (hero) */
  trigger?: "scroll" | "load";
  delay?: number;
  stagger?: number;
  id?: string;
};

/**
 * Título com revelação palavra por palavra, por máscara.
 * Palavras entre *asteriscos* ganham o destaque serifado em degradê; "|" quebra a linha.
 */
export function SplitText({ text, as = "h2", className = "", trigger = "scroll", delay = 0, stagger = 0.06, id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const words = el.querySelectorAll<HTMLElement>(".split-word > span");

    const ctx = gsap.context(() => {
      gsap.set(words, { yPercent: 110, rotate: 4 });
      gsap.to(words, {
        yPercent: 0,
        rotate: 0,
        duration: 1.4,
        stagger,
        delay,
        ease: "expo.out",
        scrollTrigger: trigger === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
      });
    }, el);
    return () => ctx.revert();
  }, [trigger, delay, stagger]);

  const tokens = text.split(/(\s+)/);
  return createElement(
    as,
    { ref, className, id },
    tokens.map((tok, i) => {
      if (/^\s+$/.test(tok)) return " ";
      if (tok === "|") return <br key={i} />;
      const accent = /^\*.+\*[.,!?]?$/.test(tok);
      const clean = tok.replace(/\*/g, "");
      return (
        <span key={i} className="split-word">
          <span className={accent ? "font-serif font-normal italic text-aurora pr-[0.06em]" : undefined}>{clean}</span>
        </span>
      );
    }),
  );
}
