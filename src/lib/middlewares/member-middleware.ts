import { createMiddleware } from "hono/factory";
import { AdditionalContext } from "./session-middleware";
import { DB_ID, MEMBERS_ID } from "@/config";
import { Query } from "node-appwrite";
import { MemberRole } from "@/features/types";

type routes = "/:workspaceId";

export const memberMiddleware = createMiddleware<AdditionalContext, routes>(
  async (c, next) => {
    const { workspaceId } = c.req.param();

    const user = c.get("user");
    const databases = c.get("databases");

    const members = await databases.listDocuments(DB_ID, MEMBERS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.equal("userId", user.$id),
    ]);

    const member = members.documents[0];

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" });
    }

    next();
  }
);
