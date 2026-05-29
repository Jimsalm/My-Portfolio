"use client";

import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const actionSelector = "a[href], button, [role='button'], summary, [data-magnetic-cursor]";
const textSelector = "input, textarea, select, [contenteditable='true']";
const magneticSnap = 0.82;
const magneticPadding = 8;

type CursorMode = "idle" | "magnetic" | "pressed" | "text";

function isDisabledElement(element: Element | null) {
  return Boolean(element?.matches("[disabled], [aria-disabled='true']"));
}

export function TerminalMagneticCursor() {
  const shouldReduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>("idle");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const width = useMotionValue(10);
  const height = useMotionValue(18);
  const springX = useSpring(x, { damping: 34, mass: 0.35, stiffness: 520 });
  const springY = useSpring(y, { damping: 34, mass: 0.35, stiffness: 520 });
  const springWidth = useSpring(width, { damping: 28, mass: 0.32, stiffness: 460 });
  const springHeight = useSpring(height, { damping: 28, mass: 0.32, stiffness: 460 });

  useEffect(() => {
    if (shouldReduceMotion) {
      queueMicrotask(() => setEnabled(false));
      return;
    }

    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    function syncEnabled() {
      setEnabled(finePointerQuery.matches);
    }

    queueMicrotask(syncEnabled);
    finePointerQuery.addEventListener("change", syncEnabled);

    return () => {
      finePointerQuery.removeEventListener("change", syncEnabled);
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove("terminal-magnetic-cursor-enabled");
      return;
    }

    document.body.classList.add("terminal-magnetic-cursor-enabled");

    let activeMode: CursorMode = "idle";

    function setCursorSize(nextWidth: number, nextHeight: number) {
      width.set(nextWidth);
      height.set(nextHeight);
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType && event.pointerType !== "mouse") {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      const textTarget = target?.closest(textSelector);
      const actionTarget = target?.closest(actionSelector);
      let nextX = event.clientX;
      let nextY = event.clientY;

      setVisible(true);

      if (textTarget && !isDisabledElement(textTarget)) {
        activeMode = "text";
        setCursorSize(2, 28);
      } else if (actionTarget && !isDisabledElement(actionTarget)) {
        const rect = actionTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        nextX += (centerX - event.clientX) * magneticSnap;
        nextY += (centerY - event.clientY) * magneticSnap;
        activeMode = activeMode === "pressed" ? "pressed" : "magnetic";
        setCursorSize(
          Math.max(28, rect.width + magneticPadding * 2),
          Math.max(28, rect.height + magneticPadding * 2),
        );
      } else {
        activeMode = "idle";
        setCursorSize(10, 18);
      }

      setMode(activeMode);
      x.set(nextX);
      y.set(nextY);
    }

    function handlePointerDown() {
      if (activeMode === "magnetic") {
        activeMode = "pressed";
        setMode("pressed");
      }
    }

    function handlePointerUp() {
      if (activeMode === "pressed") {
        activeMode = "magnetic";
        setMode("magnetic");
      }
    }

    function handlePointerLeave() {
      setVisible(false);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      document.body.classList.remove("terminal-magnetic-cursor-enabled");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, [enabled, height, width, x, y]);

  if (!enabled) {
    return null;
  }

  const isTargetLocked = mode === "magnetic" || mode === "pressed";

  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      style={{ x: springX, y: springY }}
    >
      <m.div
        animate={mode}
        className="absolute left-0 top-0 block -translate-x-1/2 -translate-y-1/2"
        initial={false}
        style={{ height: springHeight, width: springWidth }}
        variants={{
          idle: {
            opacity: visible ? 0.9 : 0,
            scale: 1,
          },
          magnetic: {
            opacity: visible ? 1 : 0,
            scale: 1,
          },
          pressed: {
            opacity: visible ? 1 : 0,
            scale: 0.94,
          },
          text: {
            opacity: visible ? 1 : 0,
            scale: 1,
          },
        }}
        transition={{ damping: 24, mass: 0.3, stiffness: 420, type: "spring" }}
      >
        {mode === "text" ? (
          <span className="absolute left-1/2 top-1/2 block h-7 w-px -translate-x-1/2 -translate-y-1/2 bg-white" />
        ) : mode === "idle" ? (
          <span className="absolute left-1/2 top-1/2 block h-4 w-2 -translate-x-1/2 -translate-y-1/2 animate-pulse bg-white" />
        ) : (
          <>
            <m.span
              animate={{ opacity: isTargetLocked ? 1 : 0 }}
              className="absolute inset-0 border border-dashed border-white/25"
              transition={{ duration: 0.12, ease: "easeOut" }}
            />
            <span className="absolute bottom-2 left-1/2 h-1 w-2 -translate-x-1/2 animate-pulse bg-white" />
            <span className="absolute left-0 top-0 block size-2.5 border-l-2 border-t-2 border-white" />
            <span className="absolute right-0 top-0 block size-2.5 border-r-2 border-t-2 border-white" />
            <span className="absolute bottom-0 left-0 block size-2.5 border-b-2 border-l-2 border-white" />
            <span className="absolute bottom-0 right-0 block size-2.5 border-b-2 border-r-2 border-white" />
          </>
        )}
      </m.div>
    </m.div>
  );
}
