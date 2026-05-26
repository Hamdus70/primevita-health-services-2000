import { withApiHandler } from "@/lib/api/with-api-handler";
import { InternalServerError } from "@/lib/api/errors";

export const GET = withApiHandler(async (req, ctx) => {
  throw new InternalServerError("Medical profile retrieval is not implemented yet");
}, { requireAuth: true });

export const PUT = withApiHandler(async (req, ctx) => {
  throw new InternalServerError("Medical profile update is not implemented yet");
}, { requireAuth: true });
