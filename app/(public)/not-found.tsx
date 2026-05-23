import Link from "next/link";

export default function PublicNotFound() {
  return (
    <div className="terminal-theme mx-auto flex min-h-screen max-w-3xl flex-col justify-center bg-background px-5 text-foreground">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">404</p>
      <h1 className="mt-4 font-mono text-5xl font-semibold tracking-tight">This page is not published.</h1>
      <p className="mt-4 font-mono text-sm text-muted-foreground">
        The content may have moved, may still be a draft, or may not exist.
      </p>
      <Link className="mt-8 inline-flex h-11 w-fit items-center border px-5 font-mono text-sm font-medium" href="/">
        cd ~
      </Link>
    </div>
  );
}
