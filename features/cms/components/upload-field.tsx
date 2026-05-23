"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/axios";
import { useUploadThing } from "@/lib/uploadthing";
import { type UploadedFile } from "@/features/cms/schemas";

type UploadEndpoint =
  | "blogCover"
  | "profilePhoto"
  | "projectThumbnail"
  | "resumePdf";

type UploadFieldProps = {
  accept: string;
  endpoint: UploadEndpoint;
  label: string;
  onChange: (file: UploadedFile | null) => void;
  value: UploadedFile | null | undefined;
};

export function UploadField({
  accept,
  endpoint,
  label,
  onChange,
  value,
}: UploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value?.url ?? null);
  const [progress, setProgress] = useState(0);
  const { isUploading, startUpload } = useUploadThing(endpoint, {
    onUploadError: (error) => {
      toast.error(error.message);
    },
    onUploadProgress: setProgress,
    uploadProgressGranularity: "fine",
  });
  const isImage = accept.includes("image");

  async function handleFile(file: File) {
    if (isImage && !file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (!isImage && file.type !== "application/pdf") {
      toast.error("Please choose a PDF file.");
      return;
    }

    if (isImage) {
      setPreview(URL.createObjectURL(file));
    }

    const previousKey = value?.key;
    const uploaded = await startUpload([file]);
    const uploadedFile = uploaded?.[0];

    if (!uploadedFile) {
      return;
    }

    const uploadedUrl = uploadedFile.ufsUrl;

    onChange({
      key: uploadedFile.key,
      name: uploadedFile.name,
      url: uploadedUrl,
    });
    setPreview(uploadedUrl);

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
              <div className="relative size-16 border bg-muted">
                <Image alt="" className="object-cover" fill src={preview} unoptimized />
              </div>
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
                setPreview(null);
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
