import { withApiHandler } from "@/lib/api/with-api-handler";
import { StaffService } from "@/services";
import { InterviewScheduleSchema } from "@/lib/validation/staff";
import { z } from "zod";

const ScheduleInterviewBody = z.object({
  staffId: z.string().uuid(),
  interviewData: InterviewScheduleSchema
});

export const POST = withApiHandler(async (req, ctx) => {
  const adminId = ctx.user.staffId || ctx.user.id;
  return await StaffService.scheduleInterview(ctx.validData.staffId, ctx.validData.interviewData, adminId);
}, { requireAuth: true, requireStaff: true, schema: ScheduleInterviewBody, auditTable: "Staff" });
