import { Request, Response, NextFunction } from "express";
import { ReportService } from "../services/ReportService";

export const ReportController = {
  submitReport: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const report = await ReportService.submitReport(userId, req.body);
      res.json({ report });
    } catch (err) {
      next(err);
    }
  },

  reviewReport: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const superAdminId = (req as any).user.id;
      const { id } = req.params;
      const { decision, admin_note } = req.body;
      const report = await ReportService.reviewReport(superAdminId, id, decision, admin_note);
      res.json({ report });
    } catch (err) {
      next(err);
    }
  },
};
