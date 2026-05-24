import Link from "next/link";

export function PublicNotFoundPanel() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center px-5 py-20">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        $ cat missing.resource
      </p>
      <h1 className="mt-4 font-mono text-4xl font-semibold md:text-6xl">404: not found</h1>
      <p className="mt-5 max-w-2xl font-mono text-sm leading-7 text-muted-foreground">
        The requested portfolio entry is unavailable, unpublished, or has moved.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          className="inline-flex h-11 items-center border bg-foreground px-5 font-mono text-sm font-medium text-background transition-colors hover:bg-background hover:text-foreground"
          href="/"
        >
          $ cd ~
        </Link>
        <Link
          className="inline-flex h-11 items-center border px-5 font-mono text-sm font-medium transition-colors hover:border-foreground"
          href="/projects"
        >
          $ ls ./work
        </Link>
      </div>
    </section>
  );
}
