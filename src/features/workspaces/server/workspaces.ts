import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { DB_ID, STORAGE_ID, WORKSPACES_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";

import { createWorkspaceSchema } from "../schema";

export const workspaces = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createWorkspaceSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      const { name, image } = c.req.valid("form");

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(STORAGE_ID, ID.unique(), image);
        const imageBuffer = await storage.getFilePreview(STORAGE_ID, file.$id);

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          imageBuffer
        ).toString("base64")}`;
      }

      // TODO : prevent same name for single user
      const workspace = await databases.createDocument(
        DB_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
        }
      );

      return c.json({ data: workspace });
    }
  )
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const workspaces = await databases.listDocuments(DB_ID, WORKSPACES_ID, [
      Query.equal("userId", user.$id),
    ]);
  });
