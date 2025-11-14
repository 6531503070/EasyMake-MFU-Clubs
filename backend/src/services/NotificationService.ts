// src/services/NotificationService.ts
import { NotificationModel } from "../models/Notification.model";
import { buildNotificationEmail } from "../utils/emailTemplate";
import { UserModel } from "../models/User.model";
import { ClubFollowerModel } from "../models/ClubFollower.model";
import { emitToUser } from "../configs/socket";
import { sendEmail } from "../configs/mailer";
import { env } from "../configs/env";

type NotifInput = {
  type: string;
  title: string;
  body?: string;
  link_url?: string; // ส่วนใหญ่เราจะส่งเป็น path เช่น /user/club/xxx
};

// แปลง path -> absolute URL สำหรับอีเมล
function toAbsoluteLink(link?: string) {
  if (!link) return undefined;
  if (link.startsWith("http://") || link.startsWith("https://")) return link;
  // กรณีเป็น /user/... ก็ครอบด้วย PUBLIC_WEB_BASE
  return `${env.PUBLIC_WEB_BASE}${link}`;
}

async function sendToUser(userId: string, notif: NotifInput) {
  // 1) บันทึกลง Mongo
  const doc = await NotificationModel.create({
    user_id: userId,
    type: notif.type,
    title: notif.title,
    body: notif.body,
    link_url: notif.link_url, // เก็บเป็น path เดิม
  });

  // 2) emit real-time ไปยัง frontend
  emitToUser(userId, "notification:new", {
    id: doc._id,
    type: doc.type,
    title: doc.title,
    body: doc.body,
    link_url: doc.link_url,        // frontend เอาไป router.push() ได้เลย
    created_at: doc.get("created_at"),
    is_read: doc.is_read,
  });

  // 3) ส่งอีเมล
  const user = await UserModel.findById(userId).lean();
  if (user?.email) {
    const html = buildNotificationEmail(
      notif.title,
      notif.body,
      toAbsoluteLink(notif.link_url)   // แปลงเป็น URL เต็มเฉพาะในเมล
    );
    await sendEmail(user.email, `[EasyMake MFU] ${notif.title}`, html);
  }
}

async function broadcastToFollowers(clubId: string, notif: NotifInput) {
  const followers = await ClubFollowerModel.find({ club_id: clubId }).lean();
  for (const f of followers) {
    await sendToUser(String(f.user_id), notif);
  }
}

export const NotificationService = {
  sendToUser,
  broadcastToFollowers,
};
