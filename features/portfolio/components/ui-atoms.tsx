"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { m, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { motionTransition } from "@/features/portfolio/lib/motion";

function useTypewriter(text: string, active: boolean, delay = 0, speed = 28) {
  const shouldReduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion || !active || count >= text.length) {
      return;
    }

    const timeout = setTimeout(() => {
      setCount((currentCount) => Math.min(currentCount + 1, text.length));
    }, count === 0 ? delay : speed);

    return () => {
      clearTimeout(timeout);
    };
  }, [active, count, delay, shouldReduceMotion, speed, text.length]);

  return shouldReduceMotion ? text : text.slice(0, count);
}

function TerminalCursor({ active }: { active: boolean }) {
  return active ? (
    <span
      aria-hidden="true"
      className="ml-1 inline-block h-[1em] w-2 animate-pulse bg-foreground align-[-0.12em]"
    />
  ) : null;
}

export function SectionShell({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <section className={cn("relative mx-auto w-full max-w-6xl px-5 py-20", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  children,
  description,
  level = "h2",
}: {
  children: React.ReactNode;
  description?: string;
  level?: "h1" | "h2";
}) {
  const Heading = level;
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.5, once: true });
  const labelText = "$ portfolio --section";
  const titleText = typeof children === "string" ? children : "";
  const label = useTypewriter(labelText, inView, 40, 10);
  const title = useTypewriter(titleText, inView, 220, 22);
  const labelDone = label.length >= labelText.length;
  const titleDone = !titleText || title.length >= titleText.length;

  return (
    <m.div
      className="mb-10 flex flex-col gap-3"
      initial={{ opacity: 0, y: 12 }}
      ref={ref}
      transition={{ ...motionTransition, delay: 0.08 }}
      viewport={{ amount: 0.5, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
        <TerminalCursor active={inView && !labelDone} />
      </p>
      <Heading aria-label={titleText || undefined} className="font-mono text-3xl font-semibold tracking-tight md:text-5xl">
        {titleText ? title : children}
        <TerminalCursor active={inView && labelDone && !titleDone} />
      </Heading>
      {description ? (
        <m.p
          animate={titleDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          className="max-w-2xl font-mono text-sm leading-7 text-muted-foreground"
          transition={motionTransition}
        >
          {description}
        </m.p>
      ) : null}
    </m.div>
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
      <m.span className="inline-flex items-center" whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
        <span className="mr-2 text-muted-foreground">$</span>
        {children}
      </m.span>
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
      className="inline-flex size-11 items-center justify-center border bg-background transition-colors hover:border-foreground hover:bg-muted"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <m.span whileHover={{ rotate: -4, scale: 1.08 }} whileTap={{ scale: 0.94 }}>
        <Icon aria-hidden="true" className="size-4" />
      </m.span>
    </Link>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <m.span
      className="inline-flex border bg-background px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
      whileHover={{ y: -1 }}
    >
      {children}
    </m.span>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      className="border border-dashed bg-background p-10 font-mono text-sm text-muted-foreground"
      initial={{ opacity: 0, y: 12 }}
      transition={motionTransition}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.4, once: true }}
    >
      <span className="text-foreground">empty:</span> {children}
    </m.div>
  );
}

export function TerminalPanel({
  children,
  title,
}: Readonly<{ children: React.ReactNode; title: string }>) {
  return (
    <m.div
      className="border bg-background"
      initial={{ opacity: 0, y: 18 }}
      transition={motionTransition}
      viewport={{ amount: 0.3, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between border-b px-4 py-2 font-mono text-xs text-muted-foreground">
        <span>{title}</span>
        <span>zsh · 80x24</span>
      </div>
      <div className="p-5">{children}</div>
    </m.div>
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
    <m.div
      className="border bg-background font-mono"
      initial={{ opacity: 0, y: 18 }}
      transition={motionTransition}
      viewport={{ amount: 0.3, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
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
    </m.div>
  );
}
