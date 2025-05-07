import { DB_ID, PROJECTS_ID } from "@/config";
import { memberMiddleware, sessionMiddleware } from "@/lib/middlewares";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Query } from "node-appwrite";
import { z } from "zod";
import { Project } from "../types";

export const projects = new Hono().get(
  "/",
  zValidator("param", z.object({ workspaceId: z.string() })),
  sessionMiddleware,
  memberMiddleware,
  async (c) => {
    const { workspaceId } = c.req.valid("param");
    const databases = c.get("databases");

    const projects = await databases.listDocuments<Project>(
      DB_ID,
      PROJECTS_ID,
      [Query.equal("workspaceId", workspaceId), Query.orderDesc("$createdAt")]
    );

    return c.json({ data: projects });
  }
);
