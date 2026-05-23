"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminLogoutButtonProps = {
  className?: string;
};

export function AdminLogoutButton({ className }: AdminLogoutButtonProps) {
  return (
    <Button
      className={cn("rounded-none", className)}
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      type="button"
      variant="outline"
    >
      <LogOut aria-hidden="true" />
      Log out
    </Button>
  );
}
