"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fallbackBlurDataURL } from "@/features/portfolio/lib/image-placeholders";

export function ImagePreviewDialog({
  alt,
  blurDataURL,
  children,
  src,
}: {
  alt: string;
  blurDataURL?: string;
  children: ReactNode;
  src: string;
}) {
  const [dimensions, setDimensions] = useState({
    height: 900,
    width: 1600,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-fit max-w-[calc(100vw-2rem)] overflow-hidden rounded-none bg-background/95 p-0 sm:max-w-[calc(100vw-2rem)]">
        <DialogHeader className="sr-only">
          <DialogTitle>{alt}</DialogTitle>
          <DialogDescription>Expanded image preview.</DialogDescription>
        </DialogHeader>
        <Image
          alt={alt}
          blurDataURL={blurDataURL ?? fallbackBlurDataURL}
          className="h-auto max-h-[calc(100vh-2rem)] w-auto max-w-[calc(100vw-2rem)] object-contain"
          height={dimensions.height}
          onLoad={(event) => {
            const image = event.currentTarget;

            if (
              image.naturalHeight !== dimensions.height ||
              image.naturalWidth !== dimensions.width
            ) {
              setDimensions({
                height: image.naturalHeight,
                width: image.naturalWidth,
              });
            }
          }}
          placeholder="blur"
          sizes="(max-width: 768px) calc(100vw - 2rem), calc(100vw - 4rem)"
          src={src}
          unoptimized
          width={dimensions.width}
        />
      </DialogContent>
    </Dialog>
  );
}
