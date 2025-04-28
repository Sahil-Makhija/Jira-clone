import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((str) => (str === "" ? undefined : str)),
    ])
    .optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Must be on or more characters").optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((str) => (str === "" ? undefined : str)),
    ])
    .optional(),
});

export const joinWorkspaceSchema = z.object({
  inviteCode: z.string(),
});

export type CreateWorkspaceModel = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceModel = z.infer<typeof updateWorkspaceSchema>;
