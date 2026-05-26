import { withApiHandler } from "@/lib/api/with-api-handler";
import { InternalServerError } from "@/lib/api/errors";

export const GET = withApiHandler(async (req, ctx) => {
  throw new InternalServerError("Audit log listing not implemented yet");
}, { requireStaff: true });
