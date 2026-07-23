"use client";

import { toast } from "sonner";

import type { ContactFormValues } from "@/features/contact/contact-schema";
import { apiRequest, useApiMutation } from "@/lib/api-client";

export function useSendContactMessage() {
  return useApiMutation({
    mutationFn: (input: ContactFormValues) =>
      apiRequest<{ ok: true }>({
        data: input,
        method: "POST",
        url: "/api/contact",
      }),
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Message could not be sent.";
      toast.error(message);
    },
    onSuccess: () => {
      toast.success("Message sent.");
    },
  });
}
