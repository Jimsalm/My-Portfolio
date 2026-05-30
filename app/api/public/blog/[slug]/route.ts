import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import {
  dataResponse,
  errorResponse,
  publicCacheHeaders,
  rateLimitRequest,
  routeError,
} from "@/features/cms/server/api-helpers";

type PublicBlogPostRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: PublicBlogPostRouteProps) {
  const limited = rateLimitRequest(_request);

  if (limited) {
    return limited;
  }

  try {
    const { slug } = await params;
    const data = await fetchQuery(api.api.publicContent.blogPostBySlug, { slug });
    if (!data.post) {
      return errorResponse("Blog post not found.", 404);
    }

    return dataResponse(data, { headers: publicCacheHeaders(30) });
  } catch (error) {
    return routeError(error);
  }
}
