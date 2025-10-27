import { Request, Response, NextFunction } from "express";
import { FollowService } from "../services/FollowService";

export const FollowController = {
  followClub: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { clubId } = req.params;
      const rel = await FollowService.followClub(userId, clubId);
      res.json({ follow: rel });
    } catch (err) {
      next(err);
    }
  },

  unfollowClub: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { clubId } = req.params;
      const rel = await FollowService.unfollowClub(userId, clubId);
      res.json({ unfollow: rel });
    } catch (err) {
      next(err);
    }
  },
};
