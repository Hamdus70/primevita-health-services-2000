import { z } from "zod";
import { uuidSchema, notesSchema, dateStringSchema } from "./common";

export const TriageRequestSchema = z.object({
  patient_id: uuidSchema,
  symptoms: notesSchema,
  pain_level: z.number().int().min(1).max(10),
}).strict();

export const ClinicalSummaryRequestSchema = z.object({
  patient_id: uuidSchema,
  date_range_start: dateStringSchema.optional(),
  date_range_end: dateStringSchema.optional(),
}).strict();

export const SafetyCheckRequestSchema = z.object({
  patient_id: uuidSchema,
  drug_name: z.string().trim().min(1, "Drug name is required"),
  dosage: z.string().trim().min(1, "Dosage is required"),
}).strict();

export const DiagnosticSupportRequestSchema = z.object({
  patient_id: uuidSchema,
  clinical_notes: notesSchema,
}).strict();

export type TriageRequest = z.infer<typeof TriageRequestSchema>;
export type ClinicalSummaryRequest = z.infer<typeof ClinicalSummaryRequestSchema>;
export type SafetyCheckRequest = z.infer<typeof SafetyCheckRequestSchema>;
export type DiagnosticSupportRequest = z.infer<typeof DiagnosticSupportRequestSchema>;
