import { z } from "zod";
import { emailSchema, phoneSchema, dateStringSchema, notesSchema } from "./common";

export const PatientRegistrationSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  middle_name: z.string().trim().optional(),
  last_name: z.string().trim().min(1, "Last name is required"),
  date_of_birth: dateStringSchema,
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  phone_number: phoneSchema,
  email: emailSchema.optional(),
  address: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  country: z.string().trim().min(1, "Country is required"),
  nationality: z.string().trim().min(1, "Nationality is required"),
}).strict();

export const EmergencyContactSchema = z.object({
  contact_full_name: z.string().trim().min(1, "Contact name is required"),
  relationship_to_patient: z.string().trim().min(1, "Relationship to patient is required"),
  primary_phone: phoneSchema,
  secondary_phone: phoneSchema.optional(),
  email: emailSchema.optional(),
  address: z.string().trim().optional(),
}).strict();

export const MedicalProfileSchema = z.object({
  blood_group: z.string().trim().optional(),
  genotype: z.string().trim().optional(),
  allergies: z.string().trim().optional(),
  chronic_conditions: z.string().trim().optional(),
  current_medications: z.string().trim().optional(),
  past_surgeries: z.string().trim().optional(),
  family_medical_history: z.string().trim().optional(),
  immunization_history: z.string().trim().optional(),
}).strict();

export const QuickAssessmentSchema = z.object({
  symptoms: notesSchema,
  condition_description: notesSchema,
  pain_level: z.number().int().min(1).max(10),
}).strict();

export type PatientRegistrationRequest = z.infer<typeof PatientRegistrationSchema>;
export type EmergencyContactRequest = z.infer<typeof EmergencyContactSchema>;
export type MedicalProfileRequest = z.infer<typeof MedicalProfileSchema>;
export type QuickAssessmentRequest = z.infer<typeof QuickAssessmentSchema>;
