import { z } from "zod";
import { uuidSchema, notesSchema, dateStringSchema } from "./common";

export const VitalSignSchema = z.object({
  patient_id: uuidSchema,
  temperature: z.number().min(30, "Temperature too low").max(45, "Temperature too high").optional(), // Celsius
  blood_pressure_systolic: z.number().int().min(50).max(300).optional(),
  blood_pressure_diastolic: z.number().int().min(30).max(200).optional(),
  pulse_rate: z.number().int().min(20).max(300).optional(),
  respiratory_rate: z.number().int().min(5).max(60).optional(),
  oxygen_saturation: z.number().min(0).max(100).optional(),
  blood_glucose: z.number().min(0).max(50).optional(), // mmol/L typically
  weight_kg: z.number().min(0.5).max(500).optional(),
  height_cm: z.number().min(20).max(300).optional(),
}).strict();

export const CarePlanSchema = z.object({
  patient_id: uuidSchema,
  nursing_problem: notesSchema,
  goal: notesSchema,
  interventions: notesSchema,
}).strict();

export const MedicationChartSchema = z.object({
  patient_id: uuidSchema,
  drug_name: z.string().trim().min(1, "Drug name is required"),
  dosage: z.string().trim().min(1, "Dosage is required"),
  route: z.string().trim().min(1, "Route is required"),
  frequency: z.string().trim().min(1, "Frequency is required"),
  duration: z.string().trim().min(1, "Duration is required"),
  start_date: dateStringSchema,
}).strict();

export const IntakeOutputSchema = z.object({
  patient_id: uuidSchema,
  intake_type: z.string().trim().min(1, "Intake type is required"),
  intake_amount_ml: z.number().nonnegative("Amount must be positive"),
  output_type: z.string().trim().min(1, "Output type is required"),
  output_amount_ml: z.number().nonnegative("Amount must be positive"),
}).strict();

export const NursingReportSchema = z.object({
  patient_id: uuidSchema,
  shiftType: z.enum(["MORNING", "AFTERNOON", "NIGHT"]).optional(),
  report_content: notesSchema,
}).strict();

export const DoctorNoteSchema = z.object({
  patient_id: uuidSchema,
  subjective: z.string().trim().optional(),
  objective: z.string().trim().optional(),
  assessment: z.string().trim().optional(),
  plan: z.string().trim().optional(),
  follow_up_required: z.boolean().optional(),
}).strict();

export type VitalSignRequest = z.infer<typeof VitalSignSchema>;
export type CarePlanRequest = z.infer<typeof CarePlanSchema>;
export type MedicationChartRequest = z.infer<typeof MedicationChartSchema>;
export type IntakeOutputRequest = z.infer<typeof IntakeOutputSchema>;
export type NursingReportRequest = z.infer<typeof NursingReportSchema>;
export type DoctorNoteRequest = z.infer<typeof DoctorNoteSchema>;
