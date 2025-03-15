import { DB_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { Account, Databases, Query } from "node-appwrite";
import { createSessionClient } from "@/lib/appwrite";
import { Workspace } from "@/features/types";

export const getWorkspaces = async () => {
  try {
    const client = await createSessionClient();

    const user = await new Account(client).get();
    const databases = new Databases(client);

    const members = await databases.listDocuments(DB_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return { documents: [], total: 0 };
    }
    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(DB_ID, WORKSPACES_ID, [
      Query.orderDesc("$createdAt"),
      Query.contains("$id", workspaceIds),
    ]);

    return workspaces;
  } catch (error) {
    return null;
  }
};

export const getWorkspaceById = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  try {
    const client = await createSessionClient();
    const user = await new Account(client).get();
    const databases = new Databases(client);

    const members = await databases.listDocuments(DB_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return undefined;
    }

    const workspace: Workspace = await databases.getDocument(
      DB_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return workspace;
  } catch (error) {
    return undefined;
  }
};
