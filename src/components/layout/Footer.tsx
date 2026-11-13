"use client";

import type { MouseEvent } from "react";
import { site, whatsappLink } from "@/config/site";
import { nav } from "@/content/navigation";
import { services } from "@/content/services";
import { scrollToTarget } from "@/lib/motion";
import { Logo } from "@/components/ui/Logo";

const socialLabels: Record<string, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  github: "GitHub",
  behance: "Behance",
};

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      scrollToTarget(href);
    }
  };
  return (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <span className="h-px w-0 bg-primary transition-[width] duration-500 ease-[var(--ease-expo)] group-hover:w-4" aria-hidden="true" />
      {children}
    </a>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const socials = Object.entries(site.social).filter(([, url]) => url);

  return (
    <footer className="relative z-10 overflow-hidden border-t border-border bg-background">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-24">
        <div className="flex flex-col gap-6 md:col-span-4">
          <Logo />
          <p className="max-w-xs text-sm leading-normal text-muted-foreground">{site.description}</p>
        </div>

        <nav aria-label="Serviços" className="flex flex-col gap-4 md:col-span-3">
          <p className="eyebrow">Serviços</p>
          <ul className="flex flex-col gap-3">
            {services.map((s) => (
              <li key={s.id}><FooterLink href="#servicos">{s.title}</FooterLink></li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Navegação do rodapé" className="flex flex-col gap-4 md:col-span-2">
          <p className="eyebrow">Navegação</p>
          <ul className="flex flex-col gap-3">
            {nav.map((n) => (
              <li key={n.href}><FooterLink href={n.href}>{n.label}</FooterLink></li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4 md:col-span-3">
          <p className="eyebrow">Contato</p>
          <ul className="flex flex-col gap-3">
            <li><FooterLink href={whatsappLink()} external>WhatsApp</FooterLink></li>
            {site.contact.email && <li><FooterLink href={`mailto:${site.contact.email}`}>{site.contact.email}</FooterLink></li>}
            {site.contact.city && <li className="text-sm text-muted-foreground">{site.contact.city}</li>}
            {socials.map(([k, url]) => (
              <li key={k}><FooterLink href={url} external>{socialLabels[k] ?? k}</FooterLink></li>
            ))}
          </ul>
        </div>
      </div>

      {/* Assinatura gigante — a marca como elemento gráfico */}
      <div className="container-x" aria-hidden="true">
        <p className="select-none bg-gradient-to-b from-foreground/15 to-transparent bg-clip-text text-center text-[22vw] font-semibold leading-[0.8] tracking-tighter text-transparent">
          {site.name}
        </p>
      </div>

      <div className="container-x flex flex-col gap-4 border-t border-border py-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {site.legalName || site.name}. Todos os direitos reservados.
          {site.cnpj && <> · CNPJ {site.cnpj}</>}
        </p>
        <a
          href="#inicio"
          onClick={(e) => { e.preventDefault(); scrollToTarget("#inicio"); }}
          className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
        >
          Voltar ao topo
          <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
    </footer>
  );
}
