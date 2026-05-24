"use client";

export default function AdminRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <div className="border p-6">
      <p className="text-sm text-muted-foreground">error: admin command failed</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-normal">The admin page could not load.</h2>
      <button className="mt-5 h-10 border px-4 text-sm" onClick={reset} type="button">
        Retry
      </button>
    </div>
  );
}
