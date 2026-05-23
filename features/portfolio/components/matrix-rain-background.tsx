"use client";

import { useEffect, useRef } from "react";

export function MatrixRainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const canvasContext = canvasElement?.getContext("2d");

    if (!canvasElement || !canvasContext) {
      return;
    }

    const canvas = canvasElement;
    const context = canvasContext;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const glyphs = "01{}[]<>/\\|$#@*+-=~";
    const fontSize = 14;
    const rowHeight = 18;
    let drops: number[] = [];
    let animationFrame = 0;
    let lastPaint = 0;

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
        const leadOpacity = 0.42 + Math.random() * 0.24;

        context.fillStyle = `rgb(255 255 255 / ${leadOpacity})`;
        context.fillText(text, x, y);
        context.fillStyle = "rgb(255 255 255 / 0.1)";
        context.fillText(text, x, y - rowHeight);

        if (y > height && Math.random() > 0.975) {
          drops[index] = 0;
          return;
        }

        drops[index] = drop + 1;
      });
    }

    function animate(time: number) {
      if (!mediaQuery.matches && time - lastPaint > 48) {
        paintFrame();
        lastPaint = time;
      }

      animationFrame = window.requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener("resize", resize);
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-35"
        id="portfolio-matrix-rain"
        ref={canvasRef}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgb(0_0_0/0.78)_100%),linear-gradient(to_bottom,rgb(255_255_255/0.045),transparent_14%,transparent_86%,rgb(255_255_255/0.04))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_bottom,transparent_0,transparent_23px,rgb(255_255_255/0.06)_24px),linear-gradient(to_right,transparent_0,transparent_23px,rgb(255_255_255/0.05)_24px)] bg-[length:24px_24px] opacity-30"
      />
    </>
  );
}
