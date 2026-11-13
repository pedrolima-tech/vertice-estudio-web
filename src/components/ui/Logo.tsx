import { site } from "@/config/site";

/** Marca provisória: um vértice facetado + nome. Troque pelo logo definitivo. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--color-primary)" />
            <stop offset="1" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>
        <path d="M16 3 29 26H3L16 3Z" fill="none" stroke="url(#logo-g)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M16 3v23M16 17 3 26M16 17l13 9" stroke="url(#logo-g)" strokeWidth="1.25" strokeLinejoin="round" opacity="0.7" />
        <circle cx="16" cy="17" r="2.25" fill="var(--color-foreground)" />
      </svg>
      <span className="text-lg font-semibold leading-none tracking-tight">{site.name}</span>
    </span>
  );
}
