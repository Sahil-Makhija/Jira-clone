import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(8, "Minimum 8 characters."),
});

export type SignInModel = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  name: z.string().min(4, "Atleasat 4 characters."),
  email: z.string().email().trim(),
  password: z.string().min(8, "Minimum 8 characters."),
});

export type SignUpModel = z.infer<typeof signUpSchema>;
