import { z } from "zod";

export const badgeModeSchema = z.enum(["wip", "available", "hidden"]);

export const accountSettingsSchema = z.object({
  currentPassword: z.string().optional().default(""),
  displayName: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters.")
    .max(50, "Display name must be 50 characters or less."),
  email: z.string().trim().email("Enter a valid email address."),
});

export const passwordSettingsSchema = z
  .object({
    confirmPassword: z.string(),
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .regex(/[A-Z]/, "New password must include at least 1 uppercase letter.")
      .regex(/[0-9]/, "New password must include at least 1 number."),
  })
  .superRefine((value, context) => {
    if (value.newPassword !== value.confirmPassword) {
      context.addIssue({
        code: "custom",
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }
  });

export const siteSettingsSchema = z.object({
  metaDescription: z
    .string()
    .trim()
    .max(160, "Meta description must be 160 characters or less."),
  siteTitle: z
    .string()
    .trim()
    .min(2, "Site title must be at least 2 characters.")
    .max(60, "Site title must be 60 characters or less."),
  tagline: z
    .string()
    .trim()
    .max(100, "Tagline must be 100 characters or less."),
});

export const badgeSettingsSchema = z.object({
  badgeMode: badgeModeSchema,
});

export type BadgeMode = z.infer<typeof badgeModeSchema>;
export type AccountSettingsFormValues = z.infer<typeof accountSettingsSchema>;
export type PasswordSettingsFormValues = z.infer<typeof passwordSettingsSchema>;
export type SiteSettingsFormValues = z.infer<typeof siteSettingsSchema>;
export type BadgeSettingsFormValues = z.infer<typeof badgeSettingsSchema>;

export type AccountSettings = {
  displayName: string;
  email: string;
  id: string;
  updatedAt: number;
};

export type PublicSiteSettings = SiteSettingsFormValues &
  BadgeSettingsFormValues & {
    updatedAt: number;
  };

export type AdminSettings = {
  account: AccountSettings;
  site: PublicSiteSettings;
};

export function emptyAccountSettings(): AccountSettingsFormValues {
  return {
    currentPassword: "",
    displayName: "",
    email: "",
  };
}

export function emptyPasswordSettings(): PasswordSettingsFormValues {
  return {
    confirmPassword: "",
    currentPassword: "",
    newPassword: "",
  };
}

export function emptySiteSettings(): SiteSettingsFormValues {
  return {
    metaDescription: "",
    siteTitle: "",
    tagline: "",
  };
}
