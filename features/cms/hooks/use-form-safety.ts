"use client";

import { useEffect } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export function useUnsavedChangesWarning(isDirty: boolean) {
  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!isDirty) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
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
