import { NotificationModel } from "../models/Notification.model";
import { buildNotificationEmail } from "../utils/emailTemplate";
import { UserModel } from "../models/User.model";
import { ClubFollowerModel } from "../models/ClubFollower.model";
import { emitToUser } from "../configs/socket";
import { sendEmail } from "../configs/mailer";

async function sendToUser(userId: string, notif: {
  type: string;
  title: string;
  body?: string;
  link_url?: string;
}) {
  const doc = await NotificationModel.create({
    user_id: userId,
    type: notif.type,
    title: notif.title,
    body: notif.body,
    link_url: notif.link_url,
  });

  emitToUser(userId, "notification:new", {
    id: doc._id,
    type: doc.type,
    title: doc.title,
    body: doc.body,
    link_url: doc.link_url,
    created_at: doc.get("created_at"),
  });

  const user = await UserModel.findById(userId);
  if (user?.email) {
    const html = buildNotificationEmail(notif.title, notif.body, notif.link_url);
    sendEmail(user.email, `[EasyMake MFU] ${notif.title}`, html);
  }
}

async function broadcastToFollowers(clubId: string, notif: {
  type: string;
  title: string;
  body?: string;
  link_url?: string;
}) {
  const followers = await ClubFollowerModel.find({ club_id: clubId });
  for (const f of followers) {
    await sendToUser(f.user_id, notif);
  }
}

export const NotificationService = {
  sendToUser,
  broadcastToFollowers,
};
