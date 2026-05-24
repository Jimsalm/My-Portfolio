"use client";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <main className="flex min-h-screen flex-col justify-center bg-background px-6 text-foreground">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">error: root process failed</p>
      <h1 className="mt-4 max-w-2xl font-mono text-5xl font-semibold tracking-tight">Something went wrong.</h1>
      <button className="mt-8 h-11 w-fit border px-5 font-mono text-sm font-medium" onClick={reset} type="button">
        retry --app
      </button>
    </main>
  );
}
