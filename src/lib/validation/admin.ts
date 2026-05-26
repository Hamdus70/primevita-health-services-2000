import { z } from "zod";

export const AnnouncementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  target_audience: z.enum(["ALL", "STAFF_ONLY", "PATIENTS_ONLY", "SPECIFIC_ROLES"]),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
});

export const SystemNotificationSchema = z.object({
  user_id: z.string().uuid("Invalid user ID"),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.enum(["INFO", "WARNING", "ALERT", "ACTION_REQUIRED"]),
});

export type AnnouncementRequest = z.infer<typeof AnnouncementSchema>;
export type SystemNotificationRequest = z.infer<typeof SystemNotificationSchema>;
