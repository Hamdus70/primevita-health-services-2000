import { z } from "zod";
import { emailSchema, phoneSchema, dateStringSchema } from "./common";

export const StaffApplicationSchema = z.object({
  role: z.enum(["DOCTOR", "NURSE", "CAREGIVER", "PHYSIOTHERAPIST", "ADMIN", "RECEPTIONIST"]),
  first_name: z.string().trim().min(1, "First name is required"),
  middle_name: z.string().trim().optional(),
  last_name: z.string().trim().min(1, "Last name is required"),
  email: emailSchema,
  phone: phoneSchema,
  licence_number: z.string().trim().min(1, "Licence number is required"),
  date_of_birth: dateStringSchema,
  guarantor_name: z.string().trim().min(1, "Guarantor name is required"),
  guarantor_phone: phoneSchema,
}).strict();

export const StaffApprovalSchema = z.object({
  approval_status: z.enum(["APPROVED", "REJECTED", "INTERVIEW_SCHEDULED"]),
  review_notes: z.string().trim().optional(),
}).strict();

export const InterviewScheduleSchema = z.object({
  interview_date: dateStringSchema,
  interview_mode: z.enum(["IN_PERSON", "VIRTUAL"]),
  interview_link: z.string().trim().url("Invalid URL for interview link").optional(),
}).strict();

export type StaffApplicationRequest = z.infer<typeof StaffApplicationSchema>;
export type StaffApprovalRequest = z.infer<typeof StaffApprovalSchema>;
export type InterviewScheduleRequest = z.infer<typeof InterviewScheduleSchema>;
