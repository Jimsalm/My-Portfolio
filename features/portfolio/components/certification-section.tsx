"use client";

import { ExternalLink } from "lucide-react";
import { m, useReducedMotion } from "framer-motion";
import Image from "next/image";

import { ImagePreviewDialog } from "@/components/image-preview-dialog";
import {
  formatCertificationDate,
  getCertStatus,
} from "@/features/certifications/lib/certification-utils";
import type { Certification } from "@/features/certifications/schemas";
import { fallbackBlurDataURL } from "@/features/portfolio/lib/image-placeholders";
import { motionTransition } from "@/features/portfolio/lib/motion";
import {
  EmptyState,
  SectionHeading,
} from "@/features/portfolio/components/ui-atoms";

export function CertificationSection({
  certifications,
  description,
  emptyMessage = "Certifications will appear once they are published.",
}: {
  certifications: Certification[];
  description?: string;
  emptyMessage?: string;
}) {
  return (
    <section>
      <SectionHeading description={description}>./certifications</SectionHeading>
      {certifications.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((certification, index) => (
            <CertificationCard
              certification={certification}
              index={index}
              key={certification.id}
            />
          ))}
        </div>
      ) : (
        <EmptyState>{emptyMessage}</EmptyState>
      )}
    </section>
  );
}

function CertificationCard({
  certification,
  index,
}: {
  certification: Certification;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const status = getCertStatus(
    certification.expiryDate,
    certification.doesNotExpire,
  );
  const organizationInitial =
    certification.organization.trim().charAt(0).toUpperCase() || "?";

  return (
    <m.article
      className="flex min-h-full flex-col border bg-background/90 p-5 font-mono transition-colors hover:border-foreground"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
      transition={{
        ...motionTransition,
        delay: shouldReduceMotion ? 0 : index * 0.08,
      }}
      viewport={{ amount: 0.25, once: true }}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
    >
      <div className="flex h-24 items-center justify-center border bg-muted/30 p-3">
        {certification.badgeImage?.url ? (
          <ImagePreviewDialog
            alt={`${certification.name} badge`}
            blurDataURL={certification.badgeImage.blurDataURL}
            src={certification.badgeImage.url}
          >
            <button
              aria-label={`Preview ${certification.name} badge`}
              className="relative h-20 w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              type="button"
            >
              <Image
                alt={`${certification.name} badge`}
                blurDataURL={
                  certification.badgeImage.blurDataURL ?? fallbackBlurDataURL
                }
                className="object-contain"
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 320px, (min-width: 768px) 50vw, 100vw"
                src={certification.badgeImage.url}
                unoptimized
              />
            </button>
          </ImagePreviewDialog>
        ) : (
          <span className="text-5xl font-semibold text-muted-foreground">
            {organizationInitial}
          </span>
        )}
      </div>

      <div className="mt-5 flex items-center gap-3">
        {certification.organizationLogo?.url ? (
          <div className="relative size-6 shrink-0 border bg-muted">
            <Image
              alt={`${certification.organization} logo`}
              blurDataURL={
                certification.organizationLogo.blurDataURL ??
                fallbackBlurDataURL
              }
              className="object-contain"
              fill
              placeholder="blur"
              sizes="24px"
              src={certification.organizationLogo.url}
              unoptimized
            />
          </div>
        ) : null}
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {certification.organization}
        </p>
      </div>

      <h3 className="mt-4 line-clamp-2 text-lg font-semibold tracking-tight">
        {certification.name}
      </h3>
      <p className="mt-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">
        Issued {formatCertificationDate(certification.issueDate)}
      </p>
      <ExpiryLabel
        expiryDate={certification.expiryDate}
        status={status}
      />
      {certification.credentialId ? (
        <p className="mt-4 break-all text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          ID: {certification.credentialId}
        </p>
      ) : null}

      {certification.credentialUrl ? (
        <div className="mt-auto pt-5">
          <a
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 border px-4 text-center text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-foreground hover:text-background"
            href={certification.credentialUrl}
            rel="noreferrer"
            target="_blank"
          >
            Verify Certificate
            <ExternalLink aria-hidden="true" className="size-4" />
          </a>
        </div>
      ) : null}
    </m.article>
  );
}

function ExpiryLabel({
  expiryDate,
  status,
}: {
  expiryDate: string | null;
  status: "expired" | "no-expiry" | "valid";
}) {
  if (status === "no-expiry") {
    return (
      <span className="mt-3 w-fit border px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        No Expiry
      </span>
    );
  }

  if (status === "expired") {
    return (
      <span className="mt-3 w-fit border px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        Expired{" "}
        <span className="line-through">
          {expiryDate ? formatCertificationDate(expiryDate) : ""}
        </span>
      </span>
    );
  }

  return (
    <span className="mt-3 w-fit border px-2 py-1 text-[11px] uppercase tracking-[0.12em]">
      Valid until {expiryDate ? formatCertificationDate(expiryDate) : ""}
    </span>
  );
}
