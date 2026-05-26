import { InternalServerError } from "@/lib/api/errors";

export class AiInvestigatorService {
  static async runTriageAnalysis(patientId: string, symptoms: string, painLevel: number) {
    throw new InternalServerError("AI Investigator implementation pending Step 6");
  }

  static async generateClinicalSummary(patientId: string, startDate?: string, endDate?: string) {
    throw new InternalServerError("AI Investigator implementation pending Step 6");
  }

  static async runPrescriptionSafetyCheck(patientId: string, drugName: string, dosage: string) {
    throw new InternalServerError("AI Investigator implementation pending Step 6");
  }

  static async suggestCarePlan(patientId: string, clinicalNotes: string) {
    throw new InternalServerError("AI Investigator implementation pending Step 6");
  }

  static async detectVitalsAnomaly(patientId: string, vitalsLogId: string) {
    throw new InternalServerError("AI Investigator implementation pending Step 6");
  }
}
