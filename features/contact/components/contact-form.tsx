"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SendHorizontal, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { contactFormSchema, type ContactFormValues } from "@/features/contact/contact-schema";
import { useSendContactMessage } from "@/features/contact/hooks/use-send-contact-message";
import { cn } from "@/lib/utils";

function ContactField({
  children,
  error,
  id,
  label,
}: Readonly<{
  children: React.ReactNode;
  error?: string;
  id: string;
  label: string;
}>) {
  return (
    <div className="space-y-2">
      <label className="block font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground" htmlFor={id}>
        <span className="text-foreground">const</span> {label}
      </label>
      {children}
      {error ? (
        <p className="font-mono text-xs text-foreground" id={`${id}-error`}>
          error: {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const sendContactMessage = useSendContactMessage();
  const form = useForm<ContactFormValues>({
    defaultValues: {
      email: "",
      message: "",
      name: "",
      website: "",
    },
    resolver: zodResolver(contactFormSchema),
  });

  const isSubmitting = form.formState.isSubmitting || sendContactMessage.isPending;
  const messageValue = useWatch({ control: form.control, name: "message" }) ?? "";

  async function onSubmit(values: ContactFormValues) {
    setSent(false);

    try {
      await sendContactMessage.mutateAsync(values);
      form.reset();
      setSent(true);
    } catch {
      // Toast handling lives in useSendContactMessage.
    }
  }

  return (
    <form className="border bg-background" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex items-center justify-between border-b px-4 py-2 font-mono text-xs text-muted-foreground">
        <span>message.compose</span>
      </div>
      <div className="grid gap-5 p-5">
        <div aria-hidden="true" className="absolute left-[-9999px] top-auto">
          <label htmlFor="website">Website</label>
          <input id="website" tabIndex={-1} {...form.register("website")} />
        </div>

        <ContactField error={form.formState.errors.name?.message} id="contact-name" label="name">
          <input
            aria-describedby={form.formState.errors.name ? "contact-name-error" : undefined}
            aria-invalid={Boolean(form.formState.errors.name)}
            autoComplete="name"
            className="h-11 w-full border bg-muted/30 px-3 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
            id="contact-name"
            placeholder='"Jim Salmon"'
            {...form.register("name")}
          />
        </ContactField>

        <ContactField error={form.formState.errors.email?.message} id="contact-email" label="email">
          <input
            aria-describedby={form.formState.errors.email ? "contact-email-error" : undefined}
            aria-invalid={Boolean(form.formState.errors.email)}
            autoComplete="email"
            className="h-11 w-full border bg-muted/30 px-3 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
            id="contact-email"
            placeholder='"you@example.com"'
            type="email"
            {...form.register("email")}
          />
        </ContactField>

        <ContactField error={form.formState.errors.message?.message} id="contact-message" label="message">
          <textarea
            aria-describedby={form.formState.errors.message ? "contact-message-error" : "contact-message-count"}
            aria-invalid={Boolean(form.formState.errors.message)}
            className="min-h-36 w-full resize-y border bg-muted/30 px-3 py-3 font-mono text-sm leading-7 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
            id="contact-message"
            placeholder='"Tell me what you are building..."'
            {...form.register("message")}
          />
          <div className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <span id="contact-message-count">{messageValue.length}/2000</span>
          </div>
        </ContactField>

        <button
          className={cn(
            "inline-flex min-h-11 items-center justify-center gap-2 border border-foreground bg-foreground px-5 font-mono text-sm font-semibold text-background transition-colors",
            "hover:bg-background hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
            isSubmitting ? "cursor-wait opacity-80" : "",
          )}
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <SendHorizontal aria-hidden="true" className="size-4" />
          )}
          {isSubmitting ? "sending..." : "send message"}
        </button>

        <p
          aria-live="polite"
          className={cn(
            "flex min-h-5 items-center gap-2 font-mono text-xs text-muted-foreground",
            sent ? "text-foreground" : "",
          )}
        >
          {sent ? (
            <>
              <ShieldCheck aria-hidden="true" className="size-4" />
              transmission complete. I&apos;ll reply from the inbox.
            </>
          ) : (
            "Messages go through a protected, rate-limited endpoint."
          )}
        </p>
      </div>
    </form>
  );
}
