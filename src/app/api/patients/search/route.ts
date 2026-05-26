import { withApiHandler } from "@/lib/api/with-api-handler";
import { PatientService } from "@/services";

export const GET = withApiHandler(async (req, ctx) => {
  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get("q") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  return await PatientService.searchPatients({ search, page, limit });
}, { requireAuth: true });
