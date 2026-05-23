"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      type="button"
      variant="outline"
    >
      <LogOut aria-hidden="true" />
      Log out
    </Button>
  );
}
