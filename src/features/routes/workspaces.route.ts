import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { MemberRole, Workspace } from "@/features/types";
import { DB_ID, MEMBERS_ID, STORAGE_ID, WORKSPACES_ID } from "@/config";
import { generateInviteCode } from "@/lib/utils";
import { memberMiddleware, sessionMiddleware } from "@/lib/middlewares";

import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  joinWorkspaceSchema,
} from "@/features/schemas";

export const workspaces = new Hono()
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      const { name, image } = c.req.valid("form");

      let uploadedImageUrl = image;

      console.log({ uploadedImageUrl });

      if (image instanceof File) {
        const file = await storage.createFile(STORAGE_ID, ID.unique(), image);
        const imageBuffer = await storage.getFilePreview(STORAGE_ID, file.$id);

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          imageBuffer
        ).toString("base64")}`;
      } else if (image === "undefined") {
        uploadedImageUrl = undefined;
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
          inviteCode: generateInviteCode(6),
        }
      );

      await databases.createDocument(DB_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      });
      return c.json({ data: workspace });
    }
  )
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const members = await databases.listDocuments(DB_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(DB_ID, WORKSPACES_ID, [
      Query.orderDesc("$createdAt"),
      Query.contains("$id", workspaceIds),
    ]);

    return c.json({ data: workspaces });
  })
  .patch(
    "/:workspaceId",
    zValidator("form", updateWorkspaceSchema),
    sessionMiddleware,
    memberMiddleware,
    async (c) => {
      const storage = c.get("storage");
      const databases = c.get("databases");

      const { workspaceId } = c.req.param();
      const { image, name } = c.req.valid("form");

      let uploadedImageUrl = image;

      if (image instanceof File) {
        const file = await storage.createFile(STORAGE_ID, ID.unique(), image);
        const imageBuffer = await storage.getFilePreview(STORAGE_ID, file.$id);

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          imageBuffer
        ).toString("base64")}`;
      }

      // TODO : prevent same name for single user
      const workspace = await databases.updateDocument(
        DB_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          imageUrl: uploadedImageUrl,
        }
      );

      return c.json({ data: workspace });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, memberMiddleware, async (c) => {
    const { workspaceId } = c.req.param();
    const databases = c.get("databases");

    // TODO: Delete projects, tasks & members.

    await databases.deleteDocument(DB_ID, WORKSPACES_ID, workspaceId);
    return c.json({ data: { $id: workspaceId } });
  })
  .post(
    "/:workspaceId/reset-invite-code",
    sessionMiddleware,
    memberMiddleware,
    async (c) => {
      const { workspaceId } = c.req.param();
      const databases = c.get("databases");

      const workspace = await databases.updateDocument(
        DB_ID,
        WORKSPACES_ID,
        workspaceId,
        { inviteCode: generateInviteCode(6) }
      );

      return c.json({ data: workspace });
    }
  )
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", joinWorkspaceSchema),
    async (c) => {
      const { workspaceId } = c.req.param();
      const { inviteCode } = c.req.valid("json");

      const databases = c.get("databases");
      const user = c.get("user");

      const members = await databases.listDocuments(DB_ID, MEMBERS_ID, [
        Query.equal("workspaceId", workspaceId),
        Query.equal("userId", user.$id),
      ]);

      const member = members.documents[0];

      if (member) {
        return c.json({ error: "Already a member" }, 400); // Bad request
      }

      const workspace = await databases.getDocument<Workspace>(
        DB_ID,
        WORKSPACES_ID,
        workspaceId
      );

      if (workspace.inviteCode !== inviteCode) {
        return c.json({ error: "Invalid invite code." }, 401);
      }
      await databases.createDocument(DB_ID, MEMBERS_ID, ID.unique(), {
        workspaceId,
        userId: user.$id,
        role: MemberRole.MEMBER,
      });

      return c.json({ data: workspace }, 200);
    }
  );
