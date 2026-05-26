import { getDb } from "@/lib/db/request-context";
import { withTransaction } from "@/lib/db/transaction";
import { createAuditLog } from "@/lib/audit/log";
import { AdminNotificationType, AnnouncementAudience } from "@prisma/client";

export class AdminService {
  static async createAnnouncement(title: string, message: string, creatorId: string, audience: AnnouncementAudience) {
    return withTransaction(async (tx) => {
      const announcement = await tx.announcement.create({
        data: {
          title,
          message,
          audience,
          created_by_admin_identifier: creatorId,
          start_date: new Date(),
        }
      });

      await createAuditLog({
        actorIdentifier: creatorId,
        actorRole: "ADMIN",
        actionType: "CREATE",
        affectedTable: "Announcement",
        affectedRecordId: announcement.id,
      });

      try {
        const { enqueue } = await import("@/lib/jobs/queue");
        const { QueueName } = await import("@/lib/jobs/job-types");
        
        await enqueue(QueueName.NOTIFICATION, "ANNOUNCEMENT_NOTIFY", {
          recipientId: audience, // placeholder for all
          type: "ANNOUNCEMENT",
          title: title,
          message: message,
          channel: "SYSTEM"
        });
      } catch (err: any) {
         console.error("[Queue] Announcement notify error:", err.message);
      }

      return announcement;
    });
  }

  static async createNotification(patientId: string, title: string, message: string, type: AdminNotificationType) {
    return withTransaction(async (tx) => {
      const notification = await tx.adminNotification.create({
        data: {
          related_patient_id: patientId,
          title,
          message,
          notification_type: type,
        }
      });
      return notification;
    });
  }

  static async markNotificationRead(notificationId: string) {
    return withTransaction(async (tx) => {
      return await tx.adminNotification.update({
        where: { id: notificationId },
        data: {
          is_read: true,
          read_at: new Date()
        }
      });
    });
  }

  static async writeAuditEntry(actorIdentifier: string, actorRole: string, actionType: any, affectedTable: string, affectedRecordId?: string) {
    await createAuditLog({
      actorIdentifier,
      actorRole,
      actionType,
      affectedTable,
      affectedRecordId
    });
    return true;
  }
}

