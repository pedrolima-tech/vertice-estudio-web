"use client";

import { useId, useState } from "react";
import { faq } from "@/content/faq";
import { SplitText } from "@/components/ui/SplitText";

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <li className="border-b border-border">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-btn`}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left text-xl font-medium leading-normal tracking-tight transition-colors hover:text-primary md:py-8 md:text-2xl"
        >
          {q}
          <span
            aria-hidden="true"
            className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-[transform,border-color,background-color] duration-500 ease-[var(--ease-expo)] ${
              open ? "rotate-45 border-primary bg-primary text-primary-foreground" : "border-border-strong"
            }`}
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-expo)] ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <p className="max-w-2xl pb-8 text-base leading-relaxed text-muted-foreground md:text-lg">{a}</p>
        </div>
      </div>
    </li>
  );
}

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="duvidas" aria-labelledby="duvidas-title" className="relative py-24 md:py-32 lg:py-48">
      <div className="container-x relative z-10 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-xs text-primary">(06)</span>
            <p className="eyebrow">Dúvidas</p>
          </div>
          <SplitText id="duvidas-title" text="Perguntas | *frequentes*" className="text-headline font-semibold" />
        </div>
        <ul className="border-t border-border lg:col-span-8">
          {faq.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </ul>
      </div>
    </section>
  );
}
