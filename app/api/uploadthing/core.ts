import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { authOptions } from "@/features/auth/server/auth-options";

const upload = createUploadthing();

function uploadedFileMeta(file: { key: string; name: string; ufsUrl: string }) {
  return {
    key: file.key,
    name: file.name,
    url: file.ufsUrl,
  };
}

async function auth() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role) {
    throw new UploadThingError("Unauthorized");
  }

  return { userId: session.user.id ?? "admin" };
}

export const uploadRouter = {
  blogCover: upload({
    image: {
      maxFileCount: 1,
      maxFileSize: "4MB",
    },
  })
    .middleware(auth)
    .onUploadComplete(({ file }) => uploadedFileMeta(file)),
  profilePhoto: upload({
    image: {
      maxFileCount: 1,
      maxFileSize: "4MB",
    },
  })
    .middleware(auth)
    .onUploadComplete(({ file }) => uploadedFileMeta(file)),
  projectThumbnail: upload({
    image: {
      maxFileCount: 1,
      maxFileSize: "4MB",
    },
  })
    .middleware(auth)
    .onUploadComplete(({ file }) => uploadedFileMeta(file)),
  resumePdf: upload({
    pdf: {
      maxFileCount: 1,
      maxFileSize: "8MB",
    },
  })
    .middleware(auth)
    .onUploadComplete(({ file }) => uploadedFileMeta(file)),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
