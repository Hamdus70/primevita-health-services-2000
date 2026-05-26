import { withApiHandler } from "@/lib/api/with-api-handler";
import { PatientService } from "@/services";

export const GET = withApiHandler(async (req, ctx) => {
  const patientId = ctx.params.id;
  return await PatientService.getPatientById(patientId);
}, { requireAuth: true });
