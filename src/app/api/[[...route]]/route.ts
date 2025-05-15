import { Hono } from "hono";
import { handle } from "hono/vercel";

import { auth, projects, workspaces } from "@/features/routes";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/hello", (c) => {
  return c.json({
    message: "Hello from Hono!",
  });
});

const routes = app
  .route("/auth", auth)
  .route("/workspaces", workspaces)
  .route("/projects", projects);

export const GET = handle(routes);
export const POST = handle(routes);
export const PATCH = handle(routes);
export const DELETE = handle(routes);

export type AppType = typeof routes;
