import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import { dataResponse, routeError } from "@/features/cms/server/api-helpers";

export async function GET() {
  try {
    const data = await fetchQuery(api.publicContent.blogPosts);
    return dataResponse(data);
  } catch (error) {
    return routeError(error);
  }
}
