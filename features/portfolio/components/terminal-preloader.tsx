"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const storageKey = "portfolio-terminal-preloader-seen";

const bootLines = [
  "boot portfolio.kernel",
  "mount ./work",
  "index ./writing.log",
  "load ./whoami",
  "ready",
];

export function TerminalPreloader({ onComplete }: { onComplete?: () => void }) {
  const shouldReduceMotion = useReducedMotion();
  const hasCompletedRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);

  const activeLines = useMemo(() => bootLines.slice(0, lineIndex + 1), [lineIndex]);
  const complete = useCallback(() => {
    if (hasCompletedRef.current) {
      return;
    }

    hasCompletedRef.current = true;
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    const hasSeenPreloader = window.sessionStorage.getItem(storageKey) === "true";

    if (hasSeenPreloader) {
      queueMicrotask(complete);
      return;
    }

    window.sessionStorage.setItem(storageKey, "true");
    queueMicrotask(() => setIsVisible(true));
  }, [complete]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    if (shouldReduceMotion) {
      const timeout = window.setTimeout(() => {
        setProgress(100);
        setLineIndex(bootLines.length - 1);
        setIsVisible(false);
      }, 320);

      return () => {
        window.clearTimeout(timeout);
      };
    }

    const progressInterval = window.setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 100) {
          window.clearInterval(progressInterval);
          return 100;
        }

        return Math.min(currentProgress + 2, 100);
      });
    }, 62);

    const lineInterval = window.setInterval(() => {
      setLineIndex((currentIndex) => Math.min(currentIndex + 1, bootLines.length - 1));
    }, 430);

    const closeTimeout = window.setTimeout(() => {
      setIsVisible(false);
    }, 3600);

    return () => {
      window.clearInterval(progressInterval);
      window.clearInterval(lineInterval);
      window.clearTimeout(closeTimeout);
    };
  }, [isVisible, shouldReduceMotion]);

  return (
    <AnimatePresence onExitComplete={complete}>
      {isVisible ? (
        <m.div
          aria-label="Loading portfolio"
          aria-live="polite"
          className="fixed inset-0 z-[120] grid place-items-center bg-background font-mono text-foreground"
          exit={{ opacity: 0 }}
          initial={{ opacity: 1 }}
          role="status"
          transition={{ duration: 0.32, ease: "easeOut" }}
        >
          <m.div
            animate={{ opacity: 1, y: 0 }}
            className="w-[min(92vw,560px)] border bg-background/95"
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between border-b px-4 py-2 text-xs text-muted-foreground">
              <span>portfolio.boot</span>
              <span>zsh · init</span>
            </div>
            <div className="space-y-6 p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">$ system --startup</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
                  initializing<span className="animate-pulse text-muted-foreground">_</span>
                </h2>
              </div>

              <div className="space-y-2 text-sm leading-6">
                {activeLines.map((line, index) => (
                  <m.p
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-muted-foreground"
                    initial={{ opacity: 0, x: -6 }}
                    key={line}
                    transition={{ delay: index * 0.03, duration: 0.18, ease: "easeOut" }}
                  >
                    <span className="text-foreground">{">"}</span>
                    <span>{line}</span>
                    {index === activeLines.length - 1 ? <span className="h-4 w-2 animate-pulse bg-foreground" /> : null}
                  </m.p>
                ))}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <span>loading</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 border p-px">
                  <m.div
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-foreground"
                    transition={{ duration: 0.16, ease: "linear" }}
                  />
                </div>
              </div>
            </div>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
