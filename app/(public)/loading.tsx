export default function PublicLoading() {
  return (
    <div className="terminal-theme mx-auto min-h-screen max-w-6xl bg-background px-5 py-24 text-foreground">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        booting portfolio shell...
      </p>
      <div className="h-10 w-48 animate-pulse bg-muted" />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="h-64 animate-pulse border bg-muted" key={index} />
        ))}
      </div>
    </div>
  );
}
