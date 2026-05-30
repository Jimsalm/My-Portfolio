import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  dataResponse,
  getAdminApiToken,
  rateLimitRequest,
  requireAdminSession,
  routeError,
} from "@/features/cms/server/api-helpers";

export async function GET(request: Request) {
  const limited = rateLimitRequest(request, { limit: 80 });

  if (limited) {
    return limited;
  }

  const session = await requireAdminSession();
  const adminId = session?.user?.id;

  if (!session || !adminId) {
    return dataResponse(null, { status: 401 });
  }

  try {
    const data = await fetchQuery(api.api.settings.getAdminSettings, {
      adminApiToken: getAdminApiToken(),
      adminId: adminId as Id<"adminUsers">,
    });

    return dataResponse(data);
  } catch (error) {
    return routeError(error);
  }
}
