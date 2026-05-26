import { withApiHandler } from "@/lib/api/with-api-handler";
import { AiInvestigatorService } from "@/services";

export const POST = withApiHandler(async (req, ctx) => {
  const { patientId, clinicalNotes } = ctx.validData || {};
  return await AiInvestigatorService.suggestCarePlan(patientId, clinicalNotes);
}, { requireStaff: true });
