import { withApiHandler } from "@/lib/api/with-api-handler";
import { StaffService } from "@/services";
import { StaffApprovalSchema } from "@/lib/validation/staff";
import { z } from "zod";

const ApproveStaffBody = z.object({
  staffId: z.string().uuid(),
  approvalData: StaffApprovalSchema
});

export const POST = withApiHandler(async (req, ctx) => {
  const adminId = ctx.user.staffId || ctx.user.id;
  return await StaffService.approveStaff(ctx.validData.staffId, ctx.validData.approvalData, adminId);
}, { requireAuth: true, requireStaff: true, schema: ApproveStaffBody, auditTable: "Staff" });
