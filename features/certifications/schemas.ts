import { z } from "zod";

import {
  contentStatusSchema,
  uploadedFileSchema,
} from "@/features/cms/schemas";

const nullableUploadedFileSchema = uploadedFileSchema
  .nullish()
  .transform((value) => value ?? null);

const isoDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "Use a valid date.");

const optionalUrlSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || /^https?:\/\//i.test(value), {
    message: "Enter a valid HTTP or HTTPS URL.",
  })
  .default("");

export const certificationFormSchema = z
  .object({
    badgeImage: nullableUploadedFileSchema,
    credentialId: z.string().trim().max(120, "Credential ID must be 120 characters or less.").default(""),
    credentialUrl: optionalUrlSchema,
    doesNotExpire: z.boolean().default(false),
    expiryDate: z
      .string()
      .trim()
      .nullish()
      .transform((value) => value || null),
    featured: z.boolean().default(false),
    issueDate: isoDateSchema,
    name: z
      .string()
      .trim()
      .min(2, "Certificate name must be at least 2 characters.")
      .max(100, "Certificate name must be 100 characters or less."),
    order: z.coerce.number().int().min(0, "Order must be zero or greater.").default(0),
    organization: z
      .string()
      .trim()
      .min(2, "Organization must be at least 2 characters.")
      .max(100, "Organization must be 100 characters or less."),
    organizationLogo: nullableUploadedFileSchema,
    status: contentStatusSchema.default("draft"),
  })
  .superRefine((value, context) => {
    const today = new Date().toISOString().slice(0, 10);

    if (value.issueDate > today) {
      context.addIssue({
        code: "custom",
        message: "Issue date cannot be in the future.",
        path: ["issueDate"],
      });
    }

    if (!value.doesNotExpire && value.expiryDate) {
      const expiryResult = isoDateSchema.safeParse(value.expiryDate);

      if (!expiryResult.success) {
        context.addIssue({
          code: "custom",
          message: "Use a valid date.",
          path: ["expiryDate"],
        });
      } else if (value.expiryDate <= value.issueDate) {
        context.addIssue({
          code: "custom",
          message: "Expiry date must be after the issue date.",
          path: ["expiryDate"],
        });
      }
    }
  });

export type CertificationFormValues = z.infer<typeof certificationFormSchema>;

export type Certification = CertificationFormValues & {
  createdAt: number;
  id: string;
  updatedAt: number;
};

export function emptyCertification(): CertificationFormValues {
  return {
    badgeImage: null,
    credentialId: "",
    credentialUrl: "",
    doesNotExpire: false,
    expiryDate: null,
    featured: false,
    issueDate: "",
    name: "",
    order: 0,
    organization: "",
    organizationLogo: null,
    status: "draft",
  };
}
