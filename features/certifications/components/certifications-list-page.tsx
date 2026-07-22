"use client";

import {
  ArrowDown,
  ArrowUp,
  Edit,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ImagePreviewDialog } from "@/components/image-preview-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  formatCertificationDate,
  getCertStatus,
} from "@/features/certifications/lib/certification-utils";
import type { Certification } from "@/features/certifications/schemas";
import {
  useCertifications,
  useDeleteCertification,
  useReorderCertifications,
  useToggleCertificationFeatured,
  useToggleCertificationStatus,
} from "@/features/certifications/hooks/use-certifications";
import { AdminTableRowsSkeleton } from "@/features/portfolio/components/skeletons";
import { fallbackBlurDataURL } from "@/features/portfolio/lib/image-placeholders";

export function CertificationsListPage() {
  const { data: certifications = [], isLoading } = useCertifications();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Certification | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const deleteCertification = useDeleteCertification();
  const reorderCertifications = useReorderCertifications();
  const toggleFeatured = useToggleCertificationFeatured();
  const toggleStatus = useToggleCertificationStatus();
  const filteredCertifications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return certifications;
    }

    return certifications.filter((certification) =>
      `${certification.name} ${certification.organization}`
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [certifications, search]);

  function moveCertification(sourceId: string, targetId: string) {
    const sourceIndex = certifications.findIndex((item) => item.id === sourceId);
    const targetIndex = certifications.findIndex((item) => item.id === targetId);

    if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
      return;
    }

    const reordered = [...certifications];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    reorderCertifications.mutate(reordered.map((item) => item.id));
  }

  function moveByOffset(id: string, offset: number) {
    const index = certifications.findIndex((item) => item.id === id);
    const target = certifications[index + offset];

    if (target) {
      moveCertification(id, target.id);
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-3 border bg-background/80 p-4 md:flex-row md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            $ ls ./credentials
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">
            Certifications
          </h2>
        </div>
        <Button asChild className="rounded-none">
          <Link href="/admin/certifications/new">
            <Plus aria-hidden="true" className="size-4" />
            Add Certification
          </Link>
        </Button>
      </div>

      <div className="border bg-background/80 p-4">
        <Input
          className="rounded-none"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or organization"
          value={search}
        />
      </div>

      <div className="overflow-x-auto border bg-background/80">
        <table className="w-full min-w-[1040px] text-sm">
          <thead className="bg-muted text-left text-muted-foreground">
            <tr>
              <th className="w-12 p-3">
                <span className="sr-only">Reorder</span>
              </th>
              <th className="p-3">Badge</th>
              <th className="p-3">Name</th>
              <th className="p-3">Organization</th>
              <th className="p-3">Issued</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Status</th>
              <th className="p-3">Featured</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <AdminTableRowsSkeleton columns={9} />
            ) : filteredCertifications.length ? (
              filteredCertifications.map((certification) => (
                <CertificationRow
                  certification={certification}
                  draggedId={draggedId}
                  key={certification.id}
                  moveByOffset={moveByOffset}
                  moveCertification={moveCertification}
                  onDelete={setDeleteTarget}
                  onDragEnd={() => setDraggedId(null)}
                  onDragStart={setDraggedId}
                  toggleFeatured={toggleFeatured.mutate}
                  toggleStatus={toggleStatus.mutate}
                />
              ))
            ) : (
              <tr>
                <td className="p-8 text-center text-muted-foreground" colSpan={9}>
                  No certifications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        open={Boolean(deleteTarget)}
      >
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete certification?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none"
              onClick={() => {
                if (deleteTarget) {
                  deleteCertification.mutate(deleteTarget.id);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function CertificationRow({
  certification,
  draggedId,
  moveByOffset,
  moveCertification,
  onDelete,
  onDragEnd,
  onDragStart,
  toggleFeatured,
  toggleStatus,
}: {
  certification: Certification;
  draggedId: string | null;
  moveByOffset: (id: string, offset: number) => void;
  moveCertification: (sourceId: string, targetId: string) => void;
  onDelete: (certification: Certification) => void;
  onDragEnd: () => void;
  onDragStart: (id: string) => void;
  toggleFeatured: (input: { featured: boolean; id: string }) => void;
  toggleStatus: (input: { id: string; status: "draft" | "published" }) => void;
}) {
  const expiryStatus = getCertStatus(
    certification.expiryDate,
    certification.doesNotExpire,
  );

  return (
    <tr
      className="hover:bg-muted/50"
      draggable
      onDragEnd={onDragEnd}
      onDragOver={(event) => event.preventDefault()}
      onDragStart={() => onDragStart(certification.id)}
      onDrop={() => {
        if (draggedId) {
          moveCertification(draggedId, certification.id);
        }
      }}
    >
      <td className="p-3">
        <GripVertical aria-hidden="true" className="size-4 text-muted-foreground" />
      </td>
      <td className="p-3">
        <div className="relative size-12 border bg-muted">
          {certification.badgeImage?.url ? (
            <ImagePreviewDialog
              alt={`${certification.name} badge`}
              blurDataURL={certification.badgeImage.blurDataURL}
              src={certification.badgeImage.url}
            >
              <button
                aria-label={`Preview ${certification.name} badge`}
                className="relative size-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                type="button"
              >
                <Image
                  alt={`${certification.name} badge`}
                  blurDataURL={
                    certification.badgeImage.blurDataURL ?? fallbackBlurDataURL
                  }
                  className="object-contain p-1"
                  fill
                  placeholder="blur"
                  sizes="48px"
                  src={certification.badgeImage.url}
                  unoptimized
                />
              </button>
            </ImagePreviewDialog>
          ) : null}
        </div>
      </td>
      <td className="p-3 font-medium">{certification.name}</td>
      <td className="p-3 text-muted-foreground">{certification.organization}</td>
      <td className="p-3">{formatCertificationDate(certification.issueDate)}</td>
      <td className="p-3">
        <ExpiryBadge
          expiryDate={certification.expiryDate}
          status={expiryStatus}
        />
      </td>
      <td className="p-3">
        <Button
          className="rounded-none"
          onClick={() =>
            toggleStatus({
              id: certification.id,
              status:
                certification.status === "published" ? "draft" : "published",
            })
          }
          size="sm"
          type="button"
          variant="outline"
        >
          {certification.status}
        </Button>
      </td>
      <td className="p-3">
        <Switch
          aria-label={`Feature ${certification.name}`}
          checked={certification.featured}
          onCheckedChange={(featured) =>
            toggleFeatured({ featured, id: certification.id })
          }
        />
      </td>
      <td className="p-3">
        <div className="flex justify-end gap-2">
          <Button
            aria-label={`Move ${certification.name} up`}
            className="rounded-none"
            onClick={() => moveByOffset(certification.id, -1)}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <ArrowUp aria-hidden="true" className="size-4" />
          </Button>
          <Button
            aria-label={`Move ${certification.name} down`}
            className="rounded-none"
            onClick={() => moveByOffset(certification.id, 1)}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <ArrowDown aria-hidden="true" className="size-4" />
          </Button>
          <Button asChild className="rounded-none" size="icon-sm" variant="outline">
            <Link
              aria-label={`Edit ${certification.name}`}
              href={`/admin/certifications/${certification.id}/edit`}
            >
              <Edit aria-hidden="true" className="size-4" />
            </Link>
          </Button>
          <Button
            aria-label={`Delete ${certification.name}`}
            className="rounded-none"
            onClick={() => onDelete(certification)}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <Trash2 aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

function ExpiryBadge({
  expiryDate,
  status,
}: {
  expiryDate: string | null;
  status: "expired" | "no-expiry" | "valid";
}) {
  if (status === "no-expiry") {
    return <Badge className="rounded-none" variant="secondary">No Expiry</Badge>;
  }

  if (status === "expired") {
    return <Badge className="rounded-none" variant="secondary">Expired</Badge>;
  }

  return (
    <Badge className="rounded-none" variant="outline">
      Valid {expiryDate ? formatCertificationDate(expiryDate) : ""}
    </Badge>
  );
}
