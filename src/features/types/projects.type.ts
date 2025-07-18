import { Models } from "node-appwrite";

export type Project = Models.Document & {
  name: string;
  workspaceId: string;
  imageUrl?: string;
};
