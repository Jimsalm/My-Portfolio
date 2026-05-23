import "server-only";

import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";

export type DashboardRecentItem = {
  id: string;
  title: string;
  slug: string;
  updatedAt: number;
};

export type DashboardOverviewData = {
  totalProjects: number;
  totalBlogPosts: number;
  profileLastUpdated: number | null;
  recentProjects: DashboardRecentItem[];
  recentBlogPosts: DashboardRecentItem[];
};

export async function getDashboardOverview() {
  return await fetchQuery(api.dashboard.getOverview);
}
