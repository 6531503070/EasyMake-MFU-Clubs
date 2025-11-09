import { Request, Response, NextFunction } from "express";
import { ActivityService } from "../services/ActivityService";

export const ActivityController = {
  createActivity: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("[CREATE ACTIVITY] Headers:", req.headers);
      console.log("[CREATE ACTIVITY] Body:", req.body);

      // ตรวจสอบว่า req.files เป็น Express.Multer.File[] หรือไม่
      const files = req.files as Express.Multer.File[] | undefined;
      if (Array.isArray(files)) {
        console.log(
          "[CREATE ACTIVITY] Files:",
          files.map((f) => ({
            name: f.originalname,
            size: f.size,
            mimetype: f.mimetype,
          }))
        );
      } else {
        console.log("[CREATE ACTIVITY] Files: None or not an array");
      }

      const authorUserId = (req as any).user.id;
      const { clubId } = req.params;
      const activity = await ActivityService.createActivity(
        authorUserId,
        clubId,
        req.body,
        files || []
      );
      res.status(201).json({ activity });
    } catch (err) {
      console.error("[CREATE ACTIVITY ERROR]", err);
      next(err);
    }
  },

  updateStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updaterUserId = (req as any).user.id;
      const { id } = req.params;
      const { status } = req.body;
      const activity = await ActivityService.updateStatus(
        id,
        updaterUserId,
        status
      );
      res.json({ activity });
    } catch (err) {
      next(err);
    }
  },

  updateDetails: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updaterUserId = (req as any).user.id;
      const { id } = req.params;
      const patch = req.body;
      const files = (req.files as Express.Multer.File[]) || [];
      const activity = await ActivityService.updateDetails(
        id,
        updaterUserId,
        patch,
        files
      );
      res.json({ activity });
    } catch (err) {
      next(err);
    }
  },

  registerToActivity: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const reg = await ActivityService.registerToActivity(userId, id);
      res.json({ registration: reg });
    } catch (err) {
      next(err);
    }
  },

  unregisterFromActivity: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const reg = await ActivityService.unregisterFromActivity(userId, id);
      res.json({ registration: reg });
    } catch (err) {
      next(err);
    }
  },

  checkInUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const staffUserId = (req as any).user.id;
      const { regId } = req.params;
      const updated = await ActivityService.checkIn(regId, staffUserId);
      res.json({ registration: updated });
    } catch (err) {
      next(err);
    }
  },

  listActivitiesForClub: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const staffUserId = (req as any).user.id;
      const { clubId } = req.params;
      const activities = await ActivityService.listActivitiesForClub(
        staffUserId,
        clubId
      );
      res.json({ activities });
    } catch (err) {
      next(err);
    }
  },

  getActivityManageView: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const staffUserId = (req as any).user.id;
      const { id } = req.params;
      const resp = await ActivityService.getActivityManageView(staffUserId, id);
      res.json(resp);
    } catch (err) {
      next(err);
    }
  },
};
