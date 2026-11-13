import type { InputHTMLAttributes } from "react";

/* Campo de texto com rótulo visível e marcação de opcional */
export function Field({ id, label, optional, ...props }: { id: string; label: string; optional?: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label} {optional && <span className="text-muted-foreground">(opcional)</span>}
      </label>
      <input
        id={id}
        className="h-12 rounded-md border border-input bg-background/60 px-4 text-base transition-colors placeholder:text-subtle-foreground hover:border-border-strong focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        {...props}
      />
    </div>
  );
}
