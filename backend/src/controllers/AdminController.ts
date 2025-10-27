import { Request, Response, NextFunction } from "express";
import { ClubService } from "../services/ClubService";
import { AuditLogModel } from "../models/AuditLog.model";

export const AdminController = {
  approveClub: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const superAdminId = (req as any).user.id;
      const { clubId } = req.params;
      const club = await ClubService.approveClub(superAdminId, clubId);
      res.json({ club });
    } catch (err) {
      next(err);
    }
  },

  suspendClub: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const superAdminId = (req as any).user.id;
      const { clubId } = req.params;
      const { reason } = req.body;
      const club = await ClubService.suspendClub(superAdminId, clubId, reason || "Policy violation");
      res.json({ club });
    } catch (err) {
      next(err);
    }
  },

  listAuditLogs: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await AuditLogModel.find().sort({ created_at: -1 }).limit(200);
      res.json({ logs });
    } catch (err) {
      next(err);
    }
  },
};
