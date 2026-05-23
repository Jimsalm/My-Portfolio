"use client";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="terminal-theme mx-auto flex min-h-screen max-w-3xl flex-col justify-center bg-background px-5 text-foreground">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
        error: command failed
      </p>
      <h1 className="mt-4 font-mono text-5xl font-semibold tracking-tight">The page could not load.</h1>
      <p className="mt-4 font-mono text-sm text-muted-foreground">{error.message}</p>
      <button className="mt-8 h-11 w-fit border px-5 font-mono text-sm font-medium" onClick={reset} type="button">
        retry --page
      </button>
    </div>
  );
}
