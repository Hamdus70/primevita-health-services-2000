import { getDb } from "@/lib/db/request-context";
import { withTransaction } from "@/lib/db/transaction";
import { assertExists, paginateQuery, buildPaginationMeta } from "../shared/base-service";
import { InvoiceRequest, PaymentRecordRequest, ReceiptRequest } from "@/lib/validation/finance";
import { createAuditLog } from "@/lib/audit/log";

export class FinanceService {

  static async createInvoice(data: InvoiceRequest, creatorId: string) {
    return withTransaction(async (tx) => {
      const invoiceNumber = `INV-${Date.now()}`;
      
      const invoice = await tx.invoice.create({
        data: {
          patient_id: data.patient_id,
          invoice_number: invoiceNumber,
          invoice_title: "Invoice " + invoiceNumber,
          total_amount: data.total_amount,
          issue_date: new Date(),
          due_date: data.due_date ? new Date(data.due_date) : new Date(),
          billing_status: data.status as any || "PENDING",
          created_by_admin_identifier: creatorId,
        }
      });

      await createAuditLog({
        actorIdentifier: creatorId,
        actorRole: "STAFF",
        actionType: "CREATE",
        affectedTable: "Invoice",
        affectedRecordId: invoice.id,
      });

      try {
        const { enqueue } = await import("@/lib/jobs/queue");
        const { QueueName } = await import("@/lib/jobs/job-types");
        
        await enqueue(QueueName.PAYMENT_REMINDER, "INVOICE_CREATE_REMINDER", {
          invoiceId: invoice.id,
          type: "DUE_SOON"
        });
      } catch (err: any) {
        console.error("[Queue] Invoice reminder error:", err.message);
      }

      return invoice;
    });
  }

  static async recordPayment(data: PaymentRecordRequest, recorderId: string) {
    return withTransaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: { id: data.invoice_id }
      });
      assertExists(invoice, "Invoice not found");

      const payment = await tx.paymentRecord.create({
        data: {
          patient_id: invoice.patient_id,
          invoice_id: invoice.id,
          amount_paid: data.amount_paid,
          payment_method: "CARD" as any, 
          transaction_reference: data.payment_reference,
          paid_at: new Date()
        }
      });

      const sumPayments = await tx.paymentRecord.aggregate({
        _sum: { amount_paid: true },
        where: { invoice_id: invoice.id }
      });
      
      const newAmountPaid = sumPayments._sum.amount_paid || 0;
      const status = newAmountPaid >= invoice.total_amount ? "PAID" : "PENDING";

      await tx.invoice.update({
        where: { id: invoice.id },
        data: {
          billing_status: status as any
        }
      });

      await createAuditLog({
        actorIdentifier: recorderId,
        actorRole: "STAFF",
        actionType: "CREATE",
        affectedTable: "PaymentRecord",
        affectedRecordId: payment.id,
      });

      if (status === "PENDING") {
        try {
          const { enqueue } = await import("@/lib/jobs/queue");
          const { QueueName } = await import("@/lib/jobs/job-types");
          
          await enqueue(QueueName.PAYMENT_REMINDER, "INVOICE_PARTIAL_PAID", {
            invoiceId: invoice.id,
            type: "DUE_SOON"
          });
        } catch (err: any) {
          console.error("[Queue] Payment record reminder error:", err.message);
        }
      }

      return payment;
    });
  }

  static async issueReceipt(data: ReceiptRequest, issuerId: string) {
    return withTransaction(async (tx) => {
      const receipt = await tx.receipt.create({
        data: {
          payment_record_id: data.payment_id,
          receipt_number: data.receipt_number,
          payment_method: "CARD",
          amount_received: 0, 
        }
      });

      return receipt;
    });
  }

  static async getOutstandingBalances(patientId: string) {
    const db = getDb();
    
    const invoices = await db.invoice.findMany({
      where: {
        patient_id: patientId,
        billing_status: "PENDING"
      },
      include: {
        payment_records: true
      }
    });

    let totalAmount = 0;
    let amountPaid = 0;

    for (const inv of invoices) {
      totalAmount += inv.total_amount;
      for (const pr of inv.payment_records) {
        amountPaid += pr.amount_paid;
      }
    }

    return {
      outstandingBalance: totalAmount - amountPaid
    };
  }
}
