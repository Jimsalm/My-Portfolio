import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import {
  dataResponse,
  publicCacheHeaders,
  rateLimitRequest,
  routeError,
} from "@/features/cms/server/api-helpers";

export async function GET(request: Request) {
  const limited = rateLimitRequest(request);

  if (limited) {
    return limited;
  }

  try {
    const data = await fetchQuery(api.api.publicContent.about);
    return dataResponse(data, { headers: publicCacheHeaders(60) });
  } catch (error) {
    return routeError(error);
  }
}
