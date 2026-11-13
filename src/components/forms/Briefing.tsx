"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { whatsappLink } from "@/config/site";
import { briefing } from "@/content/briefing";
import { Button } from "@/components/ui/Button";
import { Chip } from "./Chip";
import { Field } from "./Field";

/**
 * Briefing em 4 etapas. No final, abre o WhatsApp com a mensagem pronta.
 * Opções e títulos das etapas ficam em src/content/briefing.ts.
 */
export function Briefing() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState("");
  const [goal, setGoal] = useState<string[]>([]);
  const [when, setWhen] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [sentLink, setSentLink] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  const total = briefing.stepTitles.length;

  useEffect(() => {
    if (!panel.current || prefersReducedMotion()) return;
    gsap.fromTo(panel.current, { opacity: 0, x: 32 }, { opacity: 1, x: 0, duration: 0.8 });
  }, [step]);

  const validate = () => {
    if (step === 0 && !type) return "Escolha o tipo de projeto.";
    if (step === 1 && goal.length === 0) return "Escolha pelo menos um objetivo.";
    if (step === 2 && !when) return "Escolha um prazo.";
    if (step === 3 && name.trim().length < 2) return "Informe o seu nome.";
    return "";
  };

  const next = () => {
    const msg = validate();
    setError(msg);
    if (msg) return;
    setStep((s) => Math.min(total - 1, s + 1));
    requestAnimationFrame(() => heading.current?.focus());
  };

  const back = () => {
    setError("");
    setStep((s) => Math.max(0, s - 1));
    requestAnimationFrame(() => heading.current?.focus());
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (step < total - 1) return next();
    const msg = validate();
    setError(msg);
    if (msg) return;

    const lines = [
      "Olá! Vim pelo site e quero conversar sobre um projeto.",
      "",
      `• Tipo: ${type}`,
      `• Objetivo: ${goal.join(", ")}`,
      `• Prazo: ${when}`,
      `• Nome: ${name.trim()}`,
    ];
    if (company.trim()) lines.push(`• Empresa: ${company.trim()}`);
    if (details.trim()) lines.push(`• Detalhes: ${details.trim()}`);
    const text = lines.join("\n");

    const link = whatsappLink(text);
    setSentLink(link);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  if (sentLink) {
    return (
      <div className="flex flex-col items-start gap-6 py-8" role="status">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
          <svg viewBox="0 0 16 16" className="h-6 w-6" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <h3 className="text-3xl font-semibold leading-tight tracking-tight">Mensagem pronta no WhatsApp.</h3>
        <p className="max-w-md text-base leading-relaxed text-muted-foreground">
          Abrimos uma nova aba com o seu briefing. É só enviar a mensagem por lá. Se a aba não abriu, use o botão abaixo.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button href={sentLink} target="_blank" rel="noopener noreferrer" arrow>Abrir o WhatsApp</Button>
          <Button variant="ghost" onClick={() => { setSentLink(""); setStep(0); }}>Recomeçar</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-8" aria-describedby="briefing-help">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-muted-foreground">
            Etapa <span className="text-foreground">{step + 1}</span> de {total}
          </p>
          <p id="briefing-help" className="font-mono text-xs text-muted-foreground">Leva menos de 1 minuto</p>
        </div>
        <div className="grid grid-cols-4 gap-2" aria-hidden="true">
          {briefing.stepTitles.map((_, i) => (
            <span key={i} className="h-1 overflow-hidden rounded-full bg-border">
              <span className={`block h-full origin-left bg-aurora transition-transform duration-700 ease-[var(--ease-expo)] ${i <= step ? "scale-x-100" : "scale-x-0"}`} />
            </span>
          ))}
        </div>
      </div>

      <div ref={panel} className="min-h-72">
        <h3 ref={heading} tabIndex={-1} className="mb-6 text-2xl font-semibold leading-snug tracking-tight md:text-3xl">
          {briefing.stepTitles[step]}
        </h3>

        {step === 0 && (
          <fieldset className="flex flex-wrap gap-3">
            <legend className="sr-only">Tipo de projeto</legend>
            {briefing.types.map((t) => <Chip key={t} type="radio" name="tipo" value={t} checked={type === t} onChange={() => setType(t)} />)}
          </fieldset>
        )}
        {step === 1 && (
          <fieldset className="flex flex-wrap gap-3">
            <legend className="sr-only">Objetivos (escolha um ou mais)</legend>
            {briefing.goals.map((g) => (
              <Chip
                key={g}
                type="checkbox"
                name="objetivo"
                value={g}
                checked={goal.includes(g)}
                onChange={() => setGoal((v) => (v.includes(g) ? v.filter((x) => x !== g) : [...v, g]))}
              />
            ))}
          </fieldset>
        )}
        {step === 2 && (
          <fieldset className="flex flex-wrap gap-3">
            <legend className="sr-only">Prazo desejado</legend>
            {briefing.timelines.map((t) => <Chip key={t} type="radio" name="prazo" value={t} checked={when === t} onChange={() => setWhen(t)} />)}
          </fieldset>
        )}
        {step === 3 && (
          <div className="grid gap-6 md:grid-cols-2">
            <Field id="nome" label="Seu nome" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Field id="empresa" label="Empresa" optional autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} />
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="detalhes" className="text-sm font-medium">
                Conte um pouco sobre o projeto <span className="text-muted-foreground">(opcional)</span>
              </label>
              <textarea
                id="detalhes"
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Ex.: preciso de uma landing page para o lançamento de um curso…"
                className="resize-none rounded-md border border-input bg-background/60 px-4 py-3 text-base leading-relaxed transition-colors placeholder:text-subtle-foreground hover:border-border-strong focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              />
            </div>
          </div>
        )}

        <p role="alert" className="mt-4 min-h-6 text-sm text-destructive">{error}</p>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:invisible"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true"><path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Voltar
        </button>
        <Button type="submit" size="lg" arrow>
          {step < total - 1 ? "Continuar" : "Enviar pelo WhatsApp"}
        </Button>
      </div>
    </form>
  );
}
