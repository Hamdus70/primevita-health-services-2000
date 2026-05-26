import { withApiHandler } from "@/lib/api/with-api-handler";
import { WorkflowService } from "@/services";
import { z } from "zod";

const AssignStaffBody = z.object({
  patientId: z.string().uuid(),
  staffId: z.string().uuid(),
  role: z.string()
});

export const POST = withApiHandler(async (req, ctx) => {
  const adminId = ctx.user.staffId || ctx.user.id;
  return await WorkflowService.assignPatientToStaff(
    ctx.validData.patientId, 
    ctx.validData.staffId, 
    ctx.validData.role, 
    adminId
  );
}, { requireStaff: true, schema: AssignStaffBody, auditTable: "PatientAssignment" });
