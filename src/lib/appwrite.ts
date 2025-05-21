import "server-only";

import { APPWRITE_ENDPOINT, APPWRITE_PROJECT, AUTH_COOKIE } from "@/config";
import { cookies } from "next/headers";
import { Client as AppwriteClient, Account } from "node-appwrite";

export async function createAdminClient() {
  const client = new AppwriteClient()
    .setEndpoint(APPWRITE_ENDPOINT!)
    .setProject(APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function createSessionClient() {
  const client = new AppwriteClient()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = (await cookies()).get(AUTH_COOKIE);

  if (!session || !session.value) {
    return null;
  }

  client.setSession(session.value);

  return client;
}
