import { withApiHandler } from "@/lib/api/with-api-handler";
import { ClinicalService } from "@/services";
import { MedicationChartSchema } from "@/lib/validation/clinical";

export const POST = withApiHandler(async (req, ctx) => {
  const staffId = ctx.user.staffId!;
  const role = ctx.user.role;
  return await ClinicalService.createMedicationChart(ctx.validData, staffId, role);
}, { requireStaff: true, schema: MedicationChartSchema, auditTable: "MedicationChart" });
