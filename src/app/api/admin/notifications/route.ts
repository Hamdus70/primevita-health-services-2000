import { withApiHandler } from "@/lib/api/with-api-handler";
import { AdminService } from "@/services";
import { SystemNotificationSchema } from "@/lib/validation/admin";

export const POST = withApiHandler(async (req, ctx) => {
  const { user_id, title, message, type } = ctx.validData;
  return await AdminService.createNotification(user_id, title, message, type as any);
}, { requireStaff: true, schema: SystemNotificationSchema, auditTable: "SystemNotification" });
