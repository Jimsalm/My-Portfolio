"use client";

import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "@/lib/axios";
import { queryKeys } from "@/features/cms/query-keys";
import { type DashboardOverviewData } from "@/features/cms/schemas";

export function useDashboardOverview() {
  return useQuery({
    queryFn: () =>
      apiRequest<DashboardOverviewData>({
        method: "GET",
        url: "/api/admin/dashboard",
      }),
    queryKey: queryKeys.dashboard,
  });
}
