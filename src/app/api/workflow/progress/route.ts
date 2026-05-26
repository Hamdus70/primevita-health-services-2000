import { withApiHandler } from "@/lib/api/with-api-handler";
import { WorkflowService } from "@/services";
import { z } from "zod";

const AdvanceWorkflowBody = z.object({
  patientId: z.string().uuid(),
  stage: z.string(),
  notes: z.string().optional()
});

export const POST = withApiHandler(async (req, ctx) => {
  const staffId = ctx.user.staffId || undefined;
  return await WorkflowService.advanceWorkflow(
    ctx.validData.patientId, 
    ctx.validData.stage, 
    staffId,
    ctx.validData.notes
  );
}, { requireAuth: true, schema: AdvanceWorkflowBody, auditTable: "PatientWorkflowStatus" });
