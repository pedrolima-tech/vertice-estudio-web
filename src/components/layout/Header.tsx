"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { nav } from "@/content/navigation";
import { gsap, prefersReducedMotion, scrollToTarget, getLenis } from "@/lib/motion";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export function Header() {
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Esconde ao descer, mostra ao subir
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (!bar.current || open) return;
      const hide = y > last && y > 400;
      bar.current.dataset.hidden = hide ? "true" : "false";
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // Menu mobile: animação, trava de rolagem, Escape e foco
  useEffect(() => {
    const el = menu.current;
    if (!el) return;
    const lenis = getLenis();
    const links = el.querySelectorAll<HTMLElement>("[data-menu-item]");

    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      if (!prefersReducedMotion()) {
        gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "expo.inOut" });
        gsap.fromTo(links, { yPercent: 120 }, { yPercent: 0, stagger: 0.05, delay: 0.35, duration: 1 });
      }
      links[0]?.focus({ preventScroll: true });
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
          toggle.current?.focus({ preventScroll: true });
        }
        if (e.key === "Tab") {
          const f = el.querySelectorAll<HTMLElement>("a, button");
          const first = f[0], lastEl = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
          else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
        }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
  }, [open]);

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    if (wasOpen) toggle.current?.focus({ preventScroll: true });
    // Aguarda o menu liberar a rolagem
    window.setTimeout(() => scrollToTarget(href), wasOpen ? 60 : 0);
    history.replaceState(null, "", href);
  };

  return (
    <>
      <a
        href="#conteudo"
        className="fixed left-4 top-4 z-[110] -translate-y-24 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>

      <header
        ref={bar}
        data-hidden="false"
        className="fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-[var(--ease-expo)] data-[hidden=true]:-translate-y-full"
      >
        <div
          className={`container-x flex h-16 items-center justify-between gap-6 transition-[background-color,border-color,backdrop-filter] duration-500 md:h-20 ${
            scrolled && !open ? "border-b border-border/60 bg-background/60 backdrop-blur-xl" : "border-b border-transparent"
          }`}
        >
          <a href="#inicio" onClick={(e) => go(e, "#inicio")} aria-label="Ir para o início" className="relative z-10 rounded-md">
            <Logo />
          </a>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => go(e, item.href)}
                    className="group relative inline-flex h-10 items-center rounded-full px-4 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                    <span className="absolute inset-x-4 bottom-2 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-2">
            <Button href="#briefing" size="md" arrow className="hidden sm:inline-flex">
              Iniciar projeto
            </Button>
            <button
              ref={toggle}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-strong bg-background/40 backdrop-blur-md lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span className={`absolute left-0 block h-px w-4 bg-foreground transition-transform duration-500 ${open ? "top-1/2 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 block h-px w-4 bg-foreground transition-transform duration-500 ${open ? "top-1/2 -rotate-45" : "bottom-0"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu-mobile"
        ref={menu}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col justify-between bg-card px-4 pb-8 pt-24 md:px-8 lg:hidden"
      >
        <nav aria-label="Menu móvel">
          <ul className="flex flex-col gap-2">
            {[...nav, { label: "Contato", href: "#briefing" }].map((item, i) => (
              <li key={item.href} className="overflow-hidden">
                <a
                  data-menu-item
                  href={item.href}
                  onClick={(e) => go(e, item.href)}
                  className="flex items-baseline gap-4 py-2 text-4xl font-semibold tracking-tight"
                >
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Button href="#briefing" size="lg" arrow magnetic={false} onClick={() => setOpen(false)} className="w-full">
          Iniciar meu projeto
        </Button>
      </div>
    </>
  );
}
