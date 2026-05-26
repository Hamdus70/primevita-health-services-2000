import { withApiHandler } from "@/lib/api/with-api-handler";
import { WorkflowService } from "@/services";

export const GET = withApiHandler(async (req, ctx) => {
  const patientId = req.nextUrl.searchParams.get("patientId");
  if (!patientId) throw new Error("patientId is required");
  return await WorkflowService.getCurrentWorkflow(patientId);
}, { requireAuth: true });
