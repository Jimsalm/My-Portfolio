"use client";

import { GitBranch, Wrench } from "lucide-react";
import { m } from "framer-motion";

export function WipBadge() {
  return (
    <m.aside
      aria-label="Site status: work in progress"
      className="fixed bottom-4 right-4 z-50 max-w-[calc(100vw-2rem)] overflow-hidden border bg-background/90 font-mono text-foreground shadow-[0_0_24px_rgb(255_255_255/0.06)] backdrop-blur"
      initial={{ opacity: 0, x: -12, y: 12 }}
      transition={{ delay: 0.55, duration: 0.35, ease: "easeOut" }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
    >
      <m.span
        animate={{ x: ["-150%", "250%"] }}
        aria-hidden="true"
        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        transition={{ duration: 3.2, ease: "linear", repeat: Infinity, repeatDelay: 0 }}
      />
      <div className="flex items-center gap-3 px-3 py-2">
        <span className="relative flex size-8 items-center justify-center border bg-foreground text-background" aria-hidden="true">
          <Wrench className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <m.span
              animate={{ opacity: [0.35, 1, 0.35] }}
              aria-hidden="true"
              className="size-1.5 bg-foreground"
              transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
            />
            status
          </p>
          <p className="truncate text-xs font-semibold sm:text-sm">work in progress</p>
        </div>
        <span className="hidden items-center gap-1 border-l pl-3 text-[11px] uppercase tracking-[0.12em] text-muted-foreground sm:inline-flex">
          <GitBranch className="size-3" aria-hidden="true" />
          iterating
        </span>
      </div>
    </m.aside>
  );
}
