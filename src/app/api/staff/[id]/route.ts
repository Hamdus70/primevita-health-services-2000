import { withApiHandler } from "@/lib/api/with-api-handler";
import { StaffService } from "@/services";

export const GET = withApiHandler(async (req, ctx) => {
  const staffId = ctx.params.id;
  return await StaffService.getStaffById(staffId);
}, { requireAuth: true });
