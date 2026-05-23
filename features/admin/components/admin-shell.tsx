"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import {
  BookOpenText,
  BriefcaseBusiness,
  FileUser,
  LayoutDashboard,
  Menu,
  Settings,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminLogoutButton } from "@/features/admin/components/admin-logout-button";
import {
  adminRoutes,
  getAdminBreadcrumbs,
  getAdminRouteLabel,
} from "@/features/admin/lib/admin-routes";
import {
  getAdminDisplayName,
  getInitials,
} from "@/features/admin/lib/admin-profile";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: React.ReactNode;
  currentDateLabel: string;
  session: Session;
};

const navIcons = {
  Dashboard: LayoutDashboard,
  Projects: BriefcaseBusiness,
  "Blog Posts": BookOpenText,
  "About/Resume": FileUser,
  Settings,
} as const;

export function AdminShell({
  children,
  currentDateLabel,
  session,
}: AdminShellProps) {
  const pathname = usePathname();
  const pageTitle = getAdminRouteLabel(pathname);
  const breadcrumbs = getAdminBreadcrumbs(pathname);
  const adminName = getAdminDisplayName(session.user?.email);
  const initials = getInitials(adminName);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background md:flex md:flex-col">
        <SidebarContent pathname={pathname} />
      </aside>

      <div className="flex min-h-screen flex-col md:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  aria-label="Open sidebar"
                  className="size-9 rounded-none md:hidden"
                  size="icon"
                  type="button"
                  variant="outline"
                >
                  <Menu aria-hidden="true" className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                className="w-72 rounded-none p-0 sm:max-w-none"
                side="left"
              >
                <SheetHeader className="border-b px-4 py-4 text-left">
                  <SheetTitle>Portfolio Admin</SheetTitle>
                  <SheetDescription>Manage portfolio content</SheetDescription>
                </SheetHeader>
                <SidebarContent pathname={pathname} closeOnNavigate />
              </SheetContent>
            </Sheet>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-normal md:text-xl">
                {pageTitle}
              </h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                {currentDateLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-none">{adminName}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {session.user?.email}
              </p>
            </div>
            <Avatar className="rounded-none border" size="lg">
              <AvatarFallback className="rounded-none bg-muted font-medium text-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 md:px-6 md:py-6">
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
          >
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <div
                  className="flex items-center gap-2"
                  key={`${crumb.href}-${crumb.label}-${index}`}
                >
                  {index > 0 ? <span aria-hidden="true">/</span> : null}
                  {isLast ? (
                    <span className="text-foreground">{crumb.label}</span>
                  ) : (
                    <Link className="transition-colors hover:text-foreground" href={crumb.href}>
                      {crumb.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
          {children}
        </main>
      </div>
    </div>
  );
}

type SidebarContentProps = {
  closeOnNavigate?: boolean;
  pathname: string;
};

function SidebarContent({ closeOnNavigate = false, pathname }: SidebarContentProps) {
  const content = (
    <>
      <div className="border-b p-5">
        <Link className="block" href="/admin">
          <p className="text-base font-semibold tracking-normal">Portfolio</p>
          <p className="mt-1 text-xs text-muted-foreground">Admin Panel</p>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Admin navigation">
        {adminRoutes.map((item) => {
          const Icon = navIcons[item.label];
          const isActive =
            item.href === "/admin"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          const link = (
            <Link
              className={cn(
                "flex h-10 items-center gap-3 border px-3 text-sm transition-colors",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground",
              )}
              href={item.href}
            >
              <Icon aria-hidden="true" className="size-4" />
              <span>{item.label}</span>
            </Link>
          );

          return closeOnNavigate ? (
            <SheetClose asChild key={item.href}>
              {link}
            </SheetClose>
          ) : (
            <div key={item.href}>{link}</div>
          );
        })}
      </nav>

      <div className="p-3">
        <Separator />
        <div className="pt-3">
          <AdminLogoutButton className="w-full justify-start rounded-none" />
        </div>
      </div>
    </>
  );

  return <div className="flex h-full flex-col">{content}</div>;
}
