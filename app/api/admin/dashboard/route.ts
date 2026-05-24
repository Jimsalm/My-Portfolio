import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import {
  dataResponse,
  emptyDashboard,
  getAdminApiToken,
  rateLimitRequest,
  requireAdminSession,
} from "@/features/cms/server/api-helpers";

export async function GET(request: Request) {
  const limited = rateLimitRequest(request, { limit: 80 });

  if (limited) {
    return limited;
  }

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
