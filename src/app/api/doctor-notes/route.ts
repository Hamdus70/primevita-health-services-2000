import { withApiHandler } from "@/lib/api/with-api-handler";
import { ClinicalService } from "@/services";
import { DoctorNoteSchema } from "@/lib/validation/clinical";

export const POST = withApiHandler(async (req, ctx) => {
  const staffId = ctx.user.staffId!;
  const role = ctx.user.role;
  return await ClinicalService.createDoctorNote(ctx.validData, staffId, role);
}, { requireStaff: true, schema: DoctorNoteSchema, auditTable: "DoctorNote" });
