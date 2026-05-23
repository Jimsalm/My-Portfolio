import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function SectionShell({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <section className={cn("relative mx-auto w-full max-w-6xl px-5 py-20", className)}>{children}</section>;
}

export function SectionHeading({
  children,
  description,
}: {
  children: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-3">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        $ portfolio --section
      </p>
      <h2 className="font-mono text-3xl font-semibold tracking-tight md:text-5xl">{children}</h2>
      {description ? <p className="max-w-2xl font-mono text-sm leading-7 text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export function TextButton({
  children,
  href,
  target,
  variant = "primary",
}: {
  children: React.ReactNode;
  href: string;
  target?: "_blank";
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      className={cn(
        "inline-flex h-11 items-center justify-center border px-5 font-mono text-sm font-medium transition-colors",
        variant === "primary"
          ? "border-foreground bg-foreground text-background hover:bg-background hover:text-foreground"
          : "border-border bg-background text-foreground hover:border-foreground",
      )}
      href={href}
      rel={target === "_blank" ? "noreferrer" : undefined}
      target={target}
    >
      <span className="mr-2 text-muted-foreground">$</span>
      {children}
    </Link>
  );
}

export function IconButton({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  if (!href) {
    return null;
  }

  return (
    <Link
      aria-label={label}
      className="inline-flex size-10 items-center justify-center border bg-background transition-colors hover:border-foreground hover:bg-muted"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <Icon aria-hidden="true" className="size-4" />
    </Link>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex border bg-background px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </span>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-dashed bg-background p-10 font-mono text-sm text-muted-foreground">
      <span className="text-foreground">empty:</span> {children}
    </div>
  );
}

export function TerminalPanel({
  children,
  title,
}: Readonly<{ children: React.ReactNode; title: string }>) {
  return (
    <div className="border bg-background">
      <div className="flex items-center justify-between border-b px-4 py-2 font-mono text-xs text-muted-foreground">
        <span>{title}</span>
        <span>zsh · 80x24</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function EditorPanel({
  fileName,
  lines,
}: Readonly<{
  fileName: string;
  lines: React.ReactNode[];
}>) {
  return (
    <div className="border bg-background font-mono">
      <div className="flex items-center justify-between border-b px-3 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="size-2 border bg-muted" aria-hidden="true" />
          <span className="size-2 border bg-background" aria-hidden="true" />
          <span className="size-2 border bg-foreground" aria-hidden="true" />
        </div>
        <span>portfolio-code</span>
      </div>
      <div className="flex border-b text-xs">
        <div className="border-r bg-muted px-4 py-2 text-foreground">{fileName}</div>
        <div className="hidden px-4 py-2 text-muted-foreground sm:block">README.md</div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[340px] py-4 text-sm leading-7">
          {lines.map((line, index) => (
            <div className="grid grid-cols-[3rem_1fr]" key={`${fileName}-${index}`}>
              <span className="select-none border-r pr-3 text-right text-xs text-muted-foreground">
                {index + 1}
              </span>
              <code className="whitespace-pre px-4 text-foreground">{line}</code>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        <span>main</span>
        <span>utf-8 · typescript · ln 1, col 1</span>
      </div>
    </div>
  );
}
