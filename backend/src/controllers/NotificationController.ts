import { Request, Response, NextFunction } from "express";
import { NotificationModel } from "../models/Notification.model";
import { HttpError } from "../utils/errors";

export const NotificationController = {
  listMyNotifications: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id as string;
      const { status } = req.query; // status = "all" | "read" | "unread"

      const filter: any = { user_id: userId };
      if (status === "read") filter.is_read = true;
      if (status === "unread") filter.is_read = false;

      const list = await NotificationModel.find(filter)
        .sort({ created_at: -1 })
        .limit(100)
        .lean();

      res.json({ notifications: list });
    } catch (err) {
      next(err);
    }
  },

  markAsRead: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id as string;
      const { id } = req.params;

      const notif = await NotificationModel.findById(id);
      if (!notif) throw new HttpError(404, "Notification not found");
      if (String(notif.user_id) !== String(userId)) {
        throw new HttpError(403, "Not yours");
      }

      notif.is_read = true;
      await notif.save();
      res.json({ notification: notif });
    } catch (err) {
      next(err);
    }
  },

  // ✅ เพิ่ม mark ทั้งหมดเป็นอ่านแล้ว
  markAllAsRead: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id as string;

      await NotificationModel.updateMany(
        { user_id: userId, is_read: false },
        { $set: { is_read: true } }
      );

      res.json({ ok: true });
    } catch (err) {
      next(err);
    }
  },
};
