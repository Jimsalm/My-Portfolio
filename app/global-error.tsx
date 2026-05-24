"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <html lang="en">
      <body>
        <main style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: 32 }}>
          <p style={{ color: "#aaa", fontFamily: "monospace" }}>fatal: global render failed</p>
          <h1 style={{ fontFamily: "monospace", fontSize: 48 }}>Something went wrong.</h1>
          <button onClick={reset} type="button">
            Retry
          </button>
        </main>
      </body>
    </html>
  );
}
