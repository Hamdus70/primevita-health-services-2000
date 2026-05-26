// Validation helpers using Zod
import { z } from "zod";

export const commonValidations = {
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(10, "Invalid phone number"),
  requiredString: (message: string = "This field is required") => z.string().min(1, message),
};

// You can re-export standard schemas from your lib/validation
// e.g. export * from "@/lib/validation/patient";
