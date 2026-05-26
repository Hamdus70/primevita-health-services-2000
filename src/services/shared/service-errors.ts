import { AppError } from "@/lib/api/errors";

export class PatientAlreadyAssignedError extends AppError {
  constructor(message = "Patient is already assigned to this role") {
    super(message, "PATIENT_ALREADY_ASSIGNED", 409, undefined, true);
  }
}

export class MedicationConflictError extends AppError {
  constructor(message = "Medication conflict detected") {
    super(message, "MEDICATION_CONFLICT", 409, undefined, true);
  }
}

export class BillingClosedError extends AppError {
  constructor(message = "Billing cycle is already closed") {
    super(message, "BILLING_CLOSED", 409, undefined, true);
  }
}
