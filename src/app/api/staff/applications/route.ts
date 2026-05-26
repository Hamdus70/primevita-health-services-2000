import { withApiHandler } from "@/lib/api/with-api-handler";
import { StaffService } from "@/services";
import { StaffApplicationSchema } from "@/lib/validation/staff";

export const POST = withApiHandler(async (req, ctx) => {
  return await StaffService.createStaffApplication(ctx.validData);
}, { schema: StaffApplicationSchema, requireAuth: false });
