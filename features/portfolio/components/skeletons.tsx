export function ProjectCardSkeleton() {
  return (
    <div className="animate-pulse border bg-background">
      <div className="h-9 border-b bg-muted" />
      <div className="aspect-[16/10] border-b bg-muted" />
      <div className="space-y-4 p-5">
        <div className="h-6 w-2/3 bg-muted" />
        <div className="h-4 w-full bg-muted" />
        <div className="h-4 w-4/5 bg-muted" />
        <div className="flex gap-2">
          <div className="h-7 w-20 border bg-muted" />
          <div className="h-7 w-24 border bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="animate-pulse border bg-background">
      <div className="h-9 border-b bg-muted" />
      <div className="aspect-[16/9] border-b bg-muted" />
      <div className="space-y-4 p-5">
        <div className="h-4 w-40 bg-muted" />
        <div className="h-6 w-3/4 bg-muted" />
        <div className="h-4 w-full bg-muted" />
      </div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="terminal-theme mx-auto min-h-screen max-w-6xl bg-background px-5 py-24 text-foreground">
      <div className="h-5 w-36 animate-pulse bg-muted" />
      <div className="mt-8 aspect-[16/8] animate-pulse border bg-muted" />
      <div className="mt-10 max-w-3xl space-y-4">
        <div className="h-12 w-2/3 animate-pulse bg-muted" />
        <div className="h-5 w-full animate-pulse bg-muted" />
        <div className="h-5 w-4/5 animate-pulse bg-muted" />
      </div>
    </div>
  );
}

export function AboutPageSkeleton() {
  return (
    <div className="terminal-theme mx-auto min-h-screen max-w-6xl bg-background px-5 py-24 text-foreground">
      <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
        <div className="aspect-square animate-pulse border bg-muted" />
        <div className="space-y-5 self-end">
          <div className="h-4 w-40 animate-pulse bg-muted" />
          <div className="h-16 w-3/4 animate-pulse bg-muted" />
          <div className="h-6 w-1/2 animate-pulse bg-muted" />
        </div>
      </div>
      <div className="mt-16 grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="h-28 animate-pulse border bg-muted" key={index} />
        ))}
      </div>
    </div>
  );
}

export function PublicGridSkeleton() {
  return (
    <div className="terminal-theme mx-auto min-h-screen max-w-6xl bg-background px-5 py-24 text-foreground">
      <div className="h-10 w-48 animate-pulse bg-muted" />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProjectCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function AdminStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="h-28 animate-pulse border bg-muted" key={index} />
      ))}
    </div>
  );
}

export function AdminTableRowsSkeleton({ columns = 7 }: { columns?: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index}>
          <td className="p-3" colSpan={columns}>
            <div className="h-12 animate-pulse bg-muted" />
          </td>
        </tr>
      ))}
    </>
  );
}
