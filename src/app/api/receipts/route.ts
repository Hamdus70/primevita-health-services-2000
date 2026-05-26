import { withApiHandler } from "@/lib/api/with-api-handler";
import { FinanceService } from "@/services";
import { ReceiptSchema } from "@/lib/validation/finance";

export const POST = withApiHandler(async (req, ctx) => {
  const adminId = ctx.user.staffId || ctx.user.id;
  return await FinanceService.issueReceipt(ctx.validData, adminId);
}, { requireStaff: true, schema: ReceiptSchema, auditTable: "Receipt" });
