import { z } from "zod";

export const loginSchema = z.object({
  login: z.string().trim().min(3).max(64),
  password: z.string().min(8).max(128),
});

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(190),
  login: z.string().trim().min(3).max(64),
  password: z.string().min(8).max(128),
});

export const changePasswordSchema = z
  .object({
    confirmPassword: z.string().min(8).max(128),
    currentPassword: z.string().min(8).max(128),
    newPassword: z.string().min(8).max(128),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
