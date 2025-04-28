import { Models } from "node-appwrite";

export enum MemberRole {
  MEMBER = "MEMBER",
  ADMIN = "ADMIN",
}

export type Member = Models.Document & {
  role: MemberRole;
  workspaceId: string;
  userId: string;
};
