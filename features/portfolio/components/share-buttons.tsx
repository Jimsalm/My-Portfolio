"use client";

import { Copy, Twitter } from "lucide-react";
import { toast } from "sonner";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="inline-flex h-10 items-center gap-2 border px-3 font-mono text-sm transition-colors hover:border-foreground hover:bg-muted"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          toast.success("Link copied.");
        }}
        type="button"
      >
        <Copy aria-hidden="true" className="size-4" />
        copy --url
      </button>
      <a
        className="inline-flex h-10 items-center gap-2 border px-3 font-mono text-sm transition-colors hover:border-foreground hover:bg-muted"
        href={twitterUrl}
        rel="noreferrer"
        target="_blank"
      >
        <Twitter aria-hidden="true" className="size-4" />
        share --x
      </a>
    </div>
  );
}
