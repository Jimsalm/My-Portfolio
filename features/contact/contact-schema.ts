import { z } from "zod";

export const contactFormSchema = z.object({
  email: z.string().trim().email("Enter a valid email.").max(160, "Email is too long."),
  message: z
    .string()
    .trim()
    .min(20, "Message should be at least 20 characters.")
    .max(2000, "Message should be 2000 characters or less."),
  name: z
    .string()
    .trim()
    .min(2, "Name should be at least 2 characters.")
    .max(80, "Name is too long."),
  website: z.string().max(0).optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
