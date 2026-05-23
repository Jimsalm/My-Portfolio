import { query } from "./_generated/server";

type RecentItem = {
  id: string;
  title: string;
  slug: string;
  updatedAt: number;
};

type DashboardOverview = {
  totalProjects: number;
  totalBlogPosts: number;
  profileLastUpdated: number | null;
  recentProjects: RecentItem[];
  recentBlogPosts: RecentItem[];
};

export const getOverview = query({
  args: {},
  handler: async (ctx): Promise<DashboardOverview> => {
    const [
      projects,
      blogPosts,
      profileRecord,
      recentProjectDocs,
      recentBlogPostDocs,
    ] = await Promise.all([
      ctx.db.query("projects").collect(),
      ctx.db.query("blogPosts").collect(),
      ctx.db.query("profile").withIndex("by_updatedAt").order("desc").first(),
      ctx.db
        .query("projects")
        .withIndex("by_updatedAt")
        .order("desc")
        .take(3),
      ctx.db
        .query("blogPosts")
        .withIndex("by_updatedAt")
        .order("desc")
        .take(3),
    ]);

    const recentProjects = recentProjectDocs.map((project) => ({
      id: project._id,
      title: project.title,
      slug: project.slug,
      updatedAt: project.updatedAt,
    }));

    const recentBlogPosts = recentBlogPostDocs.map((post) => ({
      id: post._id,
      title: post.title,
      slug: post.slug,
      updatedAt: post.updatedAt,
      }));

    return {
      totalProjects: projects.length,
      totalBlogPosts: blogPosts.length,
      profileLastUpdated: profileRecord?.updatedAt ?? null,
      recentProjects,
      recentBlogPosts,
    };
  },
});
