import { Account } from "node-appwrite";
import { createSessionClient } from "@/lib/appwrite";

export async function getCurrentUser() {
  try {
    const client = await createSessionClient();
    const account = new Account(client);

    return await account.get();
  } catch (error) {
    console.error(error);
    return null;
  }
}
