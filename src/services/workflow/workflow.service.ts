import { getDb } from "@/lib/db/request-context";
import { withTransaction } from "@/lib/db/transaction";
import { assertExists } from "../shared/base-service";
import { PatientAlreadyAssignedError } from "../shared/service-errors";
import { excludeDeleted } from "@/lib/db/soft-delete";
import { WorkflowStage, Role } from "@prisma/client";
import { createAuditLog } from "@/lib/audit/log";

export class WorkflowService {
  static async advanceWorkflow(patientId: string, stage: string, staffId?: string, notes?: string) {
    return withTransaction(async (tx) => {
      const status = await tx.patientWorkflowStatus.create({
        data: {
          patient_id: patientId,
          workflow_stage: stage as WorkflowStage,
          status_notes: notes,
          triggered_by_staff_id: staffId,
        }
      });

      return status;
    });
  }

  static async getCurrentWorkflow(patientId: string) {
    const db = getDb();
    const current = await db.patientWorkflowStatus.findFirst({
      where: { patient_id: patientId },
      orderBy: { status_started_at: "desc" },
    });
    return current;
  }

  static async assignPatientToStaff(patientId: string, staffId: string, role: string, assignerId: string) {
    return withTransaction(async (tx) => {
      // Check existing active assignment
      const existing = await tx.patientAssignment.findFirst({
        where: {
          patient_id: patientId,
          assigned_role: role as Role,
          assignment_status: "ACTIVE" as any,
          ...excludeDeleted()
        }
      });

      if (existing) {
        throw new PatientAlreadyAssignedError();
      }

      const assignment = await tx.patientAssignment.create({
        data: {
          patient_id: patientId,
          staff_id: staffId,
          assigned_role: role as Role,
          assigned_by_admin_identifier: assignerId,
          assignment_status: "ACTIVE" as any,
          assignment_start_date: new Date()
        }
      });

      await createAuditLog({
        actorIdentifier: assignerId,
        actorRole: "ADMIN",
        actionType: "CREATE",
        affectedTable: "PatientAssignment",
        affectedRecordId: assignment.id,
      });

      return assignment;
    });
  }
}
