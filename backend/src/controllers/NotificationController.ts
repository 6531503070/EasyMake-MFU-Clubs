import { Request, Response, NextFunction } from "express";
import { NotificationModel } from "../models/Notification.model";
import { HttpError } from "../utils/errors";

export const NotificationController = {
  listMyNotifications: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const list = await NotificationModel.find({ user_id: userId })
        .sort({ created_at: -1 })
        .limit(100);
      res.json({ notifications: list });
    } catch (err) {
      next(err);
    }
  },

  markAsRead: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const notif = await NotificationModel.findById(id);
      if (!notif) throw new HttpError(404, "Notification not found");
      if (notif.user_id !== userId) throw new HttpError(403, "Not yours");

      notif.is_read = true;
      await notif.save();
      res.json({ notification: notif });
    } catch (err) {
      next(err);
    }
  },
};
