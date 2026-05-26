import { z } from "zod";
import { emailSchema, strongPasswordSchema } from "./common";

export const LoginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
}).strict();

export const RequestPasswordResetSchema = z.object({
  email: emailSchema,
}).strict();

export const VerifyOtpSchema = z.object({
  email: emailSchema,
  code: z.string().trim().length(6, "OTP must be exactly 6 digits").regex(/^\d{6}$/, "OTP must be numeric"),
}).strict();

export const CompletePasswordResetSchema = z.object({
  trackingToken: z.string().trim().min(1, "Tracking token is required"),
  newPassword: strongPasswordSchema,
}).strict();

export type LoginRequest = z.infer<typeof LoginSchema>;
export type RequestPasswordResetRequest = z.infer<typeof RequestPasswordResetSchema>;
export type VerifyOtpRequest = z.infer<typeof VerifyOtpSchema>;
export type CompletePasswordResetRequest = z.infer<typeof CompletePasswordResetSchema>;
