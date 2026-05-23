"use client";

import Image from "next/image";
import { useState } from "react";

import type { UploadedFile } from "@/features/cms/schemas";
import { cn } from "@/lib/utils";

type MediaFrameProps = {
  alt: string;
  className?: string;
  image: UploadedFile | null | undefined;
  priority?: boolean;
};

function getMediaSources(image: UploadedFile | null | undefined) {
  const sources: string[] = [];

  if (image?.url) {
    sources.push(image.url);
  }

  if (image?.key) {
    const legacyUploadThingUrl = `https://utfs.io/f/${image.key}`;

    if (!sources.includes(legacyUploadThingUrl)) {
      sources.push(legacyUploadThingUrl);
    }
  }

  return sources;
}

export function MediaFrame({ alt, className, image, priority }: MediaFrameProps) {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const sources = getMediaSources(image);
  const src = sources.find((source) => !failedSources.includes(source));

  return (
    <div className={cn("relative overflow-hidden border bg-muted", className)}>
      {src ? (
        <Image
          alt={alt}
          className="object-cover"
          fill
          onError={() => setFailedSources((currentSources) => [...currentSources, src])}
          priority={priority}
          sizes="(min-width: 1024px) 50vw, 100vw"
          src={src}
          unoptimized
        />
      ) : (
        <div className="flex size-full min-h-48 items-center justify-center bg-[repeating-linear-gradient(135deg,#000_0,#000_10px,#111_10px,#111_11px)] font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          image --missing
        </div>
      )}
    </div>
  );
}
