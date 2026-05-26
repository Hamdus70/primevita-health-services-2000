import { withApiHandler } from "@/lib/api/with-api-handler";
import { AiInvestigatorService } from "@/services";

export const POST = withApiHandler(async (req, ctx) => {
  const { patientId, drugName, dosage } = ctx.validData || {};
  return await AiInvestigatorService.runPrescriptionSafetyCheck(patientId, drugName, dosage);
}, { requireStaff: true });
