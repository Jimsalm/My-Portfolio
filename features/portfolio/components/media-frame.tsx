import Image from "next/image";

import type { UploadedFile } from "@/features/cms/schemas";
import { cn } from "@/lib/utils";

type MediaFrameProps = {
  alt: string;
  className?: string;
  image: UploadedFile | null | undefined;
  priority?: boolean;
};

export function MediaFrame({ alt, className, image, priority }: MediaFrameProps) {
  return (
    <div className={cn("relative overflow-hidden border bg-muted", className)}>
      {image?.url ? (
        <Image
          alt={alt}
          className="object-cover grayscale"
          fill
          priority={priority}
          sizes="(min-width: 1024px) 50vw, 100vw"
          src={image.url}
        />
      ) : (
        <div className="flex size-full min-h-48 items-center justify-center bg-[repeating-linear-gradient(135deg,#000_0,#000_10px,#111_10px,#111_11px)] font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          image --missing
        </div>
      )}
    </div>
  );
}
