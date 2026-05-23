import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import { dataResponse, routeError } from "@/features/cms/server/api-helpers";

type PublicProjectRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: PublicProjectRouteProps) {
  try {
    const { slug } = await params;
    const data = await fetchQuery(api.publicContent.projectBySlug, { slug });
    return dataResponse(data);
  } catch (error) {
    return routeError(error);
  }
}
