"use client";

/* Chip acessível: input real (radio/checkbox) + rótulo estilizado */
export function Chip({ type, name, value, checked, onChange }: { type: "radio" | "checkbox"; name: string; value: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="relative">
      <input type={type} name={name} value={value} checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="flex min-h-12 items-center gap-3 rounded-full border border-border-strong bg-background/50 px-6 py-3 text-base transition-[background-color,border-color,color] duration-300 hover:border-foreground/50 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background">
        <span
          aria-hidden="true"
          className={`flex h-4 w-4 items-center justify-center border border-border-strong transition-colors ${type === "radio" ? "rounded-full" : "rounded-sm"} ${checked ? "border-primary bg-primary" : ""}`}
        >
          {checked && <span className={`h-1.5 w-1.5 bg-primary-foreground ${type === "radio" ? "rounded-full" : "rounded-[1px]"}`} />}
        </span>
        {value}
      </span>
    </label>
  );
}
