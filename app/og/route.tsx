import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

import {
  getPublicBlogPost,
  getPublicProject,
} from "@/features/portfolio/server/public-data";
import { formatDisplayDate } from "@/features/portfolio/lib/utils";

export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

function OgShell({
  eyebrow,
  image,
  meta,
  title,
}: {
  eyebrow: string;
  image?: string | null;
  meta?: string;
  title: string;
}) {
  return (
    <div
      style={{
        alignItems: "stretch",
        background: "#000",
        color: "#fff",
        display: "flex",
        fontFamily: "Consolas, Menlo, monospace",
        height: "100%",
        padding: 56,
        width: "100%",
      }}
    >
      <div
        style={{
          border: "1px solid #333",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 40,
          width: image ? "64%" : "100%",
        }}
      >
        <div style={{ color: "#aaa", fontSize: 26, letterSpacing: 6, textTransform: "uppercase" }}>{eyebrow}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 78, fontWeight: 700, lineHeight: 1 }}>{title}</div>
          {meta ? <div style={{ color: "#ccc", fontSize: 28 }}>{meta}</div> : null}
        </div>
        <div style={{ color: "#888", fontSize: 24 }}>portfolio:~$ open graph --render</div>
      </div>
      {image ? (
        <div style={{ border: "1px solid #333", borderLeft: "0", display: "flex", flex: 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src={image} style={{ filter: "grayscale(1)", height: "100%", objectFit: "cover", width: "100%" }} />
        </div>
      ) : null}
    </div>
  );
}

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");
  const slug = request.nextUrl.searchParams.get("slug");
  const title = request.nextUrl.searchParams.get("title") || "Portfolio";

  if (type === "project" && slug) {
    const { project } = await getPublicProject(slug);

    if (project) {
      return new ImageResponse(
        (
          <OgShell
            eyebrow="Selected Work"
            image={project.thumbnail?.url}
            meta={project.techStack.slice(0, 4).join(" / ")}
            title={project.title}
          />
        ),
        size,
      );
    }
  }

  if (type === "blog" && slug) {
    const { post } = await getPublicBlogPost(slug);

    if (post) {
      return new ImageResponse(
        (
          <OgShell
            eyebrow="Latest Writing"
            image={post.coverImage?.url}
            meta={`${formatDisplayDate(post.publishedAt)} / ${post.readTime} min read`}
            title={post.title}
          />
        ),
        size,
      );
    }
  }

  return new ImageResponse(<OgShell eyebrow="Portfolio" meta="Projects / Writing / About" title={title} />, size);
}
