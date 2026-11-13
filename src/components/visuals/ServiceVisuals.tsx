/* ==========================================================================
   SERVICE VISUALS — mini demonstrações animadas dentro dos cards.
   Puro CSS: reagem ao hover do card (group/card) e respeitam movimento reduzido.
   ========================================================================== */

const t = "transition-all duration-700 ease-[var(--ease-expo)] motion-reduce:transition-none";

/** Um navegador cujo layout se reorganiza: o site sendo desenhado. */
export function SiteVisual() {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border-strong bg-background/80">
      <div className="flex h-8 items-center gap-2 border-b border-border px-3">
        <span className="h-2 w-2 rounded-full bg-border-strong" />
        <span className="h-2 w-2 rounded-full bg-border-strong" />
        <span className="h-2 w-2 rounded-full bg-border-strong" />
        <span className="ml-3 h-4 flex-1 rounded-sm bg-muted" />
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <span className={`h-2 w-12 rounded-sm bg-foreground/80 ${t}`} />
          <span className="flex gap-2">
            {[0, 1, 2].map((i) => <span key={i} className="h-2 w-6 rounded-sm bg-muted" />)}
          </span>
        </div>
        <div className={`grid grid-cols-5 gap-3 ${t}`}>
          <div className="col-span-3 flex flex-col gap-2 py-2">
            <span className={`h-4 w-full rounded-sm bg-foreground/90 ${t} group-hover/card:w-4/5`} />
            <span className={`h-4 w-3/5 rounded-sm bg-aurora ${t} group-hover/card:w-full`} />
            <span className="mt-2 h-2 w-full rounded-sm bg-muted" />
            <span className="h-2 w-4/5 rounded-sm bg-muted" />
            <span className={`mt-2 h-6 w-16 rounded-full bg-primary ${t} group-hover/card:w-24`} />
          </div>
          <div className={`col-span-2 rounded-md border border-border bg-gradient-to-br from-accent/30 to-primary/10 ${t} group-hover/card:rotate-3 group-hover/card:scale-105`} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{ transitionDelay: `${i * 80}ms` }}
              className={`h-12 rounded-md border border-border bg-muted/60 ${t} group-hover/card:-translate-y-1 group-hover/card:border-primary/40`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Jornada da landing page: visitante → interesse → contato. */
export function LandingVisual() {
  const steps = ["Visitante", "Interesse", "Contato"];
  return (
    <div className="flex w-full flex-col gap-3">
      {steps.map((s, i) => (
        <div
          key={s}
          style={{ transitionDelay: `${i * 140}ms`, width: `${100 - i * 18}%` }}
          className={`flex h-12 items-center justify-between rounded-lg border border-border-strong bg-background/70 px-4 ${t} group-hover/card:border-primary/50`}
        >
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{s}</span>
          <span
            style={{ transitionDelay: `${i * 140}ms` }}
            className={`h-2 w-2 rounded-full bg-border-strong ${t} group-hover/card:bg-primary group-hover/card:shadow-[0_0_16px_var(--color-primary)]`}
          />
        </div>
      ))}
      <div className={`mt-2 inline-flex h-10 w-fit items-center gap-2 rounded-full bg-foreground px-4 text-xs font-medium uppercase tracking-wider text-background ${t} group-hover/card:bg-primary group-hover/card:text-primary-foreground`}>
        Quero um orçamento
        <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
      </div>
    </div>
  );
}

/** Fluxo de automação: dados passam entre sistemas. */
export function SystemVisual() {
  const nodes = ["Entrada", "Processamento", "Painel", "Notificação"];
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="relative flex items-center justify-between gap-2">
        <svg className="absolute inset-x-0 top-1/2 h-2 w-full -translate-y-1/2" preserveAspectRatio="none" viewBox="0 0 100 2" aria-hidden="true">
          <line x1="0" y1="1" x2="100" y2="1" stroke="var(--color-border-strong)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          <line x1="0" y1="1" x2="100" y2="1" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="4 10" vectorEffect="non-scaling-stroke" className="animate-[dash_1.6s_linear_infinite]" />
        </svg>
        {nodes.map((n, i) => (
          <span
            key={n}
            style={{ transitionDelay: `${i * 120}ms` }}
            className={`relative z-10 flex h-10 items-center rounded-md border border-border-strong bg-card px-3 font-mono text-xs text-muted-foreground ${t} group-hover/card:border-primary/60 group-hover/card:text-foreground`}
          >
            {n}
          </span>
        ))}
      </div>
      <pre className="overflow-hidden rounded-lg border border-border bg-background/80 p-4 font-mono text-xs leading-relaxed text-muted-foreground" aria-hidden="true">
        <span className="text-accent">async function</span> <span className="text-foreground">resolver</span>(problema) {"{"}{"\n"}
        {"  "}<span className="text-accent">const</span> plano = <span className="text-primary">entender</span>(problema);{"\n"}
        {"  "}<span className="text-accent">return</span> <span className="text-primary">automatizar</span>(plano);{"\n"}
        {"}"}<span className="ml-1 inline-block h-3 w-2 translate-y-0.5 animate-pulse bg-primary" />
      </pre>
    </div>
  );
}
