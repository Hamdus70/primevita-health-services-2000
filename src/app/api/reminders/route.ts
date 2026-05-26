import { withApiHandler } from "@/lib/api/with-api-handler";
import { InternalServerError } from "@/lib/api/errors";

export const POST = withApiHandler(async (req, ctx) => {
  throw new InternalServerError("Payment reminders not implemented yet");
}, { requireStaff: true });
