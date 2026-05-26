import { getDb } from "@/lib/db/request-context";
import { withTransaction } from "@/lib/db/transaction";
import { assertExists } from "../shared/base-service";
import { excludeDeleted } from "@/lib/db/soft-delete";
import { StaffApplicationRequest, StaffApprovalRequest, InterviewScheduleRequest } from "@/lib/validation/staff";
import { createAuditLog } from "@/lib/audit/log";

export class StaffService {
  static async getStaffById(staffId: string) {
    const db = getDb();
    const staff = await db.staff.findFirst({
      where: {
        id: staffId,
        ...excludeDeleted()
      },
      include: {
        guarantor: true,
        service_logs: {
          take: 5,
          orderBy: { created_at: "desc" }
        }
      }
    });

    assertExists(staff, "Staff not found");
    return staff;
  }

  static async createStaffApplication(data: StaffApplicationRequest) {
    return withTransaction(async (tx) => {
      const staff_public_id = `STAFF-${Date.now()}`;
      
      const staff = await tx.staff.create({
        data: {
          staff_public_id,
          role: data.role as any,
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          gender: "Not Provided", // Not in validation but required
          age: Math.floor((new Date().getTime() - new Date(data.date_of_birth).getTime()) / 3.15576e+10), // Not in validation but required
          address: "Not Provided", // Not in validation but required
          email: data.email,
          phone_number: data.phone,
          professional_license_number: data.licence_number,
          date_of_birth: new Date(data.date_of_birth),
          approval_status: "PENDING",
          staff_id_format: `HSP-${data.role}-${Date.now().toString().slice(-4)}`
        }
      });

      await tx.staffGuarantor.create({
        data: {
          staff_id: staff.id,
          guarantor_full_name: data.guarantor_name,
          phone_number: data.guarantor_phone,
          relationship_to_staff: "Not Provided",
          occupation: "Not Provided",
          address: "Not Provided",
          government_id_type: "Not Provided",
          government_id_number: "Not Provided"
        }
      });

      return staff;
    });
  }

  static async approveStaff(staffId: string, data: StaffApprovalRequest, reviewerId: string) {
    return withTransaction(async (tx) => {
      const staff = await tx.staff.update({
        where: { id: staffId },
        data: { approval_status: "APPROVED" }
      });

      await tx.staffApplicationReview.create({
        data: {
          staff_id: staffId,
          reviewed_by_admin: reviewerId,
          review_status: "APPROVED",
          review_notes: data.review_notes, 
        }
      });

      await createAuditLog({
        actorIdentifier: reviewerId,
        actorRole: "ADMIN",
        actionType: "APPROVE",
        affectedTable: "Staff",
        affectedRecordId: staffId,
      });

      try {
        const { enqueue } = await import("@/lib/jobs/queue");
        const { QueueName } = await import("@/lib/jobs/job-types");
        
        await enqueue(QueueName.NOTIFICATION, "STAFF_APPROVED", {
          recipientId: staff.staff_public_id,
          type: "STAFF_APPROVAL",
          title: "Application Approved",
          message: "Your staff application has been approved.",
          channel: "EMAIL"
        });
      } catch (err: any) {
         console.error("[Queue] Staff approval notify error:", err.message);
      }

      return staff;
    });
  }

  static async rejectStaff(staffId: string, reviewerId: string, notes?: string) {
    return withTransaction(async (tx) => {
      const staff = await tx.staff.update({
        where: { id: staffId },
        data: { approval_status: "REJECTED" }
      });

      await tx.staffApplicationReview.create({
        data: {
          staff_id: staffId,
          reviewed_by_admin: reviewerId,
          review_status: "REJECTED",
          review_notes: notes,
        }
      });
      
      return staff;
    });
  }

  static async scheduleInterview(staffId: string, data: InterviewScheduleRequest, schedulerId: string) {
    return withTransaction(async (tx) => {
      const staff = await tx.staff.update({
        where: { id: staffId },
        data: { approval_status: "INTERVIEW_SCHEDULED" }
      });

      await tx.interviewSchedule.create({
        data: {
          staff_id: staffId,
          interview_date: new Date(data.interview_date),
          interview_mode: data.interview_mode,
          interview_link: data.interview_link,
          scheduled_by_admin: schedulerId
        }
      });

      try {
        const { enqueue } = await import("@/lib/jobs/queue");
        const { QueueName } = await import("@/lib/jobs/job-types");
        
        await enqueue(QueueName.NOTIFICATION, "INTERVIEW_SCHEDULED", {
          recipientId: staff.staff_public_id,
          type: "INTERVIEW_SCHEDULED",
          title: "Interview Scheduled",
          message: `Your interview is scheduled for ${data.interview_date}. Mode: ${data.interview_mode}`,
          channel: "EMAIL"
        });
      } catch (err: any) {
         console.error("[Queue] Interview schedule notify error:", err.message);
      }

      return staff;
    });
  }
}
