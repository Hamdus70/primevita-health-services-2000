import { withApiHandler } from "@/lib/api/with-api-handler";
import { InternalServerError } from "@/lib/api/errors";

export const POST = withApiHandler(async (req, ctx) => {
  throw new InternalServerError("Nursing reports implementation missing");
}, { requireStaff: true });
