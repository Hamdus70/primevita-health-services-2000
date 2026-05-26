import { withApiHandler } from "@/lib/api/with-api-handler";
import { ClinicalService } from "@/services";
import { QuickAssessmentSchema } from "@/lib/validation/patient";

export const POST = withApiHandler(async (req, ctx) => {
  const patientId = ctx.user.patientId;
  return await ClinicalService.submitQuickAssessment(ctx.validData, patientId!);
}, { requireAuth: true, schema: QuickAssessmentSchema, auditTable: "PatientQuickAssessment" });
