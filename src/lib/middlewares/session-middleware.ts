// import "server-only";

import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";

import {
  Account,
  Client as AppwriteClient,
  Databases,
  Storage,
  Models,
  type Account as AccountType,
  type Databases as DatabasesType,
  type Storage as StorageType,
  type Users as UsersType,
} from "node-appwrite";

import { AUTH_COOKIE } from "@/config";

export type AdditionalContext = {
  Variables: {
    account: AccountType;
    databases: DatabasesType;
    storage: StorageType;
    users: UsersType;
    user: Models.User<Models.Preferences>;
  };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const client = new AppwriteClient()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = getCookie(c, AUTH_COOKIE);

    if (!session) {
      return c.json(
        {
          error: "Unauthenticated!",
        },
        401
      );
    }

    try {
      client.setSession(session);

      const account = new Account(client);
      const databases = new Databases(client);
      const storage = new Storage(client);

      const user = await account.get();

      c.set("account", account);
      c.set("databases", databases);
      c.set("storage", storage);
      c.set("user", user);

      await next();
    } catch (error) {
      // Handle invalid/expired session
      return c.json(
        {
          error: "Invalid or expired session",
        },
        401
      );
    }
  }
);
