"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ImagePreviewDialog } from "@/components/image-preview-dialog";
import { apiRequest } from "@/lib/axios";
import { useUploadThing } from "@/lib/uploadthing";
import { type UploadedFile } from "@/features/cms/schemas";
import { createBlurDataURL, fallbackBlurDataURL } from "@/features/portfolio/lib/image-placeholders";

type UploadEndpoint =
  | "blogCover"
  | "certificationBadge"
  | "certificationLogo"
  | "profilePhoto"
  | "projectThumbnail"
  | "resumePdf";

type UploadFieldProps = {
  accept: string;
  endpoint: UploadEndpoint;
  label: string;
  maxSizeMb?: number;
  onChange: (file: UploadedFile | null) => void;
  value: UploadedFile | null | undefined;
};

export function UploadField({
  accept,
  endpoint,
  label,
  maxSizeMb,
  onChange,
  value,
}: UploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [localPreviewBlur, setLocalPreviewBlur] = useState<string | undefined>();
  const [progress, setProgress] = useState(0);
  const { isUploading, startUpload } = useUploadThing(endpoint, {
    onUploadError: (error) => {
      toast.error(error.message);
    },
    onUploadProgress: setProgress,
    uploadProgressGranularity: "fine",
  });
  const isImage = accept.includes("image");
  const acceptedTypes = accept.split(",").map((type) => type.trim());
  const preview = localPreview ?? value?.url ?? null;
  const previewBlur = localPreviewBlur ?? value?.blurDataURL;

  async function handleFile(file: File) {
    if (isImage && !file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (!isImage && file.type !== "application/pdf") {
      toast.error("Please choose a PDF file.");
      return;
    }

    if (!acceptedTypes.includes("image/*") && !acceptedTypes.includes(file.type)) {
      toast.error("This file type is not supported.");
      return;
    }

    if (maxSizeMb && file.size > maxSizeMb * 1024 * 1024) {
      toast.error(`File must be ${maxSizeMb} MB or smaller.`);
      return;
    }

    const blurDataURL = isImage ? await createBlurDataURL(file) : undefined;

    const previewUrl = isImage ? URL.createObjectURL(file) : null;

    if (isImage && previewUrl) {
      setLocalPreviewBlur(blurDataURL);
      setLocalPreview(previewUrl);
    }

    const previousKey = value?.key;
    const uploaded = await startUpload([file]);
    const uploadedFile = uploaded?.[0];

    if (!uploadedFile) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      return;
    }

    const uploadedUrl = uploadedFile.ufsUrl;

    onChange({
      blurDataURL,
      key: uploadedFile.key,
      name: uploadedFile.name,
      url: uploadedUrl,
    });
    setLocalPreview(uploadedUrl);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (previousKey && previousKey !== uploadedFile.key) {
      await apiRequest({
        data: { key: previousKey },
        method: "POST",
        url: "/api/admin/uploads/delete",
      });
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="grid gap-3 border p-3">
        {value || preview ? (
          <div className="flex items-center gap-3">
            {isImage && preview ? (
              <ImagePreviewDialog
                alt={`${label} preview`}
                blurDataURL={previewBlur ?? value?.blurDataURL}
                src={preview}
              >
                <button
                  aria-label={`Preview ${label}`}
                  className="relative size-16 cursor-zoom-in border bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  type="button"
                >
                  <Image
                    alt={`${label} preview`}
                    blurDataURL={previewBlur ?? value?.blurDataURL ?? fallbackBlurDataURL}
                    className="object-cover"
                    fill
                    placeholder="blur"
                    sizes="64px"
                    src={preview}
                    unoptimized
                  />
                </button>
              </ImagePreviewDialog>
            ) : (
              <div className="flex size-16 items-center justify-center border bg-muted">
                <FileText aria-hidden="true" className="size-6" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{value?.name ?? "Selected file"}</p>
              <p className="truncate text-xs text-muted-foreground">{value?.url ?? "Preview"}</p>
            </div>
            <Button
              aria-label="Remove file"
              className="rounded-none"
              onClick={() => {
                if (value?.key) {
                  void apiRequest({
                    data: { key: value.key },
                    method: "POST",
                    url: "/api/admin/uploads/delete",
                  });
                }
                onChange(null);
                setLocalPreview(null);
                setLocalPreviewBlur(undefined);
              }}
              size="icon"
              type="button"
              variant="outline"
            >
              <X aria-hidden="true" className="size-4" />
            </Button>
          </div>
        ) : null}

        <input
          accept={accept}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void handleFile(file);
            }
          }}
          ref={inputRef}
          type="file"
        />
        <Button
          className="rounded-none"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          type="button"
          variant="outline"
        >
          <Upload aria-hidden="true" className="size-4" />
          {isUploading ? `Uploading ${progress}%` : "Choose file"}
        </Button>
      </div>
    </div>
  );
}
