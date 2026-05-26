import { withApiHandler } from "@/lib/api/with-api-handler";
import { FinanceService } from "@/services";
import { InvoiceSchema } from "@/lib/validation/finance";

export const POST = withApiHandler(async (req, ctx) => {
  const adminId = ctx.user.staffId || ctx.user.id;
  return await FinanceService.createInvoice(ctx.validData, adminId);
}, { requireStaff: true, schema: InvoiceSchema, auditTable: "Invoice" });

export const GET = withApiHandler(async (req, ctx) => {
  const patientId = req.nextUrl.searchParams.get("patientId");
  if (!patientId) throw new Error("patientId is required");
  return await FinanceService.getOutstandingBalances(patientId);
}, { requireAuth: true });
