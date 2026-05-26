import { AuditActionType } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

interface CreateAuditLogParams {
  actorIdentifier: string;
  actorRole: string;
  actionType: AuditActionType;
  affectedTable: string;
  affectedRecordId?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(params: CreateAuditLogParams): Promise<void> {
  try {
    // Fire and forget, prevent blocking main execution flow
    await prisma.auditLog.create({
      data: {
        actor_identifier: params.actorIdentifier,
        actor_role: params.actorRole,
        action_type: params.actionType,
        affected_table: params.affectedTable,
        affected_record_id: params.affectedRecordId,
        old_value_json: params.oldValue ? params.oldValue : undefined,
        new_value_json: params.newValue ? params.newValue : undefined,
        ip_address: params.ipAddress,
        user_agent: params.userAgent,
      }
    });
  } catch (error) {
    // Swallow internal failure safely
    console.error("Failed to create audit log", error);
  }
}
