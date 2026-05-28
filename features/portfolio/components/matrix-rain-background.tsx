"use client";

import { useEffect, useRef } from "react";

type MatrixRainBackgroundProps = {
  variant?: "public" | "admin";
};

export function MatrixRainBackground({ variant = "public" }: MatrixRainBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldAnimateCanvas = variant === "public";

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const canvasContext = canvasElement?.getContext("2d");

    if (!canvasElement || !canvasContext) {
      return;
    }

    const canvas = canvasElement;
    const context = canvasContext;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const glyphs = "01{}[]<>/\\|$#@*+-=~";
    const fontSize = 14;
    const rowHeight = 18;
    let drops: number[] = [];
    let animationFrame = 0;
    let isAnimating = false;
    let lastPaint = 0;

    function canAnimate() {
      return shouldAnimateCanvas && !reducedMotionQuery.matches && !mobileQuery.matches;
    }

    function resize() {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.font = `${fontSize}px var(--font-mono)`;
      context.textBaseline = "top";

      const columns = Math.ceil(width / fontSize);
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -30));
      paintFrame(true);
      syncAnimation();
    }

    function paintFrame(force = false) {
      const width = window.innerWidth;
      const height = window.innerHeight;

      context.fillStyle = force ? "rgb(0 0 0)" : "rgb(0 0 0 / 0.08)";
      context.fillRect(0, 0, width, height);
      context.font = `${fontSize}px var(--font-mono)`;

      drops.forEach((drop, index) => {
        const text = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = index * fontSize;
        const y = drop * rowHeight;
        const leadOpacity = 0.18 + Math.random() * 0.16;

        context.fillStyle = `rgb(255 255 255 / ${leadOpacity})`;
        context.fillText(text, x, y);
        context.fillStyle = "rgb(255 255 255 / 0.06)";
        context.fillText(text, x, y - rowHeight);

        if (y > height && Math.random() > 0.975) {
          drops[index] = 0;
          return;
        }

        drops[index] = drop + 1;
      });
    }

    function animate(time: number) {
      if (time - lastPaint > 48) {
        paintFrame();
        lastPaint = time;
      }

      if (canAnimate()) {
        animationFrame = window.requestAnimationFrame(animate);
      } else {
        isAnimating = false;
      }
    }

    function syncAnimation() {
      if (!canAnimate()) {
        if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }

        isAnimating = false;
        return;
      }

      if (!isAnimating) {
        isAnimating = true;
        animationFrame = window.requestAnimationFrame(animate);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    reducedMotionQuery.addEventListener("change", syncAnimation);
    mobileQuery.addEventListener("change", resize);
    syncAnimation();

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener("resize", resize);
      reducedMotionQuery.removeEventListener("change", syncAnimation);
      mobileQuery.removeEventListener("change", resize);
    };
  }, [shouldAnimateCanvas]);

  return (
    <>
      <canvas
        aria-hidden="true"
        className={variant === "admin" ? "pointer-events-none fixed inset-0 z-0 opacity-10" : "pointer-events-none fixed inset-0 z-0 hidden opacity-25 md:block"}
        id="portfolio-matrix-rain"
        ref={canvasRef}
      />
      <div
        aria-hidden="true"
        className={
          variant === "admin"
            ? "pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_46%,rgb(0_0_0/0.9)_100%),linear-gradient(to_bottom,rgb(255_255_255/0.025),transparent_18%,transparent_84%,rgb(255_255_255/0.025))]"
            : "pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgb(0_0_0/0.78)_100%),linear-gradient(to_bottom,rgb(255_255_255/0.045),transparent_14%,transparent_86%,rgb(255_255_255/0.04))]"
        }
      />
      <div
        aria-hidden="true"
        className={
          variant === "admin"
            ? "pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_bottom,transparent_0,transparent_23px,rgb(255_255_255/0.025)_24px),linear-gradient(to_right,transparent_0,transparent_23px,rgb(255_255_255/0.02)_24px)] bg-[length:24px_24px] opacity-20"
            : "pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_bottom,transparent_0,transparent_23px,rgb(255_255_255/0.045)_24px),linear-gradient(to_right,transparent_0,transparent_23px,rgb(255_255_255/0.04)_24px)] bg-[length:24px_24px] opacity-25"
        }
      />
    </>
  );
}
