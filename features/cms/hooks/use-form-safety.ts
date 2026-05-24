"use client";

import { useEffect } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export function useUnsavedChangesWarning(isDirty: boolean) {
  useEffect(() => {
    window.onbeforeunload = (event: BeforeUnloadEvent) => {
      if (!isDirty) {
        return null;
      }

      event.preventDefault();
      event.returnValue = "";
      return "";
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, [isDirty]);
}

export function useAutoSaveDraft<T extends FieldValues>(
  form: Pick<UseFormReturn<T>, "formState" | "getValues">,
  key: string,
) {
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (form.formState.isDirty) {
        window.localStorage.setItem(key, JSON.stringify(form.getValues()));
      }
    }, 30_000);

    return () => window.clearInterval(timer);
  }, [form, key]);
}
