import { AuditLogModel } from "../models/AuditLog.model";

async function log(
  actor_user_id: string,
  action: string,
  target_type: "club" | "activity" | "post" | "report" | "user",
  target_id?: string,
  metadata?: any
) {
  await AuditLogModel.create({
    actor_user_id,
    action,
    target_type,
    target_id,
    metadata,
  });
}

export const AuditLogService = { log };
