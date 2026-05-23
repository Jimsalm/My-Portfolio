import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import {
  dataResponse,
  emptyDashboard,
  getAdminApiToken,
  requireAdminSession,
} from "@/features/cms/server/api-helpers";

export async function GET() {
  const session = await requireAdminSession();

  if (!session) {
    return dataResponse(emptyDashboard(), { status: 401 });
  }

  try {
    const data = await fetchQuery(api.dashboard.getOverview, {
      adminApiToken: getAdminApiToken(),
    });

    return dataResponse(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (
      message.includes("dashboard:getOverview") ||
      message.includes("ADMIN_API_TOKEN")
    ) {
      return dataResponse(emptyDashboard());
    }

    throw error;
  }
}
