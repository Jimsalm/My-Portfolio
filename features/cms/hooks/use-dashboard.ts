"use client";

import { apiRequest, useApiQuery } from "@/lib/api-client";
import { queryKeys } from "@/features/cms/query-keys";
import { type DashboardOverviewData } from "@/features/cms/schemas";

export function useDashboardOverview() {
  return useApiQuery({
    queryFn: () =>
      apiRequest<DashboardOverviewData>({
        method: "GET",
        url: "/api/admin/dashboard",
      }),
    queryKey: queryKeys.dashboard,
  });
}
