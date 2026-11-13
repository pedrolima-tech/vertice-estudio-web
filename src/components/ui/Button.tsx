"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import { Magnetic } from "./Magnetic";
import { scrollToTarget } from "@/lib/motion";

type Variant = "primary" | "ghost" | "light";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-medium tracking-tight transition-[background-color,border-color,color,box-shadow] duration-500 ease-[var(--ease-expo)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_0_0_0_var(--color-primary)] hover:shadow-[0_8px_48px_-8px_var(--color-primary)]",
  ghost: "border border-border-strong bg-background/40 text-foreground backdrop-blur-md hover:border-foreground/60",
  light: "bg-foreground text-background hover:bg-primary hover:text-primary-foreground",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-6 text-sm",
  lg: "h-12 px-8 text-base md:h-14 md:px-8",
};

/** Texto que “rola” para cima no hover — duas cópias empilhadas. */
function RollText({ children }: { children: ReactNode }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-[var(--ease-expo)] group-hover/btn:-translate-y-full motion-reduce:transition-none">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-expo)] group-hover/btn:translate-y-0 motion-reduce:transition-none"
      >
        {children}
      </span>
    </span>
  );
}

function Arrow() {
  return (
    <span aria-hidden="true" className="relative flex h-4 w-4 overflow-hidden">
      {[0, 1].map((i) => (
        <svg
          key={i}
          viewBox="0 0 16 16"
          fill="none"
          className={`absolute inset-0 h-4 w-4 transition-transform duration-500 ease-[var(--ease-expo)] ${
            i === 0 ? "group-hover/btn:translate-x-full group-hover/btn:-translate-y-full" : "-translate-x-full translate-y-full group-hover/btn:translate-x-0 group-hover/btn:translate-y-0"
          }`}
        >
          <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}

type Common = { variant?: Variant; size?: Size; arrow?: boolean; magnetic?: boolean; className?: string; children: ReactNode };

type LinkProps = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type BtnProps = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export function Button(props: LinkProps | BtnProps) {
  const { variant = "primary", size = "md", arrow = false, magnetic = true, className = "", children, ...rest } = props;
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const content = (
    <>
      <RollText>{children}</RollText>
      {arrow && <Arrow />}
    </>
  );

  let el: ReactNode;
  if ("href" in rest && rest.href) {
    const { href, onClick, ...a } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    const internal = href.startsWith("#");
    const handle = (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (internal && !e.defaultPrevented) {
        e.preventDefault();
        scrollToTarget(href);
        history.replaceState(null, "", href);
      }
    };
    el = (
      <a href={href} onClick={handle} className={cls} {...a}>
        {content}
      </a>
    );
  } else {
    el = (
      <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
        {content}
      </button>
    );
  }

  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}
