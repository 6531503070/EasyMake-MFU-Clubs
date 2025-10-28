import { Request, Response, NextFunction } from "express";
import { ClubService } from "../services/ClubService";
import { AuditLogModel } from "../models/AuditLog.model";

export const AdminController = {
  createClubWithLeader: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const superAdminId = (req as any).user.id;
      const result = await ClubService.createClubWithLeader(
        superAdminId,
        req.body
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  updateClubWithLeader: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const superAdminId = (req as any).user.id;
      const { clubId } = req.params;
      const result = await ClubService.updateClubWithLeader(
        superAdminId,
        clubId,
        req.body
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  listAllClubs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clubs = await ClubService.listAllClubs();
      res.json({ clubs });
    } catch (err) {
      next(err);
    }
  },

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
      const club = await ClubService.suspendClub(
        superAdminId,
        clubId,
        reason || "Policy violation"
      );
      res.json({ club });
    } catch (err) {
      next(err);
    }
  },

  activateClub: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const superAdminId = (req as any).user.id;
      const { clubId } = req.params;
      const club = await ClubService.activateClub(superAdminId, clubId);
      res.json({ club });
    } catch (err) {
      next(err);
    }
  },

  listAuditLogs: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await AuditLogModel.find()
        .sort({ created_at: -1 })
        .limit(200);
      res.json({ logs });
    } catch (err) {
      next(err);
    }
  },

  deleteClub: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const superAdminId = (req as any).user.id;
      const { clubId } = req.params;
      const result = await ClubService.deleteClub(superAdminId, clubId);
      res.json({ success: true, club: result });
    } catch (err) {
      next(err);
    }
  },
};
