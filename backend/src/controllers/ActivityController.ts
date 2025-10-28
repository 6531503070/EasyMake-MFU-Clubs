import { Request, Response, NextFunction } from "express";
import { ActivityService } from "../services/ActivityService";

export const ActivityController = {
  createActivity: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorUserId = (req as any).user.id;
      const { clubId } = req.params;
      const activity = await ActivityService.createActivity(
        authorUserId,
        clubId,
        req.body
      );
      res.json({ activity });
    } catch (err) {
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

  // NEW: list of activities for this club (leader/staff dashboard view)
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

  // NEW: detail manage view for a single activity with roster
  getActivityManageView: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const staffUserId = (req as any).user.id;
      const { id } = req.params;
      const resp = await ActivityService.getActivityManageView(
        staffUserId,
        id
      );
      res.json(resp); // { activity, registeredCount, students }
    } catch (err) {
      next(err);
    }
  },
};
