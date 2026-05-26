import { withApiHandler } from "@/lib/api/with-api-handler";
import { AiInvestigatorService } from "@/services";

export const POST = withApiHandler(async (req, ctx) => {
  const { patientId, symptoms, painLevel } = ctx.validData || {};
  return await AiInvestigatorService.runTriageAnalysis(patientId, symptoms, painLevel);
}, { requireAuth: true });
