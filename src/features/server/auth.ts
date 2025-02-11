import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { deleteCookie, setCookie } from "hono/cookie";
import { ID } from "node-appwrite";

import { signInSchema, signUpSchema } from "@/features/schemas";
import { createAdminClient } from "@/lib/appwrite";
import { apiErrorHandler } from "@/lib/api-error-handler";

import { AUTH_COOKIE, SESSION_MAX_AGE } from "../constants";

export const auth = new Hono()
  .post("/login", zValidator("json", signInSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    const { account } = await createAdminClient();

    try {
      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE, session.secret, {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: true,
        maxAge: SESSION_MAX_AGE,
      });

      return c.json({ success: true }, 200);
    } catch (error) {
      const { code, error_msg } = apiErrorHandler(error);
      return c.json({ error: error_msg }, code);
    }
  })
  .post("/register", zValidator("json", signUpSchema), async (c) => {
    const { email, name, password } = c.req.valid("json");

    const { account } = await createAdminClient();

    try {
      await account.create(ID.unique(), email, password, name);

      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE, session.secret, {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: true,
        maxAge: SESSION_MAX_AGE, // 30 days
      });

      return c.json({ success: true });
    } catch (error) {
      const { code, error_msg } = apiErrorHandler(error);
      return c.json({ error: error_msg }, code);
    }
  })
  .post("/logout", async (c) => {
    deleteCookie(c, AUTH_COOKIE);
    return c.json({ success: true });
  });
