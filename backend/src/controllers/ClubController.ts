import { Request, Response, NextFunction } from "express";
import { ClubService } from "../services/ClubService";

export const ClubController = {
  createClub: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const leaderUserId = (req as any).user.id;
      const club = await ClubService.createClub(leaderUserId, req.body);
      res.json({ club });
    } catch (err) {
      next(err);
    }
  },

  getClubPublic: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clubId } = req.params;
      const club = await ClubService.getClubPublic(clubId);
      res.json({ club });
    } catch (err) {
      next(err);
    }
  },
};
