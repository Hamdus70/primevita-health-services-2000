import { z } from "zod";

export const uuidSchema = z.string().uuid("Invalid UUID format");

export const emailSchema = z.string().trim().email("Invalid email address");

// Accepts formats like +2348012345678 or 08012345678
export const phoneSchema = z.string().trim().regex(/^(?:\+234|0)[789]\d{9}$/, "Invalid phone number format");

// Minimum 8 chars, uppercase, lowercase, number, symbol
export const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol");

export const dateStringSchema = z.string().datetime({ message: "Invalid ISO date string format" });

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().trim().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
}).strict();

export const notesSchema = z.string().trim().min(1, "Text cannot be empty");

export type PaginationParams = z.infer<typeof paginationSchema>;
