import { withApiHandler } from "@/lib/api/with-api-handler";
import { AiInvestigatorService } from "@/services";

export const POST = withApiHandler(async (req, ctx) => {
  const { patientId, vitalsLogId } = ctx.validData || {};
  return await AiInvestigatorService.detectVitalsAnomaly(patientId, vitalsLogId);
}, { requireStaff: true });
