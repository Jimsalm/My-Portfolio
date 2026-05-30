import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import {
  dataResponse,
  errorResponse,
  publicCacheHeaders,
  rateLimitRequest,
  routeError,
} from "@/features/cms/server/api-helpers";

type PublicProjectRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: PublicProjectRouteProps) {
  const limited = rateLimitRequest(_request);

  if (limited) {
    return limited;
  }

  try {
    const { slug } = await params;
    const data = await fetchQuery(api.api.publicContent.projectBySlug, { slug });
    if (!data.project) {
      return errorResponse("Project not found.", 404);
    }

    return dataResponse(data, { headers: publicCacheHeaders(60) });
  } catch (error) {
    return routeError(error);
  }
}
