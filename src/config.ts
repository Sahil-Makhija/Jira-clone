export const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
export const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;

export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const WORKSPACES_ID = process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!;
export const MEMBERS_ID = process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!;
export const PROJECTS_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID!;
export const STORAGE_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!;

export const AUTH_COOKIE = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
