"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { BookOpenText, BriefcaseBusiness, FileUser, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardOverview } from "@/features/cms/hooks/use-dashboard";
import { type DashboardOverviewData } from "@/features/cms/schemas";
import { formatDate } from "@/features/admin/lib/admin-profile";

export function AdminDashboard() {
  const { data, isError, isLoading } = useDashboardOverview();

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <section className="border border-dashed p-6 text-sm text-muted-foreground">
        Dashboard data could not be loaded.
      </section>
    );
  }

  return <AdminDashboardContent overview={data} />;
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="border p-5" key={index}>
            <Skeleton className="h-4 w-28 rounded-none" />
            <Skeleton className="mt-5 h-8 w-20 rounded-none" />
            <Skeleton className="mt-3 h-3 w-36 rounded-none" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div className="border p-5" key={index}>
            <Skeleton className="h-5 w-40 rounded-none" />
            <div className="mt-5 space-y-3">
              {Array.from({ length: 3 }).map((__, itemIndex) => (
                <Skeleton className="h-12 rounded-none" key={itemIndex} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminDashboardContent({
  overview,
}: {
  overview: DashboardOverviewData;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border bg-background p-5 md:flex-row md:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Overview</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-normal">
            Portfolio Control Center
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="rounded-none">
            <Link href="/admin/projects/new">
              <Plus aria-hidden="true" className="size-4" />
              Add Project
            </Link>
          </Button>
          <Button asChild className="rounded-none" variant="outline">
            <Link href="/admin/blog/new">
              <Plus aria-hidden="true" className="size-4" />
              Add Blog Post
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={BriefcaseBusiness}
          label="Total Projects"
          value={overview.totalProjects.toString()}
        />
        <StatCard
          icon={BookOpenText}
          label="Total Blog Posts"
          value={overview.totalBlogPosts.toString()}
        />
        <StatCard
          icon={FileUser}
          label="Profile Last Updated"
          value={formatDate(overview.profileLastUpdated)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentList
          emptyLabel="No projects yet."
          href="/admin/projects"
          items={overview.recentProjects}
          title="Recent Projects"
        />
        <RecentList
          emptyLabel="No blog posts yet."
          href="/admin/blog"
          items={overview.recentBlogPosts}
          title="Recent Blog Posts"
        />
      </div>
    </div>
  );
}

type StatCardProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
};

function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <article className="border bg-background p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-normal">{value}</p>
    </article>
  );
}

type RecentListProps = {
  emptyLabel: string;
  href: string;
  items: DashboardOverviewData["recentProjects"];
  title: string;
};

function RecentList({ emptyLabel, href, items, title }: RecentListProps) {
  return (
    <section className="border bg-background p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold tracking-normal">{title}</h3>
        <Link className="text-sm text-muted-foreground hover:text-foreground" href={href}>
          View all
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="mt-4 divide-y border-y">
          {items.map((item) => (
            <div className="flex items-center justify-between gap-4 py-3" key={item.id}>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  /{item.slug}
                </p>
              </div>
              <time className="shrink-0 text-xs text-muted-foreground">
                {formatDate(item.updatedAt)}
              </time>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 border border-dashed p-5 text-sm text-muted-foreground">
          {emptyLabel}
        </div>
      )}
    </section>
  );
}
