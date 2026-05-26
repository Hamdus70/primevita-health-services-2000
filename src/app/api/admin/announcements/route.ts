import { withApiHandler } from "@/lib/api/with-api-handler";
import { AdminService } from "@/services";
import { AnnouncementSchema } from "@/lib/validation/admin";

export const POST = withApiHandler(async (req, ctx) => {
  const adminId = ctx.user.staffId || ctx.user.id;
  const { title, content, target_audience } = ctx.validData;
  return await AdminService.createAnnouncement(title, content, adminId, target_audience as any);
}, { requireStaff: true, schema: AnnouncementSchema, auditTable: "Announcement" });
