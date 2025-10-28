import { ReportModel } from "../models/Report.model";
import { HttpError } from "../utils/errors";
import { NotificationService } from "./NotificationService";
import { UserModel } from "../models/User.model";
import { AuditLogService } from "./AuditLogService";

async function submitReport(userId: string, data: {
  target_type: "club" | "activity" | "post" | "other";
  club_id?: string;
  activity_id?: string;
  post_id?: string;
  message: string;
}) {
  if (!data.target_type || !data.message) {
    throw new HttpError(400, "target_type and message required");
  }

  const report = await ReportModel.create({
    reporter_user_id: userId,
    target_type: data.target_type,
    club_id: data.club_id || null,
    activity_id: data.activity_id || null,
    post_id: data.post_id || null,
    message: data.message,
    status: "pending",
  });

  const supers = await UserModel.find({ role: "super-admin", is_active: true });
  for (const admin of supers) {
    await NotificationService.sendToUser(admin._id, {
      type: "new_report",
      title: "New report submitted",
      body: data.message.slice(0, 140),
      link_url: `/admin/reports/${report._id}`,
    });
  }

  return report;
}

async function reviewReport(superAdminId: string, reportId: string, decision: "reviewing" | "resolved" | "rejected", admin_note?: string) {
  const report = await ReportModel.findById(reportId);
  if (!report) throw new HttpError(404, "Report not found");

  report.status = decision;
  report.reviewed_by = superAdminId;
  report.admin_note = admin_note || "";
  await report.save();

  if (decision === "resolved" || decision === "rejected") {
    await NotificationService.sendToUser(report.reporter_user_id, {
      type: "report_resolved",
      title: "Your report was reviewed",
      body: `Status: ${decision}\nNote: ${admin_note || ""}`,
      link_url: `/reports/${report._id}`,
    });
  }

  await AuditLogService.log(
    superAdminId,
    "REVIEW_REPORT",
    "report",
    reportId,
    { decision, admin_note }
  );

  return report;
}

export const ReportService = {
  submitReport,
  reviewReport,
};
