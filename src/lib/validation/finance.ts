import { z } from "zod";
import { uuidSchema, notesSchema, dateStringSchema } from "./common";

export const InvoiceSchema = z.object({
  patient_id: uuidSchema,
  total_amount: z.number().nonnegative("Total amount must be >= 0"),
  due_date: dateStringSchema.optional(),
  status: z.enum(["PENDING", "PAID", "CANCELLED"]).optional(),
}).strict();

export const PaymentRecordSchema = z.object({
  invoice_id: uuidSchema,
  amount_paid: z.number().nonnegative("Amount paid must be >= 0"),
  payment_method: z.string().trim().min(1, "Payment method is required"),
  payment_reference: z.string().trim().optional(),
}).strict();

export const ReceiptSchema = z.object({
  payment_id: uuidSchema,
  receipt_number: z.string().trim().min(1, "Receipt number is required"),
  notes: notesSchema.optional(),
}).strict();

export type InvoiceRequest = z.infer<typeof InvoiceSchema>;
export type PaymentRecordRequest = z.infer<typeof PaymentRecordSchema>;
export type ReceiptRequest = z.infer<typeof ReceiptSchema>;
