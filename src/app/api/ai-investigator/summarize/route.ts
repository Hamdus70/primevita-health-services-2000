import { withApiHandler } from "@/lib/api/with-api-handler";
import { AiInvestigatorService } from "@/services";

export const POST = withApiHandler(async (req, ctx) => {
  const { patientId, startDate, endDate } = ctx.validData || {};
  return await AiInvestigatorService.generateClinicalSummary(patientId, startDate, endDate);
}, { requireAuth: true });
