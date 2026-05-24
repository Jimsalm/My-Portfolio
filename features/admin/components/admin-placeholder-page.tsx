type AdminPlaceholderPageProps = {
  description: string;
  title: string;
};

export function AdminPlaceholderPage({
  description,
  title,
}: AdminPlaceholderPageProps) {
  return (
    <section className="border bg-background/80 p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        $ portfolio-admin --module
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
        {title.toLowerCase().replace(/\s+/g, "-")}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </section>
  );
}
