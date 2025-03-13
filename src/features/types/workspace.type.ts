import { Models } from "node-appwrite";

export type Workspace = Models.Document & {
  name: string;
  imageUrl?: string | File | undefined;
  inviteCode: string;
  userId: string;
};
