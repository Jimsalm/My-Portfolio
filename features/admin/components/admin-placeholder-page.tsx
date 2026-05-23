type AdminPlaceholderPageProps = {
  description: string;
  title: string;
};

export function AdminPlaceholderPage({
  description,
  title,
}: AdminPlaceholderPageProps) {
  return (
    <section className="border bg-background p-6">
      <p className="text-sm text-muted-foreground">Portfolio admin</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-normal">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </section>
  );
}
